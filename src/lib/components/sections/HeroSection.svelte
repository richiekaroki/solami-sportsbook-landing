<script lang="ts">
	import { trackCTA } from '$lib/utils/tracking';

	interface Props {
		onJoin: () => void;
	}
	let { onJoin }: Props = $props();

	const trustChips = [
		{ icon: '⚡', label: 'M-PESA Instant',  sub: 'Deposits & withdrawals' },
		{ icon: '🛡️', label: 'BCLB Licensed',   sub: 'Kenya Gaming Board' },
		{ icon: '🏆', label: '100+ Markets',     sub: 'Per match' },
		{ icon: '💸', label: 'Fast Payouts',     sub: 'Under 5 minutes' },
	];
</script>

<!-- Hero strip — mobile: stacked, desktop: inline -->
<div class="relative overflow-hidden rounded-2xl mb-4"
	style="background:linear-gradient(135deg, #0b1628 0%, #0d1420 60%, #0a1010 100%); border:1px solid rgba(255,255,255,0.07);">

	<!-- Background glow blobs -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute -top-10 -left-10 w-64 h-64 rounded-full blur-3xl"
			style="background:radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%);"></div>
		<div class="absolute -bottom-10 right-0 w-48 h-48 rounded-full blur-2xl"
			style="background:radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%);"></div>
	</div>

	<div class="relative flex flex-col sm:flex-row items-center gap-6 px-5 py-6">
		<!-- Copy -->
		<div class="flex-1 min-w-0">
			<!-- Live badge -->
			<div class="flex items-center gap-2 mb-3">
				<span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1px] px-2.5 py-1 rounded-full"
					style="background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.25); color:#22c55e;">
					<span class="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse-dot"></span>
					Live Odds
				</span>
				<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
					style="background:rgba(245,200,66,0.1); border:1px solid rgba(245,200,66,0.2); color:#f5c842;">
					🇰🇪 Kenya's #1 Sportsbook
				</span>
			</div>

			<h1 class="font-display leading-none tracking-[1px] mb-2"
				style="font-size:clamp(28px, 5vw, 42px); color:white;">
				BET SMARTER.<br />
				<span style="color:#f5c842;">WIN BIGGER.</span>
			</h1>

			<p class="text-[13px] mb-4 leading-relaxed max-w-[340px]" style="color:#8892a4;">
				LaLiga · Champions League · Premier League<br />
				Paid out via <strong style="color:#4CAF50;">M-PESA</strong> in under 5 minutes.
			</p>

			<!-- CTAs -->
			<div class="flex items-center gap-2.5 flex-wrap">
				<button
					onclick={() => { trackCTA('hero_join_now', 'hero_section'); onJoin(); }}
					class="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] transition-all duration-200"
					style="background:#f5c842; color:#0b1628; box-shadow:0 4px 20px rgba(245,200,66,0.3);"
					onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='#ffd700'; el.style.transform='translateY(-1px)'; el.style.boxShadow='0 6px 28px rgba(245,200,66,0.4)'; }}
					onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='#f5c842'; el.style.transform=''; el.style.boxShadow='0 4px 20px rgba(245,200,66,0.3)'; }}
				>
					🎯 Join Free — Claim KSh 500
				</button>
				<a href="#matches"
					onclick={() => trackCTA('hero_see_odds', 'hero_section')}
					class="text-[13px] font-semibold transition-colors duration-150"
					style="color:#8892a4;"
					onmouseenter={(e) => (e.currentTarget as HTMLElement).style.color='#e4e8f0'}
					onmouseleave={(e) => (e.currentTarget as HTMLElement).style.color='#8892a4'}
				>
					See live odds ↓
				</a>
			</div>
		</div>

		<!-- Trust chips -->
		<div class="grid grid-cols-2 gap-2 shrink-0 w-full sm:w-auto sm:min-w-[220px]">
			{#each trustChips as chip}
				<div class="flex items-start gap-2 px-3 py-2.5 rounded-xl"
					style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);">
					<span class="text-[18px] leading-none mt-0.5">{chip.icon}</span>
					<div>
						<div class="text-[11px] font-bold leading-tight" style="color:#e4e8f0;">{chip.label}</div>
						<div class="text-[9px] leading-tight mt-0.5" style="color:#4d5568;">{chip.sub}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
