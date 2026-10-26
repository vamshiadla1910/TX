import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, ChevronRight, Search, X, Bell, Moon, Sun, Globe
} from 'lucide-react';

export default function TopBar({
  page,
  setPage,
  activeDetail,
  setActiveDetail,
  query,
  setQuery,
  searchPlaceholder,
  dark,
  setDark,
  unreadCount,
  notifOpen,
  setNotifOpen,
  onOpenMobile,
  flash
}) {
  const navigate = useNavigate();

  function handleWebsiteClick() {
    navigate('/');
    flash('Navigating to TX Pathwing public website.');
  }

  return (
    <header className="topbar">
      <button
        className="mobile-menu"
        onClick={onOpenMobile}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <div className="breadcrumbs">
        <span
          className="breadcrumb-link"
          onClick={() => {
            navigate('/');
          }}
          title="Return to TX Pathwing website"
        >
          Pathwing
        </span>
        <ChevronRight size={13} />
        <span
          className="breadcrumb-link"
          onClick={() => {
            setPage('Overview');
            setActiveDetail(null);
          }}
        >
          Institution
        </span>
        <ChevronRight size={13} />
        <strong
          className={activeDetail ? 'breadcrumb-link' : ''}
          onClick={() => {
            if (activeDetail) setActiveDetail(null);
          }}
        >
          {page}
        </strong>
        {activeDetail && (
          <>
            <ChevronRight size={13} />
            <span className="breadcrumb-sub">
              {activeDetail.record.title ||
                activeDetail.record.name ||
                activeDetail.record.requirement ||
                'Details'}
            </span>
          </>
        )}
      </div>

      <div className="top-actions">
        <label className="searchbox">
          <Search size={16} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </label>

        <button
          className={`icon-btn notification ${notifOpen ? 'active' : ''}`}
          aria-label={`Notifications (${unreadCount} unread)`}
          onClick={() => setNotifOpen(!notifOpen)}
        >
          <Bell size={17} />
          {unreadCount > 0 && <i>{unreadCount}</i>}
        </button>

        <button
          className="icon-btn"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          className="btn secondary website-btn"
          onClick={handleWebsiteClick}
          aria-label="Visit TX Pathwing public website"
        >
          <Globe size={15} />
          <span>Website</span>
        </button>
      </div>
    </header>
  );
}
