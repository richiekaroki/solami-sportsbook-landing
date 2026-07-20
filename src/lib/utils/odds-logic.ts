export type OddsDirection = 'up' | 'down' | 'stable';

export function getOddsDirection(current: number, previous: number): OddsDirection {
	if (current > previous) return 'up';
	if (current < previous) return 'down';
	return 'stable';
}

export function calcAccaOdds(oddsValues: number[]): number {
	return oddsValues.reduce((acc, o) => acc * o, 1);
}

export function calcPotentialWin(stake: number, totalOdds: number): number {
	return stake * totalOdds;
}

/**
 * Kenya betting tax breakdown
 * - Excise duty: 7.5% on stake (deducted before bet is placed)
 * - Withholding tax (WHT): 20% on gross winnings
 */
export function calcKenyaTax(
	stake: number,
	totalOdds: number
): {
	excise: number;
	netStake: number;
	grossWin: number;
	wht: number;
	netPayout: number;
} {
	const excise = stake * 0.075;
	const netStake = stake - excise;
	const grossWin = netStake * totalOdds;
	const wht = grossWin * 0.2;
	const netPayout = grossWin - wht;
	return { excise, netStake, grossWin, wht, netPayout };
}

/** Proportional "bets placed" count — bigger matches get more activity */
export function estimateBetCount(totalMarkets: number): string {
	const base = totalMarkets * 18 + 42;
	if (base >= 1000) return `${(base / 1000).toFixed(1)}k`;
	return base.toString();
}
