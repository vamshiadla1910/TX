/**
 * CurriculumSpecificationPanel Component
 * Interactive Curriculum Specification & Management column shared by Manual and AI Course Builders.
 * Exposes Edit Course, Add/Edit/Delete/Reorder Modules, Add/Edit/Delete/Reorder Topics,
 * Save Changes, Cancel draft reversion, Delete/Archive Course, and Publish to My Courses controls.
 */

import { useState } from "react";
import {
  Sparkles,
  Save,
  Check,
  RotateCcw,
  FolderPlus,
  Pencil,
  Trash2,
  Archive,
  Send,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ActionButton } from "../../common/ActionButton.jsx";
import { CurriculumModuleCard } from "./CurriculumModuleCard.jsx";

export function CurriculumSpecificationPanel({
  syllabus,
  isEditingExisting = false,
  existingCourseEnrolled = false,
  hasUnsavedChanges,
  isSubmitting,
  onOpenEditCourse,
  onOpenDeleteOrDiscardCourse,
  onAddModule,
  onEditModule,
  onDeleteModule,
  onReorderModule,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onReorderTopic,
  onSaveDraftChanges,
  onCancelDraftChanges,
  onPublishCourse
}) {
  const [collapsedModuleIds, setCollapsedModuleIds] = useState({});

  const modulesList = syllabus?.modules || [];
  const totalTopicsCount = modulesList.reduce((sum, m) => sum + (m.topics?.length || 0), 0);

  const getModuleKey = (mod, idx) => mod.id || `cb-mod-${idx}`;
  const allModulesCollapsed =
    modulesList.length > 0 &&
    modulesList.every((m, idx) => Boolean(collapsedModuleIds[getModuleKey(m, idx)]));

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
    modulesList.forEach((m, idx) => {
      next[getModuleKey(m, idx)] = true;
    });
    setCollapsedModuleIds(next);
  };

  return (
    <div className="card builder-preview-card">
      <div className="preview-header inst-cb-preview-header">
        <div>
          <span className="preview-tag">
            {isEditingExisting ? "COURSE & CURRICULUM STUDIO" : "CURRICULUM SPECIFICATION"}
          </span>
          <h3 className="section-heading">
            {syllabus ? syllabus.title : "Generated Syllabus Preview"}
          </h3>
          {syllabus && (
            <small className="inst-cb-course-meta-line">
              {syllabus.code} · {syllabus.category} · {syllabus.level} · ₹
              {Number(syllabus.price || 0).toLocaleString("en-IN")}
            </small>
          )}
        </div>

        {syllabus && (
          <div className="inst-cb-header-actions">
            {typeof onOpenEditCourse === "function" && (
              <ActionButton
                icon={Pencil}
                variant="outline-blue"
                size="sm"
                onClick={onOpenEditCourse}
                disabled={isSubmitting}
                tooltip="Edit course metadata"
              >
                Edit Course
              </ActionButton>
            )}

            {typeof onOpenDeleteOrDiscardCourse === "function" && (
              <ActionButton
                icon={isEditingExisting && existingCourseEnrolled ? Archive : Trash2}
                variant={isEditingExisting && existingCourseEnrolled ? "warning-outline" : "danger-outline"}
                size="sm"
                onClick={onOpenDeleteOrDiscardCourse}
                disabled={isSubmitting}
                tooltip={
                  isEditingExisting
                    ? existingCourseEnrolled
                      ? "Archive course"
                      : "Delete course"
                    : "Discard draft"
                }
              >
                {isEditingExisting
                  ? existingCourseEnrolled
                    ? "Archive Course"
                    : "Delete Course"
                  : "Discard Draft"}
              </ActionButton>
            )}

            {hasUnsavedChanges && (
              <ActionButton
                icon={RotateCcw}
                variant="secondary"
                size="sm"
                onClick={onCancelDraftChanges}
                disabled={isSubmitting}
                tooltip="Discard unsaved curriculum edits"
              >
                Cancel
              </ActionButton>
            )}

            {!isEditingExisting && (
              <ActionButton
                icon={Check}
                variant={hasUnsavedChanges ? "outline-blue" : "secondary"}
                size="sm"
                onClick={onSaveDraftChanges}
                disabled={isSubmitting}
                tooltip="Save curriculum modifications to local draft"
              >
                Save Draft
              </ActionButton>
            )}

            <ActionButton
              icon={isEditingExisting ? Save : Send}
              variant="primary"
              size="md"
              onClick={onPublishCourse}
              loading={isSubmitting}
              loadingLabel={isEditingExisting ? "Saving..." : "Creating..."}
            >
              {isEditingExisting ? "Save Changes" : "Create & Save"}
            </ActionButton>
          </div>
        )}
      </div>

      {!syllabus ? (
        <div className="preview-placeholder">
          <Sparkles size={36} className="text-purple" />
          <h4>Ready to Architect Your Next Course</h4>
          <p>
            Configure your course details on the left and generate a structured curriculum with AI
            or switch to Manual Setup to build modules and topics directly.
          </p>
        </div>
      ) : (
        <div className="modules-timeline">
          <div className="curriculum-summary-banner">
            <div>
              <strong>{syllabus.modules.length} Modules</strong> · {totalTopicsCount} Editable Topics
              · {syllabus.totalHours || syllabus.estimatedHours || 40} Hours
            </div>
            <div className="inst-cb-banner-right">
              {modulesList.length > 1 && (
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
                variant="outline-blue"
                size="sm"
                onClick={onAddModule}
                disabled={isSubmitting}
                tooltip="Add a new syllabus module"
              >
                Add Module
              </ActionButton>
              <span className={`badge ${hasUnsavedChanges ? "warning" : "success"}`}>
                {hasUnsavedChanges ? "Unsaved Edits" : "Synced"}
              </span>
            </div>
          </div>

          {syllabus.modules.length === 0 ? (
            <div className="inst-cb-empty-module inst-cb-no-modules-box">
              <span>No modules yet. Add your first module to structure this course.</span>
              <ActionButton
                icon={FolderPlus}
                variant="primary"
                size="sm"
                onClick={onAddModule}
              >
                Add First Module
              </ActionButton>
            </div>
          ) : (
            syllabus.modules.map((mod, idx) => {
              const modKey = getModuleKey(mod, idx);
              return (
                <CurriculumModuleCard
                  key={modKey}
                  module={mod}
                  isFirstModule={idx === 0}
                  isLastModule={idx === syllabus.modules.length - 1}
                  isExpanded={!collapsedModuleIds[modKey]}
                  onToggleExpand={() => toggleModuleExpand(modKey)}
                  isSubmitting={isSubmitting}
                  onEditModule={onEditModule}
                  onDeleteModule={onDeleteModule}
                  onReorderModule={onReorderModule}
                  onAddTopic={onAddTopic}
                  onEditTopic={onEditTopic}
                  onDeleteTopic={onDeleteTopic}
                  onReorderTopic={onReorderTopic}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default CurriculumSpecificationPanel;
