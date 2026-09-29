import type { Segment } from '../podcast/types.js';

const labels = { host: 'HOST', cohost: 'CO-HOST' } as const;

/**
 * Renders segments as a labelled plain-text transcript.
 * @param title - Podcast title.
 * @param segments - Dialogue turns in order.
 * @returns Transcript text with one labelled block per turn.
 */
export const formatTranscript = (title: string, segments: readonly Segment[]): string =>
  [title, '', ...segments.map((s) => `${labels[s.speaker]}: ${s.text.trim()}\n`)].join('\n');
