<script lang="ts">
	let email = $state("luna.vega@pulso.test");
	let password = $state("LunaVibe1234");
	let loading = $state(false);
	let message = $state("");
	let error = $state("");

	const api = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

	async function submit(event: Event) {
		event.preventDefault();
		loading = true;
		error = "";
		message = "";

		try {
			const res = await fetch(`${api}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});
			const json = await res.json();

			if (!json.success) {
				error = json.error?.message ?? "No se pudo entrar.";
				return;
			}

			message = `Hola ${json.data.user.fullName}. Rol: ${json.data.user.role?.name}.`;
		} catch {
			error = "No hay conexión con la API. ¿Está corriendo en el puerto 3000?";
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Entrar · PULSO</title>
</svelte:head>

<section class="flex min-h-screen items-center justify-center px-4 py-16">
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(176,38,255,0.18),_transparent_45%)]"></div>
	<form class="card-glow relative w-full max-w-md" onsubmit={submit}>
		<a href="/" class="text-xs font-semibold uppercase tracking-widest text-cyan">← volver</a>
		<h1 class="mt-4 font-display text-4xl font-extrabold text-white">Entra al pulso.</h1>
		<p class="mt-2 text-sm text-zinc-400">Usa una cuenta de prueba o la tuya.</p>

		<label class="mt-6 block text-sm text-zinc-300">
			Correo
			<input
				class="mt-2 w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none transition focus:border-cyan"
				type="email"
				bind:value={email}
				required
			/>
		</label>
		<label class="mt-4 block text-sm text-zinc-300">
			Contraseña
			<input
				class="mt-2 w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none transition focus:border-pink"
				type="password"
				bind:value={password}
				required
			/>
		</label>

		<button class="btn-primary mt-6 w-full" type="submit" disabled={loading}>
			{loading ? "Entrando..." : "Entrar"}
		</button>

		{#if error}
			<p class="mt-4 text-sm text-pink">{error}</p>
		{/if}
		{#if message}
			<p class="mt-4 text-sm text-cyan">{message}</p>
		{/if}
	</form>
</section>
