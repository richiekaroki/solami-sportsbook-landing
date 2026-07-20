<script lang="ts">
	import { Search, Plane } from 'lucide-svelte';
	import { searchQuery } from '$lib/stores/search';
	import { goto } from '$app/navigation';

	const topGames = [
		{
			name: 'Aviator',
			href: '/aviator',
			bg: 'linear-gradient(135deg,#1a0505,#0d0202)',
			accent: '#ff4444',
			glow: 'rgba(255,68,68,0.12)',
			icon: Plane
		}
	];
</script>

<aside class="flex flex-col h-full overflow-y-auto" style="scrollbar-width:none;">
	<!-- Search -->
	<div class="px-3 pt-3 pb-2 shrink-0">
		<div
			class="flex items-center gap-2 rounded-xl px-3 py-2.5 focus-ring-gold cursor-text"
			style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);"
		>
			<Search size={13} style="color:var(--color-text-muted); flex-shrink:0;" />
			<input
				type="text"
				bind:value={$searchQuery}
				placeholder="Search teams..."
				aria-label="Search teams"
				class="bg-transparent outline-none text-[12px] w-full"
				style="color:var(--color-text);"
			/>
		</div>
	</div>

	<!-- Top Games -->
	<div class="px-3 pt-3 pb-2 shrink-0">
		<div
			class="text-[10px] font-bold uppercase tracking-[1.2px] mb-2.5"
			style="color:var(--color-text-muted);"
		>
			Top Games
		</div>
		<div class="flex flex-col gap-1.5">
			{#each topGames as game}
				<a
					href={game.href}
					aria-label="Play {game.name}"
					class="w-full rounded-xl overflow-hidden flex items-center gap-3 px-3 py-2.5 hover-slide-right text-left"
					style="background:{game.bg}; border:1px solid rgba(255,255,255,0.04); box-shadow:inset 0 0 24px {game.glow};"
				>
					<game.icon size={20} style="color:{game.accent}; flex-shrink:0;" />
					<span class="font-bold text-[13px] tracking-[0.5px]" style="color:{game.accent};">
						{game.name}
					</span>
				</a>
			{/each}
		</div>
	</div>
</aside>
