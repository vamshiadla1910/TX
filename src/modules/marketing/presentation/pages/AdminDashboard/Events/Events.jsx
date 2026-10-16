import React, { useMemo, useState } from "react";
import "./Events.css";
import {
  Activity, Calendar, CheckCircle2, Download, Eye,
  Filter, MapPin, Plus, Search, SearchX, Users, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Events({
  events,
  setEvents,
  setNotice
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchSearch = `${e.title} ${e.organization} ${e.venue || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchType = typeFilter === "All" || e.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [events, search, typeFilter]);

  const totalRegistrations = events.reduce((acc, e) => acc + (e.registrations || 0), 0);

  function handleToggleStatus(id) {
    setEvents(prev =>
      prev.map(item => {
        if (item.id === id) {
          const next = item.status === "Upcoming" ? "Registration open" : "Upcoming";
          const updated = { ...item, status: next };
          if (selectedEvent && selectedEvent.id === id) {
            setSelectedEvent(updated);
          }
          return updated;
        }
        return item;
      })
    );
    setNotice(`Event status updated.`);
  }

  function handleExportRoster(event) {
    const csvContent = "data:text/csv;charset=utf-8," +
      `Event Title,Type,Date,Venue,Registrations,Capacity\n` +
      `"${event.title}","${event.type}","${event.date}","${event.venue}","${event.registrations}","${event.capacity}"\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event.title.replace(/[^a-z0-9]/gi, "_")}_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotice(`Attendee roster for "${event.title}" downloaded as CSV.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="UPCOMING EVENTS" value={String(12 + events.length - 4)} foot="Hackathons & workshops" icon={Calendar} />
        <Metric label="REGISTRATIONS" value={(2410 + totalRegistrations).toLocaleString("en-IN")} foot="Student attendees" icon={Users} />
        <Metric label="DELIVERY MODES" value="Online & Onsite" foot="Hybrid infrastructure" icon={Activity} />
        <Metric label="CERTIFICATES" value="428" foot="Participation credentials" icon={CheckCircle2} />
      </div>

      {selectedEvent ? (
        <InlineDetailView
          title={selectedEvent.title}
          subtitle={`${selectedEvent.type} · Hosted by ${selectedEvent.organization}`}
          status={selectedEvent.status}
          id={selectedEvent.id}
          onBack={() => setSelectedEvent(null)}
          actions={
            <>
              <button
                className="secondary btn-sm"
                onClick={() => handleToggleStatus(selectedEvent.id)}
              >
                Toggle Status
              </button>
              <button
                className="primary btn-sm"
                onClick={() => handleExportRoster(selectedEvent)}
              >
                <Download size={14} /> Download Attendee CSV
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Event Logistics & Venue</h3>
              <div className="detail-fields-list">
                <DetailField label="Event Title" value={selectedEvent.title} />
                <DetailField label="Classification" value={selectedEvent.type} />
                <DetailField label="Host Organization" value={selectedEvent.organization} />
                <DetailField label="Date & Schedule" value={selectedEvent.date} />
                <DetailField label="Delivery Mode" value={selectedEvent.mode} />
                <DetailField label="Venue / Stream Link" value={selectedEvent.venue} />
                <DetailField label="Ticket Price" value={selectedEvent.ticketPrice} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Capacity & Guest Speakers</h3>
              <div className="detail-fields-list">
                <DetailField label="Keynote Speakers" value={selectedEvent.speakers} />
                <DetailField label="Prizes / Awards" value={selectedEvent.prizes} />
                <DetailField label="Registration Status">
                  <Badge tone={getStatusTone(selectedEvent.status)}>{selectedEvent.status}</Badge>
                </DetailField>
                <DetailField label="Capacity Utilization">
                  <div className="progress-inline">
                    <div className="progress">
                      <i style={{ width: `${Math.min(100, (selectedEvent.registrations / selectedEvent.capacity) * 100)}%` }} />
                    </div>
                    <span>{selectedEvent.registrations} / {selectedEvent.capacity} ({Math.round((selectedEvent.registrations / selectedEvent.capacity) * 100)}%)</span>
                  </div>
                </DetailField>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Event Description & Agenda</h3>
            <p className="detail-prose">{selectedEvent.description}</p>
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>All Events & Hackathons</h2>
              <Badge>{filtered.length} shown</Badge>
            </div>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search event title, host, venue..."
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Event Type:</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Bootcamp">Bootcamp</option>
                <option value="Webinar">Webinar</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Type</th>
                  <th>Host</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th>Registrations</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr
                    key={e.id}
                    className="hoverable-row"
                    onClick={() => setSelectedEvent(e)}
                  >
                    <td>
                      <strong>{e.title}</strong>
                      <small className="row-sub">{e.venue}</small>
                    </td>
                    <td><Badge tone="blue">{e.type}</Badge></td>
                    <td>{e.organization}</td>
                    <td>{e.mode}</td>
                    <td><small>{e.date}</small></td>
                    <td><strong>{e.registrations}</strong> / {e.capacity}</td>
                    <td><Badge tone={getStatusTone(e.status)}>{e.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={evt => {
                          evt.stopPropagation();
                          setSelectedEvent(e);
                        }}
                      >
                        <Eye size={13} /> View Event
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
              <p>No events match the search filter.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
