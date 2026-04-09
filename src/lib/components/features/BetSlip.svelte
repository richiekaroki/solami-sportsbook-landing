<script lang="ts">
	import {
		betSlip, selections, selectionCount,
		totalOdds, stake, potentialWin,
	} from '$lib/stores/betslip';
	import { toasts }       from '$lib/stores/toast';
	import { formatOdds, formatKES } from '$lib/utils/formatters';
	import { Trash2, X, Target, ShoppingCart, ChevronUp } from 'lucide-svelte';

	let activeTab  = $state<'single' | 'acca'>('single');

	// Mobile bottom-sheet state
	let sheetOpen  = $state(false);

	function handlePlaceBet() {
		if ($selectionCount === 0) return;
		toasts.show('🎉 Bet placed successfully!', 'success', 3000);
		betSlip.clear();
		sheetOpen = false;
	}
</script>

<!-- ═══════════════════════════════════════════
     DESKTOP: sticky card (lg+)
════════════════════════════════════════════ -->
<div class="hidden lg:flex flex-col rounded-xl overflow-hidden"
	style="background:#12141a; border:1px solid rgba(255,255,255,0.07);">

	<!-- Header -->
	<div class="flex items-center justify-between px-4 py-3 shrink-0"
		style="border-bottom:1px solid rgba(255,255,255,0.07);">
		<div class="flex items-center gap-2.5">
			<span class="font-display text-[17px] tracking-[2px] text-white">BET SLIP</span>
			{#if $selectionCount > 0}
				<span class="w-5 h-5 rounded-full bg-[#f5c842] text-[#0b0c0f] text-[11px] font-bold flex items-center justify-center animate-fade-in">
					{$selectionCount}
				</span>
			{/if}
		</div>
		{#if $selectionCount > 0}
			<button onclick={() => betSlip.clear()}
				class="flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-150"
				style="color:#5a5f72;"
				onmouseenter={(e) => (e.currentTarget as HTMLElement).style.color='#e74c3c'}
				onmouseleave={(e) => (e.currentTarget as HTMLElement).style.color='#5a5f72'}
			>
				<Trash2 size={11} /> Clear all
			</button>
		{/if}
	</div>

	<!-- Tabs -->
	<div class="flex shrink-0" style="border-bottom:1px solid rgba(255,255,255,0.07);">
		{#each [{ id:'single', label:'Single' },{ id:'acca', label:'Accumulator' }] as tab}
			<button onclick={() => (activeTab = tab.id as 'single' | 'acca')}
				class="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-[0.8px] border-b-2 transition-all duration-150"
				style="
					border-bottom-color: {activeTab === tab.id ? '#f5c842' : 'transparent'};
					color: {activeTab === tab.id ? '#f5c842' : '#5a5f72'};
				"
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Selections -->
	<div class="flex-1 overflow-y-auto p-3 flex flex-col gap-2" style="min-height:180px; max-height:300px;">
		{#if $selectionCount === 0}
			<div class="flex flex-col items-center justify-center h-full gap-3 py-10 text-center animate-fade-in">
				<Target size={32} style="color:#5a5f72; opacity:0.4;" />
				<div>
					<div class="text-[13px] font-medium" style="color:#5a5f72;">No selections yet</div>
					<div class="text-[11px] mt-1 leading-relaxed" style="color:rgba(90,95,114,0.7);">
						Click any odds button<br />to add to your slip
					</div>
				</div>
			</div>
		{:else}
			{#each $selections as sel (sel.oddId)}
				<div class="relative rounded-[8px] p-3 group animate-slide-in-right"
					style="background:#1c1f29; border:1px solid rgba(255,255,255,0.07);">
					<button onclick={() => betSlip.remove(sel.oddId)}
						class="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
						style="background:#252934; color:#5a5f72;"
						onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.background='#e74c3c'; (e.currentTarget as HTMLElement).style.color='white'; }}
						onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.background='#252934'; (e.currentTarget as HTMLElement).style.color='#5a5f72'; }}
					>
						<X size={9} />
					</button>
					<div class="text-[10px] mb-1 pr-6 truncate" style="color:#5a5f72;">
						{sel.matchLabel} · {sel.competition}
					</div>
					<div class="flex items-center justify-between gap-2">
						<span class="text-[13px] font-semibold truncate" style="color:#e8eaf0;">{sel.pick}</span>
						<span class="font-mono text-[15px] font-bold" style="color:#f5c842;">{formatOdds(sel.odds)}</span>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Footer -->
	<div class="p-4 flex flex-col gap-3 shrink-0" style="border-top:1px solid rgba(255,255,255,0.07); background:rgba(11,12,15,0.4);">
		{#if activeTab === 'acca' && $selectionCount > 1}
			<div class="flex items-center justify-between text-[12px]">
				<span style="color:#8b909f;">Total Odds</span>
				<span class="font-mono font-bold text-[15px] text-white">{formatOdds($totalOdds)}</span>
			</div>
		{/if}
		<div class="flex items-center gap-3">
			<span class="text-[12px] font-medium whitespace-nowrap" style="color:#8b909f;">Stake (KSh)</span>
			<input type="number" bind:value={$stake} min="10" placeholder="100"
				class="flex-1 min-w-0 rounded-lg font-mono text-[14px] font-semibold text-white px-3 py-2 outline-none transition-colors duration-150"
				style="background:#1c1f29; border:1px solid rgba(255,255,255,0.07);"
				onfocus={(e) => (e.currentTarget as HTMLElement).style.borderColor='rgba(245,200,66,0.5)'}
				onblur={(e)  => (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)'}
			/>
		</div>
		<div class="flex items-center justify-between">
			<span class="text-[12px]" style="color:#8b909f;">Potential Win</span>
			<span class="font-mono text-[16px] font-bold" style="color:#2ecc71;">
				{$potentialWin > 0 ? formatKES($potentialWin) : 'KSh 0.00'}
			</span>
		</div>
		<button onclick={handlePlaceBet} disabled={$selectionCount === 0}
			class="w-full py-3.5 rounded-xl font-bold text-[14px] tracking-[0.3px] transition-all duration-200"
			style="
				background: {$selectionCount > 0 ? '#f5c842' : '#252934'};
				color: {$selectionCount > 0 ? '#0b0c0f' : '#5a5f72'};
				cursor: {$selectionCount > 0 ? 'pointer' : 'not-allowed'};
				box-shadow: {$selectionCount > 0 ? '0 4px 20px rgba(245,200,66,0.2)' : 'none'};
			"
		>
			{$selectionCount > 0 ? `Place Bet (${$selectionCount})` : 'Select Odds to Bet'}
		</button>
	</div>
</div>


<!-- ═══════════════════════════════════════════
     MOBILE: floating cart button + bottom sheet
════════════════════════════════════════════ -->

<!-- Floating Cart Button (only when slip has items) -->
{#if $selectionCount > 0}
	<button
		onclick={() => (sheetOpen = true)}
		class="lg:hidden fixed bottom-6 right-5 z-[90] flex items-center gap-2.5 px-4 py-3 rounded-full font-bold text-[14px] text-[#0b0c0f] animate-slide-up"
		style="background:#f5c842; box-shadow:0 8px 32px rgba(245,200,66,0.4);"
	>
		<ShoppingCart size={18} />
		Bet Slip
		<span class="w-6 h-6 rounded-full bg-[#0b0c0f] text-[#f5c842] text-[12px] font-bold flex items-center justify-center">
			{$selectionCount}
		</span>
	</button>
{/if}

<!-- Bottom Sheet Overlay -->
{#if sheetOpen}
	<!-- Backdrop -->
	<div
		class="lg:hidden fixed inset-0 z-[95] bg-[rgba(0,0,0,0.6)] backdrop-blur-sm animate-fade-in"
		onclick={() => (sheetOpen = false)}
		role="presentation"
	></div>

	<!-- Sheet panel -->
	<div
		class="lg:hidden fixed bottom-0 left-0 right-0 z-[100] rounded-t-2xl flex flex-col animate-slide-up"
		style="background:#12141a; border-top:1px solid rgba(255,255,255,0.1); max-height:90dvh;"
	>
		<!-- Handle bar -->
		<div class="flex justify-center pt-3 pb-1 shrink-0">
			<div class="w-10 h-1 rounded-full" style="background:rgba(255,255,255,0.15);"></div>
		</div>

		<!-- Sheet header -->
		<div class="flex items-center justify-between px-5 py-3 shrink-0"
			style="border-bottom:1px solid rgba(255,255,255,0.07);">
			<div class="flex items-center gap-2.5">
				<span class="font-display text-[18px] tracking-[2px] text-white">BET SLIP</span>
				<span class="w-5 h-5 rounded-full bg-[#f5c842] text-[#0b0c0f] text-[11px] font-bold flex items-center justify-center">
					{$selectionCount}
				</span>
			</div>
			<div class="flex items-center gap-3">
				{#if $selectionCount > 0}
					<button onclick={() => betSlip.clear()}
						class="text-[12px] font-medium" style="color:#5a5f72;">
						Clear all
					</button>
				{/if}
				<button onclick={() => (sheetOpen = false)}
					class="w-8 h-8 rounded-full flex items-center justify-center"
					style="background:#1c1f29; color:#8b909f;">
					<X size={16} />
				</button>
			</div>
		</div>

		<!-- Tabs -->
		<div class="flex shrink-0" style="border-bottom:1px solid rgba(255,255,255,0.07);">
			{#each [{ id:'single', label:'Single' },{ id:'acca', label:'Accumulator' }] as tab}
				<button onclick={() => (activeTab = tab.id as 'single' | 'acca')}
					class="flex-1 py-3 text-[12px] font-bold uppercase tracking-[0.8px] border-b-2 transition-all"
					style="
						border-bottom-color: {activeTab === tab.id ? '#f5c842' : 'transparent'};
						color: {activeTab === tab.id ? '#f5c842' : '#5a5f72'};
					"
				>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Selections (scrollable) -->
		<div class="overflow-y-auto flex-1 p-4 flex flex-col gap-2.5" style="min-height:120px;">
			{#each $selections as sel (sel.oddId)}
				<div class="relative rounded-xl p-3.5 animate-slide-in-right"
					style="background:#1c1f29; border:1px solid rgba(255,255,255,0.07);">
					<button onclick={() => betSlip.remove(sel.oddId)}
						class="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
						style="background:#252934; color:#8b909f;">
						<X size={11} />
					</button>
					<div class="text-[10px] mb-1.5 pr-8 truncate" style="color:#5a5f72;">
						{sel.matchLabel} · {sel.competition}
					</div>
					<div class="flex items-center justify-between gap-2">
						<span class="text-[14px] font-semibold truncate" style="color:#e8eaf0;">{sel.pick}</span>
						<span class="font-mono text-[16px] font-bold" style="color:#f5c842;">{formatOdds(sel.odds)}</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Footer -->
		<div class="p-4 pb-8 flex flex-col gap-3 shrink-0"
			style="border-top:1px solid rgba(255,255,255,0.07); background:rgba(11,12,15,0.6);">
			{#if activeTab === 'acca' && $selectionCount > 1}
				<div class="flex items-center justify-between">
					<span class="text-[13px]" style="color:#8b909f;">Total Odds</span>
					<span class="font-mono font-bold text-[16px] text-white">{formatOdds($totalOdds)}</span>
				</div>
			{/if}
			<div class="flex items-center gap-3">
				<span class="text-[13px] font-medium whitespace-nowrap" style="color:#8b909f;">Stake (KSh)</span>
				<input type="number" bind:value={$stake} min="10" placeholder="100"
					class="flex-1 min-w-0 rounded-xl font-mono text-[15px] font-semibold text-white px-4 py-3 outline-none"
					style="background:#1c1f29; border:1px solid rgba(255,255,255,0.1);"
					onfocus={(e) => (e.currentTarget as HTMLElement).style.borderColor='rgba(245,200,66,0.5)'}
					onblur={(e)  => (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.1)'}
				/>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-[13px]" style="color:#8b909f;">Potential Win</span>
				<span class="font-mono text-[18px] font-bold" style="color:#2ecc71;">
					{$potentialWin > 0 ? formatKES($potentialWin) : 'KSh 0.00'}
				</span>
			</div>
			<button onclick={handlePlaceBet} disabled={$selectionCount === 0}
				class="w-full py-4 rounded-2xl font-bold text-[15px] tracking-[0.3px] transition-all duration-200"
				style="background:#f5c842; color:#0b0c0f; box-shadow:0 4px 24px rgba(245,200,66,0.3);"
			>
				Place Bet — {$potentialWin > 0 ? formatKES($potentialWin) : `${$selectionCount} selection${$selectionCount > 1 ? 's' : ''}`}
			</button>
		</div>
	</div>
{/if}
