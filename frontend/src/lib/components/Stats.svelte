<script lang="ts">
	const stats = [
		{ n: '500+', l: 'usuarios en la crew' },
		{ n: '50', l: 'playlists vivas' },
		{ n: '12k', l: 'drops esta semana' }
	];
</script>

<section class="wrap grid gap-12 border-y border-white/10 py-20 md:grid-cols-3 md:py-28">
	{#each stats as s (s.l)}
		<div>
			<p class="font-display text-7xl font-extrabold text-white md:text-8xl">{s.n}</p>
			<p class="mt-2 text-sm uppercase tracking-widest text-zinc-500">{s.l}</p>
		</div>
	{/each}
</section>
