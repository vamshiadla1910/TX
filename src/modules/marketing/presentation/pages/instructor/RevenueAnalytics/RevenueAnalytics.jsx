/**
 * RevenueAnalytics Page Orchestrator
 * Renders instructor-scoped financial KPIs, interactive Chart.js revenue visualizations,
 * date-range filtering, loading skeletons, empty states, and retryable error recovery.
 */

import { ShieldCheck } from "lucide-react";
import { useRevenueAnalytics } from "./hooks/useRevenueAnalytics.js";
import { DateRangeFilterBar } from "./components/DateRangeFilterBar.jsx";
import { RevenueKPICards } from "./components/RevenueKPICards.jsx";
import { RevenueOverTimeChart } from "./components/RevenueOverTimeChart.jsx";
import { MonthlyComparisonChart } from "./components/MonthlyComparisonChart.jsx";
import { RevenueByCourseChart } from "./components/RevenueByCourseChart.jsx";
import { RevenueByBatchChart } from "./components/RevenueByBatchChart.jsx";
import {
  RevenueLoadingSkeleton,
  RevenueErrorState,
  RevenueEmptyState
} from "./components/RevenueStates.jsx";
import "./styles/revenueAnalytics.css";

export function RevenueAnalytics({
  instructorProfile,
  courses = [],
  batches = [],
  transactions
}) {
  const {
    preset,
    customStart,
    customEnd,
    analytics,
    loading,
    error,
    todayStr,
    setPreset,
    setCustomRange,
    retry
  } = useRevenueAnalytics({
    instructorProfile,
    courses,
    batches,
    transactions
  });

  return (
    <div className="inst-rev-container">
      {/* Page Header */}
      <div className="inst-rev-header">
        <div>
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span>
            <span className="separator">/</span>
            <span>Instructor</span>
            <span className="separator">/</span>
            <strong className="current">Revenue Analytics</strong>
          </div>
          <h1 className="module-title">Revenue Analytics</h1>
          <p className="module-sub">
            Interactive enrollment revenue trends, monthly comparisons, and course &amp; cohort breakdowns.
          </p>
        </div>

        <div className="inst-rev-scope-badge" title="Scoped to authenticated instructor account">
          <ShieldCheck size={15} />
          <span>{instructorProfile?.name || "Instructor"} · Verified Ledger</span>
        </div>
      </div>

      {/* Date Range Filters */}
      <DateRangeFilterBar
        preset={preset}
        customStart={customStart}
        customEnd={customEnd}
        todayStr={todayStr}
        activeWindow={analytics?.window}
        loading={loading}
        onSelectPreset={setPreset}
        onChangeCustomRange={setCustomRange}
        onRefresh={retry}
      />

      {/* Loading, Error, Empty, or Active Data View */}
      {loading ? (
        <RevenueLoadingSkeleton />
      ) : error ? (
        <RevenueErrorState message={error} onRetry={retry} />
      ) : !analytics || analytics.isEmpty ? (
        <RevenueEmptyState
          windowRange={analytics?.window}
          onResetRange={() => setPreset("6m")}
        />
      ) : (
        <>
          <RevenueKPICards kpis={analytics.kpis} />

          <div className="inst-rev-charts-grid">
            <RevenueOverTimeChart overTime={analytics.charts.overTime} />
            <MonthlyComparisonChart monthlyComparison={analytics.charts.monthlyComparison} />
            <RevenueByCourseChart byCourse={analytics.charts.byCourse} />
            <RevenueByBatchChart byBatch={analytics.charts.byBatch} />
          </div>
        </>
      )}
    </div>
  );
}

export default RevenueAnalytics;
