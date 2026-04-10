<script lang="ts">
	import { betSlip, selections, selectionCount, totalOdds, stake, potentialWin } from '$lib/stores/betslip';
	import { toasts }    from '$lib/stores/toast';
	import { formatOdds, formatKES } from '$lib/utils/formatters';
	import { X, Zap, ShoppingCart } from 'lucide-svelte';

	let sheetOpen  = $state(false);
	let activeMode = $state<'single' | 'acca'>('single');

	const QUICK_STAKES = [50, 100, 200, 500];

	function handlePlaceBet() {
		if ($selectionCount === 0) return;
		toasts.show('🎉 Bet placed! Good luck!', 'success', 3000);
		betSlip.clear();
		sheetOpen = false;
	}
</script>

<!-- Floating cart button -->
{#if $selectionCount > 0}
	<button
		onclick={() => (sheetOpen = true)}
		class="xl:hidden fixed bottom-6 right-4 z-[90] flex items-center gap-2 px-4 py-3 rounded-full font-bold text-[14px] animate-slide-up"
		style="background:#f5c842; color:#0b1628; box-shadow:0 8px 32px rgba(245,200,66,0.4);"
	>
		<ShoppingCart size={17} />
		Slip
		<span class="w-6 h-6 rounded-full bg-[#0b1628] text-[#f5c842] text-[11px] font-bold flex items-center justify-center">
			{$selectionCount}
		</span>
	</button>
{/if}

<!-- Backdrop -->
{#if sheetOpen}
	<div class="xl:hidden fixed inset-0 z-[95] animate-fade-in"
		style="background:rgba(0,0,0,0.65); backdrop-filter:blur(4px);"
		onclick={() => (sheetOpen = false)} role="presentation"></div>

	<!-- Bottom sheet -->
	<div class="xl:hidden fixed bottom-0 left-0 right-0 z-[100] rounded-t-2xl flex flex-col animate-slide-up"
		style="background:#0d0f14; border-top:1px solid rgba(255,255,255,0.1); max-height:92dvh;">

		<!-- Handle -->
		<div class="flex justify-center pt-3 pb-1 shrink-0">
			<div class="w-10 h-1 rounded-full" style="background:rgba(255,255,255,0.12);"></div>
		</div>

		<!-- Header -->
		<div class="flex items-center justify-between px-5 py-3 shrink-0"
			style="border-bottom:1px solid rgba(255,255,255,0.07);">
			<div class="flex items-center gap-2.5">
				<span class="font-display text-[17px] tracking-[2px] text-white">BET SLIP</span>
				<span class="w-5 h-5 rounded-full bg-[#f5c842] text-[#0b1628] text-[11px] font-bold flex items-center justify-center">
					{$selectionCount}
				</span>
			</div>
			<div class="flex items-center gap-3">
				<button onclick={() => betSlip.clear()} class="text-[11px] font-medium" style="color:#4d5568;">Clear all</button>
				<button onclick={() => (sheetOpen = false)}
					class="w-8 h-8 rounded-full flex items-center justify-center"
					style="background:#13161f; color:#8892a4;"><X size={15} /></button>
			</div>
		</div>

		<!-- Tabs -->
		<div class="flex shrink-0 px-4 pt-3 gap-0" style="border-bottom:1px solid rgba(255,255,255,0.05);">
			{#each [{ id:'single', label:'Single' }, { id:'acca', label:'Accumulator' }] as tab}
				<button
					onclick={() => (activeMode = tab.id as 'single' | 'acca')}
					class="flex-1 pb-2 text-[12px] font-bold uppercase tracking-[0.5px] transition-all"
					style="color:{activeMode === tab.id ? '#f5c842' : '#4d5568'}; border-bottom:2px solid {activeMode === tab.id ? '#f5c842' : 'transparent'};"
				>{tab.label}</button>
			{/each}
		</div>

		<!-- Selections -->
		<div class="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-2.5" style="min-height:100px;">
			{#each $selections as sel (sel.oddId)}
				<div class="relative rounded-xl p-3.5 animate-slide-in-right"
					style="background:#13161f; border:1px solid rgba(255,255,255,0.07);">
					<div class="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
						style="background:linear-gradient(180deg,#f5c842,rgba(245,200,66,0.3));"></div>
					<button onclick={() => betSlip.remove(sel.oddId)}
						class="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
						style="background:#1a1e2a; color:#8892a4;"><X size={10} /></button>
					<div class="text-[10px] mb-1 pr-8 truncate" style="color:#4d5568;">{sel.matchLabel}</div>
					<div class="flex items-center justify-between pl-2">
						<span class="text-[13px] font-semibold" style="color:#e4e8f0;">{sel.pick}</span>
						<span class="font-mono text-[16px] font-bold" style="color:#f5c842;">{formatOdds(sel.odds)}</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Footer -->
		<div class="px-4 pb-8 flex flex-col gap-3 shrink-0"
			style="border-top:1px solid rgba(255,255,255,0.07); padding-top:14px; background:rgba(13,15,20,0.9);">

			<!-- Quick stakes -->
			<div class="flex gap-1.5">
				{#each QUICK_STAKES as qs}
					<button onclick={() => ($stake = qs)}
						class="flex-1 py-2 rounded-lg text-[12px] font-bold transition-all duration-150"
						style="background:{$stake===qs ? 'rgba(245,200,66,0.15)' : 'rgba(255,255,255,0.05)'}; border:1px solid {$stake===qs ? 'rgba(245,200,66,0.4)' : 'rgba(255,255,255,0.07)'}; color:{$stake===qs ? '#f5c842' : '#8892a4'};">
						{qs}
					</button>
				{/each}
			</div>

			<div class="flex items-center gap-3">
				<span class="text-[12px] whitespace-nowrap" style="color:#8892a4;">Stake (KSh)</span>
				<input type="number" bind:value={$stake} min="10" placeholder="100"
					class="flex-1 min-w-0 rounded-xl font-mono text-[14px] font-semibold text-white px-4 py-2.5 outline-none"
					style="background:#13161f; border:1px solid rgba(255,255,255,0.08);"
					onfocus={(e) => (e.currentTarget as HTMLElement).style.borderColor='rgba(245,200,66,0.45)'}
					onblur={(e)  => (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'}
				/>
			</div>

			{#if activeMode === 'acca' && $selectionCount > 1}
				<div class="flex items-center justify-between px-1">
					<span class="text-[12px]" style="color:#8892a4;">Total Odds</span>
					<span class="font-mono font-bold text-white">{formatOdds($totalOdds)}</span>
				</div>
			{/if}

			<div class="flex items-center justify-between px-1">
				<span class="text-[13px]" style="color:#8892a4;">Potential Win</span>
				<span class="font-mono text-[18px] font-bold" style="color:#22c55e; text-shadow:0 0 12px rgba(34,197,94,0.4);">
					{$potentialWin > 0 ? formatKES($potentialWin) : 'KSh 0.00'}
				</span>
			</div>

			<button onclick={handlePlaceBet}
				class="w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200"
				style="background:#f5c842; color:#0b1628; box-shadow:0 4px 24px rgba(245,200,66,0.3);"
				onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='#ffd700'; el.style.transform='translateY(-1px)'; }}
				onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='#f5c842'; el.style.transform=''; }}
			>
				<Zap size={16} />
				Place Bet — {formatKES($potentialWin > 0 ? $potentialWin : $stake * 1)}
			</button>
		</div>
	</div>
{/if}
