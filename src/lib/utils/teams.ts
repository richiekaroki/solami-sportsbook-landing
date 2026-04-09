/**
 * Team badge URLs from API-Football CDN (no API key required for images).
 * CDN: https://media.api-sports.io/football/teams/{id}.png
 */
const TEAM_BADGE_IDS: Record<string, number> = {
	'Real Madrid':                  541,
	'FC Barcelona':                 529,
	'Atletico Madrid':              530,
	'Bayern Munich':                157,
	'Arsenal FC':                   42,
	'Liverpool FC':                 40,
	'Paris Saint-Germain':          85,
	'Sporting CP':                  228,
	'Athletic Bilbao':              531,
	'Villarreal CF':                533,
	'Real Betis Seville':           543,
	'Espanyol Barcelona':           532,
	'Real Sociedad San Sebastian':  548,
	'Levante UD':                   724,
	'RCD Mallorca':                 798,
	'Rayo Vallecano':               728,
	'Deportivo Alaves':             542,
	'CA Osasuna':                   727,
	'Girona FC':                    547,
};

export function getTeamBadgeUrl(name: string): string | null {
	const id = TEAM_BADGE_IDS[name];
	if (!id) return null;
	return `https://media.api-sports.io/football/teams/${id}.png`;
}

/** Fallback initials avatar colour per team */
const TEAM_COLOR: Record<string, string> = {
	'Real Madrid':                  '#e8e8e8',
	'FC Barcelona':                 '#004d98',
	'Atletico Madrid':              '#cb3524',
	'Bayern Munich':                '#dc052d',
	'Arsenal FC':                   '#ef0107',
	'Liverpool FC':                 '#c8102e',
	'Paris Saint-Germain':          '#004170',
	'Sporting CP':                  '#006600',
	'Athletic Bilbao':              '#ee2523',
	'Villarreal CF':                '#ffcd00',
	'Real Betis Seville':           '#00954c',
	'Espanyol Barcelona':           '#0070b8',
	'Real Sociedad San Sebastian':  '#0067b1',
	'Levante UD':                   '#e63329',
	'RCD Mallorca':                 '#e4001d',
	'Rayo Vallecano':               '#ffffff',
	'Deportivo Alaves':             '#1d4289',
	'CA Osasuna':                   '#cf0034',
	'Girona FC':                    '#cd1011',
};

export function getTeamColor(name: string): string {
	return TEAM_COLOR[name] ?? '#8b909f';
}

export function getTeamInitials(name: string): string {
	const words = name.split(' ').filter(Boolean);
	if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
	return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
