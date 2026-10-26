import React, { useState, useMemo } from 'react';
import {
  Download, Clock3, ShieldCheck, Activity, ArrowRight, X, RefreshCw
} from 'lucide-react';
import { exportComplianceCSV } from '../data/storage.js';

export default function CompliancePage({
  compliance,
  query,
  setQuery,
  onOpenComplianceReview,
  flash
}) {
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [lastUpdated, setLastUpdated] = useState('08 Sep 2026 · 09:40 IST');

  const filteredCompliance = useMemo(() => {
    return compliance.filter(c => {
      const matchStatus = statusFilter === 'All statuses' || c.status === statusFilter;
      const matchQuery = !query.trim() ||
        `${c.requirement} ${c.category} ${c.owner} ${c.status} ${c.dueDate}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [compliance, statusFilter, query]);

  const totalReqs = compliance.length;
  const completeCount = compliance.filter(c => c.status === 'Complete').length;
  const inReviewCount = compliance.filter(c => c.status === 'In review').length;
  const actionNeededCount = compliance.filter(c => c.status === 'Action needed').length;

  function handleExport() {
    exportComplianceCSV(filteredCompliance);
    flash(`Exported ${filteredCompliance.length} compliance record(s) to CSV.`);
  }

  function handleRefreshRegister() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setLastUpdated(`${dateStr} · ${timeStr} IST`);
    flash('Compliance register synchronized and status counts refreshed.');
  }

  // Find next upcoming deadline
  const nextDeadline = compliance.find(c => c.status !== 'Complete')?.dueDate || '12 Sep 2026';

  return (
    <div className="compliance-container">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">GOVERNANCE · COMPLIANCE</div>
          <h1>Compliance</h1>
          <p>Track institutional requirements, owners, due dates, and review status.</p>
        </div>
        <div className="heading-action">
          <button
            type="button"
            className="btn secondary"
            onClick={handleExport}
            title="Export compliance register as CSV"
          >
            <Download size={15} />
            <span>Export register</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC STAT STRIP */}
      <div className="stat-strip card">
        <div className="stat">
          <strong>{totalReqs}</strong>
          <span>Requirements</span>
        </div>
        <div className="stat">
          <strong>{completeCount}</strong>
          <span>Complete</span>
        </div>
        <div className="stat">
          <strong>{inReviewCount}</strong>
          <span>In review</span>
        </div>
        <div className="stat">
          <strong>{actionNeededCount}</strong>
          <span>Action needed</span>
        </div>
      </div>

      {/* STATUS FILTER PILLS */}
      <div className="category-filter-row">
        {['All statuses', 'In review', 'Action needed', 'Complete'].map(st => (
          <button
            key={st}
            type="button"
            className={`filter-pill-btn ${statusFilter === st ? 'active' : ''}`}
            onClick={() => setStatusFilter(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {/* COMPLIANCE REGISTER PANEL */}
      <section className="panel card">
        <div className="panel-head">
          <div>Compliance register</div>
          <div className="panel-aside">
            <span className="deadline">
              <Clock3 size={14} />
              Next deadline: {nextDeadline}
            </span>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>REQUIREMENT</th>
                <th>DUE DATE</th>
                <th>OWNER</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompliance.map(r => (
                <tr key={r.id || r.requirement}>
                  <td>
                    <strong>{r.requirement}</strong>
                    <small className="subcell">{r.category}</small>
                  </td>
                  <td>{r.dueDate}</td>
                  <td>{r.owner}</td>
                  <td>
                    <span
                      className={`status ${
                        r.status === 'Complete'
                          ? 'good'
                          : r.status === 'In review'
                          ? 'review'
                          : 'warning'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="text-action review-action-btn"
                      onClick={() => onOpenComplianceReview(r)}
                      title={`Review requirement "${r.requirement}"`}
                      aria-label={`Review ${r.requirement}`}
                    >
                      <span>Review</span>
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCompliance.length === 0 && (
            <div className="empty">
              <p>No compliance requirements match your filter or search query.</p>
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setStatusFilter('All statuses');
                  setQuery('');
                }}
              >
                <X size={14} />
                <span>Reset filter</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* COMPLIANCE FOOTER */}
      <div className="compliance-foot card">
        <ShieldCheck size={18} />
        <div>
          <strong>Institutional data is up to date</strong>
          <span>Last register update: {lastUpdated}</span>
        </div>
        <button
          type="button"
          className="text-action"
          onClick={handleRefreshRegister}
          title="Synchronize and refresh register"
        >
          <span>Refresh</span>
          <Activity size={14} />
        </button>
      </div>
    </div>
  );
}
