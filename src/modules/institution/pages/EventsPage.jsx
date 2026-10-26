import React, { useState, useMemo } from 'react';
import { Plus, CalendarDays, ArrowRight, X } from 'lucide-react';

export default function EventsPage({
  events,
  query,
  setQuery,
  onOpenAddEvent,
  onOpenEventDetail,
  flash
}) {
  const [categoryFilter, setCategoryFilter] = useState('All categories');

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchCat = categoryFilter === 'All categories' || e.category === categoryFilter;
      const matchQuery = !query.trim() ||
        `${e.title} ${e.desc} ${e.day} ${e.category || ''} ${e.targetAudience || ''}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [events, categoryFilter, query]);

  const placementDrivesCount = events.filter(e => e.category === 'Placement' || e.title.toLowerCase().includes('placement')).length;
  const needsAttentionCount = events.filter(e => e.type === 'orange' || e.category === 'Compliance').length;

  return (
    <div className="events-container">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">SCHEDULE · EVENTS</div>
          <h1>Events</h1>
          <p>Browse upcoming academic, placement, and industry events for your institution.</p>
        </div>
        <div className="heading-action">
          <button
            type="button"
            className="btn primary"
            onClick={onOpenAddEvent}
          >
            <Plus size={15} />
            <span>Add event</span>
          </button>
        </div>
      </div>

      {/* STAT STRIP */}
      <div className="stat-strip card">
        <div className="stat">
          <strong>{events.length}</strong>
          <span>Upcoming events</span>
        </div>
        <div className="stat">
          <strong>640</strong>
          <span>Learners in assessments</span>
        </div>
        <div className="stat">
          <strong>{placementDrivesCount || 1}</strong>
          <span>Placement drives</span>
        </div>
        <div className="stat">
          <strong>{needsAttentionCount || 1}</strong>
          <span>Needs attention</span>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="category-filter-row">
        {['All categories', 'Academic', 'Placement', 'Industry', 'Compliance'].map(cat => (
          <button
            key={cat}
            type="button"
            className={`filter-pill-btn ${categoryFilter === cat ? 'active' : ''}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* EVENTS PANEL */}
      <section className="panel card">
        <div className="panel-head">
          <div>September 2026</div>
          <div className="panel-aside">
            <CalendarDays size={17} />
          </div>
        </div>

        <p className="panel-description">
          Select an event to view its full schedule, target audience, venue, and attendance details.
        </p>

        <div className="event-list full">
          {filteredEvents.map(e => (
            <button
              key={e.id || e.title}
              type="button"
              className="event-row event-button"
              onClick={() => onOpenEventDetail(e)}
              title={`View details for ${e.title}`}
            >
              <span className={`date-chip ${e.type || 'blue'}`}>{e.day}</span>
              <div>
                <strong>{e.title}</strong>
                <p>{e.desc}</p>
              </div>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="empty">
            <p>No events found matching your filter criteria.</p>
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setCategoryFilter('All categories');
                setQuery('');
              }}
            >
              <X size={14} />
              <span>Reset filter</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
