import React from "react";

export function Metric({ label, value, foot, icon: Icon, tone }) {
  return (
    <article className="metric card">
      <div className="metric-top">
        <span>{label}</span>
        {Icon && <Icon size={16} />}
      </div>
      <strong>{value}</strong>
      {foot && <small className={tone || "positive"}>{foot}</small>}
    </article>
  );
}
