<script lang="ts">
	import { untrack } from 'svelte';
	import ColorPicker from './ColorPicker.svelte';

	let {
		initialValue,
		onchange,
	}: {
		initialValue: string;
		onchange: (v: string) => void;
	} = $props();

	// svelte-ignore state_referenced_locally
	let val = $state(initialValue);

	$effect(() => {
		const v = val;
		untrack(() => onchange(v));
	});
</script>

<ColorPicker label="" bind:value={val} />