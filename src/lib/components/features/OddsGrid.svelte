<script lang="ts">
	import type { Game, BetSelection } from '$lib/types';
	import MarketButton from '$lib/components/ui/MarketButton.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import TeamBadge from '$lib/components/ui/TeamBadge.svelte';
	import { formatKickoff } from '$lib/utils/formatters';
	import { betSlip } from '$lib/stores/betslip';
	import { toasts } from '$lib/stores/toast';

	interface Props {
		game: Game;
	}

	let { game }: Props = $props();

	const isUCL = $derived(game.competition_id === 7);
	const matchLabel = $derived(`${game.home_team} vs ${game.away_team}`);
	const main1x2 = $derived(game.markets.find((m) => m.sub_type_id === 1));

	function toggleBet(odd: {
		event_odd_id: number;
		outcome_alias: string;
		outcome_name: string;
		odd_value: number;
	}) {
		const selection: BetSelection = {
			oddId: odd.event_odd_id,
			matchLabel,
			competition: game.competition_name,
			pick: odd.outcome_alias,
			outcome: odd.outcome_name,
			odds: odd.odd_value
		};

		const alreadySelected = betSlip.has(odd.event_odd_id);
		betSlip.toggle(selection);

		if (!alreadySelected) {
			toasts.show(`${odd.outcome_alias} added`, 'add');
		} else {
			toasts.show(`${odd.outcome_alias} removed`, 'remove');
		}
	}
</script>

<div
	class="relative overflow-hidden rounded-xl bg-[#12141a]"
	style="border:1px solid rgba(255,255,255,0.07);"
>
	<div class="pointer-events-none absolute inset-0">
		<div
			class="absolute top-0 left-1/4 w-72 h-40 rounded-full blur-3xl opacity-60"
			style="background: radial-gradient(circle, rgba(245,200,66,0.07) 0%, transparent 70%)"
		></div>
	</div>

	<div class="relative flex items-center justify-between px-5 pt-4">
		<Badge variant={isUCL ? 'ucl' : 'laliga'}>
			{isUCL ? '⭐' : '🇪🇸'} {game.competition_name}
		</Badge>

		<span
			class="text-[11px] font-semibold tracking-[1px] uppercase flex items-center gap-1.5 text-[#f5c842]"
		>
			<span
				class="w-1.5 h-1.5 rounded-full bg-[#f5c842] animate-pulse-dot"
			></span>
			Featured
		</span>
	</div>

	<div class="relative flex items-center justify-between px-6 sm:px-10 py-6 gap-4">
		<div class="flex flex-col items-center gap-3 flex-1">
			<TeamBadge name={game.home_team} size={56} />
			<span class="text-[15px] font-semibold text-white text-center">
				{game.home_team}
			</span>
		</div>

		<div class="flex flex-col items-center gap-1 shrink-0">
			<span class="font-display text-[38px] tracking-[2px] text-white/10">
				VS
			</span>
			<span class="font-mono text-[11px] font-semibold tracking-[1px] text-[#f5c842]">
				{formatKickoff(game.start_time).toUpperCase()}
			</span>
		</div>

		<div class="flex flex-col items-center gap-3 flex-1">
			<TeamBadge name={game.away_team} size={56} />
			<span class="text-[15px] font-semibold text-white text-center">
				{game.away_team}
			</span>
		</div>
	</div>

	{#if main1x2}
		<div class="relative flex gap-2.5 px-5 pb-5">
			{#each main1x2.odds as odd (odd.event_odd_id)}
				<div class="flex-1">
					<MarketButton
						{odd}
						selected={$betSlip.has(odd.event_odd_id)}
						onClick={() => toggleBet(odd)}
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>