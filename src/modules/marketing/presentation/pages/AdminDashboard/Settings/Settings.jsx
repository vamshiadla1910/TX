import React, { useState } from "react";
import "./Settings.css";
import {
  Bell, CheckCircle2, LockKeyhole, ShieldCheck,
  Sliders, SlidersHorizontal
} from "lucide-react";
import { Badge } from "../common/Badge";
import { Metric } from "../common/Metric";

export function Settings({
  settings,
  setSettings,
  setNotice
}) {
  const [formData, setFormData] = useState({ ...settings });
  const [activeTab, setActiveTab] = useState("general");

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSettings(formData);
    setNotice("Platform settings successfully saved and applied.");
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="PLATFORM STATE" value={formData.maintenanceMode ? "Maintenance" : "Live"} foot="Public availability" icon={Sliders} tone={formData.maintenanceMode ? "negative" : "positive"} />
        <Metric label="SLA REVIEW LIMIT" value={`${formData.slaReviewHours}h`} foot="Content turnaround" icon={SlidersHorizontal} />
        <Metric label="2FA ENFORCEMENT" value={formData.twoFactorEnforced ? "Required" : "Optional"} foot="Admin authentication" icon={LockKeyhole} />
        <Metric label="VIDEO DRM" value={formData.drmProtectionEnabled ? "Active" : "Disabled"} foot="Encrypted playback" icon={ShieldCheck} />
      </div>

      <section className="card">
        <div className="table-heading">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              General Configuration
            </button>
            <button
              className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              Governance & Security
            </button>
            <button
              className={`tab-btn ${activeTab === "sla" ? "active" : ""}`}
              onClick={() => setActiveTab("sla")}
            >
              SLA & Video DRM
            </button>
          </div>
        </div>

        <form className="p-4" onSubmit={handleSave}>
          {activeTab === "general" && (
            <div className="form-grid">
              <label>
                Platform Console Name
                <input
                  value={formData.platformName}
                  onChange={e => handleChange("platformName", e.target.value)}
                  required
                />
              </label>
              <label>
                Operations Support Email
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={e => handleChange("supportEmail", e.target.value)}
                  required
                />
              </label>
              <label>
                Support Phone Line
                <input
                  value={formData.supportPhone}
                  onChange={e => handleChange("supportPhone", e.target.value)}
                />
              </label>
              <label>
                Default Billing Currency
                <select
                  value={formData.defaultCurrency}
                  onChange={e => handleChange("defaultCurrency", e.target.value)}
                >
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </label>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-toggles-list">
              <label className="toggle-row">
                <div>
                  <strong>Enforce Two-Factor Authentication (2FA)</strong>
                  <small>Mandatory for all Super Admins and Tenant Administrators.</small>
                </div>
                <input
                  type="checkbox"
                  checked={formData.twoFactorEnforced}
                  onChange={e => handleChange("twoFactorEnforced", e.target.checked)}
                />
              </label>

              <label className="toggle-row">
                <div>
                  <strong>Platform Maintenance Mode</strong>
                  <small>Pause all student logins and display planned maintenance window.</small>
                </div>
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={e => handleChange("maintenanceMode", e.target.checked)}
                />
              </label>

              <label className="toggle-row">
                <div>
                  <strong>Auto-Approve Verified Faculty Mentors</strong>
                  <small>Skip manual review if mentor has valid government identity and verified university email.</small>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoApproveVerifiedMentors}
                  onChange={e => handleChange("autoApproveVerifiedMentors", e.target.checked)}
                />
              </label>
            </div>
          )}

          {activeTab === "sla" && (
            <div className="form-grid">
              <label>
                Course Moderation SLA Window (Hours)
                <input
                  type="number"
                  min="12"
                  max="168"
                  value={formData.slaReviewHours}
                  onChange={e => handleChange("slaReviewHours", Number(e.target.value))}
                  required
                />
              </label>
              <label>
                Tenant Seat Capacity Warning Threshold (%)
                <input
                  type="number"
                  min="50"
                  max="99"
                  value={formData.seatWarningThreshold}
                  onChange={e => handleChange("seatWarningThreshold", Number(e.target.value))}
                  required
                />
              </label>
              <label className="toggle-row span-full mt-2">
                <div>
                  <strong>DRM Video Encryption & Token Signing</strong>
                  <small>Enforce Widevine / FairPlay DRM encryption on all video lecture streams.</small>
                </div>
                <input
                  type="checkbox"
                  checked={formData.drmProtectionEnabled}
                  onChange={e => handleChange("drmProtectionEnabled", e.target.checked)}
                />
              </label>
            </div>
          )}

          <div className="form-actions mt-4">
            <button className="primary" type="submit">
              <CheckCircle2 size={16} /> Save Platform Settings
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
