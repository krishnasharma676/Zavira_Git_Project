import slugify from 'slugify';

/**
 * Generates a URL-safe slug from a string.
 * Appends a timestamp suffix if the base slug already exists.
 */
export const generateSlug = (name: string): string => {
  return slugify(name, { lower: true, strict: true, trim: true });
};

/**
 * Generates a unique slug by appending a timestamp if the base slug is taken.
 */
export const generateUniqueSlug = (name: string, exists: boolean): string => {
  const base = generateSlug(name);
  return exists ? `${base}-${Date.now()}` : base;
};

/**
 * Simple slug generator without the slugify library (for brand-style names).
 */
export const simpleSlug = (name: string): string => {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};
