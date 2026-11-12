/**
 * Chart 3: Revenue by Course (Doughnut Chart)
 * Displays net revenue contribution and percentage share per published course.
 */

import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  CHART_PALETTE,
  COMMON_FONT_FAMILY,
  SHARED_TOOLTIP_THEME
} from "../utils/chartSetup.js";
import { formatINR } from "../utils/revenueFormatters.js";

export function RevenueByCourseChart({ byCourse = [] }) {
  const totalCourseNet = useMemo(
    () => byCourse.reduce((sum, item) => sum + item.netRevenue, 0),
    [byCourse]
  );

  const chartData = useMemo(() => {
    return {
      labels: byCourse.map((item) => item.title),
      datasets: [
        {
          data: byCourse.map((item) => item.netRevenue),
          backgroundColor: byCourse.map((_, idx) => CHART_PALETTE[idx % CHART_PALETTE.length]),
          borderColor: "#ffffff",
          borderWidth: 2.5,
          hoverOffset: 6
        }
      ]
    };
  }, [byCourse]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "66%",
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          ...SHARED_TOOLTIP_THEME,
          callbacks: {
            label(context) {
              const row = byCourse[context.dataIndex];
              if (!row) return "";
              return ` ${row.code}: ${formatINR(row.netRevenue)} (${row.percentage}%)`;
            },
            afterLabel(context) {
              const row = byCourse[context.dataIndex];
              return row ? ` Enrollments: ${row.transactions}` : "";
            }
          }
        }
      }
    }),
    [byCourse]
  );

  return (
    <article className="card inst-rev-chart-card">
      <div className="inst-rev-chart-head">
        <div>
          <span className="inst-rev-chart-eyebrow">COURSE SHARE</span>
          <h3 className="inst-rev-chart-title">Revenue by Course</h3>
        </div>
        <div className="inst-rev-chart-stat">
          <span>Courses Active</span>
          <strong>{byCourse.length}</strong>
        </div>
      </div>

      <div className="inst-rev-doughnut-layout">
        <div className="inst-rev-doughnut-box">
          <Doughnut data={chartData} options={options} />
          <div className="inst-rev-doughnut-center" aria-hidden="true">
            <small>Total Net</small>
            <strong>{formatINR(totalCourseNet)}</strong>
          </div>
        </div>

        <ul className="inst-rev-course-legend" aria-label="Course Revenue Breakdown">
          {byCourse.map((item, idx) => (
            <li key={item.courseId} className="inst-rev-legend-row">
              <div className="inst-rev-legend-title">
                <span
                  className="inst-rev-legend-dot"
                  style={{
                    backgroundColor: CHART_PALETTE[idx % CHART_PALETTE.length],
                    fontFamily: COMMON_FONT_FAMILY
                  }}
                />
                <span className="inst-rev-legend-name" title={item.title}>
                  {item.title}
                </span>
              </div>
              <div className="inst-rev-legend-vals">
                <strong>{formatINR(item.netRevenue)}</strong>
                <span>{item.percentage}%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default RevenueByCourseChart;
