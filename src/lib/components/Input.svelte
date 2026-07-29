<script lang="ts">
	let {
		label = '',
		placeholder = '',
		value = $bindable(''),
		type = 'text',
		name = '',
		error = ''
	}: {
		label?: string;
		placeholder?: string;
		value?: string;
		type?: string;
		name?: string;
		error?: string;
	} = $props();
</script>

<div class="field">
	{#if label}
		<label for={name}>{label}</label>
	{/if}
	<input {type} {name} {placeholder} bind:value class:has-error={!!error} />
	{#if error}
		<span class="error">{error}</span>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	input {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-bg-elevated);
		color: var(--color-text);
		font-size: 0.875rem;
		font-family: inherit;
		outline: none;
		transition: border-color var(--transition), box-shadow var(--transition);
	}

	input::placeholder {
		color: var(--color-text-muted);
		opacity: 0.6;
	}

	input:focus {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-primary-muted);
	}

	input.has-error {
		border-color: var(--color-danger);
	}

	input.has-error:focus {
		box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.2);
	}

	.error {
		font-size: 0.75rem;
		color: var(--color-danger);
	}
</style>