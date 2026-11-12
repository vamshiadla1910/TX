/**
 * CurriculumTopicRow Component
 * Displays an individual AI-generated syllabus topic with sequence badge, duration,
 * optional description, reorder controls (Move Up/Down), and Edit / Delete buttons.
 */

import { ArrowUp, ArrowDown, Pencil, Trash2, Clock } from "lucide-react";
import { IconButton } from "../../common/ActionButton.jsx";

export function CurriculumTopicRow({
  topic,
  module,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onReorder
}) {
  return (
    <div className="inst-cb-topic-row" tabIndex={0}>
      <div className="inst-cb-topic-body">
        <div className="inst-cb-topic-head">
          <span className="inst-cb-topic-order">#{topic.order}</span>
          <span className="inst-cb-topic-title">{topic.title}</span>
          {topic.duration && (
            <span className="inst-cb-topic-duration">
              <Clock size={11} />
              <span>{topic.duration}</span>
            </span>
          )}
        </div>
        {topic.description && (
          <p className="inst-cb-topic-desc">{topic.description}</p>
        )}
      </div>

      <div className="inst-cb-topic-actions">
        <IconButton
          icon={ArrowUp}
          size="xs"
          variant="neutral"
          onClick={() => onReorder(module.id, topic.id, "up")}
          disabled={isFirst}
          tooltip="Move topic up"
          ariaLabel={`Move ${topic.title} up`}
        />
        <IconButton
          icon={ArrowDown}
          size="xs"
          variant="neutral"
          onClick={() => onReorder(module.id, topic.id, "down")}
          disabled={isLast}
          tooltip="Move topic down"
          ariaLabel={`Move ${topic.title} down`}
        />

        <IconButton
          icon={Pencil}
          size="sm"
          variant="edit"
          onClick={() => onEdit(module, topic)}
          tooltip="Edit topic"
          ariaLabel={`Edit topic ${topic.title}`}
        />

        <IconButton
          icon={Trash2}
          size="sm"
          variant="delete"
          onClick={() => onDelete(module, topic)}
          tooltip="Delete topic"
          ariaLabel={`Delete topic ${topic.title}`}
        />
      </div>
    </div>
  );
}

export default CurriculumTopicRow;
