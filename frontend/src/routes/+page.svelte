<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import Features from '$lib/components/Features.svelte';
	import Manifesto from '$lib/components/Manifesto.svelte';
	import Community from '$lib/components/Community.svelte';
	import Cta from '$lib/components/Cta.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Bg3d from '$lib/components/Bg3d.svelte';
</script>

<svelte:head>
	<title>PULSO · tu crew, tu ritmo</title>
</svelte:head>

<Bg3d />
<Nav />
<main>
	<Hero />
	<Stats />
	<Features />
	<Manifesto />
	<Community />
	<Cta />
</main>
<Footer />
