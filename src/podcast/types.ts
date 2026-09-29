/** Who speaks a segment. */
export type Speaker = 'host' | 'cohost';

/** One turn of dialogue; may contain several paragraphs separated by newlines. */
export interface Segment {
  readonly speaker: Speaker;
  readonly text: string;
  readonly newSection?: boolean;
}

/** A spoken-text substitution applied before synthesis. */
export interface Replacement {
  readonly from: string;
  readonly to: string;
}

/** A single paragraph to synthesize. */
export interface SpokenUnit {
  readonly speaker: Speaker;
  readonly spoken: string;
  readonly startsSection: boolean;
}

/** Output audio formats. */
export type AudioFormat = 'mp3' | 'wav' | 'both';
