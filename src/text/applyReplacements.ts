import type { Replacement } from '../podcast/types.js';

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isWordChar = (char: string): boolean => /[\p{L}\p{N}_]/u.test(char);

const buildPattern = (from: string, caseSensitive: boolean): RegExp => {
  const before = isWordChar(from[0]) ? '(?<![\\p{L}\\p{N}_])' : '';
  const after = isWordChar(from[from.length - 1]) ? '(?![\\p{L}\\p{N}_])' : '';
  return new RegExp(`${before}${escapeRegExp(from)}${after}`, caseSensitive ? 'gu' : 'giu');
};

/**
 * Applies literal replacements to text, longest match first, on whole-word boundaries.
 * @param text - Text to transform.
 * @param replacements - Substitutions to apply.
 * @param caseSensitive - Whether matching is case-sensitive.
 * @returns The transformed text.
 */
export const applyReplacements = (
  text: string,
  replacements: readonly Replacement[],
  caseSensitive = true,
): string =>
  [...replacements]
    .filter((r) => r.from.length > 0)
    .sort((a, b) => b.from.length - a.from.length)
    .reduce((acc, r) => acc.replace(buildPattern(r.from, caseSensitive), () => r.to), text);
