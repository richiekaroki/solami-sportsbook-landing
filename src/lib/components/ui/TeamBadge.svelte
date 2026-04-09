<script lang="ts">
	import { getTeamBadgeUrl, getTeamColor, getTeamInitials } from '$lib/utils/teams';

	interface Props {
		name: string;
		size?: number; // px
	}

	let { name, size = 40 }: Props = $props();

	const badgeUrl = $derived(getTeamBadgeUrl(name));
	const color    = $derived(getTeamColor(name));
	const initials = $derived(getTeamInitials(name));

	let imgError = $state(false);
</script>

<div
	class="relative rounded-full flex items-center justify-center overflow-hidden shrink-0"
	style="width:{size}px; height:{size}px; background:#1c1f29; border:1.5px solid rgba(255,255,255,0.08);"
>
	{#if badgeUrl && !imgError}
		<img
			src={badgeUrl}
			alt={name}
			onerror={() => (imgError = true)}
			class="w-[75%] h-[75%] object-contain"
			loading="lazy"
		/>
	{:else}
		<!-- Fallback: coloured initials -->
		<span
			class="font-mono font-bold leading-none select-none"
			style="color:{color}; font-size:{Math.round(size * 0.3)}px;"
		>
			{initials}
		</span>
	{/if}
</div>
