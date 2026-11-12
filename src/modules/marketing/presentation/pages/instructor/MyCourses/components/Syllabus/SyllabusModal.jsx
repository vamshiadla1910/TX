/**
 * SyllabusModal Component
 * Comprehensive course syllabus inspection and management modal.
 * Wraps the shared SyllabusEditorContent with full Module & Topic CRUD operations.
 */

import { Check, Sparkles, X } from "lucide-react";
import { ActionButton, IconButton } from "../../../common/ActionButton.jsx";
import { SyllabusEditorContent } from "./SyllabusEditorContent.jsx";
import "../../styles/syllabus.css";

export function SyllabusModal({
  course,
  onClose,
  onSyllabusChange,
  onOpenStudio
}) {
  if (!course) return null;

  return (
    <div className="inst-syllabus-modal-backdrop" onClick={onClose}>
      <div
        className="inst-syllabus-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="syllabus-modal-title"
      >
        {/* Modal Header */}
        <div className="inst-syllabus-modal-header">
          <div>
            <div className="inst-mc-code-tag">{course.code}</div>
            <h2 id="syllabus-modal-title" className="inst-syllabus-title">
              {course.title}
            </h2>
            <p className="inst-syllabus-sub">
              {course.category} · {course.level} · {course.totalHours || 48} Hours Total
            </p>
          </div>
          <IconButton
            icon={X}
            size="sm"
            variant="neutral"
            className="inst-modal-close-btn"
            onClick={onClose}
            tooltip="Close"
            ariaLabel="Close syllabus modal"
          />
        </div>

        {/* Complete Module & Topic CRUD Content */}
        <SyllabusEditorContent
          key={course.id}
          course={course}
          onSyllabusChange={onSyllabusChange}
        />

        {/* Modal Footer */}
        <div className="inst-syllabus-modal-footer">
          {typeof onOpenStudio === "function" && (
            <ActionButton
              icon={Sparkles}
              variant="outline-blue"
              size="md"
              onClick={() => {
                onClose();
                onOpenStudio(course);
              }}
            >
              Edit in Course Studio
            </ActionButton>
          )}
          <ActionButton icon={Check} variant="primary" size="md" onClick={onClose}>
            Done
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

export default SyllabusModal;
