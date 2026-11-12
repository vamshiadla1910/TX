/**
 * SyllabusEditorContent Component
 * Reusable complete Syllabus CRUD panel providing Module-level (Add, Edit, Delete, Reorder)
 * and Topic-level (Add, Edit, Delete, Reorder) operations plus validation & confirmations.
 * Used identically inside SyllabusModal and ViewCourseModal (Course Details).
 */

import { useState } from "react";
import {
  Layers,
  FolderPlus,
  PlusCircle,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  X
} from "lucide-react";
import { ActionButton, IconButton } from "../../../common/ActionButton.jsx";
import { useSyllabus } from "../../hooks/useSyllabus.js";
import { SyllabusTopic } from "./SyllabusTopic.jsx";
import { EditTopicModal } from "./EditTopicModal.jsx";
import { AddTopicModal } from "./AddTopicModal.jsx";
import { DeleteConfirmation } from "./DeleteConfirmation.jsx";
import { ModuleFormModal } from "./ModuleFormModal.jsx";
import { DeleteModuleConfirmation } from "./DeleteModuleConfirmation.jsx";
import "../../styles/syllabus.css";

export function SyllabusEditorContent({ course, onSyllabusChange }) {
  const {
    modules,
    loading,
    isSubmitting,
    error,
    successNotice,
    clearNotice,
    // Module CRUD
    moduleFormState,
    openAddModule,
    openEditModule,
    closeModuleModal,
    saveModuleForm,
    deletingModule,
    openDeleteModule,
    closeDeleteModule,
    confirmDeleteModule,
    reorderModule,
    // Topic CRUD
    editingTopic,
    openEditTopic,
    closeEditTopic,
    saveEditTopic,
    addingToModule,
    openAddTopic,
    closeAddTopic,
    saveAddTopic,
    deletingTopic,
    openDeleteTopic,
    closeDeleteTopic,
    confirmDeleteTopic,
    reorderTopic
  } = useSyllabus(course, { onSyllabusChange });

  const [collapsedModuleIds, setCollapsedModuleIds] = useState({});

  const totalTopicsCount = modules.reduce(
    (sum, mod) => sum + (Array.isArray(mod.topics) ? mod.topics.length : 0),
    0
  );

  const getModuleKey = (mod, idx) => mod.id || `mod-idx-${idx}`;

  const allModulesCollapsed =
    modules.length > 0 &&
    modules.every((mod, idx) => Boolean(collapsedModuleIds[getModuleKey(mod, idx)]));

  const toggleModuleExpand = (modKey) => {
    setCollapsedModuleIds((prev) => ({
      ...prev,
      [modKey]: !prev[modKey]
    }));
  };

  const toggleExpandAll = () => {
    if (allModulesCollapsed) {
      setCollapsedModuleIds({});
      return;
    }
    const next = {};
    modules.forEach((mod, idx) => {
      next[getModuleKey(mod, idx)] = true;
    });
    setCollapsedModuleIds(next);
  };

  return (
    <>
      {successNotice && (
        <div className="inst-syllabus-alert success" role="status">
          <CheckCircle2 size={16} />
          <span>{successNotice}</span>
          <IconButton
            icon={X}
            size="xs"
            variant="ghost"
            className="inst-alert-dismiss"
            onClick={clearNotice}
            tooltip="Dismiss notice"
            ariaLabel="Dismiss notice"
          />
        </div>
      )}

      {error && (
        <div className="inst-syllabus-alert danger" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="inst-syllabus-modules-list">
        <div className="inst-syllabus-section-bar">
          <h3 className="inst-syllabus-section-lbl">
            <Layers size={16} /> Course Syllabus ({modules.length} Modules · {totalTopicsCount}{" "}
            Topics)
          </h3>

          <div className="inst-syllabus-section-actions">
            {modules.length > 1 && (
              <ActionButton
                icon={allModulesCollapsed ? ChevronDown : ChevronUp}
                variant="secondary"
                size="sm"
                onClick={toggleExpandAll}
                tooltip={allModulesCollapsed ? "Expand all modules" : "Collapse all modules"}
              >
                {allModulesCollapsed ? "Expand All" : "Collapse All"}
              </ActionButton>
            )}

            <ActionButton
              icon={FolderPlus}
              variant="primary"
              size="sm"
              onClick={openAddModule}
              disabled={isSubmitting}
              tooltip="Add a new module to syllabus"
            >
              Add Module
            </ActionButton>
          </div>
        </div>

        {loading ? (
          <div className="inst-syllabus-loading">
            <div className="inst-loading-spinner" />
            <p>Loading course syllabus...</p>
          </div>
        ) : modules.length === 0 ? (
          <div className="inst-syllabus-empty">
            <BookOpen size={36} className="text-muted" />
            <h4>No modules found</h4>
            <p>This course does not have any syllabus modules yet.</p>
            <ActionButton
              icon={FolderPlus}
              variant="primary"
              size="md"
              onClick={openAddModule}
            >
              Add First Module
            </ActionButton>
          </div>
        ) : (
          modules.map((mod, idx) => {
            const topicsList = Array.isArray(mod.topics) ? mod.topics : [];
            const isFirstMod = idx === 0;
            const isLastMod = idx === modules.length - 1;
            const modKey = getModuleKey(mod, idx);
            const isExpanded = !collapsedModuleIds[modKey];

            return (
              <div
                key={modKey}
                className={`inst-syllabus-module-card ${!isExpanded ? "is-collapsed" : ""}`}
              >
                <div className="inst-module-header">
                  <div className="inst-module-meta-wrap">
                    <span className="inst-module-badge">Module {mod.num || idx + 1}</span>
                    <strong className="inst-module-title">{mod.title}</strong>
                    <span className="inst-module-hours">
                      <Clock size={12} /> {mod.duration || "8 hours"}
                    </span>
                    <span className="inst-module-topic-pill">
                      {topicsList.length} {topicsList.length === 1 ? "Topic" : "Topics"}
                    </span>
                  </div>

                  <div className="inst-module-controls">
                    <ActionButton
                      icon={PlusCircle}
                      variant="outline-blue"
                      size="sm"
                      onClick={() => openAddTopic(mod)}
                      disabled={isSubmitting}
                      tooltip={`Add a new topic to Module ${mod.num || idx + 1}`}
                    >
                      Add Topic
                    </ActionButton>

                    <IconButton
                      icon={ArrowUp}
                      size="xs"
                      variant="neutral"
                      onClick={() => reorderModule(mod, "up")}
                      disabled={isFirstMod || isSubmitting}
                      tooltip="Move module up"
                      ariaLabel={`Move Module ${mod.num || idx + 1} up`}
                    />

                    <IconButton
                      icon={ArrowDown}
                      size="xs"
                      variant="neutral"
                      onClick={() => reorderModule(mod, "down")}
                      disabled={isLastMod || isSubmitting}
                      tooltip="Move module down"
                      ariaLabel={`Move Module ${mod.num || idx + 1} down`}
                    />

                    <IconButton
                      icon={Pencil}
                      size="sm"
                      variant="edit"
                      onClick={() => openEditModule(mod)}
                      disabled={isSubmitting}
                      tooltip={`Edit Module ${mod.num || idx + 1}`}
                      ariaLabel={`Edit Module ${mod.title}`}
                    />

                    <IconButton
                      icon={Trash2}
                      size="sm"
                      variant="delete"
                      onClick={() => openDeleteModule(mod)}
                      disabled={isSubmitting}
                      tooltip={`Delete Module ${mod.num || idx + 1}`}
                      ariaLabel={`Delete Module ${mod.title}`}
                    />

                    <IconButton
                      icon={isExpanded ? ChevronUp : ChevronDown}
                      size="sm"
                      variant="neutral"
                      onClick={() => toggleModuleExpand(modKey)}
                      aria-expanded={isExpanded}
                      tooltip={isExpanded ? "Collapse module" : "Expand module"}
                      ariaLabel={`${isExpanded ? "Collapse" : "Expand"} Module ${mod.title}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <>
                    {mod.description && (
                      <p className="inst-module-description">{mod.description}</p>
                    )}

                    {topicsList.length > 0 ? (
                      <div className="inst-module-topics-list">
                        {topicsList.map((top, topIdx) => (
                          <SyllabusTopic
                            key={top.id}
                            topic={top}
                            module={mod}
                            isFirst={topIdx === 0}
                            isLast={topIdx === topicsList.length - 1}
                            isSubmitting={isSubmitting}
                            onEdit={openEditTopic}
                            onDelete={openDeleteTopic}
                            onReorder={reorderTopic}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="inst-module-topics-empty">
                        <p>No topics in this module yet.</p>
                        <ActionButton
                          icon={PlusCircle}
                          variant="outline-blue"
                          size="sm"
                          onClick={() => openAddTopic(mod)}
                        >
                          Add First Topic
                        </ActionButton>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Module Modal */}
      {moduleFormState && (
        <ModuleFormModal
          isOpen={Boolean(moduleFormState)}
          mode={moduleFormState.mode}
          module={moduleFormState.module}
          modulesCount={modules.length}
          onClose={closeModuleModal}
          onSave={saveModuleForm}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Module Confirmation Dialog */}
      {deletingModule && (
        <DeleteModuleConfirmation
          isOpen={Boolean(deletingModule)}
          module={deletingModule}
          onClose={closeDeleteModule}
          onConfirm={confirmDeleteModule}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Edit Topic Modal Dialog */}
      {editingTopic && (
        <EditTopicModal
          isOpen={Boolean(editingTopic)}
          module={editingTopic.module}
          topic={editingTopic.topic}
          onClose={closeEditTopic}
          onSave={saveEditTopic}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Add Topic Modal Dialog */}
      {addingToModule && (
        <AddTopicModal
          isOpen={Boolean(addingToModule)}
          module={addingToModule}
          onClose={closeAddTopic}
          onAdd={saveAddTopic}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Topic Confirmation Dialog */}
      {deletingTopic && (
        <DeleteConfirmation
          isOpen={Boolean(deletingTopic)}
          module={deletingTopic.module}
          topic={deletingTopic.topic}
          onClose={closeDeleteTopic}
          onConfirm={confirmDeleteTopic}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

export default SyllabusEditorContent;
