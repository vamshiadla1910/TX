import React, { useState } from "react";
import { Bell, CheckCircle2, Lock, Save, ShieldCheck, User } from "lucide-react";

export function Settings({ instructorProfile = {}, onUpdateProfile }) {
  const [name, setName] = useState(instructorProfile.name || "Dr. R. Ramana");
  const [title, setTitle] = useState(instructorProfile.title || "Professor & Lead Technical Instructor");
  const [department, setDepartment] = useState(instructorProfile.department || "Computer Science & Engineering");
  const [organization, setOrganization] = useState(instructorProfile.organization || "KITS Warangal · Pathwing Partner");
  const [email] = useState(instructorProfile.email || "ramana.r@kitsw.ac.in");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name,
        title,
        department,
        organization
      });
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span> / <span>Instructor</span> / <strong className="current">Instructor Profile & Preferences</strong>
          </div>
          <h1 className="module-title">Instructor Account & Academic Credentials</h1>
          <p className="module-sub">Manage your public mentor credentials, academic affiliation, and communication channels.</p>
        </div>
      </div>

      {savedNotice && (
        <div className="card alert-success-card">
          <CheckCircle2 size={16} />
          <span>Profile configuration saved and updated successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="card settings-card">
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-section-head">
            <User size={18} className="text-cyan" />
            <div>
              <h3>Academic Identity & Public Bio</h3>
              <p>This information is visible on course syllabi and completion certificates.</p>
            </div>
          </div>

          <div className="form-grid-two">
            <label>
              <span>Full Academic Name & Honorific</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              <span>Registered Institutional Email</span>
              <input
                type="email"
                disabled
                value={email}
                className="input-disabled"
              />
            </label>

            <label>
              <span>Designation & Title</span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label>
              <span>Department / Faculty</span>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </label>

            <label className="grid-full">
              <span>Affiliated College / Organization</span>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </label>
          </div>

          <div className="form-actions-bar">
            <button type="submit" className="btn-primary-gradient">
              <Save size={15} />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notifications Preferences Card */}
      <div className="card settings-card">
        <div className="form-section-head">
          <Bell size={18} className="text-purple" />
          <div>
            <h3>Notification Subscriptions</h3>
            <p>Control realtime alert delivery for learner questions and submissions.</p>
          </div>
        </div>

        <div className="checkbox-list">
          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <div>
              <strong>Instant Email on Learner Question</strong>
              <small>Receive instant alert when a student posts in Q&A forum.</small>
            </div>
          </label>

          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <div>
              <strong>Batch Milestone & Submission Alerts</strong>
              <small>Get notified when 5+ students submit an assignment.</small>
            </div>
          </label>

          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <div>
              <strong>Weekly Performance Digest</strong>
              <small>Summary of course watch hours and completion rates sent every Monday.</small>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
