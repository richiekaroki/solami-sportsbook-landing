<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Toast  from '$lib/components/ui/Toast.svelte';
	let { children } = $props();
</script>

<Header />

<!-- 3-column shell below the fixed header -->
<div class="flex" style="padding-top:56px; min-height:100vh;">
	{@render children()}
</div>

<Toast />
