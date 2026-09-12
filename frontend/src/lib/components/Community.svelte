<script lang="ts">
	const names = ['Norte Beats', 'Lo-Fi Club', 'Skate Jam', 'Cian Radio', 'Pulse Kids', 'After Hours', 'Vibe Lab', 'Drop Norte'];
</script>

<section id="crew" class="overflow-hidden py-20">
	<p class="wrap text-xs uppercase tracking-[0.3em] text-zinc-500">comunidad</p>
	<div class="mt-8 flex gap-12 overflow-hidden border-y border-white/10 py-8">
		<div class="marquee flex min-w-max gap-12 px-8 text-xl font-semibold uppercase tracking-widest text-zinc-500 md:text-2xl">
			{#each [...names, ...names] as n, i (`${n}-${i}`)}
				<span class="transition hover:text-cyan">{n}</span>
			{/each}
		</div>
	</div>
</section>
