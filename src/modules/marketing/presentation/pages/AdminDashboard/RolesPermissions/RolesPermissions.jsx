import React, { useState } from "react";
import "./RolesPermissions.css";
import {
  Check, CheckCircle2, LockKeyhole, Plus, Shield,
  ShieldCheck, Users
} from "lucide-react";
import { Badge } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function RolesPermissions({
  roles,
  setRoles,
  setNotice
}) {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const activeRole = roles[selectedRoleIndex];

  function togglePermission(moduleName, perm) {
    setRoles(prev => {
      const copy = [...prev];
      const targetRole = { ...copy[selectedRoleIndex] };
      const currentList = targetRole.permissions[moduleName] || [];
      const updatedList = currentList.includes(perm)
        ? currentList.filter(p => p !== perm)
        : [...currentList, perm];

      targetRole.permissions = {
        ...targetRole.permissions,
        [moduleName]: updatedList
      };
      copy[selectedRoleIndex] = targetRole;
      return copy;
    });
  }

  function handleSavePermissions() {
    setNotice(`Updated permissions matrix for role "${activeRole.name}". Changes enforced.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="CONFIGURED ROLES" value={String(roles.length)} foot="Platform access tiers" icon={Shield} />
        <Metric label="ASSIGNED USERS" value="42,337" foot="Total accounts" icon={Users} />
        <Metric label="PERMISSION MODULES" value="5" foot="Granular governance" icon={LockKeyhole} />
        <Metric label="ACCESS REVIEWS" value="Active" foot="Quarterly compliance" icon={ShieldCheck} />
      </div>

      <div className="roles-layout">
        <div className="roles-list-pane">
          <h3>Platform Roles</h3>
          <div className="role-nav-cards">
            {roles.map((r, idx) => (
              <div
                key={r.name}
                className={`card role-card-nav ${selectedRoleIndex === idx ? "active-role" : ""}`}
                onClick={() => setSelectedRoleIndex(idx)}
              >
                <div className="role-card-top">
                  <strong>{r.name}</strong>
                  <Badge tone="blue">{r.usersCount.toLocaleString("en-IN")} users</Badge>
                </div>
                <p>{r.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="role-detail-pane">
          <section className="card">
            <div className="table-heading">
              <div className="heading-left">
                <h2>Permissions Matrix: {activeRole.name}</h2>
                <Badge tone="neutral">Granular RBAC</Badge>
              </div>
              <button className="primary btn-sm" onClick={handleSavePermissions}>
                <CheckCircle2 size={14} /> Save Role Permissions
              </button>
            </div>

            <div className="permissions-table-wrap p-3">
              <p className="text-muted mb-3">
                Toggle module permissions for users holding the <strong>{activeRole.name}</strong> role. Changes take effect on next token renewal.
              </p>

              <div className="matrix-list">
                {Object.entries(activeRole.permissions).map(([moduleName, perms]) => (
                  <div key={moduleName} className="matrix-row">
                    <div className="matrix-module">
                      <strong>{moduleName}</strong>
                    </div>
                    <div className="matrix-checkboxes">
                      {["View", "Create", "Edit", "Delete", "Approve", "Suspend", "Publish", "Reconcile"].map(capability => {
                        const isGranted = perms.some(p => p.toLowerCase().includes(capability.toLowerCase()));
                        return (
                          <label key={capability} className="perm-toggle">
                            <input
                              type="checkbox"
                              checked={isGranted}
                              onChange={() => togglePermission(moduleName, capability)}
                            />
                            <span>{capability}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
