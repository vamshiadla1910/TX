/**
 * Loading Skeleton, Empty, and Error States for Revenue Analytics.
 */

import { AlertCircle, CalendarX2, RotateCcw } from "lucide-react";
import { ActionButton } from "../../common/ActionButton.jsx";

export function RevenueLoadingSkeleton() {
  return (
    <div className="inst-rev-skeleton-wrap" role="status" aria-label="Loading revenue analytics">
      <div className="inst-rev-kpi-grid">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="card inst-rev-skeleton-card inst-rev-kpi-skeleton">
            <div className="inst-rev-shimmer line-sm" />
            <div className="inst-rev-shimmer line-lg" />
            <div className="inst-rev-shimmer line-md" />
          </div>
        ))}
      </div>

      <div className="inst-rev-charts-grid">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="card inst-rev-skeleton-card inst-rev-chart-skeleton">
            <div className="inst-rev-shimmer line-md" />
            <div className="inst-rev-shimmer block-chart" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RevenueErrorState({ message, onRetry }) {
  return (
    <div className="card inst-rev-state-card error" role="alert">
      <div className="inst-rev-state-icon danger">
        <AlertCircle size={26} />
      </div>
      <h3>Unable to Load Revenue Analytics</h3>
      <p>{message || "An unexpected error occurred while aggregating transaction metrics."}</p>
      {onRetry && (
        <ActionButton icon={RotateCcw} variant="primary" size="md" onClick={onRetry}>
          Try Again
        </ActionButton>
      )}
    </div>
  );
}

export function RevenueEmptyState({ windowRange, onResetRange }) {
  return (
    <div className="card inst-rev-state-card empty">
      <div className="inst-rev-state-icon blue">
        <CalendarX2 size={28} />
      </div>
      <h3>No Revenue Transactions in Selected Range</h3>
      <p>
        {windowRange
          ? `No completed enrollments were recorded between ${windowRange.startDateStr} and ${windowRange.endDateStr}.`
          : "No paid enrollment transactions matched the selected filter."}
      </p>
      {onResetRange && (
        <ActionButton icon={RotateCcw} variant="outline-blue" size="md" onClick={onResetRange}>
          View Last 6 Months
        </ActionButton>
      )}
    </div>
  );
}
