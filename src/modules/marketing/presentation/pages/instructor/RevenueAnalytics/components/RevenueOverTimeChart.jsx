/**
 * Chart 1: Revenue Over Time (Line Chart)
 * Displays daily or monthly net & gross revenue trends with interactive tooltips.
 */

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { createCartesianChartOptions } from "../utils/chartSetup.js";
import { formatINR } from "../utils/revenueFormatters.js";

export function RevenueOverTimeChart({ overTime }) {
  const chartData = useMemo(() => {
    if (!overTime) return { labels: [], datasets: [] };

    return {
      labels: overTime.labels,
      datasets: [
        {
          label: "Net Revenue",
          data: overTime.netSeries,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          fill: true,
          tension: 0.32,
          borderWidth: 2.5,
          pointRadius: overTime.labels.length > 20 ? 2.5 : 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#2563eb",
          pointBorderWidth: 2
        },
        {
          label: "Gross Revenue",
          data: overTime.grossSeries,
          borderColor: "#60a5fa",
          backgroundColor: "transparent",
          borderDash: [5, 5],
          fill: false,
          tension: 0.32,
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
          pointBackgroundColor: "#60a5fa"
        }
      ]
    };
  }, [overTime]);

  const options = useMemo(
    () =>
      createCartesianChartOptions({
        tooltipCallbacks: {
          afterBody(items) {
            if (!items || !items.length || !overTime) return [];
            const idx = items[0].dataIndex;
            const count = overTime.txCounts[idx] || 0;
            return [` Enrollments: ${count}`];
          }
        }
      }),
    [overTime]
  );

  const periodTotal = useMemo(() => {
    if (!overTime) return 0;
    return overTime.netSeries.reduce((sum, val) => sum + val, 0);
  }, [overTime]);

  return (
    <article className="card inst-rev-chart-card">
      <div className="inst-rev-chart-head">
        <div>
          <span className="inst-rev-chart-eyebrow">
            {overTime?.granularity === "monthly" ? "MONTHLY TREND" : "DAILY TREND"}
          </span>
          <h3 className="inst-rev-chart-title">Revenue Over Time</h3>
        </div>
        <div className="inst-rev-chart-stat">
          <span>Period Net</span>
          <strong>{formatINR(periodTotal)}</strong>
        </div>
      </div>

      <div className="inst-rev-canvas-wrap">
        <Line data={chartData} options={options} />
      </div>
    </article>
  );
}

export default RevenueOverTimeChart;
