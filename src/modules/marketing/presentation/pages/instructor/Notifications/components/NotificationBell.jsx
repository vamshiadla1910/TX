/**
 * NotificationBell Component
 * Top-level header trigger for instructor notifications.
 * Renders the bell icon button with animated unread badge and dropdown panel.
 */

import { Bell } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationDropdown } from "./NotificationDropdown";
import { NOTIFICATION_FILTERS } from "../data/notificationConfig.js";
import { CountBadge } from "../../common/CountBadge.jsx";
import "../styles/notifications.css";

export function NotificationBell({ onNavigate, className = "" }) {
  const {
    notifications,
    filteredNotifications,
    filter,
    setFilter,
    unreadCount,
    totalCount,
    isOpen,
    containerRef,
    toggleDropdown,
    closeDropdown,
    markAsRead,
    markAllAsRead,
    handleItemClick
  } = useNotifications();

  const handleNotificationClick = (notification) => {
    handleItemClick(notification, onNavigate);
  };

  const handleViewAll = () => {
    if (filter === NOTIFICATION_FILTERS.UNREAD) {
      setFilter(NOTIFICATION_FILTERS.ALL);
    } else if (typeof onNavigate === "function") {
      onNavigate("Dashboard");
      closeDropdown();
    }
  };

  return (
    <div
      className={`notif-bell-container ${className}`}
      ref={containerRef}
    >
      {/* Bell Trigger Button */}
      <button
        type="button"
        className={`notif-bell-btn ${isOpen ? "is-active" : ""} ${
          unreadCount > 0 ? "has-unread" : ""
        }`}
        onClick={toggleDropdown}
        title={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
        aria-label={`Notifications: ${unreadCount} unread`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Bell size={19} strokeWidth={2} className="notif-bell-icon" aria-hidden="true" />

        {/* Unread Count Badge */}
        <CountBadge
          count={unreadCount}
          max={99}
          hideZero={true}
          tone="danger"
          variant="floating"
        />
      </button>

      {/* Notification Dropdown Panel */}
      <NotificationDropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        filter={filter}
        onFilterChange={setFilter}
        notifications={notifications}
        filteredNotifications={filteredNotifications}
        unreadCount={unreadCount}
        totalCount={totalCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onItemClick={handleNotificationClick}
        onViewAll={handleViewAll}
      />
    </div>
  );
}

export default NotificationBell;
