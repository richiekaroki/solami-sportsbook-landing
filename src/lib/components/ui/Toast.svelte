<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { CheckCircle, PlusCircle, MinusCircle, Info } from 'lucide-svelte';
</script>

{#if $toasts.length > 0}
	<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none">
		{#each $toasts as toast (toast.id)}
			<div class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap animate-toast-in"
				style="
					backdrop-filter:blur(12px);
					box-shadow:0 8px 32px rgba(0,0,0,0.6);
					{toast.type==='add'     ? 'background:rgba(245,200,66,0.1); border:1px solid rgba(245,200,66,0.35); color:#f5c842;' : ''}
					{toast.type==='remove'  ? 'background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:#8892a4;' : ''}
					{toast.type==='success' ? 'background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.35); color:#22c55e;' : ''}
					{toast.type==='info'    ? 'background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:#e4e8f0;' : ''}
				"
			>
				{#if toast.type==='add'}     <PlusCircle  size={13} />
				{:else if toast.type==='remove'}  <MinusCircle size={13} />
				{:else if toast.type==='success'} <CheckCircle size={13} />
				{:else}                           <Info         size={13} />
				{/if}
				{toast.msg}
			</div>
		{/each}
	</div>
{/if}
