<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Game, BetSelection } from '$lib/types';
	import MarketButton from '$lib/components/ui/MarketButton.svelte';
	import Badge        from '$lib/components/ui/Badge.svelte';
	import TeamBadge    from '$lib/components/ui/TeamBadge.svelte';
	import { formatCountdown } from '$lib/utils/formatters';
	import { betSlip }  from '$lib/stores/betslip';
	import { toasts }   from '$lib/stores/toast';
	import { trackOddsClick } from '$lib/utils/tracking';

	interface Props { game: Game; }
	let { game }: Props = $props();

	const isUCL      = $derived(game.competition_id === 7);
	const matchLabel = $derived(`${game.home_team} vs ${game.away_team}`);
	const main1x2    = $derived(game.markets.find((m) => m.sub_type_id === 1));

	// Live countdown
	let countdownTick = $state(0);
	const countdown = $derived(formatCountdown(game.start_time));
	let countdownInterval: ReturnType<typeof setInterval>;
	onMount(() => {
		countdownInterval = setInterval(() => { countdownTick++; }, 30_000);
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
		betSlip.toggle(selection);
		if (!wasSelected) {
			trackOddsClick(game.parent_match_id, '1x2', odd.outcome_alias, odd.odd_value);
			toasts.show(`${odd.outcome_alias} @ ${odd.odd_value.toFixed(2)} added`, 'add');
		} else {
			toasts.show(`${odd.outcome_alias} removed`, 'remove');
		}
	}
</script>

<div class="relative overflow-hidden rounded-2xl" id="featured"
	style="background:linear-gradient(135deg, #0b1628 0%, #0d1420 50%, #0a1010 100%); border:1px solid rgba(255,255,255,0.08);">

	<!-- Ambient glows -->
	<div class="pointer-events-none absolute inset-0">
		<div class="absolute top-0 left-1/4 w-80 h-44 rounded-full blur-3xl"
			style="background:radial-gradient(circle, rgba(245,200,66,0.07) 0%, transparent 70%);"></div>
		<div class="absolute bottom-0 right-1/4 w-56 h-36 rounded-full blur-2xl"
			style="background:radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%);"></div>
	</div>

	<!-- Header row -->
	<div class="relative flex items-center justify-between px-5 pt-4 pb-0">
		<Badge variant={isUCL ? 'ucl' : 'laliga'}>
			{isUCL ? '⭐' : '🇪🇸'} {game.competition_name}
		</Badge>

		<div class="flex items-center gap-2">
			<!-- Boosted chip -->
			<span class="text-[9px] font-bold tracking-[0.8px] uppercase px-2 py-0.5 rounded-full"
				style="background:rgba(245,200,66,0.15); border:1px solid rgba(245,200,66,0.3); color:#f5c842;">
				⚡ Boosted Odds
			</span>
			<!-- Featured badge -->
			<span class="text-[10px] font-semibold tracking-[0.8px] uppercase flex items-center gap-1"
				style="color:#f5c842;">
				<span class="w-1.5 h-1.5 rounded-full bg-[#f5c842] animate-pulse-dot"></span>
				Featured
			</span>
		</div>
	</div>

	<!-- Teams -->
	<div class="relative flex items-center justify-between px-6 sm:px-10 py-5 gap-4">
		<div class="flex flex-col items-center gap-2.5 flex-1">
			<TeamBadge name={game.home_team} size={60} />
			<span class="text-[14px] sm:text-[15px] font-semibold text-white text-center leading-tight">
				{game.home_team}
			</span>
		</div>

		<div class="flex flex-col items-center gap-2 shrink-0">
			<span class="font-display text-[36px] leading-none tracking-[2px]"
				style="color:rgba(255,255,255,0.08);">VS</span>
			<!-- Countdown -->
			<div class="flex flex-col items-center gap-0.5">
				<span class="font-mono text-[10px] font-bold uppercase tracking-[0.8px]" style="color:#4d5568;">
					Kicks off in
				</span>
				<span class="font-mono text-[14px] font-bold" style="color:#f5c842;">{countdown}</span>
			</div>
		</div>

		<div class="flex flex-col items-center gap-2.5 flex-1">
			<TeamBadge name={game.away_team} size={60} />
			<span class="text-[14px] sm:text-[15px] font-semibold text-white text-center leading-tight">
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
		style="background:rgba(34,197,94,0.06); border-top:1px solid rgba(34,197,94,0.12);">
		<span class="text-sm">🎁</span>
		<span class="text-[11px] font-semibold" style="color:rgba(34,197,94,0.9);">
			New customers: Deposit KSh 100, get <strong>KSh 500 free</strong> on this match
		</span>
	</div>
</div>
