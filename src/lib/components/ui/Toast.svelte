<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { CheckCircle, PlusCircle, MinusCircle, Info } from 'lucide-svelte';
</script>

{#if $toasts.length > 0}
	<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none">
		{#each $toasts as toast (toast.id)}
			<div
				class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-[13px] font-medium whitespace-nowrap animate-toast-in"
				style="
					box-shadow: 0 8px 32px rgba(0,0,0,0.5);
					{toast.type === 'add'     ? 'border-color:rgba(245,200,66,0.4); background:rgba(245,200,66,0.08); color:#f5c842;' : ''}
					{toast.type === 'remove'  ? 'border-color:rgba(255,255,255,0.12); background:#1c1f29; color:#8b909f;' : ''}
					{toast.type === 'success' ? 'border-color:rgba(46,204,113,0.4); background:rgba(46,204,113,0.08); color:#2ecc71;' : ''}
					{toast.type === 'info'    ? 'border-color:rgba(255,255,255,0.12); background:#1c1f29; color:#e8eaf0;' : ''}
				"
			>
				{#if toast.type === 'add'}
					<PlusCircle size={14} />
				{:else if toast.type === 'remove'}
					<MinusCircle size={14} />
				{:else if toast.type === 'success'}
					<CheckCircle size={14} />
				{:else}
					<Info size={14} />
				{/if}
				{toast.msg}
			</div>
		{/each}
	</div>
{/if}
