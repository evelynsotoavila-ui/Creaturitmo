<script lang="ts">
	let open = $state(false);
	const links = [
		{ href: '#drops', label: 'Drops' },
		{ href: '#crew', label: 'Crew' },
		{ href: '#vibes', label: 'Vibes' }
	];
</script>

<header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
	<nav class="wrap flex items-center justify-between py-4">
		<a href="#top" class="font-display text-2xl font-extrabold text-white">PUL<span class="grad">SO</span></a>
		<div class="hidden items-center gap-8 md:flex">
			{#each links as l (l.href)}
				<a href={l.href} class="link text-sm">{l.label}</a>
			{/each}
			<a href="/login" class="btn">Entrar</a>
		</div>
		<button class="rounded-full border border-white/15 p-2 md:hidden" aria-label="Menú" onclick={() => (open = !open)}>
			<span class="block h-0.5 w-5 bg-white"></span>
			<span class="mt-1 block h-0.5 w-5 bg-white"></span>
		</button>
	</nav>
	{#if open}
		<div class="space-y-3 border-t border-white/10 px-5 py-4 md:hidden">
			{#each links as l (l.href)}
				<a href={l.href} class="link block" onclick={() => (open = false)}>{l.label}</a>
			{/each}
			<a href="/login" class="btn w-full">Entrar</a>
		</div>
	{/if}
</header>
