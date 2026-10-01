import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Timer,
  BarChart3,
  Trophy,
  FileBarChart,
  Sparkles,
  LogOut,
  Menu,
  X
} from "lucide-react";
import Overview from "./Overview";
import "./HackathonDashboard.css";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    id: "teams",
    label: "Teams",
    icon: Users
  },
  {
    id: "round1",
    label: "Round 1",
    icon: Timer,
    badge: 6,
    color: "violet"
  },
  {
    id: "round2",
    label: "Round 2",
    icon: BarChart3,
    badge: 4,
    color: "amber"
  },
  {
    id: "round3",
    label: "Round 3",
    icon: Trophy,
    badge: 3,
    color: "emerald"
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileBarChart
  }
];

const HackathonDashboard = () => {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="hackathon-dashboard-wrapper">

      {/* SIDEBAR */}
      <aside
        className={`hd-sidebar ${
          mobileOpen ? "hd-sidebar-open" : ""
        }`}
      >

        {/* SIDEBAR HEADER */}
        <div className="hd-sidebar-header">

          <div className="hd-logo">
            <Sparkles size={20} />
          </div>

          <div className="hd-brand">
            <div className="hd-brand-title">
              Hackathon
            </div>

            <div className="hd-brand-sub">
              Judge Portal
            </div>
          </div>

          <button
            className="hd-mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={16} />
          </button>

        </div>

        {/* NAVIGATION */}
        <nav className="hd-nav">

          {navItems.map((item) => {

            const isActive = active === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setMobileOpen(false);
                }}
                className={`hd-nav-item ${
                  isActive ? "hd-nav-active" : ""
                }`}
              >

                <Icon className="hd-nav-icon" />

                <span className="hd-nav-label">
                  {item.label}
                </span>

                {item.badge && (
                  <span
                    className={`hd-badge hd-badge-${item.color} ${
                      isActive ? "hd-badge-active" : ""
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

              </button>
            );
          })}

        </nav>

        {/* USER CARD */}
        <div className="hd-sidebar-footer">

          <div className="hd-user-card">

            <div className="hd-user-avatar">
              J
            </div>

            <div className="hd-user-info">

              <div className="hd-user-email">
                judge@hackathon.com
              </div>

              <div className="hd-user-role">
                Lead Judge
              </div>

            </div>

            <button className="hd-logout-btn"
            onClick={() => navigate("/")}
            >
              <LogOut size={16} />
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN */}
      <div className="hd-main">

        {/* MOBILE TOPBAR */}
        <div className="hd-mobile-topbar">

          <button
            onClick={() => setMobileOpen(true)}
            className="hd-menu-btn"
          >
            <Menu size={20} />
          </button>

          <div className="hd-mobile-brand">
            INNOVATE 2025
          </div>

        </div>

        {/* CONTENT */}

        {active === "dashboard" ? (

          <div className="hd-content">
            <Overview />
          </div>

        ) : (

          <div className="hd-empty-wrapper">

            <div className="hd-empty-box">

              <div className="hd-empty-icon">

                {(() => {

                  const ActiveIcon =
                    navItems.find(
                      (item) => item.id === active
                    )?.icon;

                  return ActiveIcon ? (
                    <ActiveIcon size={32} />
                  ) : null;

                })()}

              </div>

              <h2 className="hd-empty-title">
                {active}
              </h2>

              <p className="hd-empty-text">
                Empty screen - {active} page content will go here
              </p>

              <div className="hd-empty-tag">
                Left sidebar navigation working
              </div>

            </div>

          </div>

        )}

      </div>

      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <div
          className="hd-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

    </div>
  );
};

export default HackathonDashboard;