<script lang="ts">
	let active = $state(0);

	const banners = [
		{
			tag:     'Sports welcome bonus.',
			headline:'100% up to £50\non first deposit.',
			accent:  '#2ecc71',
			bg:      'linear-gradient(135deg, #0f2a1a 0%, #0b1a10 100%)',
			emoji:   '🏃',
		},
		{
			tag:     '10 Payout',
			headline:'Early Payout\non a 2-goal or\n20-point lead.',
			accent:  '#2ecc71',
			bg:      'linear-gradient(135deg, #0a200a 0%, #061206 100%)',
			emoji:   '⚡',
		},
		{
			tag:     'Sports welcome bonus.',
			headline:'100% up to £50\non first deposit.',
			accent:  '#2ecc71',
			bg:      'linear-gradient(135deg, #0f2a1a 0%, #0b1a10 100%)',
			emoji:   '🏆',
		},
	];
</script>

<div class="flex gap-2 mb-3">
	{#each banners as b, i}
		<button
			onclick={() => (active = i)}
			class="flex-1 rounded-xl px-4 py-3 text-left transition-all duration-200 relative overflow-hidden"
			style="background:{b.bg}; border:1px solid {i === active ? 'rgba(46,204,113,0.3)' : 'rgba(255,255,255,0.06)'};"
		>
			<div class="text-[10px] font-semibold mb-1" style="color:{b.accent};">{b.tag}</div>
			<div class="text-[12px] font-bold text-white leading-tight whitespace-pre-line">{b.headline}</div>
			<div class="absolute right-3 bottom-2 text-[28px] opacity-30">{b.emoji}</div>
		</button>
	{/each}
</div>
