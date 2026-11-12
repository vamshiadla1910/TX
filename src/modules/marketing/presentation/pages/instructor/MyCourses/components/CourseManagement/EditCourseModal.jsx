/**
 * EditCourseModal Component
 * Unified modal for editing course metadata (title, code, category, level, status, price, hours,
 * target audience, description) for both manually created and AI-generated courses.
 */

import { useState } from "react";
import { X, Save, AlertCircle, BookOpen } from "lucide-react";
import { ActionButton, IconButton } from "../../../common/ActionButton.jsx";
import {
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  COURSE_STATUSES,
  validateCourseInput
} from "../../validation/courseValidation.js";

function EditCourseModalContent({ course, onClose, onSave, isSubmitting = false }) {
  const [title, setTitle] = useState(() => course.title || "");
  const [code, setCode] = useState(() => course.code || "");
  const [category, setCategory] = useState(() => course.category || COURSE_CATEGORIES[0]);
  const [level, setLevel] = useState(() => course.level || COURSE_LEVELS[1]);
  const [status, setStatus] = useState(() => course.status || "Published");
  const [price, setPrice] = useState(() => course.price ?? 14999);
  const [totalHours, setTotalHours] = useState(
    () => course.totalHours || course.estimatedHours || 40
  );
  const [targetAudience, setTargetAudience] = useState(() => course.targetAudience || "");
  const [description, setDescription] = useState(() => course.description || "");
  const [errors, setErrors] = useState({});

  const statusChoices =
    course.status === "Archived"
      ? [...COURSE_STATUSES, "Archived"]
      : COURSE_STATUSES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      code: String(code || "").trim().toUpperCase(),
      category,
      level,
      status,
      price: Number(price),
      totalHours: Number(totalHours),
      targetAudience,
      description
    };

    const validation = validateCourseInput(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setErrors({});
      await onSave(payload);
    } catch (err) {
      if (err?.fieldErrors) {
        setErrors(err.fieldErrors);
      } else {
        setErrors({ form: err?.message || "Failed to update course details." });
      }
    }
  };

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="inst-topic-modal-backdrop" onClick={onClose}>
      <div
        className="inst-topic-modal-card inst-course-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-course-modal-title"
      >
        <div className="inst-topic-modal-header">
          <div>
            <div className="inst-topic-modal-badge">
              <BookOpen size={11} /> {course.code || "COURSE"} ·{" "}
              {course.generationMode === "ai" ? "AI-Generated Course" : "Manual Course"}
            </div>
            <h3 id="edit-course-modal-title" className="inst-topic-modal-title">
              Edit Course Details
            </h3>
          </div>
          <IconButton
            icon={X}
            size="sm"
            variant="neutral"
            className="inst-topic-modal-close"
            onClick={onClose}
            tooltip="Close"
            ariaLabel="Close edit course dialog"
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

          <div className="inst-form-grid-2">
            <div className="inst-form-group">
              <label htmlFor="edit-course-title" className="inst-form-label">
                Course Title <span className="inst-required">*</span>
              </label>
              <input
                id="edit-course-title"
                type="text"
                className={`inst-form-input ${errors.title ? "is-invalid" : ""}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearFieldError("title");
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
              <label htmlFor="edit-course-code" className="inst-form-label">
                Course Code <span className="inst-required">*</span>
              </label>
              <input
                id="edit-course-code"
                type="text"
                className={`inst-form-input ${errors.code ? "is-invalid" : ""}`}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  clearFieldError("code");
                }}
                disabled={isSubmitting}
              />
              {errors.code && (
                <span className="inst-form-error" role="alert">
                  <AlertCircle size={13} /> {errors.code}
                </span>
              )}
            </div>
          </div>

          <div className="inst-form-grid-2">
            <div className="inst-form-group">
              <label htmlFor="edit-course-category" className="inst-form-label">
                Category
              </label>
              <select
                id="edit-course-category"
                className="inst-form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
              >
                {!COURSE_CATEGORIES.includes(category) && (
                  <option value={category}>{category}</option>
                )}
                {COURSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="inst-form-group">
              <label htmlFor="edit-course-level" className="inst-form-label">
                Proficiency Level
              </label>
              <select
                id="edit-course-level"
                className="inst-form-input"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                disabled={isSubmitting}
              >
                {!COURSE_LEVELS.includes(level) && <option value={level}>{level}</option>}
                {COURSE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="inst-form-grid-3">
            <div className="inst-form-group">
              <label htmlFor="edit-course-status" className="inst-form-label">
                Status
              </label>
              <select
                id="edit-course-status"
                className="inst-form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSubmitting}
              >
                {statusChoices.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="inst-form-group">
              <label htmlFor="edit-course-price" className="inst-form-label">
                Enrollment Fee (INR ₹)
              </label>
              <input
                id="edit-course-price"
                type="number"
                min={0}
                className={`inst-form-input ${errors.price ? "is-invalid" : ""}`}
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  clearFieldError("price");
                }}
                disabled={isSubmitting}
              />
              {errors.price && (
                <span className="inst-form-error" role="alert">
                  <AlertCircle size={13} /> {errors.price}
                </span>
              )}
            </div>

            <div className="inst-form-group">
              <label htmlFor="edit-course-hours" className="inst-form-label">
                Estimated Hours
              </label>
              <input
                id="edit-course-hours"
                type="number"
                min={1}
                className={`inst-form-input ${errors.totalHours ? "is-invalid" : ""}`}
                value={totalHours}
                onChange={(e) => {
                  setTotalHours(e.target.value);
                  clearFieldError("totalHours");
                }}
                disabled={isSubmitting}
              />
              {errors.totalHours && (
                <span className="inst-form-error" role="alert">
                  <AlertCircle size={13} /> {errors.totalHours}
                </span>
              )}
            </div>
          </div>

          <div className="inst-form-group">
            <label htmlFor="edit-course-audience" className="inst-form-label">
              Target Audience
            </label>
            <input
              id="edit-course-audience"
              type="text"
              className="inst-form-input"
              placeholder="e.g. Backend engineers & full stack developers"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="inst-form-group">
            <label htmlFor="edit-course-description" className="inst-form-label">
              Course Description
            </label>
            <textarea
              id="edit-course-description"
              rows={3}
              className={`inst-form-textarea ${errors.description ? "is-invalid" : ""}`}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                clearFieldError("description");
              }}
              disabled={isSubmitting}
            />
            {errors.description && (
              <span className="inst-form-error" role="alert">
                <AlertCircle size={13} /> {errors.description}
              </span>
            )}
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

export function EditCourseModal({
  isOpen,
  course,
  onClose,
  onSave,
  isSubmitting = false
}) {
  if (!isOpen || !course) return null;
  return (
    <EditCourseModalContent
      key={`${course.id}-${course.updatedAt || ""}`}
      course={course}
      onClose={onClose}
      onSave={onSave}
      isSubmitting={isSubmitting}
    />
  );
}

export default EditCourseModal;
