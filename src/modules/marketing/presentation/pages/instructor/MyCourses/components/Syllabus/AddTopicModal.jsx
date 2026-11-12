/**
 * AddTopicModal Component
 * Dialog allowing instructors to create and append a new topic to a syllabus module.
 */

import { useState } from "react";
import { X, PlusCircle, Clock, Hash, AlertCircle } from "lucide-react";
import { ActionButton, IconButton } from "../../../common/ActionButton.jsx";
import { validateTopicInput } from "../../validation/topicValidation.js";

function AddTopicModalContent({
  module,
  onClose,
  onAdd,
  isSubmitting = false
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("45 mins");
  const [order, setOrder] = useState(() => (module.topics ? module.topics.length + 1 : 1));
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const maxOrder = module.topics ? module.topics.length : 0;
    const validation = validateTopicInput({
      title,
      description,
      duration,
      order,
      maxOrder: maxOrder + 1
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setErrors({});
      await onAdd({
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

  const nextOrder = module.topics ? module.topics.length + 1 : 1;

  return (
    <div className="inst-topic-modal-backdrop" onClick={onClose}>
      <div
        className="inst-topic-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-topic-modal-title"
      >
        {/* Modal Header */}
        <div className="inst-topic-modal-header">
          <div>
            <div className="inst-topic-modal-badge">
              Module {module.num}: {module.title}
            </div>
            <h3 id="add-topic-modal-title" className="inst-topic-modal-title">
              Add New Syllabus Topic
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
            <label htmlFor="add-topic-title" className="inst-form-label">
              Topic Title <span className="inst-required">*</span>
            </label>
            <input
              id="add-topic-title"
              type="text"
              className={`inst-form-input ${errors.title ? "is-invalid" : ""}`}
              placeholder="e.g. Distributed Tracing with Zipkin & Jaeger"
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
            <label htmlFor="add-topic-desc" className="inst-form-label">
              Description / Objectives <span className="inst-optional">(Optional)</span>
            </label>
            <textarea
              id="add-topic-desc"
              rows={3}
              className={`inst-form-textarea ${errors.description ? "is-invalid" : ""}`}
              placeholder="Brief summary of concepts, lab exercises, or deliverables..."
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
              <label htmlFor="add-topic-duration" className="inst-form-label">
                <Clock size={13} /> Estimated Duration
              </label>
              <input
                id="add-topic-duration"
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
              <label htmlFor="add-topic-order" className="inst-form-label">
                <Hash size={13} /> Position Order
              </label>
              <input
                id="add-topic-order"
                type="number"
                min={1}
                max={nextOrder}
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
              <small className="inst-form-hint">Position within module (1 to {nextOrder})</small>
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
              icon={PlusCircle}
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              loadingLabel="Adding Topic..."
            >
              Add Topic
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddTopicModal({
  isOpen,
  module,
  onClose,
  onAdd,
  isSubmitting = false
}) {
  if (!isOpen || !module) return null;
  return (
    <AddTopicModalContent
      key={`${module.id}-${module.topics ? module.topics.length : 0}`}
      module={module}
      onClose={onClose}
      onAdd={onAdd}
      isSubmitting={isSubmitting}
    />
  );
}

export default AddTopicModal;
