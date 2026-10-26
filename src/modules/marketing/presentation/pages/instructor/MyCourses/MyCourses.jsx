import React, { useState, useMemo } from "react";
import {
  BookOpen, Plus, Search, Sparkles, Star, Users,
  CheckCircle2, Clock, IndianRupee, Filter, X, ArrowRight, Layers
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import "./MyCourses.css";

export function MyCourses({ courses = [], onNavigate, onSelectCourse }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSyllabusCourse, setSelectedSyllabusCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        c.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [courses, search, statusFilter]);

  const totalEnrolled = useMemo(() => {
    return courses.reduce((acc, c) => acc + (c.enrolledLearners || 0), 0);
  }, [courses]);

  // Standard modules generator for courses that don't have detailed custom syllabus
  const getCourseModules = (course) => {
    if (course.modules && course.modules.length > 0) {
      return course.modules;
    }
    const count = course.modulesCount || 4;
    return [
      {
        num: 1,
        title: `Foundations of ${course.title.split(" ")[0]} & Architecture`,
        duration: "12 hours",
        topics: ["Core mental models", "Environment configuration", "Fundamental syntax & primitives"]
      },
      {
        num: 2,
        title: "Deep Dive into Enterprise Design Patterns",
        duration: "16 hours",
        topics: ["Scalable project topology", "State management & caching", "Resilience & error boundaries"]
      },
      {
        num: 3,
        title: "Integration, Automation & Cloud Deployment",
        duration: "14 hours",
        topics: ["CI/CD pipelines", "Production observability", "Dockerized sandbox execution"]
      },
      {
        num: 4,
        title: "Capstone Project & Industry Portfolio Evaluation",
        duration: "10 hours",
        topics: ["End-to-end architecture build", "Automated test suites", "Mentor review rubric"]
      }
    ].slice(0, count);
  };

  return (
    <div className="inst-mc-container">
      {/* Top Header */}
      <div className="inst-mc-header">
        <div className="inst-mc-title-wrap">
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span>
            <span className="separator">/</span>
            <span>Instructor</span>
            <span className="separator">/</span>
            <strong className="current">My Courses</strong>
          </div>
          <h1 className="inst-mc-title">My Courses</h1>
          <p className="inst-mc-subtitle">
            Manage your courses and learning tracks.
          </p>
        </div>

        <button
          type="button"
          className="inst-mc-btn-ai"
          onClick={() => onNavigate("AI Course Builder")}
        >
          <Sparkles size={16} />
          <span>Create Course</span>
        </button>
      </div>

      {/* Summary Metrics Row */}
      <div className="inst-mc-stats-grid">
        <div className="inst-mc-stat-card">
          <div className="inst-mc-stat-icon">
            <BookOpen size={20} />
          </div>
          <div className="inst-mc-stat-info">
            <strong>{courses.length}</strong>
            <small>Active Courses</small>
          </div>
        </div>

        <div className="inst-mc-stat-card">
          <div className="inst-mc-stat-icon">
            <Users size={20} />
          </div>
          <div className="inst-mc-stat-info">
            <strong>{totalEnrolled.toLocaleString("en-IN")}</strong>
            <small>Total Enrolled</small>
          </div>
        </div>

        <div className="inst-mc-stat-card">
          <div className="inst-mc-stat-icon warning">
            <Star size={20} />
          </div>
          <div className="inst-mc-stat-info">
            <strong>4.92 ★</strong>
            <small>Average Rating</small>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="inst-mc-filter-row">
        <div className="inst-mc-search-box">
          <Search size={16} className="inst-mc-search-icon" />
          <input
            type="text"
            className="inst-mc-search-input"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="inst-mc-filter-pills">
          {["all", "published", "in review", "draft"].map((status) => (
            <button
              key={status}
              type="button"
              className={`inst-mc-pill-btn ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="inst-mc-grid">
        {filteredCourses.length === 0 ? (
          <div className="inst-mc-empty-state">
            <BookOpen size={36} className="text-muted" />
            <h3>No courses found</h3>
            <p>Try clearing your search or create a new course.</p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const tone = getStatusTone(course.status);
            return (
              <article key={course.id} className="inst-mc-card">
                <div className="inst-mc-card-head">
                  <div className="inst-mc-code-tag">{course.code}</div>
                  <Badge tone={tone}>{course.status}</Badge>
                </div>

                <h3 className="inst-mc-course-title">{course.title}</h3>
                <span className="inst-mc-course-subtitle">
                  {course.category} · {course.level}
                </span>

                <div className="inst-mc-metrics-box">
                  <div className="inst-mc-metric">
                    <Users size={14} />
                    <span>{Number(course.enrolledLearners || 0).toLocaleString("en-IN")} Students</span>
                  </div>
                  <div className="inst-mc-metric">
                    <CheckCircle2 size={14} />
                    <span>{course.completionRate || 85}% Done</span>
                  </div>
                  <div className="inst-mc-metric">
                    <Star size={14} className="star-icon" />
                    <span>{course.rating || 4.9} ({course.reviewsCount || 0})</span>
                  </div>
                  <div className="inst-mc-metric">
                    <Clock size={14} />
                    <span>{course.modulesCount || 6} Modules ({course.totalHours || 40}h)</span>
                  </div>
                </div>

                <div className="inst-mc-card-foot">
                  <div className="inst-mc-revenue">
                    <small>Generated Revenue</small>
                    <strong>₹{Number(course.revenue || 0).toLocaleString("en-IN")}</strong>
                  </div>

                  <div className="inst-mc-actions">
                    <button
                      type="button"
                      className="inst-mc-btn-outline"
                      onClick={() => setSelectedSyllabusCourse(course)}
                    >
                      Syllabus
                    </button>
                    <button
                      type="button"
                      className="inst-mc-btn-primary"
                      onClick={() => onNavigate("Learners")}
                    >
                      Learners
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Interactive Syllabus Preview Modal */}
      {selectedSyllabusCourse && (
        <div className="inst-syllabus-modal-backdrop" onClick={() => setSelectedSyllabusCourse(null)}>
          <div
            className="inst-syllabus-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="inst-syllabus-modal-header">
              <div>
                <div className="inst-mc-code-tag">{selectedSyllabusCourse.code}</div>
                <h2 className="inst-syllabus-title">{selectedSyllabusCourse.title}</h2>
                <p className="inst-syllabus-sub">
                  {selectedSyllabusCourse.category} · {selectedSyllabusCourse.level} · {selectedSyllabusCourse.totalHours || 48} Hours Total
                </p>
              </div>
              <button
                type="button"
                className="inst-modal-close-btn"
                onClick={() => setSelectedSyllabusCourse(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="inst-syllabus-modules-list">
              <h3 className="inst-syllabus-section-lbl">
                <Layers size={16} /> Course Syllabus & Learning Path ({selectedSyllabusCourse.modulesCount || 4} Modules)
              </h3>
              {getCourseModules(selectedSyllabusCourse).map((mod, idx) => (
                <div key={idx} className="inst-syllabus-module-card">
                  <div className="inst-module-header">
                    <span className="inst-module-badge">Module {mod.num || idx + 1}</span>
                    <strong className="inst-module-title">{mod.title}</strong>
                    <span className="inst-module-hours">{mod.duration || "8 hours"}</span>
                  </div>
                  {mod.topics && (
                    <ul className="inst-module-topics">
                      {mod.topics.map((t, tidx) => (
                        <li key={tidx}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="inst-syllabus-modal-footer">
              <button
                type="button"
                className="inst-mc-btn-outline"
                onClick={() => setSelectedSyllabusCourse(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="inst-mc-btn-ai"
                onClick={() => {
                  setSelectedSyllabusCourse(null);
                  if (onSelectCourse) onSelectCourse(selectedSyllabusCourse);
                  onNavigate("AI Course Builder");
                }}
              >
                <Sparkles size={16} />
                <span>Enhance with AI Builder</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
