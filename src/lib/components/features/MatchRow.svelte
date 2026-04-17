<script lang="ts">
	import MarketButton from '$lib/components/ui/MarketButton.svelte';
	import TeamBadge from '$lib/components/ui/TeamBadge.svelte';
	import { betSlip } from '$lib/stores/betslip';
	import { toasts } from '$lib/stores/toast';
	import type { BetSelection, Game } from '$lib/types';
	import { formatKickoff } from '$lib/utils/formatters';
	import { estimateBetCount } from '$lib/utils/odds-logic';
	import { trackOddsClick } from '$lib/utils/tracking';

	interface Props { game: Game; }
	let { game }: Props = $props();

	const matchLabel   = $derived(`${game.home_team} vs ${game.away_team}`);
	const main1x2      = $derived(game.markets.find((m) => m.sub_type_id === 1));
	const doubleChance = $derived(game.markets.find((m) => m.sub_type_id === 10));
	const ggng         = $derived(game.markets.find((m) => m.sub_type_id === 29));

	// Stable bet count — computed once from initial prop (props are stable per row instance)
	const betCount = $derived(estimateBetCount(game.total_markets));
	// Detect if any selected odd in this row is in the slip (for row highlight)
	const allOddIds = $derived([
		...(main1x2?.odds.map(o => o.event_odd_id) ?? []),
		...(doubleChance?.odds.map(o => o.event_odd_id) ?? []),
		...(ggng?.odds.map(o => o.event_odd_id) ?? []),
	]);
	const rowSelected = $derived(allOddIds.some(id => $betSlip.has(id)));

	function toggle(oddId: number, alias: string, outcomeName: string, oddValue: number, market: string) {
		const sel: BetSelection = {
			oddId, matchLabel, competition: game.competition_name,
			pick: alias, outcome: outcomeName, odds: oddValue, market,
		};
		const was = betSlip.has(oddId);
		betSlip.toggle(sel);
		if (!was) {
			trackOddsClick(game.parent_match_id, market, alias, oddValue);
			toasts.show(`${alias} @ ${oddValue.toFixed(2)} added`, 'add');
		} else {
			toasts.show(`${alias} removed`, 'remove');
		}
	}
</script>

<div
	role="row"
	tabindex="0"
	class="flex items-center gap-0 px-3 transition-all duration-150"
	style="
		min-height:54px;
		border-bottom:1px solid rgba(255,255,255,0.04);
		background:{rowSelected ? 'rgba(245,200,66,0.03)' : 'transparent'};
		border-left:2px solid {rowSelected ? 'rgba(245,200,66,0.3)' : 'transparent'};
	"
	onmouseenter={(e) => { if (!rowSelected) (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.018)'; }}
	onmouseleave={(e) => { if (!rowSelected) (e.currentTarget as HTMLElement).style.background='transparent'; }}
>
	<!-- Teams + time + bet count -->
	<div class="shrink-0 pr-3 py-2" style="width:168px; min-width:168px;">
		<div class="flex items-center gap-1.5 mb-0.5">
			<TeamBadge name={game.home_team} size={16} />
			<span class="text-[12px] font-semibold leading-none truncate" style="color:#e4e8f0; max-width:130px;">
				{game.home_team}
			</span>
		</div>
		<div class="flex items-center gap-1.5 mb-1">
			<TeamBadge name={game.away_team} size={16} />
			<span class="text-[12px] font-semibold leading-none truncate" style="color:#e4e8f0; max-width:130px;">
				{game.away_team}
			</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="font-mono text-[10px]" style="color:#4d5568;">{formatKickoff(game.start_time)}</span>
			<span class="text-[9px] font-semibold flex items-center gap-0.5" style="color:#4d5568;">
				🔥 {betCount}
			</span>
		</div>
	</div>

	<!-- 1X2 -->
	{#if main1x2}
		<div class="flex gap-1 shrink-0 py-2">
			{#each main1x2.odds as odd (odd.event_odd_id)}
				<MarketButton
					{odd}
					selected={$betSlip.has(odd.event_odd_id)}
					showDirection={true}
					onClick={() => toggle(odd.event_odd_id, odd.outcome_alias, odd.outcome_name, odd.odd_value, '1x2')}
				/>
			{/each}
		</div>
	{/if}

	<div class="mx-1.5 shrink-0 w-px h-7" style="background:rgba(255,255,255,0.05);"></div>

	<!-- Double Chance -->
	{#if doubleChance}
		<div class="flex gap-1 shrink-0 py-2">
			{#each doubleChance.odds as odd (odd.event_odd_id)}
				<MarketButton
					{odd}
					selected={$betSlip.has(odd.event_odd_id)}
					compactLabel={true}
					showDirection={false}
					onClick={() => toggle(odd.event_odd_id, odd.outcome_alias, odd.outcome_name, odd.odd_value, 'double_chance')}
				/>
			{/each}
		</div>
		<div class="mx-1.5 shrink-0 w-px h-7" style="background:rgba(255,255,255,0.05);"></div>
	{/if}

	<!-- GG/NG -->
	{#if ggng}
		<div class="flex gap-1 shrink-0 py-2">
			{#each ggng.odds as odd (odd.event_odd_id)}
				<MarketButton
					{odd}
					selected={$betSlip.has(odd.event_odd_id)}
					showDirection={false}
					onClick={() => toggle(odd.event_odd_id, odd.outcome_alias, odd.outcome_name, odd.odd_value, 'ggng')}
				/>
			{/each}
		</div>
	{/if}

	<div class="flex-1"></div>

	<!-- More markets -->
	<button
		class="shrink-0 flex flex-col items-center justify-center rounded-lg ml-1.5 cursor-pointer transition-all duration-150"
		style="width:44px; height:40px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);"
		onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(245,200,66,0.35)'; el.style.background='rgba(245,200,66,0.06)'; }}
		onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,255,255,0.07)'; el.style.background='rgba(255,255,255,0.04)'; }}
		onclick={() => toasts.show(`${game.total_markets} markets — coming soon!`, 'info')}
	>
		<span class="text-[10px] font-bold leading-none" style="color:#8892a4;">{game.total_markets}+</span>
		<span class="text-[9px] leading-none mt-0.5" style="color:#4d5568;">More</span>
	</button>
</div>
