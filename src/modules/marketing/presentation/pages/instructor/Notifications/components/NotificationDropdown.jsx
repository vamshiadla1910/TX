/**
 * NotificationDropdown Component
 * Renders the notification panel containing the header, tab filters,
 * list of notifications, and footer actions.
 */

import { Bell, CheckCheck, X } from "lucide-react";
import { ActionButton, IconButton } from "../../common/ActionButton.jsx";
import { CountBadge } from "../../common/CountBadge.jsx";
import { NotificationItem } from "./NotificationItem";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { NOTIFICATION_FILTERS } from "../data/notificationConfig.js";

export function NotificationDropdown({
  isOpen,
  onClose,
  filter = NOTIFICATION_FILTERS.ALL,
  onFilterChange,
  filteredNotifications = [],
  unreadCount = 0,
  totalCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onItemClick
}) {
  if (!isOpen) return null;

  const handleResetFilter = () => {
    if (typeof onFilterChange === "function") {
      onFilterChange(NOTIFICATION_FILTERS.ALL);
    }
  };

  return (
    <div
      className="notif-dropdown"
      role="dialog"
      aria-label="Notifications Panel"
      aria-modal="false"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Dropdown Header */}
      <div className="notif-header">
        <div className="notif-header-title-group">
          <div className="notif-header-icon-badge">
            <Bell size={16} />
          </div>
          <div>
            <h3 className="notif-title">Notifications</h3>
            <span className="notif-subtitle">
              {unreadCount > 0
                ? `${unreadCount} unread update${unreadCount > 1 ? "s" : ""}`
                : "All caught up"}
            </span>
          </div>
        </div>

        <div className="notif-header-actions">
          {unreadCount > 0 && (
            <ActionButton
              icon={CheckCheck}
              variant="ghost"
              size="sm"
              className="notif-header-action-btn"
              onClick={onMarkAllAsRead}
              tooltip="Mark all notifications as read"
              aria-label="Mark all as read"
            >
              Mark all read
            </ActionButton>
          )}

          <IconButton
            icon={X}
            size="sm"
            variant="neutral"
            className="notif-close-btn"
            onClick={onClose}
            tooltip="Close notifications"
            ariaLabel="Close notifications panel"
          />
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="notif-filters-bar" role="tablist" aria-label="Notification Filters">
        <button
          type="button"
          role="tab"
          aria-selected={filter === NOTIFICATION_FILTERS.ALL}
          className={`notif-filter-tab ${
            filter === NOTIFICATION_FILTERS.ALL ? "is-active" : ""
          }`}
          onClick={() => onFilterChange && onFilterChange(NOTIFICATION_FILTERS.ALL)}
        >
          <span>All</span>
          <CountBadge
            count={totalCount}
            max={99}
            hideZero={false}
            tone="neutral"
            variant="inline"
            className="notif-filter-count-badge"
          />
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={filter === NOTIFICATION_FILTERS.UNREAD}
          className={`notif-filter-tab ${
            filter === NOTIFICATION_FILTERS.UNREAD ? "is-active" : ""
          }`}
          onClick={() => onFilterChange && onFilterChange(NOTIFICATION_FILTERS.UNREAD)}
        >
          <span>Unread</span>
          <CountBadge
            count={unreadCount}
            max={99}
            hideZero={true}
            tone="danger"
            variant="inline"
            className="notif-filter-count-badge"
          />
        </button>
      </div>

      {/* Notification List Container */}
      <div className="notif-list-container">
        {filteredNotifications && filteredNotifications.length > 0 ? (
          <div className="notif-list" role="feed" aria-label="Notifications list">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={onItemClick}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <NotificationEmptyState
            filter={filter}
            totalCount={totalCount}
            onResetFilter={handleResetFilter}
          />
        )}
      </div>

      {/* Dropdown Footer */}
      <div className="notif-footer">
        {unreadCount > 0 && (
          <ActionButton
            icon={CheckCheck}
            variant="outline-blue"
            size="sm"
            onClick={onMarkAllAsRead}
            tooltip="Mark all notifications as read"
          >
            Mark all read
          </ActionButton>
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;
