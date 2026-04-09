/**
 * Determine odds movement direction by comparing current vs previous value.
 */
export type OddsDirection = 'up' | 'down' | 'stable';

export function getOddsDirection(current: number, previous: number): OddsDirection {
	if (current > previous) return 'up';
	if (current < previous) return 'down';
	return 'stable';
}

/**
 * Calculate total (accumulator) odds from an array of individual odds values.
 */
export function calcAccaOdds(oddsValues: number[]): number {
	return oddsValues.reduce((acc, o) => acc * o, 1);
}

/**
 * Calculate potential winnings.
 */
export function calcPotentialWin(stake: number, totalOdds: number): number {
	return stake * totalOdds;
}

/**
 * Team emoji map for visual flair.
 */
const TEAM_EMOJI: Record<string, string> = {
	'Real Madrid':               '⚪',
	'FC Barcelona':              '🔵',
	'Atletico Madrid':           '🔴',
	'Bayern Munich':             '🔴',
	'Arsenal FC':                '🔴',
	'Liverpool FC':              '🔴',
	'Paris Saint-Germain':       '🔵',
	'Sporting CP':               '🟢',
	'Athletic Bilbao':           '🔴',
	'Villarreal CF':             '🟡',
	'Real Betis Seville':        '🟢',
	'Espanyol Barcelona':        '🔵',
	'Real Sociedad San Sebastian':'🔵',
	'Levante UD':                '🟠',
	'RCD Mallorca':              '🟡',
	'Rayo Vallecano':            '⚪',
	'Deportivo Alaves':          '🔵',
	'CA Osasuna':                '🔴',
	'Girona FC':                 '🔴',
};

export function getTeamEmoji(name: string): string {
	return TEAM_EMOJI[name] ?? '⚽';
}
