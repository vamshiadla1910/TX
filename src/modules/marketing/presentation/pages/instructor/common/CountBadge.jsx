/**
 * CountBadge Component
 * Refined pill/circular counter badge for Instructor topbar and sidebar navigation.
 * Automatically centers tabular numerals, caps overflow (`9+` / `99+`), and hides zeroes.
 */

import { formatBadgeCount } from "./badgeUtils.js";
import "./uiPrimitives.css";

export function CountBadge({
  count,
  max = 99,
  hideZero = true,
  tone = "danger",
  variant = "inline",
  title,
  ariaHidden = true,
  className = ""
}) {
  const displayValue = formatBadgeCount(count, { max, hideZero });
  if (!displayValue) return null;

  const isCompactSingle = displayValue.length === 1;
  const numericValue =
    typeof count === "number"
      ? count
      : typeof count === "string" && /^-?\d+(,\d{3})*$/.test(count.trim())
        ? Number.parseInt(count.trim().replace(/,/g, ""), 10)
        : null;
  const resolvedTitle =
    title ||
    (numericValue !== null && numericValue > max ? `${numericValue.toLocaleString("en-IN")}` : undefined);

  return (
    <span
      className={[
        "inst-count-badge",
        `inst-count-badge--${variant}`,
        `inst-count-badge--${tone}`,
        isCompactSingle ? "is-single-char" : "is-pill",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      title={resolvedTitle}
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {displayValue}
    </span>
  );
}

export default CountBadge;
