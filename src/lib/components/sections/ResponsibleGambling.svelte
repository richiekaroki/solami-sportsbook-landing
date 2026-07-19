<script lang="ts">
	import { Shield, Phone } from 'lucide-svelte';
</script>

<div class="rounded-xl px-4 py-3.5 mb-4"
	style="background:rgba(239,68,68,0.03); border:1px solid rgba(239,68,68,0.10);">

	<div class="flex items-center gap-2 mb-2.5">
		<Shield size={14} style="color:var(--color-red);" />
		<span class="text-[11px] font-bold uppercase tracking-[0.8px]" style="color:var(--color-red);">
			Responsible Gambling
		</span>
	</div>

	<p class="text-[11px] leading-relaxed mb-2.5" style="color:var(--color-text-muted);">
		Gambling should be fun, not a problem. Set limits, play within your budget, and never chase losses.
	</p>

	<div class="flex items-center gap-2"
		style="border-top:1px solid rgba(239,68,68,0.08); padding-top:8px;">
		<Phone size={10} style="color:var(--color-text-muted); flex-shrink:0;" />
		<span class="text-[9px]" style="color:var(--color-text-muted);">
			Need help? Call <strong style="color:var(--color-text-dim);">0800 723 456</strong> (toll-free)
		</span>
	</div>
</div>
