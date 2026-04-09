<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { Search } from 'lucide-svelte';

	const topGames = [
		{ name:'Aviator',   bg:'linear-gradient(135deg,#1a0505,#0d0202)', accent:'#ff4444', glow:'rgba(255,68,68,0.15)', emoji:'✈️' },
		{ name:'JetX',      bg:'linear-gradient(135deg,#05071a,#02040d)', accent:'#4488ff', glow:'rgba(68,136,255,0.15)', emoji:'🚀' },
		{ name:'Navigator', bg:'linear-gradient(135deg,#051a07,#020d03)', accent:'#44dd88', glow:'rgba(68,221,136,0.15)', emoji:'🎯' },
	];

	const topLeagues = [
		{ name:'LaLiga',               flag:'🇪🇸', color:'#f87171' },
		{ name:'UEFA Champions League', flag:'⭐', color:'#60a5fa' },
		{ name:'Premier League',        flag:'EN', color:'#a78bfa' },
		{ name:'Bundesliga',            flag:'🇩🇪', color:'#fb923c' },
		{ name:'Serie A',               flag:'🇮🇹', color:'#4ade80' },
	];
</script>

<aside class="flex flex-col h-full overflow-y-auto" style="scrollbar-width:none;">

	<!-- Search -->
	<div class="px-3 pt-3 pb-2 shrink-0">
		<div class="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-150"
			style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);"
			onfocus={(e: FocusEvent) => ((e.currentTarget as HTMLElement).style.borderColor='rgba(245,200,66,0.35)')}
			onblur={(e: FocusEvent) => ((e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)')}
		>
			<Search size={13} style="color:#4d5568; flex-shrink:0;" />
			<input type="text" placeholder="Search leagues, teams..."
				class="bg-transparent outline-none text-[12px] w-full placeholder:text-[#4d5568]"
				style="color:#e4e8f0;" />
		</div>
	</div>

	<!-- Icon nav row -->
	<div class="grid grid-cols-5 px-2 pb-3 shrink-0"
		style="border-bottom:1px solid rgba(255,255,255,0.06);">
		{#each [
			{ label:'My Bets', icon:'📋' },
			{ label:'Profile', icon:'👤' },
			{ label:'Chat',    icon:'💬' },
			{ label:'Affiliate', icon:'🤝' },
			{ label:'Promos',  icon:'🎁' },
		] as item}
			<button
				onclick={() => toasts.show(`${item.label} — coming soon!`, 'info')}
				class="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all duration-150"
				style="color:#4d5568;"
				onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,0.04)'; el.style.color='#e4e8f0'; }}
				onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='transparent'; el.style.color='#4d5568'; }}
			>
				<span class="text-[18px] leading-none">{item.icon}</span>
				<span class="text-[9px] font-medium leading-tight text-center" style="max-width:44px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{item.label}</span>
			</button>
		{/each}
	</div>

	<!-- Top Games -->
	<div class="px-3 pt-3 pb-2 shrink-0">
		<div class="text-[10px] font-bold uppercase tracking-[1.2px] mb-2.5" style="color:#4d5568;">Top Games</div>
		<div class="flex flex-col gap-1.5">
			{#each topGames as game}
				<button
					onclick={() => toasts.show(`${game.name} — coming soon!`, 'info')}
					class="w-full rounded-xl overflow-hidden flex items-center gap-3 px-3 py-2.5 transition-all duration-200 text-left"
					style="background:{game.bg}; border:1px solid rgba(255,255,255,0.05); box-shadow:inset 0 0 20px {game.glow};"
					onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform='translateX(3px)'; el.style.borderColor='rgba(255,255,255,0.1)'; }}
					onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform=''; el.style.borderColor='rgba(255,255,255,0.05)'; }}
				>
					<span class="text-[22px] leading-none">{game.emoji}</span>
					<span class="font-bold text-[13px] tracking-[0.5px]" style="color:{game.accent}; text-shadow:0 0 12px {game.glow};">{game.name}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Top Leagues -->
	<div class="px-3 pt-1">
		<div class="text-[10px] font-bold uppercase tracking-[1.2px] mb-2" style="color:#4d5568;">Top Leagues</div>
		<div class="flex flex-col gap-0.5">
			{#each topLeagues as league}
				<button
					onclick={() => toasts.show(`${league.name} — coming soon!`, 'info')}
					class="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] font-medium text-left transition-all duration-150"
					style="color:#8892a4;"
					onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,0.04)'; el.style.color=league.color; }}
					onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='transparent'; el.style.color='#8892a4'; }}
				>
					<span class="text-sm shrink-0">{league.flag}</span>
					<span class="truncate">{league.name}</span>
				</button>
			{/each}
		</div>
	</div>
</aside>