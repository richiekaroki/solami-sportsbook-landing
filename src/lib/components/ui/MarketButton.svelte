<script lang="ts">
	import { formatOdds } from '$lib/utils/formatters';
	import { getOddsDirection } from '$lib/utils/odds-logic';

	interface Odd {
		event_odd_id:   number;
		outcome_name:   string;
		outcome_alias:  string;
		odd_value:      number;
		prev_odd_value?: number;
	}
	interface Props {
		odd:           Odd;
		selected?:     boolean;
		compact?:      boolean;
		compactLabel?: boolean;
		showDirection?: boolean;
		matchLabel?:   string;
		onClick?:      () => void;
	}

	let { odd, selected = false, compact = false, compactLabel = false, showDirection = true, matchLabel = '', onClick = () => {} }: Props = $props();

	const direction = $derived(
		showDirection ? getOddsDirection(odd.odd_value, odd.prev_odd_value ?? odd.odd_value) : null
	);

	const valueColor = $derived(
		selected       ? 'var(--color-gold)'
		: direction === 'up'   ? 'var(--color-green)'
		: direction === 'down' ? 'var(--color-red)'
		: 'var(--color-text)'
	);

	const ariaLabel = $derived(
		`Bet on ${odd.outcome_name} at ${formatOdds(odd.odd_value)}${matchLabel ? ` for ${matchLabel}` : ''}`
	);
</script>

<button
	onclick={onClick}
	aria-label={ariaLabel}
	aria-pressed={selected}
	class="relative flex flex-col items-center justify-center rounded-lg transition-all duration-150 cursor-pointer overflow-hidden group"
	style="
		width:44px; height:44px;
		background:{selected ? 'rgba(240,192,64,0.12)' : 'rgba(255,255,255,0.03)'};
		border:1px solid {selected ? 'rgba(240,192,64,0.4)' : 'var(--color-border)'};
		box-shadow:{selected ? '0 0 12px rgba(240,192,64,0.15), inset 0 1px 0 rgba(240,192,64,0.15)' : 'none'};
	"
>
	{#if !selected}
		<span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-lg"
			style="background:linear-gradient(135deg, rgba(240,192,64,0.06) 0%, transparent 60%);"></span>
	{/if}

	{#if selected}
		<span class="absolute top-0 left-0 right-0 h-[2px] rounded-t-lg"
			style="background:linear-gradient(90deg, transparent, var(--color-gold), transparent);"></span>
	{/if}

	<span class="relative font-bold leading-none mb-[3px] uppercase tracking-[0.5px]"
		style="font-size:{compactLabel ? '8px' : '9px'}; color:{selected ? 'var(--color-gold)' : 'var(--color-text-muted)'};">
		{odd.outcome_name}
	</span>
	<span class="relative font-mono font-bold leading-none"
		style="font-size:13px; color:{valueColor}; text-shadow:{selected ? '0 0 8px rgba(240,192,64,0.4)' : 'none'};">
		{formatOdds(odd.odd_value)}
	</span>

	{#if direction === 'up'}
		<span class="absolute top-[3px] right-[3px] text-[7px] leading-none" style="color:var(--color-green);">▲</span>
	{:else if direction === 'down'}
		<span class="absolute top-[3px] right-[3px] text-[7px] leading-none" style="color:var(--color-red);">▼</span>
	{/if}
</button>
