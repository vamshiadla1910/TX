import React, { useState } from "react";
import { Calendar, Clock, ExternalLink, Play, Plus, Radio, Users, Video, X } from "lucide-react";
import { Badge } from "../common/Badge";

export function LiveSessions({ sessions = [], onAddSession }) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("Distributed Microservices & Kubernetes Architecture");
  const [dateTime, setDateTime] = useState("Tomorrow, 6:00 PM IST");
  const [duration, setDuration] = useState("90 Mins");
  const [agenda, setAgenda] = useState("");

  const upcomingCount = sessions.filter((s) => s.status === "Upcoming" || s.status === "Scheduled").length;
  const totalAttendees = sessions.reduce((acc, s) => acc + (s.attendees || 0), 0);

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newSession = {
      id: `sess-${Date.now()}`,
      title,
      course,
      dateTime,
      duration,
      platform: "Pathwing Live Classroom",
      attendees: 0,
      status: "Scheduled",
      meetingUrl: "https://meet.pathwing.in/class/live-new-session",
      agenda: agenda || "Interactive mentoring and live code walkthrough."
    };
    if (onAddSession) onAddSession(newSession);
    setShowScheduleModal(false);
    setTitle("");
    setAgenda("");
  };

  return (
    <div className="live-sessions-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span> / <span>Instructor</span> / <strong className="current">Live Classroom & Sessions</strong>
          </div>
          <h1 className="module-title">Live Classroom & Interactive Webinars</h1>
          <p className="module-sub">Host live interactive engineering sessions, office hours, and broadcast system design deep dives.</p>
        </div>
        <button
          type="button"
          className="btn-primary-gradient"
          onClick={() => setShowScheduleModal(true)}
        >
          <Plus size={16} />
          <span>Schedule Live Class</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="card inst-kpi-card kpi-active-learners">
          <span className="inst-kpi-label">UPCOMING SESSIONS</span>
          <strong className="inst-kpi-value">{upcomingCount}</strong>
          <small className="inst-kpi-foot positive">● Next session starts today</small>
        </div>
        <div className="card inst-kpi-card kpi-completion-rate">
          <span className="inst-kpi-label">TOTAL LIVE ATTENDEES</span>
          <strong className="inst-kpi-value">{totalAttendees}</strong>
          <small className="inst-kpi-foot positive">▲ 88.4% live show-up rate</small>
        </div>
        <div className="card inst-kpi-card kpi-average-rating">
          <span className="inst-kpi-label">SESSION ENGAGEMENT</span>
          <strong className="inst-kpi-value">4.96 ★</strong>
          <small className="inst-kpi-foot positive">Based on 280 attendee ratings</small>
        </div>
      </div>

      {/* Sessions Cards Grid */}
      <div className="sessions-grid">
        {sessions.map((sess) => (
          <div key={sess.id} className="card session-card">
            <div className="session-top">
              <span className="session-course-tag">{sess.course}</span>
              <Badge tone={sess.status === "Upcoming" ? "danger" : sess.status === "Scheduled" ? "purple" : "neutral"}>
                {sess.status === "Upcoming" ? "🔴 Live Today" : sess.status}
              </Badge>
            </div>

            <h3 className="session-title">{sess.title}</h3>
            <p className="session-agenda">{sess.agenda}</p>

            <div className="session-meta-chips">
              <span className="meta-chip"><Calendar size={13} /> {sess.dateTime}</span>
              <span className="meta-chip"><Clock size={13} /> {sess.duration}</span>
              <span className="meta-chip"><Users size={13} /> {sess.attendees} registered</span>
            </div>

            <div className="session-actions">
              {sess.status === "Upcoming" || sess.status === "Scheduled" ? (
                <a
                  href={sess.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-launch-live"
                >
                  <Radio size={14} className="pulse-icon" />
                  <span>Enter Live Classroom</span>
                </a>
              ) : (
                <a
                  href={sess.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-view-recording"
                >
                  <Play size={14} />
                  <span>Watch Past Recording</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-backdrop" onClick={() => setShowScheduleModal(false)}>
          <form className="card modal-dialog" onClick={(e) => e.stopPropagation()} onSubmit={handleScheduleSubmit}>
            <div className="modal-header">
              <h2>Schedule Live Interactive Session</h2>
              <button type="button" className="icon-button" onClick={() => setShowScheduleModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body form-grid">
              <label>
                <span>Session Title</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus Algorithms & Raft Walkthrough"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label>
                <span>Target Course</span>
                <select value={course} onChange={(e) => setCourse(e.target.value)}>
                  <option value="Distributed Microservices & Kubernetes Architecture">Distributed Microservices & Kubernetes Architecture</option>
                  <option value="Java Full Stack Development">Java Full Stack Development</option>
                  <option value="AWS DevOps Engineer Professional">AWS DevOps Engineer Professional</option>
                  <option value="React 19 & Next.js Full Stack Engineering">React 19 & Next.js Full Stack Engineering</option>
                </select>
              </label>

              <label>
                <span>Date & Time</span>
                <input
                  type="text"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                />
              </label>

              <label>
                <span>Expected Duration</span>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </label>

              <label>
                <span>Session Agenda & Learning Goals</span>
                <textarea
                  rows="3"
                  placeholder="Topics to be covered during live broadcast..."
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary-gradient">Publish Session Schedule</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
