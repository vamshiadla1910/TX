import React from "react";

export function DetailSection({ title, children }) {
  return (
    <div className="detail-section">
      {title && <h4>{title}</h4>}
      <div className="detail-grid">{children}</div>
    </div>
  );
}

export function DetailField({ label, value, children, mono = false }) {
  return (
    <div className="detail-field">
      <span className="field-label">{label}</span>
      <div className={`field-value ${mono ? "font-mono" : ""}`}>
        {value !== undefined ? value : children}
      </div>
    </div>
  );
}
