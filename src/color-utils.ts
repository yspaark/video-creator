// Small hex/HSL helpers used to derive gradient/glow shades from a single
// brand or scene color, so solid-color placeholder backgrounds don't have
// to be flat fills.

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

const hexToRgb = (hex: string): {r: number; g: number; b: number} => {
	const clean = hex.replace('#', '');
	const expanded = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
	const value = parseInt(expanded, 16);
	return {r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255};
};

const rgbToHsl = (r: number, g: number, b: number): {h: number; s: number; l: number} => {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	const d = max - min;
	if (d === 0) {
		return {h: 0, s: 0, l};
	}
	const s = d / (1 - Math.abs(2 * l - 1));
	let h: number;
	if (max === rn) {
		h = ((gn - bn) / d) % 6;
	} else if (max === gn) {
		h = (bn - rn) / d + 2;
	} else {
		h = (rn - gn) / d + 4;
	}
	h *= 60;
	if (h < 0) {
		h += 360;
	}
	return {h, s, l};
};

export const hslToHex = (h: number, s: number, l: number): string => {
	const hue = ((h % 360) + 360) % 360;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0;
	let g = 0;
	let b = 0;
	if (hue < 60) {
		r = c;
		g = x;
	} else if (hue < 120) {
		r = x;
		g = c;
	} else if (hue < 180) {
		g = c;
		b = x;
	} else if (hue < 240) {
		g = x;
		b = c;
	} else if (hue < 300) {
		r = x;
		b = c;
	} else {
		r = c;
		b = x;
	}
	const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const hexToHsl = (hex: string): {h: number; s: number; l: number} => {
	const {r, g, b} = hexToRgb(hex);
	return rgbToHsl(r, g, b);
};

// Derives a small palette of shades from one authored scene color for a
// layered, depth-suggesting placeholder background (used when no real
// footage/photo is available) instead of one flat/gradient fill: a darker
// "sky" shade for the top of frame, a lifted "horizon" shade near the
// bottom, and two off-hue glow colors for drifting soft light blobs that
// suggest atmosphere/haze rather than a slide background.
export const deriveScenePalette = (baseHex: string) => {
	const {h, s, l} = hexToHsl(baseHex);
	const sky = hslToHex(h - 6, clamp01(s + 0.02), clamp01(l - 0.16));
	const horizon = hslToHex(h + 8, clamp01(s + 0.1), clamp01(l + 0.14));
	const glowWarm = hslToHex(h + 28, clamp01(s + 0.2), clamp01(l + 0.28));
	const glowCool = hslToHex(h - 150, clamp01(s + 0.1), clamp01(l + 0.16));
	return {sky, horizon, glowWarm, glowCool};
};
