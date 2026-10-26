import React, { useState, useMemo } from 'react';
import {
  GraduationCap, Users, CheckCircle2, Download, ArrowRight, X, Star
} from 'lucide-react';
import { exportCatalogueCSV } from '../data/storage.js';

export default function LearningPage({
  courses,
  query,
  setQuery,
  onOpenCourseDetail,
  flash
}) {
  const [categoryFilter, setCategoryFilter] = useState('All categories');

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchCat = categoryFilter === 'All categories' || c.category === categoryFilter;
      const matchQuery = !query.trim() ||
        `${c.title} ${c.category} ${c.teacher} ${c.description || ''}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [courses, categoryFilter, query]);

  const totalEnrollments = courses.reduce((sum, c) => sum + (c.learners || 0), 0);
  const avgCompletion = Math.round(
    courses.reduce((sum, c) => sum + (c.progress || 0), 0) / (courses.length || 1)
  );

  function handleExport() {
    exportCatalogueCSV(filteredCourses);
    flash(`Exported ${filteredCourses.length} course(s) to catalogue CSV.`);
  }

  const categories = ['All categories', 'SOFTWARE DEVELOPMENT', 'CLOUD COMPUTING', 'DATA & AI', 'SECURITY'];

  return (
    <div className="learning-container">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">ACADEMICS · LEARNING</div>
          <h1>Learning</h1>
          <p>Track courses delivered across your institution and their learner outcomes.</p>
        </div>
        <div className="heading-action">
          <button
            type="button"
            className="btn secondary"
            onClick={handleExport}
            title="Download complete course catalogue as CSV"
          >
            <Download size={15} />
            <span>Export catalogue</span>
          </button>
        </div>
      </div>

      {/* STAT STRIP */}
      <div className="stat-strip card">
        <div className="stat">
          <strong>{courses.length}</strong>
          <span>Courses available</span>
        </div>
        <div className="stat">
          <strong>{totalEnrollments.toLocaleString()}</strong>
          <span>Course enrollments</span>
        </div>
        <div className="stat">
          <strong>{avgCompletion}%</strong>
          <span>Average completion</span>
        </div>
        <div className="stat">
          <strong>4.7</strong>
          <span>Average feedback</span>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="category-filter-row">
        {categories.map(cat => (
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

      {/* COURSE CARDS GRID */}
      <div className="course-grid">
        {filteredCourses.map(c => (
          <article className="course-card card" key={c.id || c.title}>
            <div className={`course-banner ${c.color || 'blue'}`}>
              <GraduationCap size={21} />
              <span>{c.category}</span>
            </div>
            <div className="course-body">
              <span className="status good">Active</span>
              <h3>{c.title}</h3>
              <p>Delivered by {c.teacher}</p>

              <div className="course-meta">
                <span>
                  <Users size={14} />
                  {c.learners} learners
                </span>
                <span>
                  <CheckCircle2 size={14} />
                  {c.progress}% complete
                </span>
              </div>

              <div className="progress">
                <span style={{ width: `${c.progress}%` }} />
              </div>

              <button
                type="button"
                className="text-action"
                onClick={() => onOpenCourseDetail(c)}
                title={`View curriculum & details for ${c.title}`}
              >
                <span>View course details</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="empty card">
          <p>No courses match your filter or search query.</p>
          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setCategoryFilter('All categories');
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
