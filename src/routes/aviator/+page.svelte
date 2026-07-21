<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import { authModalOpen } from '$lib/stores/auth';
	import { Plane, Zap, Clock, ArrowRight } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Aviator — WAM</title>
	<meta
		name="description"
		content="Play Aviator on WAM. Crash game with instant payouts. Cash out before the plane flies away."
	/>
	<meta property="og:title" content="Aviator — WAM" />
	<meta property="og:description" content="Play Aviator on WAM. Crash game with instant payouts." />
	<meta property="og:url" content="https://wam.co.ke/aviator" />
	<meta name="twitter:title" content="Aviator — WAM" />
	<meta
		name="twitter:description"
		content="Play Aviator on WAM. Crash game with instant payouts."
	/>
</svelte:head>

<main class="flex" style="height: calc(100vh - 56px);" id="main-content">
	<!-- Left sidebar — same as sports page -->
	<div
		class="hidden xl:flex flex-col shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)] overflow-hidden"
		style="width:240px; background:var(--color-nav); border-right:1px solid rgba(255,255,255,0.07);"
	>
		<Sidebar />
	</div>

	<!-- Coming Soon content -->
	<div class="flex-1 flex items-center justify-center px-6">
		<div class="text-center max-w-[420px]">
			<!-- Animated icon -->
			<div class="relative w-20 h-20 mx-auto mb-6">
				<div
					class="absolute inset-0 rounded-2xl animate-pulse"
					style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.15);"
				></div>
				<div class="absolute inset-0 flex items-center justify-center">
					<Plane size={32} style="color:#ef4444; transform:rotate(-15deg);" />
				</div>
			</div>

			<h1
				class="font-display text-[36px] tracking-[2px] leading-none mb-3"
				style="color:var(--color-text);"
			>
				AVIATOR
			</h1>

			<div
				class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[1.5px] px-3 py-1.5 rounded-full mb-5"
				style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.15); color:#ef4444;"
			>
				<Clock size={12} />
				Coming Soon
			</div>

			<p class="text-[14px] leading-relaxed mb-8" style="color:var(--color-text-dim);">
				The Aviator crash game is launching soon on WAM.<br />
				Cash out before the plane flies away for instant payouts.
			</p>

			<!-- Feature preview -->
			<div class="grid grid-cols-2 gap-3 mb-8">
				<div
					class="rounded-xl px-4 py-3 text-left"
					style="background:var(--color-card); border:1px solid var(--color-border);"
				>
					<Zap size={16} style="color:var(--color-green); margin-bottom:6px;" />
					<div class="text-[12px] font-semibold" style="color:var(--color-text);">
						Instant Payouts
					</div>
					<div class="text-[10px]" style="color:var(--color-text-muted);">
						Winners paid via M-PESA
					</div>
				</div>
				<div
					class="rounded-xl px-4 py-3 text-left"
					style="background:var(--color-card); border:1px solid var(--color-border);"
				>
					<Plane size={16} style="color:#ef4444; margin-bottom:6px;" />
					<div class="text-[12px] font-semibold" style="color:var(--color-text);">
						Crash Multiplier
					</div>
					<div class="text-[10px]" style="color:var(--color-text-muted);">
						Up to 100x your stake
					</div>
				</div>
			</div>

			<button
				onclick={() => authModalOpen.set(true)}
				class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] hover-lift cursor-pointer"
				style="background:var(--color-gold); color:var(--color-nav); box-shadow:0 4px 24px rgba(240,192,64,0.28);"
			>
				Join Waitlist
				<ArrowRight size={16} />
			</button>

			<p class="text-[11px] mt-4" style="color:var(--color-text-muted);">
				Be first to play when we launch
			</p>
		</div>
	</div>
</main>
