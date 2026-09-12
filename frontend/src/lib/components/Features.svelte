<script lang="ts">
	const features = [
		{
			icon: "⚡",
			title: "Planes al toque",
			text: "Encuentra jams, partidos, estudios y salidas cerca de ti en minutos."
		},
		{
			icon: "🎧",
			title: "Crews con vibe",
			text: "Únete a grupos por música, arte, deporte o lo que te esté pegando ahora."
		},
		{
			icon: "🪩",
			title: "Crea y comparte",
			text: "Sube clips, drops y collabs. Acá se celebra lo que haces, no el like."
		},
		{
			icon: "🛡️",
			title: "Espacio seguro",
			text: "Moderación real y reportes rápidos. Tu paz mental también es parte del feed."
		}
	];
</script>

<section id="vibes" class="px-4 py-16 sm:px-6 sm:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="max-w-2xl">
			<p class="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">por qué pulso</p>
			<h2 class="mt-3 font-display text-4xl font-extrabold text-white sm:text-5xl">Hecho para tu era.</h2>
			<p class="mt-4 text-zinc-400">Menos scroll vacío. Más gente con la que sí quieres estar.</p>
		</div>

		<div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each features as feature (feature.title)}
				<article class="card-glow">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-neon/40 to-cyan/30 text-xl">
						{feature.icon}
					</div>
					<h3 class="font-display text-xl font-bold text-white">{feature.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-zinc-400">{feature.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>
