<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { CheckCircle, PlusCircle, MinusCircle, Info } from 'lucide-svelte';
</script>

{#if $toasts.length > 0}
	<div
		class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none"
		role="status"
		aria-live="polite"
	>
		{#each $toasts as toast (toast.id)}
			<div
				class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap animate-toast-in"
				style="
					backdrop-filter:blur(10px);
					box-shadow:0 6px 24px rgba(0,0,0,0.45);
				{toast.type === 'add'
					? 'background:var(--color-gold-soft); border:1px solid var(--color-gold-border); color:var(--color-gold);'
					: ''}
				{toast.type === 'remove' ? 'background:rgba(255,255,255,0.06); color:var(--color-text-dim);' : ''}
				{toast.type === 'success' ? 'background:var(--color-live-soft); color:var(--color-green);' : ''}
				{toast.type === 'info' ? 'background:rgba(255,255,255,0.06); color:var(--color-text);' : ''}
				"
			>
				{#if toast.type === 'add'}
					<PlusCircle size={13} />
				{:else if toast.type === 'remove'}
					<MinusCircle size={13} />
				{:else if toast.type === 'success'}
					<CheckCircle size={13} />
				{:else}
					<Info size={13} />
				{/if}
				{toast.msg}
				{#if toast.action}
					<button
						onclick={toast.action.fn}
						class="ml-2 px-2.5 py-1 rounded-lg text-[12px] font-bold transition-all hover:bg-white/10 cursor-pointer pointer-events-auto"
						style="color:var(--color-gold);">{toast.action.label}</button
					>
				{/if}
			</div>
		{/each}
	</div>
{/if}
