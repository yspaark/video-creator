import React from 'react';

// Darkens the frame edges so the center of interest holds attention — a
// standard color-grade touch that reads as "shot," not "slide."
export const Vignette: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			inset: 0,
			pointerEvents: 'none',
			background: 'radial-gradient(120% 120% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.4) 100%)',
		}}
	/>
);
