import React from "react";
import { Link } from "react-router-dom";
import txIcon from "../../../../../../../assets/tx-icon.jpg";
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  Code2,
  Briefcase,
  LogOut,
  X,
  ClipboardCheck,
  Award,
} from "lucide-react";

export default function DashboardSidebar({
  userProfile,
  activeTab,
  onTabClick,
  enrollmentsCount = 2,
  mobileOpen = false,
  onCloseMobile,
  onLogout,
}) {
  const navigationGroups = [
    {
      section: "LEARN",
      items: [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "My courses", icon: BookOpen, count: enrollmentsCount || 2 },
        { name: "AI assistant", icon: Bot },
        { name: "Coding lab", icon: Code2, count: 3 },
      ],
    },
    {
      section: "PROGRESS",
      items: [
        { name: "Assessments", icon: ClipboardCheck, count: 6 },
        { name: "Certificates", icon: Award, count: 3 },
      ],
    },
    {
      section: "NEXT",
      items: [{ name: "Careers", icon: Briefcase }],
    },
  ];

  return (
    <aside className={`dashboard-sidebar ${mobileOpen ? "open" : ""}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <Link to="/" className="brand-link" title="Return to Home">
          <div className="sidebar-logo-box">
            <img src={txIcon} alt="TX Pathwing" className="student-sidebar-logo" />
          </div>
          <span className="brand-name">Pathwing</span>
        </Link>
        <button
          type="button"
          className="sidebar-close-mobile"
          onClick={onCloseMobile}
          aria-label="Close sidebar navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Signed In Student Indicator */}
      <div className="sidebar-student-selector">
        <label>SIGNED IN ACCOUNT</label>
        <div className="sidebar-student-badge">
          <span className="sidebar-student-dot" />
          <span className="sidebar-student-email">
            {userProfile?.email || "student@pathwing.com"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">
        {navigationGroups.map((group) => (
          <div key={group.section} className="sidebar-nav-section">
            <span className="sidebar-section-title">{group.section}</span>
            <div className="sidebar-items-list">
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                    onClick={() => onTabClick(item.name)}
                  >
                    <div className="nav-item-left">
                      <IconComponent className="nav-item-icon" size={18} />
                      <span className="nav-item-label">{item.name}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="sidebar-count">{item.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile Footer */}
      <div className="sidebar-profile">
        <div className="profile-info-group">
          <div className="profile-avatar">{userProfile?.initials || "ST"}</div>
          <div className="profile-details">
            <p className="profile-name">{userProfile?.name || "Student"}</p>
            <p className="profile-description">
              {userProfile?.email || "Student Portal"}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={onLogout}
          title="Log out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
