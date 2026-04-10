<script lang="ts">
	import {
		betSlip, selections, selectionCount, totalOdds,
		stake, potentialWin, taxBreakdown, MIN_STAKE, MAX_STAKE,
	} from '$lib/stores/betslip';
	import { toasts }  from '$lib/stores/toast';
	import { formatOdds, formatKES } from '$lib/utils/formatters';
	import { trackBetPlaced } from '$lib/utils/tracking';
	import { X, Target, Zap, Smartphone, ChevronDown, ChevronUp } from 'lucide-svelte';

	let activeTab   = $state<'betslip' | 'jenga'>('betslip');
	let activeMode  = $state<'single' | 'acca'>('single');
	let showTax     = $state(false);

	const QUICK_STAKES = [50, 100, 200, 500];

	const stakeInvalid = $derived($stake < MIN_STAKE || $stake > MAX_STAKE);

	function handlePlaceBet() {
		if ($selectionCount === 0 || stakeInvalid) return;
		trackBetPlaced($selectionCount, $totalOdds, $stake, $potentialWin);
		toasts.show('🎉 Bet placed! Check your M-PESA.', 'success', 3500);
		betSlip.clear();
	}
</script>

<div class="flex flex-col h-full overflow-hidden" style="background:#0d0f14;">

	<!-- Top tabs -->
	<div class="flex shrink-0" style="border-bottom:1px solid rgba(255,255,255,0.07);">
		{#each [{ id:'betslip', label:`Betslip (${$selectionCount})` }, { id:'jenga', label:'Jenga bets (0)' }] as tab}
			<button
				onclick={() => { activeTab = tab.id as 'betslip'|'jenga'; if (tab.id==='jenga') toasts.show('Jenga bets — coming soon!','info'); }}
				class="flex-1 py-3 text-[12px] font-semibold transition-all duration-150"
				style="
					background:{activeTab===tab.id ? '#13161f' : 'transparent'};
					color:{activeTab===tab.id ? '#e4e8f0' : '#4d5568'};
					border-bottom:2px solid {activeTab===tab.id ? '#f5c842' : 'transparent'};
				"
			>{tab.label}</button>
		{/each}
	</div>

	{#if activeTab === 'betslip'}
		<!-- Single / Acca sub-tabs -->
		<div class="flex shrink-0 px-3 pt-3 gap-0" style="border-bottom:1px solid rgba(255,255,255,0.05);">
			{#each [{ id:'single', label:'Single' }, { id:'acca', label:'Accumulator' }] as tab}
				<button
					onclick={() => (activeMode = tab.id as 'single'|'acca')}
					class="flex-1 pb-2 text-[11px] font-bold uppercase tracking-[0.6px] transition-all"
					style="color:{activeMode===tab.id ? '#f5c842' : '#4d5568'}; border-bottom:2px solid {activeMode===tab.id ? '#f5c842' : 'transparent'};"
				>{tab.label}</button>
			{/each}
		</div>

		<!-- Selections -->
		<div class="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2" style="min-height:160px;">
			{#if $selectionCount === 0}
				<div class="flex flex-col items-center justify-center gap-3 py-10 text-center h-full">
					<Target size={32} style="color:#4d5568; opacity:0.35;" />
					<div class="text-[13px]" style="color:#4d5568;">No selections yet</div>
					<div class="text-[11px] leading-relaxed" style="color:rgba(77,85,104,0.55);">
						Click any odds button<br />to add to your slip
					</div>
				</div>
			{:else}
				{#each $selections as sel (sel.oddId)}
					<div class="relative rounded-xl p-3 animate-slide-in-right"
						style="background:#13161f; border:1px solid rgba(255,255,255,0.07);">
						<div class="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
							style="background:linear-gradient(180deg,#f5c842,rgba(245,200,66,0.25));"></div>
						<button
							onclick={() => betSlip.remove(sel.oddId)}
							class="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-all"
							style="background:#1a1e2a; color:#4d5568;"
							onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='#ef4444'; el.style.color='white'; }}
							onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='#1a1e2a'; el.style.color='#4d5568'; }}
						><X size={9} /></button>
						<div class="text-[10px] mb-0.5 pr-6 truncate" style="color:#4d5568;">{sel.matchLabel}</div>
						<div class="text-[10px] mb-1.5" style="color:#8892a4;">{sel.competition}</div>
						<div class="flex items-center justify-between pl-2">
							<span class="text-[12px] font-semibold truncate" style="color:#e4e8f0;">{sel.pick}</span>
							<span class="font-mono text-[14px] font-bold ml-2" style="color:#f5c842;">{formatOdds(sel.odds)}</span>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Footer: stake + tax + CTA -->
		<div class="px-3 pb-4 flex flex-col gap-2 shrink-0"
			style="border-top:1px solid rgba(255,255,255,0.07); padding-top:10px; background:rgba(13,15,20,0.85);">

			{#if activeMode === 'acca' && $selectionCount > 1}
				<div class="flex items-center justify-between text-[11px] px-1">
					<span style="color:#8892a4;">Total odds</span>
					<span class="font-mono font-bold text-white">{formatOdds($totalOdds)}</span>
				</div>
			{/if}

			<!-- Quick stakes -->
			<div class="flex gap-1.5">
				{#each QUICK_STAKES as qs}
					<button onclick={() => ($stake = qs)}
						class="flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150"
						style="
							background:{$stake===qs ? 'rgba(245,200,66,0.15)' : 'rgba(255,255,255,0.04)'};
							border:1px solid {$stake===qs ? 'rgba(245,200,66,0.4)' : 'rgba(255,255,255,0.07)'};
							color:{$stake===qs ? '#f5c842' : '#8892a4'};
						"
					>{qs}</button>
				{/each}
			</div>

			<!-- Stake input -->
			<div class="flex items-center gap-2">
				<span class="text-[11px] whitespace-nowrap" style="color:#8892a4;">Stake (KSh)</span>
				<input type="number" bind:value={$stake} min={MIN_STAKE} max={MAX_STAKE} placeholder="100"
					class="flex-1 min-w-0 rounded-lg font-mono text-[13px] font-semibold text-white px-3 py-2 outline-none transition-colors"
					style="
						background:#13161f;
						border:1px solid {stakeInvalid ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'};
					"
					onfocus={(e) => (e.currentTarget as HTMLElement).style.borderColor='rgba(245,200,66,0.45)'}
					onblur={(e) => (e.currentTarget as HTMLElement).style.borderColor= stakeInvalid ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}
				/>
			</div>
			{#if stakeInvalid && $stake > 0}
				<div class="text-[10px] px-1" style="color:#ef4444;">
					Min KSh {MIN_STAKE} · Max KSh {MAX_STAKE.toLocaleString()}
				</div>
			{/if}

			<!-- ── Kenya Tax Breakdown ── -->
			{#if $taxBreakdown && $selectionCount > 0}
				<div class="rounded-xl overflow-hidden" style="background:#13161f; border:1px solid rgba(255,255,255,0.06);">
					<!-- Toggle header -->
					<button
						onclick={() => (showTax = !showTax)}
						class="w-full flex items-center justify-between px-3 py-2 transition-colors"
						onmouseenter={(e) => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.03)'}
						onmouseleave={(e) => (e.currentTarget as HTMLElement).style.background='transparent'}
					>
						<span class="text-[11px] font-semibold" style="color:#8892a4;">Payout breakdown (KRA)</span>
						{#if showTax}<ChevronUp size={13} style="color:#4d5568;"/>{:else}<ChevronDown size={13} style="color:#4d5568;"/>{/if}
					</button>

					{#if showTax}
						<div class="px-3 pb-3 flex flex-col gap-1" style="border-top:1px solid rgba(255,255,255,0.05);">
							<div class="flex justify-between text-[10px] pt-2">
								<span style="color:#4d5568;">Stake</span>
								<span class="font-mono" style="color:#8892a4;">{formatKES($stake)}</span>
							</div>
							<div class="flex justify-between text-[10px]">
								<span style="color:#4d5568;">Excise duty (7.5%)</span>
								<span class="font-mono" style="color:#ef4444;">-{formatKES($taxBreakdown.excise)}</span>
							</div>
							<div class="flex justify-between text-[10px]" style="border-top:1px solid rgba(255,255,255,0.04); padding-top:4px;">
								<span style="color:#4d5568;">Net stake</span>
								<span class="font-mono" style="color:#8892a4;">{formatKES($taxBreakdown.netStake)}</span>
							</div>
							<div class="flex justify-between text-[10px]">
								<span style="color:#4d5568;">Gross winnings</span>
								<span class="font-mono" style="color:#8892a4;">{formatKES($taxBreakdown.grossWin)}</span>
							</div>
							<div class="flex justify-between text-[10px]">
								<span style="color:#4d5568;">WHT (20%)</span>
								<span class="font-mono" style="color:#ef4444;">-{formatKES($taxBreakdown.wht)}</span>
							</div>
							<div class="flex justify-between text-[11px] font-bold pt-1" style="border-top:1px solid rgba(255,255,255,0.06);">
								<span style="color:#e4e8f0;">Net payout</span>
								<span class="font-mono" style="color:#22c55e;">{formatKES($taxBreakdown.netPayout)}</span>
							</div>
						</div>
					{/if}
				</div>

				<!-- Net payout always visible -->
				{#if !showTax}
					<div class="flex items-center justify-between px-1">
						<span class="text-[11px]" style="color:#8892a4;">Net payout (after tax)</span>
						<span class="font-mono text-[14px] font-bold" style="color:#22c55e; text-shadow:0 0 10px rgba(34,197,94,0.35);">
							{formatKES($taxBreakdown.netPayout)}
						</span>
					</div>
				{/if}
			{:else}
				<div class="flex items-center justify-between px-1">
					<span class="text-[11px]" style="color:#8892a4;">Potential Win</span>
					<span class="font-mono text-[14px] font-bold" style="color:#22c55e;">KSh 0.00</span>
				</div>
			{/if}

			<!-- M-PESA CTA button -->
			<button
				onclick={handlePlaceBet}
				disabled={$selectionCount === 0 || stakeInvalid}
				class="w-full py-3 rounded-xl font-bold text-[13px] transition-all duration-200 flex items-center justify-center gap-2"
				style="
					background:{$selectionCount > 0 && !stakeInvalid ? '#4CAF50' : '#13161f'};
					color:{$selectionCount > 0 && !stakeInvalid ? 'white' : '#4d5568'};
					cursor:{$selectionCount > 0 && !stakeInvalid ? 'pointer' : 'not-allowed'};
					box-shadow:{$selectionCount > 0 && !stakeInvalid ? '0 4px 18px rgba(76,175,80,0.25)' : 'none'};
				"
				onmouseenter={(e) => { if ($selectionCount > 0 && !stakeInvalid) { const el = e.currentTarget as HTMLElement; el.style.background='#43A047'; el.style.transform='translateY(-1px)'; } }}
				onmouseleave={(e) => { if ($selectionCount > 0 && !stakeInvalid) { const el = e.currentTarget as HTMLElement; el.style.background='#4CAF50'; el.style.transform=''; } }}
			>
				{#if $selectionCount > 0 && !stakeInvalid}
					<Smartphone size={14} />
					Pay via M-PESA ({$selectionCount} bet{$selectionCount > 1 ? 's' : ''})
				{:else if stakeInvalid && $stake > 0}
					<Zap size={14} />
					Invalid stake amount
				{:else}
					<Zap size={14} />
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
