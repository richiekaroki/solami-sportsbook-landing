<script lang="ts">
	const testimonials = [
		{ name: 'James M.',     city: 'Nairobi',  text: 'Withdrew KSh 12,500 in under 4 minutes via M-PESA. No questions asked.',   stars: 5 },
		{ name: 'Peter K.',     city: 'Mombasa',  text: 'Best odds for LaLiga in Kenya. Won big on the El Clásico last month!',       stars: 5 },
		{ name: 'Faith W.',     city: 'Kisumu',   text: 'The live odds update so fast. I can always get value before the market moves.', stars: 5 },
	];

	const stats = [
		{ value: '50K+',    label: 'Active bettors' },
		{ value: 'KSh 2M+', label: 'Paid out daily' },
		{ value: '4 min',   label: 'Avg. withdrawal' },
		{ value: '99.8%',   label: 'Uptime SLA' },
	];
</script>

<div class="mt-6 mb-4" id="trust">
	<!-- Stats row -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
		{#each stats as s}
			<div class="text-center px-3 py-4 rounded-xl"
				style="background:#13161f; border:1px solid rgba(255,255,255,0.06);">
				<div class="font-display text-[24px] tracking-[1px] mb-0.5" style="color:#f5c842;">{s.value}</div>
				<div class="text-[10px] font-semibold uppercase tracking-[0.8px]" style="color:#4d5568;">{s.label}</div>
			</div>
		{/each}
	</div>

	<!-- Testimonials -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
		{#each testimonials as t}
			<div class="px-4 py-3.5 rounded-xl relative overflow-hidden"
				style="background:#13161f; border:1px solid rgba(255,255,255,0.06);">
				<!-- Quote mark watermark -->
				<div class="absolute top-2 right-3 font-display text-[60px] leading-none pointer-events-none select-none"
					style="color:rgba(245,200,66,0.05);">"</div>
				<div class="flex items-center gap-0.5 mb-2">
					{#each Array(t.stars) as _}
						<span class="text-[11px]" style="color:#f5c842;">★</span>
					{/each}
				</div>
				<p class="text-[12px] leading-relaxed mb-3" style="color:#8892a4;">"{t.text}"</p>
				<div class="text-[11px] font-semibold" style="color:#e4e8f0;">
					{t.name} <span style="color:#4d5568;">· {t.city}</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Trust badges row -->
	<div class="flex flex-wrap items-center justify-center gap-3 px-4 py-3 rounded-xl"
		style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05);">
		<span class="text-[11px] font-semibold uppercase tracking-[0.8px]" style="color:#4d5568;">Trusted & Regulated</span>
		<div class="w-px h-4" style="background:rgba(255,255,255,0.08);"></div>
		{#each [
			{ label:'BCLB Kenya',      color:'#60a5fa' },
			{ label:'M-PESA Partner',  color:'#4CAF50' },
			{ label:'18+ Responsible', color:'#f87171' },
			{ label:'SSL Secured',     color:'#a78bfa' },
		] as b}
			<span class="text-[10px] font-bold uppercase tracking-[0.8px] px-2.5 py-1 rounded-full"
				style="background:rgba(255,255,255,0.04); color:{b.color}; border:1px solid {b.color}33;">
				{b.label}
			</span>
		{/each}
	</div>
</div>
