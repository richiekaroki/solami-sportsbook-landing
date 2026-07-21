<script lang="ts">
	import { HelpCircle } from 'lucide-svelte';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();
	let show = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') show = false;
	}
</script>

<span class="relative inline-flex" role="group">
	<button
		type="button"
		class="inline-flex items-center justify-center min-w-[24px] min-h-[24px] w-6 h-6 rounded-full transition-colors cursor-help"
		style="color:var(--color-text-muted);"
		aria-label={text}
		aria-describedby={show ? 'tooltip-content' : undefined}
		onmouseenter={() => (show = true)}
		onmouseleave={() => (show = false)}
		onfocusin={() => (show = true)}
		onfocusout={() => (show = false)}
		onkeydown={handleKeydown}
	>
		<HelpCircle size={12} />
	</button>
	{#if show}
		<span
			id="tooltip-content"
			class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-[11px] leading-snug font-medium whitespace-nowrap z-10 pointer-events-none animate-fade-in"
			style="background:#1a1e2e; border:1px solid rgba(255,255,255,0.12); color:var(--color-text); box-shadow:0 4px 16px rgba(0,0,0,0.4);"
			role="tooltip">{text}</span
		>
	{/if}
</span>
