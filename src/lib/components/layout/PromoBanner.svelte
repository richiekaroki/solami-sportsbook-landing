<script lang="ts">
	import { authModalOpen } from '$lib/stores/auth';
	import { Gift, Zap } from 'lucide-svelte';
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
	<!-- Welcome Bonus -->
	<button
		onclick={() => authModalOpen.set(true)}
		aria-label="Welcome bonus: 100% up to KSh 5,000"
		class="relative rounded-xl px-5 py-4 text-left overflow-hidden transition-all duration-200 hover:border-[rgba(34,197,94,0.35)]"
		style="
			background:linear-gradient(160deg, #0a1f12 0%, #071510 100%);
			border:1px solid rgba(34,197,94,0.2);
		"
	>
		<div class="flex items-start gap-3">
			<div
				class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
				style="background:rgba(34,197,94,0.12);"
			>
				<Gift size={18} style="color:#22c55e;" />
			</div>
			<div class="flex-1 min-w-0">
				<div class="text-[10px] font-bold uppercase tracking-[1px] mb-1" style="color:#22c55e;">
					Welcome Bonus
				</div>
				<div class="text-[16px] font-bold text-white leading-tight mb-0.5">
					100% up to KSh 5,000
				</div>
				<div class="text-[11px]" style="color:rgba(255,255,255,0.45);">
					On your first deposit via M-PESA
				</div>
			</div>
		</div>

		<!-- Active indicator -->
		<div
			class="absolute bottom-0 left-0 right-0 h-[2px]"
			style="background:linear-gradient(90deg, transparent, #22c55e, transparent);"
		></div>
	</button>

	<!-- Weekly Free Bet -->
	<button
		onclick={() => authModalOpen.set(true)}
		aria-label="Weekly free bet: Bet KSh 500, Get KSh 500"
		class="relative rounded-xl px-5 py-4 text-left overflow-hidden transition-all duration-200 hover:border-[rgba(240,192,64,0.35)]"
		style="
			background:linear-gradient(155deg, #1a1408 0%, #120e05 100%);
			border:1px solid rgba(240,192,64,0.2);
		"
	>
		<div class="flex items-start gap-3">
			<div
				class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
				style="background:rgba(240,192,64,0.12);"
			>
				<Zap size={18} style="color:#f0c040;" />
			</div>
			<div class="flex-1 min-w-0">
				<div class="text-[10px] font-bold uppercase tracking-[1px] mb-1" style="color:#f0c040;">
					Weekly Free Bet
				</div>
				<div class="text-[16px] font-bold text-white leading-tight mb-0.5">
					Bet KSh 500, Get KSh 500
				</div>
				<div class="text-[11px]" style="color:rgba(255,255,255,0.45);">
					Every Friday for loyal members
				</div>
			</div>
		</div>

		<!-- Active indicator -->
		<div
			class="absolute bottom-0 left-0 right-0 h-[2px]"
			style="background:linear-gradient(90deg, transparent, #f0c040, transparent);"
		></div>
	</button>
</div>
