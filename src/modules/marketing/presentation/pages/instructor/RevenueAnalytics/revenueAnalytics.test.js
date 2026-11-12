import { describe, it } from "node:test";
import assert from "node:assert";

import {
  createSeedRevenueTransactions,
  initialInstructorCourses,
  initialBatches,
  instructorProfile
} from "../data/mockData.js";
import {
  formatINR,
  formatCompactINR,
  resolveDateWindow,
  computeGrowthDelta,
  aggregateRevenueAnalytics
} from "./utils/revenueFormatters.js";
import { revenueAnalyticsService } from "./services/revenueAnalyticsService.js";

describe("Instructor Revenue Analytics Module", () => {
  const fixedRefDate = new Date(2026, 10, 11, 10, 30, 0); // 11 Nov 2026
  const seedTransactions = createSeedRevenueTransactions(fixedRefDate);

  describe("INR Formatting & Growth Calculations", () => {
    it("formats INR values accurately for zero, positive, and negative amounts", () => {
      assert.strictEqual(formatINR(0), "₹0");
      assert.strictEqual(formatINR(284500), "₹2,84,500");
      assert.strictEqual(formatINR(-12500), "-₹12,500");
      assert.strictEqual(formatINR(NaN), "₹0");
      assert.strictEqual(formatCompactINR(150000), "₹1.5L");
      assert.strictEqual(formatCompactINR(42500), "₹42.5K");
    });

    it("computes positive, negative, zero-baseline, and flat growth deltas", () => {
      const up = computeGrowthDelta(1500, 1000);
      assert.strictEqual(up.percent, 50);
      assert.strictEqual(up.direction, "up");
      assert.strictEqual(up.tone, "positive");

      const down = computeGrowthDelta(800, 1000);
      assert.strictEqual(down.percent, -20);
      assert.strictEqual(down.direction, "down");
      assert.strictEqual(down.tone, "danger");

      const fromZero = computeGrowthDelta(500, 0);
      assert.strictEqual(fromZero.percent, 100);
      assert.strictEqual(fromZero.tone, "positive");

      const flat = computeGrowthDelta(0, 0);
      assert.strictEqual(flat.percent, 0);
      assert.strictEqual(flat.tone, "neutral");
    });
  });

  describe("Date Window Resolution & Validation", () => {
    it("resolves 7d, 14d, 30d, and 6m windows with equal-length comparison windows", () => {
      const w7 = resolveDateWindow({ preset: "7d" }, fixedRefDate);
      assert.strictEqual(w7.isValid, true);
      assert.strictEqual(w7.startDateStr, "2026-11-05");
      assert.strictEqual(w7.endDateStr, "2026-11-11");
      assert.strictEqual(w7.daysCount, 7);
      assert.strictEqual(w7.prevStartDateStr, "2026-10-29");
      assert.strictEqual(w7.prevEndDateStr, "2026-11-04");
      assert.strictEqual(w7.granularity, "daily");

      const w14 = resolveDateWindow({ preset: "14d" }, fixedRefDate);
      assert.strictEqual(w14.daysCount, 14);
      assert.strictEqual(w14.granularity, "daily");

      const w30 = resolveDateWindow({ preset: "30d" }, fixedRefDate);
      assert.strictEqual(w30.daysCount, 30);
      assert.strictEqual(w30.startDateStr, "2026-10-13");
      assert.strictEqual(w30.granularity, "daily");

      const w6m = resolveDateWindow({ preset: "6m" }, fixedRefDate);
      assert.strictEqual(w6m.isValid, true);
      assert.strictEqual(w6m.startDateStr, "2026-06-01");
      assert.strictEqual(w6m.endDateStr, "2026-11-11");
      assert.strictEqual(w6m.granularity, "monthly");
    });

    it("rejects reversed or incomplete custom date ranges", () => {
      const reversed = resolveDateWindow(
        { preset: "custom", customStart: "2026-11-10", customEnd: "2026-11-01" },
        fixedRefDate
      );
      assert.strictEqual(reversed.isValid, false);
      assert.match(reversed.error, /Start date must be on or before end date/);

      const missing = resolveDateWindow({ preset: "custom", customStart: "", customEnd: "2026-11-10" });
      assert.strictEqual(missing.isValid, false);
    });
  });

  describe("Dynamic Aggregation & Instructor Scoping", () => {
    it("excludes transactions belonging to other instructors and refunded records", () => {
      const window30 = resolveDateWindow({ preset: "30d" }, fixedRefDate);

      const analytics = aggregateRevenueAnalytics({
        transactions: seedTransactions,
        instructorId: instructorProfile.id,
        window: window30,
        courses: initialInstructorCourses,
        batches: initialBatches
      });

      // Paid records in 30d window for inst-ramana-1 must match exact sum and exclude txn-other-001 (inst-other-99) and refunded
      const expectedPaidIn30d = seedTransactions.filter(
        (tx) =>
          tx.instructorId === instructorProfile.id &&
          tx.status === "paid" &&
          tx.paidDate >= window30.startDateStr &&
          tx.paidDate <= window30.endDateStr
      );

      const expectedNet = expectedPaidIn30d.reduce((s, tx) => s + tx.netAmount, 0);

      assert.strictEqual(analytics.isEmpty, false);
      assert.strictEqual(analytics.kpis.totalTransactions.value, expectedPaidIn30d.length);
      assert.strictEqual(analytics.kpis.totalRevenue.value, expectedNet);
      assert.strictEqual(
        analytics.kpis.avgRevenuePerEnrollment.value,
        Math.round(expectedNet / expectedPaidIn30d.length)
      );
      assert.strictEqual(analytics.kpis.totalTransactions.refundedCount, 1);

      // Querying another instructor yields strictly only their transactions
      const otherAnalytics = aggregateRevenueAnalytics({
        transactions: seedTransactions,
        instructorId: "inst-other-99",
        window: window30,
        courses: initialInstructorCourses,
        batches: initialBatches
      });
      assert.strictEqual(otherAnalytics.kpis.totalTransactions.value, 1);
      assert.strictEqual(otherAnalytics.kpis.totalRevenue.value, 38250);
    });

    it("throws authorization error when instructorId is missing", () => {
      const window7 = resolveDateWindow({ preset: "7d" }, fixedRefDate);
      assert.throws(() => {
        aggregateRevenueAnalytics({
          transactions: seedTransactions,
          instructorId: "",
          window: window7
        });
      }, /Instructor identity is required/);
    });

    it("updates KPIs and all 4 charts dynamically across 7d, 30d, and 6m filters", () => {
      const win7 = resolveDateWindow({ preset: "7d" }, fixedRefDate);
      const win30 = resolveDateWindow({ preset: "30d" }, fixedRefDate);
      const win6m = resolveDateWindow({ preset: "6m" }, fixedRefDate);

      const res7 = aggregateRevenueAnalytics({
        transactions: seedTransactions,
        instructorId: instructorProfile.id,
        window: win7,
        courses: initialInstructorCourses,
        batches: initialBatches
      });

      const res30 = aggregateRevenueAnalytics({
        transactions: seedTransactions,
        instructorId: instructorProfile.id,
        window: win30,
        courses: initialInstructorCourses,
        batches: initialBatches
      });

      const res6m = aggregateRevenueAnalytics({
        transactions: seedTransactions,
        instructorId: instructorProfile.id,
        window: win6m,
        courses: initialInstructorCourses,
        batches: initialBatches
      });

      assert.ok(res7.kpis.totalRevenue.value < res30.kpis.totalRevenue.value);
      assert.ok(res30.kpis.totalRevenue.value < res6m.kpis.totalRevenue.value);

      assert.strictEqual(res7.charts.overTime.granularity, "daily");
      assert.strictEqual(res7.charts.overTime.labels.length, 7);

      assert.strictEqual(res6m.charts.overTime.granularity, "monthly");
      assert.strictEqual(res6m.charts.overTime.labels.length, 6);
      assert.strictEqual(res6m.charts.monthlyComparison.labels.length, 6);

      // Doughnut course percentages add up cleanly around 100%
      const totalCoursePct = res6m.charts.byCourse.reduce((sum, c) => sum + c.percentage, 0);
      assert.ok(totalCoursePct >= 99.5 && totalCoursePct <= 100.5);

      // Batch revenue matches total net revenue in the window
      const totalBatchNet = res6m.charts.byBatch.reduce((sum, b) => sum + b.netRevenue, 0);
      assert.strictEqual(totalBatchNet, res6m.kpis.totalRevenue.value);
    });

    it("handles empty date ranges gracefully with zero revenue and isEmpty=true", async () => {
      const result = await revenueAnalyticsService.getRevenueAnalytics({
        instructorProfile,
        filter: { preset: "custom", customStart: "2020-01-01", customEnd: "2020-01-15" },
        courses: initialInstructorCourses,
        batches: initialBatches,
        transactions: seedTransactions,
        referenceDate: fixedRefDate
      });

      assert.strictEqual(result.isEmpty, true);
      assert.strictEqual(result.kpis.totalRevenue.value, 0);
      assert.strictEqual(result.kpis.totalTransactions.value, 0);
      assert.strictEqual(result.kpis.avgRevenuePerEnrollment.value, 0);
      assert.deepStrictEqual(result.charts.byCourse, []);
      assert.deepStrictEqual(result.charts.byBatch, []);
    });
  });
});
