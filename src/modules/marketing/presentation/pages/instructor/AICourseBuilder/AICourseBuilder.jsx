/**
 * Integrated Course & AI Curriculum Studio (AICourseBuilder)
 * Supports BOTH AI-powered syllabus generation AND manual course creation, plus
 * full Course, Module, and Topic management (Edit, Add, Delete, Reorder) embedded
 * directly inside My Courses (without requiring a separate sidebar page).
 */

import {
  Sparkles,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  X,
  ArrowLeft,
  BookOpen,
  FolderPlus
} from "lucide-react";
import { ActionButton, IconButton } from "../common/ActionButton.jsx";
import { useCurriculumBuilder } from "./hooks/useCurriculumBuilder.js";
import { CurriculumSpecificationPanel } from "./components/CurriculumSpecificationPanel.jsx";
import {
  EditTopicModal,
  AddTopicModal,
  DeleteConfirmation,
  ModuleFormModal,
  DeleteModuleConfirmation
} from "../MyCourses/components/Syllabus/index.js";
import {
  EditCourseModal,
  DeleteCourseConfirmation
} from "../MyCourses/components/CourseManagement/index.js";
import {
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  COURSE_STATUSES
} from "../MyCourses/validation/courseValidation.js";
import "../MyCourses/styles/syllabus.css";
import "./AICourseBuilder.css";

export function AICourseBuilder({
  instructorProfile,
  embedded = true,
  initialMode = "ai",
  editingCourse = null,
  learners = [],
  batches = [],
  onSaveCourse,
  onDeleteCourse,
  onCloseBuilder,
  onNavigate
}) {
  const {
    isEditingExisting,
    builderMode,
    switchBuilderMode,
    topic,
    setTopic,
    code,
    setCode,
    level,
    setLevel,
    category,
    setCategory,
    targetAudience,
    setTargetAudience,
    status,
    setStatus,
    price,
    setPrice,
    totalHours,
    setTotalHours,
    description,
    setDescription,
    isGenerating,
    isSubmitting,
    handleGenerate,
    handleInitializeManual,
    generatedSyllabus,
    hasUnsavedChanges,
    successNotice,
    errorNotice,
    clearFeedback,
    // Course dialogs
    isEditCourseOpen,
    openEditCourseModal,
    closeEditCourseModal,
    saveCourseMetadata,
    deleteCourseModalState,
    existingCourseImpact,
    openDeleteOrDiscardCourse,
    closeDeleteCourseModal,
    confirmDeleteOrDiscardCourse,
    // Module dialogs & actions
    moduleFormState,
    openAddModule,
    openEditModule,
    closeModuleModal,
    saveModuleForm,
    deletingModule,
    openDeleteModule,
    closeDeleteModule,
    confirmDeleteModule,
    handleReorderModule,
    // Topic dialogs & actions
    handleReorderTopic,
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
    // Draft / Publish
    handleSaveDraftChanges,
    handleCancelDraftChanges,
    handlePublishCourse
  } = useCurriculumBuilder({
    instructorProfile,
    initialMode,
    editingCourse,
    learners,
    batches,
    onSaveCourse,
    onDeleteCourse,
    onCloseBuilder,
    onNavigate
  });

  const activeCourseObj = generatedSyllabus || {
    id: editingCourse?.id || "draft-course",
    code,
    title: topic,
    category,
    level,
    status,
    price,
    totalHours,
    targetAudience,
    description,
    generationMode: builderMode,
    modulesCount: generatedSyllabus?.modules?.length || 0,
    enrolledLearners: editingCourse?.enrolledLearners || 0
  };

  return (
    <div className="ai-builder-container">
      {/* Header */}
      <div className="ai-builder-header">
        <div className="breadcrumb-nav">
          <span>TX Pathwing</span>
          <span className="separator">/</span>
          <span>Instructor</span>
          <span className="separator">/</span>
          <span>My Courses</span>
          <span className="separator">/</span>
          <strong className="current">
            {isEditingExisting ? "Edit Course & Curriculum" : "Create Course"}
          </strong>
        </div>

        <div className="title-row">
          <div className="inst-cb-title-group">
            {embedded && typeof onCloseBuilder === "function" && (
              <ActionButton
                icon={ArrowLeft}
                variant="secondary"
                size="sm"
                onClick={() => onCloseBuilder()}
                tooltip="Return to My Courses"
              >
                Back to My Courses
              </ActionButton>
            )}
            <div>
              <h1 className="module-title">
                {isEditingExisting
                  ? `Manage Course: ${editingCourse.title}`
                  : "Create Course & Curriculum"}
              </h1>
              <p className="module-sub">
                Author course details manually or generate a syllabus outline with AI, then refine
                modules and topics freely.
              </p>
            </div>
          </div>

          {!isEditingExisting && (
            <div className="inst-cb-mode-switcher" role="tablist" aria-label="Course creation mode">
              <button
                type="button"
                role="tab"
                aria-selected={builderMode === "ai"}
                className={`inst-cb-mode-tab ${builderMode === "ai" ? "active" : ""}`}
                onClick={() => switchBuilderMode("ai")}
              >
                <Sparkles size={14} />
                <span>Create with AI</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={builderMode === "manual"}
                className={`inst-cb-mode-tab ${builderMode === "manual" ? "active" : ""}`}
                onClick={() => switchBuilderMode("manual")}
              >
                <BookOpen size={14} />
                <span>Manual Setup</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {successNotice && (
        <div className="builder-success-banner" role="status">
          <CheckCircle2 size={18} />
          <span>{successNotice}</span>
          <IconButton
            icon={X}
            size="xs"
            variant="ghost"
            className="inst-cb-banner-dismiss"
            onClick={clearFeedback}
            tooltip="Dismiss notification"
            ariaLabel="Dismiss notification"
          />
        </div>
      )}

      {errorNotice && (
        <div className="builder-error-banner" role="alert">
          <AlertCircle size={18} />
          <span>{errorNotice}</span>
          <IconButton
            icon={X}
            size="xs"
            variant="ghost"
            className="inst-cb-banner-dismiss"
            onClick={clearFeedback}
            tooltip="Dismiss error"
            ariaLabel="Dismiss error"
          />
        </div>
      )}

      {/* Two Column Layout: Course Specifications on Left, Interactive Curriculum on Right */}
      <div className="builder-dual-layout">
        <div className="card builder-input-card">
          <h3 className="section-heading">Course Details & Specifications</h3>

          <div className="form-group">
            <label htmlFor="ai-course-topic">Course Title / Topic *</label>
            <input
              id="ai-course-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Full Stack Microservices with Spring Boot & Docker"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ai-course-code">Course Code *</label>
              <input
                id="ai-course-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MICRO-ARCH"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ai-course-status">Publishing Status</label>
              <select
                id="ai-course-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {COURSE_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
                {isEditingExisting && status === "Archived" && (
                  <option value="Archived">Archived</option>
                )}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ai-course-category">Domain Category</label>
              <select
                id="ai-course-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

            <div className="form-group">
              <label htmlFor="ai-course-level">Target Proficiency</label>
              <select
                id="ai-course-level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ai-course-price">Course Fee (INR ₹)</label>
              <input
                id="ai-course-price"
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ai-course-hours">Estimated Hours</label>
              <input
                id="ai-course-hours"
                type="number"
                min={1}
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="ai-course-audience">Target Audience</label>
            <input
              id="ai-course-audience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Senior engineers preparing for cloud architecture certification"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ai-course-description">Course Description</label>
            <textarea
              id="ai-course-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Concise overview of prerequisites, projects, and outcomes..."
            />
          </div>

          {builderMode === "ai" ? (
            <button
              type="button"
              className="btn-generate-ai"
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="spinner" />
                  <span>Generating Curriculum with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>
                    {generatedSyllabus
                      ? "Regenerate Curriculum with AI"
                      : "Generate Curriculum Outline"}
                  </span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              className="btn-generate-ai"
              onClick={generatedSyllabus ? openAddModule : handleInitializeManual}
              disabled={!topic.trim()}
            >
              <FolderPlus size={16} />
              <span>
                {generatedSyllabus ? "Add Module to Manual Course" : "Initialize Course Structure"}
              </span>
            </button>
          )}
        </div>

        {/* Right Column: Editable Curriculum Specification (Modules + Topics) */}
        <CurriculumSpecificationPanel
          syllabus={generatedSyllabus}
          isEditingExisting={isEditingExisting}
          existingCourseEnrolled={Boolean(existingCourseImpact?.requiresArchive)}
          hasUnsavedChanges={hasUnsavedChanges}
          isSubmitting={isSubmitting}
          onOpenEditCourse={openEditCourseModal}
          onOpenDeleteOrDiscardCourse={openDeleteOrDiscardCourse}
          onAddModule={openAddModule}
          onEditModule={openEditModule}
          onDeleteModule={openDeleteModule}
          onReorderModule={handleReorderModule}
          onAddTopic={openAddTopic}
          onEditTopic={openEditTopic}
          onDeleteTopic={openDeleteTopic}
          onReorderTopic={handleReorderTopic}
          onSaveDraftChanges={handleSaveDraftChanges}
          onCancelDraftChanges={handleCancelDraftChanges}
          onPublishCourse={handlePublishCourse}
        />
      </div>

      {/* Edit Course Metadata Modal */}
      <EditCourseModal
        isOpen={isEditCourseOpen}
        course={activeCourseObj}
        onClose={closeEditCourseModal}
        onSave={saveCourseMetadata}
        isSubmitting={isSubmitting}
      />

      {/* Delete / Archive Course or Discard Draft Confirmation */}
      <DeleteCourseConfirmation
        isOpen={Boolean(deleteCourseModalState?.isOpen)}
        course={activeCourseObj}
        impact={deleteCourseModalState?.impact}
        onClose={closeDeleteCourseModal}
        onConfirm={confirmDeleteOrDiscardCourse}
        isSubmitting={isSubmitting}
      />

      {/* Add / Edit Module Modal */}
      <ModuleFormModal
        isOpen={Boolean(moduleFormState)}
        mode={moduleFormState?.mode || "add"}
        module={moduleFormState?.module || null}
        modulesCount={generatedSyllabus?.modules?.length || 0}
        onClose={closeModuleModal}
        onSave={saveModuleForm}
        isSubmitting={isSubmitting}
      />

      {/* Delete Module Confirmation (with Topic Impact Warning) */}
      <DeleteModuleConfirmation
        isOpen={Boolean(deletingModule)}
        module={deletingModule}
        onClose={closeDeleteModule}
        onConfirm={confirmDeleteModule}
        isSubmitting={isSubmitting}
      />

      {/* Reused Topic Management Dialogs */}
      <EditTopicModal
        isOpen={Boolean(editingTopic)}
        module={editingTopic?.module}
        topic={editingTopic?.topic}
        onClose={closeEditTopic}
        onSave={saveEditTopic}
        isSubmitting={isSubmitting}
      />

      <AddTopicModal
        isOpen={Boolean(addingToModule)}
        module={addingToModule}
        onClose={closeAddTopic}
        onAdd={saveAddTopic}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmation
        isOpen={Boolean(deletingTopic)}
        module={deletingTopic?.module}
        topic={deletingTopic?.topic}
        onClose={closeDeleteTopic}
        onConfirm={confirmDeleteTopic}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default AICourseBuilder;
