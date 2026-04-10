<script lang="ts">
	import '../app.css';
	import Header    from '$lib/components/layout/Header.svelte';
	import AuthModal from '$lib/components/ui/AuthModal.svelte';
	import Toast     from '$lib/components/ui/Toast.svelte';

	let { children } = $props();
	let authOpen = $state(false);
</script>

<Header onJoin={() => (authOpen = true)} />

<div style="padding-top:56px; min-height:100vh;">
	{@render children()}
</div>

<AuthModal bind:open={authOpen} onClose={() => (authOpen = false)} />
<Toast />
