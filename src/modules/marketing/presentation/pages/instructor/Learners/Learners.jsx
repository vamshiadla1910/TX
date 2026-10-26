import React, { useState, useMemo } from "react";
import {
  Users, Search, Mail, MessageSquare, CheckCircle,
  Clock, Award, Filter, ChevronLeft, ChevronRight, X, AlertCircle
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import "./Learners.css";

export function Learners({ learners = [] }) {
  const [search, setSearch] = useState("");
  const [cohortFilter, setCohortFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredLearners = useMemo(() => {
    return learners.filter((lrn) => {
      const matchSearch =
        search.trim() === "" ||
        lrn.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        lrn.email.toLowerCase().includes(search.toLowerCase().trim()) ||
        lrn.courseName.toLowerCase().includes(search.toLowerCase().trim()) ||
        lrn.cohort.toLowerCase().includes(search.toLowerCase().trim());

      const matchCohort =
        cohortFilter === "all" ||
        lrn.cohort.toLowerCase() === cohortFilter.toLowerCase();

      const matchStatus =
        statusFilter === "all" ||
        lrn.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchCohort && matchStatus;
    });
  }, [learners, search, cohortFilter, statusFilter]);

  // Safe pagination
  const totalPages = Math.ceil(filteredLearners.length / pageSize) || 1;
  const paginatedLearners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLearners.slice(start, start + pageSize);
  }, [filteredLearners, currentPage]);

  const cohorts = useMemo(() => {
    const set = new Set(learners.map((l) => l.cohort));
    return ["all", ...Array.from(set)];
  }, [learners]);

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="learners-container">
      {/* Header */}
      <div className="learners-header">
        <div>
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span>
            <span className="separator">/</span>
            <span>Instructor</span>
            <span className="separator">/</span>
            <strong className="current">Learners</strong>
          </div>
          <h1 className="module-title">Learners</h1>
          <p className="module-sub">
            Track student progress and performance.
          </p>
        </div>

        <div className="learners-summary-pill">
          <Users size={16} />
          <strong>{learners.length} Learners</strong>
        </div>
      </div>

      {/* Modern Fixed Search and Filter Bar */}
      <div className="card learners-filter-card">
        {/* Search Input Box */}
        <div className="learners-search-wrap">
          <Search size={16} className="learners-search-icon" />
          <input
            type="text"
            className="learners-search-input"
            placeholder="Search learners by name, email, or course..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          {search && (
            <button
              type="button"
              className="learners-search-clear"
              onClick={clearSearch}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Controls Group */}
        <div className="learners-filter-controls">
          {/* Status Pills */}
          <div className="learners-status-pills">
            {["all", "active", "needs support", "completed"].map((st) => (
              <button
                key={st}
                type="button"
                className={`learners-status-pill ${statusFilter === st ? "active" : ""}`}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
              >
                {st === "all" ? "All" : st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>

          {/* Cohort Select Dropdown */}
          <div className="learners-cohort-dropdown">
            <Filter size={14} className="filter-icon" />
            <select
              value={cohortFilter}
              onChange={(e) => {
                setCohortFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by cohort"
            >
              {cohorts.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Cohorts" : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Search & Filter Banner */}
      {(search.trim() !== "" || cohortFilter !== "all" || statusFilter !== "all") && (
        <div className="learners-active-filter-bar">
          <div className="active-filter-info">
            <span>
              Showing <strong>{filteredLearners.length}</strong> matching results
              {search && <> for "<strong>{search}</strong>"</>}
              {cohortFilter !== "all" && <> in <strong>{cohortFilter}</strong></>}
              {statusFilter !== "all" && <> with status <strong>{statusFilter}</strong></>}
            </span>
          </div>
          <button
            type="button"
            className="btn-reset-filters"
            onClick={() => {
              setSearch("");
              setCohortFilter("all");
              setStatusFilter("all");
              setCurrentPage(1);
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Learners Table */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Enrolled Course</th>
                <th>Cohort</th>
                <th>Progress</th>
                <th>Quiz Avg</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLearners.length === 0 ? (
                <tr>
                  <td colSpan={8} className="learners-empty-cell">
                    <div className="learners-empty-state">
                      <Search size={32} className="text-muted" />
                      <h4>No learners match your criteria</h4>
                      <p>Try refining your search keyword or clearing active cohort filters.</p>
                      <button
                        type="button"
                        className="btn-clear-empty"
                        onClick={() => {
                          setSearch("");
                          setCohortFilter("all");
                          setStatusFilter("all");
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLearners.map((lrn) => {
                  const tone = getStatusTone(lrn.status);
                  return (
                    <tr key={lrn.id}>
                      <td>
                        <div className="learner-user-cell">
                          <div className="learner-avatar">
                            {lrn.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <strong>{lrn.name}</strong>
                            <small>{lrn.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="course-name-tag">{lrn.courseName}</span>
                      </td>
                      <td>
                        <span className="cohort-badge">{lrn.cohort}</span>
                      </td>
                      <td>
                        <div className="progress-cell">
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${lrn.progress}%` }}
                            />
                          </div>
                          <span>{lrn.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <strong className="quiz-score">{lrn.quizScore}%</strong>
                      </td>
                      <td>
                        <Badge tone={tone}>{lrn.status}</Badge>
                      </td>
                      <td>
                        <small className="last-active">{lrn.lastActive}</small>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title={`Send message to ${lrn.name}`}
                          onClick={() => alert(`Direct message composer opened for ${lrn.email}`)}
                        >
                          <Mail size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-bar">
          <small>
            Showing {paginatedLearners.length} of {filteredLearners.length} learners
          </small>

          <div className="pagination-buttons">
            <button
              type="button"
              className="page-btn"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="page-indicator">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
