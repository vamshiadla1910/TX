import React, { useMemo, useState } from "react";
import "./Internships.css";
import {
  Briefcase, CheckCircle2, Eye, Filter, Plus, Search,
  SearchX, UserCheck, Users, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Internships({
  internships,
  setInternships,
  setNotice
}) {
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return internships.filter(i => {
      const matchSearch = `${i.title} ${i.organization} ${i.mentor} ${i.type}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || i.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [internships, search, statusFilter]);

  const activeCount = internships.filter(i => i.status === "Active").length;
  const totalApplicants = internships.reduce((acc, i) => acc + (i.applicants || 0), 0);
  const totalSeats = internships.reduce((acc, i) => acc + (i.seats || 0), 0);

  function handleToggleStatus(id) {
    setInternships(prev =>
      prev.map(item => {
        if (item.id === id) {
          const next = item.status === "Active" ? "Closed" : "Active";
          const updated = { ...item, status: next };
          if (selectedInternship && selectedInternship.id === id) {
            setSelectedInternship(updated);
          }
          return updated;
        }
        return item;
      })
    );
    setNotice(`Internship program status toggled.`);
  }

  function handleShortlist(id) {
    setInternships(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, shortlisted: (item.shortlisted || 0) + 5 };
          if (selectedInternship && selectedInternship.id === id) {
            setSelectedInternship(updated);
          }
          return updated;
        }
        return item;
      })
    );
    setNotice(`Shortlisted 5 additional top applicants for technical interview.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="ACTIVE PROGRAMS" value={String(24 + activeCount - 2)} foot="Official & research tracks" icon={Briefcase} />
        <Metric label="TOTAL APPLICANTS" value={(1284 + totalApplicants).toLocaleString("en-IN")} foot="Student submissions" icon={Users} />
        <Metric label="AVAILABLE SEATS" value={String(totalSeats)} foot="Across industry partners" icon={UserCheck} />
        <Metric label="CERTIFICATES" value="612" foot="Issued upon completion" icon={CheckCircle2} />
      </div>

      {selectedInternship ? (
        <InlineDetailView
          title={selectedInternship.title}
          subtitle={`${selectedInternship.type} · ${selectedInternship.organization}`}
          status={selectedInternship.status}
          id={selectedInternship.id}
          onBack={() => setSelectedInternship(null)}
          actions={
            <>
              <button
                className={`secondary btn-sm ${selectedInternship.status === "Active" ? "btn-danger" : "btn-success"}`}
                onClick={() => handleToggleStatus(selectedInternship.id)}
              >
                {selectedInternship.status === "Active" ? "Close Applications" : "Activate Program"}
              </button>
              <button
                className="primary btn-sm"
                onClick={() => handleShortlist(selectedInternship.id)}
              >
                <UserCheck size={14} /> Shortlist Next 5
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Program Overview</h3>
              <div className="detail-fields-list">
                <DetailField label="Internship Title" value={selectedInternship.title} />
                <DetailField label="Sponsoring Organization" value={selectedInternship.organization} />
                <DetailField label="Program Type" value={selectedInternship.type} />
                <DetailField label="Duration" value={selectedInternship.duration} />
                <DetailField label="Monthly Stipend" value={selectedInternship.stipend} />
                <DetailField label="Location" value={selectedInternship.location} />
                <DetailField label="Application Deadline" value={selectedInternship.deadline} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Seats & Mentor Mentorship</h3>
              <div className="detail-fields-list">
                <DetailField label="Supervising Mentor" value={selectedInternship.mentor} />
                <DetailField label="Allocated Seats" value={`${selectedInternship.seats} Seats`} />
                <DetailField label="Total Applicants" value={`${selectedInternship.applicants} Candidates`} />
                <DetailField label="Shortlisted" value={`${selectedInternship.shortlisted || 0} Evaluated`} />
                <DetailField label="Program Status">
                  <Badge tone={getStatusTone(selectedInternship.status)}>{selectedInternship.status}</Badge>
                </DetailField>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Eligibility & Requirements</h3>
            <p className="detail-prose">{selectedInternship.requirements}</p>
          </div>

          <div className="detail-section">
            <h3>Roles & Key Responsibilities</h3>
            <p className="detail-prose">{selectedInternship.responsibilities}</p>
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Internship Opportunities & Cohorts</h2>
              <Badge>{filtered.length} shown</Badge>
            </div>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search internship title, organization, mentor..."
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
                <option value="Review">Under Review</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Internship Title</th>
                  <th>Organization</th>
                  <th>Duration</th>
                  <th>Stipend</th>
                  <th>Seats</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr
                    key={item.id}
                    className="hoverable-row"
                    onClick={() => setSelectedInternship(item)}
                  >
                    <td>
                      <strong>{item.title}</strong>
                      <small className="row-sub">{item.type} · {item.location}</small>
                    </td>
                    <td>{item.organization}</td>
                    <td>{item.duration}</td>
                    <td>{item.stipend}</td>
                    <td>{item.seats}</td>
                    <td><strong>{item.applicants}</strong></td>
                    <td><Badge tone={getStatusTone(item.status)}>{item.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedInternship(item);
                        }}
                      >
                        <Eye size={13} /> View Details
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
              <p>No internship programs found matching the filters.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
