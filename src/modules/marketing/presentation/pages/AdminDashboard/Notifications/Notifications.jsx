import React, { useState } from "react";
import "./Notifications.css";
import {
  Bell, CheckCircle2, Eye, Mail, MessageSquare,
  Plus, Send, Smartphone, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Notifications({
  notifications,
  setNotifications,
  setNotice
}) {
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastChannel, setBroadcastChannel] = useState("In-App & Email");

  function handleToggleStatus(id) {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === id) {
          const next = n.status === "Enabled" ? "Disabled" : "Enabled";
          const updated = { ...n, status: next };
          if (selectedNotif && selectedNotif.id === id) {
            setSelectedNotif(updated);
          }
          return updated;
        }
        return n;
      })
    );
    setNotice("Notification template status updated.");
  }

  function handleSendTest(notif) {
    setNotice(`Test alert dispatched for template "${notif.name}" via ${notif.channel}.`);
  }

  function handleSendBroadcast(e) {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;

    setNotice(`Platform-wide announcement "${broadcastTitle}" broadcasted to all active tenants via ${broadcastChannel}.`);
    setBroadcastTitle("");
    setBroadcastMsg("");
    setShowBroadcast(false);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="EMAIL DELIVERY" value="99.4%" foot="AWS SES & SendGrid" icon={Mail} />
        <Metric label="SMS DELIVERY" value="98.1%" foot="Twilio & DLT gateway" icon={Smartphone} />
        <Metric label="IN-APP CHANNELS" value="Operational" foot="WebSocket push" icon={Bell} />
        <Metric label="FAILED DELIVERIES" value="6" foot="Bounce triage" icon={CheckCircle2} />
      </div>

      {showBroadcast && (
        <form className="card onboard-form inline-form" onSubmit={handleSendBroadcast}>
          <div className="form-head">
            <div>
              <h2>Broadcast Platform Announcement</h2>
              <p>Dispatch immediate notices to students, mentors, or institution admins.</p>
            </div>
            <button type="button" className="icon-button" onClick={() => setShowBroadcast(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="form-grid">
            <label>
              Announcement Title *
              <input
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                required
                placeholder="e.g. Scheduled Infrastructure Maintenance"
              />
            </label>
            <label>
              Delivery Channel *
              <select value={broadcastChannel} onChange={e => setBroadcastChannel(e.target.value)}>
                <option>In-App & Email</option>
                <option>In-App Banner Only</option>
                <option>SMS Urgent</option>
              </select>
            </label>
            <label className="span-full">
              Message Content *
              <textarea
                className="form-textarea"
                rows={3}
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                required
                placeholder="Enter announcement text to send across tenant dashboards..."
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="primary" type="submit">
              <Send size={15} /> Dispatch Announcement
            </button>
            <button type="button" className="secondary" onClick={() => setShowBroadcast(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {selectedNotif ? (
        <InlineDetailView
          title={`Template: ${selectedNotif.name}`}
          subtitle={`Trigger: ${selectedNotif.trigger} · Channel: ${selectedNotif.channel}`}
          status={selectedNotif.status}
          id={selectedNotif.id}
          onBack={() => setSelectedNotif(null)}
          actions={
            <>
              <button
                className="secondary btn-sm"
                onClick={() => handleToggleStatus(selectedNotif.id)}
              >
                {selectedNotif.status === "Enabled" ? "Disable Template" : "Enable Template"}
              </button>
              <button
                className="primary btn-sm"
                onClick={() => handleSendTest(selectedNotif)}
              >
                <Send size={14} /> Send Test Dispatch
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Notification Channel & Trigger</h3>
              <div className="detail-fields-list">
                <DetailField label="Template Title" value={selectedNotif.name} />
                <DetailField label="Transmission Channel" value={selectedNotif.channel} />
                <DetailField label="Event Trigger" value={selectedNotif.trigger} />
                <DetailField label="Delivery Success Rate" value={selectedNotif.deliveryRate} />
                <DetailField label="Status">
                  <Badge tone={getStatusTone(selectedNotif.status)}>{selectedNotif.status}</Badge>
                </DetailField>
              </div>
            </div>

            <div className="detail-col">
              <h3>Subject Line</h3>
              <div className="detail-fields-list">
                <DetailField label="Message Subject" value={selectedNotif.subject} />
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Message Body Preview & Interpolation</h3>
            <div className="message-preview-box">
              <p>{selectedNotif.body}</p>
            </div>
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Automated Notification Templates</h2>
              <Badge>{notifications.length} templates</Badge>
            </div>
            <button className="primary btn-sm" onClick={() => setShowBroadcast(true)}>
              <Plus size={15} /> Broadcast Announcement
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Template Name</th>
                  <th>Channel</th>
                  <th>Trigger Event</th>
                  <th>Delivery Rate</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map(n => (
                  <tr
                    key={n.id}
                    className="hoverable-row"
                    onClick={() => setSelectedNotif(n)}
                  >
                    <td><strong>{n.name}</strong></td>
                    <td><Badge tone="blue">{n.channel}</Badge></td>
                    <td>{n.trigger}</td>
                    <td><span className="text-success font-medium">{n.deliveryRate}</span></td>
                    <td><Badge tone={getStatusTone(n.status)}>{n.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedNotif(n);
                        }}
                      >
                        <Eye size={13} /> View Template
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
