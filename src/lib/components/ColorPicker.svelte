<script lang="ts">
	import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, hexToHsl, hslToHex } from '$lib/utils/color';

	let {
		label = 'Color',
		value = $bindable('#7c6af0'),
	}: {
		label?: string;
		value?: string;
	} = $props();

	let isOpen = $state(false);
	let rootEl: HTMLElement | null = $state(null);
	let wheelCanvas: HTMLCanvasElement | null = $state(null);
	const WHEEL_SIZE = 200;

	function getInitHsl() {
		return hexToHsl(value);
	}
	let pickerHue = $state(getInitHsl().h);
	let pickerSat = $state(getInitHsl().s);
	let pickerLgt = $state(getInitHsl().l);
	let pickerR = $state(0);
	let pickerG = $state(0);
	let pickerB = $state(0);

	let isDraggingWheel = $state(false);
	let isDraggingLightness = $state(false);

	function syncPickerFromHex(hex: string) {
		const hsl = hexToHsl(hex);
		pickerHue = hsl.h;
		pickerSat = hsl.s;
		pickerLgt = hsl.l;
		const rgb = hexToRgb(hex);
		if (rgb) {
			pickerR = rgb.r;
			pickerG = rgb.g;
			pickerB = rgb.b;
		}
	}

	function syncHexFromPicker() {
		value = hslToHex(pickerHue, pickerSat, pickerLgt);
	}

	function handleRgbInput() {
		const hsl = rgbToHsl(pickerR, pickerG, pickerB);
		pickerHue = hsl.h;
		pickerSat = hsl.s;
		pickerLgt = hsl.l;
		syncHexFromPicker();
	}

	let hexInput = $state('');

	function handleHexInput() {
		const raw = hexInput.replace('#', '');
		if (!/^[0-9a-fA-F]{6}$/.test(raw)) return;
		const hex = '#' + raw.toLowerCase();
		value = hex;
		syncPickerFromHex(hex);
	}

	$effect(() => {
		if (!isOpen || !wheelCanvas) return;
		drawWheel();
	});

	$effect(() => {
		if (!isOpen) return;
		const init = hexToHsl(value);
		pickerHue = init.h;
		pickerSat = init.s;
		pickerLgt = init.l;
		const rgb = hexToRgb(value);
		if (rgb) {
			pickerR = rgb.r;
			pickerG = rgb.g;
			pickerB = rgb.b;
		}
		hexInput = value;
	});

	function drawWheel() {
		const canvas = wheelCanvas!;
		const ctx = canvas.getContext('2d')!;
		const cx = WHEEL_SIZE / 2;
		const cy = WHEEL_SIZE / 2;
		const radius = WHEEL_SIZE / 2 - 4;

		const imageData = ctx.createImageData(WHEEL_SIZE, WHEEL_SIZE);

		for (let y = 0; y < WHEEL_SIZE; y++) {
			for (let x = 0; x < WHEEL_SIZE; x++) {
				const dx = x - cx;
				const dy = y - cy;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist > radius) continue;

				const hue = (Math.atan2(dy, dx) * 180) / Math.PI + 360;
				const sat = (dist / radius) * 100;
				const rgb = hslToRgb(hue % 360, sat, 50);

				const idx = (y * WHEEL_SIZE + x) * 4;
				imageData.data[idx] = Math.round(rgb.r);
				imageData.data[idx + 1] = Math.round(rgb.g);
				imageData.data[idx + 2] = Math.round(rgb.b);
				imageData.data[idx + 3] = 255;
			}
		}

		ctx.putImageData(imageData, 0, 0);

		const angleRad = (pickerHue * Math.PI) / 180;
		const satDist = (pickerSat / 100) * radius;
		const selX = cx + Math.cos(angleRad) * satDist;
		const selY = cy + Math.sin(angleRad) * satDist;

		if (satDist > 2) {
			ctx.beginPath();
			ctx.arc(selX, selY, 6, 0, Math.PI * 2);
			ctx.strokeStyle = '#fff';
			ctx.lineWidth = 2.5;
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(selX, selY, 5, 0, Math.PI * 2);
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}

	function getWheelColor(clientX: number, clientY: number) {
		const rect = wheelCanvas!.getBoundingClientRect();
		const x = clientX - rect.left;
		const y = clientY - rect.top;
		const cx = WHEEL_SIZE / 2;
		const cy = WHEEL_SIZE / 2;
		const dx = x - cx;
		const dy = y - cy;
		const dist = Math.sqrt(dx * dx + dy * dy);
		const radius = WHEEL_SIZE / 2 - 4;

		if (dist > radius) return;

		const hue = (Math.atan2(dy, dx) * 180) / Math.PI + 360;
		const sat = (dist / radius) * 100;

		pickerHue = hue % 360;
		pickerSat = Math.min(100, sat);
		syncHexFromPicker();
	}

	function handleWheelDown(e: MouseEvent) {
		isDraggingWheel = true;
		getWheelColor(e.clientX, e.clientY);
	}

	function handleWheelMove(e: MouseEvent) {
		if (!isDraggingWheel) return;
		getWheelColor(e.clientX, e.clientY);
	}

	function stopDragging() {
		isDraggingWheel = false;
		isDraggingLightness = false;
	}

	let lightnessSliderEl: HTMLDivElement | null = $state(null);

	function getLightness(clientX: number) {
		const rect = lightnessSliderEl!.getBoundingClientRect();
		const x = clientX - rect.left;
		const lgt = Math.max(0, Math.min(100, (x / rect.width) * 100));
		pickerLgt = lgt;
		syncHexFromPicker();
	}

	function handleLightnessDown(e: MouseEvent) {
		isDraggingLightness = true;
		getLightness(e.clientX);
	}

	function handleLightnessMove(e: MouseEvent) {
		if (!isDraggingLightness) return;
		getLightness(e.clientX);
	}

	const toggle = () => {
		if (isOpen) {
			isOpen = false;
			return;
		}
		syncPickerFromHex(value);
		isOpen = true;
	};

	$effect(() => {
		if (!isOpen) return;
		const handler = (e: MouseEvent) => {
			if (!isOpen) return;
			if (rootEl?.contains(e.target as Node)) return;
			isOpen = false;
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	});

	$effect(() => {
		if (!isDraggingWheel && !isDraggingLightness) return;
		const move = (e: MouseEvent) => {
			if (isDraggingWheel) getWheelColor(e.clientX, e.clientY);
			if (isDraggingLightness) getLightness(e.clientX);
		};
		const up = () => stopDragging();
		document.addEventListener('mousemove', move);
		document.addEventListener('mouseup', up);
		return () => {
			document.removeEventListener('mousemove', move);
			document.removeEventListener('mouseup', up);
		};
	});

	let lightnessGradientBg = $derived(
		`linear-gradient(to right, #000, hsl(${pickerHue}, ${pickerSat}%, 50%), #fff)`
	);
</script>

<div class="color-picker-field" bind:this={rootEl}>
	<span class="label-text">{label}</span>
	<button type="button" class="trigger" onclick={toggle} aria-expanded={isOpen}>
		<span class="swatch" style="background:{value}"></span>
		<span class="trigger-text">{value}</span>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
		</svg>
	</button>

	{#if isOpen}
		<div class="picker-dropdown">
			<div class="wheel-section">
				<canvas
					bind:this={wheelCanvas}
					width={WHEEL_SIZE}
					height={WHEEL_SIZE}
					onmousedown={handleWheelDown}
					onmousemove={handleWheelMove}
					role="slider"
					aria-label="Color wheel"
					aria-valuenow={pickerHue}
					tabindex="0"
				></canvas>
				<div
					class="lightness-slider"
					bind:this={lightnessSliderEl}
					onmousedown={handleLightnessDown}
					onmousemove={handleLightnessMove}
					style="background:{lightnessGradientBg}"
					role="slider"
					aria-label="Lightness"
					aria-valuenow={pickerLgt}
					tabindex="0"
				>
					<div class="lightness-thumb" style="left:{pickerLgt}%"></div>
				</div>
			</div>
			<div class="preview-row">
				<div class="preview-swatch" style="background:{value}"></div>
				<div class="preview-label">{value}</div>
			</div>
			<div class="hex-input-row">
				<span class="hex-prefix">#</span>
				<input
					type="text"
					class="hex-field"
					bind:value={hexInput}
					oninput={handleHexInput}
					maxlength={7}
					placeholder="ffffff"
				/>
			</div>
			<div class="rgb-inputs">
				<label>
					<span class="rgb-label" style="color:#ef4444">R</span>
					<input type="number" min="0" max="255" bind:value={pickerR} oninput={handleRgbInput} />
				</label>
				<label>
					<span class="rgb-label" style="color:#22c55e">G</span>
					<input type="number" min="0" max="255" bind:value={pickerG} oninput={handleRgbInput} />
				</label>
				<label>
					<span class="rgb-label" style="color:#3b82f6">B</span>
					<input type="number" min="0" max="255" bind:value={pickerB} oninput={handleRgbInput} />
				</label>
			</div>
		</div>
	{/if}
</div>

<style>
	.color-picker-field {
		position: relative;
		display: grid;
		gap: 0.4rem;
	}

	.label-text {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.trigger {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		height: 2.75rem;
		padding: 0 0.9rem;
		border: 1px solid color-mix(in oklab, var(--color-text) 16%, transparent);
		border-radius: var(--radius-md);
		background: var(--color-bg-elevated);
		color: var(--color-text);
		cursor: pointer;
	}

	.trigger svg {
		width: 1rem;
		height: 1rem;
		margin-left: auto;
		flex-shrink: 0;
	}

	.swatch {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 0.25rem;
		border: 1px solid var(--color-border);
		flex-shrink: 0;
	}

	.trigger-text {
		font-family: monospace;
		font-size: 0.875rem;
		text-transform: uppercase;
	}

	.picker-dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		z-index: 40;
		width: min(16rem, calc(100vw - 3rem));
		padding: 0.75rem;
		border-radius: var(--radius-lg);
		background: var(--color-bg-elevated);
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
		border: 1px solid color-mix(in oklab, var(--color-text) 10%, transparent);
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.wheel-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.625rem;
	}

	.wheel-section canvas {
		border-radius: 50%;
		cursor: pointer;
		display: block;
		width: 12rem;
		height: 12rem;
	}

	.lightness-slider {
		position: relative;
		width: 100%;
		height: 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
	}

	.lightness-thumb {
		position: absolute;
		top: 50%;
		width: 1.1rem;
		height: 1.1rem;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--color-border);
		transform: translate(-50%, -50%);
		pointer-events: none;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}

	.preview-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.preview-swatch {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.25rem;
		border: 1px solid var(--color-border);
	}

	.preview-label {
		font-family: monospace;
		font-size: 0.8rem;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.rgb-inputs {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.375rem;
	}

	.rgb-inputs label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.rgb-label {
		font-size: 0.75rem;
		font-weight: 700;
		width: 0.9rem;
		text-align: center;
	}

	.rgb-inputs input {
		width: 100%;
		padding: 0.3rem 0.35rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-bg);
		color: var(--color-text);
		font-size: 0.8rem;
		font-family: monospace;
		outline: none;
		text-align: center;
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.rgb-inputs input::-webkit-inner-spin-button,
	.rgb-inputs input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.rgb-inputs input:focus {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-primary-muted);
	}

	.hex-input-row {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.hex-prefix {
		font-size: 0.85rem;
		font-weight: 700;
		font-family: monospace;
		color: var(--color-text-muted);
	}

	.hex-field {
		flex: 1;
		padding: 0.3rem 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-bg);
		color: var(--color-text);
		font-size: 0.85rem;
		font-family: monospace;
		outline: none;
		text-transform: lowercase;
	}

	.hex-field:focus {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-primary-muted);
	}
</style>