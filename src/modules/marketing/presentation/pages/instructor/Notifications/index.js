/**
 * Notifications Module Public API
 * Exposes components, hooks, services, and configurations.
 */

import { NotificationBell } from "./components/NotificationBell.jsx";

export { NotificationBell };
export { NotificationDropdown } from "./components/NotificationDropdown.jsx";
export { NotificationItem } from "./components/NotificationItem.jsx";
export { NotificationEmptyState } from "./components/NotificationEmptyState.jsx";
export { useNotifications } from "./hooks/useNotifications.js";
export { notificationService } from "./services/notificationService.js";
export * from "./data/notificationConfig.js";

export default NotificationBell;
