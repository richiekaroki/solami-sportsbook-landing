<script lang="ts">
	import { X, Eye, EyeOff, Phone, Lock, Smartphone } from 'lucide-svelte';
	import { formatKEPhone } from '$lib/utils/formatters';
	import { trackSignupIntent, trackAuthModalOpen } from '$lib/utils/tracking';

	interface Props {
		open: boolean;
		mode?: 'login' | 'signup';
		onClose: () => void;
	}

	let { open = $bindable(), mode = 'signup', onClose }: Props = $props();

	// ✅ Properly synced state (no warning)
	let activeMode = $state<'login' | 'signup'>(mode);
	$effect(() => {
		activeMode = mode;
	});

	let phone = $state('');
	let mpesa = $state('');
	let password = $state('');
	let showPass = $state(false);
	let loading = $state(false);
	let step = $state<'form' | 'success'>('form');

	let phoneRaw = $state('');

	$effect(() => {
		phone = formatKEPhone(phoneRaw);
	});

	$effect(() => {
		if (activeMode === 'signup' && mpesa === '') {
			mpesa = phone;
		}
	});

	const phoneValid = $derived(
		phoneRaw.replace(/\D/g, '').length === 10 &&
		(phoneRaw.startsWith('07') || phoneRaw.startsWith('01'))
	);

	const mpesaValid = $derived(mpesa.replace(/\D/g, '').length === 10);
	const passValid = $derived(password.length >= 6);

	const canSubmit = $derived(
		activeMode === 'login'
			? phoneValid && passValid
			: phoneValid && mpesaValid && passValid
	);

	function handleSubmit() {
		if (!canSubmit || loading) return;
		loading = true;

		trackSignupIntent(
			activeMode === 'signup' ? 'auth_modal_signup' : 'auth_modal_login'
		);

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
</script>

{#if open}
<div
	class="fixed inset-0 z-[200] flex items-center justify-center px-4 animate-fade-in"
	style="background:rgba(0,0,0,0.75); backdrop-filter:blur(6px);"
	onclick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
	role="presentation"
>
	<div
		class="relative w-full max-w-[400px] rounded-2xl overflow-hidden animate-slide-up"
		style="background:#0d1120; border:1px solid rgba(255,255,255,0.1); box-shadow:0 32px 80px rgba(0,0,0,0.6);"
	>

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
					class="w-8 h-8 rounded-full flex items-center justify-center"
					style="background:#1a1e2a; color:#8892a4;"
				><X size={15} /></button>
			</div>

			<!-- Mode Toggle -->
			<div class="flex mx-6 mb-5 rounded-xl overflow-hidden" style="background:#13161f;">
				{#each [{ id:'signup', label:'Sign Up' }, { id:'login', label:'Log In' }] as m}
					<button
						onclick={() => { activeMode = m.id as 'login'|'signup'; mpesa = ''; }}
						class="flex-1 py-2.5 text-[13px] font-bold"
						style="
							background:{activeMode===m.id ? '#f5c842' : 'transparent'};
							color:{activeMode===m.id ? '#0b1628' : '#4d5568'};
						"
					>{m.label}</button>
				{/each}
			</div>

			<div class="px-6 flex flex-col gap-3">

				<!-- PHONE -->
				<div>
					<label for="phone" class="text-[11px]">Phone Number</label>

					<div
						class="flex items-center gap-2 rounded-xl px-3.5 py-3"
						style="background:#13161f; border:1px solid rgba(255,255,255,0.08);"
						onfocusin={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,200,66,0.45)')}
						onfocusout={(e) => ((e.currentTarget as HTMLElement).style.borderColor =
							phoneValid ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)')}
					>
						<Phone size={15} />
						<input
							id="phone"
							type="tel"
							bind:value={phoneRaw}
							placeholder="0712 345 678"
							class="flex-1 bg-transparent outline-none"
						/>
					</div>
				</div>

				<!-- MPESA -->
				{#if activeMode === 'signup'}
				<div>
					<label for="mpesa">M-PESA Number</label>

					<div
						class="flex items-center gap-2 rounded-xl px-3.5 py-3"
						style="background:#13161f; border:1px solid rgba(255,255,255,0.08);"
						onfocusin={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(76,175,80,0.5)')}
						onfocusout={(e) => ((e.currentTarget as HTMLElement).style.borderColor =
							mpesaValid ? 'rgba(76,175,80,0.4)' : 'rgba(255,255,255,0.08)')}
					>
						<Smartphone size={15} />
						<input
							id="mpesa"
							type="tel"
							bind:value={mpesa}
							class="flex-1 bg-transparent outline-none"
						/>
					</div>
				</div>
				{/if}

				<!-- PASSWORD -->
				<div>
					<label for="password">Password</label>

					<div class="flex items-center gap-2 rounded-xl px-3.5 py-3"
						style="background:#13161f; border:1px solid rgba(255,255,255,0.08);">
						<Lock size={15} />

						<input
							id="password"
							type={showPass ? 'text' : 'password'}
							bind:value={password}
							class="flex-1 bg-transparent outline-none"
						/>

						<button onclick={() => showPass = !showPass} type="button">
							{#if showPass}<EyeOff size={14} />{:else}<Eye size={14} />{/if}
						</button>
					</div>
				</div>

				<!-- Submit -->
				<button
					onclick={handleSubmit}
					disabled={!canSubmit || loading}
					class="w-full py-3 rounded-xl font-bold"
				>
					{#if loading}
						Loading...
					{:else if activeMode === 'signup'}
						Create Account
					{:else}
						Log In
					{/if}
				</button>

			</div>
		{/if}
	</div>
</div>
{/if}