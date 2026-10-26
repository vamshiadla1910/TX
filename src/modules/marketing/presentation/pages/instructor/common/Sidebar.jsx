import React from "react";
import txIcon from "../../../../../../assets/tx-icon.jpg";
import {
  BookOpen, ChevronDown, ChevronLeft, ChevronRight,
  LayoutDashboard, LogOut, Sparkles, Users, X
} from "lucide-react";

export function Sidebar({
  navConfig,
  page,
  onNavigate,
  mobileNav,
  setMobileNav,
  sidebarCollapsed,
  setSidebarCollapsed,
  instructorProfile,
  onLogout
}) {
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
        className={`sidebar inst-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileNav ? "mobile-open" : ""}`}
        aria-label="Instructor Sidebar Navigation"
      >
        {/* Mobile Header Inside Drawer */}
        <div className="mobile-drawer-header">
          <div className="drawer-brand">
            <div className="drawer-logo-mark">
              <img src={txIcon} alt="TX Pathwing Logo" className="drawer-logo-img" />
            </div>
            <span className="drawer-title">TX Pathwing</span>
          </div>
          <button
            className="icon-button close-drawer-btn"
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Header & Collapse Toggle */}
        <div className={`sidebar-controls ${sidebarCollapsed ? "collapsed-controls" : ""}`}>
          {!sidebarCollapsed && (
            <span className="sidebar-section-title">NAVIGATION</span>
          )}
          <button
            type="button"
            className="collapse-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="sidebar-nav-scroll inst-sidebar-nav-scroll">
          {navConfig.map((group) => (
            <div className="nav-group inst-nav-group" key={group.group}>
              {!sidebarCollapsed ? (
                <div className="nav-group-header inst-nav-group-header">
                  <span className="nav-label inst-nav-label">{group.group}</span>
                </div>
              ) : (
                <div className="collapsed-group-divider" title={group.group} />
              )}

              <div className="nav-group-items inst-nav-group-items">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = page === item.name;
                  const isSpecial = item.name === "AI Course Builder";

                  return (
                    <div key={item.name} className="nav-item-wrapper inst-nav-item-wrapper">
                      <button
                        type="button"
                        className={`nav-item inst-nav-item ${isActive ? "active" : ""} ${isSpecial ? "special-action-item" : ""}`}
                        onClick={() => {
                          onNavigate(item.name);
                          setMobileNav(false);
                        }}
                        aria-current={isActive ? "page" : undefined}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <Icon size={18} className="nav-icon inst-nav-icon" />
                        {!sidebarCollapsed && <span className="nav-text inst-nav-text">{item.name}</span>}
                        {!sidebarCollapsed && item.badge !== undefined && (
                          <span className={`nav-counter inst-nav-counter ${item.badgeTone || "blue"}`}>
                            {item.badge}
                          </span>
                        )}
                        {sidebarCollapsed && item.badge !== undefined && (
                          <span className="collapsed-dot" />
                        )}
                      </button>

                      {sidebarCollapsed && (
                        <div className="sidebar-tooltip inst-sidebar-tooltip" role="tooltip">
                          <span>{item.name}</span>
                          {item.badge !== undefined && <small>{item.badge}</small>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Instructor Account Selector & Profile Footer */}
        <div className={`sidebar-user inst-sidebar-user ${sidebarCollapsed ? "collapsed-user" : ""}`}>
          <div
            className="avatar inst-avatar"
            title={`${instructorProfile.name} · ${instructorProfile.title}`}
          >
            {instructorProfile.avatarInitials || "RR"}
          </div>

          {!sidebarCollapsed && (
            <div className="user-info inst-user-info">
              <strong>{instructorProfile.name}</strong>
              <small>{instructorProfile.email}</small>
            </div>
          )}

          <button
            type="button"
            className="sidebar-logout-btn inst-sidebar-logout-btn"
            onClick={onLogout}
            title="Sign out & Exit"
            aria-label="Sign out & Exit"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
