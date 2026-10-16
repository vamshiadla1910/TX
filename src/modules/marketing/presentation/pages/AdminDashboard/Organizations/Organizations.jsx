import React, { useMemo, useState } from "react";
import "./Organizations.css";
import {
  Building2, CheckCircle2, Eye, Filter, Plus, Search,
  SearchX, ShieldAlert, ShieldCheck, ArrowRight, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Organizations({
  tenants,
  setTenants,
  setNotice,
  setPage
}) {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return tenants.filter(org => {
      const matchSearch = `${org.name} ${org.type} ${org.domain} ${org.plan} ${org.city || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || org.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tenants, search, statusFilter]);

  const activeCount = tenants.filter(t => t.status === "Active").length;
  const onboardingCount = tenants.filter(t => t.status === "Onboarding").length;
  const needsAttentionCount = tenants.filter(t => t.status === "Seats near cap" || t.status === "Suspended").length;

  function handleApprove(orgId) {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === orgId) {
          const updated = {
            ...t,
            status: "Active",
            onboardingProgress: 100,
            domain: t.domain.includes("Provisioning") ? `${t.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.pathwing.in` : t.domain
          };
          if (selectedOrg && selectedOrg.id === orgId) {
            setSelectedOrg(updated);
          }
          return updated;
        }
        return t;
      })
    );
    setNotice(`Organization "${selectedOrg?.name || "record"}" approved. Tenant access activated.`);
  }

  function handleUpgradePlan(orgId) {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === orgId) {
          const updated = { ...t, plan: "Enterprise LMS" };
          if (selectedOrg && selectedOrg.id === orgId) {
            setSelectedOrg(updated);
          }
          return updated;
        }
        return t;
      })
    );
    setNotice(`Plan upgraded to Enterprise LMS for ${selectedOrg?.name}.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="ORGANIZATIONS" value={String(tenants.length + 32)} foot="Total registered accounts" icon={Building2} />
        <Metric label="ACTIVE ORGANIZATIONS" value={String(activeCount + 30)} foot="Active LMS subscriptions" icon={CheckCircle2} />
        <Metric label="IN ONBOARDING" value={String(onboardingCount)} foot="Review documents" icon={ShieldAlert} tone={onboardingCount > 0 ? "warning" : "positive"} />
        <Metric label="NEEDS ATTENTION" value={String(needsAttentionCount)} foot="Seat caps or SLA alerts" icon={ShieldCheck} tone={needsAttentionCount > 0 ? "negative" : "positive"} />
      </div>

      {selectedOrg ? (
        <InlineDetailView
          title={selectedOrg.name}
          subtitle={`Organization Type: ${selectedOrg.type} · Plan: ${selectedOrg.plan}`}
          status={selectedOrg.status}
          id={selectedOrg.id}
          onBack={() => setSelectedOrg(null)}
          actions={
            <>
              {selectedOrg.status === "Onboarding" && (
                <button
                  className="primary btn-sm"
                  onClick={() => handleApprove(selectedOrg.id)}
                >
                  <CheckCircle2 size={14} /> Approve Onboarding
                </button>
              )}
              {selectedOrg.plan !== "Enterprise LMS" && (
                <button
                  className="secondary btn-sm"
                  onClick={() => handleUpgradePlan(selectedOrg.id)}
                >
                  Upgrade to Enterprise
                </button>
              )}
              <button
                className="secondary btn-sm"
                onClick={() => setPage("Tenants")}
              >
                Open Data Boundary <ArrowRight size={14} />
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Organization Profile</h3>
              <div className="detail-fields-list">
                <DetailField label="Official Name" value={selectedOrg.name} />
                <DetailField label="Category" value={selectedOrg.type} />
                <DetailField label="Campus / City" value={selectedOrg.city} />
                <DetailField label="Tenant Domain" value={selectedOrg.domain} mono />
                <DetailField label="Subscription Tier" value={selectedOrg.plan} />
                <DetailField label="Registration Date" value={selectedOrg.createdAt} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Onboarding Checklist & Status</h3>
              <div className="detail-fields-list">
                <DetailField label="Authorized Contact" value={selectedOrg.contactName} />
                <DetailField label="Official Email" value={selectedOrg.contactEmail} mono />
                <DetailField label="Contact Phone" value={selectedOrg.phone} />
                <DetailField label="Current Status">
                  <Badge tone={getStatusTone(selectedOrg.status)}>{selectedOrg.status}</Badge>
                </DetailField>
                <DetailField label="Onboarding Milestone">
                  <div className="progress-inline">
                    <div className="progress">
                      <i style={{ width: `${selectedOrg.onboardingProgress || 0}%` }} />
                    </div>
                    <span>{selectedOrg.onboardingProgress || 0}% Complete</span>
                  </div>
                </DetailField>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Compliance & Legal Submissions</h3>
            {selectedOrg.documentsSubmitted && selectedOrg.documentsSubmitted.length > 0 ? (
              <div className="doc-pills">
                {selectedOrg.documentsSubmitted.map((d, i) => (
                  <span className="doc-pill" key={i}>
                    <CheckCircle2 size={13} className="text-success" /> {d}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted italic">No documentation uploaded yet.</p>
            )}
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>All Organizations</h2>
              <Badge>{filtered.length} shown</Badge>
            </div>
            <button className="primary btn-sm" onClick={() => setPage("Tenants")}>
              <Plus size={15} /> Add Organization
            </button>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search organizations, plan, city..."
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Seats near cap">Seats near cap</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Type</th>
                  <th>Subscription</th>
                  <th>Onboarding</th>
                  <th>Learners Enrolled</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(org => (
                  <tr
                    key={org.id || org.name}
                    className="hoverable-row"
                    onClick={() => setSelectedOrg(org)}
                  >
                    <td>
                      <strong>{org.name}</strong>
                      {org.city && <small className="row-sub">{org.city}</small>}
                    </td>
                    <td>{org.type}</td>
                    <td><Badge tone="blue">{org.plan}</Badge></td>
                    <td>
                      <div className="progress-inline">
                        <div className="progress" style={{ width: "80px" }}>
                          <i style={{ width: `${org.onboardingProgress || 0}%` }} />
                        </div>
                        <small>{org.onboardingProgress || 0}%</small>
                      </div>
                    </td>
                    <td>
                      <strong>{org.used.toLocaleString("en-IN")}</strong>
                      <span className="text-muted"> / {org.seats.toLocaleString("en-IN")}</span>
                    </td>
                    <td><Badge tone={getStatusTone(org.status)}>{org.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedOrg(org);
                        }}
                      >
                        <Eye size={13} /> {org.status === "Onboarding" ? "Review Onboarding" : "View Details"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <SearchX size={28} />
              <p>No organizations match the filter criteria.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
