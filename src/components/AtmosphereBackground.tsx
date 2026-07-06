import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {deriveScenePalette} from '../color-utils';

// Generative stand-in "shot" for scenes with no real photo/video asset yet
// (see .env.example — no image/stock API keys configured). A single flat or
// even gradient-filled rectangle behind text reads as a slide background no
// matter how it's animated; this instead layers a few soft, blurred,
// independently-drifting light sources at different depths (parallax) over
// a vertical sky/horizon base, so it reads more like an out-of-focus
// establishing shot — depth and atmosphere — than a fill color. Everything
// is derived procedurally from the one authored hex, no image asset needed.
export const AtmosphereBackground: React.FC<{baseHex: string}> = ({baseHex}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const {sky, horizon, glowWarm, glowCool} = deriveScenePalette(baseHex);

	// A slow overall progress used to drift each light source at its own
	// rate, so the layers separate visually instead of moving in lockstep.
	const t = interpolate(frame, [0, Math.max(durationInFrames - 1, 1)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const farX = interpolate(t, [0, 1], [18, 34]);
	const farY = interpolate(t, [0, 1], [22, 30]);
	const nearX = interpolate(t, [0, 1], [78, 58]);
	const nearY = interpolate(t, [0, 1], [66, 82]);
	const driftX = interpolate(t, [0, 1], [48, 62]);
	const driftY = interpolate(t, [0, 1], [88, 74]);

	return (
		<AbsoluteFill style={{overflow: 'hidden', backgroundColor: sky}}>
			{/* Base vertical falloff: darker "sky" up top, lifted "horizon" glow low */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(to bottom, ${sky} 0%, ${baseHex} 55%, ${horizon} 100%)`,
				}}
			/>
			{/* Far, large, slow-drifting haze — reads as depth/atmosphere */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(38% 34% at ${farX}% ${farY}%, ${glowCool}66, transparent 70%)`,
					filter: 'blur(2px)',
				}}
			/>
			{/* Near, warmer light source — the implied "sun"/key light */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(30% 26% at ${nearX}% ${nearY}%, ${glowWarm}59, transparent 72%)`,
				}}
			/>
			{/* A third, smaller drifting mote for parallax separation */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(16% 14% at ${driftX}% ${driftY}%, ${glowWarm}40, transparent 75%)`,
					filter: 'blur(1px)',
				}}
			/>
		</AbsoluteFill>
	);
};
