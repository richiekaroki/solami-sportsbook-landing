<script lang="ts">
	import { trackSignupIntent, trackCTA } from '$lib/utils/tracking';
	import { formatKEPhone } from '$lib/utils/formatters';
	import { Rocket, Crosshair, CheckCircle } from 'lucide-svelte';

	let phoneRaw = $state('');
	let submitted = $state(false);
	let loading = $state(false);

	const phone = $derived(formatKEPhone(phoneRaw));
	const phoneValid = $derived(
		phoneRaw.replace(/\D/g, '').length === 10 &&
			(phoneRaw.startsWith('07') || phoneRaw.startsWith('01'))
	);

	function handleSubmit() {
		if (!phoneValid || loading) return;
		loading = true;
		trackSignupIntent('waitlist_page');
		setTimeout(() => {
			loading = false;
			submitted = true;
		}, 1400);
	}
</script>

<svelte:head>
	<title>WAM — Join the Waitlist</title>
	<meta
		name="description"
		content="Get early access to WAM sportsbook. Claim KSh 500 free bonus. Kenya's premier betting platform with instant M-PESA payouts."
	/>
	<meta property="og:title" content="WAM — Join the Waitlist" />
	<meta
		property="og:description"
		content="Get early access to WAM sportsbook. Claim KSh 500 free bonus. Instant M-PESA payouts."
	/>
	<meta property="og:url" content="https://wam.co.ke/waitlist" />
	<meta name="twitter:title" content="WAM — Join the Waitlist" />
	<meta
		name="twitter:description"
		content="Get early access to WAM sportsbook. Claim KSh 500 free bonus."
	/>
</svelte:head>

<main
	class="min-h-screen flex flex-col items-center justify-center px-4 py-16"
	style="background:var(--color-nav);"
	id="main-content"
>
	<a href="/" class="flex items-center gap-2 mb-10">
		<span class="w-2.5 h-2.5 rounded-full" style="background:var(--color-gold);"></span>
		<span
			class="font-display text-[24px] tracking-[3px] leading-none"
			style="color:var(--color-text);">WAM</span
		>
	</a>

	{#if !submitted}
		<div class="w-full max-w-[420px] text-center">
			<div
				class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[1.5px] px-3 py-1.5 rounded-full mb-5"
				style="background:var(--color-live-soft); border:1px solid rgba(34,197,94,0.18); color:var(--color-green);"
			>
				<Rocket size={12} />
				Early Access
			</div>
			<h1
				class="font-display leading-none tracking-[1px] mb-3"
				style="font-size:var(--text-display); color:var(--color-text);"
			>
				GET IN EARLY<br /><span style="color:var(--color-gold);">+ KSH 500 FREE</span>
			</h1>
			<p class="text-[14px] mb-8 leading-relaxed" style="color:var(--color-text-dim);">
				Bet on LaLiga, UCL & Premier League<br />
				with instant M-PESA payouts.
			</p>

			<div class="flex flex-col gap-3 mb-4">
				<div
					class="flex items-center gap-2 rounded-2xl px-4 py-3.5"
					style="background:var(--color-card); border:1px solid {phoneValid
						? 'rgba(34,197,94,0.35)'
						: 'var(--color-border)'};"
				>
					<span class="text-[13px] font-mono shrink-0" style="color:var(--color-text-muted);"
						>+254</span
					>
					<input
						type="tel"
						bind:value={phoneRaw}
						placeholder="0712 345 678"
						maxlength="10"
						aria-label="Phone number"
						class="flex-1 bg-transparent outline-none font-mono text-[15px] font-semibold text-center"
						style="color:var(--color-text);"
					/>
					{#if phoneValid}
						<span style="color:var(--color-green);">✓</span>
					{/if}
				</div>

				<button
					onclick={handleSubmit}
					disabled={!phoneValid || loading}
					class="w-full py-4 rounded-2xl font-bold text-[15px] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
					style="
						background:{phoneValid ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)'};
						color:{phoneValid ? 'var(--color-nav)' : 'var(--color-text-muted)'};
						cursor:{phoneValid ? 'pointer' : 'not-allowed'};
						box-shadow:{phoneValid ? '0 4px 20px rgba(240,192,64,0.25)' : 'none'};
					"
				>
					{#if loading}
						<span
							class="w-4 h-4 rounded-full border-2 border-t-transparent"
							style="border-color:var(--color-nav); border-top-color:transparent; animation:spin 0.7s linear infinite;"
						></span>
						Joining...
					{:else}
						<Crosshair size={16} />
						Join Waitlist — Claim KSh 500
					{/if}
				</button>
			</div>

			<p class="text-[10px]" style="color:var(--color-text-muted);">
				No spam. We'll send one WhatsApp when we launch.<br />
				18+ only · BCLB Licensed · Gamble responsibly.
			</p>
		</div>
	{:else}
		<div class="w-full max-w-[360px] text-center animate-slide-up">
			<div
				class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
				style="background:var(--color-live-soft); border:2px solid rgba(34,197,94,0.2);"
			>
				<Crosshair size={32} style="color:var(--color-green);" />
			</div>
			<div
				class="font-display tracking-[2px] mb-2"
				style="font-size:var(--text-title); color:var(--color-text);"
			>
				YOU'RE IN!
			</div>
			<p class="text-[14px] mb-6" style="color:var(--color-text-dim);">
				We'll WhatsApp you on <strong style="color:var(--color-text);">{phone}</strong><br />when
				WAM launches.
			</p>
			<div
				class="rounded-2xl p-4 mb-6"
				style="background:rgba(34,197,94,0.06); border:1px solid rgba(34,197,94,0.15);"
			>
				<div
					class="text-[13px] font-bold mb-1 flex items-center gap-1.5"
					style="color:var(--color-green);"
				>
					<CheckCircle size={14} />
					KSh 500 Bonus Reserved
				</div>
				<div class="text-[11px]" style="color:rgba(34,197,94,0.55);">
					Your bonus will be applied automatically on first deposit via M-PESA.
				</div>
			</div>
			<a href="/" class="text-[13px] font-semibold" style="color:var(--color-gold);"
				>← Back to live odds</a
			>
		</div>
	{/if}
</main>

<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
