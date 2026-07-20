<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	// ── Replace with the Aviator URL WAM gave you ──
	const AVIATOR_URL = 'https://YOUR_AVIATOR_URL_HERE';
</script>

<svelte:head>
	<title>Aviator — WAM</title>
</svelte:head>

<!--
	Layout: Sidebar (240px fixed) | iframe (flex-1, full height)
	Header is already rendered by root +layout.svelte and stays fixed at top.
	No betslip panel on this page — game takes the full remaining width.
-->
<main class="flex" style="height: calc(100vh - 56px);" id="main-content">
	<!-- Left sidebar — same as sports page -->
	<div
		class="hidden xl:flex flex-col shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)] overflow-hidden"
		style="width:240px; background:var(--color-nav); border-right:1px solid rgba(255,255,255,0.07);"
	>
		<Sidebar />
	</div>

	<!-- Aviator iframe — fills all remaining space -->
	<iframe
		src={AVIATOR_URL}
		title="Aviator"
		class="flex-1 border-0"
		style="height:100%;"
		allow="fullscreen; autoplay; encrypted-media"
		allowfullscreen
	></iframe>
</main>
