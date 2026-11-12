import txIcon from "../../../../../../assets/tx-icon.jpg";
import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";
import { IconButton } from "./ActionButton.jsx";
import { CountBadge } from "./CountBadge.jsx";

function isNumericBadge(value) {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") return /^-?\d+(,\d{3})*$/.test(value.trim());
  return false;
}

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
          <IconButton
            icon={X}
            size="sm"
            variant="neutral"
            className="close-drawer-btn"
            onClick={() => setMobileNav(false)}
            tooltip="Close navigation"
            ariaLabel="Close navigation"
          />
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

                  return (
                    <div key={item.name} className="nav-item-wrapper inst-nav-item-wrapper">
                      <button
                        type="button"
                        className={`nav-item inst-nav-item ${isActive ? "active" : ""}`}
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
                          <CountBadge
                            count={item.badge}
                            max={99}
                            hideZero={isNumericBadge(item.badge)}
                            tone={item.badgeTone || "blue"}
                            variant="inline"
                            title={item.badgeTitle}
                            className="inst-nav-counter-badge"
                          />
                        )}
                        {sidebarCollapsed && item.badge !== undefined && (
                          isNumericBadge(item.badge) ? (
                            <CountBadge
                              count={item.badge}
                              max={9}
                              hideZero={true}
                              tone={item.badgeTone || "blue"}
                              variant="compact"
                              title={item.badgeTitle || `${item.label}: ${item.badge}`}
                            />
                          ) : (
                            <span
                              className="collapsed-dot"
                              title={item.badgeTitle || `${item.label}: ${item.badge}`}
                            />
                          )
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
