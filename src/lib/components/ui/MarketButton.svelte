<script lang="ts">
	import { formatOdds } from '$lib/utils/formatters';
	import { getOddsDirection } from '$lib/utils/odds-logic';

	interface Odd {
		event_odd_id: number;
		outcome_name: string;
		outcome_alias: string;
		odd_value: number;
		prev_odd_value?: number;
	}

	interface Props {
		odd: Odd;
		selected?: boolean;
		compactLabel?: boolean;
		showDirection?: boolean;
		onClick: () => void;
	}

	let {
		odd,
		selected = false,
		compactLabel = false,
		showDirection = true,
		onClick
	}: Props = $props();

	const direction = $derived(
		showDirection
			? getOddsDirection(
					odd.odd_value,
					odd.prev_odd_value ?? odd.odd_value
				)
			: null
	);

	const oddsColor = $derived(
		selected
			? '#f5c842'
			: direction === 'up'
				? '#2ecc71'
				: direction === 'down'
					? '#e74c3c'
					: '#e8eaf0'
	);
</script>

<button
	onclick={onClick}
	class="flex flex-col items-center justify-center rounded-lg transition-all duration-150 cursor-pointer"
	style="
		width:44px;
		height:40px;
		background:{selected ? 'rgba(245,200,66,0.15)' : '#1c1f29'};
		border:1px solid {selected ? 'rgba(245,200,66,0.5)' : 'rgba(255,255,255,0.07)'};
	"
	onmouseenter={(e) => {
		if (!selected) {
			const el = e.currentTarget as HTMLElement;
			el.style.borderColor = 'rgba(245,200,66,0.3)';
			el.style.background = 'rgba(245,200,66,0.06)';
		}
	}}
	onmouseleave={(e) => {
		if (!selected) {
			const el = e.currentTarget as HTMLElement;
			el.style.borderColor = 'rgba(255,255,255,0.07)';
			el.style.background = '#1c1f29';
		}
	}}
>
	<span
		class="font-bold leading-none mb-0.5 uppercase"
		style="
			font-size:{compactLabel ? '8px' : '9px'};
			color:{selected ? '#f5c842' : '#5a5f72'};
		"
	>
		{odd.outcome_name}
	</span>

	<span
		class="text-[12px] font-bold leading-none font-mono"
		style="color:{oddsColor};"
	>
		{formatOdds(odd.odd_value)}
	</span>
</button>