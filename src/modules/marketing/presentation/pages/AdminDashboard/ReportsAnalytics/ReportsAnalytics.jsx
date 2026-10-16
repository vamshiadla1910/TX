import React, { useState } from "react";
import "./ReportsAnalytics.css";
import {
  Activity, ArrowUpRight, BarChart2, CheckCircle2,
  Download, FileSpreadsheet, Layers, TrendingUp, Users, Wallet
} from "lucide-react";
import { Badge } from "../common/Badge";
import { Metric } from "../common/Metric";

export function Reports({
  tenants,
  courses,
  setNotice
}) {
  const [activeTab, setActiveTab] = useState("learning");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  function handleExportCSV() {
    let csvData = "";
    if (activeTab === "learning") {
      csvData = "Course Title,Organization,Category,Enrollments,Rating,Status\n" +
        courses.map(c => `"${c.title}","${c.organization}","${c.category}","${c.enrollments}","${c.rating}","${c.status}"`).join("\n");
    } else if (activeTab === "tenants") {
      csvData = "Tenant Name,Type,Domain,Seats Contracted,Seats Used,Plan,Status\n" +
        tenants.map(t => `"${t.name}","${t.type}","${t.domain}","${t.seats}","${t.used}","${t.plan}","${t.status}"`).join("\n");
    } else {
      csvData = "Month,Gross GMV,Platform Take,Instructor Payout,Growth\n" +
        `"Aug 2026","₹1.42 Cr","₹41.6 L","₹1.01 Cr","+8.4%"\n` +
        `"Jul 2026","₹1.35 Cr","₹39.5 L","₹95.5 L","+9.1%"\n` +
        `"Jun 2026","₹1.24 Cr","₹36.2 L","₹87.8 L","+7.2%"\n`;
    }

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pathwing_${activeTab}_report_${dateRange.replace(/\s+/g, "_").toLowerCase()}.csv`;
    link.click();
    setNotice(`Exported ${activeTab} analytics report as CSV.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="STUDENT ENROLLMENTS" value="12,840" foot="▲ 14% this quarter" icon={Users} />
        <Metric label="COMPLETION RATE" value="78.4%" foot="▲ 3.2% vs benchmark" icon={CheckCircle2} />
        <Metric label="MONTHLY GMV" value="₹1.42Cr" foot="August settlement" icon={Wallet} />
        <Metric label="PLATFORM REVENUE" value="₹41.6L" foot="29.3% take rate" icon={TrendingUp} />
      </div>

      <section className="card">
        <div className="table-heading">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === "learning" ? "active" : ""}`}
              onClick={() => setActiveTab("learning")}
            >
              <BarChart2 size={15} /> Student & Course Learning
            </button>
            <button
              className={`tab-btn ${activeTab === "tenants" ? "active" : ""}`}
              onClick={() => setActiveTab("tenants")}
            >
              <Layers size={15} /> Tenant LMS Utilization
            </button>
            <button
              className={`tab-btn ${activeTab === "revenue" ? "active" : ""}`}
              onClick={() => setActiveTab("revenue")}
            >
              <Wallet size={15} /> Revenue & Payouts
            </button>
          </div>

          <div className="heading-actions">
            <select
              className="select-inline"
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
            >
              <option>Last 30 Days</option>
              <option>Q3 2026</option>
              <option>Year to Date (2026)</option>
            </select>
            <button className="primary btn-sm" onClick={handleExportCSV}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {activeTab === "learning" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Organization</th>
                  <th>Enrollments</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.title}</strong></td>
                    <td>{c.category}</td>
                    <td>{c.organization}</td>
                    <td><strong>{c.enrollments.toLocaleString("en-IN")}</strong></td>
                    <td>★ {c.rating}</td>
                    <td><Badge tone="success">{c.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "tenants" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Domain</th>
                  <th>Seats Contracted</th>
                  <th>Seats Used</th>
                  <th>Utilization</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => {
                  const pct = Math.round((t.used / t.seats) * 100);
                  return (
                    <tr key={t.id || t.name}>
                      <td><strong>{t.name}</strong></td>
                      <td className="font-mono">{t.domain}</td>
                      <td>{t.seats.toLocaleString("en-IN")}</td>
                      <td>{t.used.toLocaleString("en-IN")}</td>
                      <td>
                        <div className="progress-inline">
                          <div className="progress" style={{ width: "90px" }}>
                            <i style={{ width: `${pct}%`, background: pct >= 95 ? "#d34f42" : undefined }} />
                          </div>
                          <span>{pct}%</span>
                        </div>
                      </td>
                      <td><Badge tone="blue">{t.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "revenue" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Settlement Month</th>
                  <th>Gross GMV</th>
                  <th>Platform Cut (Take Rate)</th>
                  <th>Instructor Disbursals</th>
                  <th>MoM Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>August 2026</strong></td>
                  <td>₹1.42 Cr</td>
                  <td><strong className="text-success">₹41.6 L</strong> (29.3%)</td>
                  <td>₹1.01 Cr</td>
                  <td><Badge tone="success">▲ 8.4%</Badge></td>
                </tr>
                <tr>
                  <td><strong>July 2026</strong></td>
                  <td>₹1.35 Cr</td>
                  <td><strong className="text-success">₹39.5 L</strong> (29.2%)</td>
                  <td>₹95.5 L</td>
                  <td><Badge tone="success">▲ 9.1%</Badge></td>
                </tr>
                <tr>
                  <td><strong>June 2026</strong></td>
                  <td>₹1.24 Cr</td>
                  <td><strong className="text-success">₹36.2 L</strong> (29.1%)</td>
                  <td>₹87.8 L</td>
                  <td><Badge tone="success">▲ 7.2%</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
