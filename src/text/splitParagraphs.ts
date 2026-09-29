/**
 * Splits text into non-empty paragraphs on line breaks.
 * @param text - Text to split.
 * @returns Trimmed paragraphs with internal whitespace collapsed.
 */
export const splitParagraphs = (text: string): string[] =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 0);
