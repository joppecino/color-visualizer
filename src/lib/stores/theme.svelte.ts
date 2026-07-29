import { browser } from '$app/environment';
import type { ThemeConfig, ThemeVars } from '$lib/utils/color';
import { deriveTheme } from '$lib/utils/color';

const CONFIG_KEY = 'color-visualizer-theme';
const OVERRIDES_KEY = 'color-visualizer-overrides';

function loadConfig(): ThemeConfig {
	if (!browser) return { bg: '#0f0f1a', primary: '#7c6af0' };
	try {
		const saved = localStorage.getItem(CONFIG_KEY);
		if (saved) return JSON.parse(saved) as ThemeConfig;
	} catch { /* ignore */ }
	return { bg: '#0f0f1a', primary: '#7c6af0' };
}

function saveConfig(config: ThemeConfig) {
	if (!browser) return;
	try {
		localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
	} catch { /* ignore */ }
}

function loadOverrides(): Record<string, string> {
	if (!browser) return {};
	try {
		const saved = localStorage.getItem(OVERRIDES_KEY);
		if (saved) return JSON.parse(saved) as Record<string, string>;
	} catch { /* ignore */ }
	return {};
}

function saveOverrides(overrides: Record<string, string>) {
	if (!browser) return;
	try {
		localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
	} catch { /* ignore */ }
}

let currentConfig = $state(loadConfig());
let currentOverrides = $state(loadOverrides());
let currentVars = $derived<ThemeVars>({
	...deriveTheme(currentConfig.bg, currentConfig.primary),
	...currentOverrides,
});

export const theme = {
	get config(): ThemeConfig {
		return currentConfig;
	},
	get overrides(): Record<string, string> {
		return currentOverrides;
	},
	get vars(): ThemeVars {
		return currentVars;
	},
	setConfig(config: ThemeConfig) {
		currentConfig = config;
		saveConfig(config);
	},
	setOverrides(overrides: Record<string, string>) {
		currentOverrides = overrides;
		saveOverrides(overrides);
	},
};