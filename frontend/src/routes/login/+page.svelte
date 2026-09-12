<script lang="ts">
	let email = $state('luna.vega@pulso.test');
	let password = $state('LunaVibe1234');
	let loading = $state(false);
	let msg = $state('');
	let err = $state('');
	const api = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

	async function submit(e: Event) {
		e.preventDefault();
		loading = true;
		err = '';
		msg = '';
		try {
			const res = await fetch(`${api}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			const j = await res.json();
			if (!j.success) err = j.error?.message ?? 'Error';
			else msg = `Hola ${j.data.user.fullName}`;
		} catch {
			err = 'API no disponible';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Entrar · PULSO</title></svelte:head>

<main class="flex min-h-screen items-center justify-center px-4">
	<form class="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8" onsubmit={submit}>
		<a href="/" class="text-xs uppercase tracking-widest text-cyan">← home</a>
		<h1 class="font-display mt-4 text-5xl font-extrabold text-white">Entra al pulso.</h1>
		<label class="mt-6 block text-sm">Correo
			<input class="mt-2 w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none focus:border-cyan" type="email" bind:value={email} required />
		</label>
		<label class="mt-4 block text-sm">Contraseña
			<input class="mt-2 w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none focus:border-pink" type="password" bind:value={password} required />
		</label>
		<button class="btn mt-6 w-full" disabled={loading}>{loading ? '...' : 'Entrar'}</button>
		{#if err}<p class="mt-3 text-sm text-pink">{err}</p>{/if}
		{#if msg}<p class="mt-3 text-sm text-cyan">{msg}</p>{/if}
	</form>
</main>
