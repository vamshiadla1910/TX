import React, { useMemo, useState } from "react";
import "./Courses.css";
import {
  BookOpen, CheckCircle2, Eye, Filter, Plus, Search,
  SearchX, ShieldAlert, Star, Users, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Courses({
  courses,
  setCourses,
  selectedCourse,
  setSelectedCourse,
  setNotice,
  setPage
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = useMemo(() => {
    return Array.from(new Set(courses.map(c => c.category)));
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = `${c.title} ${c.instructor} ${c.organization} ${c.category}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchCat = categoryFilter === "All" || c.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [courses, search, statusFilter, categoryFilter]);

  const publishedCount = courses.filter(c => c.status === "Published").length;
  const inReviewCount = courses.filter(c => c.status === "Pending Review" || c.status === "Overdue").length;
  const overdueCount = courses.filter(c => c.status === "Overdue").length;
  const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrollments || 0), 0);

  function handlePublish(courseId) {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const updated = { ...c, status: "Published", slaStatus: "Approved" };
          if (selectedCourse && selectedCourse.id === courseId) {
            setSelectedCourse(updated);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice(`Course "${selectedCourse?.title}" has been published to the platform catalog.`);
  }

  function handleUnpublish(courseId) {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const updated = { ...c, status: "Draft" };
          if (selectedCourse && selectedCourse.id === courseId) {
            setSelectedCourse(updated);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice(`Course "${selectedCourse?.title}" moved to draft status.`);
  }

  function handleAssignReviewer(courseId, reviewer) {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const updated = { ...c, assignedReviewer: reviewer };
          if (selectedCourse && selectedCourse.id === courseId) {
            setSelectedCourse(updated);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice(`Reviewer "${reviewer}" assigned to course.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="PUBLISHED COURSES" value={String(286 + publishedCount - 2)} foot="Platform catalogue" icon={BookOpen} />
        <Metric label="IN REVIEW" value={String(inReviewCount)} foot={`${overdueCount} past SLA`} icon={ShieldAlert} tone={overdueCount > 0 ? "negative" : "warning"} />
        <Metric label="SLA BREACHES" value={String(overdueCount)} foot="Requires attention" icon={ShieldAlert} tone={overdueCount > 0 ? "negative" : "positive"} />
        <Metric label="ENROLLMENTS" value={(12840 + totalEnrollments).toLocaleString("en-IN")} foot="Active learners" icon={Users} />
      </div>

      {selectedCourse ? (
        <InlineDetailView
          title={selectedCourse.title}
          subtitle={`${selectedCourse.category} · ${selectedCourse.organization}`}
          status={selectedCourse.status}
          id={selectedCourse.id}
          onBack={() => setSelectedCourse(null)}
          actions={
            <>
              {selectedCourse.status !== "Published" ? (
                <button
                  className="primary btn-sm"
                  onClick={() => handlePublish(selectedCourse.id)}
                >
                  <CheckCircle2 size={14} /> Approve & Publish Course
                </button>
              ) : (
                <button
                  className="secondary btn-sm"
                  onClick={() => handleUnpublish(selectedCourse.id)}
                >
                  Unpublish to Draft
                </button>
              )}
              {(selectedCourse.status === "Overdue" || selectedCourse.status === "Pending Review") && (
                <button
                  className="secondary btn-sm"
                  onClick={() => setPage("Moderation")}
                >
                  Open in Moderation Queue
                </button>
              )}
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Course Meta & Overview</h3>
              <div className="detail-fields-list">
                <DetailField label="Course Title" value={selectedCourse.title} />
                <DetailField label="Lead Instructor" value={selectedCourse.instructor} />
                <DetailField label="Host Organization" value={selectedCourse.organization} />
                <DetailField label="Subject Domain" value={selectedCourse.category} />
                <DetailField label="Complexity Level" value={selectedCourse.level} />
                <DetailField label="Course Duration" value={selectedCourse.duration} />
                <DetailField label="Retail Price" value={selectedCourse.price} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Enrollment & SLA Moderation</h3>
              <div className="detail-fields-list">
                <DetailField label="Total Enrollments" value={selectedCourse.enrollments ? `${selectedCourse.enrollments} Students` : "None"} />
                <DetailField label="Average Student Rating">
                  <span className="rating-pill">
                    <Star size={13} className="text-warning fill-warning" /> {selectedCourse.rating || "Not rated"}
                  </span>
                </DetailField>
                <DetailField label="Submission Date" value={selectedCourse.submittedDate} />
                <DetailField label="SLA Window" value={selectedCourse.slaWindow} />
                <DetailField label="SLA Health">
                  <Badge tone={selectedCourse.status === "Overdue" ? "danger" : selectedCourse.status === "Published" ? "success" : "warning"}>
                    {selectedCourse.slaStatus || selectedCourse.status}
                  </Badge>
                </DetailField>
                <DetailField label="Assigned Reviewer">
                  <select
                    className="select-inline"
                    value={selectedCourse.assignedReviewer || "Unassigned"}
                    onChange={e => handleAssignReviewer(selectedCourse.id, e.target.value)}
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Sunil Nambiar">Sunil Nambiar (Platform Admin)</option>
                    <option value="Vikram Patel">Vikram Patel (Senior Faculty)</option>
                    <option value="Platform Review Team">Platform Review Team</option>
                  </select>
                </DetailField>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Course Description & Learning Outcomes</h3>
            <p className="detail-prose">{selectedCourse.description}</p>
            <DetailField label="Prerequisites" value={selectedCourse.prerequisites} />
          </div>

          {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 && (
            <div className="detail-section">
              <h3>Curriculum Modules & Syllabus</h3>
              <div className="syllabus-list">
                {selectedCourse.syllabus.map((item, index) => (
                  <div className="syllabus-item" key={index}>
                    <span className="syllabus-idx">{index + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Course Catalogue & Submissions</h2>
              <Badge>{filtered.length} shown</Badge>
            </div>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search course title, instructor, organization..."
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Overdue">Overdue</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category:</label>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Organization & Instructor</th>
                  <th>Duration</th>
                  <th>Enrollments</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr
                    key={c.id}
                    className="hoverable-row"
                    onClick={() => setSelectedCourse(c)}
                  >
                    <td>
                      <strong>{c.title}</strong>
                      <small className="row-sub">{c.level} · {c.modulesCount} Modules</small>
                    </td>
                    <td>{c.category}</td>
                    <td>
                      <strong>{c.organization}</strong>
                      <small className="row-sub">{c.instructor}</small>
                    </td>
                    <td>{c.duration}</td>
                    <td>{c.enrollments.toLocaleString("en-IN")}</td>
                    <td>
                      <span className="rating-pill">
                        <Star size={12} className="text-warning fill-warning" /> {c.rating}
                      </span>
                    </td>
                    <td><Badge tone={getStatusTone(c.status)}>{c.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedCourse(c);
                        }}
                      >
                        <Eye size={13} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <SearchX size={28} />
              <p>No courses match your filter parameters.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
