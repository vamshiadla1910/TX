import React, { useState, useMemo } from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export function EarningsChart({ earningsData = [] }) {
  const [activePoint, setActivePoint] = useState(null);

  // Guarantee strictly deduplicated months using stable identifier map
  const uniqueMonths = useMemo(() => {
    const seen = new Set();
    return earningsData.filter((item) => {
      if (seen.has(item.month)) return false;
      seen.add(item.month);
      return true;
    });
  }, [earningsData]);

  if (uniqueMonths.length === 0) {
    return (
      <div className="card earnings-chart-card empty-chart">
        <p>No earnings records found for this period.</p>
      </div>
    );
  }

  // Calculate SVG coordinates
  const maxNet = Math.max(...uniqueMonths.map((d) => d.net)) * 1.15;
  const minNet = Math.min(...uniqueMonths.map((d) => d.net)) * 0.85;
  const chartWidth = 560;
  const chartHeight = 190;
  const paddingX = 36;
  const paddingY = 24;

  const points = uniqueMonths.map((d, index) => {
    const x = paddingX + (index / (uniqueMonths.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((d.net - minNet) / (maxNet - minNet)) * (chartHeight - paddingY * 2);
    return { ...d, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  const latest = uniqueMonths[uniqueMonths.length - 1];

  return (
    <article className="card earnings-chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-main-title">Revenue Analytics</h3>
        </div>

        <div className="chart-summary-stat">
          <span className="stat-label">OCT NET</span>
          <strong className="stat-amount">₹{Number(latest.net).toLocaleString("en-IN")}</strong>
          <span className="stat-growth">
            <ArrowUpRight size={14} /> +18.5%
          </span>
        </div>
      </div>

      <div className="chart-metrics-row">
        <div className="chart-pill">
          <span>Gross:</span>
          <strong>₹{Number(latest.gross).toLocaleString("en-IN")}</strong>
        </div>
        <div className="chart-pill">
          <span>Fee (15%):</span>
          <strong>-₹{Number(latest.commission).toLocaleString("en-IN")}</strong>
        </div>
        <div className="chart-pill purple-highlight">
          <span>YTD Payout:</span>
          <strong>₹14,92,000</strong>
        </div>
      </div>

      <div className="svg-chart-container">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="earnings-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="purpleChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="purpleStrokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={(chartHeight - paddingY) / 2}
            x2={chartWidth - paddingX}
            y2={(chartHeight - paddingY) / 2}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />

          {/* Shaded Area */}
          <path d={areaPath} fill="url(#purpleChartGradient)" />

          {/* Primary Blue Trendline */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#purpleStrokeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#chartGlow)"
          />

          {/* Interactive Data Nodes */}
          {points.map((p, idx) => {
            const isHovered = activePoint && activePoint.month === p.month;
            return (
              <g key={p.month}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth={isHovered ? 3 : 2}
                  className="chart-circle"
                  onMouseEnter={() => setActivePoint(p)}
                  onMouseLeave={() => setActivePoint(null)}
                />
                <text
                  x={p.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className="chart-axis-label"
                >
                  {p.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(activePoint.x / chartWidth) * 100}%`,
              top: `${(activePoint.y / chartHeight) * 100}%`
            }}
          >
            <div className="tooltip-month">{activePoint.month} 2026</div>
            <div className="tooltip-net">Net: ₹{Number(activePoint.net).toLocaleString("en-IN")}</div>
            <div className="tooltip-gross">Gross: ₹{Number(activePoint.gross).toLocaleString("en-IN")}</div>
            <div className="tooltip-learners">{activePoint.learners} Enrolled</div>
          </div>
        )}
      </div>
    </article>
  );
}
