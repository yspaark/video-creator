import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Scene, Storyboard} from '../storyboard';
import {KenBurnsMedia} from './KenBurnsMedia';
import {TitleCard} from './TitleCard';
import {Captions} from './Captions';
import {SceneAudio} from './SceneAudio';
import {Vignette} from './Vignette';
import {FilmGrain} from './FilmGrain';
import {SceneMotif} from './SceneMotif';

// Renders a single scene: background media, optional title/heading overlay,
// captions, and its voiceover audio. Shared by ShortForm and LongForm so
// both platforms stay visually consistent for the same storyboard schema.
//
// `transitionFrames`/`isFirstScene` let text overlays clear the screen
// before the next scene's crossfade begins (and hold off entering until
// the previous one has finished dissolving in), so two scenes' text never
// double-exposes mid-transition — see TitleCard/Captions for the timing.
export const SceneRenderer: React.FC<{
	scene: Scene;
	brand: Storyboard['meta']['brand'];
	transitionFrames?: number;
	isFirstScene?: boolean;
}> = ({scene, brand, transitionFrames = 0, isFirstScene = true}) => {
	return (
		<AbsoluteFill>
			<KenBurnsMedia background={scene.background} />
			<Vignette />
			<SceneMotif scene={scene} transitionFrames={transitionFrames} isFirstScene={isFirstScene} />
			<TitleCard
				scene={scene}
				brandColor={brand.secondaryColor}
				accentColor={brand.accentColor}
				transitionFrames={transitionFrames}
				isFirstScene={isFirstScene}
			/>
			<Captions
				scene={scene}
				brandColor={brand.primaryColor}
				transitionFrames={transitionFrames}
				isFirstScene={isFirstScene}
			/>
			<FilmGrain />
			<SceneAudio scene={scene} />
		</AbsoluteFill>
	);
};
