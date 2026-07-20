<script lang="ts">
	import { trackCTA } from '$lib/utils/tracking';
	import { Zap, Shield, Crosshair } from 'lucide-svelte';

	interface Props {
		onJoin: () => void;
	}
	let { onJoin }: Props = $props();

	const trustChips = [
		{
			icon: Zap,
			label: 'M-PESA Instant',
			sub: 'Deposits & withdrawals',
			accent: 'var(--color-green)'
		},
		{ icon: Shield, label: 'BCLB Licensed', sub: 'Kenya Gaming Board', accent: 'var(--color-blue)' }
	];
	const trustStats = [
		{ value: '100+', label: 'Markets per match' },
		{ value: '<5 min', label: 'Avg. payout time' }
	];
</script>

<div
	class="relative overflow-hidden rounded-2xl mb-5"
	style="background:linear-gradient(145deg, #0c1221 0%, #0e1628 40%, #0a0e18 100%); border:1px solid rgba(255,255,255,0.06);"
>
	<!-- Ambient glow -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="absolute -top-20 -left-16 w-80 h-80 rounded-full blur-[80px]"
			style="background:radial-gradient(circle, rgba(240,192,64,0.10) 0%, transparent 65%);"
		></div>
		<div
			class="absolute -bottom-16 right-0 w-56 h-56 rounded-full blur-[60px]"
			style="background:radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%);"
		></div>
	</div>

	<div class="relative flex flex-col sm:flex-row items-center gap-6 px-6 py-7">
		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-2 mb-4">
				<span
					class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.2px] px-2.5 py-1 rounded-full"
					style="background:rgba(34,197,94,0.10); border:1px solid rgba(34,197,94,0.22); color:var(--color-green);"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] animate-pulse-dot"></span>
					Live Odds
				</span>
			</div>

			<h1
				class="font-display leading-[0.9] tracking-[2px] mb-3"
				style="font-size:var(--text-display); color:white; text-wrap:balance;"
			>
				BET ON EVERY<br />
				<span style="color:var(--color-gold);">MATCH DAY.</span>
			</h1>

			<p
				class="text-[13px] mb-5 leading-relaxed max-w-[340px]"
				style="color:var(--color-text-dim);"
			>
				LaLiga · Champions League · Premier League<br />
				Paid out via <strong style="color:var(--color-green);">M-PESA</strong> in under 5 minutes.
			</p>

			<div class="flex items-center gap-3 flex-wrap">
				<button
					onclick={() => {
						trackCTA('hero_join_now', 'hero_section');
						onJoin();
					}}
					class="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-[14px] hover-lift cursor-pointer"
					style="background:var(--color-gold); color:var(--color-nav); box-shadow:0 4px 24px rgba(240,192,64,0.28);"
				>
					<Crosshair size={16} />
					Join Free — Claim KSh 500
				</button>
				<a
					href="#matches"
					onclick={() => trackCTA('hero_see_odds', 'hero_section')}
					class="text-[13px] font-semibold hover-text-gold cursor-pointer"
					style="color:var(--color-text-dim);"
				>
					See live odds ↓
				</a>
			</div>
		</div>

		<!-- Asymmetric trust layout: dominant stat + secondary chips -->
		<div class="shrink-0 w-full sm:w-auto sm:min-w-[230px] flex flex-col gap-2">
			<!-- Dominant stat -->
			<div
				class="flex items-center gap-3 px-4 py-3 rounded-xl"
				style="background:var(--color-card); border:1px solid var(--color-border);"
			>
				<div
					class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
					style="background:rgba(240,192,64,0.10);"
				>
					<Zap size={18} style="color:var(--color-gold);" />
				</div>
				<div>
					<div class="text-[18px] font-bold leading-tight" style="color:var(--color-text);">
						{trustStats[0].value}
					</div>
					<div class="text-[10px]" style="color:var(--color-text-muted);">
						{trustStats[0].label}
					</div>
				</div>
			</div>
			<!-- Secondary chips row -->
			<div class="flex gap-2">
				{#each trustChips as chip}
					<div
						class="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
						style="background:var(--color-card); border:1px solid var(--color-border);"
					>
						<chip.icon size={13} style="color:{chip.accent}; flex-shrink:0;" />
						<div>
							<div class="text-[10px] font-bold leading-tight" style="color:var(--color-text);">
								{chip.label}
							</div>
							<div class="text-[8px] leading-tight" style="color:var(--color-text-muted);">
								{chip.sub}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
