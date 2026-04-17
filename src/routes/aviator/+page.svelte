<script lang="ts">
	import LeftSidebar from '$lib/components/layout/LeftSidebar.svelte';

	// ── Replace with the Aviator URL Solami gave you ──
	const AVIATOR_URL = 'https://YOUR_AVIATOR_URL_HERE';
</script>

<svelte:head>
	<title>Aviator — Solami</title>
</svelte:head>

<!--
	Layout: LeftSidebar (240px fixed) | iframe (flex-1, full height)
	Header is already rendered by root +layout.svelte and stays fixed at top.
	No betslip panel on this page — game takes the full remaining width.
-->
<div class="flex" style="height: calc(100vh - 56px);">

	<!-- Left sidebar — same as sports page -->
	<div class="hidden xl:flex flex-col shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)] overflow-hidden"
		style="width:240px; background:#0d0f14; border-right:1px solid rgba(255,255,255,0.07);">
		<LeftSidebar />
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

</div>
