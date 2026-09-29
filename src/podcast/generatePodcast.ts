import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { concatSamples } from '../audio/concatSamples.js';
import { encodeMp3 } from '../audio/encodeMp3.js';
import { encodeWav } from '../audio/encodeWav.js';
import { makeSilence } from '../audio/makeSilence.js';
import { readWav } from '../audio/readWav.js';
import { synthesize } from '../audio/synthesize.js';
import { trimSilence } from '../audio/trimSilence.js';
import { ensureDependencies } from '../deps/ensureDependencies.js';
import { log } from '../deps/log.js';
import { buildSpokenUnits } from '../text/buildSpokenUnits.js';
import { formatTranscript } from '../text/formatTranscript.js';
import { slugify } from '../text/slugify.js';
import { pauseAfter } from './pauseAfter.js';
import type { AudioFormat, Replacement, Segment, SpokenUnit } from './types.js';

/** Inputs for {@link generatePodcast}. */
export interface GeneratePodcastOptions {
  readonly title: string;
  readonly segments: readonly Segment[];
  readonly replacements: readonly Replacement[];
  readonly caseSensitiveReplacements: boolean;
  readonly speed: number;
  readonly paragraphPauseSeconds: number;
  readonly sectionPauseSeconds: number;
  readonly hostVoice: string;
  readonly cohostVoice: string;
  readonly format: AudioFormat;
  readonly outputDir: string;
  readonly keepParts: boolean;
}

/** Files and stats produced by {@link generatePodcast}. */
export interface GeneratePodcastResult {
  readonly transcriptFile: string;
  readonly audioFiles: string[];
  readonly partsDir?: string;
  readonly durationSeconds: number;
  readonly paragraphs: number;
}

const leadInSeconds = 0.25;
const tailSeconds = 0.5;
const sentenceSilenceSeconds = 0.3;

/**
 * Generates a two-voice podcast from dialogue segments: writes the transcript, synthesizes each
 * paragraph with the speaker's voice, joins them with pauses and encodes the requested formats.
 * Downloads Piper and voices first when missing.
 * @param options - Content, voices, pacing and output settings.
 * @returns Paths of the written files with duration and paragraph count.
 * @throws When dependencies cannot be obtained, no speech is produced or synthesis fails.
 */
export const generatePodcast = async (options: GeneratePodcastOptions): Promise<GeneratePodcastResult> => {
  const units = buildSpokenUnits(options.segments, options.replacements, options.caseSensitiveReplacements);
  if (units.length === 0) throw new Error('No spoken text found in segments');
  const voiceFor = (unit: SpokenUnit): string => (unit.speaker === 'host' ? options.hostVoice : options.cohostVoice);
  const { piper, models } = await ensureDependencies([options.hostVoice, options.cohostVoice]);

  const slug = slugify(options.title);
  await mkdir(options.outputDir, { recursive: true });
  const scratch = await mkdtemp(path.join(os.tmpdir(), 'podcast-'));
  try {
    const clips = [];
    for (const [index, unit] of units.entries()) {
      const file = path.join(scratch, `${String(index + 1).padStart(3, '0')}-${unit.speaker}.wav`);
      await synthesize({
        piper,
        model: models[voiceFor(unit)],
        text: unit.spoken,
        outputFile: file,
        lengthScale: 1 / options.speed,
        sentenceSilence: sentenceSilenceSeconds,
      });
      const audio = await readWav(file);
      clips.push({ file, sampleRate: audio.sampleRate, samples: trimSilence(audio.samples, audio.sampleRate) });
      log(`Paragraph ${index + 1}/${units.length} synthesized`);
    }

    const sampleRate = clips[0].sampleRate;
    if (clips.some((clip) => clip.sampleRate !== sampleRate)) {
      throw new Error('Selected voices use different sample rates; pick voices with matching quality');
    }
    const parts = [
      makeSilence(leadInSeconds, sampleRate),
      ...clips.flatMap((clip, i) =>
        i < clips.length - 1
          ? [
              clip.samples,
              makeSilence(pauseAfter(units[i + 1], options.paragraphPauseSeconds, options.sectionPauseSeconds), sampleRate),
            ]
          : [clip.samples],
      ),
      makeSilence(tailSeconds, sampleRate),
    ];
    const audio = concatSamples(parts);

    const transcriptFile = path.join(options.outputDir, `${slug}-transcript.txt`);
    await writeFile(transcriptFile, formatTranscript(options.title, options.segments), 'utf8');

    const audioFiles: string[] = [];
    if (options.format !== 'wav') {
      const file = path.join(options.outputDir, `${slug}-podcast.mp3`);
      await writeFile(file, encodeMp3(audio, sampleRate));
      audioFiles.push(file);
    }
    if (options.format !== 'mp3') {
      const file = path.join(options.outputDir, `${slug}-podcast.wav`);
      await writeFile(file, encodeWav(audio, sampleRate));
      audioFiles.push(file);
    }

    let partsDir: string | undefined;
    if (options.keepParts) {
      partsDir = path.join(options.outputDir, `${slug}-parts`);
      await mkdir(partsDir, { recursive: true });
      await Promise.all(clips.map((clip) => copyFile(clip.file, path.join(partsDir!, path.basename(clip.file)))));
    }

    return {
      transcriptFile,
      audioFiles,
      partsDir,
      durationSeconds: Math.round((audio.length / sampleRate) * 10) / 10,
      paragraphs: units.length,
    };
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
};
