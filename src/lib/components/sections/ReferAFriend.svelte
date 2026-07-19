<script lang="ts">
	import { UserPlus, Gift, Copy, Share2 } from 'lucide-svelte';
	import { toasts } from '$lib/stores/toast';

	const referralCode = 'WAM500';
	const bonusAmount = 'KSh 250';

	function copyCode() {
		navigator.clipboard.writeText(referralCode).then(() => {
			toasts.show('Referral code copied!', 'success');
		});
	}
</script>

<div class="rounded-xl px-4 py-3.5 mb-4 overflow-hidden relative"
	style="background:linear-gradient(135deg, rgba(240,192,64,0.06) 0%, rgba(34,197,94,0.04) 100%); border:1px solid rgba(240,192,64,0.15);">

	<div class="pointer-events-none absolute inset-0">
		<div class="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-2xl"
			style="background:radial-gradient(circle, rgba(240,192,64,0.08) 0%, transparent 70%);"></div>
	</div>

	<div class="relative flex items-start gap-3">
		<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
			style="background:rgba(240,192,64,0.10); border:1px solid rgba(240,192,64,0.18);">
			<UserPlus size={18} style="color:var(--color-gold);" />
		</div>

		<div class="flex-1 min-w-0">
			<div class="text-[13px] font-bold mb-0.5" style="color:var(--color-text);">Refer a Friend</div>
			<div class="text-[11px] mb-2" style="color:var(--color-text-dim);">
				Both get <strong style="color:var(--color-gold);">{bonusAmount}</strong> free bet
			</div>

			<div class="flex items-center gap-2">
				<div class="flex-1 flex items-center gap-2 rounded-lg px-3 py-2"
					style="background:rgba(255,255,255,0.04); border:1px solid var(--color-border);">
					<span class="font-mono text-[13px] font-bold tracking-[2px]" style="color:var(--color-text);">
						{referralCode}
					</span>
				</div>
		<button
			onclick={copyCode}
			aria-label="Copy referral code"
			class="shrink-0 min-w-[44px] min-h-[44px] p-2.5 rounded-lg transition-all hover:bg-white/[0.06] cursor-pointer"
			style="background:rgba(240,192,64,0.10); color:var(--color-gold);"
		>
					<Copy size={14} />
				</button>
			</div>
		</div>
	</div>
</div>
