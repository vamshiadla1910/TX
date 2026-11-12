/**
 * SyllabusTopic Component
 * Renders an individual syllabus topic with metadata, duration badge,
 * and hover/touch-accessible Reorder (Up/Down), Edit, and Delete action buttons.
 */

import { ArrowUp, ArrowDown, Pencil, Trash2, Clock } from "lucide-react";
import { IconButton } from "../../../common/ActionButton.jsx";

export function SyllabusTopic({
  topic,
  module,
  isFirst = false,
  isLast = false,
  isSubmitting = false,
  onEdit,
  onDelete,
  onReorder
}) {
  const { title, description, duration, order } = topic;

  return (
    <div className="inst-syllabus-topic-item" tabIndex={0}>
      <div className="inst-topic-main">
        <div className="inst-topic-header-row">
          <span className="inst-topic-order-badge" title={`Topic ${order}`}>
            #{order}
          </span>
          <h4 className="inst-topic-title">{title}</h4>
          {duration && (
            <span className="inst-topic-duration" title={`Duration: ${duration}`}>
              <Clock size={12} className="inst-topic-clock-icon" />
              <span>{duration}</span>
            </span>
          )}
        </div>

        {description && (
          <p className="inst-topic-desc">{description}</p>
        )}
      </div>

      {/* Action Buttons: Reorder, Edit, and Delete */}
      <div className="inst-topic-actions" onClick={(e) => e.stopPropagation()}>
        {typeof onReorder === "function" && (
          <>
            <IconButton
              icon={ArrowUp}
              size="xs"
              variant="neutral"
              onClick={() => onReorder(module, topic, "up")}
              disabled={isFirst || isSubmitting}
              tooltip="Move topic up"
              ariaLabel={`Move topic up: ${title}`}
            />
            <IconButton
              icon={ArrowDown}
              size="xs"
              variant="neutral"
              onClick={() => onReorder(module, topic, "down")}
              disabled={isLast || isSubmitting}
              tooltip="Move topic down"
              ariaLabel={`Move topic down: ${title}`}
            />
          </>
        )}

        <IconButton
          icon={Pencil}
          size="sm"
          variant="edit"
          onClick={() => onEdit(module, topic)}
          disabled={isSubmitting}
          tooltip="Edit Topic"
          ariaLabel={`Edit topic: ${title}`}
        />

        <IconButton
          icon={Trash2}
          size="sm"
          variant="delete"
          onClick={() => onDelete(module, topic)}
          disabled={isSubmitting}
          tooltip="Delete Topic"
          ariaLabel={`Delete topic: ${title}`}
        />
      </div>
    </div>
  );
}

export default SyllabusTopic;
