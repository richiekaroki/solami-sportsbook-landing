<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Game, BetSelection } from '$lib/types';
	import MarketButton from '$lib/components/ui/MarketButton.svelte';
	import Badge        from '$lib/components/ui/Badge.svelte';
	import TeamBadge    from '$lib/components/ui/TeamBadge.svelte';
	import { formatCountdown } from '$lib/utils/formatters';
	import { betSlip, MAX_SELECTIONS } from '$lib/stores/betslip';
	import { toasts }   from '$lib/stores/toast';
	import { trackOddsClick } from '$lib/utils/tracking';
	import { Zap, Gift } from 'lucide-svelte';

	interface Props { game: Game; }
	let { game }: Props = $props();

	const isUCL      = $derived(game.competition_id === 7);
	const matchLabel = $derived(`${game.home_team} vs ${game.away_team}`);
	const main1x2    = $derived(game.markets.find((m) => m.sub_type_id === 1));

	let countdownText = $state('');
	function updateCountdown() { countdownText = formatCountdown(game.start_time); }
	let countdownInterval: ReturnType<typeof setInterval>;
	onMount(() => {
		updateCountdown();
		countdownInterval = setInterval(updateCountdown, 30_000);
	});
	onDestroy(() => clearInterval(countdownInterval));

	function toggleBet(odd: { event_odd_id: number; outcome_alias: string; outcome_name: string; odd_value: number; }) {
		const selection: BetSelection = {
			oddId: odd.event_odd_id, matchLabel,
			competition: game.competition_name,
			market: '1x2', pick: odd.outcome_alias,
			outcome: odd.outcome_name, odds: odd.odd_value,
		};
		const wasSelected = betSlip.has(odd.event_odd_id);
		const added = betSlip.toggle(selection);
		if (!wasSelected) {
			if (!added) {
				toasts.show(`Max ${MAX_SELECTIONS} selections — remove one to add another`, 'info');
				return;
			}
			trackOddsClick(game.parent_match_id, '1x2', odd.outcome_alias, odd.odd_value);
			toasts.show(`${odd.outcome_alias} @ ${odd.odd_value.toFixed(2)} added`, 'add');
		} else {
			toasts.show(`${odd.outcome_alias} removed`, 'remove');
		}
	}
</script>

<div class="relative overflow-hidden rounded-2xl"
	style="background:linear-gradient(150deg, #0c1221 0%, #0e1628 40%, #0a0e18 100%); border:1px solid rgba(255,255,255,0.06);">

	<!-- Ambient glows -->
	<div class="pointer-events-none absolute inset-0">
		<div class="absolute top-0 left-1/4 w-80 h-44 rounded-full blur-[80px]"
			style="background:radial-gradient(circle, rgba(240,192,64,0.08) 0%, transparent 65%);"></div>
		<div class="absolute bottom-0 right-1/4 w-56 h-36 rounded-full blur-[60px]"
			style="background:radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 65%);"></div>
	</div>

	<!-- Header row -->
	<div class="relative flex items-center justify-between px-5 pt-4 pb-0">
		<Badge variant={isUCL ? 'ucl' : 'laliga'}>
			{isUCL ? 'CL' : 'LL'} {game.competition_name}
		</Badge>

		<div class="flex items-center gap-2">
			<span class="text-[9px] font-bold tracking-[0.8px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1"
				style="background:rgba(240,192,64,0.12); border:1px solid rgba(240,192,64,0.25); color:var(--color-gold);">
				<Zap size={10} />
				Boosted Odds
			</span>
			<span class="text-[10px] font-semibold tracking-[0.8px] uppercase flex items-center gap-1"
				style="color:var(--color-gold);">
				<span class="w-1.5 h-1.5 rounded-full animate-pulse-dot" style="background:var(--color-gold);"></span>
				Featured
			</span>
		</div>
	</div>

	<!-- Teams -->
	<div class="relative flex items-center justify-between px-6 sm:px-10 py-6 gap-4">
		<div class="flex flex-col items-center gap-3 flex-1 min-w-0">
			<TeamBadge name={game.home_team} size={64} />
			<span class="text-[14px] sm:text-[15px] font-semibold text-center leading-tight truncate w-full"
				style="color:var(--color-text);">
				{game.home_team}
			</span>
		</div>

		<div class="flex flex-col items-center gap-2 shrink-0">
			<span class="font-display text-[40px] leading-none tracking-[3px]"
				style="color:rgba(255,255,255,0.06);">VS</span>
			<div class="flex flex-col items-center gap-0.5">
				<span class="font-mono text-[9px] font-bold uppercase tracking-[1px]"
					style="color:var(--color-text-muted);">
					Kicks off in
				</span>
				<span class="font-mono text-[14px] font-bold"
					style="color:var(--color-gold);">{countdownText}</span>
			</div>
		</div>

		<div class="flex flex-col items-center gap-3 flex-1 min-w-0">
			<TeamBadge name={game.away_team} size={64} />
			<span class="text-[14px] sm:text-[15px] font-semibold text-center leading-tight truncate w-full"
				style="color:var(--color-text);">
				{game.away_team}
			</span>
		</div>
	</div>

	<!-- Odds row -->
	{#if main1x2}
		<div class="relative flex gap-2.5 px-5 pb-4">
			{#each main1x2.odds as odd (odd.event_odd_id)}
				<div class="flex-1">
					<MarketButton
						{odd}
						selected={$betSlip.has(odd.event_odd_id)}
						showDirection={true}
						onClick={() => toggleBet(odd)}
					/>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Bonus ribbon -->
	<div class="relative flex items-center gap-2 px-5 py-2.5 mx-0"
		style="background:rgba(34,197,94,0.05); border-top:1px solid rgba(34,197,94,0.10);">
		<Gift size={14} style="color:var(--color-green); flex-shrink:0;" />
		<span class="text-[11px] font-semibold" style="color:rgba(34,197,94,0.85);">
			New customers: Deposit KSh 100, get <strong>KSh 500 free</strong> on this match
		</span>
	</div>
</div>
