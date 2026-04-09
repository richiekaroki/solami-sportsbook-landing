<script lang="ts">
	let active = $state(0);

	const banners = [
		{
			tag:      'SPORTS WELCOME BONUS',
			headline: '100% up to\nKSh 5,000',
			sub:      'on your first deposit',
			accent:   '#22c55e',
			bg:       'linear-gradient(135deg, #0a1f12 0%, #071510 100%)',
			border:   'rgba(34,197,94,0.2)',
			emoji:    '🏃',
			badge:    'NEW',
		},
		{
			tag:      'EARLY PAYOUT OFFER',
			headline: 'Cash out early\non a 2-goal lead',
			sub:      '20+ point lead in basketball',
			accent:   '#60a5fa',
			bg:       'linear-gradient(135deg, #0a1225 0%, #06091a 100%)',
			border:   'rgba(96,165,250,0.2)',
			emoji:    '⚡',
			badge:    'HOT',
		},
		{
			tag:      'WEEKLY FREE BET',
			headline: 'Bet KSh 500\nGet KSh 500',
			sub:      'Every Friday for loyal members',
			accent:   '#f5c842',
			bg:       'linear-gradient(135deg, #1a1408 0%, #120e05 100%)',
			border:   'rgba(245,200,66,0.2)',
			emoji:    '🎯',
			badge:    'WEEKLY',
		},
	];
</script>

<div class="grid grid-cols-3 gap-2.5 mb-4">
	{#each banners as b, i}
		<button
			onclick={() => (active = i)}
			class="relative rounded-xl px-4 py-3.5 text-left overflow-hidden transition-all duration-200"
			style="
				background:{b.bg};
				border:1px solid {i === active ? b.border : 'rgba(255,255,255,0.05)'};
				transform:{i === active ? 'translateY(-1px)' : 'none'};
				box-shadow:{i === active ? `0 8px 24px rgba(0,0,0,0.3)` : 'none'};
			"
		>
			<!-- Badge -->
			<span class="inline-block text-[9px] font-bold tracking-[1px] px-1.5 py-0.5 rounded mb-2"
				style="background:rgba(255,255,255,0.08); color:{b.accent};">
				{b.badge}
			</span>

			<div class="text-[10px] font-semibold mb-1 uppercase tracking-[0.8px]" style="color:{b.accent};">
				{b.tag}
			</div>
			<div class="text-[14px] font-bold text-white leading-tight whitespace-pre-line mb-1">
				{b.headline}
			</div>
			<div class="text-[10px]" style="color:rgba(255,255,255,0.4);">{b.sub}</div>

			<!-- Large emoji watermark -->
			<div class="absolute -bottom-2 -right-1 text-[48px] opacity-[0.12] pointer-events-none select-none leading-none">
				{b.emoji}
			</div>

			<!-- Active indicator bar -->
			{#if i === active}
				<div class="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl"
					style="background:linear-gradient(90deg, transparent, {b.accent}, transparent);"></div>
			{/if}
		</button>
	{/each}
</div>
