<script lang="ts">
	const items = [
		{ cat: 'Live jam', t: 'Skatepark Saturday', i: '🎸' },
		{ cat: 'Playlist', t: 'Noche cian', i: '💿' },
		{ cat: 'Crew', t: 'Norte beats', i: '🎧' },
		{ cat: 'Drop', t: 'Lo-fi after hours', i: '🌙' }
	];
</script>

<section id="drops" class="wrap py-24 md:py-32">
	<p class="text-xs uppercase tracking-[0.3em] text-pink">drops</p>
	<h2 class="font-display mt-3 text-5xl font-extrabold text-white md:text-7xl">Lo que está sonando.</h2>
	<div class="mt-14 grid gap-8 md:grid-cols-2">
		{#each items as item (item.t)}
			<article class="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-cyan/40">
				<div class="flex h-56 items-center justify-center bg-linear-to-br from-neon/30 via-pink/20 to-cyan/20 text-7xl transition duration-300 group-hover:scale-105">
					{item.i}
				</div>
				<div class="p-6">
					<p class="text-xs uppercase tracking-widest text-cyan">{item.cat}</p>
					<h3 class="font-display mt-2 text-3xl font-bold text-white">{item.t}</h3>
				</div>
			</article>
		{/each}
	</div>
</section>
