import { defaultOutputDir } from './paths.js';
import { defaultCohostVoice, defaultHostVoice } from './voices.js';

/** Defaults applied to `generate_podcast_audio` when the user supplies nothing. */
export const defaultSettings = {
  speed: 1.2,
  paragraphPauseSeconds: 1.2,
  sectionPauseSeconds: 2.4,
  hostVoice: defaultHostVoice,
  cohostVoice: defaultCohostVoice,
  format: 'mp3',
  outputDir: defaultOutputDir,
  caseSensitiveReplacements: true,
  keepParts: false,
} as const;

/** Approximate spoken words per minute at speed 1. */
export const wordsPerMinuteAtNormalSpeed = 150;

/** How far the finished audio may drift from the requested length, in minutes. */
export const lengthToleranceMinutes = 1;
