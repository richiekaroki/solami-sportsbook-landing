<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import gamesData from '$lib/../data/games.json';
	import type { Game } from '$lib/types';

	import HeroSection   from '$lib/components/sections/HeroSection.svelte';
	import TrustSection  from '$lib/components/sections/TrustSection.svelte';
	import BetSlip       from '$lib/components/features/BetSlip.svelte';
	import BetSlipPanel  from '$lib/components/features/BetSlipPanel.svelte';
	import OddsGrid      from '$lib/components/features/OddsGrid.svelte';
	import MatchRow      from '$lib/components/features/MatchRow.svelte';
	import LeftSidebar   from '$lib/components/layout/LeftSidebar.svelte';
	import PromoBanner   from '$lib/components/layout/PromoBanner.svelte';
	import SportsNav     from '$lib/components/layout/SportsNav.svelte';
	import AuthModal     from '$lib/components/ui/AuthModal.svelte';
	import { toasts }    from '$lib/stores/toast';
	import { trackCTA }  from '$lib/utils/tracking';

	// Deep-clone so we can mutate for live odds simulation
	let games = $state<Game[]>(JSON.parse(JSON.stringify(gamesData)));

	// Featured match — FC Barcelona vs Atletico Madrid (UCL)
	const featured = games.find((g) => g.parent_match_id === 69339342) ?? games[0];

	let activeComp  = $state('all');
	let activeView  = $state<'highlights'|'live'|'upcoming'>('highlights');
	let authOpen    = $state(false);

	const filtered = $derived(
		activeComp === 'all' ? games : games.filter((g) => String(g.competition_id) === activeComp)
	);

	function groupGames(list: Game[]) {
		const map = new Map<string,{compName:string;compId:number;games:Game[]}>();
		for (const g of list) {
			const key = String(g.competition_id);
			if (!map.has(key)) map.set(key,{compName:g.competition_name,compId:g.competition_id,games:[]});
			map.get(key)!.games.push(g);
		}
		return [...map.values()];
	}
	const grouped = $derived(groupGames(filtered));

	// Live odds simulation
	let ticker: ReturnType<typeof setInterval>;
	onMount(() => {
		ticker = setInterval(() => {
			const count = 2 + Math.floor(Math.random() * 2);
			for (let i = 0; i < count; i++) {
				const gIdx = Math.floor(Math.random() * games.length);
				const g    = games[gIdx];
				const mIdx = Math.floor(Math.random() * g.markets.length);
				const m    = g.markets[mIdx];
				const oIdx = Math.floor(Math.random() * m.odds.length);
				const o    = m.odds[oIdx];
				const prev  = o.odd_value;
				const delta = (Math.random() * 0.08 + 0.02) * (Math.random() > 0.5 ? 1 : -1);
				const next  = Math.max(1.01, parseFloat((prev + delta).toFixed(2)));
				games[gIdx].markets[mIdx].odds[oIdx] = { ...o, prev_odd_value: prev, odd_value: next };
			}
		}, 6000);
	});
	onDestroy(() => clearInterval(ticker));
</script>

<svelte:head>
	<title>Solami — Bet Smarter. Win Bigger.</title>
	<meta name="description" content="Kenya's premier sportsbook. Bet on LaLiga, UCL, Premier League. M-PESA payouts in minutes. Licensed by BCLB Kenya." />
</svelte:head>

<div class="flex w-full min-h-[calc(100vh-56px)]">

	<!-- LEFT SIDEBAR -->
	<div class="hidden xl:flex flex-col shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)] overflow-hidden"
		style="width:240px; background:#0d0f14; border-right:1px solid rgba(255,255,255,0.07);">
		<LeftSidebar />
	</div>

	<!-- CENTER FEED -->
	<div class="flex-1 min-w-0 overflow-x-hidden">
		<div class="px-4 py-4">

			<!-- 1. HERO — conversion block -->
			<HeroSection onJoin={() => (authOpen = true)} />

			<!-- 2. FEATURED MATCH -->
			<div class="mb-4" id="featured">
				<div class="flex items-center gap-3 mb-2.5">
					<span class="text-[10px] font-bold uppercase tracking-[1.5px]" style="color:#4d5568;">Featured Match</span>
					<div class="flex-1 h-px" style="background:rgba(255,255,255,0.06);"></div>
					<span class="flex items-center gap-1 text-[10px] font-semibold" style="color:#22c55e;">
						<span class="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse-dot"></span>
						Odds updating live
					</span>
				</div>
				<OddsGrid game={featured} />
			</div>

			<!-- 3. PROMO BANNERS -->
			<PromoBanner />

			<!-- 4. MATCH FEED -->
			<div id="matches">
				<!-- View tabs -->
				<div class="flex items-center gap-1.5 mb-4 flex-wrap">
					{#each [
						{ id:'highlights', label:'Highlights', icon:'⚡' },
						{ id:'live',       label:'Live',       icon:'🔴' },
						{ id:'upcoming',   label:'Upcoming',   icon:'🕐' },
					] as tab}
						<button
							onclick={() => { activeView = tab.id as typeof activeView; if (tab.id!=='highlights') toasts.show(`${tab.label} — coming soon!`,'info'); }}
							class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150"
							style="
								background:{activeView===tab.id ? '#22c55e' : 'rgba(255,255,255,0.04)'};
								color:{activeView===tab.id ? '#fff' : '#8892a4'};
								border:1px solid {activeView===tab.id ? '#22c55e' : 'rgba(255,255,255,0.07)'};
							"
						>
							<span class="text-[12px]">{tab.icon}</span>
							<span class="hidden sm:inline">{tab.label}</span>
							<span class="sm:hidden">{tab.label === 'Highlights' ? 'High' : tab.label === 'Live' ? 'LIVE' : 'Up'}</span>
						</button>
					{/each}
				</div>

				<!-- Competition filter -->
				<div class="mb-4">
					<SportsNav {games} {activeComp} onSelect={(c) => (activeComp = c)} />
				</div>

				<!-- Soccer header -->
				<div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-2"
					style="background:linear-gradient(135deg,#0b1628 0%,#080e1c 100%); border:1px solid rgba(255,255,255,0.06);">
					<span class="text-[18px]">⚽</span>
					<span class="text-[14px] font-bold text-white">Soccer</span>
					<span class="ml-auto text-[11px] font-semibold" style="color:#4d5568;">{filtered.length} events</span>
				</div>

				<!-- Match groups -->
				<div class="overflow-x-auto" style="-webkit-overflow-scrolling:touch;">
					<div style="min-width:900px;">
						{#each grouped as group (group.compId)}
							<div class="flex items-center justify-between px-3.5 py-2 mt-3 first:mt-0 rounded-t-xl"
								style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.05); border-bottom:none;">
								<span class="text-[11px] font-bold uppercase tracking-[1.2px]"
									style="color:{group.compId===7 ? '#60a5fa' : '#f87171'};">
									{group.compId===7 ? '⭐' : '🇪🇸'} {group.compName}
								</span>
								<button onclick={() => toasts.show(`${group.compName} — coming soon!`,'info')}
									class="text-[11px] font-semibold transition-colors"
									style="color:#4d5568;"
									onmouseenter={(e) => (e.currentTarget as HTMLElement).style.color='#f5c842'}
									onmouseleave={(e) => (e.currentTarget as HTMLElement).style.color='#4d5568'}
								>{group.games.length} matches ›</button>
							</div>

							<!-- Column headers -->
							<div class="flex items-center px-3 py-1.5"
								style="background:rgba(255,255,255,0.015); border:1px solid rgba(255,255,255,0.05); border-bottom:none; border-top:1px solid rgba(255,255,255,0.04);">
								<div class="shrink-0 text-[9px] font-bold uppercase tracking-[0.8px]" style="width:168px; color:#4d5568;">Match</div>
								<div class="flex gap-1 shrink-0">
									{#each ['1','X','2'] as h}<div class="text-[9px] font-bold text-center" style="width:44px; color:#4d5568;">{h}</div>{/each}
								</div>
								<div class="mx-1.5 shrink-0 w-px h-4 bg-white/5"></div>
								<div class="flex gap-1 shrink-0">
									{#each ['1orX','1or2','Xor2'] as h}<div class="text-[7px] font-bold text-center" style="width:44px; color:#4d5568;">{h}</div>{/each}
								</div>
								<div class="mx-1.5 shrink-0 w-px h-4 bg-white/5"></div>
								<div class="flex gap-1 shrink-0">
									{#each ['Yes','No'] as h}<div class="text-[9px] font-bold text-center" style="width:44px; color:#4d5568;">{h}</div>{/each}
								</div>
								<div class="flex-1"></div>
								<div class="text-[9px] font-bold text-center ml-1.5" style="width:44px; color:#4d5568;">More</div>
							</div>

							<div class="overflow-hidden rounded-b-xl"
								style="background:#0d0f14; border:1px solid rgba(255,255,255,0.05); border-top:none;">
								{#each group.games as game (game.parent_match_id)}
									<MatchRow {game} />
								{/each}
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- 5. TRUST SECTION -->
			<TrustSection />

			<!-- 6. FOOTER -->
			<footer class="mt-8 pt-8" style="border-top:1px solid rgba(255,255,255,0.07);">
				<!-- Mobile sticky CTA -->
				<div class="xl:hidden flex gap-3 mb-8 p-4 rounded-2xl"
					style="background:linear-gradient(135deg,#0b1628,#0d1420); border:1px solid rgba(245,200,66,0.15);">
					<div class="flex-1">
						<div class="text-[14px] font-bold text-white mb-0.5">Ready to bet?</div>
						<div class="text-[11px]" style="color:#4d5568;">Join free · Claim KSh 500 bonus</div>
					</div>
					<button
						onclick={() => { trackCTA('footer_mobile_join','footer'); authOpen = true; }}
						class="shrink-0 px-4 py-2 rounded-xl font-bold text-[13px]"
						style="background:#f5c842; color:#0b1628;"
					>Join Now</button>
				</div>

				<div class="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
					<div>
						<div class="flex items-center gap-2 mb-3">
							<span class="w-2 h-2 rounded-full bg-[#f5c842]"></span>
							<span class="font-display text-[18px] tracking-[2px] text-white">SOLAMI</span>
						</div>
						<p class="text-[12px] leading-relaxed" style="color:#4d5568;">
							Kenya's premier sports betting platform. Fast M-PESA payouts, competitive odds, 100+ markets per match.
						</p>
					</div>
					{#each [
						{ h:'Sports',  links:['Football','Basketball','Tennis','Rugby','Cricket'] },
						{ h:'Company', links:['About Us','Careers','Blog','Press'] },
						{ h:'Support', links:['Help Centre','Live Chat','Terms','Privacy Policy'] },
					] as col}
						<div>
							<h4 class="text-[10px] font-bold uppercase tracking-[1.2px] mb-3" style="color:#4d5568;">{col.h}</h4>
							{#each col.links as l}
								<button type="button" onclick={() => toasts.show(`${l} — coming soon!`,'info')}
									class="block text-[12px] mb-2 transition-colors cursor-pointer text-left w-full hover:text-[#e4e8f0]"
									style="color:#4d5568;">{l}</button>
							{/each}
						</div>
					{/each}
				</div>
				<div class="flex flex-wrap items-center justify-between gap-3 pt-4"
					style="border-top:1px solid rgba(255,255,255,0.06);">
					<p class="text-[11px]" style="color:#4d5568;">© 2026 Solami Ltd. Licensed by BCLB Kenya. 18+ only. Please gamble responsibly.</p>
					<div class="flex gap-2">
						{#each ['18+','BCLB','M-PESA','KE'] as b}
							<span class="text-[9px] font-bold uppercase px-2 py-1 rounded"
								style="background:rgba(255,255,255,0.04); color:#4d5568; border:1px solid rgba(255,255,255,0.07);">{b}</span>
						{/each}
					</div>
				</div>
			</footer>
		</div>
	</div>

	<!-- RIGHT BETSLIP -->
	<div class="hidden xl:flex flex-col shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)]"
		style="width:260px; border-left:1px solid rgba(255,255,255,0.07);">
		<BetSlipPanel />
	</div>
</div>

<!-- Mobile betslip -->
<div class="xl:hidden"><BetSlip /></div>

<!-- Page-level auth modal (hero CTA + footer CTA) -->
<AuthModal bind:open={authOpen} onClose={() => (authOpen = false)} />
