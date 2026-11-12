/**
 * Custom Hook: useSyllabus
 * Manages course syllabus state, async loading, module & topic CRUD modal dialogues,
 * reordering, validation, feedback notifications, and double-submit protection.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { syllabusService } from "../services/syllabusService.js";
import { validateTopicInput, validateModuleInput } from "../validation/topicValidation.js";

export function useSyllabus(course, options = {}) {
  const { onSyllabusChange } = options || {};
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  // Module dialog states
  const [moduleFormState, setModuleFormState] = useState(null); // { mode: "add"|"edit", module? }
  const [deletingModule, setDeletingModule] = useState(null); // module

  // Topic dialog states
  const [editingTopic, setEditingTopic] = useState(null); // { module, topic }
  const [addingToModule, setAddingToModule] = useState(null); // module
  const [deletingTopic, setDeletingTopic] = useState(null); // { module, topic }

  const noticeTimeoutRef = useRef(null);
  const onSyllabusChangeRef = useRef(onSyllabusChange);

  useEffect(() => {
    onSyllabusChangeRef.current = onSyllabusChange;
  }, [onSyllabusChange]);

  const clearNotice = useCallback(() => {
    if (noticeTimeoutRef.current) {
      clearTimeout(noticeTimeoutRef.current);
    }
    setSuccessNotice(null);
  }, []);

  const triggerSuccess = useCallback((message) => {
    clearNotice();
    setSuccessNotice(message);
    setError(null);
    noticeTimeoutRef.current = setTimeout(() => {
      setSuccessNotice(null);
    }, 3500);
  }, [clearNotice]);

  const courseId = course?.id;

  const applyModulesUpdate = useCallback(
    (updatedModules, successMessage) => {
      setModules(updatedModules);
      if (typeof onSyllabusChangeRef.current === "function" && courseId) {
        onSyllabusChangeRef.current(courseId, updatedModules);
      }
      if (successMessage) {
        triggerSuccess(successMessage);
      }
    },
    [courseId, triggerSuccess]
  );

  // Imperative refresh helper
  const loadSyllabus = useCallback(async () => {
    if (!course || !course.id) {
      setModules([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await syllabusService.getCourseSyllabus(course);
      setModules(data);
    } catch (err) {
      console.error("[useSyllabus] Error loading syllabus:", err);
      setError("Failed to load course syllabus. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [course]);

  useEffect(() => {
    let active = true;
    if (!course || !course.id) {
      return undefined;
    }

    syllabusService
      .getCourseSyllabus(course)
      .then((data) => {
        if (!active) return;
        setModules(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("[useSyllabus] Error loading syllabus:", err);
        setError("Failed to load course syllabus. Please try again.");
        setLoading(false);
      });

    return () => {
      active = false;
      if (noticeTimeoutRef.current) {
        clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, [course]);

  // Sync with external updates
  useEffect(() => {
    const handleUpdate = (event) => {
      if (
        course &&
        event.detail &&
        event.detail.courseId === course.id &&
        Array.isArray(event.detail.modules)
      ) {
        setModules(event.detail.modules);
      }
    };

    window.addEventListener("tx_syllabus_updated", handleUpdate);
    return () => {
      window.removeEventListener("tx_syllabus_updated", handleUpdate);
    };
  }, [course]);

  // ==========================================
  // MODULE CRUD & REORDER HANDLERS
  // ==========================================

  const openAddModule = useCallback(() => {
    setError(null);
    setModuleFormState({ mode: "add", module: null });
  }, []);

  const openEditModule = useCallback((mod) => {
    setError(null);
    setModuleFormState({ mode: "edit", module: mod });
  }, []);

  const closeModuleModal = useCallback(() => {
    setModuleFormState(null);
    setError(null);
  }, []);

  const saveModuleForm = useCallback(
    async (formData) => {
      if (!moduleFormState || !course) return;

      const validation = validateModuleInput({
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        order: formData.order,
        maxOrder: modules.length
      });

      if (!validation.isValid) {
        throw validation.errors;
      }

      try {
        setIsSubmitting(true);
        setError(null);
        let updatedModules;
        if (moduleFormState.mode === "edit" && moduleFormState.module) {
          updatedModules = await syllabusService.updateModule(
            course.id,
            moduleFormState.module.id,
            formData
          );
          closeModuleModal();
          applyModulesUpdate(updatedModules, `Module "${formData.title}" updated successfully.`);
        } else {
          updatedModules = await syllabusService.addModule(course.id, formData);
          closeModuleModal();
          applyModulesUpdate(updatedModules, `Module "${formData.title}" added to syllabus.`);
        }
      } catch (err) {
        console.error("[useSyllabus] Error saving module:", err);
        setError(err.message || "Failed to save module changes.");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [moduleFormState, course, modules.length, closeModuleModal, applyModulesUpdate]
  );

  const openDeleteModule = useCallback((mod) => {
    setError(null);
    setDeletingModule(mod);
  }, []);

  const closeDeleteModule = useCallback(() => {
    setDeletingModule(null);
    setError(null);
  }, []);

  const confirmDeleteModule = useCallback(async () => {
    if (!deletingModule || !course) return;

    const target = deletingModule;
    try {
      setIsSubmitting(true);
      setError(null);
      const updatedModules = await syllabusService.deleteModule(course.id, target.id);
      closeDeleteModule();
      applyModulesUpdate(
        updatedModules,
        `Module "${target.title}" was deleted and remaining modules renumbered.`
      );
    } catch (err) {
      console.error("[useSyllabus] Error deleting module:", err);
      setError(err.message || "Failed to delete module.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [deletingModule, course, closeDeleteModule, applyModulesUpdate]);

  const reorderModule = useCallback(
    async (mod, direction) => {
      if (!course || !mod || isSubmitting) return;
      try {
        setIsSubmitting(true);
        setError(null);
        const updatedModules = await syllabusService.reorderModule(course.id, mod.id, direction);
        applyModulesUpdate(updatedModules, `Moved Module ${mod.num} ${direction}.`);
      } catch (err) {
        console.error("[useSyllabus] Error reordering module:", err);
        setError(err.message || "Failed to reorder module.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [course, isSubmitting, applyModulesUpdate]
  );

  // ==========================================
  // TOPIC CRUD & REORDER HANDLERS
  // ==========================================

  const openEditTopic = useCallback((module, topic) => {
    setError(null);
    setEditingTopic({ module, topic });
  }, []);

  const closeEditTopic = useCallback(() => {
    setEditingTopic(null);
    setError(null);
  }, []);

  const saveEditTopic = useCallback(async (formData) => {
    if (!editingTopic || !course) return;

    const { module, topic } = editingTopic;
    const validation = validateTopicInput({
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      order: formData.order,
      maxOrder: module.topics.length
    });

    if (!validation.isValid) {
      throw validation.errors;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const updatedModules = await syllabusService.updateTopic(
        course.id,
        module.id,
        topic.id,
        formData
      );
      closeEditTopic();
      applyModulesUpdate(updatedModules, `Topic "${formData.title}" updated successfully.`);
    } catch (err) {
      console.error("[useSyllabus] Error updating topic:", err);
      setError(err.message || "Failed to save topic changes.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [editingTopic, course, closeEditTopic, applyModulesUpdate]);

  const openAddTopic = useCallback((module) => {
    setError(null);
    setAddingToModule(module);
  }, []);

  const closeAddTopic = useCallback(() => {
    setAddingToModule(null);
    setError(null);
  }, []);

  const saveAddTopic = useCallback(async (formData) => {
    if (!addingToModule || !course) return;

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
      setError(null);
      const updatedModules = await syllabusService.addTopic(
        course.id,
        addingToModule.id,
        formData
      );
      closeAddTopic();
      applyModulesUpdate(
        updatedModules,
        `New topic "${formData.title}" added to ${addingToModule.title}.`
      );
    } catch (err) {
      console.error("[useSyllabus] Error adding topic:", err);
      setError(err.message || "Failed to add new topic.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [addingToModule, course, closeAddTopic, applyModulesUpdate]);

  const openDeleteTopic = useCallback((module, topic) => {
    setError(null);
    setDeletingTopic({ module, topic });
  }, []);

  const closeDeleteTopic = useCallback(() => {
    setDeletingTopic(null);
    setError(null);
  }, []);

  const confirmDeleteTopic = useCallback(async () => {
    if (!deletingTopic || !course) return;

    const { module, topic } = deletingTopic;
    try {
      setIsSubmitting(true);
      setError(null);
      const updatedModules = await syllabusService.deleteTopic(
        course.id,
        module.id,
        topic.id
      );
      closeDeleteTopic();
      applyModulesUpdate(updatedModules, `Topic "${topic.title}" was successfully deleted.`);
    } catch (err) {
      console.error("[useSyllabus] Error deleting topic:", err);
      setError(err.message || "Failed to delete topic.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [deletingTopic, course, closeDeleteTopic, applyModulesUpdate]);

  const reorderTopic = useCallback(
    async (mod, top, direction) => {
      if (!course || !mod || !top || isSubmitting) return;
      try {
        setIsSubmitting(true);
        setError(null);
        const updatedModules = await syllabusService.reorderTopic(
          course.id,
          mod.id,
          top.id,
          direction
        );
        applyModulesUpdate(updatedModules, `Moved topic "${top.title}" ${direction}.`);
      } catch (err) {
        console.error("[useSyllabus] Error reordering topic:", err);
        setError(err.message || "Failed to reorder topic.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [course, isSubmitting, applyModulesUpdate]
  );

  return {
    modules,
    loading,
    isSubmitting,
    error,
    successNotice,
    clearNotice,
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
    reorderModule,
    // Topic dialogs & actions
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
    reorderTopic,
    refresh: loadSyllabus
  };
}

export default useSyllabus;
