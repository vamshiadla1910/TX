import React, { useMemo, useState } from "react";
import "./Approvals.css";
import {
  CheckCircle2, Clock, Eye, FileText, Filter,
  SearchX, ShieldAlert, ShieldCheck, XCircle, ArrowRight
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Approvals({
  approvals,
  setApprovals,
  setNotice
}) {
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [decisionNote, setDecisionNote] = useState("");

  const filtered = useMemo(() => {
    return approvals.filter(item => {
      const matchType = typeFilter === "All" || item.type.toLowerCase().includes(typeFilter.toLowerCase());
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchType && matchStatus;
    });
  }, [approvals, typeFilter, statusFilter]);

  const pendingCount = approvals.filter(a => a.status === "Pending" || a.status === "Overdue").length;
  const overdueCount = approvals.filter(a => a.status === "Overdue").length;
  const mentorVerifications = approvals.filter(a => a.type.toLowerCase().includes("mentor")).length;
  const orgOnboardings = approvals.filter(a => a.type.toLowerCase().includes("organization")).length;

  function handleApprove(id) {
    setApprovals(prev =>
      prev.map(a => {
        if (a.id === id) {
          const updated = {
            ...a,
            status: "Approved",
            sla: "Completed",
            decisionNote: decisionNote || "Approved according to platform policy."
          };
          if (selectedApproval && selectedApproval.id === id) {
            setSelectedApproval(updated);
          }
          return updated;
        }
        return a;
      })
    );
    setNotice(`Approval granted for "${selectedApproval?.title}". Status updated.`);
    setDecisionNote("");
  }

  function handleReject(id) {
    setApprovals(prev =>
      prev.map(a => {
        if (a.id === id) {
          const updated = {
            ...a,
            status: "Rejected",
            decisionNote: decisionNote || "Does not meet verification criteria."
          };
          if (selectedApproval && selectedApproval.id === id) {
            setSelectedApproval(updated);
          }
          return updated;
        }
        return a;
      })
    );
    setNotice(`Submission "${selectedApproval?.title}" has been rejected.`);
    setDecisionNote("");
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="PENDING APPROVALS" value={String(pendingCount)} foot="Awaiting review" icon={Clock} />
        <Metric label="PAST SLA" value={String(overdueCount)} foot="Breached turnaround" icon={ShieldAlert} tone={overdueCount > 0 ? "negative" : "positive"} />
        <Metric label="MENTOR VERIFICATIONS" value={String(mentorVerifications)} foot="Credentials check" icon={ShieldCheck} />
        <Metric label="ORG ONBOARDINGS" value={String(orgOnboardings)} foot="Tenant setup sign-offs" icon={CheckCircle2} />
      </div>

      {selectedApproval ? (
        <InlineDetailView
          title={selectedApproval.title}
          subtitle={`${selectedApproval.type} · Submitted by ${selectedApproval.submittedBy}`}
          status={selectedApproval.status}
          id={selectedApproval.id}
          onBack={() => {
            setSelectedApproval(null);
            setDecisionNote("");
          }}
          banner={
            selectedApproval.status === "Overdue" && (
              <div className="alert-banner danger">
                <ShieldAlert size={16} />
                <span>
                  <strong>SLA Alert:</strong> This submission has breached its turnaround SLA ({selectedApproval.sla}). Immediate administrative action required.
                </span>
              </div>
            )
          }
          actions={
            selectedApproval.status !== "Approved" && selectedApproval.status !== "Rejected" ? (
              <>
                <button
                  className="primary btn-sm"
                  onClick={() => handleApprove(selectedApproval.id)}
                >
                  <CheckCircle2 size={14} /> Approve Submission
                </button>
                <button
                  className="secondary btn-sm btn-danger"
                  onClick={() => handleReject(selectedApproval.id)}
                >
                  <XCircle size={14} /> Reject Submission
                </button>
              </>
            ) : (
              <span className="text-muted font-medium">Decision finalized ({selectedApproval.status})</span>
            )
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Submission Metadata</h3>
              <div className="detail-fields-list">
                <DetailField label="Submission Type" value={selectedApproval.type} />
                <DetailField label="Classification Category" value={selectedApproval.category} />
                <DetailField label="Submitted By" value={selectedApproval.submittedBy} />
                <DetailField label="Submission Date" value={selectedApproval.submittedDate} />
                <DetailField label="Assigned Reviewer" value={selectedApproval.reviewer} />
              </div>
            </div>

            <div className="detail-col">
              <h3>SLA & Review Pipeline</h3>
              <div className="detail-fields-list">
                <DetailField label="SLA Status">
                  <Badge tone={getStatusTone(selectedApproval.status)}>{selectedApproval.sla}</Badge>
                </DetailField>
                <DetailField label="Current Status">
                  <Badge tone={getStatusTone(selectedApproval.status)}>{selectedApproval.status}</Badge>
                </DetailField>
                {selectedApproval.decisionNote && (
                  <DetailField label="Review Decision Note" value={selectedApproval.decisionNote} />
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Submission Justification & Scope</h3>
            <p className="detail-prose">{selectedApproval.details}</p>
          </div>

          <div className="detail-section">
            <h3>Submitted Verification Documents</h3>
            {selectedApproval.documents && selectedApproval.documents.length > 0 ? (
              <div className="doc-pills">
                {selectedApproval.documents.map((doc, idx) => (
                  <div key={idx} className="doc-pill">
                    <FileText size={14} className="text-blue" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted italic">No attached documents.</p>
            )}
          </div>

          {selectedApproval.status !== "Approved" && selectedApproval.status !== "Rejected" && (
            <div className="detail-section">
              <h3>Approval Review Decision Notes</h3>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Enter internal review notes or rationale for approval/rejection..."
                value={decisionNote}
                onChange={e => setDecisionNote(e.target.value)}
              />
            </div>
          )}
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Governance Approval Queue</h2>
              <Badge>{filtered.length} shown</Badge>
            </div>
          </div>

          <div className="filter-toolbar">
            <div className="filter-group">
              <label>Module Type:</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Course">Course publication</option>
                <option value="Organization">Organization onboarding</option>
                <option value="Mentor">Mentor verification</option>
                <option value="Training">Training program launch</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue SLA</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Request Title</th>
                  <th>Type</th>
                  <th>Submitted By</th>
                  <th>Submitted Date</th>
                  <th>SLA</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr
                    key={item.id}
                    className="hoverable-row"
                    onClick={() => setSelectedApproval(item)}
                  >
                    <td>
                      <strong>{item.title}</strong>
                      <small className="row-sub">{item.category}</small>
                    </td>
                    <td><Badge tone="neutral">{item.type}</Badge></td>
                    <td>{item.submittedBy}</td>
                    <td>{item.submittedDate}</td>
                    <td>
                      <span className={item.status === "Overdue" ? "text-danger font-medium" : "text-muted"}>
                        {item.sla}
                      </span>
                    </td>
                    <td><Badge tone={getStatusTone(item.status)}>{item.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedApproval(item);
                        }}
                      >
                        <Eye size={13} /> Review Item
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <SearchX size={28} />
              <p>No approval requests match the selected filters.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
