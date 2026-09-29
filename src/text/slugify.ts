/**
 * Converts a title into a lowercase, dash-separated file name stem.
 * @param title - Human-readable title.
 * @returns A filesystem-safe slug, or `podcast` when nothing usable remains.
 */
export const slugify = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'podcast';
