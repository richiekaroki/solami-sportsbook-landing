<script lang="ts">
	import {
		X,
		Eye,
		EyeOff,
		Phone,
		Lock,
		Smartphone,
		Gift,
		Crosshair,
		CheckCircle,
		Key
	} from 'lucide-svelte';
	import { formatKEPhone } from '$lib/utils/formatters';
	import { trackSignupIntent, trackAuthModalOpen } from '$lib/utils/tracking';

	interface Props {
		open: boolean;
		mode?: 'login' | 'signup';
		onClose: () => void;
	}

	let { open = $bindable(), mode = 'signup', onClose }: Props = $props();

	let activeMode = $state<'login' | 'signup'>('signup');
	$effect(() => {
		activeMode = mode;
	});

	let phoneRaw = $state('');
	let mpesa = $state('');
	let password = $state('');
	let showPass = $state(false);
	let loading = $state(false);
	let step = $state<'form' | 'success'>('form');
	let modalEl = $state<HTMLElement | null>(null);

	$effect(() => {
		phoneRaw = formatKEPhone(phoneRaw);
	});

	$effect(() => {
		if (activeMode === 'signup' && mpesa === '') mpesa = phoneRaw;
	});

	const phoneValid = $derived(
		phoneRaw.replace(/\D/g, '').length === 10 &&
			(phoneRaw.startsWith('07') || phoneRaw.startsWith('01'))
	);
	const mpesaValid = $derived(mpesa.replace(/\D/g, '').length === 10);
	const passValid = $derived(password.length >= 6);
	const canSubmit = $derived(
		activeMode === 'login' ? phoneValid && passValid : phoneValid && mpesaValid && passValid
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

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClose();
			return;
		}
		if (e.key !== 'Tab' || !modalEl) return;
		const focusable = modalEl.querySelectorAll<HTMLElement>(
			'button, input, [tabindex]:not([tabindex="-1"])'
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

	$effect(() => {
		if (open) {
			queueMicrotask(() => modalEl?.querySelector<HTMLElement>('input, button')?.focus());
			document.addEventListener('keydown', handleKeydown);
			return () => document.removeEventListener('keydown', handleKeydown);
		}
	});
</script>

{#if open}
	<div
		class="fixed inset-0 z-[200] flex items-center justify-center px-4 animate-fade-in"
		style="background:rgba(0,0,0,0.75); backdrop-filter:blur(6px);"
		onclick={(e) => {
			if (e.target === e.currentTarget) handleClose();
		}}
		role="presentation"
	>
		<div
			bind:this={modalEl}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			class="relative w-full max-w-[400px] rounded-2xl overflow-hidden animate-slide-up outline-none"
			style="background:var(--color-nav); box-shadow:0 24px 60px rgba(0,0,0,0.45);"
		>
			<div
				class="h-[3px] w-full"
				style="background:linear-gradient(90deg, var(--color-gold), var(--color-gold), var(--color-gold));"
			></div>

			{#if step === 'form'}
				<div class="flex items-center justify-between px-6 pt-5 pb-4">
					<div>
						<div class="flex items-center gap-2 mb-0.5">
							<span class="w-2 h-2 rounded-full" style="background:var(--color-gold);"></span>
							<span class="font-display text-[20px] tracking-[2px]" style="color:var(--color-text);"
								>WAM</span
							>
						</div>
						<p class="text-[12px]" style="color:var(--color-text-muted);">
							{activeMode === 'signup' ? 'Create your free account' : 'Welcome back'}
						</p>
					</div>
					<button
						onclick={handleClose}
						aria-label="Close"
						class="w-11 h-11 rounded-full flex items-center justify-center hover-bg-subtle transition-colors cursor-pointer"
						style="background:rgba(255,255,255,0.05); color:var(--color-text-dim);"
						><X size={15} /></button
					>
				</div>

				<div
					class="flex mx-6 mb-5 rounded-xl overflow-hidden"
					style="background:var(--color-card); border:1px solid var(--color-border);"
				>
					{#each [{ id: 'signup', label: 'Sign Up' }, { id: 'login', label: 'Log In' }] as m}
						<button
							onclick={() => {
								activeMode = m.id as 'login' | 'signup';
								mpesa = '';
							}}
							aria-label={m.label}
							aria-pressed={activeMode === m.id}
							class="flex-1 py-2.5 text-[13px] font-bold transition-all duration-150 rounded-xl cursor-pointer"
							style="
							background:{activeMode === m.id ? 'var(--color-gold)' : 'transparent'};
							color:{activeMode === m.id ? 'var(--color-nav)' : 'var(--color-text-muted)'};
						">{m.label}</button
						>
					{/each}
				</div>

				{#if activeMode === 'signup'}
					<div
						class="mx-6 mb-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
						style="background:linear-gradient(160deg,rgba(34,197,94,0.1),rgba(34,197,94,0.05)); border:1px solid rgba(34,197,94,0.18);"
					>
						<Gift size={18} style="color:var(--color-green); flex-shrink:0;" />
						<div>
							<div class="text-[12px] font-bold" style="color:var(--color-green);">
								Claim KSh 500 Welcome Bonus
							</div>
							<div class="text-[10px]" style="color:rgba(34,197,94,0.55);">
								Deposit KSh 100 via M-PESA to unlock
							</div>
						</div>
					</div>
				{/if}

				<div class="px-6 flex flex-col gap-3">
					<div>
						<label
							for="auth-phone"
							class="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.8px]"
							style="color:var(--color-text-muted);"
						>
							Phone Number
						</label>
						<div
							class="flex items-center gap-2 rounded-xl px-3.5 py-3 transition-all duration-150 focus-ring-gold"
							style="background:var(--color-card); border:1px solid var(--color-border);"
						>
							<Phone size={15} style="color:var(--color-text-muted); flex-shrink:0;" />
							<span class="text-[12px] font-mono shrink-0" style="color:var(--color-text-muted);"
								>+254</span
							>
							<input
								id="auth-phone"
								type="tel"
								bind:value={phoneRaw}
								placeholder="0712 345 678"
								maxlength="10"
								class="flex-1 bg-transparent outline-none font-mono text-[14px] font-semibold"
								style="color:var(--color-text);"
							/>
							{#if phoneValid}
								<span class="text-[10px] shrink-0" style="color:var(--color-green);">✓</span>
							{/if}
						</div>
						<div class="text-[10px] mt-1 px-1" style="color:var(--color-text-muted);">
							Must start with 07 or 01
						</div>
					</div>

					{#if activeMode === 'signup'}
						<div>
							<label
								for="auth-mpesa"
								class="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.8px]"
								style="color:var(--color-text-muted);"
							>
								M-PESA Number
								<span class="normal-case ml-1 text-[10px]" style="color:rgba(107,114,128,0.55);">
									(for deposits &amp; withdrawals)
								</span>
							</label>
							<div
								class="flex items-center gap-2 rounded-xl px-3.5 py-3 transition-all duration-150 focus-ring-green"
								style="background:var(--color-card); border:1px solid var(--color-border);"
							>
								<Smartphone size={15} style="color:var(--color-green); flex-shrink:0;" />
								<span class="text-[11px] font-bold shrink-0" style="color:var(--color-green);"
									>M-PESA</span
								>
								<input
									id="auth-mpesa"
									type="tel"
									bind:value={mpesa}
									placeholder="Same as phone"
									class="flex-1 bg-transparent outline-none font-mono text-[14px] font-semibold"
									style="color:var(--color-text);"
								/>
								{#if mpesaValid}
									<span class="text-[10px] shrink-0" style="color:var(--color-green);">✓</span>
								{/if}
							</div>
						</div>
					{/if}

					<div>
						<label
							for="auth-password"
							class="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.8px]"
							style="color:var(--color-text-muted);"
						>
							Password
						</label>
						<div
							class="flex items-center gap-2 rounded-xl px-3.5 py-3 transition-all duration-150 focus-ring-gold"
							style="background:var(--color-card); border:1px solid var(--color-border);"
						>
							<Lock size={15} style="color:var(--color-text-muted); flex-shrink:0;" />
							<input
								id="auth-password"
								type={showPass ? 'text' : 'password'}
								bind:value={password}
								placeholder="Min. 6 characters"
								class="flex-1 bg-transparent outline-none text-[14px] font-semibold"
								style="color:var(--color-text);"
							/>
							<button
								onclick={() => (showPass = !showPass)}
								aria-label={showPass ? 'Hide password' : 'Show password'}
								aria-expanded={showPass}
								class="hover:text-[var(--color-text)] transition-colors cursor-pointer"
								style="color:var(--color-text-muted);"
								type="button"
							>
								{#if showPass}<EyeOff size={14} />{:else}<Eye size={14} />{/if}
							</button>
						</div>
					</div>

					<button
						onclick={handleSubmit}
						disabled={!canSubmit || loading}
						class="w-full py-3.5 rounded-xl font-bold text-[14px] mt-1 mb-2 transition-all duration-200 flex items-center justify-center gap-2 hover-lift cursor-pointer"
						style="
							background:{canSubmit ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)'};
							color:{canSubmit ? 'var(--color-nav)' : 'var(--color-text-muted)'};
							cursor:{canSubmit ? 'pointer' : 'not-allowed'};
							box-shadow:{canSubmit ? '0 4px 20px rgba(240,192,64,0.2)' : 'none'};
						"
					>
						{#if loading}
							<span
								class="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
								style="border-color:var(--color-nav); border-top-color:transparent;"
							></span>
							Verifying...
						{:else if activeMode === 'signup'}
							<Crosshair size={16} />
							Create Account &amp; Claim Bonus
						{:else}
							<Key size={16} />
							Log In
						{/if}
					</button>

					<p
						class="text-center text-[10px] pb-5 leading-relaxed"
						style="color:var(--color-text-muted);"
					>
						{#if activeMode === 'signup'}
							By signing up you agree to our <span style="color:var(--color-text-dim);">Terms</span>
							&amp;
							<span style="color:var(--color-text-dim);">Privacy Policy</span>. 18+ only. Gamble
							responsibly. Licensed by <span style="color:var(--color-text-dim);">BCLB Kenya</span>.
						{:else}
							<span style="color:var(--color-text-dim); cursor:pointer;">Forgot password?</span>
						{/if}
					</p>
				</div>
			{:else}
				<div class="px-6 py-10 flex flex-col items-center text-center gap-4">
					<div
						class="w-16 h-16 rounded-full flex items-center justify-center animate-slide-up"
						style="background:rgba(34,197,94,0.1); border:2px solid rgba(34,197,94,0.25);"
					>
						<Crosshair size={28} style="color:var(--color-green);" />
					</div>
					<div class="animate-slide-up" style="animation-delay:0.08s;">
						<div
							class="font-display tracking-[2px] mb-1"
							style="font-size:var(--text-title); color:var(--color-text);"
						>
							YOU'RE IN!
						</div>
						<div class="text-[13px]" style="color:var(--color-text-dim);">
							Account created successfully.
						</div>
					</div>
					<div
						class="w-full rounded-xl p-4 animate-slide-up"
						style="animation-delay:0.16s; background:rgba(34,197,94,0.06); border:1px solid rgba(34,197,94,0.15);"
					>
						<div
							class="text-[12px] font-bold mb-1 flex items-center gap-1.5"
							style="color:var(--color-green);"
						>
							<CheckCircle size={14} />
							KSh 500 Bonus Activated
						</div>
						<div class="text-[11px]" style="color:rgba(34,197,94,0.6);">
							Deposit KSh 100 via M-PESA to unlock your bonus. Check your phone for the prompt.
						</div>
					</div>
					<button
						onclick={handleClose}
						class="w-full py-3 rounded-xl font-bold text-[14px] mt-2 animate-slide-up cursor-pointer"
						style="animation-delay:0.24s; background:var(--color-gold); color:var(--color-nav);"
					>
						Start Betting →
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
