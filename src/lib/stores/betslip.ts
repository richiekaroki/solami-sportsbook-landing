import { writable, derived, get } from 'svelte/store';
import type { BetSelection } from '$lib/types';
import { calcAccaOdds, calcPotentialWin, calcKenyaTax } from '$lib/utils/odds-logic';

const MIN_STAKE = 10;
const MAX_STAKE = 500_000;
const MAX_SELECTIONS = 20;

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
					if (next.size >= MAX_SELECTIONS) return current;
					// Remove existing pick from same match + same market
					for (const [id, sel] of next) {
						if (sel.matchLabel === selection.matchLabel && sel.market === selection.market) {
							next.delete(id);
						}
					}
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

		clear() { set(new Map()); },

		has(oddId: number): boolean {
			return get(store).has(oddId);
		}
	};
}

export const betSlip        = createBetSlipStore();
export const selections     = derived(betSlip, ($m) => [...$m.values()]);
export const selectionCount = derived(betSlip, ($m) => $m.size);
export const totalOdds      = derived(selections, ($s) => $s.length ? calcAccaOdds($s.map(s => s.odds)) : 0);
export const stake          = writable<number>(100);
export const potentialWin   = derived([totalOdds, stake], ([$o, $s]) => $o > 0 ? calcPotentialWin($s, $o) : 0);

/** Full Kenya tax breakdown — drives betslip payout display */
export const taxBreakdown = derived([totalOdds, stake], ([$o, $s]) => {
	if ($o === 0) return null;
	return calcKenyaTax($s, $o);
});

export { MIN_STAKE, MAX_STAKE, MAX_SELECTIONS };
