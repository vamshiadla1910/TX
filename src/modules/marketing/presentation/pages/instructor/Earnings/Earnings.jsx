import React, { useState } from "react";
import {
  Wallet, IndianRupee, ArrowUpRight, Download, CheckCircle2,
  Building, Clock, FileText, ShieldCheck
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import "./Earnings.css";

export function Earnings({ payoutHistory = [], instructorProfile = {} }) {
  const [downloadNotice, setDownloadNotice] = useState("");

  const handleDownloadInvoice = (payId) => {
    setDownloadNotice(`Tax Invoice for ${payId} generated successfully.`);
    setTimeout(() => setDownloadNotice(""), 3500);
  };

  return (
    <div className="earnings-container">
      {/* Header */}
      <div className="earnings-header">
        <div>
          <div className="breadcrumb-nav">
            <span>Pathwing</span>
            <span className="separator">/</span>
            <span>Instructor</span>
            <span className="separator">/</span>
            <strong className="current">Earnings</strong>
          </div>
          <h1 className="module-title">Earnings</h1>
          <p className="module-sub">
            Track monthly earnings and payout settlements.
          </p>
        </div>

        <div className="bank-verified-tag">
          <ShieldCheck size={16} className="text-success" />
          <span>HDFC Direct Deposit · Verified</span>
        </div>
      </div>

      {downloadNotice && (
        <div className="download-notice-banner">
          <CheckCircle2 size={16} />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* 4 Financial Metric Cards */}
      <div className="earnings-summary-grid">
        <div className="card finance-card">
          <span className="card-lbl">OCT NET EARNINGS</span>
          <strong className="card-val highlight">
            ₹{Number(instructorProfile.netEarningsMonth || 284500).toLocaleString("en-IN")}
          </strong>
          <small className="card-sub text-success">
            <ArrowUpRight size={14} /> +18.5% MoM
          </small>
        </div>

        <div className="card finance-card">
          <span className="card-lbl">YTD PAYOUT</span>
          <strong className="card-val">
            ₹{Number(instructorProfile.netEarningsYTD || 1492000).toLocaleString("en-IN")}
          </strong>
          <small className="card-sub">Settled to bank account</small>
        </div>

        <div className="card finance-card">
          <span className="card-lbl">COMMISSION</span>
          <strong className="card-val">15.0%</strong>
          <small className="card-sub">Platform hosting fee</small>
        </div>

        <div className="card finance-card">
          <span className="card-lbl">NEXT PAYOUT</span>
          <strong className="card-val">02 Nov 2026</strong>
          <small className="card-sub">Est. settlement date</small>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="card payout-history-card">
        <div className="payout-card-header">
          <div>
            <h3 className="section-title">Direct Deposit Settlement History</h3>
            <p className="section-sub">Automated payouts processed on the 2nd of each month.</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="payout-table">
            <thead>
              <tr>
                <th>Settlement ID</th>
                <th>Billing Month</th>
                <th>Gross Revenue</th>
                <th>Platform Fee (15%)</th>
                <th>Net Payout</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((p) => {
                const tone = getStatusTone(p.status);
                return (
                  <tr key={p.id}>
                    <td>
                      <span className="font-mono">{p.id}</span>
                    </td>
                    <td>
                      <strong>{p.month}</strong>
                    </td>
                    <td>{p.gross}</td>
                    <td className="text-danger">{p.commission}</td>
                    <td>
                      <strong className="text-success">{p.net}</strong>
                    </td>
                    <td>
                      <Badge tone={tone}>{p.status}</Badge>
                    </td>
                    <td>
                      <small className="text-muted">{p.date}</small>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-download-invoice"
                        onClick={() => handleDownloadInvoice(p.id)}
                        title={`Download invoice for ${p.id}`}
                      >
                        <Download size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
