/**
 * NotificationItem Component
 * Renders a single notification with category icon, title, description,
 * timestamp, unread indicator, and individual mark-as-read action.
 */

import { Check, Clock, ChevronRight } from "lucide-react";
import { CATEGORY_CONFIG, NOTIFICATION_CATEGORIES } from "../data/notificationConfig.js";

export function NotificationItem({ notification, onClick, onMarkAsRead }) {
  const { id, title, message, type, time, read, page, priority } = notification;

  const config =
    CATEGORY_CONFIG[type] || CATEGORY_CONFIG[NOTIFICATION_CATEGORIES.SYSTEM];
  const IconComponent = config.icon;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (typeof onClick === "function") {
        onClick(notification);
      }
    }
  };

  const handleMarkReadClick = (e) => {
    e.stopPropagation();
    if (typeof onMarkAsRead === "function") {
      onMarkAsRead(id, e);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`notif-item ${read ? "is-read" : "is-unread"} ${
        priority === "urgent" ? "is-urgent" : ""
      }`}
      onClick={() => onClick && onClick(notification)}
      onKeyDown={handleKeyDown}
      aria-label={`${read ? "Read" : "Unread"} notification: ${title}. ${
        page ? `Navigates to ${page}` : ""
      }`}
    >
      {/* Category Icon */}
      <div className={`notif-item-icon-wrap ${config.iconBgClass || ""}`}>
        <IconComponent size={18} className="notif-category-icon" />
      </div>

      {/* Main Content */}
      <div className="notif-item-content">
        <div className="notif-item-meta">
          <span className={`notif-category-pill ${config.badgeClass || ""}`}>
            {config.label}
          </span>
          <span className="notif-item-time" title={time}>
            <Clock size={11} className="notif-time-icon" />
            {time}
          </span>
        </div>

        <h5 className="notif-item-title">{title}</h5>

        {message && <p className="notif-item-message">{message}</p>}

        {page && (
          <div className="notif-item-footer">
            <span className="notif-item-destination">
              <span>View in {page}</span>
              <ChevronRight size={13} className="notif-dest-arrow" />
            </span>
          </div>
        )}
      </div>

      {/* Right Column: Unread Dot / Individual Read Button */}
      <div className="notif-item-actions" onClick={(e) => e.stopPropagation()}>
        {!read ? (
          <>
            <span
              className="notif-unread-dot"
              title="Unread notification"
              aria-hidden="true"
            />
            <button
              type="button"
              className="notif-mark-single-btn"
              onClick={handleMarkReadClick}
              title="Mark as read"
              aria-label="Mark as read"
            >
              <Check size={14} />
            </button>
          </>
        ) : (
          <span className="notif-read-status" title="Read" aria-hidden="true">
            <Check size={13} className="notif-read-check" />
          </span>
        )}
      </div>
    </div>
  );
}

export default NotificationItem;
