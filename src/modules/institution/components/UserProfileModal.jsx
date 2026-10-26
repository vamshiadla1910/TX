import React, { useEffect } from 'react';
import { X, Building2, User, ShieldCheck, Database, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';

export default function UserProfileModal({
  isOpen,
  onClose,
  onResetData,
  onSignOut,
  flash
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSignOut() {
    if (window.confirm('Are you sure you want to sign out of the KITS Warangal tenant portal?')) {
      if (onSignOut) {
        onSignOut();
      } else {
        flash('Signed out of KITS Warangal tenant portal. Session ended.');
        onClose();
      }
    }
  }

  function handleReset() {
    if (window.confirm('Reset all institutional data back to default sample records? Any custom imports and compliance reviews will be restored.')) {
      onResetData();
      flash('Institutional records reset to default demo dataset.');
      onClose();
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-title"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal card user-profile-card">
        <div className="modal-head">
          <div>
            <div className="eyebrow">INSTITUTION · TENANT ACCOUNT</div>
            <h2 id="user-profile-title">Institutional Account</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close user profile"
          >
            <X size={17} />
          </button>
        </div>

        <div className="detail-hero">
          <span className="avatar large">RS</span>
          <div>
            <h3>R. Sathyanarayana</h3>
            <span className="subcell">r.sathya@kits.edu</span>
            <div className="hero-tags">
              <span className="status review">Tenant Admin</span>
              <span className="csv-tag">Batch 2026–27</span>
            </div>
          </div>
        </div>

        <div className="detail-section" style={{ marginTop: '16px' }}>
          <label className="detail-label">Affiliated Institution</label>
          <div className="detail-card-inner">
            <Building2 size={18} />
            <div>
              <strong>Kakatiya Institute of Technology & Science (KITS Warangal)</strong>
              <p>Autonomous Engineering Institution · Institution ID: INST-KITS-001</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <label className="detail-label">Data Persistence Status</label>
          <div className="detail-card-inner">
            <Database size={18} />
            <div>
              <strong>Local Browser Storage Active</strong>
              <p>Changes to compliance records, learners, and events are saved across browser refreshes.</p>
            </div>
          </div>
        </div>

        <div className="profile-actions-section">
          <button
            type="button"
            className="btn secondary reset-btn"
            onClick={handleReset}
          >
            <RefreshCw size={14} />
            <span>Reset Demo Data to Defaults</span>
          </button>

          <button
            type="button"
            className="btn danger-btn"
            onClick={handleSignOut}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn primary" onClick={onClose}>
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
