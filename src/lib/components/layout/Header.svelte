<script lang="ts">
	import { toasts }         from '$lib/stores/toast';
	import { selectionCount } from '$lib/stores/betslip';
	import { trackCTA }       from '$lib/utils/tracking';
	import { goto }           from '$app/navigation';
	import { page }           from '$app/state';
	import { Menu, X }        from 'lucide-svelte';

	interface Props { onJoin: () => void; }
	let { onJoin }: Props = $props();

	let mobileMenuOpen = $state(false);

	const navItems = [
		{ label: 'Home',    icon: '🏠', href: '/'        },
		{ label: 'Live',    icon: '📡', href: null        },
		{ label: 'Aviator', icon: '✈️', href: '/aviator' },
		{ label: 'Crash',   icon: '💥', href: null        },
		{ label: 'League',  icon: '🏆', href: null        },
	];

	// Highlight active tab based on current route
	const currentPath = $derived(page.url.pathname);

	function isActive(href: string | null): boolean {
		if (!href) return false;
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}

	function handleNav(item: typeof navItems[0]) {
		mobileMenuOpen = false;
		if (item.href) {
			goto(item.href);
		} else {
			toasts.show(`${item.label} — coming soon!`, 'info');
		}
	}

	function handleJoin(source: string) {
		trackCTA('join_now', source);
		onJoin();
	}
</script>

<header class="fixed top-0 left-0 right-0 z-50 h-[56px]"
	style="background:#0b1628; border-bottom:1px solid rgba(255,255,255,0.08);">

	<!-- ── DESKTOP (xl+) ── -->
	<div class="hidden xl:flex items-center h-full w-full">

		<!-- Logo — aligns with left sidebar width -->
		<a href="/" class="shrink-0 flex items-center gap-2.5 px-5 h-full"
			style="width:240px; border-right:1px solid rgba(255,255,255,0.08);">
			<div class="relative w-5 h-5 flex items-center justify-center">
				<span class="absolute w-3.5 h-3.5 rounded-full bg-[#f5c842] animate-pulse-dot opacity-50"></span>
				<span class="relative w-2 h-2 rounded-full bg-[#f5c842]"></span>
			</div>
			<span class="font-display text-[22px] tracking-[3px] text-white leading-none">SOLAMI</span>
		</a>

		<!-- Nav tabs -->
		<div class="flex-1 flex items-center gap-1 px-4 h-full overflow-x-auto" style="scrollbar-width:none;">
			{#each navItems as item}
				{@const active = isActive(item.href)}
				<button
					onclick={() => handleNav(item)}
					class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all duration-150"
					style="background:{active ? '#22c55e' : 'transparent'}; color:{active ? '#fff' : '#8892a4'};"
					onmouseenter={(e) => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,0.06)'; el.style.color='#e4e8f0'; }}}
					onmouseleave={(e) => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.background='transparent'; el.style.color='#8892a4'; }}}
				>
					<span class="text-sm">{item.icon}</span>
					{item.label}
					{#if item.label === 'Live'}
						<span class="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse-dot"></span>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Actions — aligns with betslip panel width -->
		<div class="shrink-0 flex items-center justify-end gap-2 px-4 h-full"
			style="width:260px; border-left:1px solid rgba(255,255,255,0.08);">
			{#if $selectionCount > 0}
				<span class="flex items-center gap-1.5 text-[12px] font-semibold" style="color:#f5c842;">
					<span class="w-5 h-5 rounded-full bg-[#f5c842] text-[#0b1628] text-[11px] font-bold flex items-center justify-center">
						{$selectionCount}
					</span>
					bets
				</span>
			{/if}
			<button onclick={() => handleJoin('header_login')}
				class="px-4 py-1.5 rounded-lg border text-[13px] font-medium transition-colors duration-150"
				style="border-color:rgba(255,255,255,0.12); color:#8892a4;"
				onmouseenter={(e) => (e.currentTarget as HTMLElement).style.color='#e4e8f0'}
				onmouseleave={(e) => (e.currentTarget as HTMLElement).style.color='#8892a4'}
			>Log In</button>
			<button onclick={() => handleJoin('header_join')}
				class="px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-150"
				style="background:#f5c842; color:#0b1628; box-shadow:0 2px 12px rgba(245,200,66,0.3);"
				onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='#ffd700'; el.style.transform='translateY(-1px)'; }}
				onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='#f5c842'; el.style.transform=''; }}
			>Join Now</button>
		</div>
	</div>

	<!-- ── MOBILE (<xl) ── -->
	<div class="xl:hidden flex items-center h-full w-full px-3 gap-2 min-w-0">
		<a href="/" class="flex items-center gap-1.5 shrink-0">
			<span class="relative w-2 h-2 rounded-full bg-[#f5c842]"></span>
			<span class="font-display text-[19px] tracking-[2px] text-white leading-none">SOLAMI</span>
		</a>
		<div class="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto" style="scrollbar-width:none;">
			{#each navItems as item}
				{@const active = isActive(item.href)}
				<button
					onclick={() => handleNav(item)}
					class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap shrink-0 transition-all duration-150"
					style="background:{active ? '#22c55e' : 'rgba(255,255,255,0.06)'}; color:{active ? '#fff' : '#8892a4'};"
				>
					<span class="text-[11px]">{item.icon}</span>
					{item.label}
				</button>
			{/each}
		</div>
		{#if $selectionCount > 0}
			<span class="shrink-0 w-5 h-5 rounded-full bg-[#f5c842] text-[#0b1628] text-[11px] font-bold flex items-center justify-center">
				{$selectionCount}
			</span>
		{/if}
		<button class="shrink-0 p-1.5 rounded-lg"
			style="background:rgba(255,255,255,0.08); color:#8892a4;"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			{#if mobileMenuOpen}<X size={16} />{:else}<Menu size={16} />{/if}
		</button>
	</div>
</header>

<!-- Mobile dropdown -->
{#if mobileMenuOpen}
	<div class="xl:hidden fixed top-[56px] left-0 right-0 z-40 px-4 py-3 flex flex-col gap-2 animate-slide-up"
		style="background:#0b1628; border-bottom:1px solid rgba(255,255,255,0.08);">
		<button onclick={() => { handleJoin('mobile_login'); mobileMenuOpen=false; }}
			class="w-full py-2.5 rounded-lg border text-[14px] font-medium"
			style="border-color:rgba(255,255,255,0.12); color:#8892a4;">Log In</button>
		<button onclick={() => { handleJoin('mobile_join'); mobileMenuOpen=false; }}
			class="w-full py-2.5 rounded-lg text-[14px] font-bold"
			style="background:#f5c842; color:#0b1628;">Join Now — Claim KSh 500</button>
	</div>
{/if}
