<script lang="ts">
	import type { Game } from '$lib/types';
	interface Tab { id: string; label: string; icon: string; count: number; }
	interface Props { games: Game[]; activeComp: string; onSelect: (c: string) => void; }
	let { games, activeComp, onSelect }: Props = $props();

	function buildTabs(list: Game[]): Tab[] {
		const map = new Map<string, Tab>();
		for (const g of list) {
			const key = String(g.competition_id);
			if (!map.has(key)) map.set(key, { id:key, label:g.competition_name, icon: g.competition_id===7 ? '⭐' : '🇪🇸', count:0 });
			map.get(key)!.count++;
		}
		return [{ id:'all', label:'All Matches', icon:'⚽', count:list.length }, ...map.values()];
	}
	const tabs = $derived(buildTabs(games));
</script>

<div class="flex gap-1.5 overflow-x-auto pb-1" style="scrollbar-width: thin; -webkit-overflow-scrolling: touch;">
	{#each tabs as tab (tab.id)}
		<button
			onclick={() => onSelect(tab.id)}
			class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all duration-150 whitespace-nowrap"
			style="
				background:{activeComp===tab.id ? 'rgba(245,200,66,0.1)' : 'rgba(255,255,255,0.04)'};
				border-color:{activeComp===tab.id ? 'rgba(245,200,66,0.4)' : 'rgba(255,255,255,0.07)'};
				color:{activeComp===tab.id ? '#f5c842' : '#8892a4'};
				box-shadow:{activeComp===tab.id ? '0 0 12px rgba(245,200,66,0.1)' : 'none'};
			"
		>
			<span class="text-sm">{tab.icon}</span>
			<span class="hidden sm:inline">{tab.label}</span>
			<span class="sm:hidden">{tab.label === 'All Matches' ? 'All' : tab.label}</span>
			<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
				style="background:{activeComp===tab.id ? 'rgba(245,200,66,0.2)' : 'rgba(255,255,255,0.07)'}; color:{activeComp===tab.id ? '#f5c842' : '#4d5568'};">
				{tab.count}
			</span>
		</button>
	{/each}
</div>