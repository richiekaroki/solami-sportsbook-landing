<script lang="ts">
	import type { Game } from '$lib/types';
	import { Shield, Flame, Gift } from 'lucide-svelte';

	interface Props {
		games: Game[];
	}

	let { games }: Props = $props();

	const hotMarkets = $derived(
		[...games].sort((a, b) => b.total_markets - a.total_markets).slice(0, 6)
	);
</script>

<aside class="flex flex-col gap-4">

	<!-- Promo Card -->
	<div class="relative overflow-hidden rounded-xl border border-[rgba(74,158,255,0.2)] bg-[linear-gradient(135deg,#0f1a35_0%,#0b0c0f_100%)] p-5">
		<!-- Glow -->
		<div class="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[rgba(74,158,255,0.08)] blur-2xl"></div>

		<div class="text-[10px] font-bold tracking-[1.5px] uppercase text-[#6aadff] mb-2">
			🎁 Welcome Offer
		</div>
		<div class="font-display text-[28px] tracking-[2px] text-white leading-tight mb-1">
			BET KSH 100<br />GET KSH 500
		</div>
		<p class="text-[12px] text-dim leading-relaxed mb-4">
			New customers only. Min deposit KSh 100. T&C apply. Please gamble responsibly.
		</p>
		<button class="w-full py-2.5 rounded-lg bg-[#4a9eff] hover:bg-[#6ab8ff] text-white text-[13px] font-bold transition-all duration-200 hover:shadow-[0_4px_16px_rgba(74,158,255,0.3)]">
			Claim Bonus →
		</button>
	</div>

	<!-- Hot Markets -->
	<div class="card">
		<div class="flex items-center justify-between px-4 py-3 border-b border-line">
			<div class="flex items-center gap-2 text-white font-display tracking-[2px] text-[16px]">
				<Flame size={15} class="text-gold" />
				HOT MARKETS
			</div>
			<span class="text-[10px] text-muted">By depth</span>
		</div>

		<div class="divide-y divide-[var(--color-line)]">
			{#each hotMarkets as g (g.parent_match_id)}
				<div class="flex items-center justify-between px-4 py-3 hover:bg-ink3 transition-colors duration-150 cursor-pointer group">
					<div class="min-w-0 flex-1">
						<div class="text-[12px] font-medium text-text truncate">
							{g.home_team} vs {g.away_team}
						</div>
						<div class="text-[10px] text-muted mt-0.5">{g.competition_name}</div>
					</div>
					<div class="font-mono text-[13px] font-bold text-gold shrink-0 pl-3 group-hover:text-[#ffd700] transition-colors">
						{g.total_markets}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Responsible Gaming -->
	<div class="card p-4 text-center">
		<div class="flex justify-center mb-2">
			<Shield size={22} class="text-dim" />
		</div>
		<div class="text-[13px] font-semibold text-text mb-1.5">Play Responsibly</div>
		<p class="text-[12px] text-dim leading-relaxed mb-3">
			Set limits on deposits and bets. Gambling should be fun, not a problem.
		</p>
		<button class="w-full py-2 rounded-lg border border-line text-[12px] text-dim font-medium hover:border-line2 hover:text-text transition-all duration-150">
			Set My Limits
		</button>
	</div>

	<!-- M-Pesa Badge -->
	<div class="flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-line bg-ink2">
		{#each ['18+', 'BCLB', 'M-PESA', 'KE'] as badge}
			<span class="text-[10px] font-bold tracking-[0.8px] uppercase text-muted bg-ink3 px-2.5 py-1 rounded border border-line">
				{badge}
			</span>
		{/each}
	</div>

</aside>
