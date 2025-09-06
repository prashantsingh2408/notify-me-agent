/**
 * Filter labs by search value (case-insensitive, matches name or description)
 * @param {Array} labs - Array of lab objects
 * @param {string} searchValue - The search string
 * @returns {Array} - Filtered labs
 */
export function filterLabsBySearch(labs, searchValue) {
  if (!searchValue) return labs;
  const value = searchValue.toLowerCase();
  return labs.filter(lab =>
    lab.name.toLowerCase().includes(value) ||
    (lab.description && lab.description.toLowerCase().includes(value))
  );
} 