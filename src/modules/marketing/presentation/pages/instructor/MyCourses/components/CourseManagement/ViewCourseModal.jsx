/**
 * ViewCourseModal Component
 * Comprehensive Course Details panel showing metadata, enrollment/revenue metrics,
 * live interactive Syllabus Editor (Modules & Topics CRUD reflecting changes immediately),
 * and quick Edit / Studio / Delete-Archive / Restore actions.
 */

import {
  X,
  Pencil,
  Trash2,
  Archive,
  RotateCcw,
  Users,
  Clock,
  Star,
  IndianRupee,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Layers,
  Send,
  EyeOff
} from "lucide-react";
import { Badge, getStatusTone } from "../../../common/Badge.jsx";
import { ActionButton, IconButton } from "../../../common/ActionButton.jsx";
import { SyllabusEditorContent } from "../Syllabus/SyllabusEditorContent.jsx";

export function ViewCourseModal({
  course,
  onClose,
  onEditCourse,
  onDeleteOrArchive,
  onRestoreCourse,
  onTogglePublish,
  onOpenStudio,
  onSyllabusChange,
  isSubmitting = false
}) {
  if (!course) return null;

  const isArchived = String(course.status || "").toLowerCase() === "archived";
  const isPublished = String(course.status || "").toLowerCase() === "published";
  const hasEnrolled = Number(course.enrolledLearners || 0) > 0;
  const tone = getStatusTone(course.status);

  return (
    <div className="inst-syllabus-modal-backdrop" onClick={onClose}>
      <div
        className="inst-syllabus-modal inst-view-course-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-course-modal-title"
      >
        {/* Header */}
        <div className="inst-syllabus-modal-header">
          <div className="inst-vc-title-block">
            <div className="inst-vc-badges-row">
              <span className="inst-mc-code-tag">{course.code}</span>
              <Badge tone={tone}>{course.status}</Badge>
              {course.generationMode === "ai" && (
                <span className="inst-vc-mode-chip ai">
                  <Sparkles size={11} /> AI Generated
                </span>
              )}
              {course.generationMode === "manual" && (
                <span className="inst-vc-mode-chip manual">
                  <BookOpen size={11} /> Manual Course
                </span>
              )}
            </div>

            <h2 id="view-course-modal-title" className="inst-syllabus-title">
              {course.title}
            </h2>
            <p className="inst-syllabus-sub">
              {course.category} · {course.level} · Updated {course.lastUpdated || "Recently"}
            </p>
          </div>

          <IconButton
            icon={X}
            size="sm"
            variant="neutral"
            className="inst-modal-close-btn"
            onClick={onClose}
            tooltip="Close"
            ariaLabel="Close course details"
          />
        </div>

        {/* Summary Metrics & Description */}
        <div className="inst-vc-overview-band">
          <div className="inst-vc-metrics-strip">
            <div className="inst-vc-mini-stat">
              <Users size={15} />
              <div>
                <strong>{Number(course.enrolledLearners || 0).toLocaleString("en-IN")}</strong>
                <small>Students</small>
              </div>
            </div>

            <div className="inst-vc-mini-stat">
              <Layers size={15} />
              <div>
                <strong>{course.modulesCount || 0} Modules</strong>
                <small>{course.topicsCount || 0} Topics</small>
              </div>
            </div>

            <div className="inst-vc-mini-stat">
              <Clock size={15} />
              <div>
                <strong>{course.totalHours || 40} Hrs</strong>
                <small>Estimated Time</small>
              </div>
            </div>

            <div className="inst-vc-mini-stat">
              <IndianRupee size={15} />
              <div>
                <strong>₹{Number(course.price || 0).toLocaleString("en-IN")}</strong>
                <small>Course Fee</small>
              </div>
            </div>

            <div className="inst-vc-mini-stat">
              <Star size={15} className="star-icon" />
              <div>
                <strong>{course.rating || 4.9} ★</strong>
                <small>{course.completionRate || 0}% Completion</small>
              </div>
            </div>
          </div>

          {course.description && (
            <p className="inst-vc-description">{course.description}</p>
          )}
          {course.targetAudience && (
            <div className="inst-vc-audience">
              <CheckCircle2 size={13} />
              <span>
                <strong>Target Audience:</strong> {course.targetAudience}
              </span>
            </div>
          )}
        </div>

        {/* Live Synchronized Syllabus Manager (Modules & Topics CRUD) */}
        <SyllabusEditorContent
          key={course.id}
          course={course}
          onSyllabusChange={onSyllabusChange}
        />

        {/* Footer Course Actions */}
        <div className="inst-syllabus-modal-footer inst-vc-footer">
          <div className="inst-vc-left-actions">
            {isArchived ? (
              <ActionButton
                icon={RotateCcw}
                variant="restore-outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => onRestoreCourse && onRestoreCourse(course)}
              >
                Restore Course
              </ActionButton>
            ) : (
              <ActionButton
                icon={hasEnrolled ? Archive : Trash2}
                variant={hasEnrolled ? "warning-outline" : "danger-outline"}
                size="sm"
                disabled={isSubmitting}
                onClick={() => onDeleteOrArchive && onDeleteOrArchive(course)}
              >
                {hasEnrolled ? "Archive Course" : "Delete Course"}
              </ActionButton>
            )}
          </div>

          <div className="inst-vc-right-actions">
            {!isArchived && typeof onTogglePublish === "function" && (
              <ActionButton
                icon={isPublished ? EyeOff : Send}
                variant={isPublished ? "secondary" : "success"}
                size="sm"
                disabled={isSubmitting}
                onClick={() => onTogglePublish(course)}
                tooltip={isPublished ? "Move course back to Draft" : "Publish course to catalog"}
              >
                {isPublished ? "Unpublish" : "Publish"}
              </ActionButton>
            )}

            <ActionButton
              icon={Pencil}
              variant="outline-blue"
              size="sm"
              onClick={() => onEditCourse && onEditCourse(course)}
            >
              Edit Metadata
            </ActionButton>

            {typeof onOpenStudio === "function" && (
              <ActionButton
                icon={Sparkles}
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenStudio(course);
                }}
              >
                Open Studio
              </ActionButton>
            )}

            <ActionButton icon={X} variant="secondary" size="sm" onClick={onClose}>
              Close
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCourseModal;
