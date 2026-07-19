<script lang="ts">
	import type { Game } from '$lib/types';
	import { CircleDot } from 'lucide-svelte';
	interface Tab { id: string; label: string; abbr: string; color: string; count: number; }
	interface Props { games: Game[]; activeComp: string; onSelect: (c: string) => void; }
	let { games, activeComp, onSelect }: Props = $props();

	const COMP_COLORS: Record<number, string> = { 7: 'var(--color-blue)', 8: 'var(--color-red)' };

	function buildTabs(list: Game[]): Tab[] {
		const map = new Map<string, Tab>();
		for (const g of list) {
			const key = String(g.competition_id);
			if (!map.has(key)) {
				const color = COMP_COLORS[g.competition_id] ?? 'var(--color-red)';
				const abbr = g.competition_id === 7 ? 'CL' : g.competition_name.slice(0, 2).toUpperCase();
				map.set(key, { id:key, label:g.competition_name, abbr, color, count:0 });
			}
			map.get(key)!.count++;
		}
		return [{ id:'all', label:'All Matches', abbr:'ALL', color:'var(--color-gold)', count:list.length }, ...map.values()];
	}
	const tabs = $derived(buildTabs(games));
</script>

<div class="flex gap-1.5 overflow-x-auto pb-1" style="scrollbar-width:none;">
	{#each tabs as tab (tab.id)}
		<button
			onclick={() => onSelect(tab.id)}
			aria-label="Filter by {tab.label}"
			aria-pressed={activeComp===tab.id}
			class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer"
			style="
				background:{activeComp===tab.id ? 'var(--color-gold-soft)' : 'rgba(255,255,255,0.03)'};
				border-color:{activeComp===tab.id ? 'var(--color-gold-border)' : 'var(--color-border)'};
				color:{activeComp===tab.id ? 'var(--color-gold)' : 'var(--color-text-dim)'};
				box-shadow:{activeComp===tab.id ? '0 0 12px rgba(240,192,64,0.08)' : 'none'};
			"
		>
			<span class="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold"
				style="background:{tab.color}22; color:{tab.color};">
				{tab.abbr}
			</span>
			{tab.label}
			<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
				style="background:{activeComp===tab.id ? 'rgba(240,192,64,0.15)' : 'rgba(255,255,255,0.05)'}; color:{activeComp===tab.id ? 'var(--color-gold)' : 'var(--color-text-muted)'};">
				{tab.count}
			</span>
		</button>
	{/each}
</div>
