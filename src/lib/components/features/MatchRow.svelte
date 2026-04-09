<script lang="ts">
	import MarketButton from '$lib/components/ui/MarketButton.svelte';
	import TeamBadge from '$lib/components/ui/TeamBadge.svelte';
	import { betSlip } from '$lib/stores/betslip';
	import { toasts } from '$lib/stores/toast';
	import type { BetSelection, Game } from '$lib/types';
	import { formatKickoff } from '$lib/utils/formatters';

	interface Props { game: Game; }
	let { game }: Props = $props();

	const matchLabel  = $derived(`${game.home_team} vs ${game.away_team}`);
	const main1x2     = $derived(game.markets.find((m) => m.sub_type_id === 1));
	const doubleChance= $derived(game.markets.find((m) => m.sub_type_id === 10));
	const ggng        = $derived(game.markets.find((m) => m.sub_type_id === 29));

	function toggle(oddId: number, alias: string, outcomeName: string, oddValue: number, market: string) {
		const selection: BetSelection = {
			oddId, matchLabel,
			competition: game.competition_name,
			pick: alias, outcome: outcomeName,
			odds: oddValue, market,
		};
		const wasSelected = betSlip.has(oddId);
		betSlip.toggle(selection);
		if (!wasSelected) {
			toasts.show(`${alias} @ ${oddValue.toFixed(2)} added`, 'add');
		} else {
			toasts.show(`${alias} removed`, 'remove');
		}
	}
</script>

<!-- Main row container -->
<div class="flex items-start gap-0 px-3 transition-colors duration-100 group hover:bg-white/2"
	style="min-height:52px; border-bottom:1px solid rgba(255,255,255,0.04);"
>
	<!-- Teams + badges + time (fixed width, doesn't scroll) -->
	<div class="shrink-0 pr-3 py-2" style="width:140px; min-width:140px;">
		<div class="flex items-center gap-1.5 mb-1">
			<TeamBadge name={game.home_team} size={16} />
			<span class="text-[12px] font-semibold leading-none truncate" style="color:#e4e8f0; max-width:100px;">
				{game.home_team}
			</span>
		</div>
		<div class="flex items-center gap-1.5 mb-1.5">
			<TeamBadge name={game.away_team} size={16} />
			<span class="text-[12px] font-semibold leading-none truncate" style="color:#e4e8f0; max-width:100px;">
				{game.away_team}
			</span>
		</div>
		<div class="text-[10px] font-mono" style="color:#4d5568;">
			{formatKickoff(game.start_time)}
		</div>
	</div>

	<!-- SCROLLABLE ODDS CONTAINER - Add this wrapper -->
	<div class="flex-1 overflow-x-auto overflow-y-hidden py-2" style="scrollbar-width: thin;">
		<div class="flex items-center gap-0 min-w-min">
			<!-- 1X2 -->
			{#if main1x2}
				<div class="flex gap-1 shrink-0">
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

			{#if main1x2}
				<div class="mx-1.5 shrink-0 w-px h-7" style="background:rgba(255,255,255,0.05);"></div>
			{/if}

			<!-- Double Chance -->
			{#if doubleChance}
				<div class="flex gap-1 shrink-0">
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
			{/if}

			{#if doubleChance}
				<div class="mx-1.5 shrink-0 w-px h-7" style="background:rgba(255,255,255,0.05);"></div>
			{/if}

			<!-- GG/NG -->
			{#if ggng}
				<div class="flex gap-1 shrink-0">
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
		</div>
	</div>

	<!-- More markets button (fixed, doesn't scroll) -->
	<button
		class="shrink-0 flex flex-col items-center justify-center rounded-lg ml-1.5 transition-all duration-150 cursor-pointer group/more"
		style="width:44px; height:40px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);"
		onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.borderColor='rgba(245,200,66,0.35)'; (e.currentTarget as HTMLElement).style.background='rgba(245,200,66,0.06)'; }}
		onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)'; }}
		onclick={() => toasts.show(`${game.total_markets} markets — coming soon!`, 'info')}
	>
		<span class="text-[10px] font-bold leading-none" style="color:#8892a4;">{game.total_markets}+</span>
		<span class="text-[9px] leading-none mt-0.5" style="color:#4d5568;">More</span>
	</button>
</div>