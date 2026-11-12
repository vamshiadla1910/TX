import { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  Star,
  Users,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Archive,
  RotateCcw,
  Send,
  SlidersHorizontal,
  AlertCircle,
  X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { ActionButton, IconButton } from "../common/ActionButton.jsx";
import { MoreActionsMenu } from "../common/MoreActionsMenu.jsx";
import { SyllabusModal } from "./components/Syllabus/SyllabusModal.jsx";
import {
  EditCourseModal,
  DeleteCourseConfirmation,
  ViewCourseModal
} from "./components/CourseManagement/index.js";
import { AICourseBuilder } from "../AICourseBuilder/AICourseBuilder.jsx";
import { courseService } from "./services/courseService.js";
import "./MyCourses.css";

export function MyCourses({
  courses = [],
  learners = [],
  batches = [],
  instructorProfile,
  initialOpenCreate = false,
  onConsumeOpenCreate,
  onCreateCourse,
  onUpdateCourse,
  onDeleteOrArchiveCourse,
  onRestoreCourse,
  onSyncSyllabus,
  onNavigate
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workspaceMode, setWorkspaceMode] = useState(() =>
    initialOpenCreate ? "create" : "list"
  );
  const [studioCourseId, setStudioCourseId] = useState(null);

  const [viewingCourseId, setViewingCourseId] = useState(null);
  const [selectedSyllabusCourseId, setSelectedSyllabusCourseId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { course, impact }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success"|"error", text }

  useEffect(() => {
    if (initialOpenCreate && typeof onConsumeOpenCreate === "function") {
      onConsumeOpenCreate();
    }
  }, [initialOpenCreate, onConsumeOpenCreate]);

  const showBanner = (type, text) => {
    setFeedback({ type, text });
  };

  const activeCoursesCount = useMemo(() => {
    return courses.filter((c) => String(c.status || "").toLowerCase() !== "archived").length;
  }, [courses]);

  const archivedCoursesCount = useMemo(() => {
    return courses.filter((c) => String(c.status || "").toLowerCase() === "archived").length;
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      const statusLower = String(c.status || "").toLowerCase();
      const matchSearch =
        !q ||
        String(c.title || "").toLowerCase().includes(q) ||
        String(c.code || "").toLowerCase().includes(q) ||
        String(c.category || "").toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all"
          ? statusLower !== "archived"
          : statusLower === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [courses, search, statusFilter]);

  const totalEnrolled = useMemo(() => {
    return courses
      .filter((c) => String(c.status || "").toLowerCase() !== "archived")
      .reduce((acc, c) => acc + (Number(c.enrolledLearners) || 0), 0);
  }, [courses]);

  const averageRating = useMemo(() => {
    const rated = courses.filter(
      (c) => String(c.status || "").toLowerCase() !== "archived" && Number(c.rating) > 0
    );
    if (rated.length === 0) return "4.92";
    const avg = rated.reduce((sum, c) => sum + Number(c.rating || 0), 0) / rated.length;
    return avg.toFixed(2);
  }, [courses]);

  // Live reactive lookups so syllabus & metadata edits reflect immediately in open modals
  const viewingCourse = useMemo(
    () => courses.find((c) => c.id === viewingCourseId) || null,
    [courses, viewingCourseId]
  );

  const selectedSyllabusCourse = useMemo(
    () => courses.find((c) => c.id === selectedSyllabusCourseId) || null,
    [courses, selectedSyllabusCourseId]
  );

  const studioCourse = useMemo(
    () => courses.find((c) => c.id === studioCourseId) || null,
    [courses, studioCourseId]
  );

  const handleOpenCreate = () => {
    setFeedback(null);
    setStudioCourseId(null);
    setWorkspaceMode("create");
  };

  const handleOpenStudioForCourse = (course) => {
    setFeedback(null);
    setStudioCourseId(course.id);
    setWorkspaceMode("edit-studio");
  };

  const handleRequestDeleteOrArchive = (course) => {
    const impact = courseService.checkCourseEnrollmentImpact(course, { learners, batches });
    setDeleteTarget({ course, impact });
  };

  const handleConfirmDeleteOrArchive = async ({ forceArchive = false } = {}) => {
    if (!deleteTarget?.course) return;
    const targetCourse = deleteTarget.course;
    try {
      setIsSubmitting(true);
      const result = await onDeleteOrArchiveCourse(targetCourse.id, { forceArchive });
      setDeleteTarget(null);
      if (viewingCourseId === targetCourse.id && result?.action === "deleted") {
        setViewingCourseId(null);
      }
      if (selectedSyllabusCourseId === targetCourse.id && result?.action === "deleted") {
        setSelectedSyllabusCourseId(null);
      }
      if (result?.action === "archived") {
        showBanner(
          "success",
          `Archived "${targetCourse.title}" while preserving student enrollment records. Manage it anytime in the Archived tab.`
        );
      } else {
        showBanner("success", `Permanently deleted "${targetCourse.title}" from My Courses.`);
      }
    } catch (err) {
      showBanner("error", err?.message || "Failed to process course deletion/archiving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestoreCourseClick = async (course) => {
    if (!course) return;
    try {
      setIsSubmitting(true);
      await onRestoreCourse(course.id);
      setStatusFilter("all");
      showBanner("success", `Restored "${course.title}" back to active courses.`);
    } catch (err) {
      showBanner("error", err?.message || "Failed to restore course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCourseMetadata = async (updatedFields) => {
    if (!editingCourse) return;
    setIsSubmitting(true);
    try {
      await onUpdateCourse(editingCourse.id, updatedFields);
      const updatedTitle = updatedFields.title || editingCourse.title;
      setEditingCourse(null);
      showBanner("success", `Saved course updates for "${updatedTitle}".`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublishCourse = async (course) => {
    if (!course || typeof onUpdateCourse !== "function") return;
    const isPublished = String(course.status || "").toLowerCase() === "published";
    const nextStatus = isPublished ? "Draft" : "Published";
    setIsSubmitting(true);
    try {
      await onUpdateCourse(course.id, { status: nextStatus });
      showBanner(
        "success",
        isPublished
          ? `Moved "${course.title}" back to Draft.`
          : `Published "${course.title}" to the course catalog.`
      );
    } catch (err) {
      showBanner("error", err?.message || "Failed to update course publication status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Integrated Create Course & Course Studio view rendered INSIDE My Courses
  if (workspaceMode === "create" || (workspaceMode === "edit-studio" && studioCourse)) {
    return (
      <div className="inst-mc-container">
        <AICourseBuilder
          key={workspaceMode === "edit-studio" ? `edit-${studioCourse.id}` : "create"}
          instructorProfile={instructorProfile}
          embedded={true}
          initialMode={studioCourse?.generationMode || "ai"}
          editingCourse={workspaceMode === "edit-studio" ? studioCourse : null}
          learners={learners}
          batches={batches}
          onSaveCourse={async (savedCourse, meta) => {
            if (meta?.isUpdate && typeof onUpdateCourse === "function") {
              await onUpdateCourse(savedCourse.id, savedCourse);
            } else if (typeof onCreateCourse === "function") {
              await onCreateCourse(savedCourse);
            }
          }}
          onDeleteCourse={async (courseId, options) => {
            const res = await onDeleteOrArchiveCourse(courseId, options);
            setWorkspaceMode("list");
            setStudioCourseId(null);
            if (res?.action === "archived") {
              showBanner(
                "success",
                `Course archived with enrolled learner records preserved.`
              );
            } else {
              showBanner("success", `Course deleted successfully.`);
            }
            return res;
          }}
          onCloseBuilder={(statusMessage) => {
            setWorkspaceMode("list");
            setStudioCourseId(null);
            if (statusMessage) {
              setStatusFilter("all");
              showBanner("success", statusMessage);
            }
          }}
        />
      </div>
    );
  }

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
            Create courses manually or with AI, manage syllabi modules and topics, and organize
            your catalog.
          </p>
        </div>

        <ActionButton
          icon={Plus}
          variant="primary"
          size="lg"
          onClick={handleOpenCreate}
          tooltip="Create a new manual or AI-assisted course"
        >
          Create Course
        </ActionButton>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`inst-mc-feedback-banner ${feedback.type}`}
          role={feedback.type === "error" ? "alert" : "status"}
        >
          {feedback.type === "error" ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
          <span>{feedback.text}</span>
          <IconButton
            icon={X}
            size="xs"
            variant="ghost"
            className="inst-cb-banner-dismiss"
            onClick={() => setFeedback(null)}
            tooltip="Dismiss message"
            ariaLabel="Dismiss message"
          />
        </div>
      )}

      {/* Summary Metrics Row */}
      <div className="inst-mc-stats-grid">
        <div className="inst-mc-stat-card">
          <div className="inst-mc-stat-icon">
            <BookOpen size={20} />
          </div>
          <div className="inst-mc-stat-info">
            <strong>{activeCoursesCount}</strong>
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
            <strong>{averageRating} ★</strong>
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
            placeholder="Search courses by title, code, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <IconButton
              icon={X}
              size="xs"
              variant="ghost"
              onClick={() => setSearch("")}
              tooltip="Clear search"
              ariaLabel="Clear course search"
            />
          )}
        </div>

        <div className="inst-mc-filter-pills">
          <span className="inst-mc-filter-label" title="Filter courses by status">
            <SlidersHorizontal size={14} aria-hidden="true" />
            <span>Status</span>
          </span>
          {[
            { id: "all", label: `ALL ACTIVE (${activeCoursesCount})` },
            { id: "published", label: "PUBLISHED" },
            { id: "in review", label: "IN REVIEW" },
            { id: "draft", label: "DRAFT" },
            { id: "archived", label: `ARCHIVED (${archivedCoursesCount})` }
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              className={`inst-mc-pill-btn ${statusFilter === pill.id ? "active" : ""}`}
              onClick={() => setStatusFilter(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="inst-mc-grid">
        {filteredCourses.length === 0 ? (
          <div className="inst-mc-empty-state">
            <BookOpen size={36} className="text-muted" />
            <h3>
              {statusFilter === "archived" ? "No archived courses" : "No courses found"}
            </h3>
            <p>
              {statusFilter === "archived"
                ? "Courses with enrolled students appear here when archived."
                : "Try adjusting your filters or create a new course directly in My Courses."}
            </p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const tone = getStatusTone(course.status);
            const isArchived = String(course.status || "").toLowerCase() === "archived";
            const enrolledCount = Number(course.enrolledLearners || 0);

            return (
              <article
                key={course.id}
                className={`inst-mc-card ${isArchived ? "archived-card" : ""}`}
              >
                <div className="inst-mc-card-head">
                  <div className="inst-mc-code-cluster">
                    <span className="inst-mc-code-tag">{course.code}</span>
                    {course.generationMode === "ai" && (
                      <span className="inst-mc-ai-badge" title="Created with AI Course Builder">
                        <Sparkles size={10} /> AI
                      </span>
                    )}
                  </div>
                  <Badge tone={tone}>{course.status}</Badge>
                </div>

                <h3 className="inst-mc-course-title">{course.title}</h3>
                <span className="inst-mc-course-subtitle">
                  {course.category} · {course.level}
                </span>

                <div className="inst-mc-metrics-box">
                  <div className="inst-mc-metric">
                    <Users size={14} />
                    <span>{enrolledCount.toLocaleString("en-IN")} Students</span>
                  </div>
                  <div className="inst-mc-metric">
                    <CheckCircle2 size={14} />
                    <span>{course.completionRate || 0}% Done</span>
                  </div>
                  <div className="inst-mc-metric">
                    <Star size={14} className="star-icon" />
                    <span>
                      {course.rating || 4.9} ({course.reviewsCount || 0})
                    </span>
                  </div>
                  <div className="inst-mc-metric">
                    <Clock size={14} />
                    <span>
                      {course.modulesCount || 0} Modules ({course.totalHours || 40}h)
                    </span>
                  </div>
                </div>

                {/* Course Card Toolbar: View, Edit, Syllabus, Delete/Archive */}
                <div className="inst-mc-card-foot">
                  <div className="inst-mc-revenue">
                    <small>{course.revenue ? "Generated Revenue" : "Course Fee"}</small>
                    <strong>
                      ₹{Number(course.revenue || course.price || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="inst-mc-actions">
                    <IconButton
                      icon={Eye}
                      size="sm"
                      variant="view"
                      onClick={() => setViewingCourseId(course.id)}
                      tooltip="View Course Details"
                      ariaLabel={`View course ${course.title}`}
                    />

                    <IconButton
                      icon={Pencil}
                      size="sm"
                      variant="edit"
                      onClick={() => setEditingCourse(course)}
                      tooltip="Edit Course Details"
                      ariaLabel={`Edit course ${course.title}`}
                    />

                    <ActionButton
                      icon={BookOpen}
                      size="sm"
                      variant="outline-blue"
                      onClick={() => setSelectedSyllabusCourseId(course.id)}
                      tooltip="View & Manage Syllabus Modules and Topics"
                    >
                      Syllabus
                    </ActionButton>

                    {isArchived ? (
                      <ActionButton
                        icon={RotateCcw}
                        size="sm"
                        variant="restore-outline"
                        onClick={() => handleRestoreCourseClick(course)}
                        disabled={isSubmitting}
                        tooltip="Restore course to active list"
                      >
                        Restore
                      </ActionButton>
                    ) : (
                      <IconButton
                        icon={enrolledCount > 0 ? Archive : Trash2}
                        size="sm"
                        variant={enrolledCount > 0 ? "archive" : "delete"}
                        onClick={() => handleRequestDeleteOrArchive(course)}
                        disabled={isSubmitting}
                        tooltip={
                          enrolledCount > 0
                            ? "Archive course (enrolled learners exist)"
                            : "Delete course"
                        }
                        ariaLabel={`${enrolledCount > 0 ? "Archive" : "Delete"} course ${course.title}`}
                      />
                    )}

                    <MoreActionsMenu
                      size="sm"
                      tooltip="More Course Actions"
                      ariaLabel={`More actions for ${course.title}`}
                      items={[
                        !isArchived && {
                          id: "toggle-publish",
                          icon: String(course.status || "").toLowerCase() === "published" ? EyeOff : Send,
                          label:
                            String(course.status || "").toLowerCase() === "published"
                              ? "Unpublish (Move to Draft)"
                              : "Publish Course",
                          tone:
                            String(course.status || "").toLowerCase() === "published"
                              ? "default"
                              : "primary",
                          disabled: isSubmitting,
                          onClick: () => handleTogglePublishCourse(course)
                        },
                        {
                          id: "open-studio",
                          icon: Sparkles,
                          label: "Manage in Course Studio",
                          tone: "primary",
                          onClick: () => handleOpenStudioForCourse(course)
                        },
                        {
                          id: "view-learners",
                          icon: Users,
                          label: "View Enrolled Learners",
                          dividerBefore: true,
                          onClick: () => onNavigate && onNavigate("Learners")
                        }
                      ]}
                    />
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* View Course Details + Synchronized Syllabus Modal */}
      {viewingCourse && (
        <ViewCourseModal
          course={viewingCourse}
          onClose={() => setViewingCourseId(null)}
          onEditCourse={(c) => setEditingCourse(c)}
          onDeleteOrArchive={(c) => handleRequestDeleteOrArchive(c)}
          onRestoreCourse={(c) => handleRestoreCourseClick(c)}
          onTogglePublish={(c) => handleTogglePublishCourse(c)}
          onOpenStudio={(c) => handleOpenStudioForCourse(c)}
          onSyllabusChange={onSyncSyllabus}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Interactive Syllabus Preview & Full Module/Topic CRUD Modal */}
      {selectedSyllabusCourse && (
        <SyllabusModal
          course={selectedSyllabusCourse}
          onClose={() => setSelectedSyllabusCourseId(null)}
          onSyllabusChange={onSyncSyllabus}
          onOpenStudio={(c) => handleOpenStudioForCourse(c)}
        />
      )}

      {/* Edit Course Metadata Modal */}
      <EditCourseModal
        isOpen={Boolean(editingCourse)}
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        onSave={handleSaveCourseMetadata}
        isSubmitting={isSubmitting}
      />

      {/* Delete / Archive Course Safety Confirmation Dialog */}
      <DeleteCourseConfirmation
        isOpen={Boolean(deleteTarget?.course)}
        course={deleteTarget?.course}
        impact={deleteTarget?.impact}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDeleteOrArchive}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
