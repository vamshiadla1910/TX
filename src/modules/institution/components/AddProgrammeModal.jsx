import React, { useState, useEffect } from 'react';
import { X, BookOpen, Check } from 'lucide-react';

export default function AddProgrammeModal({
  isOpen,
  onClose,
  onAddProgramme,
  programmesCount,
  flash
}) {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('20 weeks');
  const [selectedDepts, setSelectedDepts] = useState(['CSE', 'IT']);
  const [capacity, setCapacity] = useState('500');
  const [status, setStatus] = useState('Enrollment open');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const availableDepts = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];

  useEffect(() => {
    if (isOpen) {
      const nextId = `PRG-2026-0${(programmesCount || 4) + 1}`;
      setId(nextId);
      setTitle('');
      setDuration('20 weeks');
      setSelectedDepts(['CSE', 'IT']);
      setCapacity('500');
      setStatus('Enrollment open');
      setDescription('');
      setErrors({});
    }
  }, [isOpen, programmesCount]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function toggleDept(dept) {
    if (selectedDepts.includes(dept)) {
      if (selectedDepts.length > 1) {
        setSelectedDepts(selectedDepts.filter(d => d !== dept));
      }
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  }

  function validate() {
    const errs = {};
    if (!title.trim()) errs.title = 'Programme name is required.';
    if (!id.trim()) errs.id = 'Programme ID is required.';
    const numCap = Number(capacity);
    if (isNaN(numCap) || numCap <= 0) errs.capacity = 'Capacity must be a positive number.';
    if (selectedDepts.length === 0) errs.departments = 'Select at least one department.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const numCap = Number(capacity) || 500;
    const newProg = {
      id: id.trim(),
      title: title.trim(),
      detail: `${duration} · ${selectedDepts.join(', ')}`,
      duration,
      departments: selectedDepts,
      learners: 0,
      capacity: numCap,
      progress: 0,
      status,
      description: description.trim() || `${title.trim()} industry career preparation track.`,
      cohort: 'Batch 2026-D',
      partnerCompanies: ['Pathwing Ecosystem Partners']
    };

    onAddProgramme(newProg);
    flash(`Programme “${title.trim()}” created successfully.`);
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-prog-title"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <form className="modal card" onSubmit={handleSubmit}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">ACADEMICS · NEW PATHWAY</div>
            <h2 id="add-prog-title">Create New Programme</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close add programme dialog"
          >
            <X size={17} />
          </button>
        </div>

        <div className="detail-grid">
          <label>
            Programme ID *
            <input
              type="text"
              className="modal-input"
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder="e.g. PRG-2026-05"
            />
            {errors.id && <span className="field-error-text">{errors.id}</span>}
          </label>

          <label>
            Initial Status
            <select
              className="modal-input"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="Enrollment open">Enrollment open</option>
              <option value="In progress">In progress</option>
            </select>
          </label>
        </div>

        <label>
          Programme Title *
          <input
            autoFocus
            type="text"
            className="modal-input"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: null }));
            }}
            placeholder="e.g. AI & Intelligent Systems Track"
          />
          {errors.title && <span className="field-error-text">{errors.title}</span>}
        </label>

        <div className="detail-grid">
          <label>
            Duration
            <input
              type="text"
              className="modal-input"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g. 20 weeks"
            />
          </label>

          <label>
            Seat Capacity *
            <input
              type="number"
              className="modal-input"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              placeholder="e.g. 500"
            />
            {errors.capacity && <span className="field-error-text">{errors.capacity}</span>}
          </label>
        </div>

        <label>
          Eligible Departments *
          <div className="dept-checkbox-group">
            {availableDepts.map(d => (
              <button
                type="button"
                key={d}
                className={`dept-chip-btn ${selectedDepts.includes(d) ? 'selected' : ''}`}
                onClick={() => toggleDept(d)}
              >
                {selectedDepts.includes(d) && <Check size={12} />}
                {d}
              </button>
            ))}
          </div>
          {errors.departments && <span className="field-error-text">{errors.departments}</span>}
        </label>

        <label>
          Description & Goals
          <textarea
            className="modal-input"
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Outline cohort focus, skill objectives, and industrial relevance..."
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            <span>Cancel</span>
          </button>
          <button type="submit" className="btn primary">
            <Check size={14} />
            <span>Create Programme</span>
          </button>
        </div>
      </form>
    </div>
  );
}
