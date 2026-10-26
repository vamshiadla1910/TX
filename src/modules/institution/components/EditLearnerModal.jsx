import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function EditLearnerModal({
  isOpen,
  learner,
  onClose,
  onSaveLearner,
  flash
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('CSE');
  const [program, setProgram] = useState('Full Stack Engineering');
  const [progress, setProgress] = useState(75);
  const [status, setStatus] = useState('On track');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (learner) {
      setName(learner.name || '');
      setEmail(learner.email || '');
      setDept(learner.dept || 'CSE');
      setProgram(learner.program || 'Full Stack Engineering');
      setProgress(learner.progress ?? 75);
      setStatus(learner.status || 'On track');
      setErrors({});
    }
  }, [learner]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !learner) return null;

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = 'Learner name is required.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    const numProg = Number(progress);
    if (isNaN(numProg) || numProg < 0 || numProg > 100) {
      errs.progress = 'Progress must be between 0 and 100.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const numProg = Math.round(Number(progress));
    const autoStatus = status || (numProg < 60 ? 'Needs support' : 'On track');
    const updated = {
      ...learner,
      name: name.trim(),
      email: email.trim(),
      dept,
      program,
      progress: numProg,
      status: autoStatus,
      placementReady: numProg >= 80,
      fitScore: Math.min(98, Math.max(45, Math.round(numProg * 0.95)))
    };

    onSaveLearner(updated);
    flash(`Learner record for “${name.trim()}” updated.`);
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-learner-title"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <form className="modal card" onSubmit={handleSubmit}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">PEOPLE · EDIT RECORD</div>
            <h2 id="edit-learner-title">Edit Learner Information</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close edit learner"
          >
            <X size={17} />
          </button>
        </div>

        <label>
          Full Name *
          <input
            autoFocus
            type="text"
            className="modal-input"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && <span className="field-error-text">{errors.name}</span>}
        </label>

        <label>
          Institutional Email *
          <input
            type="email"
            className="modal-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {errors.email && <span className="field-error-text">{errors.email}</span>}
        </label>

        <div className="detail-grid">
          <label>
            Department
            <select
              className="modal-input"
              value={dept}
              onChange={e => setDept(e.target.value)}
            >
              {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label>
            Enrolled Programme
            <select
              className="modal-input"
              value={program}
              onChange={e => setProgram(e.target.value)}
            >
              <option value="Full Stack Engineering">Full Stack Engineering</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Data Engineering">Data Engineering</option>
              <option value="Campus to Career Accelerator">Campus to Career Accelerator</option>
            </select>
          </label>
        </div>

        <div className="detail-grid">
          <label>
            Completion Progress (%)
            <input
              type="number"
              min="0"
              max="100"
              className="modal-input"
              value={progress}
              onChange={e => setProgress(e.target.value)}
            />
            {errors.progress && <span className="field-error-text">{errors.progress}</span>}
          </label>

          <label>
            Academic Status
            <select
              className="modal-input"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="On track">On track</option>
              <option value="Needs support">Needs support</option>
            </select>
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            <span>Cancel</span>
          </button>
          <button type="submit" className="btn primary">
            <Check size={14} />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
