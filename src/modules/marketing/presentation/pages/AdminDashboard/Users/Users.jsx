import React, { useMemo, useState } from "react";
import "./Users.css";
import {
  CheckCircle2, Eye, Mail, Phone, Plus, Search,
  SearchX, Shield, UserCheck, UserMinus, UserPlus, Users, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function UsersModule({
  users,
  setUsers,
  tenants,
  setNotice
}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddUser, setShowAddUser] = useState(false);

  // New user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Student");
  const [newTenant, setNewTenant] = useState(tenants[0]?.name || "KITS Warangal");
  const [newPhone, setNewPhone] = useState("");

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = `${u.name} ${u.email} ${u.tenant} ${u.role}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchRole = roleFilter === "All" || u.role === roleFilter;
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const studentsCount = users.filter(u => u.role === "Student").length;
  const mentorsCount = users.filter(u => u.role === "Mentor").length;
  const adminsCount = users.filter(u => u.role === "Org Admin" || u.role === "Super Admin").length;

  function handleCreateUser(e) {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const userObj = {
      id: `usr-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      tenant: newTenant,
      status: "Active",
      joinedDate: "Today",
      lastActive: "Just now",
      coursesEnrolled: newRole === "Student" ? 1 : 0,
      coursesCompleted: 0,
      coursesMentored: newRole === "Mentor" ? 1 : 0,
      phone: newPhone.trim() || undefined,
      city: "Hyderabad"
    };

    setUsers(prev => [userObj, ...prev]);
    setSelectedUser(userObj);
    setShowAddUser(false);
    setNotice(`User account created for ${userObj.name} (${userObj.role}).`);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
  }

  function handleToggleStatus(userId) {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === "Active" ? "Inactive" : "Active";
          const updated = { ...u, status: nextStatus };
          if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    setNotice(`User status updated to ${selectedUser?.status === "Active" ? "Inactive" : "Active"}.`);
  }

  function handleRoleChange(userId, targetRole) {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updated = { ...u, role: targetRole };
          if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    setNotice(`Role for ${selectedUser?.name} changed to ${targetRole}.`);
  }

  function handleResetPassword(email) {
    setNotice(`Security reset token generated. Verification link dispatched to ${email}.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="TOTAL USERS" value={String(41208 + users.length - 7)} foot="Across all tenants" icon={Users} />
        <Metric label="STUDENTS" value={String(38420 + studentsCount - 2)} foot="Enrolled learners" icon={UserCheck} />
        <Metric label="MENTORS" value={String(1842 + mentorsCount - 2)} foot="Faculty & experts" icon={Shield} />
        <Metric label="ADMINS" value={String(946 + adminsCount - 3)} foot="Platform & tenant admins" icon={Shield} />
      </div>

      {showAddUser && (
        <form className="card onboard-form inline-form" onSubmit={handleCreateUser}>
          <div className="form-head">
            <div>
              <h2>Create New User Account</h2>
              <p>Assign tenant membership, authorization role, and login identity.</p>
            </div>
            <button type="button" className="icon-button" onClick={() => setShowAddUser(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="form-grid">
            <label>
              Full Name *
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
                placeholder="e.g. Harini Krishnan"
              />
            </label>
            <label>
              Email Address *
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                required
                placeholder="user@domain.com"
              />
            </label>
            <label>
              Role *
              <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="Student">Student</option>
                <option value="Mentor">Mentor</option>
                <option value="Org Admin">Organization Admin</option>
                <option value="Super Admin">Platform Super Admin</option>
              </select>
            </label>
            <label>
              Tenant / Organization *
              <select value={newTenant} onChange={e => setNewTenant(e.target.value)}>
                {tenants.map(t => (
                  <option key={t.id || t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Contact Phone
              <input
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="+91 98765 00000"
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="primary" type="submit">
              <UserPlus size={16} /> Save User Account
            </button>
            <button type="button" className="secondary" onClick={() => setShowAddUser(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {selectedUser ? (
        <InlineDetailView
          title={selectedUser.name}
          subtitle={`${selectedUser.role} · ${selectedUser.tenant}`}
          status={selectedUser.status}
          id={selectedUser.id}
          onBack={() => setSelectedUser(null)}
          actions={
            <>
              <button
                className={`secondary btn-sm ${selectedUser.status === "Active" ? "btn-danger" : "btn-success"}`}
                onClick={() => handleToggleStatus(selectedUser.id)}
              >
                {selectedUser.status === "Active" ? "Deactivate Account" : "Activate Account"}
              </button>
              <button
                className="secondary btn-sm"
                onClick={() => handleResetPassword(selectedUser.email)}
              >
                <Mail size={14} /> Send Password Reset
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Account Profile</h3>
              <div className="detail-fields-list">
                <DetailField label="Full Name" value={selectedUser.name} />
                <DetailField label="Email Address" value={selectedUser.email} mono />
                <DetailField label="Role" value={selectedUser.role} />
                <DetailField label="Assigned Tenant" value={selectedUser.tenant} />
                <DetailField label="Account Status">
                  <Badge tone={getStatusTone(selectedUser.status)}>{selectedUser.status}</Badge>
                </DetailField>
                <DetailField label="Registered On" value={selectedUser.joinedDate} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Contact & Activity Details</h3>
              <div className="detail-fields-list">
                <DetailField label="Phone" value={selectedUser.phone} />
                <DetailField label="Location" value={selectedUser.city} />
                <DetailField label="Last Active" value={selectedUser.lastActive} />
                {selectedUser.role === "Student" && (
                  <>
                    <DetailField label="Courses Enrolled" value={`${selectedUser.coursesEnrolled || 0} Courses`} />
                    <DetailField label="Certificates Earned" value={`${selectedUser.coursesCompleted || 0} Certificates`} />
                  </>
                )}
                {selectedUser.role === "Mentor" && (
                  <DetailField label="Courses Mentored" value={`${selectedUser.coursesMentored || 0} Active Tracks`} />
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Role Management & Access Scope</h3>
            <div className="role-switch-row">
              <span className="text-muted">Change Role:</span>
              {["Student", "Mentor", "Org Admin", "Super Admin"].map(role => (
                <button
                  key={role}
                  className={`btn-sm ${selectedUser.role === role ? "primary" : "secondary"}`}
                  onClick={() => handleRoleChange(selectedUser.id, role)}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>All User Accounts</h2>
              <Badge>{filtered.length} shown</Badge>
            </div>
            <button className="primary btn-sm" onClick={() => setShowAddUser(true)}>
              <UserPlus size={15} /> Add User
            </button>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search user by name, email, tenant, role..."
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Role:</label>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option value="All">All Roles</option>
                <option value="Student">Student</option>
                <option value="Mentor">Mentor</option>
                <option value="Org Admin">Org Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Tenant / Organization</th>
                  <th>Last Active</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr
                    key={u.id}
                    className="hoverable-row"
                    onClick={() => setSelectedUser(u)}
                  >
                    <td>
                      <strong>{u.name}</strong>
                      <small className="row-sub font-mono">{u.email}</small>
                    </td>
                    <td>
                      <Badge tone={u.role === "Super Admin" ? "purple" : u.role === "Org Admin" ? "blue" : u.role === "Mentor" ? "warning" : "neutral"}>
                        {u.role}
                      </Badge>
                    </td>
                    <td>{u.tenant}</td>
                    <td><small>{u.lastActive}</small></td>
                    <td><Badge tone={getStatusTone(u.status)}>{u.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedUser(u);
                        }}
                      >
                        <Eye size={13} /> View Profile
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
              <p>No user accounts found matching your filters.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
