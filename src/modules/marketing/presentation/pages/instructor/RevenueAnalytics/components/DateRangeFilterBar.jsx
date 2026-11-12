/**
 * DateRangeFilterBar Component
 * Allows switching across Last 7 days, 14 days, 30 days, 6 months, or Custom Date Range.
 */

import { Calendar, RefreshCw } from "lucide-react";
import { ActionButton } from "../../common/ActionButton.jsx";
import { DATE_RANGE_PRESETS } from "../utils/revenueFormatters.js";

export function DateRangeFilterBar({
  preset,
  customStart,
  customEnd,
  todayStr,
  activeWindow,
  loading,
  onSelectPreset,
  onChangeCustomRange,
  onRefresh
}) {
  return (
    <section className="card inst-rev-filter-bar" aria-label="Revenue Date Range Filter">
      <div className="inst-rev-preset-group" role="group" aria-label="Preset Date Ranges">
        {DATE_RANGE_PRESETS.map((item) => {
          const isActive = preset === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`inst-rev-preset-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectPreset(item.id)}
              aria-pressed={isActive}
            >
              {item.id === "custom" && <Calendar size={14} />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="inst-rev-filter-meta">
        {preset === "custom" ? (
          <div className="inst-rev-custom-dates">
            <label className="inst-rev-date-field">
              <span>From</span>
              <input
                type="date"
                value={customStart}
                max={customEnd || todayStr}
                onChange={(e) => onChangeCustomRange(e.target.value, customEnd)}
                aria-label="Custom start date"
              />
            </label>
            <label className="inst-rev-date-field">
              <span>To</span>
              <input
                type="date"
                value={customEnd}
                min={customStart || undefined}
                max={todayStr}
                onChange={(e) => onChangeCustomRange(customStart, e.target.value)}
                aria-label="Custom end date"
              />
            </label>
          </div>
        ) : (
          activeWindow && (
            <span className="inst-rev-range-pill">
              <Calendar size={13} />
              <span>
                {activeWindow.startDateStr} to {activeWindow.endDateStr}
              </span>
            </span>
          )
        )}

        <ActionButton
          icon={RefreshCw}
          variant="outline-blue"
          size="sm"
          onClick={onRefresh}
          loading={loading}
          loadingLabel="Refreshing..."
          tooltip="Refresh revenue metrics"
          aria-label="Refresh revenue metrics"
        >
          Refresh
        </ActionButton>
      </div>
    </section>
  );
}

export default DateRangeFilterBar;
