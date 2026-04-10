<script lang="ts">
	import { trackSignupIntent, trackCTA } from '$lib/utils/tracking';
	import { formatKEPhone } from '$lib/utils/formatters';

	let phoneRaw  = $state('');
	let submitted = $state(false);
	let loading   = $state(false);

	const phone     = $derived(formatKEPhone(phoneRaw));
	const phoneValid= $derived(phoneRaw.replace(/\D/g,'').length === 10 && (phoneRaw.startsWith('07') || phoneRaw.startsWith('01')));

	function handleSubmit() {
		if (!phoneValid || loading) return;
		loading = true;
		trackSignupIntent('waitlist_page');
		setTimeout(() => { loading = false; submitted = true; }, 1400);
	}
</script>

<svelte:head>
	<title>Solami — Join the Waitlist</title>
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center px-4 py-16"
	style="background:#0d0f14;">

	<a href="/" class="flex items-center gap-2 mb-10">
		<span class="w-2.5 h-2.5 rounded-full bg-[#f5c842]"></span>
		<span class="font-display text-[24px] tracking-[3px] text-white leading-none">SOLAMI</span>
	</a>

	{#if !submitted}
		<div class="w-full max-w-[420px] text-center">
			<div class="inline-block text-[11px] font-bold uppercase tracking-[1.5px] px-3 py-1.5 rounded-full mb-5"
				style="background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.2); color:#22c55e;">
				🚀 Launching in Kenya
			</div>
			<h1 class="font-display leading-none tracking-[1px] mb-3" style="font-size:42px; color:white;">
				EARLY ACCESS<br /><span style="color:#f5c842;">+ KSH 500 FREE</span>
			</h1>
			<p class="text-[14px] mb-8 leading-relaxed" style="color:#8892a4;">
				Be the first to bet on LaLiga, UCL & Premier League<br />
				with the fastest M-PESA payouts in Kenya.
			</p>

			<div class="flex flex-col gap-3 mb-4">
				<div class="flex items-center gap-2 rounded-2xl px-4 py-3.5"
					style="background:#13161f; border:1px solid {phoneValid ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'};">
					<span class="text-[13px] font-mono shrink-0" style="color:#4d5568;">+254</span>
					<input
						type="tel"
						bind:value={phoneRaw}
						placeholder="0712 345 678"
						maxlength="10"
						class="flex-1 bg-transparent outline-none font-mono text-[15px] font-semibold text-center"
						style="color:#e4e8f0;"
					/>
					{#if phoneValid}
						<span style="color:#22c55e;">✓</span>
					{/if}
				</div>

				<button
					onclick={handleSubmit}
					disabled={!phoneValid || loading}
					class="w-full py-4 rounded-2xl font-bold text-[15px] transition-all duration-200 flex items-center justify-center gap-2"
					style="
						background:{phoneValid ? '#f5c842' : '#1a1e2a'};
						color:{phoneValid ? '#0b1628' : '#4d5568'};
						cursor:{phoneValid ? 'pointer' : 'not-allowed'};
						box-shadow:{phoneValid ? '0 4px 20px rgba(245,200,66,0.3)' : 'none'};
					"
				>
					{#if loading}
						<span class="w-4 h-4 rounded-full border-2 border-[#0b1628] border-t-transparent" style="animation:spin 0.7s linear infinite;"></span>
						Joining...
					{:else}
						🎯 Join Waitlist — Claim KSh 500
					{/if}
				</button>
			</div>

			<p class="text-[10px]" style="color:#4d5568;">
				No spam. We'll send one WhatsApp when we launch.<br />
				18+ only · BCLB Licensed · Gamble responsibly.
			</p>
		</div>
	{:else}
		<div class="w-full max-w-[360px] text-center animate-slide-up">
			<div class="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
				style="background:rgba(34,197,94,0.1); border:2px solid rgba(34,197,94,0.25);">
				🎯
			</div>
			<div class="font-display text-[36px] tracking-[2px] text-white mb-2">YOU'RE IN!</div>
			<p class="text-[14px] mb-6" style="color:#8892a4;">
				We'll WhatsApp you on <strong style="color:#e4e8f0;">{phone}</strong><br />when Solami launches.
			</p>
			<div class="rounded-2xl p-4 mb-6" style="background:rgba(34,197,94,0.07); border:1px solid rgba(34,197,94,0.18);">
				<div class="text-[13px] font-bold mb-1" style="color:#22c55e;">✅ KSh 500 Bonus Reserved</div>
				<div class="text-[11px]" style="color:rgba(34,197,94,0.6);">Your bonus will be applied automatically on first deposit via M-PESA.</div>
			</div>
			<a href="/" class="text-[13px] font-semibold" style="color:#f5c842;">← Back to live odds</a>
		</div>
	{/if}
</div>

<style>
	@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
</style>
