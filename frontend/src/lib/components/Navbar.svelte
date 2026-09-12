<script lang="ts">
	let open = $state(false);

	const links = [
		{ href: "#inicio", label: "Inicio" },
		{ href: "#vibes", label: "Vibes" },
		{ href: "#crew", label: "Crew" }
	];
</script>

<header class="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
	<nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
		<a href="#inicio" class="font-display text-2xl font-extrabold tracking-tight text-white">
			PUL<span class="bg-linear-to-r from-neon via-pink to-cyan bg-clip-text text-transparent">SO</span>
		</a>

		<div class="hidden items-center gap-8 md:flex">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="text-sm font-medium text-zinc-300 transition duration-300 hover:text-cyan"
				>
					{link.label}
				</a>
			{/each}
			<a href="/login" class="btn-primary">Entrar</a>
		</div>

		<button
			type="button"
			class="rounded-full border border-white/15 p-2 text-white transition duration-300 hover:border-cyan md:hidden"
			aria-label="Abrir menú"
			onclick={() => (open = !open)}
		>
			<span class="block h-0.5 w-5 bg-white"></span>
			<span class="mt-1 block h-0.5 w-5 bg-white"></span>
		</button>
	</nav>

	{#if open}
		<div class="space-y-3 border-t border-white/10 px-4 py-4 md:hidden">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="block text-sm font-medium text-zinc-300"
					onclick={() => (open = false)}
				>
					{link.label}
				</a>
			{/each}
			<a href="/login" class="btn-primary w-full">Entrar</a>
		</div>
	{/if}
</header>
