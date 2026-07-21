<script lang="ts">
	import {
		betSlip,
		selections,
		selectionCount,
		totalOdds,
		stake,
		potentialWin,
		taxBreakdown,
		MIN_STAKE,
		MAX_STAKE
	} from '$lib/stores/betslip';
	import { toasts } from '$lib/stores/toast';
	import { formatOdds, formatKES } from '$lib/utils/formatters';
	import { trackBetPlaced } from '$lib/utils/tracking';
	import { QUICK_STAKES } from '$lib/constants';
	import { X, Target, Zap, ChevronDown, ChevronUp, AlertTriangle, TrendingUp } from 'lucide-svelte';

	let activeMode = $state<'single' | 'acca'>('single');
	let showTax = $state(false);
	let showConfirm = $state(false);

	const stakeInvalid = $derived($stake < MIN_STAKE || $stake > MAX_STAKE);

	function handlePlaceBet() {
		if ($selectionCount === 0 || stakeInvalid) return;
		showConfirm = true;
	}

	function confirmBet() {
		showConfirm = false;
		trackBetPlaced($selectionCount, $totalOdds, $stake, $potentialWin);
		toasts.show('Bet placed! Check your M-PESA.', 'success', 3500);
		betSlip.clear();
	}

	function cancelBet() {
		showConfirm = false;
	}

	let undoTimeout: ReturnType<typeof setTimeout> | undefined;

	function removeSelection(oddId: number) {
		const sel = $selections.find((s) => s.oddId === oddId);
		if (!sel) return;
		betSlip.remove(oddId);
		toasts.show(`${sel.pick} removed`, 'remove', 5000, {
			label: 'Undo',
			fn: () => {
				clearTimeout(undoTimeout);
				betSlip.toggle(sel);
			}
		});
		undoTimeout = setTimeout(() => {}, 5100);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && showConfirm) {
			showConfirm = false;
			return;
		}
		// Quick-stake: keys 1-4 map to QUICK_STAKES
		if (['1', '2', '3', '4'].includes(e.key) && !showConfirm) {
			const idx = parseInt(e.key) - 1;
			if (idx < QUICK_STAKES.length) {
				$stake = QUICK_STAKES[idx];
				toasts.show(`Stake set to KSh ${QUICK_STAKES[idx]}`, 'info', 1500);
			}
		}
	}
</script>

<div class="flex flex-col h-full overflow-hidden" style="background:var(--color-nav);">
	<div
		class="flex shrink-0 px-3 pt-3 gap-0"
		style="border-bottom:1px solid rgba(255,255,255,0.04);"
	>
		{#each [{ id: 'single', label: 'Single' }, { id: 'acca', label: 'Accumulator' }] as tab}
			<button
				onclick={() => (activeMode = tab.id as 'single' | 'acca')}
				aria-label="{tab.label} bets"
				aria-pressed={activeMode === tab.id}
				class="flex-1 pb-2 text-[11px] font-bold uppercase tracking-[0.6px] transition-all cursor-pointer"
				style="color:{activeMode === tab.id
					? 'var(--color-gold)'
					: 'var(--color-text-muted)'}; border-bottom:2px solid {activeMode === tab.id
					? 'var(--color-gold)'
					: 'transparent'};">{tab.label}</button
			>
		{/each}
	</div>

	<div class="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2" style="min-height:160px;">
		{#if $selectionCount === 0}
			<div class="flex flex-col items-center justify-center gap-3 py-8 text-center h-full">
				<Target size={28} style="color:var(--color-text-muted); opacity:0.3;" />
				<div class="text-[13px] font-semibold" style="color:var(--color-text-muted);">
					No selections yet
				</div>
				<div class="text-[11px] leading-relaxed" style="color:rgba(107,114,128,0.5);">
					Click any odds button to add it
				</div>
				<div
					class="w-full mt-2 rounded-xl p-3"
					style="background:var(--color-card); border:1px solid var(--color-border);"
				>
					<div class="flex items-center gap-1.5 mb-2">
						<TrendingUp size={12} style="color:var(--color-gold);" />
						<span
							class="text-[10px] font-bold uppercase tracking-[0.8px]"
							style="color:var(--color-gold);"
						>
							Popular picks
						</span>
					</div>
					<div class="flex flex-col gap-1.5">
						{#each [{ match: 'Barcelona vs Atletico', pick: 'Home win', odds: '1.85' }, { match: 'Barcelona vs Atletico', pick: 'Over 2.5', odds: '1.72' }, { match: 'Barcelona vs Atletico', pick: 'BTTS Yes', odds: '1.68' }] as tip}
							<div class="flex items-center justify-between text-[10px]">
								<span style="color:var(--color-text-muted);">{tip.pick}</span>
								<span class="font-mono font-bold" style="color:var(--color-text-dim);"
									>{tip.odds}</span
								>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			{#each $selections as sel (sel.oddId)}
				<div
					class="relative rounded-xl p-3 animate-slide-in-right"
					style="background:var(--color-card); border:1px solid var(--color-border);"
				>
					<button
						onclick={() => removeSelection(sel.oddId)}
						aria-label="Remove {sel.pick} from bet slip"
						class="absolute top-2.5 right-2.5 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-[var(--color-red)] hover:text-white cursor-pointer"
						style="background:rgba(255,255,255,0.05); color:var(--color-text-muted);"
						><X size={10} /></button
					>
					<div class="text-[10px] mb-0.5 pr-6 truncate" style="color:var(--color-text-muted);">
						{sel.matchLabel}
					</div>
					<div class="text-[10px] mb-1.5 truncate" style="color:var(--color-text-dim);">
						{sel.competition}
					</div>
					<div class="flex items-center justify-between pl-2">
						<span class="text-[12px] font-semibold truncate" style="color:var(--color-text);"
							>{sel.pick}</span
						>
						<span class="font-mono text-[14px] font-bold ml-2" style="color:var(--color-gold);"
							>{formatOdds(sel.odds)}</span
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<div
		class="px-3 pb-4 flex flex-col gap-2 shrink-0"
		style="border-top:1px solid var(--color-border); padding-top:10px; background:rgba(8,10,15,0.85);"
	>
		{#if activeMode === 'acca' && $selectionCount > 1}
			<div class="flex items-center justify-between text-[11px] px-1">
				<span style="color:var(--color-text-dim);">Total odds</span>
				<span class="font-mono font-bold" style="color:var(--color-text);"
					>{formatOdds($totalOdds)}</span
				>
			</div>
		{/if}

		<div class="flex gap-1.5">
			{#each QUICK_STAKES as qs}
				<button
					onclick={() => ($stake = qs)}
					aria-label="Set stake to KSh {qs}"
					class="flex-1 min-h-[44px] py-2.5 rounded-lg text-[11px] font-bold transition-all duration-150"
					style="
							background:{$stake === qs ? 'rgba(240,192,64,0.12)' : 'rgba(255,255,255,0.03)'};
							border:1px solid {$stake === qs ? 'rgba(240,192,64,0.3)' : 'var(--color-border)'};
							color:{$stake === qs ? 'var(--color-gold)' : 'var(--color-text-dim)'};
						">{qs}</button
				>
			{/each}
		</div>

		<div class="flex items-center gap-2">
			<span class="text-[11px] whitespace-nowrap" style="color:var(--color-text-dim);"
				>Stake (KSh)</span
			>
			<input
				type="number"
				bind:value={$stake}
				min={MIN_STAKE}
				max={MAX_STAKE}
				placeholder="100"
				aria-label="Stake amount in Kenyan shillings"
				class="flex-1 min-w-0 rounded-lg font-mono text-[13px] font-semibold px-3 py-2 outline-none transition-colors focus:ring-0"
				style="
						background:var(--color-card);
						border:1px solid {stakeInvalid ? 'rgba(239,68,68,0.5)' : 'var(--color-border)'};
						color:var(--color-text);
					"
			/>
		</div>
		{#if stakeInvalid && $stake > 0}
			<div class="text-[10px] px-1" style="color:var(--color-red);">
				Min KSh {MIN_STAKE} · Max KSh {MAX_STAKE.toLocaleString()}
			</div>
		{/if}

		{#if $taxBreakdown && $selectionCount > 0}
			<div
				class="rounded-xl overflow-hidden"
				style="background:var(--color-card); border:1px solid var(--color-border);"
			>
				<button
					onclick={() => (showTax = !showTax)}
					aria-label={showTax ? 'Hide payout breakdown' : 'Show payout breakdown'}
					aria-expanded={showTax}
					class="w-full flex items-center justify-between px-3 py-2 hover-bg-subtle transition-colors cursor-pointer"
				>
					<span class="text-[11px] font-semibold" style="color:var(--color-text-dim);"
						>Payout breakdown (KRA)</span
					>
					{#if showTax}<ChevronUp
							size={13}
							style="color:var(--color-text-muted);"
						/>{:else}<ChevronDown size={13} style="color:var(--color-text-muted);" />{/if}
				</button>

				{#if showTax}
					<div
						class="px-3 pb-3 flex flex-col gap-1"
						style="border-top:1px solid rgba(255,255,255,0.04);"
					>
						<div class="flex justify-between text-[10px] pt-2">
							<span style="color:var(--color-text-muted);">Stake</span>
							<span class="font-mono" style="color:var(--color-text-dim);">{formatKES($stake)}</span
							>
						</div>
						<div class="flex justify-between text-[10px]">
							<span style="color:var(--color-text-muted);">Excise duty (7.5%)</span>
							<span class="font-mono" style="color:var(--color-red);"
								>-{formatKES($taxBreakdown.excise)}</span
							>
						</div>
						<div
							class="flex justify-between text-[10px]"
							style="border-top:1px solid rgba(255,255,255,0.03); padding-top:4px;"
						>
							<span style="color:var(--color-text-muted);">Net stake</span>
							<span class="font-mono" style="color:var(--color-text-dim);"
								>{formatKES($taxBreakdown.netStake)}</span
							>
						</div>
						<div class="flex justify-between text-[10px]">
							<span style="color:var(--color-text-muted);">Gross winnings</span>
							<span class="font-mono" style="color:var(--color-text-dim);"
								>{formatKES($taxBreakdown.grossWin)}</span
							>
						</div>
						<div class="flex justify-between text-[10px]">
							<span style="color:var(--color-text-muted);">WHT (20%)</span>
							<span class="font-mono" style="color:var(--color-red);"
								>-{formatKES($taxBreakdown.wht)}</span
							>
						</div>
						<div
							class="flex justify-between text-[11px] font-bold pt-1"
							style="border-top:1px solid var(--color-border);"
						>
							<span style="color:var(--color-text);">Net payout</span>
							<span class="font-mono" style="color:var(--color-green);"
								>{formatKES($taxBreakdown.netPayout)}</span
							>
						</div>
					</div>
				{/if}
			</div>

			{#if !showTax}
				<div class="flex items-center justify-between px-1">
					<span class="text-[11px]" style="color:var(--color-text-dim);"
						>Net payout (after tax)</span
					>
					<span class="font-mono text-[14px] font-bold" style="color:var(--color-green);">
						{formatKES($taxBreakdown.netPayout)}
					</span>
				</div>
			{/if}
		{:else}
			<div class="flex items-center justify-between px-1">
				<span class="text-[11px]" style="color:var(--color-text-dim);">Potential Win</span>
				<span class="font-mono text-[14px] font-bold" style="color:var(--color-green);"
					>KSh 0.00</span
				>
			</div>
		{/if}

		<button
			onclick={handlePlaceBet}
			disabled={$selectionCount === 0 || stakeInvalid}
			class="w-full py-3 rounded-xl font-bold text-[13px] transition-all duration-200 flex items-center justify-center gap-2 hover-lift cursor-pointer"
			style="
					background:{$selectionCount > 0 && !stakeInvalid ? 'var(--color-green)' : 'var(--color-card)'};
					color:{$selectionCount > 0 && !stakeInvalid ? 'white' : 'var(--color-text-muted)'};
					cursor:{$selectionCount > 0 && !stakeInvalid ? 'pointer' : 'not-allowed'};
					box-shadow:{$selectionCount > 0 && !stakeInvalid ? '0 4px 18px rgba(34,197,94,0.2)' : 'none'};
				"
		>
			{#if $selectionCount > 0 && !stakeInvalid}
				<Zap size={14} />
				Place Bet — {$selectionCount} bet{$selectionCount > 1 ? 's' : ''}
			{:else if stakeInvalid && $stake > 0}
				<Zap size={14} />
				Invalid stake amount
			{:else}
				<Zap size={14} />
				Select Odds to Bet
			{/if}
		</button>
	</div>
</div>

{#if showConfirm}
	<div
		class="fixed inset-0 z-[200] flex items-center justify-center px-4"
		style="background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);"
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-label="Confirm bet"
		tabindex="-1"
	>
		<div
			class="w-full max-w-[360px] rounded-2xl p-5 flex flex-col gap-4 animate-scale-in"
			style="background:var(--color-nav); box-shadow:0 16px 48px rgba(0,0,0,0.4);"
		>
			<div class="flex items-center gap-3">
				<div
					class="w-10 h-10 rounded-full flex items-center justify-center"
					style="background:rgba(240,192,64,0.10); border:1px solid rgba(240,192,64,0.2);"
				>
					<AlertTriangle size={18} style="color:var(--color-gold);" />
				</div>
				<div>
					<div class="text-[14px] font-bold" style="color:var(--color-text);">Confirm Bet</div>
					<div class="text-[11px]" style="color:var(--color-text-muted);">
						Review before placing
					</div>
				</div>
			</div>

			<div
				class="rounded-xl p-3 flex flex-col gap-2"
				style="background:var(--color-card); border:1px solid var(--color-border);"
			>
				{#each $selections as sel (sel.oddId)}
					<div class="flex items-center justify-between text-[11px]">
						<span class="truncate" style="color:var(--color-text-dim);">{sel.pick}</span>
						<span class="font-mono font-bold ml-2 shrink-0" style="color:var(--color-gold);"
							>{formatOdds(sel.odds)}</span
						>
					</div>
				{/each}
				<div
					style="border-top:1px solid var(--color-border); padding-top:6px; margin-top:2px;"
				></div>
				<div class="flex items-center justify-between text-[11px]">
					<span style="color:var(--color-text-dim);">Stake</span>
					<span class="font-mono font-bold" style="color:var(--color-text);"
						>{formatKES($stake)}</span
					>
				</div>
				{#if $taxBreakdown}
					<div class="flex items-center justify-between text-[11px]">
						<span style="color:var(--color-text-dim);">Tax (excise + WHT)</span>
						<span class="font-mono" style="color:var(--color-red);"
							>-{formatKES($taxBreakdown.excise + $taxBreakdown.wht)}</span
						>
					</div>
				{/if}
				<div
					class="flex items-center justify-between text-[13px] font-bold"
					style="border-top:1px solid var(--color-border); padding-top:6px; margin-top:2px;"
				>
					<span style="color:var(--color-text);">Net Payout</span>
					<span class="font-mono" style="color:var(--color-green);">
						{$taxBreakdown ? formatKES($taxBreakdown.netPayout) : formatKES($stake * $totalOdds)}
					</span>
				</div>
			</div>

			<div class="flex gap-2">
				<button
					onclick={cancelBet}
					aria-label="Cancel bet placement"
					class="flex-1 py-3 rounded-xl text-[13px] font-semibold transition-all hover-bg-subtle cursor-pointer"
					style="background:var(--color-card); border:1px solid var(--color-border); color:var(--color-text-dim);"
				>
					Cancel
				</button>
				<button
					onclick={confirmBet}
					aria-label="Confirm bet with stake {formatKES($stake)}"
					class="flex-1 py-3 rounded-xl text-[13px] font-bold transition-all hover-lift cursor-pointer"
					style="background:var(--color-green); color:white; box-shadow:0 4px 18px rgba(34,197,94,0.25);"
				>
					Confirm — {formatKES($stake)}
				</button>
			</div>
		</div>
	</div>
{/if}
