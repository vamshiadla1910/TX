/**
 * Revenue Analytics Service
 * Centralizes instructor revenue transaction access, authorization checks,
 * localStorage caching, and period-over-period aggregations.
 * Ready for drop-in backend REST integration via `_apiEndpoint`.
 */

import {
  initialRevenueTransactions,
  createSeedRevenueTransactions
} from "../../data/mockData.js";
import {
  resolveDateWindow,
  aggregateRevenueAnalytics,
  formatDateKey
} from "../utils/revenueFormatters.js";

const STORAGE_KEY = "tx_instructor_revenue_transactions_v1";

class RevenueAnalyticsService {
  constructor() {
    this._apiEndpoint = null; // Future REST API: "/api/v1/instructor/analytics/revenue"
  }

  /**
   * Verify the requester holds an authorized instructor identity.
   * Mirrors server-side controller authorization checks.
   * @param {Object} instructorIdentity
   * @returns {string} Validated instructorId
   */
  verifyInstructorAuthorization(instructorIdentity) {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const userRole = (localStorage.getItem("userRole") || "").trim().toLowerCase();
      if (isLoggedIn === "true" && userRole && userRole !== "instructor") {
        throw new Error("Forbidden: Instructor portal authorization is required to view revenue analytics.");
      }
    }

    const instructorId =
      instructorIdentity?.id ||
      (typeof localStorage !== "undefined" ? localStorage.getItem("instructorId") : null);

    if (!instructorId || typeof instructorId !== "string") {
      throw new Error("Unauthorized: Valid instructor identity missing.");
    }

    return instructorId;
  }

  /**
   * Read persisted transactions from localStorage or seed fresh records.
   * Re-seeds cleanly if persisted data is empty or stale beyond 30 days.
   * @param {Array<Object>} [fallbackTransactions]
   * @returns {Array<Object>}
   */
  getTransactions(fallbackTransactions) {
    if (Array.isArray(fallbackTransactions) && fallbackTransactions.length > 0) {
      return fallbackTransactions;
    }

    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
        const seeded = createSeedRevenueTransactions(new Date());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        return seeded;
      }
    } catch (err) {
      console.warn("[RevenueAnalyticsService] Storage read warning:", err);
    }

    return initialRevenueTransactions;
  }

  /**
   * Record a new enrollment payment transaction into persistent storage.
   * Enables real-time dashboard updates when enrollments occur.
   * @param {Object} tx
   * @returns {Array<Object>}
   */
  recordTransaction(tx) {
    if (!tx || !tx.instructorId || !tx.courseId) {
      throw new Error("Transaction requires instructorId and courseId.");
    }
    const current = this.getTransactions();
    const enriched = {
      id: tx.id || `txn-inst-${Date.now()}`,
      currency: "INR",
      status: tx.status || "paid",
      paidAt: tx.paidAt || new Date().toISOString(),
      paidDate: tx.paidDate || formatDateKey(tx.paidAt || new Date()),
      ...tx
    };
    const updated = [enriched, ...current];
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("[RevenueAnalyticsService] Storage write warning:", err);
    }
    return updated;
  }

  /**
   * Clear stored seed cache (helpful for tests or resetting mock data).
   */
  clearCache() {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn("[RevenueAnalyticsService] Storage clear warning:", err);
    }
  }

  /**
   * Fetch and compute complete instructor revenue analytics for the selected date filter.
   * @param {Object} params
   * @param {Object} params.instructorProfile
   * @param {Object} params.filter - { preset, customStart, customEnd }
   * @param {Array<Object>} [params.courses]
   * @param {Array<Object>} [params.batches]
   * @param {Array<Object>} [params.transactions]
   * @param {Date|string} [params.referenceDate]
   * @returns {Promise<Object>}
   */
  async getRevenueAnalytics({
    instructorProfile,
    filter = { preset: "30d" },
    courses = [],
    batches = [],
    transactions,
    referenceDate = new Date()
  }) {
    const instructorId = this.verifyInstructorAuthorization(instructorProfile);

    const dateWindow = resolveDateWindow(filter, referenceDate);
    if (!dateWindow.isValid) {
      throw new Error(dateWindow.error || "Invalid date filter selected.");
    }

    // Future REST API contract:
    // if (this._apiEndpoint) {
    //   const query = new URLSearchParams({
    //     range: filter.preset,
    //     startDate: dateWindow.startDateStr,
    //     endDate: dateWindow.endDateStr
    //   });
    //   const res = await fetch(`${this._apiEndpoint}?${query}`, { credentials: "include" });
    //   if (!res.ok) throw new Error(`Revenue analytics request failed (${res.status})`);
    //   return res.json();
    // }

    const rawTransactions = this.getTransactions(transactions);

    return aggregateRevenueAnalytics({
      transactions: rawTransactions,
      instructorId,
      window: dateWindow,
      courses,
      batches
    });
  }
}

export const revenueAnalyticsService = new RevenueAnalyticsService();
export default revenueAnalyticsService;
