<script lang="ts">
	import gamesData from '$lib/../data/games.json';
	import type { Game } from '$lib/types';

	import BetSlip from '$lib/components/features/BetSlip.svelte';
	import BetSlipPanel from '$lib/components/features/BetSlipPanel.svelte';
	import MatchRow from '$lib/components/features/MatchRow.svelte';
//import OddsGrid      from '$lib/components/features/OddsGrid.svelte';
	import LeftSidebar from '$lib/components/layout/LeftSidebar.svelte';
	import PromoBanner from '$lib/components/layout/PromoBanner.svelte';
	import SportsNav from '$lib/components/layout/SportsNav.svelte';
	import { toasts } from '$lib/stores/toast';

	const games = gamesData as Game[];

	// Featured match
	// const featured = games.find((g) => g.parent_match_id === 69339342) ?? games[0];

	// Filter state
	let activeComp   = $state('all');
	let activeView   = $state<'highlights' | 'live' | 'upcoming'>('highlights');

	const filtered = $derived(
		activeComp === 'all'
			? games
			: games.filter((g) => String(g.competition_id) === activeComp)
	);

	function groupGames(list: Game[]) {
		const map = new Map<string, { compName: string; compId: number; games: Game[] }>();
		for (const g of list) {
			const key = String(g.competition_id);
			if (!map.has(key)) map.set(key, { compName: g.competition_name, compId: g.competition_id, games: [] });
			map.get(key)!.games.push(g);
		}
		return [...map.values()];
	}

	const grouped = $derived(groupGames(filtered));
</script>

<svelte:head>
	<title>Solami — Bet Smarter. Win Bigger.</title>
</svelte:head>

<!-- ═══ 3-COLUMN LAYOUT ═══ -->
<div class="flex w-full min-h-[calc(100vh-56px)]">

	<!-- LEFT SIDEBAR (fixed width, sticky) -->
	<div class="hidden xl:flex flex-col shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)] overflow-hidden"
		style="width:240px; background:#12141a; border-right:1px solid rgba(255,255,255,0.07);">
		<LeftSidebar />
	</div>

	<!-- CENTER FEED (flex-1, scrollable) -->
	<div class="flex-1 min-w-0 overflow-x-hidden">
		<div class="px-4 py-4">

			<!-- Promo banners -->
			<PromoBanner />

			<!-- View tabs: Highlights / Live / Upcoming -->
			<div class="flex items-center gap-1 mb-4">
				{#each [
					{ id: 'highlights', label: 'Highlights' },
					{ id: 'live',       label: '🔴 Live'     },
					{ id: 'upcoming',   label: 'Upcoming'   },
				] as tab}
					<button
						onclick={() => {
							activeView = tab.id as typeof activeView;
							if (tab.id !== 'highlights') toasts.show(`${tab.label.replace('🔴 ','')} — coming soon!`, 'info');
						}}
						class="px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150"
						style="
							background:{activeView === tab.id ? '#2ecc71' : '#1c1f29'};
							color:{activeView === tab.id ? '#fff' : '#8b909f'};
							border:1px solid {activeView === tab.id ? '#2ecc71' : 'rgba(255,255,255,0.07)'};
						"
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<!-- Competition filter tabs (SportsNav) -->
			<div class="mb-4">
				<SportsNav {games} {activeComp} onSelect={(c) => (activeComp = c)} />
			</div>

			<!-- Soccer section header -->
			<div class="flex items-center gap-2 px-3 py-2 rounded-lg mb-1"
				style="background:#0b1a2e;">
				<span class="text-[15px]">⚽</span>
				<span class="text-[13px] font-semibold text-white">Soccer</span>
			</div>

			<!-- Competition groups with inline match rows -->
			{#each grouped as group (group.compId)}
				<!-- Competition sub-header -->
				<div class="flex items-center justify-between px-3 py-2 mt-2 rounded-t-lg cursor-pointer"
					style="background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.06);"
				>
					<span class="text-[11px] font-bold uppercase tracking-[1px]"
						style="color:{group.compId === 7 ? '#6aadff' : '#ff7070'};">
						{group.compId === 7 ? '⭐' : '🇪🇸'} {group.compName}
					</span>
					<button
						onclick={() => toasts.show(`${group.compName} — coming soon!`, 'info')}
						class="text-[11px] font-semibold transition-colors"
						style="color:#5a5f72;"
						onmouseenter={(e) => (e.currentTarget as HTMLElement).style.color='#f5c842'}
						onmouseleave={(e) => (e.currentTarget as HTMLElement).style.color='#5a5f72'}
					>
						{group.games.length} matches &rsaquo;
					</button>
				</div>

				<!-- Column headers (matching the design) -->
				<div class="flex items-center px-3 py-1.5"
					style="background:rgba(255,255,255,0.02); border-bottom:1px solid rgba(255,255,255,0.04);">
					<div class="shrink-0 text-[10px] font-bold uppercase tracking-[0.8px]"
						style="width:160px; color:#5a5f72;">Match</div>
					<div class="flex gap-1 shrink-0">
						{#each ['1','X','2'] as h}
							<div class="text-[10px] font-bold text-center" style="width:44px; color:#5a5f72;">{h}</div>
						{/each}
					</div>
					<div class="mx-1.5 shrink-0"></div>
					<div class="flex gap-1 shrink-0">
						{#each ['1orX','1or2','Xor2'] as h}
							<div class="text-[9px] font-bold text-center" style="width:44px; color:#5a5f72;">{h}</div>
						{/each}
					</div>
					<div class="mx-1.5 shrink-0"></div>
					<div class="flex gap-1 shrink-0">
						{#each ['Yes','No'] as h}
							<div class="text-[10px] font-bold text-center" style="width:44px; color:#5a5f72;">{h}</div>
						{/each}
					</div>
					<div class="flex-1"></div>
					<div class="text-[10px] font-bold text-center shrink-0 ml-1.5" style="width:44px; color:#5a5f72;">More</div>
				</div>

				<!-- Match rows -->
				<div class="rounded-b-lg overflow-hidden px-3"
					style="background:#12141a; border:1px solid rgba(255,255,255,0.06); border-top:none;">
					{#each group.games as game (game.parent_match_id)}
						<MatchRow {game} />
					{/each}
				</div>
			{/each}

			<!-- Footer inside center -->
			<div class="mt-12 pt-8" style="border-top:1px solid rgba(255,255,255,0.07);">
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
					<div>
						<div class="flex items-center gap-2 mb-3">
							<span class="w-2 h-2 rounded-full bg-[#f5c842]"></span>
							<span class="font-display text-[18px] tracking-[2px] text-white">SOLAMI</span>
						</div>
						<p class="text-[12px] leading-relaxed" style="color:#5a5f72;">
							Kenya's premier sportsbook. Fast payouts, competitive odds.
						</p>
					</div>
					{#each [
						{ h:'Sports',  links:['Football','Basketball','Tennis','Rugby'] },
						{ h:'Company', links:['About Us','Careers','Blog','Press'] },
						{ h:'Support', links:['Help Centre','Live Chat','Terms','Privacy'] },
					] as col}
						<div>
							<h4 class="text-[10px] font-bold uppercase tracking-[1.2px] mb-3" style="color:#5a5f72;">{col.h}</h4>
							{#each col.links as l}
								<button
	type="button"
	class="text-[12px] mb-2 transition-colors cursor-pointer text-left hover:text-[#e8eaf0]"
	style="color:#5a5f72;"
>
	{l}
</button>
							{/each}
						</div>
					{/each}
				</div>
				<div class="flex flex-wrap items-center justify-between gap-3 pt-4"
					style="border-top:1px solid rgba(255,255,255,0.07);">
					<p class="text-[11px]" style="color:#5a5f72;">© 2026 Solami Ltd. Licensed by BCLB Kenya. 18+ only.</p>
					<div class="flex gap-2">
						{#each ['18+','BCLB','M-PESA','KE'] as b}
							<span class="text-[9px] font-bold uppercase px-2 py-1 rounded"
								style="background:#1c1f29; color:#5a5f72; border:1px solid rgba(255,255,255,0.07);">{b}</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- RIGHT BETSLIP PANEL (fixed width, sticky) -->
	<div class="hidden xl:flex flex-col shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)]"
		style="width:260px; border-left:1px solid rgba(255,255,255,0.07);">
		<BetSlipPanel />
	</div>

</div>

<!-- Mobile: floating cart + bottom sheet betslip -->
<div class="xl:hidden">
	<BetSlip />
</div>
