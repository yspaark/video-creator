import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {staticFile} from 'remotion';
import {estimateDurationFromText, storyboardSchema, type Storyboard} from './storyboard';

export type SlugProps = {
	slug: string;
};

export const loadStoryboard = async (slug: string): Promise<Storyboard> => {
	const res = await fetch(staticFile(`content/${slug}/storyboard.json`));
	if (!res.ok) {
		throw new Error(
			`No storyboard found for slug "${slug}". Expected public/content/${slug}/storyboard.json`,
		);
	}
	return storyboardSchema.parse(await res.json());
};

export type SceneTiming = {
	startFrame: number;
	durationInFrames: number;
};

// Resolves each scene's duration: explicit override > real audio length > text estimate.
export const computeSceneTimings = async (
	storyboard: Storyboard,
): Promise<SceneTiming[]> => {
	const {fps} = storyboard.meta;
	const timings: SceneTiming[] = [];
	let cursor = 0;

	for (const scene of storyboard.scenes) {
		let seconds: number;
		if (scene.durationInSeconds) {
			seconds = scene.durationInSeconds;
		} else if (scene.voiceover?.src) {
			seconds = await getAudioDurationInSeconds(staticFile(scene.voiceover.src));
		} else if (scene.voiceover?.text) {
			seconds = estimateDurationFromText(scene.voiceover.text);
		} else {
			seconds = 3;
		}
		const durationInFrames = Math.round(seconds * fps);
		timings.push({startFrame: cursor, durationInFrames});
		cursor += durationInFrames;
	}

	return timings;
};

export const totalDurationInFrames = (timings: SceneTiming[]): number =>
	timings.reduce((sum, t) => sum + t.durationInFrames, 0);
