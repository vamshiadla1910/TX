import React, { useMemo } from 'react';
import {
  Download, FileText, ArrowRight, X
} from 'lucide-react';
import { exportReportByName, exportInstitutionSummaryCSV } from '../data/storage.js';

export default function ReportsPage({
  reports,
  departments,
  learners,
  courses,
  programmes,
  compliance,
  stats,
  query,
  setQuery,
  flash
}) {
  const filteredReports = useMemo(() => {
    return reports.filter(r =>
      `${r.name} ${r.category || ''} ${r.description || ''}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [reports, query]);

  function handleDownloadReport(report) {
    try {
      exportReportByName(report.name, {
        learners,
        courses,
        programmes,
        compliance,
        departments
      });
      flash(`Generated and downloaded “${report.name}” CSV.`);
    } catch (err) {
      console.error('Error generating report:', err);
      flash('Failed to export report CSV.');
    }
  }

  function handleDownloadSummary() {
    try {
      exportInstitutionSummaryCSV({ stats, departments, programmes });
      flash('Institution executive summary downloaded as CSV.');
    } catch (err) {
      console.error('Error generating summary:', err);
      flash('Failed to export summary CSV.');
    }
  }

  return (
    <div className="reports-container">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">INSIGHTS · REPORTS</div>
          <h1>Reports</h1>
          <p>Review institutional outcomes and export term data for your teams.</p>
        </div>
        <div className="heading-action">
          <button
            type="button"
            className="btn primary"
            onClick={handleDownloadSummary}
            title="Download executive institutional summary CSV"
          >
            <Download size={15} />
            <span>Download summary</span>
          </button>
        </div>
      </div>

      {/* STAT STRIP */}
      <div className="stat-strip card">
        <div className="stat">
          <strong>{stats.programCompletion}</strong>
          <span>Programme completion</span>
        </div>
        <div className="stat">
          <strong>{stats.certifiedCount}</strong>
          <span>Certified this term</span>
        </div>
        <div className="stat">
          <strong>{stats.placementReady}</strong>
          <span>Placement-ready</span>
        </div>
        <div className="stat">
          <strong>+6 pts</strong>
          <span>Vs last term</span>
        </div>
      </div>

      {/* DEPARTMENT CHART PANEL */}
      <section className="panel card">
        <div className="panel-head">
          <div>Completion by department</div>
          <div className="panel-aside">
            <span className="micro">2026–27</span>
          </div>
        </div>
        <div className="department-chart report-chart">
          {departments.map(d => (
            <div className="bar-row" key={d.name}>
              <span>{d.name}</span>
              <div className="bar-track">
                <div style={{ width: `${d.value}%` }} />
              </div>
              <strong>{d.value}%</strong>
            </div>
          ))}
        </div>
      </section>

      {/* AVAILABLE REPORTS PANEL */}
      <section className="panel card">
        <div className="panel-head">
          <div>Available reports</div>
          <div className="panel-aside">
            <FileText size={17} />
          </div>
        </div>

        <p className="panel-description">
          Download a CSV snapshot for local analysis and institutional reporting.
        </p>

        <div className="report-list">
          {filteredReports.map((r, i) => (
            <div className="report-row" key={r.id || r.name}>
              <span className="report-icon">
                <FileText size={17} />
              </span>
              <div>
                <strong>{r.name}</strong>
                <small>
                  2026–27 · Current term · Updated {r.updatedDate || ['08', '07', '05', '01'][i % 4] + ' Sep 2026'}
                </small>
              </div>
              <span className="csv-tag">CSV</span>
              <button
                type="button"
                className="square-action"
                aria-label={`Download report ${r.name}`}
                title={`Download ${r.name} as CSV`}
                onClick={() => handleDownloadReport(r)}
              >
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="empty">
            <p>No reports match your search query.</p>
            <button
              type="button"
              className="btn secondary"
              onClick={() => setQuery('')}
            >
              <X size={14} />
              <span>Clear search</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
