/**
 * Custom Hook: useCurriculumBuilder
 * Manages unified course creation (AI-generated and Manual modes) AND existing course studio editing
 * with full Course Metadata, Module CRUD/Reorder, Topic CRUD/Reorder, persistent draft staging,
 * and enrollment-safe Delete / Archive confirmation rules.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { curriculumDraftService } from "../services/curriculumDraftService.js";
import { courseService } from "../../MyCourses/services/courseService.js";
import { syllabusService } from "../../MyCourses/services/syllabusService.js";
import { validateTopicInput, validateModuleInput } from "../../MyCourses/validation/topicValidation.js";
import { validateCourseInput, suggestCourseCode } from "../../MyCourses/validation/courseValidation.js";

export function useCurriculumBuilder({
  instructorProfile,
  initialMode = "ai",
  editingCourse = null,
  learners = [],
  batches = [],
  onSaveCourse,
  onDeleteCourse,
  onCloseBuilder,
  onNavigate
}) {
  const instructorId = instructorProfile?.id || "inst-ramana-1";
  const isEditingExisting = Boolean(editingCourse && editingCourse.id);

  const [initialDraft] = useState(() =>
    isEditingExisting ? null : curriculumDraftService.loadDraftState(instructorId)
  );

  const [builderMode, setBuilderMode] = useState(
    () => (editingCourse?.generationMode === "manual" ? "manual" : initialMode || "ai")
  );

  const [topic, setTopicState] = useState(() =>
    editingCourse?.title ||
    initialDraft?.working?.title ||
    "Autonomous AI Agents & Multi-Agent Orchestration"
  );
  const [code, setCodeState] = useState(() =>
    editingCourse?.code || initialDraft?.working?.code || "AGENT-AI"
  );
  const [codeTouched, setCodeTouched] = useState(() => Boolean(editingCourse?.code || initialDraft?.working?.code));
  const [level, setLevel] = useState(
    () => editingCourse?.level || initialDraft?.working?.level || "Advanced"
  );
  const [category, setCategory] = useState(
    () => editingCourse?.category || initialDraft?.working?.category || "Artificial Intelligence & Systems"
  );
  const [targetAudience, setTargetAudience] = useState(
    () =>
      editingCourse?.targetAudience ||
      initialDraft?.working?.targetAudience ||
      "Software Engineers & Full Stack Developers"
  );
  const [status, setStatus] = useState(
    () => editingCourse?.status || initialDraft?.working?.status || "Published"
  );
  const [price, setPrice] = useState(
    () => editingCourse?.price ?? initialDraft?.working?.price ?? 19999
  );
  const [totalHours, setTotalHours] = useState(
    () => editingCourse?.totalHours || initialDraft?.working?.totalHours || 52
  );
  const [description, setDescription] = useState(
    () => editingCourse?.description || initialDraft?.working?.description || ""
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [generatedSyllabus, setGeneratedSyllabus] = useState(
    () => (isEditingExisting ? null : initialDraft?.working || null)
  );
  const [committedSyllabus, setCommittedSyllabus] = useState(
    () => (isEditingExisting ? null : initialDraft?.committed || null)
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(() =>
    Boolean(!isEditingExisting && initialDraft?.hasUnsavedChanges)
  );

  const [successNotice, setSuccessNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");

  // Course dialogs
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [deleteCourseModalState, setDeleteCourseModalState] = useState(null); // { isOpen, impact }

  // Module dialogs
  const [moduleFormState, setModuleFormState] = useState(null); // { mode: "add"|"edit", module }
  const [deletingModule, setDeletingModule] = useState(null); // module

  // Topic dialogs
  const [editingTopic, setEditingTopic] = useState(null); // { module, topic }
  const [addingToModule, setAddingToModule] = useState(null); // module
  const [deletingTopic, setDeletingTopic] = useState(null); // { module, topic }

  const timerRef = useRef(null);

  const clearFeedback = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSuccessNotice("");
    setErrorNotice("");
  }, []);

  const showSuccess = useCallback((message) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setErrorNotice("");
    setSuccessNotice(message);
    timerRef.current = setTimeout(() => {
      setSuccessNotice("");
    }, 3800);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Load existing course & syllabus asynchronously when editingCourse prop is supplied
  useEffect(() => {
    let active = true;
    if (!editingCourse || !editingCourse.id) return undefined;

    syllabusService
      .getCourseSyllabus(editingCourse)
      .then((modules) => {
        if (!active) return;
        const snapshot = {
          existingCourseId: editingCourse.id,
          title: editingCourse.title,
          code: editingCourse.code,
          category: editingCourse.category,
          level: editingCourse.level,
          targetAudience: editingCourse.targetAudience || "",
          description: editingCourse.description || "",
          status: editingCourse.status || "Published",
          price: editingCourse.price ?? 14999,
          totalHours: editingCourse.totalHours || 40,
          estimatedHours: editingCourse.totalHours || 40,
          generationMode: editingCourse.generationMode || "manual",
          modulesCount: modules.length,
          modules
        };
        setGeneratedSyllabus(snapshot);
        setCommittedSyllabus(snapshot);
        setHasUnsavedChanges(false);
      })
      .catch((err) => {
        if (!active) return;
        setErrorNotice(err?.message || "Failed to load course syllabus.");
      });

    return () => {
      active = false;
    };
  }, [editingCourse]);

  const setTopic = useCallback(
    (nextTitle) => {
      setTopicState(nextTitle);
      if (!codeTouched && !isEditingExisting) {
        setCodeState(suggestCourseCode(nextTitle, "COURSE-101"));
      }
      if (generatedSyllabus) {
        setGeneratedSyllabus((prev) =>
          curriculumDraftService.updateCourseMetadata(prev, {
            title: nextTitle,
            code: !codeTouched && !isEditingExisting ? suggestCourseCode(nextTitle, "COURSE-101") : code
          })
        );
        setHasUnsavedChanges(true);
      }
    },
    [codeTouched, isEditingExisting, generatedSyllabus, code]
  );

  const setCode = useCallback(
    (nextCode) => {
      const normalized = String(nextCode || "").toUpperCase();
      setCodeTouched(true);
      setCodeState(normalized);
      if (generatedSyllabus) {
        setGeneratedSyllabus((prev) =>
          curriculumDraftService.updateCourseMetadata(prev, { code: normalized })
        );
        setHasUnsavedChanges(true);
      }
    },
    [generatedSyllabus]
  );

  const stageWorkingUpdate = useCallback(
    (nextSyllabus, successMsg) => {
      if (!isEditingExisting) {
        curriculumDraftService.saveWorkingDraft(
          nextSyllabus,
          committedSyllabus || nextSyllabus,
          instructorId
        );
      }
      setGeneratedSyllabus(nextSyllabus);
      setHasUnsavedChanges(true);
      if (successMsg) showSuccess(successMsg);
    },
    [isEditingExisting, committedSyllabus, instructorId, showSuccess]
  );

  const switchBuilderMode = useCallback(
    (nextMode) => {
      setBuilderMode(nextMode);
      clearFeedback();
      if (nextMode === "manual" && !generatedSyllabus && !isEditingExisting) {
        const manualBlank = curriculumDraftService.createManualCourseBlueprint({
          title: topic,
          code,
          category,
          level,
          targetAudience,
          price,
          totalHours,
          description,
          status: status || "Draft"
        });
        const committed = curriculumDraftService.commitDraftChanges(manualBlank, instructorId);
        setGeneratedSyllabus(committed);
        setCommittedSyllabus(committed);
        setHasUnsavedChanges(false);
      }
    },
    [
      clearFeedback,
      generatedSyllabus,
      isEditingExisting,
      topic,
      code,
      category,
      level,
      targetAudience,
      price,
      totalHours,
      description,
      status,
      instructorId
    ]
  );

  const handleInitializeManual = useCallback(() => {
    const manualBlueprint = curriculumDraftService.createManualCourseBlueprint({
      title: topic,
      code,
      category,
      level,
      targetAudience,
      price,
      totalHours,
      description,
      status
    });
    const committed = curriculumDraftService.commitDraftChanges(manualBlueprint, instructorId);
    setGeneratedSyllabus(committed);
    setCommittedSyllabus(committed);
    setHasUnsavedChanges(false);
    showSuccess("Initialized manual course structure. Add modules and topics on the right.");
  }, [
    topic,
    code,
    category,
    level,
    targetAudience,
    price,
    totalHours,
    description,
    status,
    instructorId,
    showSuccess
  ]);

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    clearFeedback();

    setTimeout(() => {
      const blueprint = curriculumDraftService.generateSyllabusBlueprint({
        topic,
        code,
        category,
        level,
        targetAudience,
        price,
        totalHours,
        description,
        status
      });
      if (isEditingExisting && editingCourse?.id) {
        blueprint.existingCourseId = editingCourse.id;
        setGeneratedSyllabus(blueprint);
        setHasUnsavedChanges(true);
      } else {
        const committed = curriculumDraftService.commitDraftChanges(blueprint, instructorId);
        setGeneratedSyllabus(committed);
        setCommittedSyllabus(committed);
        setCodeState(committed.code);
        setHasUnsavedChanges(false);
      }
      setIsGenerating(false);
      showSuccess(
        "AI curriculum specification generated. Edit course details, modules, and topics before saving."
      );
    }, 650);
  }, [
    topic,
    code,
    category,
    level,
    targetAudience,
    price,
    totalHours,
    description,
    status,
    isEditingExisting,
    editingCourse,
    instructorId,
    clearFeedback,
    showSuccess
  ]);

  // Edit Course Metadata Modal inside Builder
  const openEditCourseModal = useCallback(() => {
    setErrorNotice("");
    setIsEditCourseOpen(true);
  }, []);

  const closeEditCourseModal = useCallback(() => {
    setIsEditCourseOpen(false);
  }, []);

  const saveCourseMetadata = useCallback(
    async (updatedFields) => {
      setTopicState(updatedFields.title);
      setCodeState(updatedFields.code);
      setCodeTouched(true);
      setCategory(updatedFields.category);
      setLevel(updatedFields.level);
      setStatus(updatedFields.status);
      setPrice(updatedFields.price);
      setTotalHours(updatedFields.totalHours);
      setTargetAudience(updatedFields.targetAudience || "");
      setDescription(updatedFields.description || "");

      if (generatedSyllabus) {
        const updated = curriculumDraftService.updateCourseMetadata(
          generatedSyllabus,
          updatedFields
        );
        stageWorkingUpdate(updated, `Updated course metadata for "${updatedFields.title}".`);
      }
      setIsEditCourseOpen(false);
    },
    [generatedSyllabus, stageWorkingUpdate]
  );

  // Module CRUD inside Builder
  const openAddModule = useCallback(() => {
    setErrorNotice("");
    setModuleFormState({ mode: "add", module: null });
  }, []);

  const openEditModule = useCallback((mod) => {
    setErrorNotice("");
    setModuleFormState({ mode: "edit", module: mod });
  }, []);

  const closeModuleModal = useCallback(() => {
    setModuleFormState(null);
  }, []);

  const saveModuleForm = useCallback(
    async (formData) => {
      if (!moduleFormState || !generatedSyllabus || isSubmitting) return;

      const validation = validateModuleInput({
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        order: formData.order,
        maxOrder: generatedSyllabus.modules.length
      });

      if (!validation.isValid) {
        throw validation.errors;
      }

      try {
        setIsSubmitting(true);
        let updated;
        if (moduleFormState.mode === "edit" && moduleFormState.module) {
          updated = curriculumDraftService.updateModuleInSyllabus(
            generatedSyllabus,
            moduleFormState.module.id,
            formData
          );
          stageWorkingUpdate(updated, `Updated module "${formData.title}".`);
        } else {
          updated = curriculumDraftService.addModuleToSyllabus(generatedSyllabus, formData);
          stageWorkingUpdate(updated, `Added module "${formData.title}".`);
        }
        setModuleFormState(null);
      } catch (err) {
        setErrorNotice(err.message || "Unable to save module.");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [moduleFormState, generatedSyllabus, isSubmitting, stageWorkingUpdate]
  );

  const openDeleteModule = useCallback((mod) => {
    setErrorNotice("");
    setDeletingModule(mod);
  }, []);

  const closeDeleteModule = useCallback(() => {
    setDeletingModule(null);
  }, []);

  const confirmDeleteModule = useCallback(async () => {
    if (!deletingModule || !generatedSyllabus || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const updated = curriculumDraftService.deleteModuleFromSyllabus(
        generatedSyllabus,
        deletingModule.id
      );
      stageWorkingUpdate(updated, `Deleted module "${deletingModule.title}".`);
      setDeletingModule(null);
    } catch (err) {
      setErrorNotice(err.message || "Unable to delete module.");
    } finally {
      setIsSubmitting(false);
    }
  }, [deletingModule, generatedSyllabus, isSubmitting, stageWorkingUpdate]);

  const handleReorderModule = useCallback(
    (mod, direction) => {
      if (!generatedSyllabus || isSubmitting) return;
      try {
        const updated = curriculumDraftService.reorderModuleInSyllabus(
          generatedSyllabus,
          mod.id,
          direction
        );
        stageWorkingUpdate(updated, `Moved Module ${mod.num} ${direction}.`);
      } catch (err) {
        setErrorNotice(err.message || "Unable to reorder module.");
      }
    },
    [generatedSyllabus, isSubmitting, stageWorkingUpdate]
  );

  // Edit Topic
  const openEditTopic = useCallback((mod, top) => {
    setErrorNotice("");
    setEditingTopic({ module: mod, topic: top });
  }, []);

  const closeEditTopic = useCallback(() => {
    setEditingTopic(null);
  }, []);

  const saveEditTopic = useCallback(
    async (formData) => {
      if (!editingTopic || !generatedSyllabus || isSubmitting) return;
      const { module: targetModule, topic: targetTopic } = editingTopic;

      const validation = validateTopicInput({
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        order: formData.order,
        maxOrder: targetModule.topics.length
      });

      if (!validation.isValid) {
        throw validation.errors;
      }

      try {
        setIsSubmitting(true);
        const updated = curriculumDraftService.updateTopicInSyllabus(
          generatedSyllabus,
          targetModule.id,
          targetTopic.id,
          formData
        );
        stageWorkingUpdate(updated, `Updated topic "${formData.title.trim()}".`);
        setEditingTopic(null);
      } catch (err) {
        setErrorNotice(err.message || "Unable to update topic.");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingTopic, generatedSyllabus, isSubmitting, stageWorkingUpdate]
  );

  // Add Topic
  const openAddTopic = useCallback((mod) => {
    setErrorNotice("");
    setAddingToModule(mod);
  }, []);

  const closeAddTopic = useCallback(() => {
    setAddingToModule(null);
  }, []);

  const saveAddTopic = useCallback(
    async (formData) => {
      if (!addingToModule || !generatedSyllabus || isSubmitting) return;

      const validation = validateTopicInput({
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        order: formData.order,
        maxOrder: addingToModule.topics.length
      });

      if (!validation.isValid) {
        throw validation.errors;
      }

      try {
        setIsSubmitting(true);
        const updated = curriculumDraftService.addTopicToSyllabus(
          generatedSyllabus,
          addingToModule.id,
          formData
        );
        stageWorkingUpdate(
          updated,
          `Added topic "${formData.title.trim()}" to Module ${addingToModule.num}.`
        );
        setAddingToModule(null);
      } catch (err) {
        setErrorNotice(err.message || "Unable to add new topic.");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [addingToModule, generatedSyllabus, isSubmitting, stageWorkingUpdate]
  );

  // Delete Topic
  const openDeleteTopic = useCallback((mod, top) => {
    setErrorNotice("");
    setDeletingTopic({ module: mod, topic: top });
  }, []);

  const closeDeleteTopic = useCallback(() => {
    setDeletingTopic(null);
  }, []);

  const confirmDeleteTopic = useCallback(async () => {
    if (!deletingTopic || !generatedSyllabus || isSubmitting) return;
    const { module: targetModule, topic: targetTopic } = deletingTopic;

    try {
      setIsSubmitting(true);
      const updated = curriculumDraftService.deleteTopicFromSyllabus(
        generatedSyllabus,
        targetModule.id,
        targetTopic.id
      );
      stageWorkingUpdate(updated, `Removed topic "${targetTopic.title}".`);
      setDeletingTopic(null);
    } catch (err) {
      setErrorNotice(err.message || "Unable to remove topic.");
    } finally {
      setIsSubmitting(false);
    }
  }, [deletingTopic, generatedSyllabus, isSubmitting, stageWorkingUpdate]);

  // Reorder Topic
  const handleReorderTopic = useCallback(
    (moduleId, topicId, direction) => {
      if (!generatedSyllabus || isSubmitting) return;
      try {
        const updated = curriculumDraftService.reorderTopicInSyllabus(
          generatedSyllabus,
          moduleId,
          topicId,
          direction
        );
        stageWorkingUpdate(updated, `Moved topic ${direction}.`);
      } catch (err) {
        setErrorNotice(err.message || "Unable to reorder topic.");
      }
    },
    [generatedSyllabus, isSubmitting, stageWorkingUpdate]
  );

  // Save Changes & Cancel Draft Actions
  const handleSaveDraftChanges = useCallback(() => {
    if (!generatedSyllabus) return;
    const synced = curriculumDraftService.updateCourseMetadata(generatedSyllabus, {
      title: topic,
      code,
      category,
      level,
      targetAudience,
      price,
      totalHours,
      description,
      status
    });
    const saved = curriculumDraftService.commitDraftChanges(synced, instructorId);
    setGeneratedSyllabus(saved);
    setCommittedSyllabus(saved);
    setHasUnsavedChanges(false);
    showSuccess("All course & curriculum changes saved to local draft.");
  }, [
    generatedSyllabus,
    topic,
    code,
    category,
    level,
    targetAudience,
    price,
    totalHours,
    description,
    status,
    instructorId,
    showSuccess
  ]);

  const handleCancelDraftChanges = useCallback(() => {
    if (!committedSyllabus) return;
    const restored = isEditingExisting
      ? JSON.parse(JSON.stringify(committedSyllabus))
      : curriculumDraftService.revertWorkingDraft(committedSyllabus, instructorId);
    setGeneratedSyllabus(restored);
    setHasUnsavedChanges(false);
    showSuccess("Reverted unsaved modifications back to last saved curriculum.");
  }, [committedSyllabus, isEditingExisting, instructorId, showSuccess]);

  // Delete existing course or discard unsaved draft
  const openDeleteOrDiscardCourse = useCallback(() => {
    setErrorNotice("");
    if (isEditingExisting && editingCourse) {
      const impact = courseService.checkCourseEnrollmentImpact(editingCourse, {
        learners,
        batches
      });
      setDeleteCourseModalState({ isOpen: true, impact });
    } else {
      setDeleteCourseModalState({
        isOpen: true,
        impact: { requiresArchive: false, enrolledLearners: 0, isDraftOnly: true }
      });
    }
  }, [isEditingExisting, editingCourse, learners, batches]);

  const closeDeleteCourseModal = useCallback(() => {
    setDeleteCourseModalState(null);
  }, []);

  const confirmDeleteOrDiscardCourse = useCallback(
    async ({ forceArchive = false } = {}) => {
      if (isSubmitting) return;
      try {
        setIsSubmitting(true);
        if (isEditingExisting && editingCourse) {
          if (typeof onDeleteCourse === "function") {
            await onDeleteCourse(editingCourse.id, { forceArchive });
          } else {
            await courseService.deleteOrArchiveCourse(editingCourse.id, {
              forceArchive,
              learners,
              batches,
              instructorIdentity: instructorProfile || instructorId
            });
          }
          setDeleteCourseModalState(null);
          if (typeof onCloseBuilder === "function") {
            onCloseBuilder();
          }
        } else {
          curriculumDraftService.clearDraft(instructorId);
          setGeneratedSyllabus(null);
          setCommittedSyllabus(null);
          setHasUnsavedChanges(false);
          setDeleteCourseModalState(null);
          showSuccess("Cleared current draft curriculum.");
        }
      } catch (err) {
        setErrorNotice(err?.message || "Unable to complete course removal.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      isEditingExisting,
      editingCourse,
      onDeleteCourse,
      learners,
      batches,
      instructorProfile,
      instructorId,
      onCloseBuilder,
      showSuccess
    ]
  );

  // Create/Publish New Course OR Update Existing Course
  const handlePublishCourse = useCallback(async () => {
    if (isSubmitting) return;

    const mergedMetadata = {
      title: topic,
      code,
      category,
      level,
      targetAudience,
      description,
      status,
      price: Number(price),
      totalHours: Number(totalHours)
    };

    const validation = validateCourseInput(mergedMetadata);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] || "Please fix course form errors.";
      setErrorNotice(firstError);
      return;
    }

    if (!generatedSyllabus || !Array.isArray(generatedSyllabus.modules)) {
      setErrorNotice("Please generate or initialize at least one module before saving.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorNotice("");

      if (isEditingExisting && editingCourse) {
        const savedModules = await syllabusService.saveCourseSyllabus(
          editingCourse.id,
          generatedSyllabus.modules
        );
        const { course } = await courseService.updateCourse(
          editingCourse.id,
          {
            ...mergedMetadata,
            modulesCount: savedModules.length,
            topicsCount: savedModules.reduce(
              (sum, m) => sum + (Array.isArray(m.topics) ? m.topics.length : 0),
              0
            ),
            modules: savedModules
          },
          instructorProfile || instructorId
        );

        if (typeof onSaveCourse === "function") {
          await onSaveCourse(course, { isUpdate: true });
        }
        setCommittedSyllabus({ ...generatedSyllabus, ...mergedMetadata, modules: savedModules });
        setHasUnsavedChanges(false);
        showSuccess(`Course "${course.title}" and syllabus saved successfully.`);
        if (typeof onCloseBuilder === "function") {
          onCloseBuilder(`Course "${course.title}" updated successfully.`);
        }
      } else {
        const mergedSyllabus = {
          ...generatedSyllabus,
          ...mergedMetadata,
          generationMode: builderMode === "manual" ? "manual" : "ai"
        };
        const newCourse = await curriculumDraftService.publishCourseCurriculum(
          mergedSyllabus,
          instructorProfile || instructorId
        );

        if (typeof onSaveCourse === "function") {
          await onSaveCourse(newCourse, { isUpdate: false });
        }

        setGeneratedSyllabus(null);
        setCommittedSyllabus(null);
        setHasUnsavedChanges(false);
        if (typeof onCloseBuilder === "function") {
          onCloseBuilder(`Course "${newCourse.title}" created and added to My Courses.`);
        } else if (typeof onNavigate === "function") {
          showSuccess("Course curriculum published with your edits to My Courses!");
          onNavigate("My Courses");
        }
      }
    } catch (err) {
      setErrorNotice(err.message || "Failed to save course curriculum.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    topic,
    code,
    category,
    level,
    targetAudience,
    description,
    status,
    price,
    totalHours,
    generatedSyllabus,
    isEditingExisting,
    editingCourse,
    builderMode,
    instructorProfile,
    instructorId,
    onSaveCourse,
    onCloseBuilder,
    onNavigate,
    showSuccess
  ]);

  const existingCourseImpact = isEditingExisting
    ? courseService.checkCourseEnrollmentImpact(editingCourse, { learners, batches })
    : null;

  return {
    isEditingExisting,
    builderMode,
    switchBuilderMode,
    // Course Metadata State
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
    // Curriculum State
    generatedSyllabus,
    hasUnsavedChanges,
    successNotice,
    errorNotice,
    clearFeedback,
    // Course actions
    isEditCourseOpen,
    openEditCourseModal,
    closeEditCourseModal,
    saveCourseMetadata,
    deleteCourseModalState,
    existingCourseImpact,
    openDeleteOrDiscardCourse,
    closeDeleteCourseModal,
    confirmDeleteOrDiscardCourse,
    // Module actions
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
    // Topic actions
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
    // Draft / Publish actions
    handleSaveDraftChanges,
    handleCancelDraftChanges,
    handlePublishCourse
  };
}

export default useCurriculumBuilder;
