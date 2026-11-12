/**
 * DeleteModuleConfirmation Component
 * Confirmation dialog preventing accidental syllabus module deletion.
 * Explicitly details the impact if the module contains topics.
 */

import { AlertTriangle, Trash2, X } from "lucide-react";
import { ActionButton, IconButton } from "../../../common/ActionButton.jsx";

export function DeleteModuleConfirmation({
  isOpen,
  module,
  onClose,
  onConfirm,
  isSubmitting = false
}) {
  if (!isOpen || !module) return null;

  const topics = Array.isArray(module.topics) ? module.topics : [];
  const topicCount = topics.length;
  const previewTopics = topics.slice(0, 4);

  return (
    <div className="inst-topic-modal-backdrop" onClick={onClose}>
      <div
        className="inst-topic-modal-card inst-delete-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-module-modal-title"
        aria-describedby="delete-module-modal-desc"
      >
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
          ariaLabel="Cancel module deletion"
          disabled={isSubmitting}
        />

        <div className="inst-delete-content">
          <h3 id="delete-module-modal-title" className="inst-delete-title">
            Delete Syllabus Module?
          </h3>

          <p id="delete-module-modal-desc" className="inst-delete-desc">
            You are about to remove the entire module:
          </p>

          <div className="inst-delete-target-preview">
            <span className="inst-delete-target-badge">Module {module.num}</span>
            <strong className="inst-delete-target-title">{module.title}</strong>
            <small className="inst-delete-target-meta">
              Duration: {module.duration || "8 hours"} · {topicCount}{" "}
              {topicCount === 1 ? "topic" : "topics"}
            </small>
          </div>

          {topicCount > 0 ? (
            <div className="inst-delete-impact-box" role="note">
              <strong>
                Deletion Impact: This module contains {topicCount}{" "}
                {topicCount === 1 ? "topic" : "topics"}.
              </strong>
              <p>
                Deleting this module will permanently remove all {topicCount}{" "}
                {topicCount === 1 ? "topic" : "topics"} inside it and renumber subsequent modules:
              </p>
              <ul className="inst-delete-impact-list">
                {previewTopics.map((t) => (
                  <li key={t.id}>{t.title}</li>
                ))}
                {topicCount > previewTopics.length && (
                  <li>+ {topicCount - previewTopics.length} more topic(s)</li>
                )}
              </ul>
            </div>
          ) : (
            <p className="inst-delete-warning-sub">
              This module currently contains 0 topics. Deleting it will renumber remaining modules automatically.
            </p>
          )}
        </div>

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
            {topicCount > 0
              ? `Delete Module & ${topicCount} Topic${topicCount > 1 ? "s" : ""}`
              : "Yes, Delete Module"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

export default DeleteModuleConfirmation;
