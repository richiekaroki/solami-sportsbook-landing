<script lang="ts">
	import '../app.css';
	import Header    from '$lib/components/layout/Header.svelte';
	import AuthModal from '$lib/components/ui/AuthModal.svelte';
	import Toast     from '$lib/components/ui/Toast.svelte';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });
	injectSpeedInsights();

	let { children } = $props();
	let authOpen = $state(false);
</script>

<Header onJoin={() => (authOpen = true)} />

<a href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[300] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-[14px]"
	style="background:var(--color-gold); color:var(--color-nav);">
	Skip to content
</a>

<div style="padding-top:56px; min-height:100vh;">
	{@render children()}
</div>

<AuthModal bind:open={authOpen} onClose={() => (authOpen = false)} />
<Toast />
