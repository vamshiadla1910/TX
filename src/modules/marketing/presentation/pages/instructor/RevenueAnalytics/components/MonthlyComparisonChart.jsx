/**
 * Chart 2: Monthly Revenue Comparison (Bar Chart)
 * Compares filtered monthly net revenue against each month's prior month baseline.
 */

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { createCartesianChartOptions } from "../utils/chartSetup.js";
import { formatINR } from "../utils/revenueFormatters.js";

export function MonthlyComparisonChart({ monthlyComparison }) {
  const chartData = useMemo(() => {
    if (!monthlyComparison) return { labels: [], datasets: [] };

    return {
      labels: monthlyComparison.labels,
      datasets: [
        {
          label: "Selected Period Net",
          data: monthlyComparison.currentSeries,
          backgroundColor: "#2563eb",
          hoverBackgroundColor: "#1d4ed8",
          borderRadius: 6,
          barPercentage: 0.72,
          categoryPercentage: 0.65
        },
        {
          label: "Prior Month Baseline",
          data: monthlyComparison.priorBaselineSeries,
          backgroundColor: "#bfdbfe",
          hoverBackgroundColor: "#93c5fd",
          borderRadius: 6,
          barPercentage: 0.72,
          categoryPercentage: 0.65
        }
      ]
    };
  }, [monthlyComparison]);

  const options = useMemo(
    () =>
      createCartesianChartOptions({
        tooltipCallbacks: {
          afterBody(items) {
            if (!items || items.length < 2) return [];
            const curr = items[0]?.parsed?.y || 0;
            const prev = items[1]?.parsed?.y || 0;
            const diff = curr - prev;
            const sign = diff >= 0 ? "+" : "";
            return [` Net Variance: ${sign}${formatINR(diff)}`];
          }
        }
      }),
    []
  );

  return (
    <article className="card inst-rev-chart-card">
      <div className="inst-rev-chart-head">
        <div>
          <span className="inst-rev-chart-eyebrow">PERIOD BENCHMARK</span>
          <h3 className="inst-rev-chart-title">Monthly Revenue Comparison</h3>
        </div>
        <div className="inst-rev-chart-stat">
          <span>Active Months</span>
          <strong>{monthlyComparison?.labels?.length || 0}</strong>
        </div>
      </div>

      <div className="inst-rev-canvas-wrap">
        <Bar data={chartData} options={options} />
      </div>
    </article>
  );
}

export default MonthlyComparisonChart;
