/**
 * Centralized Chart.js registration and shared enterprise theme options
 * for all Instructor Revenue Analytics graphs.
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { formatCompactINR, formatINR } from "./revenueFormatters.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const CHART_PALETTE = [
  "#2563eb",
  "#0284c7",
  "#4f46e5",
  "#0ea5e9",
  "#38bdf8",
  "#1d4ed8"
];

export const COMMON_FONT_FAMILY = '"Plus Jakarta Sans", "Inter", system-ui, sans-serif';

export const SHARED_TOOLTIP_THEME = {
  backgroundColor: "#0f172a",
  titleColor: "#93c5fd",
  bodyColor: "#f8fafc",
  borderColor: "rgba(59, 130, 246, 0.35)",
  borderWidth: 1,
  padding: 12,
  cornerRadius: 10,
  displayColors: true,
  titleFont: {
    family: COMMON_FONT_FAMILY,
    size: 12,
    weight: "700"
  },
  bodyFont: {
    family: COMMON_FONT_FAMILY,
    size: 12,
    weight: "500"
  }
};

/**
 * Shared options factory for Line and Bar cartesian revenue charts.
 * @param {Object} [overrides]
 * @returns {Object}
 */
export function createCartesianChartOptions(overrides = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          color: "#475569",
          font: {
            family: COMMON_FONT_FAMILY,
            size: 11.5,
            weight: "600"
          }
        }
      },
      tooltip: {
        ...SHARED_TOOLTIP_THEME,
        callbacks: {
          label(context) {
            const label = context.dataset?.label || "Revenue";
            return ` ${label}: ${formatINR(context.parsed.y)}`;
          },
          ...(overrides.tooltipCallbacks || {})
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: "#64748b",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
          font: {
            family: COMMON_FONT_FAMILY,
            size: 11,
            weight: "600"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#f1f5f9",
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: "#64748b",
          callback: (val) => formatCompactINR(val),
          font: {
            family: COMMON_FONT_FAMILY,
            size: 11,
            weight: "600"
          }
        }
      }
    }
  };
}
