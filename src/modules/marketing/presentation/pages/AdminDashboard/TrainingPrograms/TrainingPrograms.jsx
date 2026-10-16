import React, { useMemo, useState } from "react";
import "./TrainingPrograms.css";
import {
  Activity, CheckCircle2, Eye, Filter, Layers,
  Plus, Search, SearchX, Users, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function TrainingPrograms({
  trainingPrograms,
  setTrainingPrograms,
  setNotice,
  setPage
}) {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("All");

  const filtered = useMemo(() => {
    return trainingPrograms.filter(tp => {
      const matchSearch = `${tp.title} ${tp.organization} ${tp.mentor}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchMode = modeFilter === "All" || tp.deliveryMode.toLowerCase().includes(modeFilter.toLowerCase());
      return matchSearch && matchMode;
    });
  }, [trainingPrograms, search, modeFilter]);

  const onlineLive = trainingPrograms.filter(tp => tp.deliveryMode.toLowerCase().includes("online")).length;
  const hybrid = trainingPrograms.filter(tp => tp.deliveryMode.toLowerCase().includes("hybrid")).length;
  const offline = trainingPrograms.filter(tp => tp.deliveryMode.toLowerCase().includes("offline")).length;

  function handleToggleStatus(id) {
    setTrainingPrograms(prev =>
      prev.map(p => {
        if (p.id === id) {
          const next = p.status === "Active" ? "Archived" : "Active";
          const updated = { ...p, status: next };
          if (selectedProgram && selectedProgram.id === id) {
            setSelectedProgram(updated);
          }
          return updated;
        }
        return p;
      })
    );
    setNotice("Training program status updated.");
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="ACTIVE PROGRAMS" value={String(31 + trainingPrograms.length - 4)} foot="Across delivery modes" icon={Layers} />
        <Metric label="ONLINE LIVE" value={String(12 + onlineLive - 2)} foot="Instructor-led tracks" icon={Activity} />
        <Metric label="HYBRID TRACKS" value={String(8 + hybrid - 1)} foot="Online + lab sessions" icon={Users} />
        <Metric label="OFFLINE / ONSITE" value={String(11 + offline - 1)} foot="Campus classrooms" icon={CheckCircle2} />
      </div>

      {selectedProgram ? (
        <InlineDetailView
          title={selectedProgram.title}
          subtitle={`${selectedProgram.deliveryMode} · Organization: ${selectedProgram.organization}`}
          status={selectedProgram.status}
          id={selectedProgram.id}
          onBack={() => setSelectedProgram(null)}
          actions={
            <>
              <button
                className="secondary btn-sm"
                onClick={() => handleToggleStatus(selectedProgram.id)}
              >
                {selectedProgram.status === "Active" ? "Archive Program" : "Activate Program"}
              </button>
              <button
                className="primary btn-sm"
                onClick={() => setPage("Batches")}
              >
                Manage Batches
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Program Structure</h3>
              <div className="detail-fields-list">
                <DetailField label="Program Title" value={selectedProgram.title} />
                <DetailField label="Host Organization" value={selectedProgram.organization} />
                <DetailField label="Delivery Mode" value={selectedProgram.deliveryMode} />
                <DetailField label="Estimated Duration" value={selectedProgram.duration} />
                <DetailField label="Class Schedule" value={selectedProgram.schedule} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Faculty & Batches</h3>
              <div className="detail-fields-list">
                <DetailField label="Lead Instructor" value={selectedProgram.mentor} />
                <DetailField label="Active Cohorts" value={`${selectedProgram.batchesCount} Batches`} />
                <DetailField label="Enrolled Learners" value={`${selectedProgram.enrolledLearners} Students`} />
                <DetailField label="Lifecycle Status">
                  <Badge tone={getStatusTone(selectedProgram.status)}>{selectedProgram.status}</Badge>
                </DetailField>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Curriculum Highlights & Skills Taught</h3>
            <p className="detail-prose">{selectedProgram.curriculum}</p>
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>All Training Programs</h2>
              <Badge>{filtered.length} shown</Badge>
            </div>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search training program, organization, mentor..."
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Delivery Mode:</label>
              <select value={modeFilter} onChange={e => setModeFilter(e.target.value)}>
                <option value="All">All Modes</option>
                <option value="online">Online Live</option>
                <option value="hybrid">Hybrid</option>
                <option value="offline">Offline / Onsite</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Program Title</th>
                  <th>Organization</th>
                  <th>Delivery Mode</th>
                  <th>Duration</th>
                  <th>Active Batches</th>
                  <th>Learners</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tp => (
                  <tr
                    key={tp.id}
                    className="hoverable-row"
                    onClick={() => setSelectedProgram(tp)}
                  >
                    <td>
                      <strong>{tp.title}</strong>
                      <small className="row-sub">Faculty: {tp.mentor}</small>
                    </td>
                    <td>{tp.organization}</td>
                    <td><Badge tone="blue">{tp.deliveryMode}</Badge></td>
                    <td>{tp.duration}</td>
                    <td>{tp.batchesCount} Batches</td>
                    <td><strong>{tp.enrolledLearners}</strong></td>
                    <td><Badge tone={getStatusTone(tp.status)}>{tp.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedProgram(tp);
                        }}
                      >
                        <Eye size={13} /> Manage Program
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
              <p>No training programs match your filter.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
