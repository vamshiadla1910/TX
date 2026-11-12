/**
 * Chart 4: Revenue by Batch (Bar Chart)
 * Compares net revenue generated across active, upcoming, and direct cohorts.
 */

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { CHART_PALETTE, createCartesianChartOptions } from "../utils/chartSetup.js";
import { formatINR } from "../utils/revenueFormatters.js";

export function RevenueByBatchChart({ byBatch = [] }) {
  const chartData = useMemo(() => {
    return {
      labels: byBatch.map((b) => b.code || b.name),
      datasets: [
        {
          label: "Batch Net Revenue",
          data: byBatch.map((b) => b.netRevenue),
          backgroundColor: byBatch.map((_, idx) => CHART_PALETTE[idx % CHART_PALETTE.length]),
          borderRadius: 7,
          barPercentage: 0.62,
          categoryPercentage: 0.72
        }
      ]
    };
  }, [byBatch]);

  const options = useMemo(
    () =>
      createCartesianChartOptions({
        tooltipCallbacks: {
          title(items) {
            if (!items || !items.length) return "";
            const batch = byBatch[items[0].dataIndex];
            return batch ? batch.name : "";
          },
          afterLabel(context) {
            const batch = byBatch[context.dataIndex];
            if (!batch) return [];
            const lines = [` Enrollments: ${batch.transactions}`];
            if (batch.courseName) lines.push(` Course: ${batch.courseName}`);
            return lines;
          }
        }
      }),
    [byBatch]
  );

  const topBatch = byBatch[0];

  return (
    <article className="card inst-rev-chart-card">
      <div className="inst-rev-chart-head">
        <div>
          <span className="inst-rev-chart-eyebrow">COHORT PERFORMANCE</span>
          <h3 className="inst-rev-chart-title">Revenue by Batch</h3>
        </div>
        {topBatch && (
          <div className="inst-rev-chart-stat">
            <span>Top Cohort ({topBatch.code})</span>
            <strong>{formatINR(topBatch.netRevenue)}</strong>
          </div>
        )}
      </div>

      <div className="inst-rev-canvas-wrap">
        <Bar data={chartData} options={options} />
      </div>
    </article>
  );
}

export default RevenueByBatchChart;
