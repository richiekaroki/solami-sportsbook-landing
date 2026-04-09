<script lang="ts">
	import type { Game, BetSelection } from '$lib/types';
	import MarketButton from '$lib/components/ui/MarketButton.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import TeamBadge from '$lib/components/ui/TeamBadge.svelte';
	import { ChevronRight } from 'lucide-svelte';
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
	const ggng = $derived(game.markets.find((m) => m.sub_type_id === 29));

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

<article
	class="overflow-hidden rounded-xl transition-all duration-200 hover:translate-y-[-1px]"
	style="background:#12141a; border:1px solid rgba(255,255,255,0.07);"
>
	<div
		class="flex items-center justify-between px-3.5 py-2"
		style="background:rgba(255,255,255,0.02); border-bottom:1px solid rgba(255,255,255,0.05);"
	>
		<Badge variant={isUCL ? 'ucl' : 'laliga'} size="sm">
			{isUCL ? '⭐' : '🇪🇸'} {game.competition_name}
		</Badge>

		<span class="font-mono text-[10px] text-[#5a5f72]">
			{formatKickoff(game.start_time)}
		</span>
	</div>

	<div class="flex items-center gap-3 px-3.5 py-3">
		<div class="flex-1 min-w-0 flex flex-col gap-1.5">
			<div class="flex items-center gap-2.5">
				<TeamBadge name={game.home_team} size={22} />
				<span class="text-[13px] font-medium truncate text-[#e8eaf0]">
					{game.home_team}
				</span>
			</div>

			<div class="flex items-center gap-2.5">
				<TeamBadge name={game.away_team} size={22} />
				<span class="text-[13px] font-medium truncate text-[#e8eaf0]">
					{game.away_team}
				</span>
			</div>

			<div class="text-[10px] font-medium mt-0.5 text-[#5a5f72]">
				+{game.total_markets} markets
			</div>
		</div>

		{#if main1x2}
			<div class="flex gap-1.5 shrink-0">
				{#each main1x2.odds as odd (odd.event_odd_id)}
					<MarketButton
						{odd}
						selected={$betSlip.has(odd.event_odd_id)}
						onClick={() => toggleBet(odd)}
					/>
				{/each}
			</div>
		{/if}
	</div>

	{#if ggng}
		<div
			class="flex items-center gap-3 px-3.5 pb-3 border-t border-white/5 pt-[10px]"
		>
			<span
				class="text-[10px] font-bold uppercase tracking-[0.8px] shrink-0 text-[#5a5f72]"
			>
				Both Score
			</span>

			<div class="flex gap-1.5">
				{#each ggng.odds as odd (odd.event_odd_id)}
					<MarketButton
						{odd}
						selected={$betSlip.has(odd.event_odd_id)}
						onClick={() => toggleBet(odd)}
					/>
				{/each}
			</div>
		</div>
	{/if}

	<button
		class="w-full flex items-center justify-end gap-1 px-3.5 py-2 text-[10px] font-semibold text-[#5a5f72]"
		style="border-top:1px solid rgba(255,255,255,0.05);"
	>
		+{game.total_markets - 3} more markets
		<ChevronRight size={11} />
	</button>
</article>