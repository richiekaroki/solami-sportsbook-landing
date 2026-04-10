<script lang="ts">
	import { formatOdds } from '$lib/utils/formatters';
	import { getOddsDirection } from '$lib/utils/odds-logic';
	import { betSlip } from '$lib/stores/betslip';
	import { toasts } from '$lib/stores/toast';
	import type { BetSelection } from '$lib/types';

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
		onClick?:      () => void;
		// NEW PROPS for cleaner API
		matchLabel?:   string;
		competition?:  string;
		marketType?:   string;
		compact?:      boolean;
	}

	let { 
		odd, 
		selected = false, 
		compactLabel = false, 
		showDirection = true, 
		onClick,
		matchLabel,
		competition,
		marketType = '1x2',
		compact = false
	}: Props = $props();

const actualCompactLabel = $derived(compact ? true : compactLabel);	

	const direction = $derived(
		showDirection ? getOddsDirection(odd.odd_value, odd.prev_odd_value ?? odd.odd_value) : null
	);

	// Determine selected state - either from prop or from betSlip store
	const isSelected = $derived(
		selected || (matchLabel && competition ? $betSlip.has(odd.event_odd_id) : false)
	);

	const valueColor = $derived(
		isSelected     ? '#f5c842'
		: direction === 'up'   ? '#22c55e'
		: direction === 'down' ? '#ef4444'
		: '#e4e8f0'
	);

	function handleClick() {
		// If custom onClick provided, use it (backward compatible)
		if (onClick) {
			onClick();
			return;
		}
		
		// Otherwise handle bet slip internally (new cleaner API)
		if (matchLabel && competition) {
			const selection: BetSelection = {
				oddId: odd.event_odd_id,
				matchLabel,
				competition,
				market: marketType,
				pick: odd.outcome_alias,
				outcome: odd.outcome_name,
				odds: odd.odd_value
			};

			const alreadySelected = $betSlip.has(odd.event_odd_id);
			betSlip.toggle(selection);

			if (!alreadySelected) {
				toasts.show(`${odd.outcome_alias} added`, 'add');
			} else {
				toasts.show(`${odd.outcome_alias} removed`, 'remove');
			}
		}
	}
</script>

<button
	onclick={handleClick}
	class="relative flex flex-col items-center justify-center rounded-lg transition-all duration-150 cursor-pointer overflow-hidden group"
	style="
		width:44px; height:40px;
		background:{isSelected ? 'rgba(245,200,66,0.14)' : 'rgba(255,255,255,0.04)'};
		border:1px solid {isSelected ? 'rgba(245,200,66,0.55)' : 'rgba(255,255,255,0.08)'};
		box-shadow:{isSelected ? '0 0 12px rgba(245,200,66,0.2), inset 0 1px 0 rgba(245,200,66,0.2)' : 'none'};
	"
>
	<!-- Hover shimmer overlay -->
	{#if !isSelected}
		<span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-lg"
			style="background:linear-gradient(135deg, rgba(245,200,66,0.07) 0%, transparent 60%);"></span>
	{/if}

	<!-- Active glow top bar -->
	{#if isSelected}
		<span class="absolute top-0 left-0 right-0 h-[2px] rounded-t-lg"
			style="background:linear-gradient(90deg, transparent, #f5c842, transparent);"></span>
	{/if}

	<span class="relative font-bold leading-none mb-[3px] uppercase tracking-[0.5px]"
		style="font-size:{actualCompactLabel ? '8px' : '9px'}; color:{isSelected ? '#f5c842' : '#4d5568'};">
		{odd.outcome_name}
	</span>
	<span class="relative font-mono font-bold leading-none"
		style="font-size:13px; color:{valueColor}; text-shadow:{isSelected ? '0 0 8px rgba(245,200,66,0.5)' : 'none'};">
		{formatOdds(odd.odd_value)}
	</span>

	<!-- Direction micro-indicator -->
	{#if direction === 'up'}
		<span class="absolute top-[3px] right-[3px] text-[7px] leading-none" style="color:#22c55e;">▲</span>
	{:else if direction === 'down'}
		<span class="absolute top-[3px] right-[3px] text-[7px] leading-none" style="color:#ef4444;">▼</span>
	{/if}
</button>