import React, { useEffect, useRef } from 'react';
import { Bell, CheckCircle2, Clock3, ExternalLink, X, Check } from 'lucide-react';

export default function NotificationsPopover({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick,
  unreadCount
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="notifications-popover card" ref={panelRef}>
      <div className="notif-head">
        <div className="notif-title-area">
          <Bell size={15} />
          <strong>Institutional Notifications</strong>
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount} new</span>
          )}
        </div>
        <div className="notif-actions">
          {unreadCount > 0 && (
            <button
              type="button"
              className="text-action micro-btn"
              onClick={onMarkAllRead}
            >
              <Check size={12} />
              <span>Mark all read</span>
            </button>
          )}
          <button
            type="button"
            className="icon-btn micro-icon-btn"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">No notifications at this time.</div>
        ) : (
          notifications.map(n => (
            <button
              key={n.id}
              type="button"
              className={`notif-item ${n.unread ? 'unread' : ''}`}
              onClick={() => {
                onNotificationClick(n);
                onClose();
              }}
            >
              <div className="notif-dot-col">
                <span className={`notif-dot ${n.unread ? 'active' : ''}`} />
              </div>
              <div className="notif-body">
                <div className="notif-item-title">
                  <strong>{n.title}</strong>
                  <span className="notif-time">{n.time}</span>
                </div>
                <p className="notif-desc">{n.desc}</p>
                {n.page && (
                  <span className="notif-link-hint">
                    Go to {n.page} <ExternalLink size={10} />
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
