import React, { useMemo, useState } from "react";
import "./Batches.css";
import {
  Calendar, CheckCircle2, Clock, Eye, Filter,
  Plus, Search, SearchX, UserCheck, Users, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Batches({
  batches,
  setBatches,
  setNotice
}) {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return batches.filter(b => {
      const matchSearch = `${b.code} ${b.program} ${b.mentor} ${b.organization}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [batches, search, statusFilter]);

  const activeCount = batches.filter(b => b.status === "Active").length;
  const capacityAlerts = batches.filter(b => b.status === "Near capacity" || b.learners >= b.capacity).length;
  const totalLearners = batches.reduce((acc, b) => acc + (b.learners || 0), 0);

  function handleIncreaseCapacity(id) {
    setBatches(prev =>
      prev.map(b => {
        if (b.id === id) {
          const newCap = b.capacity + 10;
          const updated = {
            ...b,
            capacity: newCap,
            status: b.learners >= newCap ? "Near capacity" : "Active"
          };
          if (selectedBatch && selectedBatch.id === id) {
            setSelectedBatch(updated);
          }
          return updated;
        }
        return b;
      })
    );
    setNotice(`Batch capacity increased by +10 seats.`);
  }

  function handleCompleteBatch(id) {
    setBatches(prev =>
      prev.map(b => {
        if (b.id === id) {
          const updated = { ...b, status: "Completed", completionRate: "100%" };
          if (selectedBatch && selectedBatch.id === id) {
            setSelectedBatch(updated);
          }
          return updated;
        }
        return b;
      })
    );
    setNotice(`Batch marked as Completed.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="ACTIVE BATCHES" value={String(84 + batches.length - 4)} foot="Across learning programs" icon={Calendar} />
        <Metric label="ASSIGNED LEARNERS" value={(8240 + totalLearners).toLocaleString("en-IN")} foot="Active students" icon={Users} />
        <Metric label="UPCOMING SESSIONS" value="46" foot="Scheduled this week" icon={Clock} />
        <Metric label="CAPACITY ALERTS" value={String(capacityAlerts)} foot="Near limit" icon={CheckCircle2} tone={capacityAlerts > 0 ? "warning" : "positive"} />
      </div>

      {selectedBatch ? (
        <InlineDetailView
          title={`Batch: ${selectedBatch.code}`}
          subtitle={`${selectedBatch.program} · ${selectedBatch.organization}`}
          status={selectedBatch.status}
          id={selectedBatch.id}
          onBack={() => setSelectedBatch(null)}
          actions={
            <>
              <button
                className="secondary btn-sm"
                onClick={() => handleIncreaseCapacity(selectedBatch.id)}
              >
                <Plus size={14} /> Add 10 Seats
              </button>
              {selectedBatch.status !== "Completed" && (
                <button
                  className="primary btn-sm"
                  onClick={() => handleCompleteBatch(selectedBatch.id)}
                >
                  <CheckCircle2 size={14} /> Mark Completed
                </button>
              )}
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Batch Timetable & Identity</h3>
              <div className="detail-fields-list">
                <DetailField label="Batch Code" value={selectedBatch.code} mono />
                <DetailField label="Learning Program" value={selectedBatch.program} />
                <DetailField label="Host Institution" value={selectedBatch.organization} />
                <DetailField label="Weekly Schedule" value={selectedBatch.schedule} />
                <DetailField label="Start Date" value={selectedBatch.startDate} />
                <DetailField label="Scheduled End Date" value={selectedBatch.endDate} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Faculty & Seat Capacity</h3>
              <div className="detail-fields-list">
                <DetailField label="Assigned Mentor" value={selectedBatch.mentor} />
                <DetailField label="Batch Status">
                  <Badge tone={getStatusTone(selectedBatch.status)}>{selectedBatch.status}</Badge>
                </DetailField>
                <DetailField label="Completion Rate" value={selectedBatch.completionRate} />
                <DetailField label="Seat Utilization">
                  <div className="progress-inline">
                    <div className="progress">
                      <i
                        style={{
                          width: `${Math.min(100, (selectedBatch.learners / selectedBatch.capacity) * 100)}%`,
                          background: (selectedBatch.learners / selectedBatch.capacity) >= 0.95 ? "#d34f42" : undefined
                        }}
                      />
                    </div>
                    <span>{selectedBatch.learners} / {selectedBatch.capacity} Seats</span>
                  </div>
                </DetailField>
              </div>
            </div>
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>All Active Batches</h2>
              <Badge>{filtered.length} shown</Badge>
            </div>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search batch code, program, mentor, organization..."
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
                <option value="Active">Active</option>
                <option value="Near capacity">Near Capacity</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Batch Code</th>
                  <th>Program</th>
                  <th>Organization</th>
                  <th>Mentor</th>
                  <th>Learners</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr
                    key={b.id}
                    className="hoverable-row"
                    onClick={() => setSelectedBatch(b)}
                  >
                    <td className="font-mono"><strong>{b.code}</strong></td>
                    <td>{b.program}</td>
                    <td>{b.organization}</td>
                    <td>{b.mentor}</td>
                    <td>
                      <strong>{b.learners}</strong> / {b.capacity}
                    </td>
                    <td><small>{b.schedule}</small></td>
                    <td><Badge tone={getStatusTone(b.status)}>{b.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedBatch(b);
                        }}
                      >
                        <Eye size={13} /> Manage Batch
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
              <p>No batches match the search criteria.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
