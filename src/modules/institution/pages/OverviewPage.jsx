import React from 'react';
import {
  Users, TrendingUp, Award, BriefcaseBusiness, BookOpen,
  ArrowRight, FileUp, CalendarDays, GraduationCap, ShieldCheck,
  ChartNoAxesCombined
} from 'lucide-react';

export default function OverviewPage({
  stats,
  departments,
  events,
  setPage,
  onOpenImportCSV,
  onOpenEventDetail,
  onFilterDepartment
}) {
  const quickLinks = [
    { label: 'Learners', icon: Users },
    { label: 'Learning', icon: GraduationCap },
    { label: 'Programmes', icon: BookOpen },
    { label: 'Events', icon: CalendarDays },
    { label: 'Compliance', icon: ShieldCheck },
    { label: 'Reports', icon: ChartNoAxesCombined }
  ];

  return (
    <div className="overview-container">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">INSTITUTION OVERVIEW</div>
          <h1>KITS Warangal</h1>
          <p>
            {stats.totalLearners} learners across {departments.length} departments · industry-academia programme, batch 2026–27
          </p>
        </div>
        <div className="heading-action">
          <button
            type="button"
            className="btn primary"
            onClick={onOpenImportCSV}
          >
            <FileUp size={15} />
            <span>Bulk import learners</span>
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="metrics-grid five">
        <article className="metric card">
          <div className="metric-top">
            <span className="eyebrow">ENROLLED LEARNERS</span>
            <span className="metric-icon blue"><Users size={18} /></span>
          </div>
          <div className="metric-value">{stats.totalLearners}</div>
          <div className="metric-sub">
            <TrendingUp size={13} className="trend" />
            <span>186 added this term</span>
          </div>
        </article>

        <article className="metric card">
          <div className="metric-top">
            <span className="eyebrow">PROGRAMME COMPLETION</span>
            <span className="metric-icon green"><TrendingUp size={18} /></span>
          </div>
          <div className="metric-value">{stats.programCompletion}</div>
          <div className="metric-sub">
            <TrendingUp size={13} className="trend" />
            <span>6 pts vs last term</span>
          </div>
        </article>

        <article className="metric card">
          <div className="metric-top">
            <span className="eyebrow">CERTIFIED THIS TERM</span>
            <span className="metric-icon orange"><Award size={18} /></span>
          </div>
          <div className="metric-value">{stats.certifiedCount}</div>
          <div className="metric-sub">
            <span>of 852 eligible</span>
          </div>
        </article>

        <article className="metric card">
          <div className="metric-top">
            <span className="eyebrow">PLACEMENT-READY</span>
            <span className="metric-icon teal"><BriefcaseBusiness size={18} /></span>
          </div>
          <div className="metric-value">{stats.placementReady}</div>
          <div className="metric-sub">
            <span>fit score ≥ 80</span>
          </div>
        </article>

        <article className="metric card">
          <div className="metric-top">
            <span className="eyebrow">SEATS REMAINING</span>
            <span className="metric-icon red"><BookOpen size={18} /></span>
          </div>
          <div className="metric-value">{stats.seatsRemaining}</div>
          <div className="metric-sub">
            <span>of 2,500 contracted</span>
          </div>
        </article>
      </div>

      {/* OVERVIEW GRID */}
      <div className="overview-grid">
        {/* DEPARTMENT COMPLETION PANEL */}
        <section className="panel card">
          <div className="panel-head">
            <div>Completion by department</div>
            <div className="panel-aside">
              <span className="micro">Current term</span>
            </div>
          </div>
          <div className="department-chart">
            {departments.map(d => (
              <button
                key={d.name}
                type="button"
                className="bar-row bar-row-interactive"
                onClick={() => onFilterDepartment(d.name)}
                title={`Filter learners by ${d.name} (${d.value}% completion)`}
              >
                <span>{d.name}</span>
                <div className="bar-track">
                  <div style={{ width: `${d.value}%` }} />
                </div>
                <strong>{d.value}%</strong>
              </button>
            ))}
          </div>
        </section>

        {/* PROGRAMME CALENDAR PANEL */}
        <section className="panel card">
          <div className="panel-head">
            <div>Programme calendar</div>
            <div className="panel-aside">
              <button
                type="button"
                className="text-action"
                onClick={() => setPage('Events')}
              >
                <span>All events</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="event-list compact">
            {events.slice(0, 4).map(e => (
              <button
                key={e.id || e.title}
                type="button"
                className="event-row event-button-interactive"
                onClick={() => onOpenEventDetail(e)}
                title={`View details for ${e.title}`}
              >
                <span className={`date-chip ${e.type || 'blue'}`}>{e.day}</span>
                <div>
                  <strong>{e.title}</strong>
                  <p>{e.desc}</p>
                </div>
                <ArrowRight size={14} className="hover-arrow" />
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* INSTITUTION WORKSPACE QUICK LINKS */}
      <section className="panel card">
        <div className="panel-head">
          <div>Institution workspace</div>
          <div className="panel-aside">
            <span className="micro">Quick access</span>
          </div>
        </div>
        <div className="quick-links">
          {quickLinks.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setPage(item.label)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                <ArrowRight size={15} />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
