/**
 * Custom Hook: useNotifications
 * Manages notification state, unread counts, filtering, async mutations,
 * and dropdown interactions (click-outside & Escape key).
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { notificationService } from "../services/notificationService.js";
import { NOTIFICATION_FILTERS } from "../data/notificationConfig.js";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(NOTIFICATION_FILTERS.ALL);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);

  // Initial load
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("[useNotifications] Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Sync with cross-tab / window updates
  useEffect(() => {
    const handleUpdate = (event) => {
      if (event.detail && Array.isArray(event.detail.notifications)) {
        setNotifications(event.detail.notifications);
      }
    };

    window.addEventListener("instructor_notifications_updated", handleUpdate);
    return () => {
      window.removeEventListener("instructor_notifications_updated", handleUpdate);
    };
  }, []);

  // Compute unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  const totalCount = notifications.length;

  // Filtered notifications list
  const filteredNotifications = useMemo(() => {
    if (filter === NOTIFICATION_FILTERS.UNREAD) {
      return notifications.filter((item) => !item.read);
    }
    return notifications;
  }, [notifications, filter]);

  // Actions
  const markAsRead = useCallback(async (id, e) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    try {
      const updated = await notificationService.markAsRead(id);
      setNotifications(updated);
    } catch (err) {
      console.error("[useNotifications] Failed to mark as read:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const updated = await notificationService.markAllAsRead();
      setNotifications(updated);
    } catch (err) {
      console.error("[useNotifications] Failed to mark all as read:", err);
    }
  }, []);

  const deleteNotification = useCallback(async (id, e) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    try {
      const updated = await notificationService.deleteNotification(id);
      setNotifications(updated);
    } catch (err) {
      console.error("[useNotifications] Failed to delete notification:", err);
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      const updated = await notificationService.clearAll();
      setNotifications(updated);
    } catch (err) {
      console.error("[useNotifications] Failed to clear all:", err);
    }
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle clicking a notification item: marks as read, navigates, and closes dropdown
  const handleItemClick = useCallback(
    async (notification, onNavigate) => {
      if (!notification.read) {
        await markAsRead(notification.id);
      }
      closeDropdown();

      if (typeof onNavigate === "function" && notification.page) {
        onNavigate(notification.page);
      }
    },
    [markAsRead, closeDropdown]
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen, closeDropdown]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeDropdown]);

  return {
    notifications,
    filteredNotifications,
    loading,
    filter,
    setFilter,
    unreadCount,
    totalCount,
    isOpen,
    containerRef,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    handleItemClick,
    refresh: loadNotifications
  };
}

export default useNotifications;
