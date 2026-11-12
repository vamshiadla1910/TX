/**
 * DeleteCourseConfirmation Component
 * Safety dialog for deleting or archiving a course.
 * Clearly shows target course details, enforces student enrollment retention rules
 * (archives courses with enrolled learners instead of destroying student records),
 * and allows permanent deletion only when 0 students are enrolled.
 */

import { AlertTriangle, Archive, Trash2, X, ShieldAlert } from "lucide-react";
import { ActionButton, IconButton } from "../../../common/ActionButton.jsx";

export function DeleteCourseConfirmation({
  isOpen,
  course,
  impact,
  onClose,
  onConfirm,
  isSubmitting = false
}) {
  if (!isOpen || !course) return null;

  const requiresArchive = Boolean(impact?.requiresArchive);
  const enrolledCount = Number(impact?.enrolledLearners || course.enrolledLearners || 0);
  const batchesCount = Number(impact?.linkedBatchesCount || 0);

  return (
    <div className="inst-topic-modal-backdrop" onClick={onClose}>
      <div
        className="inst-topic-modal-card inst-delete-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-course-modal-title"
        aria-describedby="delete-course-modal-desc"
      >
        <div className={`inst-delete-icon-wrap ${requiresArchive ? "archive-tone" : ""}`}>
          {requiresArchive ? (
            <ShieldAlert size={28} className="inst-archive-warning-icon" />
          ) : (
            <AlertTriangle size={28} className="inst-delete-warning-icon" />
          )}
        </div>

        <IconButton
          icon={X}
          size="sm"
          variant="neutral"
          className="inst-topic-modal-close inst-delete-close"
          onClick={onClose}
          tooltip="Cancel"
          ariaLabel="Cancel course deletion"
          disabled={isSubmitting}
        />

        <div className="inst-delete-content">
          <h3 id="delete-course-modal-title" className="inst-delete-title">
            {requiresArchive ? "Archive Active Course?" : "Delete Course Permanently?"}
          </h3>

          <p id="delete-course-modal-desc" className="inst-delete-desc">
            {requiresArchive
              ? "Enrollment records detected for:"
              : "You are about to permanently remove:"}
          </p>

          <div className="inst-delete-target-preview">
            <span className="inst-delete-target-badge">
              {course.code} · {course.status}
            </span>
            <strong className="inst-delete-target-title">{course.title}</strong>
            <small className="inst-delete-target-meta">
              {enrolledCount.toLocaleString("en-IN")} Enrolled Student
              {enrolledCount === 1 ? "" : "s"} · {course.modulesCount || 0} Modules
              {batchesCount > 0 ? ` · ${batchesCount} Cohort(s)` : ""}
            </small>
          </div>

          {requiresArchive ? (
            <div className="inst-archive-retention-box" role="note">
              <strong>Data-Retention Rule Applied</strong>
              <p>
                Because learners or active cohort history are linked to this course, permanent
                deletion is blocked to protect student progress, certificates, and payment records.
                Confirming will <strong>Archive / Deactivate</strong> the course (you can restore it
                from the Archived tab anytime).
              </p>
            </div>
          ) : (
            <p className="inst-delete-warning-sub">
              This course has 0 enrolled students. Deleting it will permanently remove the course
              and all its syllabus modules and topics. This cannot be undone.
            </p>
          )}
        </div>

        <div className="inst-delete-footer">
          

          {!requiresArchive && (
            <ActionButton
              icon={Archive}
              variant="warning-outline"
              size="md"
              onClick={() => onConfirm({ forceArchive: true })}
              disabled={isSubmitting}
            >
              Archive Instead
            </ActionButton>
          )}

          <ActionButton
            icon={requiresArchive ? Archive : Trash2}
            variant={requiresArchive ? "warning" : "danger"}
            size="md"
            onClick={() => onConfirm({ forceArchive: requiresArchive })}
            loading={isSubmitting}
            loadingLabel={requiresArchive ? "Archiving..." : "Deleting..."}
          >
            {requiresArchive ? "Archive Course" : "Delete Course"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

export default DeleteCourseConfirmation;
