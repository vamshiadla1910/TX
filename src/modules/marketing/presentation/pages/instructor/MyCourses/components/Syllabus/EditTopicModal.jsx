/**
 * EditTopicModal Component
 * Dialog allowing instructors to modify topic title, description, duration, and sequence order.
 * Validates inputs, shows validation errors, and prevents duplicate submissions.
 */

import { useState } from "react";
import { X, Save, Clock, Hash, AlertCircle } from "lucide-react";
import { ActionButton, IconButton } from "../../../common/ActionButton.jsx";
import { validateTopicInput } from "../../validation/topicValidation.js";

function EditTopicModalContent({
  module,
  topic,
  onClose,
  onSave,
  isSubmitting = false
}) {
  const [title, setTitle] = useState(() => topic.title || "");
  const [description, setDescription] = useState(() => topic.description || "");
  const [duration, setDuration] = useState(() => topic.duration || "45 mins");
  const [order, setOrder] = useState(() => topic.order || 1);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateTopicInput({
      title,
      description,
      duration,
      order,
      maxOrder: module.topics ? module.topics.length : 99
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setErrors({});
      await onSave({
        title,
        description,
        duration,
        order: Number(order)
      });
    } catch (err) {
      if (err && typeof err === "object") {
        setErrors(err);
      }
    }
  };

  const maxOrderCount = module.topics ? module.topics.length : 1;

  return (
    <div className="inst-topic-modal-backdrop" onClick={onClose}>
      <div
        className="inst-topic-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-topic-modal-title"
      >
        {/* Modal Header */}
        <div className="inst-topic-modal-header">
          <div>
            <div className="inst-topic-modal-badge">
              Module {module.num}: {module.title}
            </div>
            <h3 id="edit-topic-modal-title" className="inst-topic-modal-title">
              Edit Syllabus Topic
            </h3>
          </div>
          <IconButton
            icon={X}
            size="sm"
            variant="neutral"
            className="inst-topic-modal-close"
            onClick={onClose}
            tooltip="Close"
            ariaLabel="Close dialog"
            disabled={isSubmitting}
          />
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="inst-topic-modal-form" noValidate>
          {/* Topic Title */}
          <div className="inst-form-group">
            <label htmlFor="edit-topic-title" className="inst-form-label">
              Topic Title <span className="inst-required">*</span>
            </label>
            <input
              id="edit-topic-title"
              type="text"
              className={`inst-form-input ${errors.title ? "is-invalid" : ""}`}
              placeholder="e.g. Microservices Fault Tolerance with Resilience4j"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.title && (
              <span className="inst-form-error" role="alert">
                <AlertCircle size={13} /> {errors.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="inst-form-group">
            <label htmlFor="edit-topic-desc" className="inst-form-label">
              Description / Learning Objectives <span className="inst-optional">(Optional)</span>
            </label>
            <textarea
              id="edit-topic-desc"
              rows={3}
              className={`inst-form-textarea ${errors.description ? "is-invalid" : ""}`}
              placeholder="Outline what learners will build or master in this topic..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              disabled={isSubmitting}
            />
            {errors.description && (
              <span className="inst-form-error" role="alert">
                <AlertCircle size={13} /> {errors.description}
              </span>
            )}
          </div>

          {/* Duration & Order 2-Column Row */}
          <div className="inst-form-grid-2">
            <div className="inst-form-group">
              <label htmlFor="edit-topic-duration" className="inst-form-label">
                <Clock size={13} /> Estimated Duration
              </label>
              <input
                id="edit-topic-duration"
                type="text"
                className={`inst-form-input ${errors.duration ? "is-invalid" : ""}`}
                placeholder="e.g. 45 mins, 2 hours"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  if (errors.duration) setErrors((prev) => ({ ...prev, duration: undefined }));
                }}
                disabled={isSubmitting}
              />
              {errors.duration && (
                <span className="inst-form-error" role="alert">
                  <AlertCircle size={13} /> {errors.duration}
                </span>
              )}
            </div>

            <div className="inst-form-group">
              <label htmlFor="edit-topic-order" className="inst-form-label">
                <Hash size={13} /> Topic Sequence Order
              </label>
              <input
                id="edit-topic-order"
                type="number"
                min={1}
                max={maxOrderCount}
                className={`inst-form-input ${errors.order ? "is-invalid" : ""}`}
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value);
                  if (errors.order) setErrors((prev) => ({ ...prev, order: undefined }));
                }}
                disabled={isSubmitting}
              />
              {errors.order && (
                <span className="inst-form-error" role="alert">
                  <AlertCircle size={13} /> {errors.order}
                </span>
              )}
              <small className="inst-form-hint">Order position 1 to {maxOrderCount}</small>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="inst-topic-modal-footer">
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
              icon={Save}
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              loadingLabel="Saving..."
            >
              Save Changes
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditTopicModal({
  isOpen,
  module,
  topic,
  onClose,
  onSave,
  isSubmitting = false
}) {
  if (!isOpen || !topic || !module) return null;
  return (
    <EditTopicModalContent
      key={`${module.id}-${topic.id}-${topic.order || 1}`}
      module={module}
      topic={topic}
      onClose={onClose}
      onSave={onSave}
      isSubmitting={isSubmitting}
    />
  );
}

export default EditTopicModal;
