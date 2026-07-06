import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';

const STAGGER_FRAMES = 6;

// Staggered numbered-checklist reveal, used when scene.kind is 'list'
// (e.g. "3 tips" videos). Renders scene.textOverlay?.heading above the list
// since it replaces TitleCard for this scene kind.
export const ListReveal: React.FC<{scene: Scene; brandColor: string; accentColor: string}> = ({
	scene,
	brandColor,
	accentColor,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	if (!scene.listItems || scene.listItems.length === 0) {
		return null;
	}

	const heading = scene.textOverlay?.heading;

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 10%'}}>
			{heading ? (
				<div
					style={{
						fontFamily: 'Inter, sans-serif',
						fontWeight: 800,
						fontSize: 56,
						color: 'white',
						textShadow: '0 2px 16px rgba(0,0,0,0.55)',
						borderLeft: `8px solid ${accentColor}`,
						paddingLeft: 20,
						marginBottom: 28,
					}}
				>
					{heading}
				</div>
			) : null}
			{scene.listItems.map((item, i) => {
				const entrance = spring({frame: frame - i * STAGGER_FRAMES, fps, config: {damping: 200}});
				const translateX = interpolate(entrance, [0, 1], [-50, 0]);
				const opacity = interpolate(entrance, [0, 1], [0, 1]);

				return (
					<div
						key={i}
						style={{
							display: 'flex',
							alignItems: 'center',
							transform: `translateX(${translateX}px)`,
							opacity,
							marginBottom: 20,
						}}
					>
						<div
							style={{
								width: 36,
								height: 36,
								borderRadius: '50%',
								backgroundColor: accentColor,
								color: 'white',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: 'Inter, sans-serif',
								fontWeight: 800,
								fontSize: 20,
								marginRight: 20,
								flexShrink: 0,
							}}
						>
							{i + 1}
						</div>
						<div
							style={{
								fontFamily: 'Inter, sans-serif',
								fontWeight: 600,
								fontSize: 38,
								color: brandColor,
								textShadow: '0 2px 12px rgba(0,0,0,0.55)',
								maxWidth: '85%',
							}}
						>
							{item}
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
