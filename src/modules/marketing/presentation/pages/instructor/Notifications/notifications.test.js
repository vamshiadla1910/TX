import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

import {
  generateSeedNotifications,
  CATEGORY_CONFIG,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_FILTERS
} from "./data/notificationConfig.js";

import { notificationService } from "./services/notificationService.js";

describe("Instructor Notifications Module", () => {
  beforeEach(async () => {
    await notificationService.resetToDefaults();
  });

  describe("Notification Configuration & Category Mapping", () => {
    it("defines all canonical categories and filters", () => {
      assert.strictEqual(NOTIFICATION_CATEGORIES.ATTENTION, "attention");
      assert.strictEqual(NOTIFICATION_CATEGORIES.ASSIGNMENT, "assignment");
      assert.strictEqual(NOTIFICATION_CATEGORIES.QUESTION, "question");
      assert.strictEqual(NOTIFICATION_CATEGORIES.SESSION, "session");
      assert.strictEqual(NOTIFICATION_CATEGORIES.REVIEW, "review");
      assert.strictEqual(NOTIFICATION_CATEGORIES.SYSTEM, "system");

      assert.strictEqual(NOTIFICATION_FILTERS.ALL, "all");
      assert.strictEqual(NOTIFICATION_FILTERS.UNREAD, "unread");
    });

    it("maps categories to valid navigation targets and styling configs", () => {
      assert.strictEqual(CATEGORY_CONFIG.attention.targetPage, "Dashboard");
      assert.strictEqual(CATEGORY_CONFIG.assignment.targetPage, "Assignments");
      assert.strictEqual(CATEGORY_CONFIG.question.targetPage, "Q&A Forum");
      assert.strictEqual(CATEGORY_CONFIG.session.targetPage, "Live Sessions");
      assert.strictEqual(CATEGORY_CONFIG.review.targetPage, "Reviews");

      Object.values(CATEGORY_CONFIG).forEach((config) => {
        assert.ok(config.label, "Config must have a label");
        assert.ok(config.targetPage, "Config must have a targetPage");
        assert.ok(config.color, "Config must have a color");
      });
    });

    it("generates structured seed notifications from canonical datasets", () => {
      const seed = generateSeedNotifications();
      assert.ok(Array.isArray(seed));
      assert.ok(seed.length > 0, "Seed notifications must not be empty");

      seed.forEach((item) => {
        assert.ok(item.id, "Notification must have an id");
        assert.ok(item.title, "Notification must have a title");
        assert.ok(item.message, "Notification must have a message");
        assert.ok(item.type, "Notification must have a type");
        assert.ok(item.page, "Notification must have a target page");
        assert.ok(typeof item.read === "boolean", "read must be a boolean");
      });
    });
  });

  describe("Notification Service Data Access Layer", () => {
    it("fetches notifications list asynchronously", async () => {
      const list = await notificationService.getNotifications();
      assert.ok(Array.isArray(list));
      assert.ok(list.length > 0);
    });

    it("marks an individual notification as read", async () => {
      const list = await notificationService.getNotifications();
      const firstUnread = list.find((item) => !item.read);
      assert.ok(firstUnread, "There should be at least one unread notification");

      const updated = await notificationService.markAsRead(firstUnread.id);
      const target = updated.find((item) => item.id === firstUnread.id);
      assert.strictEqual(target.read, true);

      // Verify unread count decreased
      const originalUnreadCount = list.filter((n) => !n.read).length;
      const updatedUnreadCount = updated.filter((n) => !n.read).length;
      assert.strictEqual(updatedUnreadCount, originalUnreadCount - 1);
    });

    it("marks all notifications as read in bulk", async () => {
      const updated = await notificationService.markAllAsRead();
      const unreadCount = updated.filter((item) => !item.read).length;
      assert.strictEqual(unreadCount, 0, "Unread count must be 0 after markAllAsRead");
    });

    it("deletes a single notification by id", async () => {
      const list = await notificationService.getNotifications();
      const targetId = list[0].id;

      const updated = await notificationService.deleteNotification(targetId);
      assert.strictEqual(updated.length, list.length - 1);
      assert.strictEqual(updated.some((item) => item.id === targetId), false);
    });

    it("clears all notifications and restores from reset", async () => {
      const cleared = await notificationService.clearAll();
      assert.strictEqual(cleared.length, 0);

      const restored = await notificationService.resetToDefaults();
      assert.ok(restored.length > 0);
    });
  });
});
