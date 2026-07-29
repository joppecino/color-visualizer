<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { deriveTheme } from '$lib/utils/color';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import OverridePicker from '$lib/components/OverridePicker.svelte';

	const presets = [
		{ name: 'Signal Blue', primary: '#0057FF', bg: '#F8F7F4' },
		{ name: 'Butter Yellow', primary: '#FFF275', bg: '#3A0CA3' },
		{ name: 'Lime Spark', primary: '#B6FF2E', bg: '#23262F' },
		{ name: 'Dragonfruit', primary: '#FF4696', bg: '#1E1033' },
		{ name: 'Emerald Ink', primary: '#064E3B', bg: '#F8E7C9' },
		{ name: 'Ultra Violet', primary: '#6A00F4', bg: '#FFD6A5' },
		{ name: 'Neon Lime', primary: '#C8FF3D', bg: '#2D1B69' },
		{ name: 'Burnt Orange', primary: '#FC6C26', bg: '#FFF4D6' },
		{ name: 'Warm Lime', primary: '#CFFF74', bg: '#2F3A1D' },
		{ name: 'Electric Indigo', primary: '#5B3DF5', bg: '#E8DEFF' },
		{ name: 'Sky Mint', primary: '#B8F7E4', bg: '#25272C' },
		{ name: 'Electric Orchid', primary: '#E46CFF', bg: '#2E0F35' },
		{ name: 'Cyber Grape', primary: '#6D28D9', bg: '#D7FF00' },
		{ name: 'Raspberry', primary: '#C2185B', bg: '#E0F2FE' },
		{ name: 'Quantum Blue', primary: '#2457FF', bg: '#DFF7FF' },
		{ name: 'Deep Graphite', primary: '#B6FF2E', bg: '#1F2329' },
		{ name: 'Blueberry', primary: '#243B8F', bg: '#FFF0C9' },
		{ name: 'Cyber Teal', primary: '#03313A', bg: '#8FFFE0' },
		{ name: 'Strawberry', primary: '#DD4470', bg: '#FFE3B3' },
	];

	let bgInput = $state(theme.config.bg);
	let primaryInput = $state(theme.config.primary);

	let overrides = $state<Record<string, string>>({ ...theme.overrides });

	function isOverridden(name: string): boolean {
		return name in overrides;
	}

	function toggleOverride(name: string) {
		const next = { ...overrides };
		if (name in next) {
			delete next[name];
		} else {
			next[name] = derived[name];
		}
		overrides = next;
	}

	function setOverrideValue(name: string, value: string) {
		overrides = { ...overrides, [name]: value };
	}

	function apply() {
		theme.setConfig({ bg: bgInput, primary: primaryInput });
		theme.setOverrides(overrides);
	}

	function selectPreset(preset: typeof presets[number]) {
		bgInput = preset.bg;
		primaryInput = preset.primary;
		theme.setConfig({ bg: preset.bg, primary: preset.primary });
		theme.setOverrides(overrides);
	}

	function swapColors() {
		const tmp = bgInput;
		bgInput = primaryInput;
		primaryInput = tmp;
	}

	let derived = $derived(deriveTheme(bgInput, primaryInput));

	function finalValue(name: string): string {
		return name in overrides ? overrides[name] : derived[name];
	}
</script>

<svelte:head>
	<title>Colors</title>
</svelte:head>

<h1>Colors</h1>
<p class="subtitle">Customize your color scheme</p>

<section>
	<h2>Base Colors</h2>
	<div class="picker-row">
		<ColorPicker label="Background" bind:value={bgInput} />
		<ColorPicker label="Primary" bind:value={primaryInput} />
	</div>
	<div class="action-row">
		<button class="apply-btn" onclick={apply}>Apply</button>
		<button class="swap-btn" onclick={swapColors} title="Swap background and primary">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
				<path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
			</svg>
			Swap
		</button>
	</div>
</section>

<section>
	<h2>Derived Colors</h2>
	<div class="swatches">
		{#each Object.entries(derived) as [name, value]}
			{@const overridden = isOverridden(name)}
			{@const actual = finalValue(name)}
			<div class="swatch" style="background: {actual}">
				<button
					class="toggle-btn"
					class:overridden
					onclick={() => toggleOverride(name)}
					title={overridden ? 'Revert to auto' : 'Override'}
				>
					{#if overridden}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.46 12.38a1.5 1.5 0 0 1 0-.76A10.5 10.5 0 0 1 12 4a10.5 10.5 0 0 1 9.54 7.62 1.5 1.5 0 0 1 0 .76A10.5 10.5 0 0 1 12 20a10.5 10.5 0 0 1-9.54-7.62Z" />
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.48 10.48 0 0 0 2.46 11.62a1.5 1.5 0 0 0 0 .76A10.5 10.5 0 0 0 12 20a10.47 10.47 0 0 0 5.42-1.564" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M17.78 15.306A10.47 10.47 0 0 0 21.54 12.38a1.5 1.5 0 0 0 0-.76A10.5 10.5 0 0 0 12 4a10.45 10.45 0 0 0-2.36.255" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 0 0-5.394-1.95" />
							<path stroke-linecap="round" stroke-linejoin="round" d="m1 1 22 22" />
						</svg>
					{/if}
				</button>
				<span class="swatch-name">{name.replace('--color-', '')}</span>
				{#if overridden}
					<div class="override-wrap">
						<OverridePicker initialValue={actual} onchange={(v) => setOverrideValue(name, v)} />
					</div>
				{:else}
					<span class="swatch-hex">{actual}</span>
				{/if}
			</div>
		{/each}
	</div>
</section>

<section>
	<h2>Presets</h2>
	<div class="presets">
		{#each presets as preset}
			<button
				class="preset-card"
				onclick={() => selectPreset(preset)}
			>
				<div class="preset-swatches">
					<span class="preset-swatch" style="background: {preset.bg}"></span>
					<span class="preset-swatch" style="background: {preset.primary}"></span>
				</div>
				<span class="preset-name">{preset.name}</span>
			</button>
		{/each}
	</div>
</section>

<style>
	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.subtitle {
		color: var(--color-text-muted);
		margin-bottom: 2rem;
	}

	section {
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.picker-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.apply-btn {
		padding: 0.5rem 1.25rem;
		border: none;
		border-radius: var(--radius-sm);
		background: var(--color-primary);
		color: #fff;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.apply-btn:hover {
		background: var(--color-primary-hover);
	}

	.action-row {
		display: flex;
		gap: 0.5rem;
	}

	.swap-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-bg-hover);
		color: var(--color-text);
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background var(--transition), border-color var(--transition);
	}

	.swap-btn:hover {
		background: var(--color-border);
		border-color: var(--color-primary);
	}

	.swatches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 0.5rem;
	}

	.swatch {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.625rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		font-size: 0.8rem;
		font-family: monospace;
	}

	.toggle-btn {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-bg-hover);
		color: var(--color-text-muted);
		cursor: pointer;
		flex-shrink: 0;
		transition: color var(--transition), border-color var(--transition);
	}

	.toggle-btn.overridden {
		color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.swatch-name {
		font-weight: 600;
		opacity: 0.85;
		margin-right: auto;
	}

	.swatch-hex {
		opacity: 0.65;
		font-size: 0.75rem;
	}

	.override-wrap {
		width: 8rem;
	}

	.override-wrap :global(.trigger) {
		height: 1.75rem !important;
		padding: 0 0.5rem !important;
		border-radius: var(--radius-sm) !important;
		font-size: 0.75rem !important;
	}

	.presets {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 0.625rem;
	}

	.preset-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-bg-elevated);
		cursor: pointer;
		transition: border-color var(--transition);
		text-align: left;
	}

	.preset-card:hover {
		border-color: var(--color-primary);
	}

	.preset-swatches {
		display: flex;
		gap: 0.375rem;
	}

	.preset-swatch {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
	}

	.preset-name {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--color-text);
	}
</style>