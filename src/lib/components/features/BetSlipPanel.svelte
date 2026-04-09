<script lang="ts">
	import { betSlip, selections, selectionCount, totalOdds, stake, potentialWin } from '$lib/stores/betslip';
	import { toasts }    from '$lib/stores/toast';
	import { formatOdds, formatKES } from '$lib/utils/formatters';
	import { X, Target, Zap } from 'lucide-svelte';

	let activeTab  = $state<'betslip' | 'jenga'>('betslip');
	let activeMode = $state<'single' | 'acca'>('single');

	const QUICK_STAKES = [50, 100, 200, 500];

	function handlePlaceBet() {
		if ($selectionCount === 0) return;
		toasts.show('🎉 Bet placed! Good luck!', 'success', 3000);
		betSlip.clear();
	}
</script>

<div class="flex flex-col h-full overflow-hidden" style="background:#0d0f14;">

	<!-- Top tabs: Betslip | Jenga bets -->
	<div class="flex shrink-0" style="border-bottom:1px solid rgba(255,255,255,0.07);">
		{#each [{ id:'betslip', label:`Betslip (${$selectionCount})` }, { id:'jenga', label:'Jenga bets (0)' }] as tab}
			<button
				onclick={() => { activeTab = tab.id as 'betslip' | 'jenga'; if (tab.id === 'jenga') toasts.show('Jenga bets — coming soon!', 'info'); }}
				class="flex-1 py-3 text-[12px] font-semibold transition-all duration-150"
				style="
					background:{activeTab === tab.id ? '#13161f' : 'transparent'};
					color:{activeTab === tab.id ? '#e4e8f0' : '#4d5568'};
					border-bottom:2px solid {activeTab === tab.id ? '#f5c842' : 'transparent'};
				"
			>{tab.label}</button>
		{/each}
	</div>

	{#if activeTab === 'betslip'}
		<!-- Single / Accumulator sub-tabs -->
		<div class="flex shrink-0 px-3 pt-3 gap-0" style="border-bottom:1px solid rgba(255,255,255,0.05);">
			{#each [{ id:'single', label:'Single' }, { id:'acca', label:'Accumulator' }] as tab}
				<button
					onclick={() => (activeMode = tab.id as 'single' | 'acca')}
					class="flex-1 pb-2 text-[11px] font-bold uppercase tracking-[0.6px] transition-all duration-150"
					style="
						color:{activeMode === tab.id ? '#f5c842' : '#4d5568'};
						border-bottom:2px solid {activeMode === tab.id ? '#f5c842' : 'transparent'};
					"
				>{tab.label}</button>
			{/each}
		</div>

		<!-- Selections -->
		<div class="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2" style="min-height:160px;">
			{#if $selectionCount === 0}
				<div class="flex flex-col items-center justify-center gap-3 py-10 text-center h-full">
					<Target size={32} style="color:#4d5568; opacity:0.4;" />
					<div class="text-[13px]" style="color:#4d5568;">No selections yet</div>
					<div class="text-[11px] leading-relaxed" style="color:rgba(77,85,104,0.6);">
						Click any odds button<br />to add to your slip
					</div>
				</div>
			{:else}
				{#each $selections as sel (sel.oddId)}
					<div class="relative rounded-xl p-3 animate-slide-in-right"
						style="background:#13161f; border:1px solid rgba(255,255,255,0.07);">
						<!-- Gold left accent bar -->
						<div class="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
							style="background:linear-gradient(180deg, #f5c842, rgba(245,200,66,0.3));"></div>

						<button
							onclick={() => betSlip.remove(sel.oddId)}
							class="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150"
							style="background:#1a1e2a; color:#4d5568;"
							onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='#ef4444'; el.style.color='white'; }}
							onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='#1a1e2a'; el.style.color='#4d5568'; }}
						><X size={9} /></button>

						<div class="text-[10px] mb-1 pr-6 truncate" style="color:#4d5568;">{sel.matchLabel}</div>
						<div class="text-[10px] mb-1.5" style="color:#8892a4;">{sel.competition}</div>
						<div class="flex items-center justify-between pl-2">
							<span class="text-[12px] font-semibold truncate" style="color:#e4e8f0;">{sel.pick}</span>
							<span class="font-mono text-[15px] font-bold ml-2 animate-gold-pulse rounded px-1"
								style="color:#f5c842;">{formatOdds(sel.odds)}</span>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Footer -->
		<div class="px-3 pb-4 flex flex-col gap-2.5 shrink-0"
			style="border-top:1px solid rgba(255,255,255,0.07); padding-top:12px; background:rgba(13,15,20,0.8);">

			{#if activeMode === 'acca' && $selectionCount > 1}
				<div class="flex items-center justify-between text-[12px] px-1">
					<span style="color:#8892a4;">Total odds</span>
					<span class="font-mono font-bold text-white">{formatOdds($totalOdds)}</span>
				</div>
			{/if}

			<!-- Quick stake buttons -->
			<div class="flex gap-1.5">
				{#each QUICK_STAKES as qs}
					<button
						onclick={() => ($stake = qs)}
						class="flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150"
						style="
							background:{$stake === qs ? 'rgba(245,200,66,0.15)' : 'rgba(255,255,255,0.04)'};
							border:1px solid {$stake === qs ? 'rgba(245,200,66,0.4)' : 'rgba(255,255,255,0.07)'};
							color:{$stake === qs ? '#f5c842' : '#8892a4'};
						"
					>{qs}</button>
				{/each}
			</div>

			<!-- Stake input -->
			<div class="flex items-center gap-2">
				<span class="text-[11px] font-medium whitespace-nowrap" style="color:#8892a4;">Stake (KSh)</span>
				<input
					type="number"
					bind:value={$stake}
					min="10"
					placeholder="100"
					class="flex-1 min-w-0 rounded-lg font-mono text-[13px] font-semibold text-white px-3 py-2 outline-none transition-colors duration-150"
					style="background:#13161f; border:1px solid rgba(255,255,255,0.08);"
					onfocus={(e) => (e.currentTarget as HTMLElement).style.borderColor='rgba(245,200,66,0.45)'}
					onblur={(e)  => (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'}
				/>
			</div>

			<!-- Potential win -->
			<div class="flex items-center justify-between px-1">
				<span class="text-[11px]" style="color:#8892a4;">Potential Win</span>
				<span class="font-mono text-[15px] font-bold" style="color:#22c55e; text-shadow: 0 0 12px rgba(34,197,94,0.4);">
					{$potentialWin > 0 ? formatKES($potentialWin) : 'KSh 0.00'}
				</span>
			</div>

			<!-- Place bet CTA -->
			<button
				onclick={handlePlaceBet}
				disabled={$selectionCount === 0}
				class="w-full py-3 rounded-xl font-bold text-[13px] tracking-[0.3px] transition-all duration-200 flex items-center justify-center gap-2"
				style="
					background:{$selectionCount > 0 ? '#f5c842' : '#13161f'};
					color:{$selectionCount > 0 ? '#0b1628' : '#4d5568'};
					cursor:{$selectionCount > 0 ? 'pointer' : 'not-allowed'};
					box-shadow:{$selectionCount > 0 ? '0 4px 20px rgba(245,200,66,0.25)' : 'none'};
				"
				onmouseenter={(e) => { if ($selectionCount > 0) { const el = e.currentTarget as HTMLElement; el.style.background='#ffd700'; el.style.transform='translateY(-1px)'; el.style.boxShadow='0 6px 24px rgba(245,200,66,0.35)'; } }}
				onmouseleave={(e) => { if ($selectionCount > 0) { const el = e.currentTarget as HTMLElement; el.style.background='#f5c842'; el.style.transform=''; el.style.boxShadow='0 4px 20px rgba(245,200,66,0.25)'; } }}
			>
				{#if $selectionCount > 0}
					<Zap size={14} />
					Place Bet ({$selectionCount})
				{:else}
					Select Odds to Bet
				{/if}
			</button>
		</div>
	{:else}
		<div class="flex-1 flex items-center justify-center">
			<span class="text-[13px]" style="color:#4d5568;">Jenga bets — coming soon</span>
		</div>
	{/if}
</div>
