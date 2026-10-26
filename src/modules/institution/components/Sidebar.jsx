import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarDays,
  ShieldCheck, Activity, Building2, X
} from 'lucide-react';

export default function Sidebar({
  page,
  setPage,
  mobileOpen,
  setMobileOpen,
  counts,
  onOpenProfile
}) {
  const navGroups = [
    {
      label: 'INSTITUTION',
      items: [
        { label: 'Overview', icon: LayoutDashboard },
        { label: 'Learners', icon: Users, count: counts.learners || '2,140' },
        { label: 'Learning', icon: GraduationCap, count: String(counts.courses || 6) },
        { label: 'Programmes', icon: BookOpen, count: String(counts.programmes || 4) },
        { label: 'Events', icon: CalendarDays, count: String(counts.events || 4) }
      ]
    },
    {
      label: 'GOVERNANCE',
      items: [
        { label: 'Compliance', icon: ShieldCheck, count: String(counts.compliance || 5) },
        { label: 'Reports', icon: Activity }
      ]
    }
  ];

  return (
    <>
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* BRAND */}
        <div className="brand">
          <Link
            to="/"
            className="brand-link"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}
            title="Return to TX Pathwing website"
          >
            <div className="brand-mark">TX</div>
            <strong>Pathwing</strong>
          </Link>
          <button
            type="button"
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* TENANT INFO */}
        <div className="tenant">
          <div className="eyebrow">SIGNED IN AS</div>
          <div className="tenant-info">
            <Building2 size={19} />
            <div>
              <span className="eyebrow">INSTITUTION</span>
              <strong>KITS Warangal</strong>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav aria-label="Main sidebar navigation">
          {navGroups.map(group => (
            <div className="nav-group" key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = page === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setPage(item.label);
                      setMobileOpen(false);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                    {item.count && <small>{item.count}</small>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* USER PROFILE CARD */}
        <button
          type="button"
          className="sidebar-user sidebar-user-btn"
          onClick={onOpenProfile}
          title="View account settings"
        >
          <span className="avatar">RS</span>
          <div>
            <strong>R. Sathyanarayana</strong>
            <span>Tenant admin · KITS Warangal</span>
          </div>
        </button>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
    </>
  );
}
