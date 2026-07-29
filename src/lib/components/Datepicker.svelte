<script lang="ts">
	import { fly } from 'svelte/transition';

	let {
		label = 'Date',
		value = $bindable(''),
		hasError = false,
		errorMessage = ''
	}: {
		label?: string;
		value?: string;
		hasError?: boolean;
		errorMessage?: string;
	} = $props();

	const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
	const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });
	const valueFormatter = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

	let isOpen = $state(false);
	let rootElement: HTMLElement | null = $state(null);
	let visibleMonth = $state(new Date());
	let openUpward = $state(true);
	let touchStartX = $state(0);
	let navDirection = $state(1);
	const SWIPE_THRESHOLD = 50;

	const toIsoDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const parseIsoDate = (rawValue: string) => {
		if (!rawValue) return null;
		const parsed = new Date(`${rawValue}T00:00:00`);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	};

	const getMonthGridStart = (monthDate: Date) => {
		const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
		const offset = (start.getDay() + 6) % 7;
		start.setDate(start.getDate() - offset);
		return start;
	};

	const isSameDate = (left: Date, right: Date) =>
		left.getFullYear() === right.getFullYear() &&
		left.getMonth() === right.getMonth() &&
		left.getDate() === right.getDate();

	const openPicker = () => {
		const selectedDate = parseIsoDate(value);
		visibleMonth = selectedDate ?? new Date();
		const trigger = rootElement?.querySelector('.date-trigger');
		const rect = trigger?.getBoundingClientRect();
		const spaceAbove = rect?.top ?? 0;
		openUpward = spaceAbove > 320;
		isOpen = true;
	};

	const closePicker = () => isOpen = false;

	const togglePicker = () => {
		if (isOpen) {
			closePicker();
			return;
		}
		openPicker();
	};

	const showPreviousMonth = () => {
		navDirection = -1;
		visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
	};

	const showNextMonth = () => {
		navDirection = 1;
		visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
	};

	const selectDate = (date: Date) => {
		value = toIsoDate(date);
		closePicker();
	};

	const handleDocumentClick = (event: MouseEvent) => {
		if (!isOpen) return;
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (rootElement?.contains(target)) return;
		closePicker();
	};

	const handleTouchStart = (event: TouchEvent) => touchStartX = event.touches[0].clientX;

	const handleTouchEnd = (event: TouchEvent) => {
		const delta = event.changedTouches[0].clientX - touchStartX;
		if (Math.abs(delta) < SWIPE_THRESHOLD) return;
		if (delta < 0) {
			showNextMonth();
		} else {
			showPreviousMonth();
		}
	};

	$effect(() => {
		if (!isOpen) return;
		const handler = (e: MouseEvent) => handleDocumentClick(e);
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	});

	let selectedDate = $derived(parseIsoDate(value));
	let monthTitle = $derived(monthFormatter.format(visibleMonth));
	let displayValue = $derived(selectedDate ? valueFormatter.format(selectedDate) : 'Select date');
	let calendarDays = $derived.by(() => {
		const result: { date: Date; label: number; isCurrentMonth: boolean; isSelected: boolean; isToday: boolean }[] = [];
		const cursor = getMonthGridStart(visibleMonth);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		for (let index = 0; index < 42; index += 1) {
			const dayDate = new Date(cursor);
			result.push({
				date: dayDate,
				label: dayDate.getDate(),
				isCurrentMonth: dayDate.getMonth() === visibleMonth.getMonth(),
				isSelected: selectedDate ? isSameDate(dayDate, selectedDate) : false,
				isToday: isSameDate(dayDate, today)
			});
			cursor.setDate(cursor.getDate() + 1);
		}

		return result;
	});
</script>

<div class="custom-date-field" bind:this={rootElement}>
	<span class="label-text">{label}</span>
	<button
		type="button"
		class="date-trigger"
		class:has-error={hasError}
		onclick={togglePicker}
		aria-expanded={isOpen}
	>
		<span class="date-trigger-text" class:has-value={!!selectedDate}>{displayValue}</span>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M8 2v4M16 2v4M3 10h18M4 6h16a1 1 0 0 1 1 1v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z" />
		</svg>
	</button>
	{#if errorMessage}
		<span class="field-error">{errorMessage}</span>
	{/if}

	{#if isOpen}
		<div
			class="date-picker-surface"
			style={openUpward
				? 'bottom: calc(100% + 0.5rem); top: auto;'
				: 'top: calc(100% + 0.5rem); bottom: auto;'}
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
			role="application"
			aria-label="Date picker"
		>
			<div class="date-picker-header">
				<button type="button" class="month-nav-btn" onclick={showPreviousMonth} aria-label="Previous month">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
					</svg>
				</button>
				<p class="month-title">{monthTitle}</p>
				<button type="button" class="month-nav-btn" onclick={showNextMonth} aria-label="Next month">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
					</svg>
				</button>
			</div>

			<div class="weekday-row">
				{#each weekdays as weekday}
					<span>{weekday}</span>
				{/each}
			</div>

			<div class="days-grid-wrapper">
				{#key visibleMonth}
					<div class="days-grid" in:fly={{ x: 80 * navDirection, duration: 200 }} out:fly={{ x: -80 * navDirection, duration: 200 }}>
						{#each calendarDays as day}
							<button
								type="button"
								class="day-btn"
								class:outside={!day.isCurrentMonth}
								class:selected={day.isSelected}
								class:today={day.isToday}
								onclick={() => selectDate(day.date)}
							>
								{day.label}
							</button>
						{/each}
					</div>
				{/key}
			</div>
		</div>
	{/if}
</div>

<style>
	.custom-date-field {
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

	.date-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 2.75rem;
		padding: 0 0.9rem;
		border: 1px solid color-mix(in oklab, var(--color-text) 16%, transparent);
		border-radius: var(--radius-md);
		background: var(--color-bg-elevated);
		color: var(--color-text);
		cursor: pointer;
	}

	.date-trigger.has-error {
		border-color: var(--color-danger);
	}

	.date-trigger svg {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
	}

	.date-trigger-text {
		color: color-mix(in oklab, var(--color-text) 55%, transparent);
	}

	.date-trigger-text.has-value {
		color: var(--color-text);
	}

	.field-error {
		margin-top: -0.15rem;
		font-size: 0.75rem;
		color: var(--color-danger);
	}

	.date-picker-surface {
		position: absolute;
		left: 0;
		z-index: 40;
		width: min(18rem, calc(100vw - 3rem));
		padding: 0.7rem;
		border-radius: var(--radius-lg);
		background: var(--color-bg-elevated);
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
		border: 1px solid color-mix(in oklab, var(--color-text) 10%, transparent);
		overflow: hidden;
	}

	.date-picker-header {
		display: grid;
		grid-template-columns: 1.8rem 1fr 1.8rem;
		align-items: center;
		margin-bottom: 0.35rem;
	}

	.month-title {
		text-align: center;
		font-weight: 700;
	}

	.month-nav-btn {
		display: grid;
		place-items: center;
		width: 1.8rem;
		height: 1.8rem;
		border-radius: var(--radius-sm);
		border: 1px solid color-mix(in oklab, var(--color-text) 18%, transparent);
		background: var(--color-bg-hover);
		color: var(--color-text);
		cursor: pointer;
	}

	.month-nav-btn svg {
		width: 1rem;
		height: 1rem;
	}

	.weekday-row {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		margin-bottom: 0.25rem;
		text-align: center;
		font-size: 0.74rem;
		font-weight: 700;
		color: color-mix(in oklab, var(--color-text) 75%, transparent);
	}

	.days-grid-wrapper {
		display: grid;
		overflow: hidden;
	}

	.days-grid-wrapper > .days-grid {
		grid-column: 1;
		grid-row: 1;
	}

	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.12rem;
	}

	.day-btn {
		height: 1.85rem;
		border-radius: var(--radius-sm);
		border: 0;
		background: transparent;
		color: var(--color-text);
		font-size: 0.92rem;
		cursor: pointer;
	}

	.day-btn.outside {
		color: color-mix(in oklab, var(--color-text) 35%, transparent);
	}

	.day-btn.today:not(.selected) {
		outline: 1px solid color-mix(in oklab, var(--color-primary) 45%, transparent);
	}

	.day-btn.selected {
		background: var(--color-primary);
		color: #fff;
		font-weight: 700;
	}

	.day-btn:hover:not(.selected) {
		background: var(--color-bg-hover);
	}
</style>