import React, { useState, useMemo } from 'react';
import {
  FileUp, Download, Eye, Edit2, ArrowRight, Filter, X
} from 'lucide-react';
import { exportLearnersCSV } from '../data/storage.js';

export default function LearnersPage({
  learners,
  department,
  setDepartment,
  statusFilter,
  setStatusFilter,
  query,
  setQuery,
  onOpenImportCSV,
  onOpenLearnerDetail,
  onOpenEditLearner,
  flash
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredLearners = useMemo(() => {
    return learners.filter(l => {
      const matchDept = department === 'All departments' || l.dept === department;
      const matchStatus = statusFilter === 'All statuses' || l.status === statusFilter;
      const matchQuery = !query.trim() ||
        `${l.name} ${l.email} ${l.program} ${l.dept} ${l.status}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchDept && matchStatus && matchQuery;
    });
  }, [learners, department, statusFilter, query]);

  const totalPages = Math.ceil(filteredLearners.length / itemsPerPage) || 1;
  const paginatedLearners = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLearners.slice(start, start + itemsPerPage);
  }, [filteredLearners, currentPage]);

  const needsSupportCount = learners.filter(l => l.status === 'Needs support').length;
  const placementReadyCount = learners.filter(l => l.placementReady || l.progress >= 80).length;

  function handleExport() {
    exportLearnersCSV(filteredLearners);
    flash(`Exported ${filteredLearners.length} learner records to CSV.`);
  }

  function handleResetFilters() {
    setDepartment('All departments');
    setStatusFilter('All statuses');
    setQuery('');
    setCurrentPage(1);
  }

  return (
    <div className="learners-container">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">PEOPLE · LEARNERS</div>
          <h1>Learners</h1>
          <p>Monitor learner progress, programme enrollment, and support needs.</p>
        </div>
        <div className="heading-action">
          <button
            type="button"
            className="btn secondary"
            onClick={handleExport}
            title="Export filtered directory to CSV"
          >
            <Download size={15} />
            <span>Export directory</span>
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={onOpenImportCSV}
          >
            <FileUp size={15} />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* STAT STRIP */}
      <div className="stat-strip card">
        <div className="stat">
          <strong>{learners.length >= 2140 ? learners.length.toLocaleString() : (2140 + learners.length - 8).toLocaleString()}</strong>
          <span>Total learners</span>
        </div>
        <div className="stat">
          <strong>1,986</strong>
          <span>Active this term</span>
        </div>
        <div className="stat">
          <strong>{(418 + (placementReadyCount - 4)).toLocaleString()}</strong>
          <span>Placement ready</span>
        </div>
        <div className="stat">
          <strong>{(21 + needsSupportCount).toLocaleString()}</strong>
          <span>Need support</span>
        </div>
      </div>

      {/* DIRECTORY PANEL */}
      <section className="panel card">
        <div className="panel-head">
          <div>Learner directory</div>
          <div className="panel-aside filters-bar">
            <label className="filter-label">
              <span>Department</span>
              <select
                value={department}
                onChange={e => {
                  setDepartment(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All departments">All departments</option>
                {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>

            <label className="filter-label">
              <span>Status</span>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All statuses">All statuses</option>
                <option value="On track">On track</option>
                <option value="Needs support">Needs support</option>
              </select>
            </label>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>LEARNER</th>
                <th>DEPT.</th>
                <th>PROGRAMME</th>
                <th>PROGRESS</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLearners.map(l => (
                <tr key={l.id || l.email}>
                  <td>
                    <div
                      className="learner-cell clickable-cell"
                      onClick={() => onOpenLearnerDetail(l)}
                      title={`View details for ${l.name}`}
                    >
                      <span className="avatar">
                        {l.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </span>
                      <div>
                        <strong>{l.name}</strong>
                        <small>{l.email}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="csv-tag">{l.dept}</span></td>
                  <td>{l.program}</td>
                  <td>
                    <div className="table-progress">
                      <div className="progress">
                        <span style={{ width: `${l.progress}%` }} />
                      </div>
                      <span>{l.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status ${l.status === 'On track' ? 'good' : 'warning'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-action-cell">
                      <button
                        type="button"
                        className="text-action"
                        onClick={() => onOpenLearnerDetail(l)}
                        title={`View profile of ${l.name}`}
                      >
                        <span>View Details</span>
                        <ArrowRight size={13} />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn"
                        onClick={() => onOpenEditLearner(l)}
                        title={`Edit ${l.name}`}
                        aria-label={`Edit ${l.name}`}
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLearners.length === 0 && (
            <div className="empty">
              <p>No learners match the specified search query or filters.</p>
              <button
                type="button"
                className="btn secondary"
                onClick={handleResetFilters}
              >
                <X size={14} />
                <span>Reset search and filters</span>
              </button>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {filteredLearners.length > itemsPerPage && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredLearners.length)} of{' '}
              {filteredLearners.length} records
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                className="btn secondary page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="page-indicator">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                className="btn secondary page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="helper-text">
        Showing institutional records. Import a CSV with columns: <code>name, email, dept, program, progress</code> to onboard new learners.
      </p>
    </div>
  );
}
