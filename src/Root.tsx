import React from 'react';
import {Composition} from 'remotion';
import {ShortForm} from './compositions/ShortForm';
import {LongForm} from './compositions/LongForm';
import {loadStoryboard, computeSceneTimings, totalDurationInFrames} from './load-storyboard';
import {ensureDisplayFontsLoaded} from './fonts';

// `slug` selects which public/content/<slug>/storyboard.json drives the
// render. calculateMetadata reads it and derives duration/fps/dimensions
// and per-scene timings so the compositions below never hardcode a project.
export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="ShortForm"
				component={ShortForm}
				fps={30}
				width={1080}
				height={1920}
				durationInFrames={150}
				defaultProps={{slug: 'demo-shorts'}}
				calculateMetadata={async ({props}) => {
					const [storyboard] = await Promise.all([
						loadStoryboard(props.slug),
						ensureDisplayFontsLoaded(),
					]);
					const timings = await computeSceneTimings(storyboard);
					return {
						durationInFrames: totalDurationInFrames(timings),
						fps: storyboard.meta.fps,
						width: storyboard.meta.width,
						height: storyboard.meta.height,
						props: {...props, storyboard, timings},
					};
				}}
			/>
			<Composition
				id="LongForm"
				component={LongForm}
				fps={30}
				width={1920}
				height={1080}
				durationInFrames={150}
				defaultProps={{slug: 'demo-longform'}}
				calculateMetadata={async ({props}) => {
					const [storyboard] = await Promise.all([
						loadStoryboard(props.slug),
						ensureDisplayFontsLoaded(),
					]);
					const timings = await computeSceneTimings(storyboard);
					return {
						durationInFrames: totalDurationInFrames(timings),
						fps: storyboard.meta.fps,
						width: storyboard.meta.width,
						height: storyboard.meta.height,
						props: {...props, storyboard, timings},
					};
				}}
			/>
		</>
	);
};
