import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Claude Code's remote sandbox blocks the network egress Remotion would
// normally use to download its own headless Chrome build, but a
// Playwright-provisioned headless-shell already exists on disk — reuse it.
// REMOTION_BROWSER_EXECUTABLE overrides this if set (e.g. a different
// environment, or a local machine with its own Chrome).
const PLAYWRIGHT_HEADLESS_SHELL =
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

const browserExecutable =
	process.env.REMOTION_BROWSER_EXECUTABLE ??
	(existsSync(PLAYWRIGHT_HEADLESS_SHELL) ? PLAYWRIGHT_HEADLESS_SHELL : undefined);

if (browserExecutable) {
	Config.setBrowserExecutable(browserExecutable);
}
