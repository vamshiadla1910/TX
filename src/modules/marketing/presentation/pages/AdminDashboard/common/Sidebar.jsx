import React, { useState } from "react";
import {
  ChevronDown, ChevronLeft, ChevronRight, Layers, LogOut,
  PanelLeftClose, PanelLeftOpen, ShieldCheck, X
} from "lucide-react";

export function Sidebar({
  navConfig,
  page,
  onNavigate,
  mobileNav,
  setMobileNav,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentRole,
  setCurrentRole,
  showRoleMenu,
  setShowRoleMenu,
  counts,
  onLogout
}) {
  // Collapsible nested navigation groups
  const [collapsedGroups, setCollapsedGroups] = useState({});

  function toggleGroup(groupTitle) {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  }

  function getBadgeCount(itemName) {
    if (itemName === "Tenants") return counts.tenants;
    if (itemName === "Moderation") return counts.moderation > 0 ? counts.moderation : null;
    if (itemName === "Approvals") return counts.approvals > 0 ? counts.approvals : null;
    if (itemName === "Security & audit") return counts.security > 0 ? counts.security : null;
    if (itemName === "Helpdesk") return counts.helpdesk > 0 ? counts.helpdesk : null;
    return null;
  }

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileNav && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileNav(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Navigation Panel */}
      <aside
        className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileNav ? "mobile-open" : ""}`}
        aria-label="Platform Sidebar Navigation"
      >
        {/* Mobile-Only Header inside Drawer */}
        <div className="mobile-drawer-header">
          <div className="drawer-brand">
            <div className="brand-mark small">
              <img src="/logo.png" alt="TX Logo" className="brand-logo-img" />
            </div>
            <span className="drawer-title">TX-Pathwing Admin</span>
          </div>
          <button
            className="icon-button close-drawer-btn"
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Desktop / Tablet Collapse & Expand Controls */}
        <div className="sidebar-controls">
          {!sidebarCollapsed ? (
            <div className="signed-role-container">
             
              <div className="topbar-relative">
                

                {showRoleMenu && (
                  <div className="role-dropdown-menu" role="listbox">
                    {["Super admin â€” Platform", "Organization Admin", "Lead Academic Auditor"].map(r => (
                      <button
                        key={r}
                        type="button"
                        role="option"
                        aria-selected={currentRole === r}
                        className={`role-option ${currentRole === r ? "active" : ""}`}
                        onClick={() => {
                          setCurrentRole(r);
                          setShowRoleMenu(false);
                        }}
                      >
                        <ShieldCheck size={14} /> {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="collapsed-role-icon" title={`Role: ${currentRole}`}>
              <ShieldCheck size={18} className="text-blue" />
            </div>
          )}

          {/* Collapse/Expand Toggle Button */}
          <button
            type="button"
            className="collapse-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Expand sidebar navigation" : "Collapse sidebar to icon-only mode"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Scrollable Navigation Items Area */}
        <div className="sidebar-nav-scroll">
          {navConfig.map(group => {
            const isGroupCollapsed = !!collapsedGroups[group.group];
            const hasActiveChild = group.items.some(item => item.name === page);

            return (
              <div
                className={`nav-group ${isGroupCollapsed && !sidebarCollapsed ? "group-collapsed" : ""}`}
                key={group.group}
              >
                {!sidebarCollapsed ? (
                  <button
                    type="button"
                    className="nav-group-header"
                    onClick={() => toggleGroup(group.group)}
                    aria-expanded={!isGroupCollapsed}
                    title={`${isGroupCollapsed ? "Expand" : "Collapse"} ${group.group} group`}
                  >
                    <span className="nav-label">{group.group}</span>
                    <span className="group-chevron">
                      {isGroupCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                    </span>
                  </button>
                ) : (
                  <div className="collapsed-group-divider" title={group.group} />
                )}

                {(!isGroupCollapsed || sidebarCollapsed) && (
                  <div className="nav-group-items">
                    {group.items.map(item => {
                      const Icon = item.icon;
                      const isActive = page === item.name;
                      const count = getBadgeCount(item.name);

                      return (
                        <div key={item.name} className="nav-item-wrapper">
                          <button
                            type="button"
                            className={`nav-item ${isActive ? "active" : ""}`}
                            onClick={() => onNavigate(item.name)}
                            aria-current={isActive ? "page" : undefined}
                            title={sidebarCollapsed ? `${item.name}${count ? ` (${count})` : ""}` : undefined}
                          >
                            <Icon size={18} className="nav-icon" />
                            {!sidebarCollapsed && <span className="nav-text">{item.name}</span>}
                            {!sidebarCollapsed && count !== null && (
                              <small className="nav-counter">{count}</small>
                            )}
                            {sidebarCollapsed && count !== null && (
                              <span className="collapsed-dot" />
                            )}
                          </button>

                          {/* Hover Tooltip in Collapsed Mode */}
                          {sidebarCollapsed && (
                            <div className="sidebar-tooltip" role="tooltip">
                              <span>{item.name}</span>
                              {count !== null && <small>{count}</small>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User / Profile Footer Section */}
        <div className={`sidebar-user ${sidebarCollapsed ? "collapsed-user" : ""}`}>
          <div className="avatar" title="Platform Operations · PW">
            PW
          </div>
          {!sidebarCollapsed && (
            <div className="user-info">
              <strong>Platform Operations</strong>
              <small>Super admin · all data boundaries</small>
            </div>
          )}
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={onLogout}
            title="Sign out & Exit Admin Console"
            aria-label="Sign out & Exit Admin Console"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
