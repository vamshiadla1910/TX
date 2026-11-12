/**
 * Notification Service
 * Encapsulates all data access and persistence logic for the Notifications module.
 * Provides a clean Promise-based interface ready for future REST API integration.
 */

import { generateSeedNotifications } from "../data/notificationConfig.js";

const STORAGE_KEY = "tx_instructor_notifications_v1";

class NotificationService {
  constructor() {
    this._memoryCache = null;
    this._apiEndpoint = null; // Future REST API base: e.g. "/api/v1/instructor/notifications"
  }

  /**
   * Internal helper to load cached or seed notifications
   */
  _loadInitialData() {
    try {
      if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn("[NotificationService] Failed to parse local notifications cache:", err);
    }

    const seed = generateSeedNotifications();
    this._persist(seed);
    return seed;
  }

  /**
   * Persist notifications to storage and notify subscribers
   */
  _persist(notifications) {
    this._memoryCache = notifications;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      }
    } catch (err) {
      console.warn("[NotificationService] LocalStorage quota or access error:", err);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("instructor_notifications_updated", {
          detail: { notifications }
        })
      );
    }
  }

  /**
   * Fetch all notifications for the current instructor.
   * Can be easily swapped with `fetch(this._apiEndpoint)` in future.
   * @returns {Promise<Array>}
   */
  async getNotifications() {
    // If backend API is configured in the future:
    if (this._apiEndpoint) {
      try {
        const res = await fetch(this._apiEndpoint);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        this._persist(data);
        return data;
      } catch (err) {
        console.error("[NotificationService] REST API fetch failed, falling back to cache:", err);
      }
    }

    if (!this._memoryCache) {
      this._memoryCache = this._loadInitialData();
    }

    // Return cloned array to avoid external mutations
    return Promise.resolve([...this._memoryCache]);
  }

  /**
   * Mark a single notification as read
   * @param {string} id
   * @returns {Promise<Array>}
   */
  async markAsRead(id) {
    const current = await this.getNotifications();
    const updated = current.map((item) =>
      item.id === id ? { ...item, read: true } : item
    );
    this._persist(updated);
    return updated;
  }

  /**
   * Mark all notifications as read
   * @returns {Promise<Array>}
   */
  async markAllAsRead() {
    const current = await this.getNotifications();
    const updated = current.map((item) => ({ ...item, read: true }));
    this._persist(updated);
    return updated;
  }

  /**
   * Delete or dismiss a single notification
   * @param {string} id
   * @returns {Promise<Array>}
   */
  async deleteNotification(id) {
    const current = await this.getNotifications();
    const updated = current.filter((item) => item.id !== id);
    this._persist(updated);
    return updated;
  }

  /**
   * Clear all notifications
   * @returns {Promise<Array>}
   */
  async clearAll() {
    this._persist([]);
    return [];
  }

  /**
   * Reset notifications back to canonical seeds
   * @returns {Promise<Array>}
   */
  async resetToDefaults() {
    const seed = generateSeedNotifications();
    this._persist(seed);
    return seed;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
