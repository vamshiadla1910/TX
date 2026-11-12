/**
 * ModuleFormModal Component
 * Shared dialog for creating or editing a syllabus module (title, duration, description, sequence order).
 * Used identically across My Courses Syllabus Editor, View Course Details, and AI Course Builder.
 */

import { useState } from "react";
import { X, Save, FolderPlus, Clock, Hash, AlertCircle, Layers } from "lucide-react";
import { ActionButton, IconButton } from "../../../common/ActionButton.jsx";
import { validateModuleInput } from "../../validation/topicValidation.js";

function ModuleFormModalContent({
  mode = "add",
  module = null,
  modulesCount = 0,
  onClose,
  onSave,
  isSubmitting = false
}) {
  const isEdit = mode === "edit";
  const [title, setTitle] = useState(() => (isEdit && module ? module.title || "" : ""));
  const [description, setDescription] = useState(() =>
    isEdit && module ? module.description || "" : ""
  );
  const [duration, setDuration] = useState(() =>
    isEdit && module ? module.duration || "8 hours" : "8 hours"
  );
  const [order, setOrder] = useState(() =>
    isEdit && module ? module.num || 1 : modulesCount + 1
  );
  const [errors, setErrors] = useState({});

  const maxPosition = isEdit ? Math.max(1, modulesCount) : modulesCount + 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateModuleInput({
      title,
      description,
      duration,
      order,
      maxOrder: modulesCount
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setErrors({});
      await onSave({
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim() || "8 hours",
        order: Number(order)
      });
    } catch (err) {
      if (err && typeof err === "object" && !err.message) {
        setErrors(err);
      } else {
        setErrors({ form: err?.message || "Unable to save module." });
      }
    }
  };

  return (
    <div className="inst-topic-modal-backdrop" onClick={onClose}>
      <div
        className="inst-topic-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-form-modal-title"
      >
        <div className="inst-topic-modal-header">
          <div>
            <div className="inst-topic-modal-badge">
              <Layers size={11} />{" "}
              {isEdit ? `Editing Module ${module?.num || ""}` : "New Syllabus Module"}
            </div>
            <h3 id="module-form-modal-title" className="inst-topic-modal-title">
              {isEdit ? "Edit Syllabus Module" : "Add New Syllabus Module"}
            </h3>
          </div>
          <IconButton
            icon={X}
            size="sm"
            variant="neutral"
            className="inst-topic-modal-close"
            onClick={onClose}
            tooltip="Close"
            ariaLabel="Close module dialog"
            disabled={isSubmitting}
          />
        </div>

        <form onSubmit={handleSubmit} className="inst-topic-modal-form" noValidate>
          {errors.form && (
            <div className="inst-syllabus-alert danger" role="alert">
              <AlertCircle size={15} />
              <span>{errors.form}</span>
            </div>
          )}

          <div className="inst-form-group">
            <label htmlFor="module-form-title" className="inst-form-label">
              Module Title <span className="inst-required">*</span>
            </label>
            <input
              id="module-form-title"
              type="text"
              className={`inst-form-input ${errors.title ? "is-invalid" : ""}`}
              placeholder="e.g. Distributed Event Streaming with Apache Kafka"
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

          <div className="inst-form-group">
            <label htmlFor="module-form-desc" className="inst-form-label">
              Module Summary / Goals <span className="inst-optional">(Optional)</span>
            </label>
            <textarea
              id="module-form-desc"
              rows={3}
              className={`inst-form-textarea ${errors.description ? "is-invalid" : ""}`}
              placeholder="Summarize key learning outcomes covered by this module..."
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

          <div className="inst-form-grid-2">
            <div className="inst-form-group">
              <label htmlFor="module-form-duration" className="inst-form-label">
                <Clock size={13} /> Estimated Duration
              </label>
              <input
                id="module-form-duration"
                type="text"
                className={`inst-form-input ${errors.duration ? "is-invalid" : ""}`}
                placeholder="e.g. 8 hours, 2 weeks"
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
              <label htmlFor="module-form-order" className="inst-form-label">
                <Hash size={13} /> Module Order
              </label>
              <input
                id="module-form-order"
                type="number"
                min={1}
                max={maxPosition}
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
              <small className="inst-form-hint">Sequence position 1 to {maxPosition}</small>
            </div>
          </div>

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
              icon={isEdit ? Save : FolderPlus}
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              loadingLabel={isEdit ? "Saving..." : "Adding Module..."}
            >
              {isEdit ? "Save Changes" : "Add Module"}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ModuleFormModal({
  isOpen,
  mode = "add",
  module = null,
  modulesCount = 0,
  onClose,
  onSave,
  isSubmitting = false
}) {
  if (!isOpen) return null;
  return (
    <ModuleFormModalContent
      key={`${mode}-${module?.id || "new"}-${modulesCount}`}
      mode={mode}
      module={module}
      modulesCount={modulesCount}
      onClose={onClose}
      onSave={onSave}
      isSubmitting={isSubmitting}
    />
  );
}

export default ModuleFormModal;
