import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import type {Storyboard} from '../storyboard';
import type {SceneTiming} from '../load-storyboard';
import {SceneRenderer} from '../components/SceneRenderer';
import {ProgressBar} from '../components/ProgressBar';
import {BackgroundMusic} from '../components/BackgroundMusic';

export type ShortFormProps = {
	slug: string;
	storyboard?: Storyboard;
	timings?: SceneTiming[];
};

const TRANSITION_FRAMES = 10;

// Vertical (9:16) template for TikTok / Reels / Shorts: fast cuts, a top
// progress bar, and punchy full-bleed captions. Fed entirely by a storyboard
// JSON — see public/content/<slug>/storyboard.json.
export const ShortForm: React.FC<ShortFormProps> = ({storyboard, timings}) => {
	if (!storyboard || !timings) {
		return null;
	}

	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<TransitionSeries>
				{storyboard.scenes.map((scene, i) => (
					<React.Fragment key={scene.id}>
						{i > 0 ? (
							<TransitionSeries.Transition
								presentation={fade()}
								timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
							/>
						) : null}
						<TransitionSeries.Sequence durationInFrames={timings[i].durationInFrames}>
							<SceneRenderer
								scene={scene}
								brand={storyboard.meta.brand}
								transitionFrames={TRANSITION_FRAMES}
								isFirstScene={i === 0}
							/>
						</TransitionSeries.Sequence>
					</React.Fragment>
				))}
			</TransitionSeries>
			<ProgressBar accentColor={storyboard.meta.brand.accentColor} />
			<BackgroundMusic music={storyboard.meta.music} />
		</AbsoluteFill>
	);
};
