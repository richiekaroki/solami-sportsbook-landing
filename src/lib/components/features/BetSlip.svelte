<script lang="ts">
	import { betSlip, selections, selectionCount, totalOdds, stake, potentialWin, MIN_STAKE, MAX_STAKE } from '$lib/stores/betslip';
	import { toasts }    from '$lib/stores/toast';
	import { formatOdds, formatKES } from '$lib/utils/formatters';
	import { QUICK_STAKES } from '$lib/constants';
	import { trackBetPlaced } from '$lib/utils/tracking';
	import { X, Zap, ShoppingCart, AlertTriangle } from 'lucide-svelte';

	let sheetOpen    = $state(false);
	let activeMode   = $state<'single' | 'acca'>('single');
	let sheetEl: HTMLDivElement | undefined = $state();
	let showConfirm  = $state(false);

	const stakeInvalid = $derived($stake < MIN_STAKE || $stake > MAX_STAKE);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && sheetOpen) {
			sheetOpen = false;
			return;
		}
		// Quick-stake: keys 1-4 map to QUICK_STAKES when sheet is open
		if (sheetOpen && ['1','2','3','4'].includes(e.key)) {
			const idx = parseInt(e.key) - 1;
			if (idx < QUICK_STAKES.length) {
				$stake = QUICK_STAKES[idx];
				toasts.show(`Stake set to KSh ${QUICK_STAKES[idx]}`, 'info', 1500);
			}
			return;
		}
		if (e.key === 'Tab' && sheetOpen && sheetEl) {
			const focusable = sheetEl.querySelectorAll<HTMLElement>(
				'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
			);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	$effect(() => {
		if (sheetOpen && sheetEl) {
			const focusable = sheetEl.querySelectorAll<HTMLElement>(
				'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
			);
			if (focusable.length > 0) focusable[0].focus();
		}
	});

	function handlePlaceBet() {
		if ($selectionCount === 0 || stakeInvalid) return;
		showConfirm = true;
	}

	function confirmBet() {
		showConfirm = false;
		trackBetPlaced($selectionCount, $totalOdds, $stake, $potentialWin);
		toasts.show('Bet placed! Good luck!', 'success', 3000);
		betSlip.clear();
		sheetOpen = false;
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
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Floating cart button -->
{#if $selectionCount > 0}
	<button
		onclick={() => (sheetOpen = true)}
		aria-label="Open bet slip"
		class="xl:hidden fixed bottom-6 right-4 z-[90] flex items-center gap-2 px-4 py-3 rounded-full font-bold text-[14px] animate-slide-up cursor-pointer"
		style="background:var(--color-gold); color:var(--color-nav); box-shadow:0 6px 24px rgba(240,192,64,0.28);"
	>
		<ShoppingCart size={17} />
		Slip
		<span class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
			style="background:var(--color-nav); color:var(--color-gold);">
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
	<div bind:this={sheetEl} class="xl:hidden fixed bottom-0 left-0 right-0 z-[100] rounded-t-2xl flex flex-col animate-slide-up"
		role="dialog" aria-modal="true" aria-label="Bet slip"
		style="background:var(--color-nav); border-top:1px solid var(--color-border-light); max-height:92dvh;">

		<!-- Handle -->
		<div class="flex justify-center pt-3 pb-1 shrink-0">
			<div class="w-10 h-1 rounded-full" style="background:rgba(255,255,255,0.1);"></div>
		</div>

		<!-- Header -->
		<div class="flex items-center justify-between px-5 py-3 shrink-0"
			style="border-bottom:1px solid var(--color-border);">
			<div class="flex items-center gap-2.5">
				<span class="font-display text-[17px] tracking-[2px]" style="color:var(--color-text);">BET SLIP</span>
				<span class="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
					style="background:var(--color-gold); color:var(--color-nav);">
					{$selectionCount}
				</span>
			</div>
			<div class="flex items-center gap-3">
				<button onclick={() => { if ($selectionCount > 0) betSlip.clear(); }}
					aria-label="Clear all selections"
					class="text-[11px] font-medium cursor-pointer min-h-[44px] px-2 rounded-lg transition-colors hover:text-[var(--color-red)]"
					style="color:var(--color-text-muted);">Clear all</button>
			<button onclick={() => (sheetOpen = false)}
				aria-label="Close bet slip"
				class="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
				style="background:var(--color-card); color:var(--color-text-dim);"><X size={15} /></button>
			</div>
		</div>

		<!-- Tabs -->
		<div class="flex shrink-0 px-4 pt-3 gap-0" style="border-bottom:1px solid rgba(255,255,255,0.04);">
		{#each [{ id:'single', label:'Single' }, { id:'acca', label:'Accumulator' }] as tab}
			<button
				onclick={() => (activeMode = tab.id as 'single' | 'acca')}
					aria-label="{tab.label} bets"
					aria-pressed={activeMode === tab.id}
				class="flex-1 pb-2 text-[12px] font-bold uppercase tracking-[0.5px] transition-all cursor-pointer"
				style="color:{activeMode === tab.id ? 'var(--color-gold)' : 'var(--color-text-muted)'}; border-bottom:2px solid {activeMode === tab.id ? 'var(--color-gold)' : 'transparent'};"
			>{tab.label}</button>
		{/each}
		</div>

		<!-- Selections -->
		<div class="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-2.5" style="min-height:100px;">
			{#each $selections as sel (sel.oddId)}
				<div class="relative rounded-xl p-3.5 animate-slide-in-right"
					style="background:var(--color-card); border:1px solid var(--color-border);">
			<button onclick={() => removeSelection(sel.oddId)}
				aria-label="Remove {sel.pick}"
					class="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
					style="background:rgba(255,255,255,0.05); color:var(--color-text-dim);"><X size={10} /></button>
					<div class="text-[10px] mb-1 pr-8 truncate" style="color:var(--color-text-muted);">{sel.matchLabel}</div>
					<div class="flex items-center justify-between pl-2">
						<span class="text-[13px] font-semibold" style="color:var(--color-text);">{sel.pick}</span>
						<span class="font-mono text-[16px] font-bold" style="color:var(--color-gold);">{formatOdds(sel.odds)}</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Footer -->
		<div class="px-4 pb-8 flex flex-col gap-3 shrink-0"
			style="border-top:1px solid var(--color-border); padding-top:14px; background:rgba(8,10,15,0.9);">

			<!-- Quick stakes -->
			<div class="flex gap-1.5">
				{#each QUICK_STAKES as qs}
					<button onclick={() => ($stake = qs)}
						aria-label="Set stake to KSh {qs}"
						class="flex-1 min-h-[44px] py-2.5 rounded-lg text-[12px] font-bold transition-all duration-150 cursor-pointer"
						style="background:{$stake===qs ? 'rgba(240,192,64,0.12)' : 'rgba(255,255,255,0.04)'}; border:1px solid {$stake===qs ? 'rgba(240,192,64,0.3)' : 'var(--color-border)'}; color:{$stake===qs ? 'var(--color-gold)' : 'var(--color-text-dim)'};">
						{qs}
					</button>
				{/each}
			</div>

			<div class="flex items-center gap-3">
				<span class="text-[12px] whitespace-nowrap" style="color:var(--color-text-dim);">Stake (KSh)</span>
				<input type="number" bind:value={$stake} min={MIN_STAKE} max={MAX_STAKE} placeholder="100"
					aria-label="Stake amount in Kenyan shillings"
					class="flex-1 min-w-0 rounded-xl font-mono text-[14px] font-semibold px-4 py-2.5 outline-none"
					style="background:var(--color-card); border:1px solid {stakeInvalid && $stake > 0 ? 'rgba(239,68,68,0.5)' : 'var(--color-border)'}; color:var(--color-text);"
					onfocus={(e) => (e.currentTarget as HTMLElement).style.borderColor='rgba(240,192,64,0.35)'}
					onblur={(e)  => (e.currentTarget as HTMLElement).style.borderColor=''}
				/>
			</div>
			{#if stakeInvalid && $stake > 0}
				<div class="text-[10px] px-1" style="color:var(--color-red);">
					Min KSh {MIN_STAKE} · Max KSh {MAX_STAKE.toLocaleString()}
				</div>
			{/if}

			{#if activeMode === 'acca' && $selectionCount > 1}
				<div class="flex items-center justify-between px-1">
					<span class="text-[12px]" style="color:var(--color-text-dim);">Total Odds</span>
					<span class="font-mono font-bold" style="color:var(--color-text);">{formatOdds($totalOdds)}</span>
				</div>
			{/if}

			<div class="flex items-center justify-between px-1">
				<span class="text-[13px]" style="color:var(--color-text-dim);">Potential Win</span>
				<span class="font-mono text-[18px] font-bold" style="color:var(--color-green);">
					{$potentialWin > 0 ? formatKES($potentialWin) : 'KSh 0.00'}
				</span>
			</div>

		<button onclick={handlePlaceBet}
			disabled={$selectionCount === 0 || stakeInvalid}
			class="w-full py-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
				style="
					background:{$selectionCount > 0 && !stakeInvalid ? 'var(--color-green)' : 'var(--color-card)'};
					color:{$selectionCount > 0 && !stakeInvalid ? 'white' : 'var(--color-text-muted)'};
					cursor:{$selectionCount > 0 && !stakeInvalid ? 'pointer' : 'not-allowed'};
					box-shadow:{$selectionCount > 0 && !stakeInvalid ? '0 4px 18px rgba(34,197,94,0.25)' : 'none'};
				"
			>
				{#if $selectionCount > 0 && !stakeInvalid}
					<Zap size={16} />
					Place Bet — {formatKES($potentialWin > 0 ? $potentialWin : $stake * 1)}
				{:else if stakeInvalid && $stake > 0}
					Invalid stake
				{:else}
					<Zap size={16} />
					Select Odds to Bet
				{/if}
			</button>
		</div>
	</div>
{/if}

{#if showConfirm}
	<div class="fixed inset-0 z-[200] flex items-center justify-center px-4"
		style="background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);"
		onkeydown={(e) => { if (e.key === 'Escape') showConfirm = false; }}
		role="dialog" aria-modal="true" aria-label="Confirm bet"
		tabindex="-1"
	>
		<div class="w-full max-w-[360px] rounded-2xl p-5 flex flex-col gap-4 animate-scale-in"
			style="background:var(--color-nav); box-shadow:0 24px 60px rgba(0,0,0,0.45);">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full flex items-center justify-center"
					style="background:rgba(240,192,64,0.10);">
					<AlertTriangle size={18} style="color:var(--color-gold);" />
				</div>
				<div>
					<div class="text-[14px] font-bold" style="color:var(--color-text);">Confirm Bet</div>
					<div class="text-[11px]" style="color:var(--color-text-muted);">Review before placing</div>
				</div>
			</div>

			<div class="rounded-xl p-3 flex flex-col gap-2"
				style="background:var(--color-card); border:1px solid var(--color-border);">
				{#each $selections as sel (sel.oddId)}
					<div class="flex items-center justify-between text-[11px]">
						<span class="truncate" style="color:var(--color-text-dim);">{sel.pick}</span>
						<span class="font-mono font-bold ml-2 shrink-0" style="color:var(--color-gold);">{formatOdds(sel.odds)}</span>
					</div>
				{/each}
				<div style="border-top:1px solid var(--color-border); padding-top:6px; margin-top:2px;"></div>
				<div class="flex items-center justify-between text-[11px]">
					<span style="color:var(--color-text-dim);">Stake</span>
					<span class="font-mono font-bold" style="color:var(--color-text);">{formatKES($stake)}</span>
				</div>
				<div class="flex items-center justify-between text-[13px] font-bold" style="border-top:1px solid var(--color-border); padding-top:6px; margin-top:2px;">
					<span style="color:var(--color-text);">Potential Win</span>
					<span class="font-mono" style="color:var(--color-green);">{formatKES($potentialWin > 0 ? $potentialWin : $stake * $totalOdds)}</span>
				</div>
			</div>

			<div class="flex gap-2">
			<button onclick={cancelBet}
				aria-label="Cancel bet placement"
				class="flex-1 py-3 rounded-xl text-[13px] font-semibold transition-all cursor-pointer"
				style="background:var(--color-card); border:1px solid var(--color-border); color:var(--color-text-dim);">
				Cancel
			</button>
			<button onclick={confirmBet}
				aria-label="Confirm bet with stake {formatKES($stake)}"
				class="flex-1 py-3 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
				style="background:var(--color-green); color:white;">
				Confirm — {formatKES($stake)}
			</button>
			</div>
		</div>
	</div>
{/if}
