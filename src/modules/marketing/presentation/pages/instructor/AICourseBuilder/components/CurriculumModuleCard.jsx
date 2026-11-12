/**
 * CurriculumModuleCard Component
 * Renders a syllabus module block with header metadata, Module Reorder (Up/Down),
 * Edit Module, Delete Module, "+ Add Topic" action, and ordered CurriculumTopicRow items.
 */

import {
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  PlusCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ActionButton, IconButton } from "../../common/ActionButton.jsx";
import { CurriculumTopicRow } from "./CurriculumTopicRow.jsx";

export function CurriculumModuleCard({
  module,
  isFirstModule = false,
  isLastModule = false,
  isExpanded = true,
  onToggleExpand,
  isSubmitting = false,
  onEditModule,
  onDeleteModule,
  onReorderModule,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onReorderTopic
}) {
  const topics = Array.isArray(module.topics) ? module.topics : [];

  return (
    <div className="module-item inst-cb-module-card">
      <div className="module-number">{String(module.num).padStart(2, "0")}</div>

      <div className="module-content">
        <div className="module-meta inst-cb-module-meta">
          <div className="inst-cb-module-heading">
            <strong>
              Module {module.num}: {module.title}
            </strong>
            <small>
              {module.duration} · {topics.length}{" "}
              {topics.length === 1 ? "topic" : "topics"}
            </small>
            {module.description && (
              <p className="inst-cb-module-desc">{module.description}</p>
            )}
          </div>

          <div className="inst-cb-module-controls">
            <ActionButton
              icon={PlusCircle}
              variant="outline-blue"
              size="sm"
              onClick={() => onAddTopic(module)}
              disabled={isSubmitting}
              tooltip={`Add a new topic to Module ${module.num}`}
              aria-label={`Add new topic to Module ${module.num}`}
            >
              Add Topic
            </ActionButton>

            {typeof onReorderModule === "function" && (
              <>
                <IconButton
                  icon={ArrowUp}
                  size="xs"
                  variant="neutral"
                  onClick={() => onReorderModule(module, "up")}
                  disabled={isFirstModule || isSubmitting}
                  tooltip="Move module up"
                  ariaLabel={`Move Module ${module.num} up`}
                />
                <IconButton
                  icon={ArrowDown}
                  size="xs"
                  variant="neutral"
                  onClick={() => onReorderModule(module, "down")}
                  disabled={isLastModule || isSubmitting}
                  tooltip="Move module down"
                  ariaLabel={`Move Module ${module.num} down`}
                />
              </>
            )}

            {typeof onEditModule === "function" && (
              <IconButton
                icon={Pencil}
                size="sm"
                variant="edit"
                onClick={() => onEditModule(module)}
                disabled={isSubmitting}
                tooltip={`Edit Module ${module.num}`}
                ariaLabel={`Edit Module ${module.title}`}
              />
            )}

            {typeof onDeleteModule === "function" && (
              <IconButton
                icon={Trash2}
                size="sm"
                variant="delete"
                onClick={() => onDeleteModule(module)}
                disabled={isSubmitting}
                tooltip={`Delete Module ${module.num}`}
                ariaLabel={`Delete Module ${module.title}`}
              />
            )}

            {typeof onToggleExpand === "function" && (
              <IconButton
                icon={isExpanded ? ChevronUp : ChevronDown}
                size="sm"
                variant="neutral"
                onClick={onToggleExpand}
                aria-expanded={isExpanded}
                tooltip={isExpanded ? "Collapse module" : "Expand module"}
                ariaLabel={`${isExpanded ? "Collapse" : "Expand"} Module ${module.title}`}
              />
            )}
          </div>
        </div>

        {isExpanded && (
          topics.length === 0 ? (
            <div className="inst-cb-empty-module">
              <span>No topics in this module yet.</span>
              <ActionButton
                icon={PlusCircle}
                variant="outline-blue"
                size="sm"
                onClick={() => onAddTopic(module)}
              >
                Add Topic
              </ActionButton>
            </div>
          ) : (
            <div className="inst-cb-topics-stack">
              {topics.map((topic, idx) => (
                <CurriculumTopicRow
                  key={topic.id}
                  topic={topic}
                  module={module}
                  isFirst={idx === 0}
                  isLast={idx === topics.length - 1}
                  onEdit={onEditTopic}
                  onDelete={onDeleteTopic}
                  onReorder={onReorderTopic}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default CurriculumModuleCard;
