import React, {useId} from 'react';

// Procedural grain via an SVG turbulence filter — no asset to ship, cheap
// for Chromium to rasterize. Applied above every scene so placeholder color
// scenes and real footage alike pick up the same subtle texture instead of
// looking digitally flat.
export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.05}) => {
	const filterId = useId();
	return (
		<svg
			style={{
				position: 'absolute',
				inset: 0,
				width: '100%',
				height: '100%',
				opacity,
				pointerEvents: 'none',
				mixBlendMode: 'overlay',
			}}
		>
			<filter id={filterId}>
				<feTurbulence type="fractalNoise" baseFrequency={0.75} numOctaves={2} stitchTiles="stitch" />
				<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0" />
			</filter>
			<rect width="100%" height="100%" filter={`url(#${filterId})`} />
		</svg>
	);
};
