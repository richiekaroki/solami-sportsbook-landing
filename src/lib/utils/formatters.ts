import { format, parseISO, isToday, isTomorrow } from 'date-fns';

export function formatKickoff(iso: string): string {
	const date = parseISO(iso);
	const time = format(date, 'HH:mm');
	if (isToday(date))    return `Today · ${time}`;
	if (isTomorrow(date)) return `Tomorrow · ${time}`;
	return `${format(date, 'MMM d')} · ${time}`;
}

export function formatShortDate(iso: string): string {
	return format(parseISO(iso), 'MMM d').toUpperCase();
}

export function formatOdds(value: number): string {
	return value.toFixed(2);
}

export function formatKES(amount: number): string {
	return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Countdown string: "Kicks off in 2h 14m" or "Starting soon" */
export function formatCountdown(iso: string): string {
	const now   = Date.now();
	const kick  = parseISO(iso).getTime();
	const diff  = kick - now;
	if (diff <= 0) return 'Starting soon';
	const h = Math.floor(diff / 3_600_000);
	const m = Math.floor((diff % 3_600_000) / 60_000);
	if (h > 0) return `${h}h ${m}m`;
	return `${m}m`;
}

/** Format a phone number as user types: 07XXXXXXXX → 07XX XXX XXX */
export function formatKEPhone(raw: string): string {
	const digits = raw.replace(/\D/g, '').slice(0, 10);
	if (digits.length <= 4) return digits;
	if (digits.length <= 7) return `${digits.slice(0,4)} ${digits.slice(4)}`;
	return `${digits.slice(0,4)} ${digits.slice(4,7)} ${digits.slice(7)}`;
}
