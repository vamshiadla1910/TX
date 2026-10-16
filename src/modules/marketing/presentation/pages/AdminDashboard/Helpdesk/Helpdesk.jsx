import React, { useMemo, useState } from "react";
import "./Helpdesk.css";
import {
  CheckCircle2, Clock, Eye, Filter, MessageSquare,
  Plus, Search, SearchX, Send, ShieldAlert, UserCheck, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Helpdesk({
  helpdeskTickets,
  setHelpdeskTickets,
  setNotice
}) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [replyText, setReplyText] = useState("");

  const filtered = useMemo(() => {
    return helpdeskTickets.filter(t => {
      const matchSearch = `${t.ticketId} ${t.subject} ${t.requester} ${t.tenant}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [helpdeskTickets, search, statusFilter, priorityFilter]);

  const openCount = helpdeskTickets.filter(t => t.status === "Open").length;
  const inProgressCount = helpdeskTickets.filter(t => t.status === "In Progress").length;
  const resolvedCount = helpdeskTickets.filter(t => t.status === "Resolved").length;

  function handleAssignToMe(ticketId) {
    setHelpdeskTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const updated = { ...t, assignedTo: "Platform Super Admin", status: "In Progress" };
          if (selectedTicket && selectedTicket.id === ticketId) {
            setSelectedTicket(updated);
          }
          return updated;
        }
        return t;
      })
    );
    setNotice(`Ticket ${selectedTicket?.ticketId} assigned to Super Admin.`);
  }

  function handleResolve(ticketId) {
    setHelpdeskTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const updated = { ...t, status: "Resolved" };
          if (selectedTicket && selectedTicket.id === ticketId) {
            setSelectedTicket(updated);
          }
          return updated;
        }
        return t;
      })
    );
    setNotice(`Ticket ${selectedTicket?.ticketId} marked Resolved.`);
  }

  function handleSendReply(e) {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setHelpdeskTickets(prev =>
      prev.map(t => {
        if (t.id === selectedTicket.id) {
          const updated = {
            ...t,
            status: "In Progress",
            description: `${t.description}\n\n[Super Admin Response]: ${replyText.trim()}`
          };
          setSelectedTicket(updated);
          return updated;
        }
        return t;
      })
    );
    setNotice(`Reply sent to ${selectedTicket.requester}. Ticket updated.`);
    setReplyText("");
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="OPEN TICKETS" value={String(openCount)} foot="Awaiting response" icon={Clock} tone={openCount > 0 ? "warning" : "positive"} />
        <Metric label="IN PROGRESS" value={String(inProgressCount)} foot="Under active investigation" icon={MessageSquare} />
        <Metric label="RESOLVED TODAY" value={String(resolvedCount + 35)} foot="SLA compliant" icon={CheckCircle2} />
        <Metric label="AVG RESOLUTION" value="1.4h" foot="Median response time" icon={Clock} />
      </div>

      {selectedTicket ? (
        <InlineDetailView
          title={`Ticket: ${selectedTicket.ticketId}`}
          subtitle={`${selectedTicket.subject} · Requester: ${selectedTicket.requester} (${selectedTicket.tenant})`}
          status={selectedTicket.status}
          id={selectedTicket.id}
          onBack={() => {
            setSelectedTicket(null);
            setReplyText("");
          }}
          actions={
            <>
              {selectedTicket.assignedTo !== "Platform Super Admin" && (
                <button
                  className="secondary btn-sm"
                  onClick={() => handleAssignToMe(selectedTicket.id)}
                >
                  <UserCheck size={14} /> Assign to Me
                </button>
              )}
              {selectedTicket.status !== "Resolved" && (
                <button
                  className="primary btn-sm"
                  onClick={() => handleResolve(selectedTicket.id)}
                >
                  <CheckCircle2 size={14} /> Mark Resolved
                </button>
              )}
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Ticket Meta</h3>
              <div className="detail-fields-list">
                <DetailField label="Ticket ID" value={selectedTicket.ticketId} mono />
                <DetailField label="Requester" value={selectedTicket.requester} />
                <DetailField label="Role" value={selectedTicket.role} />
                <DetailField label="Tenant / Organization" value={selectedTicket.tenant} />
                <DetailField label="Created On" value={selectedTicket.created} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Triage & Priority</h3>
              <div className="detail-fields-list">
                <DetailField label="Priority Level">
                  <Badge tone={selectedTicket.priority === "High" ? "danger" : selectedTicket.priority === "Medium" ? "warning" : "neutral"}>
                    {selectedTicket.priority} Priority
                  </Badge>
                </DetailField>
                <DetailField label="Assigned Agent" value={selectedTicket.assignedTo} />
                <DetailField label="Current Status">
                  <Badge tone={getStatusTone(selectedTicket.status)}>{selectedTicket.status}</Badge>
                </DetailField>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Issue Description</h3>
            <p className="detail-prose whitespace-pre-wrap">{selectedTicket.description}</p>
          </div>

          {selectedTicket.status !== "Resolved" && (
            <form className="detail-section" onSubmit={handleSendReply}>
              <h3>Send Support Response</h3>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Type response to send directly to requester..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                required
              />
              <div className="mt-2">
                <button className="primary btn-sm" type="submit">
                  <Send size={14} /> Send Reply & Update
                </button>
              </div>
            </form>
          )}
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Support Helpdesk Queue</h2>
              <Badge>{filtered.length} tickets</Badge>
            </div>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search ticket ID, subject, requester, tenant..."
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Priority:</label>
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                <option value="All">All Priorities</option>
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
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Requester</th>
                  <th>Tenant</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr
                    key={t.id}
                    className="hoverable-row"
                    onClick={() => setSelectedTicket(t)}
                  >
                    <td className="font-mono"><strong>{t.ticketId}</strong></td>
                    <td>{t.subject}</td>
                    <td>
                      <strong>{t.requester}</strong>
                      <small className="row-sub">{t.role}</small>
                    </td>
                    <td>{t.tenant}</td>
                    <td>
                      <Badge tone={t.priority === "High" ? "danger" : t.priority === "Medium" ? "warning" : "neutral"}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td><small>{t.assignedTo}</small></td>
                    <td><Badge tone={getStatusTone(t.status)}>{t.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedTicket(t);
                        }}
                      >
                        <Eye size={13} /> View Ticket
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
              <p>No tickets match the search filters.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
