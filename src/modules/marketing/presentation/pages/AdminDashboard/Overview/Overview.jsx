import React from "react";
import "./Overview.css";
import {
  Activity, ArrowRight, ArrowUpRight, BookOpen, Building2,
  CheckCircle2, ShieldCheck, Users, Wallet
} from "lucide-react";
import { Metric } from "../common/Metric";
import { Badge } from "../common/Badge";

export function Overview({
  tenants,
  courses,
  users,
  payments,
  helpdeskTickets,
  setPage,
  onSelectTenant,
  onSelectCourse
}) {
  const bars = [
    { m: "Mar", v: "0.96", a: 60, b: 22 },
    { m: "Apr", v: "1.06", a: 67, b: 25 },
    { m: "May", v: "1.16", a: 74, b: 27 },
    { m: "Jun", v: "1.24", a: 80, b: 29 },
    { m: "Jul", v: "1.35", a: 86, b: 32 },
    { m: "Aug", v: "1.42", a: 91, b: 35 }
  ];

  const services = [
    { name: "API gateway", meta: "412 ms p95 · 0.02% 5xx", status: "OK", tone: "success" },
    { name: "Video delivery (DRM + CDN)", meta: "1.1 s start · 99.98% availability", status: "OK", tone: "success" },
    { name: "Code execution sandbox", meta: "Queue depth 34 · scaling out", status: "Degraded", tone: "warning" },
    { name: "Payment webhooks", meta: "0 unreconciled over 15 min", status: "OK", tone: "success" },
    { name: "Notification service", meta: "Email 99.4% · SMS 98.1% delivered", status: "OK", tone: "success" }
  ];

  const pendingModeration = courses.filter(c => c.status === "Overdue" || c.status === "Pending Review");
  const overdueCourses = courses.filter(c => c.status === "Overdue");
  const nearCapTenants = tenants.filter(t => t.status === "Seats near cap" || (t.used / t.seats >= 0.9));

  return (
    <>
      <div className="metrics-grid">
        <Metric
          label="TENANTS"
          value={String(tenants.length + 32)}
          foot="▲ 3 this quarter"
          icon={Building2}
        />
        <Metric
          label="ACTIVE USERS · 30D"
          value={String(41208 + users.length - 7)}
          foot="▲ 12% monthly"
          icon={Users}
        />
        <Metric
          label="GMV · AUG"
          value="₹1.42Cr"
          foot="▲ 8.4% growth"
          icon={Wallet}
        />
        <Metric
          label="PLATFORM REVENUE"
          value="₹41.6L"
          foot="29.3% blended take"
          icon={Activity}
        />
        <Metric
          label="COURSES IN REVIEW"
          value={String(pendingModeration.length)}
          foot={`${overdueCourses.length} over SLA`}
          icon={BookOpen}
          tone={overdueCourses.length > 0 ? "negative" : "positive"}
        />
        <Metric
          label="OPEN INCIDENTS"
          value="2"
          foot="Both P3 priority"
          icon={ShieldCheck}
        />
      </div>

      <div className="overview-grid">
        <section className="card revenue-card">
          <div className="card-heading">
            <h2>Revenue split — platform vs instructor payout</h2>
            <small>Mar – Aug 2026 · ₹ crore</small>
          </div>
          <div className="legend">
            <span><i className="blue-dot" /> Instructor payout</span>
            <span><i className="gold-dot" /> Platform revenue</span>
          </div>
          <div className="chart">
            <div className="axis-labels">
              <span>1.50</span>
              <span>0.75</span>
              <span>0.00</span>
            </div>
            <div className="bar-area">
              {bars.map(b => (
                <div className="bar-column" key={b.m}>
                  <b>{b.v}</b>
                  <div className="stack">
                    <i style={{ height: b.b }} />
                    <em style={{ height: b.a }} />
                  </div>
                  <small>{b.m}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card service-card">
          <div className="card-heading">
            <h2>Service health</h2>
            <small>p95 latency</small>
          </div>
          {services.map(s => (
            <div className="service-row" key={s.name}>
              <Badge tone={s.tone}>{s.status}</Badge>
              <div>
                <strong>{s.name}</strong>
                <small>{s.meta}</small>
              </div>
            </div>
          ))}
        </section>

        <section className="card consumption-card">
          <div className="card-heading">
            <h2>Top tenants by consumption · Aug</h2>
            <small>learning seats</small>
          </div>
          {tenants.slice(0, 4).map(t => {
            const usagePct = Math.min(100, Math.round((t.used / t.seats) * 100));
            return (
              <div
                className="consumption-row clickable-row"
                key={t.id || t.name}
                onClick={() => {
                  if (onSelectTenant) onSelectTenant(t);
                  setPage("Tenants");
                }}
                title="Click to view tenant details"
              >
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.used.toLocaleString("en-IN")} / {t.seats.toLocaleString("en-IN")} learners ({usagePct}%)</span>
                </div>
                <div className="progress">
                  <i style={{ width: `${usagePct}%`, background: usagePct >= 95 ? "#d34f42" : "#3158d7" }} />
                </div>
              </div>
            );
          })}
          <button className="secondary full" onClick={() => setPage("Tenants")}>
            View all tenants <ArrowRight size={15} />
          </button>
        </section>

        <section className="card decisions-card">
          <div className="card-heading">
            <h2>Needs a decision</h2>
          </div>
          {overdueCourses.length > 0 && (
            <div className="decision">
              <Badge tone="danger">SLA</Badge>
              <div>
                <strong>{overdueCourses.length} course(s) past the 48-hour review window</strong>
                <small>Oldest: {overdueCourses[0].title} — assign reviewer immediately</small>
                <button
                  className="text-button"
                  onClick={() => {
                    if (onSelectCourse) onSelectCourse(overdueCourses[0]);
                    setPage("Moderation");
                  }}
                >
                  Review course <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          )}

          {nearCapTenants.length > 0 && (
            <div className="decision">
              <Badge tone="warning">Seats</Badge>
              <div>
                <strong>{nearCapTenants[0].name} at {Math.round((nearCapTenants[0].used / nearCapTenants[0].seats) * 100)}% capacity</strong>
                <small>Contracted {nearCapTenants[0].seats.toLocaleString("en-IN")} seats · Expand capacity before semester start</small>
                <button
                  className="text-button"
                  onClick={() => {
                    if (onSelectTenant) onSelectTenant(nearCapTenants[0]);
                    setPage("Tenants");
                  }}
                >
                  Manage tenant <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="decision">
            <Badge tone="warning">Risk</Badge>
            <div>
              <strong>2 open platform incidents</strong>
              <small>Code execution sandbox queue depth at 34 · review autoscaling health</small>
              <button className="text-button" onClick={() => setPage("Security & audit")}>
                Review incident <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
