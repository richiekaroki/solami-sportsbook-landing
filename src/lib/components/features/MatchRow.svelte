<script lang="ts">
	import MarketButton from '$lib/components/ui/MarketButton.svelte';
	import TeamBadge from '$lib/components/ui/TeamBadge.svelte';
	import { betSlip, MAX_SELECTIONS } from '$lib/stores/betslip';
	import { toasts } from '$lib/stores/toast';
	import type { BetSelection, Game } from '$lib/types';
	import { formatKickoff } from '$lib/utils/formatters';
	import { estimateBetCount } from '$lib/utils/odds-logic';
	import { trackOddsClick } from '$lib/utils/tracking';
	import { Flame } from 'lucide-svelte';

	interface Props {
		game: Game;
	}
	let { game }: Props = $props();

	const matchLabel = $derived(`${game.home_team} vs ${game.away_team}`);
	const main1x2 = $derived(game.markets.find((m) => m.sub_type_id === 1));
	const doubleChance = $derived(game.markets.find((m) => m.sub_type_id === 10));
	const ggng = $derived(game.markets.find((m) => m.sub_type_id === 29));

	const betCount = $derived(estimateBetCount(game.total_markets));
	const allOddIds = $derived([
		...(main1x2?.odds.map((o) => o.event_odd_id) ?? []),
		...(doubleChance?.odds.map((o) => o.event_odd_id) ?? []),
		...(ggng?.odds.map((o) => o.event_odd_id) ?? [])
	]);
	const rowSelected = $derived(allOddIds.some((id) => $betSlip.has(id)));

	let focusIndex = $state(-1);
	let rowEl: HTMLDivElement | undefined = $state();

	function handleRowKeydown(e: KeyboardEvent) {
		if (!rowEl) return;
		const buttons = rowEl.querySelectorAll<HTMLButtonElement>('button[aria-label]');
		if (buttons.length === 0) return;

		const target = (e.target as HTMLElement)?.closest?.(
			'button[aria-label]'
		) as HTMLButtonElement | null;
		const idx = target ? [...buttons].indexOf(target) : -1;
		if (idx >= 0) focusIndex = idx;

		if (e.key === 'ArrowRight') {
			e.preventDefault();
			const next = focusIndex < 0 ? 0 : Math.min(focusIndex + 1, buttons.length - 1);
			focusIndex = next;
			buttons[next].focus();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			focusIndex = Math.max(focusIndex - 1, 0);
			buttons[focusIndex].focus();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			const nextRow = rowEl.nextElementSibling;
			if (nextRow) {
				const nextButtons = nextRow.querySelectorAll<HTMLButtonElement>('button[aria-label]');
				const target = nextButtons[Math.min(focusIndex, nextButtons.length - 1)];
				if (target) target.focus();
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			const prevRow = rowEl.previousElementSibling;
			if (prevRow) {
				const prevButtons = prevRow.querySelectorAll<HTMLButtonElement>('button[aria-label]');
				const target = prevButtons[Math.min(focusIndex, prevButtons.length - 1)];
				if (target) target.focus();
			}
		}
	}

	function rowKeyNav(node: HTMLDivElement) {
		node.addEventListener('keydown', handleRowKeydown);
		return {
			destroy() {
				node.removeEventListener('keydown', handleRowKeydown);
			}
		};
	}

	function toggle(
		oddId: number,
		alias: string,
		outcomeName: string,
		oddValue: number,
		market: string
	) {
		const sel: BetSelection = {
			oddId,
			matchLabel,
			competition: game.competition_name,
			pick: alias,
			outcome: outcomeName,
			odds: oddValue,
			market
		};
		const was = betSlip.has(oddId);
		const added = betSlip.toggle(sel);
		if (!was) {
			if (!added) {
				toasts.show(`Max ${MAX_SELECTIONS} selections — remove one to add another`, 'info');
				return;
			}
			trackOddsClick(game.parent_match_id, market, alias, oddValue);
			toasts.show(`${alias} @ ${oddValue.toFixed(2)} added`, 'add');
		} else {
			toasts.show(`${alias} removed`, 'remove');
		}
	}
</script>

<div
	bind:this={rowEl}
	use:rowKeyNav
	role="row"
	tabindex="-1"
	class="flex items-center gap-0 px-3 hover-row"
	style="
		min-height:54px;
		border-bottom:1px solid rgba(255,255,255,0.03);
		background:{rowSelected ? 'rgba(240,192,64,0.06)' : 'transparent'};
	"
>
	<!-- Teams + time + bet count -->
	<div class="shrink-0 pr-3 py-2" style="width:168px; min-width:168px;">
		<div class="flex items-center gap-1.5 mb-0.5">
			<TeamBadge name={game.home_team} size={16} />
			<span
				class="text-[12px] font-semibold leading-none truncate"
				style="color:var(--color-text); max-width:130px;"
			>
				{game.home_team}
			</span>
		</div>
		<div class="flex items-center gap-1.5 mb-1">
			<TeamBadge name={game.away_team} size={16} />
			<span
				class="text-[12px] font-semibold leading-none truncate"
				style="color:var(--color-text); max-width:130px;"
			>
				{game.away_team}
			</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="font-mono text-[10px]" style="color:var(--color-text-muted);"
				>{formatKickoff(game.start_time)}</span
			>
			<span
				class="text-[9px] font-semibold flex items-center gap-0.5"
				style="color:var(--color-text-muted);"
			>
				<Flame size={10} />
				{betCount}
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
					onClick={() =>
						toggle(odd.event_odd_id, odd.outcome_alias, odd.outcome_name, odd.odd_value, '1x2')}
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
					onClick={() =>
						toggle(
							odd.event_odd_id,
							odd.outcome_alias,
							odd.outcome_name,
							odd.odd_value,
							'double_chance'
						)}
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
					onClick={() =>
						toggle(odd.event_odd_id, odd.outcome_alias, odd.outcome_name, odd.odd_value, 'ggng')}
				/>
			{/each}
		</div>
	{/if}

	<div class="flex-1"></div>
</div>
