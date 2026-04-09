<script lang="ts">
	import { Search } from 'lucide-svelte';
	import { toasts } from '$lib/stores/toast';

	const topGames = [
		{ name: 'Aviator',    bg: '#1a0a0a', color: '#ff3333', emoji: '✈️' },
		{ name: 'JetX',       bg: '#0a0a2a', color: '#4488ff', emoji: '🚀' },
		{ name: 'Navigator',  bg: '#0a1a0a', color: '#44ff88', emoji: '🎯' },
	];
</script>

<aside class="flex flex-col h-full overflow-y-auto" style="scrollbar-width:none;">

	<!-- Search -->
	<div class="px-3 py-3 shrink-0">
		<div class="flex items-center gap-2 rounded-lg px-3 py-2"
			style="background:#1c1f29; border:1px solid rgba(255,255,255,0.07);">
			<Search size={13} style="color:#5a5f72; flex-shrink:0;" />
			<input
				type="text"
				placeholder="Search"
				class="bg-transparent outline-none text-[13px] w-full placeholder:text-[#5a5f72]"
				style="color:#e8eaf0;"
			/>
		</div>
	</div>

	<!-- Icon nav row -->
	<div class="flex items-center justify-around px-2 pb-3 shrink-0"
		style="border-bottom:1px solid rgba(255,255,255,0.07);">
		{#each [
			{ label: 'My Bets',      icon: '📋' },
			{ label: 'Profile',      icon: '👤' },
			{ label: 'Chat us',      icon: '💬' },
			{ label: 'Join Affiliate', icon: '🤝' },
			{ label: 'Promos',       icon: '🎁' },
		] as item}
			<button
				onclick={() => toasts.show(`${item.label} — coming soon!`, 'info')}
				class="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-colors duration-150 min-w-0"
				style="color:#5a5f72;"
				onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.color='#e8eaf0'; (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)'; }}
				onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.color='#5a5f72'; (e.currentTarget as HTMLElement).style.background='transparent'; }}
			>
				<span class="text-[16px] leading-none">{item.icon}</span>
				<span class="text-[9px] font-medium leading-tight text-center" style="max-width:40px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{item.label}</span>
			</button>
		{/each}
	</div>

	<!-- Top Games -->
	<div class="px-3 pt-3 pb-2 shrink-0">
		<div class="text-[11px] font-bold uppercase tracking-[1px] mb-2.5" style="color:#5a5f72;">
			Top Games
		</div>
		<div class="flex flex-col gap-1.5">
			{#each topGames as game}
				<button
					onclick={() => toasts.show(`${game.name} — coming soon!`, 'info')}
					class="w-full rounded-lg overflow-hidden flex items-center gap-3 px-3 py-2.5 transition-all duration-150"
					style="background:{game.bg}; border:1px solid rgba(255,255,255,0.06);"
					onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.transform='translateX(2px)'; }}
					onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.transform=''; }}
				>
					<span class="text-[20px] leading-none">{game.emoji}</span>
					<span class="font-bold text-[13px] tracking-[1px]" style="color:{game.color};">{game.name}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Top Leagues -->
	<div class="px-3 pt-2">
		<div class="text-[11px] font-bold uppercase tracking-[1px] mb-2.5" style="color:#5a5f72;">
			Top Leagues
		</div>
		<div class="flex flex-col gap-1">
			{#each [
				{ name: 'LaLiga',              flag: '🇪🇸' },
				{ name: 'UEFA Champions League', flag: '⭐' },
				{ name: 'Premier League',        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
				{ name: 'Bundesliga',            flag: '🇩🇪' },
				{ name: 'Serie A',               flag: '🇮🇹' },
			] as league}
				<button
					onclick={() => toasts.show(`${league.name} — coming soon!`, 'info')}
					class="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] font-medium text-left transition-colors duration-150"
					style="color:#8b909f;"
					onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color='#e8eaf0'; }}
					onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='#8b909f'; }}
				>
					<span class="text-sm">{league.flag}</span>
					{league.name}
				</button>
			{/each}
		</div>
	</div>
</aside>
