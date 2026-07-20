import { format, parseISO, isToday, isTomorrow } from 'date-fns';

export function formatKickoff(iso: string): string {
	const date = parseISO(iso);
	const time = format(date, 'HH:mm');
	if (isToday(date)) return `Today · ${time}`;
	if (isTomorrow(date)) return `Tomorrow · ${time}`;
	return `${format(date, 'MMM d')} · ${time}`;
}

export function formatOdds(value: number): string {
	if (value == null || isNaN(value)) return '0.00';
	return value.toFixed(2);
}

export function formatKES(amount: number): string {
	if (amount == null || isNaN(amount)) return 'KSh 0.00';
	return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Countdown string: "2h 14m" | "45m" | falls back to formatted date if past */
export function formatCountdown(iso: string): string {
	const now = Date.now();
	const kick = parseISO(iso).getTime();
	const diff = kick - now;
	// Match already started or in the past — show the date/time instead
	if (diff <= 0) return format(parseISO(iso), 'MMM d · HH:mm').toUpperCase();
	const h = Math.floor(diff / 3_600_000);
	const m = Math.floor((diff % 3_600_000) / 60_000);
	if (h > 0) return `${h}h ${m}m`;
	return `${m}m`;
}

/** Format a phone number as user types: 07XXXXXXXX → 07XX XXX XXX */
export function formatKEPhone(raw: string): string {
	const digits = raw.replace(/\D/g, '').slice(0, 10);
	if (digits.length <= 4) return digits;
	if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
	return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}
