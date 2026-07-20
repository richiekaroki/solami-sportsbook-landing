import { writable, derived, get } from 'svelte/store';
import type { BetSelection } from '$lib/types';
import { calcAccaOdds, calcPotentialWin, calcKenyaTax } from '$lib/utils/odds-logic';

const MIN_STAKE = 10;
const MAX_STAKE = 500_000;
const MAX_SELECTIONS = 20;
const STORAGE_KEY = 'wam_betslip';

/** Read saved selections from localStorage (SSR-safe) */
function loadFromStorage(): Map<number, BetSelection> {
	if (typeof localStorage === 'undefined') return new Map();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Map();
		const entries: [number, BetSelection][] = JSON.parse(raw);
		return new Map(entries);
	} catch {
		return new Map();
	}
}

/** Persist current map to localStorage */
function saveToStorage(map: Map<number, BetSelection>): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...map.entries()]));
	} catch {
		// Storage quota exceeded or private browsing — fail silently
	}
}

function createBetSlipStore() {
	const store = writable<Map<number, BetSelection>>(loadFromStorage());
	const { subscribe, update, set } = store;

	// Persist every change to localStorage
	subscribe((map) => saveToStorage(map));

	return {
		subscribe,

		toggle(selection: BetSelection): boolean {
			let added = false;
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
					added = true;
				}
				return next;
			});
			return added;
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
export const selections = derived(betSlip, ($m) => [...$m.values()]);
export const selectionCount = derived(betSlip, ($m) => $m.size);
export const totalOdds = derived(selections, ($s) =>
	$s.length ? calcAccaOdds($s.map((s) => s.odds)) : 0
);
export const stake = writable<number>(100);
export const potentialWin = derived([totalOdds, stake], ([$o, $s]) =>
	$o > 0 ? calcPotentialWin($s, $o) : 0
);

/** Full Kenya tax breakdown — drives betslip payout display */
export const taxBreakdown = derived([totalOdds, stake], ([$o, $s]) => {
	if ($o === 0) return null;
	return calcKenyaTax($s, $o);
});

export { MIN_STAKE, MAX_STAKE, MAX_SELECTIONS };
