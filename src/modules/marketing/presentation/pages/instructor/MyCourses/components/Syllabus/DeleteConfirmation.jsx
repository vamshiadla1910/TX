/**
 * DeleteConfirmation Component
 * Modal confirmation dialog preventing accidental topic deletion.
 * Clearly identifies the target topic and its containing module.
 */

import { AlertTriangle, Trash2, X } from "lucide-react";
import { ActionButton, IconButton } from "../../../common/ActionButton.jsx";

export function DeleteConfirmation({
  isOpen,
  module,
  topic,
  onClose,
  onConfirm,
  isSubmitting = false
}) {
  if (!isOpen || !topic || !module) return null;

  return (
    <div className="inst-topic-modal-backdrop" onClick={onClose}>
      <div
        className="inst-topic-modal-card inst-delete-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-topic-modal-title"
        aria-describedby="delete-topic-modal-desc"
      >
        {/* Warning Icon Banner */}
        <div className="inst-delete-icon-wrap">
          <AlertTriangle size={28} className="inst-delete-warning-icon" />
        </div>

        <IconButton
          icon={X}
          size="sm"
          variant="neutral"
          className="inst-topic-modal-close inst-delete-close"
          onClick={onClose}
          tooltip="Cancel"
          ariaLabel="Cancel deletion"
          disabled={isSubmitting}
        />

        <div className="inst-delete-content">
          <h3 id="delete-topic-modal-title" className="inst-delete-title">
            Delete Syllabus Topic?
          </h3>

          <p id="delete-topic-modal-desc" className="inst-delete-desc">
            You are about to delete the topic:
          </p>

          <div className="inst-delete-target-preview">
            <span className="inst-delete-target-badge">
              Module {module.num}: {module.title}
            </span>
            <strong className="inst-delete-target-title">
              "{topic.title}"
            </strong>
            {topic.duration && (
              <small className="inst-delete-target-meta">
                Estimated duration: {topic.duration}
              </small>
            )}
          </div>

          <p className="inst-delete-warning-sub">
            This action will remove this topic from the course curriculum and learning path. This cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="inst-delete-footer">
          <ActionButton
            icon={X}
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </ActionButton>

          <ActionButton
            icon={Trash2}
            variant="danger"
            size="md"
            onClick={onConfirm}
            loading={isSubmitting}
            loadingLabel="Deleting..."
          >
            Yes, Delete Topic
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
