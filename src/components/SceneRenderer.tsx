import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Scene, Storyboard} from '../storyboard';
import {KenBurnsMedia} from './KenBurnsMedia';
import {TitleCard} from './TitleCard';
import {Captions} from './Captions';
import {SceneAudio} from './SceneAudio';

// Renders a single scene: background media, optional title/heading overlay,
// captions, and its voiceover audio. Shared by ShortForm and LongForm so
// both platforms stay visually consistent for the same storyboard schema.
export const SceneRenderer: React.FC<{scene: Scene; brand: Storyboard['meta']['brand']}> = ({
	scene,
	brand,
}) => {
	return (
		<AbsoluteFill>
			<KenBurnsMedia background={scene.background} />
			<TitleCard scene={scene} brandColor={brand.secondaryColor} accentColor={brand.accentColor} />
			<Captions scene={scene} brandColor={brand.primaryColor} />
			<SceneAudio scene={scene} />
		</AbsoluteFill>
	);
};
