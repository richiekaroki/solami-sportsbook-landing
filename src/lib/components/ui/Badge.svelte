<script lang="ts">
	interface Props {
		variant?: 'ucl' | 'laliga' | 'live' | 'soon' | 'default';
		size?: 'sm' | 'md';
		children?: import('svelte').Snippet;
	}

	let { variant = 'default', size = 'md', children }: Props = $props();

	const styles: Record<string, string> = {
		ucl:     'bg-[rgba(74,158,255,0.12)] text-[#6aadff] border border-[rgba(74,158,255,0.3)]',
		laliga:  'bg-[rgba(240,48,48,0.12)] text-[#ff8888] border border-[rgba(240,48,48,0.3)]',
		live:    'bg-[rgba(46,204,113,0.12)] text-[#2ecc71] border border-[rgba(46,204,113,0.3)]',
		soon:    'bg-[rgba(245,200,66,0.1)] text-[#f5c842] border border-[rgba(245,200,66,0.25)]',
		default: 'bg-ink3 text-dim border border-line',
	};

	const sizes: Record<string, string> = {
		sm: 'text-[10px] px-2 py-0.5 tracking-[0.8px]',
		md: 'text-[11px] px-3 py-1 tracking-[1px]',
	};
</script>

<span class="inline-flex items-center gap-1.5 rounded-full font-semibold uppercase {styles[variant]} {sizes[size]}">
	{#if variant === 'live'}
		<span class="w-1.5 h-1.5 rounded-full bg-[#2ecc71] animate-pulse-dot"></span>
	{/if}
	{@render children?.()}
</span>
