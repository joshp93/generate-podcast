import type { SpokenUnit } from './types.js';

/**
 * Chooses the silence between a paragraph and the one that follows it.
 * @param next - The following unit.
 * @param paragraphPause - Pause between paragraphs, in seconds.
 * @param sectionPause - Pause before a new section, in seconds.
 * @returns Pause length in seconds.
 */
export const pauseAfter = (next: SpokenUnit, paragraphPause: number, sectionPause: number): number =>
  next.startsSection ? sectionPause : paragraphPause;
