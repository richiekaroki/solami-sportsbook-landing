<script lang="ts">
	import MarketButton from '$lib/components/ui/MarketButton.svelte';
	import { betSlip } from '$lib/stores/betslip';
	import { toasts } from '$lib/stores/toast';
	import type { BetSelection, Game } from '$lib/types';
	import { formatKickoff } from '$lib/utils/formatters';

	interface Props {
		game: Game;
	}

	let { game }: Props = $props();

	const matchLabel = $derived(`${game.home_team} vs ${game.away_team}`);

	const main1x2 = $derived(
		game.markets.find((m) => m.sub_type_id === 1)
	);

	const doubleChance = $derived(
		game.markets.find((m) => m.sub_type_id === 10)
	);

	const ggng = $derived(
		game.markets.find((m) => m.sub_type_id === 29)
	);

	function toggle(
		oddId: number,
		alias: string,
		outcomeName: string,
		oddValue: number
	) {
		const selection: BetSelection = {
			oddId,
			matchLabel,
			competition: game.competition_name,
			pick: alias,
			outcome: outcomeName,
			odds: oddValue
		};

		const alreadySelected = betSlip.has(oddId);

		betSlip.toggle(selection);

		if (!alreadySelected) {
			toasts.show(`${alias} @ ${oddValue.toFixed(2)} added`, 'add');
		} else {
			toasts.show(`${alias} removed`, 'remove');
		}
	}
</script>

<div
	class="flex items-center gap-0 py-2.5 px-0 transition-colors duration-100 hover:bg-white/2"
	style="border-bottom:1px solid rgba(255,255,255,0.05);"
>
	<!-- Teams -->
	<div class="shrink-0 pr-3" style="width:160px; min-width:160px;">
		<div class="text-[12px] font-semibold leading-tight text-[#e8eaf0]">
			{game.home_team}
		</div>
		<div class="text-[12px] font-semibold leading-tight text-[#e8eaf0]">
			{game.away_team}
		</div>
		<div class="text-[10px] mt-1 text-[#5a5f72]">
			{formatKickoff(game.start_time)}
		</div>
	</div>

	<!-- 1X2 -->
	{#if main1x2}
		<div class="flex gap-1 shrink-0">
			{#each main1x2.odds as odd (odd.event_odd_id)}
				<MarketButton
					{odd}
					selected={$betSlip.has(odd.event_odd_id)}
					showDirection={true}
					onClick={() =>
						toggle(
							odd.event_odd_id,
							odd.outcome_alias,
							odd.outcome_name,
							odd.odd_value
						)}
				/>
			{/each}
		</div>
	{/if}

	<div class="mx-1.5 shrink-0 w-px h-8 bg-white/5"></div>

	<!-- Double Chance -->
	{#if doubleChance}
		<div class="flex gap-1 shrink-0">
			{#each doubleChance.odds as odd (odd.event_odd_id)}
				<MarketButton
					{odd}
					selected={$betSlip.has(odd.event_odd_id)}
					compactLabel={true}
					showDirection={false}
					onClick={() =>
						toggle(
							odd.event_odd_id,
							odd.outcome_alias,
							odd.outcome_name,
							odd.odd_value
						)}
				/>
			{/each}
		</div>
	{/if}

	{#if doubleChance}
		<div class="mx-1.5 shrink-0 w-px h-8 bg-white/5"></div>
	{/if}

	<!-- GG/NG -->
	{#if ggng}
		<div class="flex gap-1 shrink-0">
			{#each ggng.odds as odd (odd.event_odd_id)}
				<MarketButton
					{odd}
					selected={$betSlip.has(odd.event_odd_id)}
					showDirection={false}
					onClick={() =>
						toggle(
							odd.event_odd_id,
							odd.outcome_alias,
							odd.outcome_name,
							odd.odd_value
						)}
				/>
			{/each}
		</div>
	{/if}

	<div class="flex-1"></div>

	<!-- More -->
	<button
		class="shrink-0 flex flex-col items-center justify-center rounded-lg ml-1.5 transition-all duration-150"
		style="
			width:44px;
			height:40px;
			background:#1c1f29;
			border:1px solid rgba(255,255,255,0.07);
		"
		onclick={() =>
			toasts.show(`${game.total_markets} markets — coming soon!`, 'info')}
	>
		<span class="text-[10px] font-bold text-[#8b909f]">
			{game.total_markets}+
		</span>
		<span class="text-[9px] text-[#5a5f72]">More</span>
	</button>
</div>