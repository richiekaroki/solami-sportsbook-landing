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
		compactLabel?: boolean;
		showDirection?: boolean;
		onClick:       () => void;
	}

	let { odd, selected = false, compactLabel = false, showDirection = true, onClick }: Props = $props();

	const direction = $derived(
		showDirection ? getOddsDirection(odd.odd_value, odd.prev_odd_value ?? odd.odd_value) : null
	);

	const valueColor = $derived(
		selected       ? '#f5c842'
		: direction === 'up'   ? '#22c55e'
		: direction === 'down' ? '#ef4444'
		: '#e4e8f0'
	);
</script>

<button
	onclick={onClick}
	class="relative flex flex-col items-center justify-center rounded-lg transition-all duration-150 cursor-pointer overflow-hidden group"
	style="
		width:44px; height:40px;
		background:{selected ? 'rgba(245,200,66,0.14)' : 'rgba(255,255,255,0.04)'};
		border:1px solid {selected ? 'rgba(245,200,66,0.55)' : 'rgba(255,255,255,0.08)'};
		box-shadow:{selected ? '0 0 12px rgba(245,200,66,0.2), inset 0 1px 0 rgba(245,200,66,0.2)' : 'none'};
	"
>
	<!-- Hover shimmer overlay -->
	{#if !selected}
		<span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-lg"
			style="background:linear-gradient(135deg, rgba(245,200,66,0.07) 0%, transparent 60%);"></span>
	{/if}

	<!-- Active glow top bar -->
	{#if selected}
		<span class="absolute top-0 left-0 right-0 h-[2px] rounded-t-lg"
			style="background:linear-gradient(90deg, transparent, #f5c842, transparent);"></span>
	{/if}

	<span class="relative font-bold leading-none mb-[3px] uppercase tracking-[0.5px]"
		style="font-size:{compactLabel ? '8px' : '9px'}; color:{selected ? '#f5c842' : '#4d5568'};">
		{odd.outcome_name}
	</span>
	<span class="relative font-mono font-bold leading-none"
		style="font-size:13px; color:{valueColor}; text-shadow:{selected ? '0 0 8px rgba(245,200,66,0.5)' : 'none'};">
		{formatOdds(odd.odd_value)}
	</span>

	<!-- Direction micro-indicator -->
	{#if direction === 'up'}
		<span class="absolute top-[3px] right-[3px] text-[7px] leading-none" style="color:#22c55e;">▲</span>
	{:else if direction === 'down'}
		<span class="absolute top-[3px] right-[3px] text-[7px] leading-none" style="color:#ef4444;">▼</span>
	{/if}
</button>
