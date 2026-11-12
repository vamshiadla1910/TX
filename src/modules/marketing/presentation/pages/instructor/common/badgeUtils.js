/**
 * Pure badge formatting helpers for Instructor Dashboard navbar and sidebar counters.
 * Kept free of DOM/JSX so Node unit tests can import directly.
 */

/**
 * Format a numeric or string count for compact badge display.
 * - Hides zero/negative numeric counts when hideZero is true.
 * - Caps numbers above `max` to `${max}+` (e.g. `9+`, `99+`).
 * - Preserves non-numeric status strings like `"4.9★"`.
 *
 * @param {number|string|null|undefined|boolean} value
 * @param {Object} [options]
 * @param {number} [options.max=99]
 * @param {boolean} [options.hideZero=true]
 * @returns {string}
 */
export function formatBadgeCount(value, { max = 99, hideZero = true } = {}) {
  if (value === null || value === undefined || value === false || value === true) {
    return "";
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "";
    const normalized = Math.floor(value);
    if (normalized <= 0) {
      return hideZero ? "" : "0";
    }
    return normalized > max ? `${max}+` : String(normalized);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    if (/^-?\d+(,\d{3})*$/.test(trimmed)) {
      const parsed = Number.parseInt(trimmed.replace(/,/g, ""), 10);
      if (parsed <= 0) {
        return hideZero ? "" : "0";
      }
      return parsed > max ? `${max}+` : String(parsed);
    }

    return trimmed;
  }

  return "";
}
