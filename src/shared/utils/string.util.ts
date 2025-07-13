/**
 * Replaces substrings in a string based on a mapping object.
 *
 * @param {string} str - The original string in which replacements will be made.
 * @param {Object} mapObj - An object where keys are the substrings to be replaced, and values are the corresponding replacement strings.
 *
 * @description
 * This function takes a string and a mapping object, and returns a new string where all occurrences of keys in the mapping object are replaced with their corresponding values.
 * It constructs a regular expression from the keys of the mapping object and uses it to perform case-insensitive replacements in the original string.
 */
export const replaceString = (str: string, mapObj: Record<string, string>) => {
  if (!str) {
    return str;
  }
  const re = new RegExp(Object.keys(mapObj).join('|'), 'gi');

  return str.replace(re, (matched: string) => mapObj[matched]);
};
