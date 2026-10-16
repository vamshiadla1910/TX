import React, { useMemo, useState } from "react";
import "./Tenants.css";
import {
  Building2, CheckCircle2, ChevronRight, Eye, Filter,
  Globe, Mail, MapPin, Phone, Plus, Search, SearchX,
  ShieldAlert, ShieldCheck, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Tenants({
  tenants,
  setTenants,
  selectedTenant,
  setSelectedTenant,
  setNotice
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showOnboard, setShowOnboard] = useState(false);

  // New tenant form state
  const [name, setName] = useState("");
  const [type, setType] = useState("Institution");
  const [seats, setSeats] = useState("1000");
  const [plan, setPlan] = useState("Enterprise LMS");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [city, setCity] = useState("");

  const filtered = useMemo(() => {
    return tenants.filter(t => {
      const matchSearch = `${t.name} ${t.type} ${t.domain} ${t.status} ${t.contactName || ""} ${t.city || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchType = typeFilter === "All" || t.type === typeFilter;
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [tenants, search, typeFilter, statusFilter]);

  const activeCount = tenants.filter(t => t.status === "Active").length;
  const onboardingCount = tenants.filter(t => t.status === "Onboarding").length;
  const totalSeats = tenants.reduce((acc, t) => acc + (Number(t.seats) || 0), 0);

  function handleCreateTenant(e) {
    e.preventDefault();
    if (!name.trim()) return;

    const domainSlug = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const newTenant = {
      id: `tnt-${Date.now()}`,
      name: name.trim(),
      type,
      domain: `${domainSlug}.pathwing.in`,
      seats: Math.max(1, Number(seats) || 500),
      used: 0,
      contract: "Nov 26 – Oct 27",
      status: "Onboarding",
      plan,
      contactName: contactName.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      phone: undefined,
      city: city.trim() || undefined,
      onboardingProgress: 40,
      documentsSubmitted: ["Tenant Intake Application", "Registration Copy"],
      coursesOffered: 0,
      activeBatches: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setTenants(prev => [newTenant, ...prev]);
    setSelectedTenant(newTenant);
    setShowOnboard(false);
    setNotice(`Tenant "${newTenant.name}" registered successfully in Onboarding status.`);
    // Reset form
    setName("");
    setSeats("1000");
    setContactName("");
    setContactEmail("");
    setCity("");
  }

  function handleApproveOnboarding(tenantId) {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === tenantId) {
          const updated = {
            ...t,
            status: "Active",
            onboardingProgress: 100,
            domain: t.domain.includes("Provisioning") ? `${t.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.pathwing.in` : t.domain
          };
          if (selectedTenant && selectedTenant.id === tenantId) {
            setSelectedTenant(updated);
          }
          return updated;
        }
        return t;
      })
    );
    setNotice(`Onboarding approved for ${selectedTenant?.name || "tenant"}. Access provisioned.`);
  }

  function handleExpandSeats(tenantId) {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === tenantId) {
          const updatedSeats = t.seats + 500;
          const updated = {
            ...t,
            seats: updatedSeats,
            status: t.used / updatedSeats >= 0.9 ? "Seats near cap" : "Active"
          };
          if (selectedTenant && selectedTenant.id === tenantId) {
            setSelectedTenant(updated);
          }
          return updated;
        }
        return t;
      })
    );
    setNotice(`Added +500 contracted seats. New limit: ${(selectedTenant?.seats || 0) + 500} seats.`);
  }

  function handleToggleStatus(tenantId) {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === tenantId) {
          const newStatus = t.status === "Suspended" ? "Active" : "Suspended";
          const updated = { ...t, status: newStatus };
          if (selectedTenant && selectedTenant.id === tenantId) {
            setSelectedTenant(updated);
          }
          return updated;
        }
        return t;
      })
    );
    setNotice(`Tenant status updated to ${selectedTenant?.status === "Suspended" ? "Active" : "Suspended"}.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="TOTAL TENANTS" value={String(tenants.length)} foot="Configured data boundaries" icon={Building2} />
        <Metric label="ACTIVE TENANTS" value={String(activeCount)} foot="Operational instances" icon={CheckCircle2} />
        <Metric label="IN ONBOARDING" value={String(onboardingCount)} foot="Awaiting verification" icon={ShieldAlert} tone={onboardingCount > 0 ? "warning" : "positive"} />
        <Metric label="CONTRACTED SEATS" value={totalSeats.toLocaleString("en-IN")} foot="Platform aggregate" icon={Building2} />
      </div>

      {showOnboard && (
        <form className="card onboard-form inline-form" onSubmit={handleCreateTenant}>
          <div className="form-head">
            <div>
              <h2>Onboard New Tenant</h2>
              <p>Create a dedicated data boundary, LMS subdomain, and contracted seats.</p>
            </div>
            <button type="button" className="icon-button" onClick={() => setShowOnboard(false)} aria-label="Close form">
              <X size={18} />
            </button>
          </div>

          <div className="form-grid">
            <label>
              Tenant Name *
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="e.g. Osmania University or Wipro Tech"
              />
            </label>
            <label>
              Tenant Type *
              <select value={type} onChange={e => setType(e.target.value)}>
                <option>Institution</option>
                <option>Corporate</option>
                <option>Training provider</option>
              </select>
            </label>
            <label>
              Plan Tier
              <select value={plan} onChange={e => setPlan(e.target.value)}>
                <option>Enterprise LMS</option>
                <option>Professional</option>
                <option>Basic</option>
              </select>
            </label>
            <label>
              Contracted Seats *
              <input
                type="number"
                min="10"
                step="10"
                value={seats}
                onChange={e => setSeats(e.target.value)}
                required
              />
            </label>
            <label>
              Contact Person
              <input
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="e.g. Dr. K. Sharma"
              />
            </label>
            <label>
              Contact Email
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="admin@institution.edu.in"
              />
            </label>
            <label>
              City & State
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Hyderabad, Telangana"
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="primary" type="submit">
              <CheckCircle2 size={16} /> Complete Tenant Onboarding
            </button>
            <button type="button" className="secondary" onClick={() => setShowOnboard(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {selectedTenant ? (
        <InlineDetailView
          title={selectedTenant.name}
          subtitle={`${selectedTenant.type} · Domain: ${selectedTenant.domain}`}
          status={selectedTenant.status}
          id={selectedTenant.id}
          onBack={() => setSelectedTenant(null)}
          actions={
            <>
              {selectedTenant.status === "Onboarding" && (
                <button
                  className="primary btn-sm"
                  onClick={() => handleApproveOnboarding(selectedTenant.id)}
                >
                  <CheckCircle2 size={14} /> Approve Onboarding
                </button>
              )}
              <button
                className="secondary btn-sm"
                onClick={() => handleExpandSeats(selectedTenant.id)}
              >
                <Plus size={14} /> Add 500 Seats
              </button>
              <button
                className={`secondary btn-sm ${selectedTenant.status === "Suspended" ? "btn-success" : "btn-danger"}`}
                onClick={() => handleToggleStatus(selectedTenant.id)}
              >
                {selectedTenant.status === "Suspended" ? "Activate Tenant" : "Suspend Tenant"}
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Organization & Contract Information</h3>
              <div className="detail-fields-list">
                <DetailField label="Organization Type" value={selectedTenant.type} />
                <DetailField label="Dedicated Domain" value={selectedTenant.domain} mono />
                <DetailField label="Subscription Plan" value={selectedTenant.plan} />
                <DetailField label="Contract Term" value={selectedTenant.contract} />
                <DetailField label="Onboarding Progress">
                  <div className="progress-inline">
                    <div className="progress">
                      <i style={{ width: `${selectedTenant.onboardingProgress || 0}%` }} />
                    </div>
                    <span>{selectedTenant.onboardingProgress || 0}%</span>
                  </div>
                </DetailField>
                <DetailField label="Date Created" value={selectedTenant.createdAt} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Primary Contact & Location</h3>
              <div className="detail-fields-list">
                <DetailField label="Contact Person" value={selectedTenant.contactName} />
                <DetailField label="Official Email" value={selectedTenant.contactEmail} mono />
                <DetailField label="Phone Number" value={selectedTenant.phone} />
                <DetailField label="Location / Campus" value={selectedTenant.city} />
                <DetailField label="Offered Courses" value={selectedTenant.coursesOffered ? `${selectedTenant.coursesOffered} Courses` : "None configured"} />
                <DetailField label="Active Cohorts" value={selectedTenant.activeBatches ? `${selectedTenant.activeBatches} Batches` : "None"} />
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Seat Utilization & License Capacity</h3>
            <div className="capacity-card">
              <div className="capacity-stat">
                <strong>{selectedTenant.used.toLocaleString("en-IN")}</strong>
                <span>Learners Enrolled</span>
              </div>
              <div className="capacity-bar-container">
                <div className="capacity-bar-header">
                  <span>Usage: {Math.round((selectedTenant.used / selectedTenant.seats) * 100)}%</span>
                  <span>Cap: {selectedTenant.seats.toLocaleString("en-IN")} Seats</span>
                </div>
                <div className="progress">
                  <i
                    style={{
                      width: `${Math.min(100, (selectedTenant.used / selectedTenant.seats) * 100)}%`,
                      background: (selectedTenant.used / selectedTenant.seats) >= 0.9 ? "#d34f42" : "#2850d9"
                    }}
                  />
                </div>
              </div>
              <div className="capacity-stat">
                <strong>{(selectedTenant.seats - selectedTenant.used).toLocaleString("en-IN")}</strong>
                <span>Available Seats</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Submitted Compliance & Verification Documents</h3>
            {selectedTenant.documentsSubmitted && selectedTenant.documentsSubmitted.length > 0 ? (
              <div className="doc-pills">
                {selectedTenant.documentsSubmitted.map((doc, idx) => (
                  <span className="doc-pill" key={idx}>
                    <CheckCircle2 size={13} className="text-success" /> {doc}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted italic">No compliance documents submitted yet.</p>
            )}
          </div>
        </InlineDetailView>
      ) : (
        <section className="card tenant-card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Tenant Data Boundaries</h2>
              <Badge>{filtered.length} of {tenants.length} shown</Badge>
            </div>
            <button className="primary btn-sm" onClick={() => setShowOnboard(true)}>
              <Plus size={15} /> Onboard Tenant
            </button>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tenant name, type, domain, contact..."
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Type:</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Institution">Institution</option>
                <option value="Corporate">Corporate</option>
                <option value="Training provider">Training provider</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Seats near cap">Seats near cap</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Type</th>
                  <th>Domain</th>
                  <th>Seats</th>
                  <th>Used</th>
                  <th>Contract</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const usagePct = Math.min(100, Math.round((t.used / t.seats) * 100));
                  return (
                    <tr
                      key={t.id || t.name}
                      className="hoverable-row"
                      onClick={() => setSelectedTenant(t)}
                    >
                      <td className="tenant-name">
                        <strong>{t.name}</strong>
                        {t.city && <small className="row-sub">{t.city}</small>}
                      </td>
                      <td>{t.type}</td>
                      <td className="domain">{t.domain}</td>
                      <td>{t.seats.toLocaleString("en-IN")}</td>
                      <td>{t.used.toLocaleString("en-IN")}</td>
                      <td>{t.contract}</td>
                      <td>
                        <Badge tone={getStatusTone(t.status)}>{t.status}</Badge>
                        <div className="usage">
                          <span
                            style={{
                              width: `${usagePct}%`,
                              background: usagePct >= 95 ? "#d34f42" : undefined
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <button
                          className="secondary btn-sm"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedTenant(t);
                          }}
                        >
                          <Eye size={13} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <SearchX size={28} />
              <p>No tenant records match your search and filter criteria.</p>
              <button
                className="secondary btn-sm"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("All");
                  setStatusFilter("All");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
