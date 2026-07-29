<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import '$lib/styles/global.css';
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme.svelte';
	import { applyTheme } from '$lib/utils/color';

	let { children } = $props();

	let current = $derived(
		($page.url.pathname === '/preview' ? 'preview' : 'colors') as 'colors' | 'preview'
	);

	$effect(() => {
		applyTheme(theme.vars);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar {current} />

<main>
	{@render children()}
</main>

<style>
	main {
		padding: 5rem 1rem 5rem;
		max-width: 48rem;
		margin: 0 auto;
	}

	@media (min-width: 768px) {
		main {
			padding-top: 4rem;
			padding-bottom: 2rem;
		}
	}
</style>