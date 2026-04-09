import { format, parseISO, isToday, isTomorrow } from 'date-fns';

/**
 * Format a match kickoff ISO string into a human-friendly label.
 * e.g. "Today · 19:00" | "Tomorrow · 14:15" | "Apr 12 · 19:00"
 */
export function formatKickoff(iso: string): string {
	const date = parseISO(iso);
	const time = format(date, 'HH:mm');
	if (isToday(date))    return `Today · ${time}`;
	if (isTomorrow(date)) return `Tomorrow · ${time}`;
	return `${format(date, 'MMM d')} · ${time}`;
}

/**
 * Format a date as "APR 8" (uppercase short label for hero card)
 */
export function formatShortDate(iso: string): string {
	return format(parseISO(iso), 'MMM d').toUpperCase();
}

/**
 * Format odds value to 2 decimal places
 */
export function formatOdds(value: number): string {
	return value.toFixed(2);
}

/**
 * Format a KES currency amount
 */
export function formatKES(amount: number): string {
	return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
