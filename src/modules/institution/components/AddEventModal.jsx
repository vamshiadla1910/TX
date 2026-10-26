import React, { useState, useEffect } from 'react';
import { X, CalendarDays, CircleAlert, Check } from 'lucide-react';

export default function AddEventModal({ isOpen, onClose, onAddEvent, flash }) {
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('');
  const [category, setCategory] = useState('Academic');
  const [desc, setDesc] = useState('');
  const [venue, setVenue] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [type, setType] = useState('blue');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDay('');
      setCategory('Academic');
      setDesc('');
      setVenue('');
      setTargetAudience('');
      setType('blue');
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function validate() {
    const errs = {};
    if (!title.trim()) errs.title = 'Event title is required.';
    if (!day.trim()) errs.day = 'Date is required (e.g. "15 Oct" or "2026-10-15").';
    if (!desc.trim()) errs.desc = 'Short description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const newEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      day: day.trim(),
      title: title.trim(),
      desc: desc.trim(),
      category,
      venue: venue.trim() || 'Institution Auditorium / Virtual Link',
      targetAudience: targetAudience.trim() || 'All Enrolled Batches',
      organizer: 'Academic Council',
      status: 'Scheduled',
      type,
      details: desc.trim()
    };

    onAddEvent(newEvent);
    flash(`Event “${title.trim()}” scheduled successfully.`);
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-event-title"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <form className="modal card" onSubmit={handleSubmit}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">SCHEDULE · NEW EVENT</div>
            <h2 id="add-event-title">Add Institution Event</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close add event dialog"
          >
            <X size={17} />
          </button>
        </div>

        <label>
          Event Title *
          <input
            autoFocus
            type="text"
            className="modal-input"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: null }));
            }}
            placeholder="e.g. Industry Placement Drive — ValueLabs"
          />
          {errors.title && <span className="field-error-text">{errors.title}</span>}
        </label>

        <div className="detail-grid">
          <label>
            Date Display (e.g. 15 Oct) *
            <input
              type="text"
              className="modal-input"
              value={day}
              onChange={e => {
                setDay(e.target.value);
                if (errors.day) setErrors(prev => ({ ...prev, day: null }));
              }}
              placeholder="e.g. 14 Oct"
            />
            {errors.day && <span className="field-error-text">{errors.day}</span>}
          </label>

          <label>
            Category
            <select
              className="modal-input"
              value={category}
              onChange={e => {
                setCategory(e.target.value);
                if (e.target.value === 'Compliance') setType('orange');
                else setType('blue');
              }}
            >
              <option value="Academic">Academic</option>
              <option value="Placement">Placement</option>
              <option value="Industry">Industry</option>
              <option value="Compliance">Compliance</option>
            </select>
          </label>
        </div>

        <div className="detail-grid">
          <label>
            Target Audience
            <input
              type="text"
              className="modal-input"
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              placeholder="e.g. CSE & IT · 640 learners"
            />
          </label>

          <label>
            Venue / Mode
            <input
              type="text"
              className="modal-input"
              value={venue}
              onChange={e => setVenue(e.target.value)}
              placeholder="e.g. Main Auditorium / Zoom"
            />
          </label>
        </div>

        <label>
          Description / Agenda *
          <textarea
            className="modal-input"
            rows={3}
            value={desc}
            onChange={e => {
              setDesc(e.target.value);
              if (errors.desc) setErrors(prev => ({ ...prev, desc: null }));
            }}
            placeholder="Add brief details about the event schedule, requirements, or eligibility..."
          />
          {errors.desc && <span className="field-error-text">{errors.desc}</span>}
        </label>

        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            <span>Cancel</span>
          </button>
          <button type="submit" className="btn primary">
            <Check size={14} />
            <span>Save Event</span>
          </button>
        </div>
      </form>
    </div>
  );
}
