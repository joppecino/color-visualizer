<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
	type Size = 'sm' | 'md' | 'lg';

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		onclick,
		children
	}: {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: (e: MouseEvent) => void;
		children: import('svelte').Snippet;
	} = $props();

	let btnEl: HTMLButtonElement;
	let ripples: { id: number; x: number; y: number; size: number }[] = $state([]);
	let nextId = 0;

	function handleClick(e: MouseEvent) {
		const rect = btnEl.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const size = Math.max(rect.width, rect.height) * 2;
		const id = nextId++;

		ripples = [...ripples, { id, x, y, size }];

		setTimeout(() => {
			ripples = ripples.filter((r) => r.id !== id);
		}, 500);

		onclick?.(e);
	}
</script>

<button
	{type}
	{disabled}
	class="btn btn-{variant} btn-{size}"
	onclick={handleClick}
	bind:this={btnEl}
>
	{#each ripples as ripple (ripple.id)}
		<span
			class="ripple"
			style="left:{ripple.x}px;top:{ripple.y}px;width:{ripple.size}px;height:{ripple.size}px;"
		></span>
	{/each}
	{@render children()}
</button>

<style>
	.btn {
		position: relative;
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		font-weight: 500;
		cursor: pointer;
		transition: background var(--transition), border-color var(--transition), box-shadow var(--transition);
		white-space: nowrap;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.ripple {
		position: absolute;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		transform: translate(-50%, -50%) scale(0);
		animation: ripple-fade 0.5s ease-out forwards;
		pointer-events: none;
	}

	@keyframes ripple-fade {
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0;
		}
	}

	.btn-sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.8rem;
	}

	.btn-md {
		padding: 0.5rem 1.125rem;
		font-size: 0.875rem;
	}

	.btn-lg {
		padding: 0.625rem 1.5rem;
		font-size: 1rem;
	}

	.btn-primary {
		background: var(--color-primary);
		color: #fff;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-primary-hover);
	}

	.btn-secondary {
		background: var(--color-bg-hover);
		border-color: var(--color-border);
		color: var(--color-text);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--color-border);
	}

	.btn-success {
		background: var(--color-success);
		color: #000;
	}

	.btn-success:hover:not(:disabled) {
		filter: brightness(1.1);
	}

	.btn-danger {
		background: var(--color-danger);
		color: #fff;
	}

	.btn-danger:hover:not(:disabled) {
		filter: brightness(1.1);
	}

	.btn-ghost {
		background: transparent;
		color: var(--color-text-muted);
	}

	.btn-ghost:hover:not(:disabled) {
		background: var(--color-bg-hover);
		color: var(--color-text);
	}
</style>