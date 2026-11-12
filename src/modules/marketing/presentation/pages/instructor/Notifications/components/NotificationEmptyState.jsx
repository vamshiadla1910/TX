/**
 * NotificationEmptyState Component
 * Displays a clean, enterprise-grade empty state when there are no notifications
 * or no unread notifications for the active filter.
 */

import { CheckCircle2, BellOff, Sparkles, RotateCcw } from "lucide-react";
import { NOTIFICATION_FILTERS } from "../data/notificationConfig.js";
import { ActionButton } from "../../common/ActionButton.jsx";

export function NotificationEmptyState({ filter, totalCount = 0, onResetFilter }) {
  const isUnreadFilter = filter === NOTIFICATION_FILTERS.UNREAD;

  return (
    <div className="notif-empty-state" role="status" aria-live="polite">
      <div className="notif-empty-icon-wrap">
        {isUnreadFilter ? (
          <CheckCircle2 size={32} className="notif-empty-icon text-emerald" />
        ) : (
          <BellOff size={32} className="notif-empty-icon text-muted" />
        )}
        <div className="notif-empty-sparkle">
          <Sparkles size={14} />
        </div>
      </div>

      <h4 className="notif-empty-title">
        {isUnreadFilter ? "You're all caught up!" : "No notifications yet"}
      </h4>

      <p className="notif-empty-desc">
        {isUnreadFilter
          ? "There are no unread notifications waiting for your attention."
          : "When students submit assignments, ask questions, or join sessions, alerts will appear here."}
      </p>

      {isUnreadFilter && totalCount > 0 && typeof onResetFilter === "function" && (
        <ActionButton
          icon={RotateCcw}
          variant="outline-blue"
          size="sm"
          onClick={onResetFilter}
        >
          View all {totalCount} notifications
        </ActionButton>
      )}
    </div>
  );
}

export default NotificationEmptyState;
