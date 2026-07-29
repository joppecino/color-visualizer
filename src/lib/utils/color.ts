export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const cleaned = hex.replace('#', '');
	if (cleaned.length !== 6) return null;
	const num = parseInt(cleaned, 16);
	if (isNaN(num)) return null;
	return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHex(r: number, g: number, b: number): string {
	return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
	r /= 255; g /= 255; b /= 255;
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h = 0, s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
	h /= 360; s /= 100; l /= 100;
	let r: number, g: number, b: number;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return { r: r * 255, g: g * 255, b: b * 255 };
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
	const rgb = hexToRgb(hex);
	if (!rgb) return { h: 0, s: 0, l: 0 };
	return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h: number, s: number, l: number): string {
	const rgb = hslToRgb(h, s, l);
	return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export function getLuminance(hex: string): number {
	const rgb = hexToRgb(hex);
	if (!rgb) return 0;
	const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
		c /= 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function lighten(hex: string, amount: number): string {
	const hsl = hexToHsl(hex);
	return hslToHex(hsl.h, Math.max(0, hsl.s - 6), Math.min(100, hsl.l + amount));
}

export function darken(hex: string, amount: number): string {
	const hsl = hexToHsl(hex);
	return hslToHex(hsl.h, Math.min(100, hsl.s + 6), Math.max(0, hsl.l - amount));
}

export type ThemeVars = Record<string, string>;

export type ThemeConfig = {
	bg: string;
	primary: string;
};

export function deriveTheme(bg: string, primary: string): ThemeVars {
	const isLight = getLuminance(bg) > 0.5;

	return {
		'--color-bg': bg,
		'--color-bg-elevated': isLight ? darken(bg, 5) : lighten(bg, 6),
		'--color-bg-hover': isLight ? darken(bg, 10) : lighten(bg, 12),
		'--color-border': isLight ? darken(bg, 20) : lighten(bg, 18),
		'--color-surface': isLight ? darken(bg, 2) : lighten(bg, 3),
		'--color-text': isLight ? darken(bg, 88) : lighten(bg, 85),
		'--color-text-muted': isLight ? darken(bg, 55) : lighten(bg, 55),
		'--color-primary': primary,
		'--color-primary-hover': lighten(primary, 12),
		'--color-primary-muted': addAlpha(primary, 0.15),
	};
}

function addAlpha(hex: string, alpha: number): string {
	const rgb = hexToRgb(hex);
	if (!rgb) return hex;
	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function applyTheme(vars: ThemeVars) {
	const root = document.documentElement;
	for (const [key, value] of Object.entries(vars)) {
		root.style.setProperty(key, value);
	}
}