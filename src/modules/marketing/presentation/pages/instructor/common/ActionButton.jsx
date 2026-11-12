/**
 * Reusable Instructor Dashboard Action & Icon Button Primitives
 * Category A (IconButton): Compact square icon-only actions with tooltip & accessible label.
 * Category B (ActionButton): Clear icon + text actions for primary/secondary workflows.
 */

import { Loader2 } from "lucide-react";
import "./uiPrimitives.css";

const ICON_SIZE_BY_PRESET = {
  xs: 13,
  sm: 14,
  md: 15,
  lg: 17
};

/**
 * Category A: Compact Icon-Only Button (Edit, Delete, View, Expand/Collapse, More Actions)
 */
export function IconButton({
  icon: Icon,
  tooltip,
  ariaLabel,
  variant = "neutral",
  size = "md",
  iconSize,
  type = "button",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  children,
  ...rest
}) {
  const resolvedIconSize = iconSize ?? ICON_SIZE_BY_PRESET[size] ?? 15;
  const resolvedLabel = ariaLabel || tooltip;

  return (
    <button
      type={type}
      className={[
        "inst-ui-icon-btn",
        `inst-ui-icon-btn--${size}`,
        `inst-ui-icon-btn--${variant}`,
        loading ? "is-loading" : "",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      title={tooltip}
      aria-label={resolvedLabel}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <Loader2 size={resolvedIconSize} className="inst-spin-icon" aria-hidden="true" />
      ) : Icon ? (
        <Icon size={resolvedIconSize} strokeWidth={2} aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}

/**
 * Category B: Icon + Text Action Button (+ Add Module, + Add Topic, Save Changes, Cancel)
 */
export function ActionButton({
  icon: Icon,
  trailingIcon: TrailingIcon,
  variant = "primary",
  size = "md",
  iconSize,
  type = "button",
  loading = false,
  loadingLabel,
  disabled = false,
  tooltip,
  className = "",
  onClick,
  children,
  ...rest
}) {
  const resolvedIconSize = iconSize ?? (size === "sm" ? 14 : 15);

  return (
    <button
      type={type}
      className={[
        "inst-ui-btn",
        `inst-ui-btn--${size}`,
        `inst-ui-btn--${variant}`,
        loading ? "is-loading" : "",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      title={tooltip}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 size={resolvedIconSize} className="inst-spin-icon" aria-hidden="true" />
          <span>{loadingLabel || children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={resolvedIconSize} strokeWidth={2} aria-hidden="true" />}
          {children && <span>{children}</span>}
          {TrailingIcon && (
            <TrailingIcon size={resolvedIconSize} strokeWidth={2} aria-hidden="true" />
          )}
        </>
      )}
    </button>
  );
}

export default ActionButton;
