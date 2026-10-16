import React from "react";

export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function getStatusTone(status = "") {
  const s = String(status).toLowerCase();
  if (s.includes("active") || s.includes("published") || s.includes("verified") || s.includes("approved") || s.includes("successful") || s.includes("settled") || s.includes("operational") || s.includes("ok") || s.includes("enabled") || s.includes("completed")) {
    return "success";
  }
  if (s.includes("overdue") || s.includes("danger") || s.includes("failed") || s.includes("rejected") || s.includes("revoked") || s.includes("breach") || s.includes("critical")) {
    return "danger";
  }
  if (s.includes("pending") || s.includes("cap") || s.includes("warning") || s.includes("investigating") || s.includes("review") || s.includes("expiring") || s.includes("open") || s.includes("degraded")) {
    return "warning";
  }
  if (s.includes("onboarding") || s.includes("blue") || s.includes("draft") || s.includes("upcoming") || s.includes("progress")) {
    return "blue";
  }
  return "neutral";
}
