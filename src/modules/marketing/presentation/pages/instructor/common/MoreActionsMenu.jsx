/**
 * MoreActionsMenu Component
 * Category C: Compact popover dropdown triggered by MoreHorizontal icon button.
 * Groups secondary actions cleanly without crowding cards or rows.
 */

import { useState, useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import { IconButton } from "./ActionButton.jsx";
import "./uiPrimitives.css";

export function MoreActionsMenu({
  items = [],
  tooltip = "More Actions",
  ariaLabel = "More Actions",
  size = "md",
  align = "right",
  disabled = false,
  className = ""
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const visibleItems = items.filter(Boolean);
  if (visibleItems.length === 0) return null;

  return (
    <div
      ref={wrapRef}
      className={`inst-more-menu-wrap ${open ? "is-open" : ""} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton
        icon={MoreHorizontal}
        variant={open ? "edit" : "neutral"}
        size={size}
        tooltip={tooltip}
        ariaLabel={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div
          className={`inst-more-menu-popover inst-more-menu-popover--${align}`}
          role="menu"
          aria-label={ariaLabel}
        >
          {visibleItems.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <div key={item.id || item.label || index}>
                {item.dividerBefore && <div className="inst-more-menu-divider" role="separator" />}
                <button
                  type="button"
                  role="menuitem"
                  className={`inst-more-menu-item inst-more-menu-item--${item.tone || "default"}`}
                  disabled={item.disabled}
                  title={item.tooltip || item.label}
                  onClick={() => {
                    setOpen(false);
                    if (typeof item.onClick === "function") {
                      item.onClick();
                    }
                  }}
                >
                  {ItemIcon && <ItemIcon size={14} strokeWidth={2} aria-hidden="true" />}
                  <span>{item.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MoreActionsMenu;
