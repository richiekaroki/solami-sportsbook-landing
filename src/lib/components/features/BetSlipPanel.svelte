<script lang="ts">
	import {
		betSlip, selections, selectionCount,
		totalOdds, stake, potentialWin,
	} from '$lib/stores/betslip';
	import { toasts }    from '$lib/stores/toast';
	import { formatOdds, formatKES } from '$lib/utils/formatters';
	import { X, Target } from 'lucide-svelte';

	let activeTab = $state<'betslip' | 'jenga'>('betslip');
	let activeMode = $state<'single' | 'acca'>('single');

	function handlePlaceBet() {
		if ($selectionCount === 0) return;
		toasts.show('🎉 Bet placed successfully!', 'success', 3000);
		betSlip.clear();
	}
</script>

<div class="flex flex-col h-full" style="background:#12141a;">

	<!-- Top tabs: Betslip | Jenga bets -->
	<div class="flex shrink-0" style="border-bottom:1px solid rgba(255,255,255,0.07);">
		<button
			onclick={() => (activeTab = 'betslip')}
			class="flex-1 py-3 text-[13px] font-semibold transition-all duration-150"
			style="
				background:{activeTab === 'betslip' ? '#1c1f29' : 'transparent'};
				color:{activeTab === 'betslip' ? '#e8eaf0' : '#5a5f72'};
				border-bottom:2px solid {activeTab === 'betslip' ? '#f5c842' : 'transparent'};
			"
		>
			Betslip ({$selectionCount})
		</button>
		<button
			onclick={() => { activeTab = 'jenga'; toasts.show('Jenga bets — coming soon!', 'info'); }}
			class="flex-1 py-3 text-[13px] font-semibold transition-all duration-150"
			style="
				background:{activeTab === 'jenga' ? '#1c1f29' : 'transparent'};
				color:{activeTab === 'jenga' ? '#e8eaf0' : '#5a5f72'};
				border-bottom:2px solid {activeTab === 'jenga' ? '#f5c842' : 'transparent'};
			"
		>
			Jenga bets (0)
		</button>
	</div>

	{#if activeTab === 'betslip'}
		<!-- Single / Accumulator sub-tabs -->
		<div class="flex shrink-0 px-3 pt-3 gap-2">
			{#each [{ id:'single', label:'Single' }, { id:'acca', label:'Accumulator' }] as tab}
				<button
					onclick={() => (activeMode = tab.id as 'single' | 'acca')}
					class="flex-1 py-2 rounded-lg text-[12px] font-bold uppercase tracking-[0.5px] transition-all duration-150"
					style="
						background:{activeMode === tab.id ? 'transparent' : 'transparent'};
						color:{activeMode === tab.id ? '#f5c842' : '#5a5f72'};
						border-bottom:2px solid {activeMode === tab.id ? '#f5c842' : 'transparent'};
					"
				>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Selections -->
		<div class="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
			{#if $selectionCount === 0}
				<div class="flex flex-col items-center justify-center gap-3 py-12 text-center">
					<Target size={36} style="color:#5a5f72; opacity:0.3;" />
					<div class="text-[13px]" style="color:#5a5f72;">No selections yet</div>
					<div class="text-[11px] leading-relaxed" style="color:rgba(90,95,114,0.6);">
						Click any odds button<br />to add to your slip
					</div>
				</div>
			{:else}
				{#each $selections as sel (sel.oddId)}
					<div class="relative rounded-lg p-3 animate-slide-in-right"
						style="background:#1c1f29; border:1px solid rgba(255,255,255,0.07);">
						<button
							onclick={() => betSlip.remove(sel.oddId)}
							class="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150"
							style="background:#252934; color:#5a5f72;"
							onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.background='#e74c3c'; (e.currentTarget as HTMLElement).style.color='white'; }}
							onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.background='#252934'; (e.currentTarget as HTMLElement).style.color='#5a5f72'; }}
						>
							<X size={9} />
						</button>
						<div class="text-[10px] mb-1 pr-6 truncate" style="color:#5a5f72;">
							{sel.matchLabel}
						</div>
						<div class="text-[11px] mb-1.5 pr-6" style="color:#8b909f;">{sel.competition}</div>
						<div class="flex items-center justify-between">
							<span class="text-[13px] font-semibold truncate" style="color:#e8eaf0;">{sel.pick}</span>
							<span class="font-mono text-[14px] font-bold ml-2" style="color:#f5c842;">{formatOdds(sel.odds)}</span>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Footer -->
		<div class="px-3 pb-4 flex flex-col gap-2.5 shrink-0"
			style="border-top:1px solid rgba(255,255,255,0.07); padding-top:12px;">

			{#if activeMode === 'acca' && $selectionCount > 1}
				<div class="flex items-center justify-between text-[12px]">
					<span style="color:#8b909f;">Total Odds</span>
					<span class="font-mono font-bold text-white">{formatOdds($totalOdds)}</span>
				</div>
			{/if}

			<div class="flex items-center gap-2">
				<span class="text-[12px] whitespace-nowrap" style="color:#8b909f;">Stake (KSh)</span>
				<input
					type="number"
					bind:value={$stake}
					min="10"
					placeholder="100"
					class="flex-1 min-w-0 rounded-lg font-mono text-[13px] font-semibold text-white px-3 py-2 outline-none transition-colors duration-150"
					style="background:#1c1f29; border:1px solid rgba(255,255,255,0.07);"
					onfocus={(e) => (e.currentTarget as HTMLElement).style.borderColor='rgba(245,200,66,0.4)'}
					onblur={(e) => (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)'}
				/>
			</div>

			<div class="flex items-center justify-between">
				<span class="text-[12px]" style="color:#8b909f;">Potential Win</span>
				<span class="font-mono text-[15px] font-bold" style="color:#2ecc71;">
					{$potentialWin > 0 ? formatKES($potentialWin) : 'KSH 0.00'}
				</span>
			</div>

			<button
				onclick={handlePlaceBet}
				disabled={$selectionCount === 0}
				class="w-full py-3 rounded-xl font-bold text-[13px] transition-all duration-200"
				style="
					background:{$selectionCount > 0 ? '#f5c842' : '#1c1f29'};
					color:{$selectionCount > 0 ? '#0b0c0f' : '#5a5f72'};
					cursor:{$selectionCount > 0 ? 'pointer' : 'not-allowed'};
					box-shadow:{$selectionCount > 0 ? '0 4px 16px rgba(245,200,66,0.2)' : 'none'};
				"
			>
				{$selectionCount > 0 ? `Select Odds to Bet` : 'Select Odds to Bet'}
			</button>
		</div>
	{:else}
		<div class="flex-1 flex items-center justify-center">
			<span class="text-[13px]" style="color:#5a5f72;">Jenga bets coming soon</span>
		</div>
	{/if}
</div>
