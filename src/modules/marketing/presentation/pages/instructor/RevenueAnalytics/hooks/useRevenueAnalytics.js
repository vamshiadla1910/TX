/**
 * Custom Hook: useRevenueAnalytics
 * Manages date-range presets, custom date inputs, loading skeletons,
 * error recovery, and instructor-scoped analytics fetching.
 */

import { useState, useEffect, useCallback } from "react";
import { revenueAnalyticsService } from "../services/revenueAnalyticsService.js";
import { formatDateKey, shiftDateKey } from "../utils/revenueFormatters.js";

export function useRevenueAnalytics({
  instructorProfile,
  courses = [],
  batches = [],
  transactions
}) {
  const todayStr = formatDateKey(new Date());
  const defaultCustomStart = shiftDateKey(todayStr, -29);

  const [preset, setPreset] = useState("30d");
  const [customStart, setCustomStart] = useState(defaultCustomStart);
  const [customEnd, setCustomEnd] = useState(todayStr);
  const [refreshTick, setRefreshTick] = useState(0);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const timerId = setTimeout(async () => {
      if (preset === "custom" && (!customStart || !customEnd)) {
        if (active) {
          setError("Please select both a start date and an end date.");
          setLoading(false);
        }
        return;
      }

      if (preset === "custom" && customStart > customEnd) {
        if (active) {
          setError("Start date cannot be later than end date.");
          setLoading(false);
        }
        return;
      }

      try {
        const result = await revenueAnalyticsService.getRevenueAnalytics({
          instructorProfile,
          filter: { preset, customStart, customEnd },
          courses,
          batches,
          transactions
        });

        if (active) {
          setAnalytics(result);
          setError(null);
        }
      } catch (err) {
        if (active) {
          console.error("[useRevenueAnalytics] Failed to compute revenue analytics:", err);
          setError(err.message || "Unable to load revenue analytics.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 120);

    return () => {
      active = false;
      clearTimeout(timerId);
    };
  }, [preset, customStart, customEnd, refreshTick, instructorProfile, courses, batches, transactions]);

  const handlePresetChange = useCallback((nextPreset) => {
    setError(null);
    setLoading(true);
    setPreset(nextPreset);
  }, []);

  const handleCustomRangeChange = useCallback((nextStart, nextEnd) => {
    setError(null);
    setLoading(true);
    setCustomStart(nextStart);
    setCustomEnd(nextEnd);
    setPreset("custom");
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setRefreshTick((t) => t + 1);
  }, []);

  return {
    preset,
    customStart,
    customEnd,
    analytics,
    loading,
    error,
    todayStr,
    setPreset: handlePresetChange,
    setCustomRange: handleCustomRangeChange,
    retry: handleRetry
  };
}

export default useRevenueAnalytics;
