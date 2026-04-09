import { writable, derived, get } from 'svelte/store';
import type { BetSelection } from '$lib/types';
import { calcAccaOdds, calcPotentialWin } from '$lib/utils/odds-logic';

function createBetSlipStore() {
	const store = writable<Map<number, BetSelection>>(new Map());

	const { subscribe, update, set } = store;

	return {
		subscribe,

		toggle(selection: BetSelection) {
			update((current) => {
				const next = new Map(current);

				if (next.has(selection.oddId)) {
					next.delete(selection.oddId);
				} else {
					next.set(selection.oddId, selection);
				}

				return next;
			});
		},

		remove(oddId: number) {
			update((current) => {
				const next = new Map(current);
				next.delete(oddId);
				return next;
			});
		},

		clear() {
			set(new Map());
		},

		has(oddId: number): boolean {
			return get(store).has(oddId);
		}
	};
}

export const betSlip = createBetSlipStore();

export const selections = derived(betSlip, ($map) =>
	Array.from($map.values())
);

export const selectionCount = derived(betSlip, ($map) => $map.size);

export const totalOdds = derived(selections, ($selections) =>
	$selections.length
		? calcAccaOdds($selections.map((s) => s.odds))
		: 0
);

export const stake = writable<number>(100);

export const potentialWin = derived(
	[totalOdds, stake],
	([$odds, $stake]) => ($odds > 0 ? calcPotentialWin($stake, $odds) : 0)
);