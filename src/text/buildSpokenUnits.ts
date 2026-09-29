import type { Replacement, Segment, SpokenUnit } from '../podcast/types.js';
import { applyReplacements } from './applyReplacements.js';
import { splitParagraphs } from './splitParagraphs.js';

/**
 * Converts dialogue segments into per-paragraph units with replacements applied.
 * @param segments - Dialogue turns in order.
 * @param replacements - Spoken-text substitutions.
 * @param caseSensitive - Whether replacements match case-sensitively.
 * @returns One unit per paragraph, flagged where a new section begins.
 */
export const buildSpokenUnits = (
  segments: readonly Segment[],
  replacements: readonly Replacement[],
  caseSensitive: boolean,
): SpokenUnit[] =>
  segments.flatMap((segment) =>
    splitParagraphs(segment.text).map((paragraph, index) => ({
      speaker: segment.speaker,
      spoken: applyReplacements(paragraph, replacements, caseSensitive),
      startsSection: index === 0 && segment.newSection === true,
    })),
  );
