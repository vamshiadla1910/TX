import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle2, Clock3, CircleAlert, ShieldCheck, User, BookOpen,
  CalendarDays, GraduationCap, Building2, Award, BriefcaseBusiness,
  FileText, Download, Edit2, Trash2, Check, ArrowRight
} from 'lucide-react';
import { triggerDownload, buildCSV } from '../data/storage.js';

export default function RecordDetailModal({
  isOpen,
  type,
  record,
  onClose,
  onUpdateRecord,
  onDeleteRecord,
  onOpenEdit,
  flash
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // State for compliance review editing
  const [complianceStatus, setComplianceStatus] = useState('');
  const [complianceOwner, setComplianceOwner] = useState('');
  const [complianceDueDate, setComplianceDueDate] = useState('');
  const [complianceNotes, setComplianceNotes] = useState('');
  const [isEditingCompliance, setIsEditingCompliance] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state whenever record changes
  useEffect(() => {
    if (record && type === 'compliance') {
      setComplianceStatus(record.status || 'In review');
      setComplianceOwner(record.owner || '');
      setComplianceDueDate(record.dueDate || '');
      setComplianceNotes(record.notes || '');
      setIsEditingCompliance(false);
      setErrorMsg('');
    }
  }, [record, type]);

  if (!isOpen || !record) return null;

  function handleSaveCompliance(newStatus) {
    const statusToSave = newStatus || complianceStatus;
    if (!complianceOwner.trim()) {
      setErrorMsg('Requirement owner cannot be empty.');
      return;
    }
    if (!complianceDueDate.trim()) {
      setErrorMsg('Due date is required.');
      return;
    }

    const updated = {
      ...record,
      status: statusToSave,
      owner: complianceOwner.trim(),
      dueDate: complianceDueDate.trim(),
      notes: complianceNotes.trim(),
      lastReviewed: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} IST by Tenant Admin`
    };

    onUpdateRecord('compliance', updated);
    setIsEditingCompliance(false);
    flash(`Compliance requirement updated: Status is now “${statusToSave}”.`);
    onClose();
  }

  function handleExportCourseRoster() {
    const headers = ['Course Title', 'Category', 'Instructor', 'Learner Capacity', 'Current Completion'];
    const rows = [[record.title, record.category, record.teacher, record.learners, `${record.progress}%`]];
    const csv = buildCSV(headers, rows);
    triggerDownload(`${record.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-roster.csv`, csv);
    flash(`Roster for "${record.title}" exported.`);
  }

  function handleExportProgrammeCohort() {
    const headers = ['Programme ID', 'Title', 'Departments', 'Enrolled Learners', 'Capacity', 'Progress', 'Status'];
    const rows = [[record.id, record.title, (record.departments || []).join(', '), record.learners, record.capacity || 500, `${record.progress}%`, record.status]];
    const csv = buildCSV(headers, rows);
    triggerDownload(`${record.id.toLowerCase()}-cohort.csv`, csv);
    flash(`Cohort data for "${record.title}" exported.`);
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="record-detail-title"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal card record-detail-card">
        {/* MODAL HEADER */}
        <div className="modal-head">
          <div>
            <div className="eyebrow">
              {type === 'compliance' && 'GOVERNANCE · COMPLIANCE REVIEW'}
              {type === 'learner' && 'PEOPLE · LEARNER PROFILE'}
              {type === 'course' && 'ACADEMICS · COURSE CATALOGUE'}
              {type === 'programme' && 'ACADEMICS · PROGRAMME DETAILS'}
              {type === 'event' && 'SCHEDULE · EVENT DETAILS'}
            </div>
            <h2 id="record-detail-title">
              {type === 'compliance' && record.requirement}
              {type === 'learner' && record.name}
              {type === 'course' && record.title}
              {type === 'programme' && record.title}
              {type === 'event' && record.title}
            </h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close detail view"
          >
            <X size={17} />
          </button>
        </div>

        {errorMsg && (
          <div className="form-error-banner">
            <CircleAlert size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* COMPLIANCE DETAIL VIEW */}
        {type === 'compliance' && (
          <div className="record-content">
            <div className="detail-status-bar">
              <span className={`status ${complianceStatus === 'Complete' ? 'good' : complianceStatus === 'In review' ? 'review' : 'warning'}`}>
                {complianceStatus}
              </span>
              <span className="detail-meta-tag">
                <Clock3 size={13} /> Due: {record.dueDate}
              </span>
              <span className="detail-meta-tag">
                <ShieldCheck size={13} /> {record.category}
              </span>
            </div>

            <div className="detail-section">
              <label className="detail-label">Requirement Description</label>
              <p className="detail-text">{record.description}</p>
            </div>

            <div className="detail-grid">
              <div className="detail-field">
                <label className="detail-label">Assigned Owner</label>
                {isEditingCompliance ? (
                  <input
                    type="text"
                    className="modal-input"
                    value={complianceOwner}
                    onChange={e => setComplianceOwner(e.target.value)}
                    placeholder="e.g. Tenant admin"
                  />
                ) : (
                  <strong>{complianceOwner}</strong>
                )}
              </div>

              <div className="detail-field">
                <label className="detail-label">Due Date</label>
                {isEditingCompliance ? (
                  <input
                    type="text"
                    className="modal-input"
                    value={complianceDueDate}
                    onChange={e => setComplianceDueDate(e.target.value)}
                    placeholder="e.g. 15 Sep 2026"
                  />
                ) : (
                  <strong>{complianceDueDate}</strong>
                )}
              </div>
            </div>

            <div className="detail-section">
              <label className="detail-label">Compliance Status</label>
              <div className="status-radio-group">
                {['In review', 'Action needed', 'Complete'].map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`status-chip-btn ${complianceStatus === st ? 'selected ' + (st === 'Complete' ? 'good' : st === 'In review' ? 'review' : 'warning') : ''}`}
                    onClick={() => {
                      setComplianceStatus(st);
                      setErrorMsg('');
                    }}
                  >
                    {complianceStatus === st && <Check size={13} />}
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <label className="detail-label">Audit Notes & Verification Evidence</label>
              {isEditingCompliance ? (
                <textarea
                  className="modal-input"
                  rows={3}
                  value={complianceNotes}
                  onChange={e => setComplianceNotes(e.target.value)}
                  placeholder="Enter audit observations, notes or links to verification documentation..."
                />
              ) : (
                <div className="detail-notes-box">
                  <p>{complianceNotes || 'No verification notes recorded yet.'}</p>
                </div>
              )}
            </div>

            {record.lastReviewed && (
              <div className="detail-footnote">
                <Clock3 size={13} />
                <span>Last reviewed: {record.lastReviewed}</span>
              </div>
            )}

            <div className="modal-actions record-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => setIsEditingCompliance(!isEditingCompliance)}
              >
                <Edit2 size={14} />
                <span>{isEditingCompliance ? 'Hide editable fields' : 'Edit details'}</span>
              </button>

              {complianceStatus !== 'Complete' && (
                <button
                  type="button"
                  className="btn success-action"
                  onClick={() => handleSaveCompliance('Complete')}
                >
                  <CheckCircle2 size={14} />
                  <span>Mark Complete</span>
                </button>
              )}

              {complianceStatus !== 'Action needed' && (
                <button
                  type="button"
                  className="btn warning-action"
                  onClick={() => handleSaveCompliance('Action needed')}
                >
                  <CircleAlert size={14} />
                  <span>Request Changes</span>
                </button>
              )}

              <button
                type="button"
                className="btn primary"
                onClick={() => handleSaveCompliance()}
              >
                <span>Save Review</span>
              </button>
            </div>
          </div>
        )}

        {/* LEARNER DETAIL VIEW */}
        {type === 'learner' && (
          <div className="record-content">
            <div className="detail-hero">
              <span className="avatar large">
                {record.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
              </span>
              <div>
                <h3>{record.name}</h3>
                <span className="subcell">{record.email}</span>
                <div className="hero-tags">
                  <span className="csv-tag">{record.dept}</span>
                  <span className={`status ${record.status === 'On track' ? 'good' : 'warning'}`}>
                    {record.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-metrics-grid">
              <div className="mini-metric">
                <span className="eyebrow">OVERALL PROGRESS</span>
                <strong>{record.progress}%</strong>
                <div className="progress"><span style={{ width: `${record.progress}%` }} /></div>
              </div>
              <div className="mini-metric">
                <span className="eyebrow">FIT SCORE</span>
                <strong>{record.fitScore || 75}/100</strong>
                <span className="subcell">Industry benchmark</span>
              </div>
              <div className="mini-metric">
                <span className="eyebrow">ATTENDANCE</span>
                <strong>{record.attendance || 85}%</strong>
                <span className="subcell">Active participation</span>
              </div>
              <div className="mini-metric">
                <span className="eyebrow">MODULES</span>
                <strong>{record.modulesCompleted || 8}/{record.totalModules || 10}</strong>
                <span className="subcell">Completed modules</span>
              </div>
            </div>

            <div className="detail-section">
              <label className="detail-label">Enrolled Programme Pathway</label>
              <div className="detail-card-inner">
                <GraduationCap size={16} />
                <div>
                  <strong>{record.program}</strong>
                  <p>Batch 2026–27 · Enrolled on {record.enrolledDate || '10 Aug 2026'}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <label className="detail-label">Placement Status</label>
              <div className="detail-card-inner">
                <BriefcaseBusiness size={16} />
                <div>
                  <strong>{record.placementReady ? 'Eligible for Campus Placement' : 'In Preparation Pipeline'}</strong>
                  <p>
                    {record.placementReady
                      ? 'Fit score ≥ 80. Approved for upcoming recruitment drives (ValueLabs, Infosys).'
                      : 'Requires completion of remaining modules to achieve placement benchmark score.'}
                  </p>
                </div>
              </div>
            </div>

            {record.notes && (
              <div className="detail-section">
                <label className="detail-label">Faculty Mentor Notes</label>
                <div className="detail-notes-box">
                  <p>{record.notes}</p>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  onClose();
                  if (onOpenEdit) onOpenEdit('learner', record);
                }}
              >
                <Edit2 size={14} />
                <span>Edit Learner</span>
              </button>
              <button type="button" className="btn primary" onClick={onClose}>
                <span>Close</span>
              </button>
            </div>
          </div>
        )}

        {/* COURSE DETAIL VIEW */}
        {type === 'course' && (
          <div className="record-content">
            <div className={`course-banner ${record.color}`}>
              <GraduationCap size={21} />
              <span>{record.category}</span>
            </div>

            <div className="detail-section" style={{ marginTop: '16px' }}>
              <div className="detail-status-bar">
                <span className="status good">Active Course</span>
                <span className="detail-meta-tag"><Clock3 size={13} /> {record.duration || '14 weeks'}</span>
                <span className="detail-meta-tag"><Award size={13} /> Rating: {record.rating || '4.7'} / 5.0</span>
              </div>
              <p className="detail-text" style={{ marginTop: '10px' }}>{record.description}</p>
            </div>

            <div className="detail-metrics-grid">
              <div className="mini-metric">
                <span className="eyebrow">ENROLLED LEARNERS</span>
                <strong>{record.learners}</strong>
                <span className="subcell">Across departments</span>
              </div>
              <div className="mini-metric">
                <span className="eyebrow">AVG COMPLETION</span>
                <strong>{record.progress}%</strong>
                <div className="progress"><span style={{ width: `${record.progress}%` }} /></div>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-field">
                <label className="detail-label">Lead Instructor</label>
                <strong>{record.teacher}</strong>
                <span className="subcell">Industry Specialist & Certified Faculty</span>
              </div>
              <div className="detail-field">
                <label className="detail-label">Class Schedule</label>
                <strong>{record.schedule || 'Mon & Wed · 10:00 - 12:00 IST'}</strong>
                <span className="subcell">Live Interactive Labs</span>
              </div>
            </div>

            <div className="detail-section">
              <label className="detail-label">Curriculum Modules & Syllabus</label>
              <div className="syllabus-list">
                {(record.modules || [
                  'Foundations & Core Principles',
                  'Intermediate Architecture & Design Patterns',
                  'Enterprise Hands-On Project',
                  'Assessment & Industrial Certification'
                ]).map((mod, i) => (
                  <div className="syllabus-row" key={i}>
                    <span className="module-idx">0{i + 1}</span>
                    <span>{mod}</span>
                    <CheckCircle2 size={15} className="mod-check" />
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={handleExportCourseRoster}
              >
                <Download size={14} />
                <span>Export Roster CSV</span>
              </button>
              <button type="button" className="btn primary" onClick={onClose}>
                <span>Close</span>
              </button>
            </div>
          </div>
        )}

        {/* PROGRAMME DETAIL VIEW */}
        {type === 'programme' && (
          <div className="record-content">
            <div className="detail-status-bar">
              <span className="programme-id">{record.id}</span>
              <span className={`status ${record.status === 'In progress' ? 'good' : 'warning'}`}>
                {record.status}
              </span>
              <span className="detail-meta-tag"><Clock3 size={13} /> {record.duration || '24 weeks'}</span>
            </div>

            <div className="detail-section">
              <label className="detail-label">Pathway Overview</label>
              <p className="detail-text">{record.description || record.detail}</p>
            </div>

            <div className="detail-metrics-grid">
              <div className="mini-metric">
                <span className="eyebrow">ENROLLED</span>
                <strong>{record.learners}</strong>
                <span className="subcell">Out of {record.capacity || 900} capacity</span>
              </div>
              <div className="mini-metric">
                <span className="eyebrow">COHORT PROGRESS</span>
                <strong>{record.progress}%</strong>
                <div className="progress"><span style={{ width: `${record.progress}%` }} /></div>
              </div>
              <div className="mini-metric">
                <span className="eyebrow">SEAT UTILIZATION</span>
                <strong>{Math.round(((record.learners || 0) / (record.capacity || 900)) * 100)}%</strong>
                <span className="subcell">{Math.max(0, (record.capacity || 900) - record.learners)} seats left</span>
              </div>
              <div className="mini-metric">
                <span className="eyebrow">COHORT</span>
                <strong>{record.cohort || 'Batch 2026-A'}</strong>
                <span className="subcell">Term 1 Active</span>
              </div>
            </div>

            <div className="detail-section">
              <label className="detail-label">Participating Departments</label>
              <div className="tag-cluster">
                {(record.departments || ['CSE', 'IT']).map(dept => (
                  <span className="csv-tag" key={dept}>{dept}</span>
                ))}
              </div>
            </div>

            {record.partnerCompanies && record.partnerCompanies.length > 0 && (
              <div className="detail-section">
                <label className="detail-label">Industry Hiring Partners</label>
                <div className="tag-cluster">
                  {record.partnerCompanies.map(partner => (
                    <span className="partner-tag" key={partner}>
                      <Building2 size={12} /> {partner}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={handleExportProgrammeCohort}
              >
                <Download size={14} />
                <span>Export Cohort CSV</span>
              </button>
              <button type="button" className="btn primary" onClick={onClose}>
                <span>Close</span>
              </button>
            </div>
          </div>
        )}

        {/* EVENT DETAIL VIEW */}
        {type === 'event' && (
          <div className="record-content">
            <div className="detail-status-bar">
              <span className={`date-chip ${record.type || 'blue'}`}>{record.day}</span>
              <span className="status review">{record.category || 'Academic'}</span>
              <span className="detail-meta-tag"><CalendarDays size={13} /> {record.date || 'Sep 2026'}</span>
            </div>

            <div className="detail-section">
              <label className="detail-label">Event Description</label>
              <p className="detail-text">{record.details || record.desc}</p>
            </div>

            <div className="detail-grid">
              <div className="detail-field">
                <label className="detail-label">Venue / Format</label>
                <strong>{record.venue || 'Campus Auditorium & Live Stream'}</strong>
              </div>
              <div className="detail-field">
                <label className="detail-label">Target Audience</label>
                <strong>{record.targetAudience || 'All Enrolled Learners'}</strong>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-field">
                <label className="detail-label">Coordinating Organizer</label>
                <strong>{record.organizer || 'Academic Affairs Council'}</strong>
              </div>
              <div className="detail-field">
                <label className="detail-label">Current Status</label>
                <span className="status good">{record.status || 'Confirmed'}</span>
              </div>
            </div>

            <div className="modal-actions">
              {onDeleteRecord && (
                <button
                  type="button"
                  className="btn danger-btn"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete the event "${record.title}"?`)) {
                      onDeleteRecord('event', record.id || record.title);
                      flash(`Event "${record.title}" deleted.`);
                      onClose();
                    }
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete Event</span>
                </button>
              )}
              <button type="button" className="btn primary" onClick={onClose}>
                <span>Close</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
