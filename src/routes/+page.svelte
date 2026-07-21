<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import gamesData from '$lib/../data/games.json';
	import type { Game } from '$lib/types';

	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import TrustSection from '$lib/components/sections/TrustSection.svelte';
	import BetSlip from '$lib/components/features/BetSlip.svelte';
	import BetSlipPanel from '$lib/components/features/BetSlipPanel.svelte';
	import OddsGrid from '$lib/components/features/OddsGrid.svelte';
	import MatchRow from '$lib/components/features/MatchRow.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import PromoBanner from '$lib/components/layout/PromoBanner.svelte';
	import SportsNav from '$lib/components/layout/SportsNav.svelte';
	import ReferAFriend from '$lib/components/sections/ReferAFriend.svelte';
	import ResponsibleGambling from '$lib/components/sections/ResponsibleGambling.svelte';
	import { searchQuery } from '$lib/stores/search';
	import { authModalOpen } from '$lib/stores/auth';
	import { trackCTA } from '$lib/utils/tracking';
	import { CircleDot } from 'lucide-svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';

	// Deep-clone so we can mutate for live odds simulation
	let games = $state<Game[]>(JSON.parse(JSON.stringify(gamesData)));
	let loaded = $state(false);

	// Featured match — FC Barcelona vs Atletico Madrid (UCL)
	const featured = games.find((g) => g.parent_match_id === 69339342) ?? games[0];

	let activeComp = $state('all');

	// Filter by competition tab AND search query
	const filtered = $derived(
		(() => {
			const query = $searchQuery.toLowerCase().trim();
			let list =
				activeComp === 'all' ? games : games.filter((g) => String(g.competition_id) === activeComp);
			if (query) {
				list = list.filter(
					(g) =>
						g.home_team.toLowerCase().includes(query) ||
						g.away_team.toLowerCase().includes(query) ||
						g.competition_name.toLowerCase().includes(query)
				);
			}
			return list;
		})()
	);

	function groupGames(list: Game[]) {
		const map = new Map<string, { compName: string; compId: number; games: Game[] }>();
		for (const g of list) {
			const key = String(g.competition_id);
			if (!map.has(key))
				map.set(key, { compName: g.competition_name, compId: g.competition_id, games: [] });
			map.get(key)!.games.push(g);
		}
		return [...map.values()];
	}
	const grouped = $derived(groupGames(filtered));

	// Live odds simulation
	let ticker: ReturnType<typeof setInterval>;
	onMount(() => {
		// Simulate brief loading for skeleton transition
		requestAnimationFrame(() => {
			loaded = true;
		});

		ticker = setInterval(() => {
			const count = 2 + Math.floor(Math.random() * 2);
			for (let i = 0; i < count; i++) {
				const gIdx = Math.floor(Math.random() * games.length);
				const g = games[gIdx];
				const mIdx = Math.floor(Math.random() * g.markets.length);
				const m = g.markets[mIdx];
				const oIdx = Math.floor(Math.random() * m.odds.length);
				const o = m.odds[oIdx];
				const prev = o.odd_value;
				const delta = (Math.random() * 0.08 + 0.02) * (Math.random() > 0.5 ? 1 : -1);
				const next = Math.max(1.01, parseFloat((prev + delta).toFixed(2)));
				games[gIdx].markets[mIdx].odds[oIdx] = { ...o, prev_odd_value: prev, odd_value: next };
			}
		}, 6000);
	});
	onDestroy(() => clearInterval(ticker));
</script>

<svelte:head>
	<title>WAM — Bet Smarter. Win Bigger.</title>
	<meta
		name="description"
		content="Sports betting with instant M-PESA payouts. Bet on LaLiga, UCL, Premier League with 100+ markets per match. Licensed by BCLB Kenya."
	/>
	<meta property="og:title" content="WAM — Bet Smarter. Win Bigger." />
	<meta
		property="og:description"
		content="Kenya's premier sportsbook. 100+ markets per match. Instant M-PESA payouts. Licensed by BCLB Kenya."
	/>
	<meta property="og:url" content="https://wam.co.ke" />
	<meta name="twitter:title" content="WAM — Bet Smarter. Win Bigger." />
	<meta
		name="twitter:description"
		content="Kenya's premier sportsbook. 100+ markets per match. Instant M-PESA payouts."
	/>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "SportsOrganization",
			"name": "WAM Sportsbook",
			"url": "https://wam.co.ke",
			"description": "Kenya's premier sportsbook with instant M-PESA payouts. Bet on LaLiga, UCL, Premier League with 100+ markets per match.",
			"areaServed": {
				"@type": "Country",
				"name": "Kenya"
			},
			"sameAs": [],
			"offers": {
				"@type": "Offer",
				"description": "Welcome bonus: Get KSh 500 free on signup",
				"priceCurrency": "KES",
				"price": "0"
			},
			"hasOfferCatalog": {
				"@type": "OfferCatalog",
				"name": "Sports Betting Markets",
				"itemListElement": [
					{
						"@type": "Offer",
						"itemOffered": {
							"@type": "SportsEvent",
							"name": "LaLiga Football",
							"sport": "Football"
						}
					},
					{
						"@type": "Offer",
						"itemOffered": {
							"@type": "SportsEvent",
							"name": "UEFA Champions League",
							"sport": "Football"
						}
					},
					{
						"@type": "Offer",
						"itemOffered": {
							"@type": "SportsEvent",
							"name": "Premier League",
							"sport": "Football"
						}
					}
				]
			}
		}
	</script>
</svelte:head>

<div class="flex w-full min-h-[calc(100vh-56px)]">
	<!-- LEFT SIDEBAR -->
	<div
		class="hidden xl:flex flex-col shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)] overflow-hidden"
		style="width:240px; background:var(--color-nav); border-right:1px solid var(--color-border);"
	>
		<Sidebar />
	</div>

	<!-- CENTER FEED -->
	<main id="main-content" class="flex-1 min-w-0 overflow-x-hidden">
		<div class="px-4 py-4">
			<!-- 1. HERO — conversion block -->
			<HeroSection onJoin={() => authModalOpen.set(true)} />

			<!-- 2. FEATURED MATCH -->
			<div class="mb-4" id="featured">
				<div class="flex items-center gap-3 mb-2.5">
					<span
						class="text-[10px] font-bold uppercase tracking-[1.5px]"
						style="color:var(--color-text-muted);">Featured Match</span
					>
					<div class="flex-1 h-px" style="background:var(--color-border);"></div>
					<span
						class="flex items-center gap-1 text-[10px] font-semibold"
						style="color:var(--color-green);"
					>
						<span
							class="w-1.5 h-1.5 rounded-full animate-pulse-dot"
							style="background:var(--color-green);"
						></span>
						Odds updating live
					</span>
				</div>
				<OddsGrid game={featured} />
			</div>

			<!-- 3. PROMO BANNERS -->
			<PromoBanner />

			<!-- 4. MATCH FEED -->
			<div id="matches">
				<!-- Competition filter -->
				<div class="mb-4">
					<SportsNav {games} {activeComp} onSelect={(c) => (activeComp = c)} />
				</div>

				<!-- Soccer header -->
				<div
					class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-2"
					style="background:linear-gradient(160deg,var(--color-card) 0%,var(--color-card-hover) 100%); border:1px solid var(--color-border);"
				>
					<CircleDot size={18} style="color:var(--color-green);" />
					<span class="text-[14px] font-bold" style="color:var(--color-text);">Soccer</span>
					<span class="ml-auto text-[11px] font-semibold" style="color:var(--color-text-muted);"
						>{filtered.length} events</span
					>
				</div>

				<!-- Match groups -->
				<div class="overflow-x-auto" style="-webkit-overflow-scrolling:touch;">
					<div style="min-width:0;">
						{#if !loaded}
							<!-- Loading skeleton -->
							<div class="flex items-center gap-2 mb-3 px-1">
								<div
									class="w-1.5 h-1.5 rounded-full animate-pulse-dot"
									style="background:var(--color-gold);"
								></div>
								<span class="text-[11px] font-semibold" style="color:var(--color-text-muted);"
									>Loading matches...</span
								>
							</div>
							{#each [1, 2, 3] as _}
								<div class="mb-3">
									<div
										class="h-8 rounded-t-xl animate-pulse"
										style="background:rgba(255,255,255,0.03);"
									></div>
									<div
										class="rounded-b-xl overflow-hidden"
										style="background:var(--color-nav); border:1px solid var(--color-border); border-top:none;"
									>
										{#each [1, 2, 3] as _}
											<div
												class="flex items-center gap-3 px-3 py-3"
												style="border-bottom:1px solid rgba(255,255,255,0.03);"
											>
												<div class="flex-1 flex flex-col gap-1.5">
													<div
														class="h-3 rounded animate-pulse"
														style="background:rgba(255,255,255,0.04); width:60%;"
													></div>
													<div
														class="h-3 rounded animate-pulse"
														style="background:rgba(255,255,255,0.04); width:50%;"
													></div>
												</div>
												<div class="flex gap-1">
													{#each [1, 2, 3, 4, 5, 6, 7] as _}
														<div
															class="w-[44px] h-[44px] rounded-lg animate-pulse"
															style="background:rgba(255,255,255,0.03);"
														></div>
													{/each}
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/each}
						{:else if filtered.length === 0}
							<div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
								<CircleDot size={40} style="color:var(--color-text-muted); opacity:0.3;" />
								<div class="text-[14px] font-semibold" style="color:var(--color-text-muted);">
									No matches found
								</div>
								{#if $searchQuery}
									<div class="text-[12px]" style="color:var(--color-text-muted);">
										No results for "<span style="color:var(--color-text);">{$searchQuery}</span>"
									</div>
									<button
										onclick={() => ($searchQuery = '')}
										class="text-[12px] font-semibold transition-colors cursor-pointer"
										style="color:var(--color-gold);">Clear search</button
									>
								{/if}
							</div>
						{:else}
							{#each grouped as group (group.compId)}
								<div
									class="flex items-center justify-between px-3.5 py-2 mt-3 first:mt-0 rounded-t-xl"
									style="background:rgba(255,255,255,0.02); border:1px solid var(--color-border); border-bottom:none;"
								>
									<span
										class="text-[11px] font-bold uppercase tracking-[1.2px] flex items-center gap-1.5 min-w-0 flex-1"
										style="color:{group.compId === 7 ? 'var(--color-blue)' : 'var(--color-red)'};"
									>
										<span
											class="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold shrink-0"
											style="background:{group.compId === 7
												? 'rgba(96,165,250,0.12)'
												: 'rgba(248,113,113,0.12)'};"
										>
											{group.compId === 7 ? 'CL' : 'LL'}
										</span>
										<span class="truncate">{group.compName}</span>
									</span>
									<span class="text-[11px] font-semibold" style="color:var(--color-text-muted);"
										>{group.games.length} matches</span
									>
								</div>

								<!-- Column headers -->
								<div
									class="flex items-center px-3 py-1.5"
									style="background:rgba(255,255,255,0.012); border:1px solid var(--color-border); border-bottom:none; border-top:1px solid rgba(255,255,255,0.03);"
								>
									<div
										class="shrink-0 text-[10px] font-bold uppercase tracking-[0.8px]"
										style="width:168px; color:var(--color-text-muted);"
									>
										Match
									</div>
									<div class="flex items-center gap-1.5 shrink-0">
										<span
											class="text-[10px] font-bold uppercase tracking-[0.5px] mr-0.5 border-b border-dotted cursor-help"
											style="color:var(--color-text-muted); border-color:var(--color-text-muted);"
											>1X2</span
										>
										<Tooltip text="Match result: Home win (1), Draw (X), or Away win (2)" />
										{#each ['1', 'X', '2'] as h}<div
												class="text-[10px] font-bold text-center"
												style="width:52px; color:var(--color-text-muted);"
											>
												{h}
											</div>{/each}
									</div>
									<div
										class="mx-1.5 shrink-0 w-px h-4"
										style="background:rgba(255,255,255,0.04);"
									></div>
									<div class="flex items-center gap-1 shrink-0">
										<span
											class="text-[10px] font-bold uppercase tracking-[0.5px] mr-0.5 border-b border-dotted cursor-help"
											style="color:var(--color-text-muted); border-color:var(--color-text-muted);"
											>DC</span
										>
										<Tooltip
											text="Double Chance: Cover two outcomes — Home or Draw (1X), Home or Away (12), Draw or Away (X2)"
										/>
										{#each ['1orX', '1or2', 'Xor2'] as h}<div
												class="text-[9px] font-bold text-center"
												style="width:44px; color:var(--color-text-muted);"
											>
												{h}
											</div>{/each}
									</div>
									<div
										class="mx-1.5 shrink-0 w-px h-4"
										style="background:rgba(255,255,255,0.04);"
									></div>
									<div class="flex items-center gap-1 shrink-0">
										<span
											class="text-[10px] font-bold uppercase tracking-[0.5px] mr-0.5 border-b border-dotted cursor-help"
											style="color:var(--color-text-muted); border-color:var(--color-text-muted);"
											>GG/NG</span
										>
										<Tooltip
											text="Both Teams to Score: Yes (both score) or No (at least one doesn't)"
										/>
										{#each ['Yes', 'No'] as h}<div
												class="text-[10px] font-bold text-center"
												style="width:44px; color:var(--color-text-muted);"
											>
												{h}
											</div>{/each}
									</div>
									<div class="flex-1"></div>
								</div>

								<div
									class="overflow-hidden rounded-b-xl"
									style="background:var(--color-nav); border:1px solid var(--color-border); border-top:none;"
								>
									{#each group.games as game (game.parent_match_id)}
										<MatchRow {game} />
									{/each}
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<!-- 5. HOW TO BET -->
			<div
				class="mt-6 rounded-xl px-5 py-4"
				style="background:var(--color-card); border:1px solid var(--color-border);"
			>
				<div class="flex items-center gap-2 mb-3">
					<span class="text-[13px] font-bold" style="color:var(--color-text);">How to bet</span>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<div class="flex items-start gap-2.5">
						<span
							class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
							style="background:rgba(240,192,64,0.12); color:var(--color-gold);">1</span
						>
						<div>
							<div class="text-[12px] font-semibold" style="color:var(--color-text);">
								Pick your odds
							</div>
							<div class="text-[11px]" style="color:var(--color-text-muted);">
								Tap any odds button to add it to your slip
							</div>
						</div>
					</div>
					<div class="flex items-start gap-2.5">
						<span
							class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
							style="background:rgba(240,192,64,0.12); color:var(--color-gold);">2</span
						>
						<div>
							<div class="text-[12px] font-semibold" style="color:var(--color-text);">
								Set your stake
							</div>
							<div class="text-[11px]" style="color:var(--color-text-muted);">
								Enter amount or use quick-stake buttons
							</div>
						</div>
					</div>
					<div class="flex items-start gap-2.5">
						<span
							class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
							style="background:rgba(240,192,64,0.12); color:var(--color-gold);">3</span
						>
						<div>
							<div class="text-[12px] font-semibold" style="color:var(--color-text);">
								Place & win
							</div>
							<div class="text-[11px]" style="color:var(--color-text-muted);">
								Confirm your bet, payouts via M-PESA in minutes
							</div>
						</div>
					</div>
				</div>
				<div
					class="mt-3 pt-3 flex flex-col gap-2 text-[10px]"
					style="border-top:1px solid var(--color-border); color:var(--color-text-muted);"
				>
					<div class="flex items-center gap-4">
						<span
							>Keyboard: <kbd
								class="px-1 py-0.5 rounded text-[9px] font-mono"
								style="background:rgba(255,255,255,0.06);">←→</kbd
							>
							navigate
							<kbd
								class="px-1 py-0.5 rounded text-[9px] font-mono"
								style="background:rgba(255,255,255,0.06);">Enter</kbd
							>
							select
							<kbd
								class="px-1 py-0.5 rounded text-[9px] font-mono"
								style="background:rgba(255,255,255,0.06);">↑↓</kbd
							>
							rows
							<kbd
								class="px-1 py-0.5 rounded text-[9px] font-mono"
								style="background:rgba(255,255,255,0.06);">1-4</kbd
							> quick stake</span
						>
						<span
							>Odds: <span style="color:var(--color-green);">▲</span> rising
							<span style="color:var(--color-red);">▼</span> falling</span
						>
					</div>
				</div>
			</div>

			<!-- 6. TRUST SECTION -->
			<TrustSection />

			<!-- 5b. REFER A FRIEND -->
			<ReferAFriend />

			<!-- 6. FOOTER -->
			<footer class="mt-8 pt-8" style="border-top:1px solid var(--color-border);">
				<!-- Responsible Gambling -->
				<ResponsibleGambling />

				<!-- Mobile sticky CTA -->
				<div
					class="xl:hidden flex gap-3 mb-8 p-4 rounded-2xl"
					style="background:linear-gradient(155deg,var(--color-card),var(--color-card-hover)); border:1px solid rgba(240,192,64,0.12);"
				>
					<div class="flex-1">
						<div class="text-[14px] font-bold mb-0.5" style="color:var(--color-text);">
							Ready to bet?
						</div>
						<div class="text-[11px]" style="color:var(--color-text-muted);">
							Join free · Claim KSh 500 bonus
						</div>
					</div>
					<button
						onclick={() => {
							trackCTA('footer_mobile_join', 'footer');
							authModalOpen.set(true);
						}}
						aria-label="Join now and claim bonus"
						class="shrink-0 px-4 py-2 rounded-xl font-bold text-[13px] cursor-pointer"
						style="background:var(--color-gold); color:var(--color-nav);"
						>Join Free — Claim KSh 500</button
					>
				</div>

				<div class="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
					<div>
						<div class="flex items-center gap-2 mb-3">
							<span class="w-2 h-2 rounded-full" style="background:var(--color-gold);"></span>
							<span class="font-display text-[18px] tracking-[2px]" style="color:var(--color-text);"
								>WAM</span
							>
						</div>
						<p class="text-[12px] leading-relaxed" style="color:var(--color-text-muted);">
							Sports betting with instant M-PESA payouts. Competitive odds across LaLiga, Champions
							League, and Premier League.
						</p>
					</div>
					{#each [{ h: 'Sports', links: ['Football', 'Basketball', 'Tennis', 'Rugby', 'Cricket'] }, { h: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] }, { h: 'Support', links: ['Help Centre', 'Live Chat', 'Terms', 'Privacy Policy'] }] as col}
						<div>
							<h4
								class="text-[10px] font-bold uppercase tracking-[1.2px] mb-3"
								style="color:var(--color-text-muted);"
							>
								{col.h}
							</h4>
							{#each col.links as l}
								<a
									href="/"
									class="block text-[12px] mb-2 transition-colors hover:text-white"
									style="color:var(--color-text-muted);">{l}</a
								>
							{/each}
						</div>
					{/each}
				</div>
				<div
					class="flex flex-wrap items-center justify-between gap-3 pt-4"
					style="border-top:1px solid var(--color-border);"
				>
					<p class="text-[11px]" style="color:var(--color-text-muted);">
						© 2026 WAM Ltd. Licensed by BCLB Kenya. 18+ only. Please gamble responsibly.
					</p>
					<div class="flex gap-2">
						{#each ['18+', 'BCLB', 'M-PESA', 'KE'] as b}
							<span
								class="text-[9px] font-bold uppercase px-2 py-1 rounded"
								style="background:rgba(255,255,255,0.03); color:var(--color-text-muted); border:1px solid var(--color-border);"
								>{b}</span
							>
						{/each}
					</div>
				</div>
			</footer>
		</div>
	</main>

	<!-- RIGHT BETSLIP -->
	<div
		class="hidden xl:flex flex-col shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)]"
		style="width:260px; border-left:1px solid rgba(255,255,255,0.07);"
	>
		<BetSlipPanel />
	</div>
</div>

<!-- Mobile betslip -->
<div class="xl:hidden"><BetSlip /></div>
