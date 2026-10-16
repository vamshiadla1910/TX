import React, { useMemo, useState } from "react";
import "./SecurityAudit.css";
import {
  Activity, AlertTriangle, CheckCircle2, Download, Eye,
  Filter, LockKeyhole, Search, SearchX, ShieldAlert, ShieldCheck, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function SecurityAudit({
  securityEvents,
  setSecurityEvents,
  setNotice
}) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  const filtered = useMemo(() => {
    return securityEvents.filter(e => {
      const matchSearch = `${e.actor} ${e.action} ${e.target} ${e.ip}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchSev = severityFilter === "All" || e.severity === severityFilter;
      return matchSearch && matchSev;
    });
  }, [securityEvents, search, severityFilter]);

  function handleExportAuditLog() {
    const csvData = "Timestamp,Actor,Action,Target,IP Address,Severity,Details\n" +
      securityEvents.map(e => `"${e.timestamp}","${e.actor}","${e.action}","${e.target}","${e.ip}","${e.severity}","${e.details}"`).join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pathwing_security_audit_log_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    setNotice("Security audit log exported as CSV file.");
  }

  function handleMarkReviewed(id) {
    setSecurityEvents(prev =>
      prev.map(e => {
        if (e.id === id) {
          const updated = { ...e, details: `${e.details} [Reviewed by Super Admin]` };
          if (selectedLog && selectedLog.id === id) {
            setSelectedLog(updated);
          }
          return updated;
        }
        return e;
      })
    );
    setNotice("Audit log marked as reviewed by Super Admin.");
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="OPEN INCIDENTS" value="2" foot="Both P3 priority" icon={Activity} tone="negative" />
        <Metric label="SYSTEM STATUS" value="Operational" foot="5 services monitored" icon={ShieldCheck} />
        <Metric label="AUDIT TRAIL" value="Active" foot="Immutable logging" icon={LockKeyhole} />
        <Metric label="SECURITY GATEWAY" value="Enforced" foot="Rate limiting active" icon={ShieldAlert} />
      </div>

      {selectedLog ? (
        <InlineDetailView
          title={`Audit Event: ${selectedLog.action}`}
          subtitle={`Logged on ${selectedLog.timestamp} · Actor: ${selectedLog.actor}`}
          status={selectedLog.severity}
          id={selectedLog.id}
          onBack={() => setSelectedLog(null)}
          actions={
            <button
              className="primary btn-sm"
              onClick={() => handleMarkReviewed(selectedLog.id)}
            >
              <CheckCircle2 size={14} /> Mark Reviewed
            </button>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Event Execution Context</h3>
              <div className="detail-fields-list">
                <DetailField label="Action Identifier" value={selectedLog.action} mono />
                <DetailField label="Actor Principal" value={selectedLog.actor} />
                <DetailField label="Originating IP" value={selectedLog.ip} mono />
                <DetailField label="Timestamp (UTC+5:30)" value={selectedLog.timestamp} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Target & Severity</h3>
              <div className="detail-fields-list">
                <DetailField label="Target Resource" value={selectedLog.target} />
                <DetailField label="Severity Rating">
                  <Badge tone={selectedLog.severity === "Critical" ? "danger" : selectedLog.severity === "High" ? "warning" : "blue"}>
                    {selectedLog.severity}
                  </Badge>
                </DetailField>
                <DetailField label="Integrity Signature" value="SHA256: e82b...910a" mono />
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Payload & Event Narrative</h3>
            <p className="detail-prose">{selectedLog.details}</p>
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Governance & Security Audit Trail</h2>
              <Badge>{filtered.length} events</Badge>
            </div>
            <button className="secondary btn-sm" onClick={handleExportAuditLog}>
              <Download size={14} /> Export Audit Log
            </button>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search actor, action, target entity, IP..."
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Severity:</label>
              <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Target Entity</th>
                  <th>IP Address</th>
                  <th>Severity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr
                    key={e.id}
                    className="hoverable-row"
                    onClick={() => setSelectedLog(e)}
                  >
                    <td><small>{e.timestamp}</small></td>
                    <td>{e.actor}</td>
                    <td className="font-mono"><strong>{e.action}</strong></td>
                    <td>{e.target}</td>
                    <td className="font-mono">{e.ip}</td>
                    <td>
                      <Badge tone={e.severity === "Critical" ? "danger" : e.severity === "High" ? "warning" : "blue"}>
                        {e.severity}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={evt => {
                          evt.stopPropagation();
                          setSelectedLog(e);
                        }}
                      >
                        <Eye size={13} /> Details
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
              <p>No security events found matching criteria.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
