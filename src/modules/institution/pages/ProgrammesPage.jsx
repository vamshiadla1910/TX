import React, { useState, useMemo } from 'react';
import { Plus, ArrowRight, X } from 'lucide-react';

export default function ProgrammesPage({
  programmes,
  query,
  setQuery,
  onOpenNewProgramme,
  onOpenProgrammeDetail,
  flash
}) {
  const [statusFilter, setStatusFilter] = useState('All statuses');

  const filteredProgrammes = useMemo(() => {
    return programmes.filter(p => {
      const matchStatus = statusFilter === 'All statuses' || p.status === statusFilter;
      const matchQuery = !query.trim() ||
        `${p.title} ${p.id} ${p.detail || ''} ${p.status}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [programmes, statusFilter, query]);

  const totalEnrolled = programmes.reduce((sum, p) => sum + (p.learners || 0), 0);
  const avgCompletion = Math.round(
    programmes.reduce((sum, p) => sum + (p.progress || 0), 0) / (programmes.length || 1)
  );
  const seatsRemaining = Math.max(0, 2500 - totalEnrolled);

  return (
    <div className="programmes-container">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">ACADEMICS · PROGRAMMES</div>
          <h1>Programmes</h1>
          <p>Manage structured learning pathways, cohorts, capacity, and term progress.</p>
        </div>
        <div className="heading-action">
          <button
            type="button"
            className="btn primary"
            onClick={onOpenNewProgramme}
          >
            <Plus size={15} />
            <span>New programme</span>
          </button>
        </div>
      </div>

      {/* STAT STRIP */}
      <div className="stat-strip card">
        <div className="stat">
          <strong>{programmes.length}</strong>
          <span>Active programmes</span>
        </div>
        <div className="stat">
          <strong>{(2140 + (totalEnrolled > 2140 ? totalEnrolled - 2140 : 0)).toLocaleString()}</strong>
          <span>Enrolled learners</span>
        </div>
        <div className="stat">
          <strong>{avgCompletion}%</strong>
          <span>Average completion</span>
        </div>
        <div className="stat">
          <strong>{seatsRemaining.toLocaleString()}</strong>
          <span>Seats remaining</span>
        </div>
      </div>

      {/* STATUS FILTER PILLS */}
      <div className="category-filter-row">
        {['All statuses', 'In progress', 'Enrollment open'].map(st => (
          <button
            key={st}
            type="button"
            className={`filter-pill-btn ${statusFilter === st ? 'active' : ''}`}
            onClick={() => setStatusFilter(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {/* PROGRAMMES LIST */}
      <div className="programme-list">
        {filteredProgrammes.map((p, i) => (
          <article
            className="programme-row card"
            key={p.id || p.title}
            onClick={() => onOpenProgrammeDetail(p)}
            style={{ cursor: 'pointer' }}
          >
            <span className="programme-number">0{i + 1}</span>
            <div className="programme-main">
              <div className="programme-id">
                {p.id}{' '}
                <span className={`status ${p.status === 'In progress' ? 'good' : 'warning'}`}>
                  {p.status}
                </span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.detail || `${p.duration} · ${(p.departments || []).join(', ')}`}</p>

              <div className="cohort-label">
                <span>Cohort completion</span>
                <strong>{p.progress}%</strong>
              </div>
              <div className="progress">
                <span style={{ width: `${p.progress}%` }} />
              </div>
            </div>

            <div className="programme-count">
              <strong>{p.learners}</strong>
              <span>learners</span>
            </div>

            <button
              type="button"
              className="square-action"
              onClick={e => {
                e.stopPropagation();
                onOpenProgrammeDetail(p);
              }}
              aria-label={`View details for ${p.title}`}
              title={`View ${p.title} pathway`}
            >
              <ArrowRight size={17} />
            </button>
          </article>
        ))}
      </div>

      {filteredProgrammes.length === 0 && (
        <div className="empty card">
          <p>No programmes match your filter criteria.</p>
          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setStatusFilter('All statuses');
              setQuery('');
            }}
          >
            <X size={14} />
            <span>Reset filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
