<script lang="ts">
	import './layout.css';
	let { children } = $props();
</script>
<div class="min-h-screen bg-ink">{@render children()}</div>
