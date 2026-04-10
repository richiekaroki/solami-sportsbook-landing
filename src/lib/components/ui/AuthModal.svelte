<script lang="ts">
	import { formatKEPhone } from '$lib/utils/formatters';
	import { trackAuthModalOpen, trackSignupIntent } from '$lib/utils/tracking';
	import { Eye, EyeOff, Lock, Phone, Smartphone, X } from 'lucide-svelte';

	interface Props {
		open:    boolean;
		mode?:   'login' | 'signup';
		onClose: () => void;
	}

	let { open = $bindable(), mode = 'signup', onClose }: Props = $props();

let activeMode   = $state<'login' | 'signup'>('signup');
$effect(() => {
    activeMode = mode;
});	let phone        = $state('');
	let mpesa        = $state('');
	let password     = $state('');
	let showPass     = $state(false);
	let loading      = $state(false);
	let step         = $state<'form' | 'success'>('form');

	// Auto-format phone as user types
	let phoneRaw = $state('');
	$effect(() => {
		phone = formatKEPhone(phoneRaw);
	});

	// Mirror MPESA from phone
	$effect(() => {
		if (activeMode === 'signup' && mpesa === '') {
			mpesa = phone;
		}
	});

	// Sync activeMode with prop
	$effect(() => {
		activeMode = mode;
	});

	const phoneValid  = $derived(phoneRaw.replace(/\D/g,'').length === 10 && (phoneRaw.startsWith('07') || phoneRaw.startsWith('01')));
	const mpesaValid  = $derived(mpesa.replace(/\D/g,'').length === 10);
	const passValid   = $derived(password.length >= 6);
	const canSubmit   = $derived(
		activeMode === 'login'
			? phoneValid && passValid
			: phoneValid && mpesaValid && passValid
	);

	function handleSubmit() {
		if (!canSubmit || loading) return;
		loading = true;
		trackSignupIntent(activeMode === 'signup' ? 'auth_modal_signup' : 'auth_modal_login');

		setTimeout(() => {
			loading = false;
			step = 'success';
		}, 1800);
	}

	function handleClose() {
		onClose();
		// Reset after close animation
		setTimeout(() => {
			step = 'form';
			phoneRaw = '';
			mpesa = '';
			password = '';
			loading = false;
		}, 300);
	}

	$effect(() => {
		if (open) trackAuthModalOpen('header');
	});
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-[200] flex items-center justify-center px-4 animate-fade-in"
		style="background:rgba(0,0,0,0.75); backdrop-filter:blur(6px);"
		onclick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
		role="presentation"
	>
		<!-- Modal panel -->
		<div
			class="relative w-full max-w-[400px] rounded-2xl overflow-hidden animate-slide-up"
			style="background:#0d1120; border:1px solid rgba(255,255,255,0.1); box-shadow:0 32px 80px rgba(0,0,0,0.6);"
		>
			<!-- Gold top accent -->
			<div class="h-[3px] w-full" style="background:linear-gradient(90deg, #f5c842, #ffd700, #f5c842);"></div>

			{#if step === 'form'}
				<!-- Header -->
				<div class="flex items-center justify-between px-6 pt-5 pb-4">
					<div>
						<div class="flex items-center gap-2 mb-0.5">
							<span class="w-2 h-2 rounded-full bg-[#f5c842]"></span>
							<span class="font-display text-[20px] tracking-[2px] text-white">SOLAMI</span>
						</div>
						<p class="text-[12px]" style="color:#4d5568;">
							{activeMode === 'signup' ? 'Create your free account' : 'Welcome back'}
						</p>
					</div>
					<button onclick={handleClose}
						class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
						style="background:#1a1e2a; color:#8892a4;"
						onmouseenter={(e) => (e.currentTarget as HTMLElement).style.background='#2a2f3e'}
						onmouseleave={(e) => (e.currentTarget as HTMLElement).style.background='#1a1e2a'}
					><X size={15} /></button>
				</div>

				<!-- Mode toggle -->
				<div class="flex mx-6 mb-5 rounded-xl overflow-hidden" style="background:#13161f; border:1px solid rgba(255,255,255,0.07);">
					{#each [{ id:'signup', label:'Sign Up' }, { id:'login', label:'Log In' }] as m}
						<button
							onclick={() => { activeMode = m.id as 'login'|'signup'; mpesa = ''; }}
							class="flex-1 py-2.5 text-[13px] font-bold transition-all duration-150 rounded-xl"
							style="
								background:{activeMode===m.id ? '#f5c842' : 'transparent'};
								color:{activeMode===m.id ? '#0b1628' : '#4d5568'};
							"
						>{m.label}</button>
					{/each}
				</div>

				<!-- Bonus chip (signup only) -->
				{#if activeMode === 'signup'}
					<div class="mx-6 mb-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
						style="background:linear-gradient(135deg,rgba(34,197,94,0.1),rgba(34,197,94,0.05)); border:1px solid rgba(34,197,94,0.2);">
						<span class="text-lg">🎁</span>
						<div>
							<div class="text-[12px] font-bold" style="color:#22c55e;">Claim KSh 500 Welcome Bonus</div>
							<div class="text-[10px]" style="color:rgba(34,197,94,0.6);">Deposit KSh 100 via M-PESA to unlock</div>
						</div>
					</div>
				{/if}

				<!-- Form -->
				<div class="px-6 flex flex-col gap-3">
					<!-- Phone number -->
					<div>
						<label for="auth-phone" class="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.8px]" style="color:#4d5568;">
							Phone Number
						</label>
						<div class="flex items-center gap-2 rounded-xl px-3.5 py-3 transition-all duration-150"
							style="background:#13161f; border:1px solid rgba(255,255,255,0.08);"
							onfocusin={(e: FocusEvent) => ((e.currentTarget as HTMLElement).style.borderColor='rgba(245,200,66,0.45)')}
							onfocusout={(e: FocusEvent) => ((e.currentTarget as HTMLElement).style.borderColor=phoneValid ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)')}
						>
							<Phone size={15} style="color:#4d5568; flex-shrink:0;" />
							<span class="text-[12px] font-mono shrink-0" style="color:#4d5568;">+254</span>
							<input
								id="auth-phone"
								type="tel"
								bind:value={phoneRaw}
								placeholder="0712 345 678"
								maxlength="10"
								class="flex-1 bg-transparent outline-none font-mono text-[14px] font-semibold"
								style="color:#e4e8f0;"
							/>
							{#if phoneValid}
								<span class="text-[10px] shrink-0" style="color:#22c55e;">✓</span>
							{/if}
						</div>
						<div class="text-[10px] mt-1 px-1" style="color:#4d5568;">Must start with 07 or 01</div>
					</div>

					<!-- M-PESA number (signup only) -->
					{#if activeMode === 'signup'}
						<div>
							<label for="auth-mpesa" class="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.8px]" style="color:#4d5568;">
								M-PESA Number
								<span class="normal-case ml-1 text-[10px]" style="color:rgba(77,85,104,0.6);">(for deposits & withdrawals)</span>
							</label>
							<div class="flex items-center gap-2 rounded-xl px-3.5 py-3 transition-all duration-150"
								style="background:#13161f; border:1px solid rgba(255,255,255,0.08);"
								onfocusin={(e: FocusEvent) => ((e.currentTarget as HTMLElement).style.borderColor='rgba(76,175,80,0.5)')}
								onfocusout={(e: FocusEvent) => ((e.currentTarget as HTMLElement).style.borderColor=mpesaValid ? 'rgba(76,175,80,0.4)' : 'rgba(255,255,255,0.08)')}
							>
								<Smartphone size={15} style="color:#4CAF50; flex-shrink:0;" />
								<span class="text-[11px] font-bold shrink-0" style="color:#4CAF50;">M-PESA</span>
								<input
									id="auth-mpesa"
									type="tel"
									bind:value={mpesa}
									placeholder="Same as phone"
									class="flex-1 bg-transparent outline-none font-mono text-[14px] font-semibold"
									style="color:#e4e8f0;"
								/>
								{#if mpesaValid}
									<span class="text-[10px] shrink-0" style="color:#4CAF50;">✓</span>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Password -->
					<div>
						<label for="auth-password" class="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.8px]" style="color:#4d5568;">
							Password
						</label>
						<div class="flex items-center gap-2 rounded-xl px-3.5 py-3 transition-all duration-150"
							style="background:#13161f; border:1px solid rgba(255,255,255,0.08);"
							onfocusin={(e: FocusEvent) => ((e.currentTarget as HTMLElement).style.borderColor='rgba(245,200,66,0.45)')}
							onfocusout={(e: FocusEvent) => ((e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)')}
						>
							<Lock size={15} style="color:#4d5568; flex-shrink:0;" />
							<input
								id="auth-password"
								type={showPass ? 'text' : 'password'}
								bind:value={password}
								placeholder="Min. 6 characters"
								class="flex-1 bg-transparent outline-none text-[14px] font-semibold"
								style="color:#e4e8f0;"
							/>
							<button onclick={() => (showPass = !showPass)} style="color:#4d5568;" type="button">
								{#if showPass}<EyeOff size={14} />{:else}<Eye size={14} />{/if}
							</button>
						</div>
					</div>

					<!-- Submit -->
					<button
						onclick={handleSubmit}
						disabled={!canSubmit || loading}
						class="w-full py-3.5 rounded-xl font-bold text-[14px] mt-1 mb-2 transition-all duration-200 flex items-center justify-center gap-2"
						style="
							background:{canSubmit ? '#f5c842' : '#1a1e2a'};
							color:{canSubmit ? '#0b1628' : '#4d5568'};
							cursor:{canSubmit ? 'pointer' : 'not-allowed'};
							box-shadow:{canSubmit ? '0 4px 20px rgba(245,200,66,0.25)' : 'none'};
						"
					>
						{#if loading}
							<span class="w-4 h-4 rounded-full border-2 border-[#0b1628] border-t-transparent animate-spin"></span>
							Verifying...
						{:else if activeMode === 'signup'}
							🎯 Create Account & Claim Bonus
						{:else}
							🔑 Log In
						{/if}
					</button>

					<!-- Legal -->
					<p class="text-center text-[10px] pb-5 leading-relaxed" style="color:#4d5568;">
						{#if activeMode === 'signup'}
							By signing up you agree to our <span style="color:#8892a4;">Terms</span> &
							<span style="color:#8892a4;">Privacy Policy</span>. 18+ only. Gamble responsibly.
							Licensed by <span style="color:#8892a4;">BCLB Kenya</span>.
						{:else}
							<span style="color:#8892a4; cursor:pointer;">Forgot password?</span>
						{/if}
					</p>
				</div>

			{:else}
				<!-- Success state -->
				<div class="px-6 py-10 flex flex-col items-center text-center gap-4">
					<div class="w-16 h-16 rounded-full flex items-center justify-center text-3xl animate-slide-up"
						style="background:rgba(34,197,94,0.12); border:2px solid rgba(34,197,94,0.3);">
						🎯
					</div>
					<div class="animate-slide-up" style="animation-delay:0.08s;">
						<div class="font-display text-[28px] tracking-[2px] text-white mb-1">YOU'RE IN!</div>
						<div class="text-[13px]" style="color:#8892a4;">Account created successfully.</div>
					</div>
					<div class="w-full rounded-xl p-4 animate-slide-up" style="animation-delay:0.16s; background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2);">
						<div class="text-[12px] font-bold mb-1" style="color:#22c55e;">✅ KSh 500 Bonus Activated</div>
						<div class="text-[11px]" style="color:rgba(34,197,94,0.7);">Deposit KSh 100 via M-PESA to unlock your bonus. Check your phone for the prompt.</div>
					</div>
					<button onclick={handleClose}
						class="w-full py-3 rounded-xl font-bold text-[14px] mt-2 animate-slide-up"
						style="animation-delay:0.24s; background:#f5c842; color:#0b1628;">
						Start Betting →
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes spin {
		from { transform: rotate(0deg); }
		to   { transform: rotate(360deg); }
	}
	.animate-spin { animation: spin 0.7s linear infinite; }
</style>