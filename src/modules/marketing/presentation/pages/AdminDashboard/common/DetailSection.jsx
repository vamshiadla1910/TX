import React from "react";
import { ArrowLeft, X } from "lucide-react";
import { Badge, getStatusTone } from "./Badge";

export function DetailField({ label, value, fallback = "Not provided", mono = false, children }) {
  const displayVal = value !== undefined && value !== null && String(value).trim() !== "" ? value : fallback;
  const isFallback = displayVal === fallback;

  return (
    <div className="detail-field">
      <span className="detail-field-label">{label}</span>
      {children ? (
        <div className="detail-field-value">{children}</div>
      ) : (
        <span className={`detail-field-value ${mono ? "font-mono" : ""} ${isFallback ? "text-muted italic" : ""}`}>
          {displayVal}
        </span>
      )}
    </div>
  );
}

export function InlineDetailView({
  title,
  subtitle,
  status,
  statusTone,
  id,
  onBack,
  actions,
  children,
  banner
}) {
  return (
    <section className="card inline-detail-card">
      <div className="inline-detail-header">
        <div className="inline-detail-top">
          <button className="secondary btn-sm" onClick={onBack} aria-label="Back to list">
            <ArrowLeft size={14} /> Back to list
          </button>
          {id && <span className="record-tag">ID: {id}</span>}
        </div>

        <div className="inline-detail-title-row">
          <div>
            <h2>{title || "Record Details"}</h2>
            {subtitle && <p className="inline-detail-subtitle">{subtitle}</p>}
          </div>
          <div className="inline-detail-header-actions">
            {status && (
              <Badge tone={statusTone || getStatusTone(status)}>
                {status}
              </Badge>
            )}
            {actions && <div className="action-button-group">{actions}</div>}
          </div>
        </div>
      </div>

      {banner && <div className="inline-detail-banner">{banner}</div>}

      <div className="inline-detail-body">
        {children}
      </div>
    </section>
  );
}
