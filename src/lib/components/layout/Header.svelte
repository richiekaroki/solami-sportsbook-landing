<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { selectionCount } from '$lib/stores/betslip';
	import { Menu, X } from 'lucide-svelte';

	let mobileMenuOpen = $state(false);

	const navItems = [
		{ label: 'Home',       icon: '🏠', active: true  },
		{ label: 'Live',       icon: '🔴', active: false },
		{ label: 'Aviator',    icon: '✈️', active: false },
		{ label: 'Crash',      icon: '💥', active: false },
		{ label: 'League',     icon: '🏆', active: false },
	];

	function handleNav(item: typeof navItems[0]) {
		if (!item.active) toasts.show(`${item.label} — coming soon!`, 'info');
	}
</script>

<!-- Full-width top bar — sits above the 3-column layout -->
<header class="fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center"
	style="background:#0b1a2e; border-bottom:1px solid rgba(255,255,255,0.08);">
	<div class="flex items-center h-full w-full">

		<!-- Logo zone (same width as left sidebar: 240px) -->
		<div class="shrink-0 flex items-center gap-2.5 px-4 h-full"
			style="width:240px; border-right:1px solid rgba(255,255,255,0.08);">
			<div class="relative w-6 h-6 flex items-center justify-center">
				<span class="absolute w-4 h-4 rounded-full bg-[#f5c842] animate-pulse-dot opacity-60"></span>
				<span class="relative w-2.5 h-2.5 rounded-full bg-[#f5c842]"></span>
			</div>
			<span class="font-display text-[24px] tracking-[3px] text-white leading-none">SOLAMI</span>
		</div>

		<!-- Center nav (flex-1) -->
		<div class="flex-1 flex items-center gap-1.5 px-4 h-full overflow-x-auto" style="scrollbar-width:none;">
			{#each navItems as item}
				<button
					onclick={() => handleNav(item)}
					class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all duration-150 shrink-0"
					style="
						background:{item.active ? '#2ecc71' : 'transparent'};
						color:{item.active ? '#fff' : '#8b909f'};
					"
					onmouseenter={(e) => { if (!item.active) { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color='#e8eaf0'; } }}
					onmouseleave={(e) => { if (!item.active) { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='#8b909f'; } }}
				>
					<span class="text-[14px]">{item.icon}</span>
					{item.label}
					{#if !item.active}
						<span class="hidden sm:inline text-[8px] font-bold px-1 rounded leading-tight"
							style="background:rgba(245,200,66,0.12); color:#f5c842;">
							SOON
						</span>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Right actions (same width as betslip panel: 260px) -->
		<div class="shrink-0 flex items-center justify-end gap-2 px-4 h-full"
			style="width:260px; border-left:1px solid rgba(255,255,255,0.08);">
			{#if $selectionCount > 0}
				<div class="flex items-center gap-1.5 text-[12px] font-semibold"
					style="color:#f5c842;">
					<span class="w-5 h-5 rounded-full bg-[#f5c842] text-[#0b0c0f] text-[11px] font-bold flex items-center justify-center">
						{$selectionCount}
					</span>
					bets
				</div>
			{/if}
			<button
				onclick={() => toasts.show('Login — coming soon!', 'info')}
				class="hidden sm:block px-4 py-1.5 rounded-lg border text-[13px] font-medium transition-all duration-150"
				style="border-color:rgba(255,255,255,0.12); color:#8b909f;"
				onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.color='#e8eaf0'; }}
				onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.color='#8b909f'; }}
			>
				Log In
			</button>
			<button
				onclick={() => toasts.show('Registration — coming soon!', 'info')}
				class="px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-150"
				style="background:#f5c842; color:#0b0c0f;"
				onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.background='#ffd700'; }}
				onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.background='#f5c842'; }}
			>
				Join Now
			</button>
			<!-- Mobile menu -->
			<button
				class="xl:hidden p-1.5 rounded-lg"
				style="background:#1c1f29; color:#8b909f;"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			>
				{#if mobileMenuOpen}<X size={16} />{:else}<Menu size={16} />{/if}
			</button>
		</div>

	</div>
</header>

<!-- Mobile dropdown -->
{#if mobileMenuOpen}
	<div class="xl:hidden fixed top-[56px] left-0 right-0 z-40 px-4 py-3 flex flex-col gap-1 animate-slide-up"
		style="background:#0b1a2e; border-bottom:1px solid rgba(255,255,255,0.08);">
		{#each navItems as item}
			<button onclick={() => { handleNav(item); mobileMenuOpen = false; }}
				class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-left transition-colors"
				style="color:{item.active ? '#e8eaf0' : '#8b909f'}; background:{item.active ? '#1c1f29' : 'transparent'};"
			>
				<span>{item.icon}</span>{item.label}
			</button>
		{/each}
	</div>
{/if}
