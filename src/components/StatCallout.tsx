import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';

// Big animated number/stat callout, e.g. for "87% faster" beats. Layers on
// top of whatever overlay the scene's `kind` already renders.
export const StatCallout: React.FC<{scene: Scene; brandColor: string; accentColor: string}> = ({
	scene,
	brandColor,
	accentColor,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	if (!scene.stat) {
		return null;
	}
	const {value, prefix, suffix, label} = scene.stat;

	const pop = spring({frame, fps, config: {damping: 12, mass: 0.6, stiffness: 120}});
	const scale = interpolate(pop, [0, 1], [0.4, 1]);
	const opacity = interpolate(pop, [0, 1], [0, 1]);

	const labelEntrance = spring({frame: frame - 6, fps, config: {damping: 200}});
	const labelOpacity = interpolate(labelEntrance, [0, 1], [0, 1]);
	const labelY = interpolate(labelEntrance, [0, 1], [16, 0]);

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '10%'}}>
			<div style={{transform: `scale(${scale})`, opacity, display: 'flex', alignItems: 'baseline'}}>
				{prefix ? (
					<span
						style={{
							fontFamily: 'Inter, sans-serif',
							fontSize: 72,
							fontWeight: 800,
							color: brandColor,
							marginRight: 4,
						}}
					>
						{prefix}
					</span>
				) : null}
				<span
					style={{
						fontFamily: 'Inter, sans-serif',
						fontWeight: 900,
						fontSize: 168,
						lineHeight: 1,
						color: accentColor,
						textShadow: '0 8px 32px rgba(0,0,0,0.45)',
					}}
				>
					{value}
				</span>
				{suffix ? (
					<span
						style={{
							fontFamily: 'Inter, sans-serif',
							fontSize: 72,
							fontWeight: 800,
							color: brandColor,
							marginLeft: 4,
						}}
					>
						{suffix}
					</span>
				) : null}
			</div>
			{label ? (
				<div
					style={{
						transform: `translateY(${labelY}px)`,
						opacity: labelOpacity,
						marginTop: 16,
						fontFamily: 'Inter, sans-serif',
						fontWeight: 600,
						fontSize: 34,
						color: brandColor,
						textAlign: 'center',
						maxWidth: '70%',
					}}
				>
					{label}
				</div>
			) : null}
		</AbsoluteFill>
	);
};
