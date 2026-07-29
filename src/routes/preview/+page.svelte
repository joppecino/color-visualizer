<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Datepicker from '$lib/components/Datepicker.svelte';

	let name = $state('');
	let email = $state('');
	let birthdate = $state('');
</script>

<svelte:head>
	<title>Preview</title>
</svelte:head>

<h1>Preview</h1>
<p class="subtitle">See how your color scheme looks on all components</p>

<section>
	<h2>Buttons</h2>
	<div class="row">
		<Button>Primary</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="success">Success</Button>
		<Button variant="danger">Danger</Button>
		<Button variant="ghost">Ghost</Button>
	</div>
	<div class="row">
		<Button size="sm">Small</Button>
		<Button size="md">Medium</Button>
		<Button size="lg">Large</Button>
		<Button disabled>Disabled</Button>
	</div>
</section>

<section>
	<h2>Input Fields</h2>
	<div class="cols">
		<Input label="Name" placeholder="Enter your name" bind:value={name} name="name" />
		<Input label="Email" placeholder="you@example.com" bind:value={email} name="email" type="email" />
		<Input label="With Error" placeholder="Oops" value="bad" error="This field is required" />
	</div>
</section>

<section>
	<h2>Datepicker</h2>
	<Datepicker label="Birth date" bind:value={birthdate} />
</section>

<section>
	<h2>Typography</h2>
	<div class="typo">
		<h1>Heading 1</h1>
		<h2>Heading 2</h2>
		<h3>Heading 3</h3>
		<h4>Heading 4</h4>
		<h5>Heading 5</h5>
		<h6>Heading 6</h6>

		<p>This is a standard paragraph. Sphinx of the black quartz, judge my vow.</p>
		<p>Here's another paragraph with <strong>bold text</strong>, <em>italic text</em>, and <a href="/preview">a link</a>. You can also have <code>inline code</code> or <small>small text</small>.</p>

		<blockquote>
			"This is a made up quote. It's believable if it's intelligent enough."
			<cite>— Hatsune Miku</cite>
		</blockquote>

		<div class="list-row">
			<ul>
				<li>Unordered item one</li>
				<li>Unordered item two</li>
				<li>Unordered item three</li>
			</ul>
			<ol>
				<li>Ordered item one</li>
				<li>Ordered item two</li>
				<li>Ordered item three</li>
			</ol>
		</div>
	</div>
</section>

<section>
	<h2>Live Values</h2>
	<p>Name: <strong>{name || '(empty)'}</strong></p>
	<p>Email: <strong>{email || '(empty)'}</strong></p>
	<p>Birth date: <strong>{birthdate || '(empty)'}</strong></p>
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

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.cols {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 24rem;
	}

	.typo {
		max-width: 32rem;
	}

	.typo > :global(*) {
		margin-bottom: 0.5rem;
	}

	.typo h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-top: 1.5rem;
	}

	.typo h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 1.25rem;
	}

	.typo h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1rem;
	}

	.typo h4 {
		font-size: 1.125rem;
		font-weight: 600;
	}

	.typo h5 {
		font-size: 1rem;
		font-weight: 600;
	}

	.typo h6 {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.typo p {
		font-size: 0.9375rem;
		line-height: 1.65;
		color: var(--color-text);
	}

	.typo a {
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.typo a:hover {
		color: var(--color-primary-hover);
	}

	.typo blockquote {
		margin: 1rem 0;
		padding: 0.75rem 1rem;
		border-left: 3px solid var(--color-primary);
		background: var(--color-bg-elevated);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		font-style: italic;
		line-height: 1.6;
	}

	.typo blockquote cite {
		display: block;
		margin-top: 0.375rem;
		font-style: normal;
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}

	.typo code {
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		background: var(--color-surface);
		font-size: 0.85em;
	}

	.typo small {
		font-size: 0.8em;
		color: var(--color-text-muted);
	}

	.list-row {
		display: flex;
		gap: 2rem;
		margin-top: 0.5rem;
	}

	.list-row ul,
	.list-row ol {
		padding-left: 1.25rem;
		font-size: 0.9375rem;
		line-height: 1.8;
	}

	.typo h1:first-child,
	.typo h2:first-child,
	.typo h3:first-child {
		margin-top: 0;
	}
</style>