<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Features from "$lib/components/Features.svelte";
	import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
	<title>PULSO · tu crew, tu ritmo</title>
	<meta name="description" content="Plataforma juvenil para conectar, crear y montar planes reales." />
</svelte:head>

<div class="min-h-screen bg-ink">
	<Navbar />
	<main>
		<Hero />
		<Features />
	</main>
	<Footer />
</div>
