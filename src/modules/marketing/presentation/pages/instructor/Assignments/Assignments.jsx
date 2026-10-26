import React, { useState, useMemo } from "react";
import { CheckCircle2, Clock, ExternalLink, FileCheck, Filter, MessageSquare, Search, Star, X } from "lucide-react";
import { Badge } from "../common/Badge";

export function Assignments({ assignments = [], onGradeAssignment }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAsg, setSelectedAsg] = useState(null);

  // Grade modal state
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState("");

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const matchSearch = (a.title + " " + a.student + " " + a.course).toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [assignments, search, statusFilter]);

  const pendingCount = assignments.filter((a) => a.status === "Pending Review").length;
  const gradedCount = assignments.filter((a) => a.status === "Graded").length;

  const handleOpenGrade = (asg) => {
    setSelectedAsg(asg);
    setGradeScore(asg.score || 95);
    setGradeFeedback(asg.feedback || "Great implementation! Code is clean and meets all rubrics.");
  };

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    if (!selectedAsg) return;
    if (onGradeAssignment) {
      onGradeAssignment(selectedAsg.id, Number(gradeScore), gradeFeedback);
    }
    setSelectedAsg(null);
  };

  return (
    <div className="assignments-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span> / <span>Instructor</span> / <strong className="current">Assignments & Submissions</strong>
          </div>
          <h1 className="module-title">Assignment Assessment & Code Grading</h1>
          <p className="module-sub">Review student capstone projects, lab submissions, and provide rubric-aligned feedback.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="card inst-kpi-card kpi-open-questions">
          <span className="inst-kpi-label">PENDING REVIEWS</span>
          <strong className="inst-kpi-value">{pendingCount}</strong>
          <small className="inst-kpi-foot warning">● Submissions awaiting evaluation</small>
        </div>
        <div className="card inst-kpi-card kpi-completion-rate">
          <span className="inst-kpi-label">GRADED SUBMISSIONS</span>
          <strong className="inst-kpi-value">{gradedCount}</strong>
          <small className="inst-kpi-foot positive">▲ 94.2% on-time grading SLA</small>
        </div>
        <div className="card inst-kpi-card kpi-average-rating">
          <span className="inst-kpi-label">AVERAGE RUBRIC SCORE</span>
          <strong className="inst-kpi-value">91.4 / 100</strong>
          <small className="inst-kpi-foot positive">Strong learner mastery</small>
        </div>
      </div>

      {/* Filters */}
      <div className="card filter-bar-card">
        <div className="search-input-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search by assignment title, student name, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {["All", "Pending Review", "Graded", "Needs Resubmission"].map((st) => (
            <button
              key={st}
              type="button"
              className={`filter-chip ${statusFilter === st ? "active" : ""}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="card submissions-table-card">
        <table className="dark-pro-table">
          <thead>
            <tr>
              <th>Assignment Title</th>
              <th>Student</th>
              <th>Course</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th>Score</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="table-row">
                <td>
                  <strong className="table-main-title">{item.title}</strong>
                  {item.repoUrl && (
                    <a href={item.repoUrl} target="_blank" rel="noreferrer" className="table-sub-link">
                      <ExternalLink size={11} /> View Code Repository
                    </a>
                  )}
                </td>
                <td>
                  <span className="student-name">{item.student}</span>
                </td>
                <td>
                  <span className="course-name-tag">{item.course}</span>
                </td>
                <td>
                  <span className="date-tag"><Clock size={11} /> {item.submittedAt}</span>
                </td>
                <td>
                  <Badge tone={item.status === "Graded" ? "success" : item.status === "Pending Review" ? "warning" : "danger"}>
                    {item.status}
                  </Badge>
                </td>
                <td>
                  {item.score !== null ? (
                    <strong className="score-val text-success">{item.score} / {item.maxScore}</strong>
                  ) : (
                    <span className="score-pending">—</span>
                  )}
                </td>
                <td className="text-right">
                  <button
                    type="button"
                    className="btn-action-sm"
                    onClick={() => handleOpenGrade(item)}
                  >
                    {item.status === "Graded" ? "Edit Feedback" : "Evaluate & Grade"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grading Modal */}
      {selectedAsg && (
        <div className="modal-backdrop" onClick={() => setSelectedAsg(null)}>
          <form className="card modal-dialog" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmitGrade}>
            <div className="modal-header">
              <div>
                <span className="cohort-code">EVALUATION RUBRIC</span>
                <h2>{selectedAsg.title}</h2>
                <small className="modal-sub">Student: {selectedAsg.student} · {selectedAsg.course}</small>
              </div>
              <button type="button" className="icon-button" onClick={() => setSelectedAsg(null)}><X size={16} /></button>
            </div>
            <div className="modal-body form-grid">
              <label>
                <span>Score (out of {selectedAsg.maxScore})</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                />
              </label>

              <label>
                <span>Detailed Instructor Feedback</span>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide constructive feedback, test suite notes, code smell critique..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setSelectedAsg(null)}>Cancel</button>
              <button type="submit" className="btn-primary-gradient">Publish Score & Feedback</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
