import React from "react";

export function Metric({ id, label, value, foot, icon: Icon, tone, subtitle }) {
  return (
    <article key={id || label} className={`inst-kpi-card card ${id || ""}`}>
      <div className="inst-kpi-top">
        <span className="inst-kpi-label">{label}</span>
        {Icon && (
          <div className={`inst-kpi-icon-wrap ${tone || "blue"}`}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="inst-kpi-body">
        <strong className="inst-kpi-value">{value}</strong>
        {subtitle && <span className="inst-kpi-sub">{subtitle}</span>}
      </div>

      {foot && (
        <div className="inst-kpi-foot-row">
          <small className={`inst-kpi-foot ${tone || "positive"}`}>{foot}</small>
        </div>
      )}
    </article>
  );
}
