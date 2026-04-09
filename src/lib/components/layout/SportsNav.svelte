<script lang="ts">
	import type { Game } from '$lib/types';

	interface Tab {
		id:    string;
		label: string;
		icon:  string;
		count: number;
	}

	interface Props {
		games:      Game[];
		activeComp: string;
		onSelect:   (comp: string) => void;
	}

	let { games, activeComp, onSelect }: Props = $props();

	function buildTabs(list: Game[]): Tab[] {
		const compMap = new Map<string, Tab>();
		for (const g of list) {
			const key = String(g.competition_id);
			if (!compMap.has(key)) {
				compMap.set(key, {
					id:    key,
					label: g.competition_name,
					icon:  g.competition_id === 7 ? '⭐' : '🇪🇸',
					count: 0,
				});
			}
			compMap.get(key)!.count++;
		}
		return [
			{ id: 'all', label: 'All Matches', icon: '⚽', count: list.length },
			...compMap.values(),
		];
	}

	const tabs = $derived(buildTabs(games));
</script>

<div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width:none;">
	{#each tabs as tab (tab.id)}
		<button
			onclick={() => onSelect(tab.id)}
			class="
				shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-[8px] border text-[12px] font-semibold
				transition-all duration-200 cursor-pointer whitespace-nowrap
				{activeComp === tab.id
					? 'bg-[rgba(245,200,66,0.08)] text-[#f5c842]'
					: 'bg-[#12141a] text-[#8b909f] hover:text-[#e8eaf0]'}
			"
			style="border-color: {activeComp === tab.id ? 'rgba(245,200,66,0.45)' : 'rgba(255,255,255,0.07)'}"
		>
			<span class="text-sm">{tab.icon}</span>
			{tab.label}
			<span
				class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
				style="
					background: {activeComp === tab.id ? 'rgba(245,200,66,0.2)' : '#252934'};
					color: {activeComp === tab.id ? '#f5c842' : '#5a5f72'};
				"
			>
				{tab.count}
			</span>
		</button>
	{/each}
</div>
