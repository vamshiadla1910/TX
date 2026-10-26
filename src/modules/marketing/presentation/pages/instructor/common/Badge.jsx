import React from "react";

export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function getStatusTone(status = "") {
  const s = String(status).toLowerCase();
  if (
    s.includes("active") ||
    s.includes("published") ||
    s.includes("completed") ||
    s.includes("settled") ||
    s.includes("ok")
  ) {
    return "success";
  }
  if (
    s.includes("urgent") ||
    s.includes("failed") ||
    s.includes("danger") ||
    s.includes("critical")
  ) {
    return "danger";
  }
  if (
    s.includes("action needed") ||
    s.includes("warning") ||
    s.includes("review") ||
    s.includes("needs support") ||
    s.includes("processing")
  ) {
    return "warning";
  }
  if (
    s.includes("scheduled") ||
    s.includes("info") ||
    s.includes("blue") ||
    s.includes("progress")
  ) {
    return "blue";
  }
  if (s.includes("ai") || s.includes("purple")) {
    return "purple";
  }
  return "neutral";
}
