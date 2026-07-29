<script lang="ts">
	let { current = 'colors' }: { current: 'colors' | 'preview' } = $props();
</script>

<header class="navbar">
	<nav>
		<ul>
			<li>
				<a href="/" class:active={current === 'colors'}>Colors</a>
			</li>
			<li>
				<a href="/preview" class:active={current === 'preview'}>Preview</a>
			</li>
		</ul>
	</nav>
</header>

<nav class="dock">
	<a href="/" class:active={current === 'colors'}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4 19V9M12 19V5M20 19v-8" />
		</svg>
		<span>Colors</span>
	</a>
	<a href="/preview" class:active={current === 'preview'}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Zm8-3.5c0-.55-.05-1.1-.14-1.63l2.06-1.6-2-3.46-2.5 1a8.1 8.1 0 0 0-2.82-1.63l-.38-2.65h-4l-.38 2.65a8.1 8.1 0 0 0-2.82 1.63l-2.5-1-2 3.46 2.06 1.6A8.45 8.45 0 0 0 4 12c0 .55.05 1.1.14 1.63l-2.06 1.6 2 3.46 2.5-1a8.1 8.1 0 0 0 2.82 1.63l.38 2.65h4l.38-2.65a8.1 8.1 0 0 0 2.82-1.63l2.5 1 2-3.46-2.06-1.6c.09-.53.14-1.08.14-1.63Z" />
		</svg>
		<span>Preview</span>
	</a>
</nav>

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 20;
		display: none;
		border-bottom: 1px solid var(--color-border);
		background: var(--color-bg-elevated);
		padding: 0 1rem;
		backdrop-filter: blur(12px);
	}

	.navbar nav ul {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1px;
		list-style: none;
	}

	.navbar a {
		display: block;
		padding: 0.5rem 1rem;
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		font-size: 0.875rem;
		font-weight: 500;
		transition: color var(--transition), background var(--transition);
	}

	.navbar a:hover {
		color: var(--color-text);
		background: var(--color-bg-hover);
	}

	.navbar a.active {
		color: var(--color-primary);
		background: var(--color-primary-muted);
		font-weight: 600;
	}

	.dock {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 20;
		display: flex;
		border-top: 1px solid var(--color-border);
		background: var(--color-bg-elevated);
		backdrop-filter: blur(12px);
	}

	.dock a {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.125rem;
		padding: 0.5rem 0 0.625rem;
		color: var(--color-text-muted);
		font-size: 0.7rem;
		text-decoration: none;
		transition: color var(--transition);
		opacity: 0.6;
	}

	.dock a.active {
		color: var(--color-primary);
		opacity: 1;
	}

	.dock svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (min-width: 768px) {
		.navbar {
			display: block;
		}

		.dock {
			display: none;
		}
	}
</style>