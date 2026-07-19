<script lang="ts">
	import { selectionCount } from '$lib/stores/betslip';
	import { trackCTA }       from '$lib/utils/tracking';
	import { goto }           from '$app/navigation';
	import { page }           from '$app/state';
	import { Menu, X, Home, Plane, Search } from 'lucide-svelte';
	import { searchQuery } from '$lib/stores/search';

	interface Props { onJoin: () => void; }
	let { onJoin }: Props = $props();

	let mobileMenuOpen = $state(false);
	let mobileSearchOpen = $state(false);

	const navItems = [
		{ label: 'Home',    icon: Home,   href: '/'        },
		{ label: 'Aviator', icon: Plane,  href: '/aviator' },
	];

	const currentPath = $derived(page.url.pathname);

	function isActive(href: string | null): boolean {
		if (!href) return false;
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}

	function handleNav(item: typeof navItems[0]) {
		mobileMenuOpen = false;
		if (item.href) goto(item.href);
	}

	function handleJoin(source: string) {
		trackCTA('join_now', source);
		onJoin();
	}
</script>

<header class="fixed top-0 left-0 right-0 z-50 h-[56px] glass"
	style="border-bottom:1px solid rgba(255,255,255,0.06);">

	<!-- ── DESKTOP (xl+) ── -->
	<div class="hidden xl:flex items-center h-full w-full">

		<a href="/" class="shrink-0 flex items-center gap-2.5 px-5 h-full"
			style="width:240px; border-right:1px solid rgba(255,255,255,0.06);">
			<div class="relative w-5 h-5 flex items-center justify-center">
				<span class="absolute w-3.5 h-3.5 rounded-full animate-pulse-dot opacity-40"
					style="background:var(--color-gold);"></span>
				<span class="relative w-2 h-2 rounded-full" style="background:var(--color-gold);"></span>
			</div>
			<span class="font-display text-[22px] tracking-[4px] text-white leading-none">WAM</span>
		</a>

		<div class="flex-1 flex items-center gap-1 px-4 h-full overflow-x-auto" style="scrollbar-width:none;">
			{#each navItems as item}
			{@const active = isActive(item.href)}
			<button
				onclick={() => handleNav(item)}
				aria-label={item.label}
				aria-pressed={active}
				class="nav-tab flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
				class:active
			style="background:{active ? 'var(--color-green)' : 'transparent'}; color:{active ? '#fff' : 'var(--color-text-dim)'};"
		>
				<item.icon size={14} />
				{item.label}
				</button>
			{/each}
		</div>

		<div class="shrink-0 flex items-center justify-end gap-2 px-4 h-full"
			style="width:260px; border-left:1px solid rgba(255,255,255,0.06);">
			{#if $selectionCount > 0}
				<span class="flex items-center gap-1.5 text-[12px] font-semibold" style="color:var(--color-gold);">
					<span class="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center"
					style="background:var(--color-gold); color:var(--color-nav);">
					{$selectionCount}
				</span>
				bets
			</span>
		{/if}
	<button onclick={() => handleJoin('header_login')}
		aria-label="Log in to your account"
		class="min-h-[44px] px-4 py-2 rounded-lg border text-[13px] font-medium hover-text-light cursor-pointer"
		style="border-color:rgba(255,255,255,0.10); color:var(--color-text-dim);"
	>Log In</button>
	<button onclick={() => handleJoin('header_join')}
		aria-label="Join now and claim KSh 500 bonus"
		class="min-h-[44px] px-4 py-2 rounded-lg text-[13px] font-bold hover-lift cursor-pointer"
		style="background:var(--color-gold); color:var(--color-nav); box-shadow:0 2px 12px rgba(240,192,64,0.25);"
		>Join Now</button>
		</div>
	</div>

	<!-- ── MOBILE (<xl) ── -->
	<div class="xl:hidden flex items-center h-full w-full px-3 gap-2 min-w-0">
		<a href="/" class="flex items-center gap-1.5 shrink-0">
			<span class="relative w-2 h-2 rounded-full" style="background:var(--color-gold);"></span>
			<span class="font-display text-[19px] tracking-[3px] text-white leading-none">WAM</span>
		</a>
		<div class="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto" style="scrollbar-width:none;">
		{#each navItems as item}
			{@const active = isActive(item.href)}
			<button
				onclick={() => handleNav(item)}
				aria-label={item.label}
				aria-pressed={active}
				class="nav-tab flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
				class:active
			style="background:{active ? 'var(--color-green)' : 'rgba(255,255,255,0.05)'}; color:{active ? '#fff' : 'var(--color-text-dim)'};"
		>
					<item.icon size={12} />
					{item.label}
				</button>
			{/each}
		</div>
		<button class="shrink-0 min-w-[44px] min-h-[44px] p-2.5 rounded-lg cursor-pointer"
			aria-label={mobileSearchOpen ? 'Close search' : 'Search teams'}
			aria-expanded={mobileSearchOpen}
			style="background:{mobileSearchOpen ? 'rgba(240,192,64,0.12)' : 'rgba(255,255,255,0.06)'}; color:{mobileSearchOpen ? 'var(--color-gold)' : 'var(--color-text-dim)'};"
			onclick={() => { mobileSearchOpen = !mobileSearchOpen; if (mobileSearchOpen) mobileMenuOpen = false; }}
		>
			<Search size={16} />
		</button>
		{#if $selectionCount > 0}
			<span class="shrink-0 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center"
			style="background:var(--color-gold); color:var(--color-nav);">
			{$selectionCount}
		</span>
		{/if}
	<button class="shrink-0 min-w-[44px] min-h-[44px] p-2.5 rounded-lg cursor-pointer"
		aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
		aria-expanded={mobileMenuOpen}
		style="background:rgba(255,255,255,0.06); color:var(--color-text-dim);"
		onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
	>
			{#if mobileMenuOpen}<X size={16} />{:else}<Menu size={16} />{/if}
		</button>
	</div>
</header>

{#if mobileMenuOpen}
	<div class="xl:hidden fixed top-[56px] left-0 right-0 z-40 px-4 py-3 flex flex-col gap-2 animate-slide-up glass"
		style="border-bottom:1px solid rgba(255,255,255,0.06);">
	<button onclick={() => { handleJoin('mobile_login'); mobileMenuOpen=false; }}
		aria-label="Log in to your account"
		class="w-full min-h-[44px] py-2.5 rounded-lg border text-[14px] font-medium hover-text-light cursor-pointer"
		style="border-color:rgba(255,255,255,0.10); color:var(--color-text-dim);">Log In</button>
	<button onclick={() => { handleJoin('mobile_join'); mobileMenuOpen=false; }}
		aria-label="Join now and claim KSh 500 bonus"
		class="w-full min-h-[44px] py-2.5 rounded-lg text-[14px] font-bold cursor-pointer"
		style="background:var(--color-gold); color:var(--color-nav);">Join Now — Claim KSh 500</button>
	</div>
{/if}

{#if mobileSearchOpen}
	<div class="xl:hidden fixed top-[56px] left-0 right-0 z-40 px-4 py-3 animate-slide-up glass"
		style="border-bottom:1px solid rgba(255,255,255,0.06);">
		<div class="flex items-center gap-2 rounded-xl px-3 py-2.5"
			style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);">
			<Search size={14} style="color:var(--color-text-muted); flex-shrink:0;" />
			<input
				type="text"
				placeholder="Search teams..."
				aria-label="Search teams"
				bind:value={$searchQuery}
				class="flex-1 bg-transparent border-none outline-none text-[13px] placeholder:text-[var(--color-text-muted)] min-w-0"
				style="color:var(--color-text);"
			/>
			{#if $searchQuery}
				<button
					onclick={() => { $searchQuery = ''; mobileSearchOpen = false; }}
					class="p-1 rounded-md hover-bg-subtle cursor-pointer"
					aria-label="Clear search"
				>
					<X size={12} style="color:var(--color-text-muted);" />
				</button>
			{/if}
		</div>
	</div>
{/if}
