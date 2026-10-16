import React, { useMemo, useState } from "react";
import "./Moderation.css";
import {
  Activity, ArrowRight, BookOpen, CheckCircle2, ChevronRight,
  Eye, FileText, SearchX, ShieldAlert, Users, XCircle, ArrowLeft
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Moderation({
  courses,
  setCourses,
  selectedModerationCourse,
  setSelectedModerationCourse,
  setNotice
}) {
  const [slaFilter, setSlaFilter] = useState("All");
  const [reviewerNote, setReviewerNote] = useState("");

  const pendingCourses = useMemo(() => {
    return courses.filter(c => c.status === "Overdue" || c.status === "Pending Review");
  }, [courses]);

  const filtered = useMemo(() => {
    if (slaFilter === "All") return pendingCourses;
    return pendingCourses.filter(c => c.status === slaFilter);
  }, [pendingCourses, slaFilter]);

  const overdueCount = pendingCourses.filter(c => c.status === "Overdue").length;
  const inReviewCount = pendingCourses.filter(c => c.assignedReviewer && c.assignedReviewer !== "Unassigned").length;

  function handleApprove(courseId) {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const updated = {
            ...c,
            status: "Published",
            slaStatus: "Approved by Moderation"
          };
          if (selectedModerationCourse && selectedModerationCourse.id === courseId) {
            setSelectedModerationCourse(null);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice(`Course submission approved and published successfully. Catalog updated.`);
    setReviewerNote("");
  }

  function handleRequestRevisions(courseId) {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const updated = {
            ...c,
            status: "Draft",
            slaStatus: "Revisions Requested",
            rejectionReason: reviewerNote || "Revisions required for curriculum compliance."
          };
          if (selectedModerationCourse && selectedModerationCourse.id === courseId) {
            setSelectedModerationCourse(null);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice(`Feedback dispatched to course author. Submission returned for revision.`);
    setReviewerNote("");
  }

  function handleReject(courseId) {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const updated = {
            ...c,
            status: "Rejected",
            slaStatus: "Rejected",
            rejectionReason: reviewerNote || "Course content does not meet platform quality standards."
          };
          if (selectedModerationCourse && selectedModerationCourse.id === courseId) {
            setSelectedModerationCourse(null);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice(`Course submission rejected.`);
    setReviewerNote("");
  }

  function handleAssignReviewer(courseId, reviewer) {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const updated = { ...c, assignedReviewer: reviewer };
          if (selectedModerationCourse && selectedModerationCourse.id === courseId) {
            setSelectedModerationCourse(updated);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice(`Assigned reviewer "${reviewer}" to course.`);
  }

  return (
    <>
      <div className="metrics-grid three">
        <Metric label="PENDING REVIEW" value={String(pendingCourses.length)} foot="Awaiting moderation" icon={BookOpen} />
        <Metric label="PAST SLA" value={String(overdueCount)} foot="Immediate triage needed" icon={Activity} tone={overdueCount > 0 ? "negative" : "positive"} />
        <Metric label="ASSIGNED IN REVIEW" value={String(inReviewCount)} foot="Under evaluation" icon={Users} />
      </div>

      {selectedModerationCourse ? (
        <InlineDetailView
          title={`Review: ${selectedModerationCourse.title}`}
          subtitle={`Submitted by ${selectedModerationCourse.instructor} (${selectedModerationCourse.organization})`}
          status={selectedModerationCourse.status}
          id={selectedModerationCourse.id}
          onBack={() => {
            setSelectedModerationCourse(null);
            setReviewerNote("");
          }}
          banner={
            selectedModerationCourse.status === "Overdue" && (
              <div className="alert-banner danger">
                <ShieldAlert size={16} />
                <span>
                  <strong>SLA Breached:</strong> This course was submitted on {selectedModerationCourse.submittedDate} and has exceeded the 48-hour SLA review window. Prioritize immediate review.
                </span>
              </div>
            )
          }
          actions={
            <>
              <button
                className="primary btn-sm"
                onClick={() => handleApprove(selectedModerationCourse.id)}
              >
                <CheckCircle2 size={14} /> Approve & Publish
              </button>
              <button
                className="secondary btn-sm"
                onClick={() => handleRequestRevisions(selectedModerationCourse.id)}
              >
                Request Revisions
              </button>
              <button
                className="secondary btn-sm btn-danger"
                onClick={() => handleReject(selectedModerationCourse.id)}
              >
                <XCircle size={14} /> Reject
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Submission & Curriculum Details</h3>
              <div className="detail-fields-list">
                <DetailField label="Course Title" value={selectedModerationCourse.title} />
                <DetailField label="Host Organization" value={selectedModerationCourse.organization} />
                <DetailField label="Instructor" value={selectedModerationCourse.instructor} />
                <DetailField label="Category / Discipline" value={selectedModerationCourse.category} />
                <DetailField label="Level & Duration" value={`${selectedModerationCourse.level} · ${selectedModerationCourse.duration}`} />
                <DetailField label="Modules Count" value={`${selectedModerationCourse.modulesCount} Learning Units`} />
                <DetailField label="Proposed Price" value={selectedModerationCourse.price} />
              </div>
            </div>

            <div className="detail-col">
              <h3>SLA & Reviewer Assignment</h3>
              <div className="detail-fields-list">
                <DetailField label="Submission Date" value={selectedModerationCourse.submittedDate} />
                <DetailField label="SLA Policy" value="48 Hours from Submission" />
                <DetailField label="SLA Health Status">
                  <Badge tone={selectedModerationCourse.status === "Overdue" ? "danger" : "warning"}>
                    {selectedModerationCourse.slaStatus || selectedModerationCourse.status}
                  </Badge>
                </DetailField>
                <DetailField label="Reviewer in Charge">
                  <select
                    className="select-inline"
                    value={selectedModerationCourse.assignedReviewer || "Unassigned"}
                    onChange={e => handleAssignReviewer(selectedModerationCourse.id, e.target.value)}
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Sunil Nambiar">Sunil Nambiar (Platform Admin)</option>
                    <option value="Vikram Patel">Vikram Patel (Lead Faculty)</option>
                    <option value="Platform Review Team">Platform Review Team</option>
                  </select>
                </DetailField>
                <DetailField label="Verification Check">
                  <span className="text-success font-medium">✓ Auto-code plagiarism check passed</span>
                </DetailField>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Course Description & Learning Outcomes</h3>
            <p className="detail-prose">{selectedModerationCourse.description}</p>
            <DetailField label="Student Prerequisites" value={selectedModerationCourse.prerequisites} />
          </div>

          {selectedModerationCourse.syllabus && selectedModerationCourse.syllabus.length > 0 && (
            <div className="detail-section">
              <h3>Syllabus Breakdown ({selectedModerationCourse.syllabus.length} Modules)</h3>
              <div className="syllabus-list">
                {selectedModerationCourse.syllabus.map((s, idx) => (
                  <div key={idx} className="syllabus-item">
                    <span className="syllabus-idx">{idx + 1}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3>Moderator Evaluation Notes</h3>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Enter feedback or revision notes for instructor before approving or requesting changes..."
              value={reviewerNote}
              onChange={e => setReviewerNote(e.target.value)}
            />
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Course Submissions Awaiting Moderation</h2>
              <Badge>{filtered.length} pending</Badge>
            </div>
            <div className="filter-group">
              <label>SLA Filter:</label>
              <select value={slaFilter} onChange={e => setSlaFilter(e.target.value)}>
                <option value="All">All Submissions</option>
                <option value="Overdue">Overdue SLA Only</option>
                <option value="Pending Review">Within SLA</option>
              </select>
            </div>
          </div>

          <div className="stack-cards p-3">
            {filtered.map(c => (
              <div
                className="card course-row hoverable-row"
                key={c.id}
                onClick={() => setSelectedModerationCourse(c)}
              >
                <div>
                  <strong>{c.title}</strong>
                  <small>
                    {c.organization} · Instructor: {c.instructor} · Submitted: {c.submittedDate} · Reviewer: {c.assignedReviewer || "Unassigned"}
                  </small>
                </div>
                <Badge tone={c.status === "Overdue" ? "danger" : "blue"}>
                  {c.status}
                </Badge>
                <button
                  className="secondary btn-sm"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedModerationCourse(c);
                  }}
                >
                  Review course <ArrowRight size={14} />
                </button>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="empty">
                <CheckCircle2 size={32} className="text-success" />
                <p>All course submissions have been reviewed and approved!</p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
