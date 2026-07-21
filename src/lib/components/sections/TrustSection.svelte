<script lang="ts">
	import { Star, Clock, Users, TrendingUp, Shield } from 'lucide-svelte';

	const testimonials = [
		{
			name: 'James M.',
			city: 'Nairobi',
			text: 'Withdrew KSh 12,500 in under 4 minutes via M-PESA. No questions asked.',
			stars: 5
		},
		{
			name: 'Peter K.',
			city: 'Mombasa',
			text: 'Best odds for LaLiga in Kenya. Won big on the El Clásico last month!',
			stars: 5
		},
		{
			name: 'Faith W.',
			city: 'Kisumu',
			text: 'The live odds update so fast. I can always get value before the market moves.',
			stars: 5
		}
	];
</script>

<div class="mt-6 mb-4" id="trust">
	<!-- Hero stat: withdrawal speed (asymmetric, dominant) -->
	<div
		class="flex items-center gap-4 px-5 py-4 rounded-xl mb-3"
		style="background:var(--color-card); border:1px solid var(--color-border);"
	>
		<div
			class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
			style="background:rgba(34,197,94,0.10);"
		>
			<Clock size={18} style="color:var(--color-green);" />
		</div>
		<div class="flex-1 min-w-0">
			<div class="flex items-baseline gap-2">
				<span
					class="font-display text-[32px] tracking-[0.5px] leading-none"
					style="color:var(--color-gold);">4 min</span
				>
				<span class="text-[11px] font-semibold" style="color:var(--color-text-muted);"
					>avg. withdrawal</span
				>
			</div>
			<div class="text-[11px] mt-1" style="color:var(--color-text-muted);">
				Paid directly to M-PESA. Most payouts complete before the final whistle.
			</div>
		</div>
	</div>

	<!-- Secondary stats (compact strip) -->
	<div class="flex gap-2 mb-5">
		<div
			class="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
			style="background:var(--color-card); border:1px solid var(--color-border);"
		>
			<Users size={14} style="color:var(--color-gold); shrink-0;" />
			<div>
				<div class="text-[13px] font-bold" style="color:var(--color-text);">50K+</div>
				<div class="text-[9px]" style="color:var(--color-text-muted);">bettors</div>
			</div>
		</div>
		<div
			class="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
			style="background:var(--color-card); border:1px solid var(--color-border);"
		>
			<TrendingUp size={14} style="color:var(--color-green); shrink-0;" />
			<div>
				<div class="text-[13px] font-bold" style="color:var(--color-text);">KSh 2M+</div>
				<div class="text-[9px]" style="color:var(--color-text-muted);">paid daily</div>
			</div>
		</div>
		<div
			class="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
			style="background:var(--color-card); border:1px solid var(--color-border);"
		>
			<Shield size={14} style="color:var(--color-blue); shrink-0;" />
			<div>
				<div class="text-[13px] font-bold" style="color:var(--color-text);">99.8%</div>
				<div class="text-[9px]" style="color:var(--color-text-muted);">uptime</div>
			</div>
		</div>
	</div>

	<!-- Testimonials -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
		{#each testimonials as t}
			<div
				class="px-4 py-3.5 rounded-xl relative overflow-hidden"
				style="background:var(--color-card); border:1px solid var(--color-border);"
			>
				<div
					class="absolute top-2 right-3 font-display text-[60px] leading-none pointer-events-none select-none"
					style="color:rgba(240,192,64,0.04);"
				>
					"
				</div>
				<div class="flex items-center gap-0.5 mb-2">
					{#each Array(t.stars) as _}
						<Star size={11} style="color:var(--color-gold); fill:var(--color-gold);" />
					{/each}
				</div>
				<p class="text-[12px] leading-relaxed mb-3" style="color:var(--color-text-dim);">
					"{t.text}"
				</p>
				<div class="text-[11px] font-semibold" style="color:var(--color-text);">
					{t.name} <span style="color:var(--color-text-muted);">· {t.city}</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Trust badges row -->
	<div
		class="flex flex-wrap items-center justify-center gap-3 px-4 py-3 rounded-xl"
		style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05);"
	>
		<span
			class="text-[11px] font-semibold uppercase tracking-[0.8px]"
			style="color:var(--color-text-muted);">Trusted & Regulated</span
		>
		<div class="w-px h-4" style="background:rgba(255,255,255,0.06);"></div>
		{#each [{ label: 'BCLB Kenya', color: '#60a5fa' }, { label: 'M-PESA Partner', color: '#22c55e' }, { label: '18+ Responsible', color: '#f87171' }, { label: 'SSL Secured', color: '#a78bfa' }] as b}
			<span
				class="text-[10px] font-bold uppercase tracking-[0.8px] px-2.5 py-1 rounded-full"
				style="background:{b.color}10; color:{b.color}; border:1px solid {b.color}22;"
			>
				{b.label}
			</span>
		{/each}
	</div>
</div>
