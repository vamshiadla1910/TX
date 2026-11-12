/**
 * Pure Immutable Syllabus Topic & Module Operations
 * Shared by both MyCourses (syllabusService) and AI Course Builder (curriculumDraftService)
 * to eliminate duplicated module/topic CRUD, normalization, and ordering logic.
 */

/**
 * Normalize a single topic (legacy string or object) into a canonical topic record.
 * @param {string|Object} topic
 * @param {string} moduleId
 * @param {number} index
 * @returns {Object}
 */
export function normalizeTopicRecord(topic, moduleId, index) {
  if (typeof topic === "string") {
    return {
      id: `top-${moduleId}-${index + 1}`,
      title: topic,
      description: `Core concepts and hands-on exercises for ${topic}.`,
      duration: "45 mins",
      order: index + 1
    };
  }

  return {
    id: topic?.id || `top-${moduleId}-${index + 1}`,
    title: topic?.title || `Topic ${index + 1}`,
    description: topic?.description || "",
    duration: topic?.duration || "45 mins",
    order: Number(topic?.order) || index + 1
  };
}

function renumberTopics(topics) {
  topics.forEach((t, idx) => {
    t.order = idx + 1;
  });
}

function renumberModules(modules) {
  modules.forEach((m, idx) => {
    m.num = idx + 1;
  });
}

/**
 * Normalize raw modules array into guaranteed canonical structures.
 * @param {string} scopeId - courseId or draftId prefix
 * @param {Array<Object>} rawModules
 * @returns {Array<Object>}
 */
export function normalizeModulesList(scopeId, rawModules) {
  if (!Array.isArray(rawModules) || rawModules.length === 0) {
    return [];
  }

  return rawModules.map((mod, modIdx) => {
    const num = modIdx + 1;
    const moduleId = mod?.id || `mod-${scopeId}-${mod?.num || num}`;
    const rawTopics = Array.isArray(mod?.topics) ? mod.topics : [];

    const normalizedTopics = rawTopics.map((top, topIdx) =>
      normalizeTopicRecord(top, moduleId, topIdx)
    );
    renumberTopics(normalizedTopics);

    return {
      id: moduleId,
      num,
      title: mod?.title || `Module ${num}`,
      description: mod?.description || "",
      duration: mod?.duration || "10 hours",
      topics: normalizedTopics
    };
  });
}

function cloneModules(modules) {
  return JSON.parse(JSON.stringify(modules || []));
}

/**
 * Summarize module and topic counts across a syllabus.
 * @param {Array<Object>} modules
 * @returns {{ modulesCount: number, topicsCount: number }}
 */
export function computeSyllabusMetrics(modules) {
  const safeModules = Array.isArray(modules) ? modules : [];
  const topicsCount = safeModules.reduce(
    (sum, mod) => sum + (Array.isArray(mod?.topics) ? mod.topics.length : 0),
    0
  );
  return {
    modulesCount: safeModules.length,
    topicsCount
  };
}

/**
 * Add a new module to an immutable copy of modules, inserting at optional order/num.
 */
export function addModuleToList(modules, scopeId, moduleData) {
  if (!moduleData || !moduleData.title || !moduleData.title.trim()) {
    throw new Error("Module title is required and cannot be empty.");
  }

  const nextModules = cloneModules(modules);
  const uniqueSuffix = Math.random().toString(36).slice(2, 6);
  const moduleId = `mod-${scopeId || "crs"}-${Date.now()}-${uniqueSuffix}`;

  const rawTopics = Array.isArray(moduleData.topics) ? moduleData.topics : [];
  const normalizedTopics = rawTopics.map((top, idx) =>
    normalizeTopicRecord(top, moduleId, idx)
  );
  renumberTopics(normalizedTopics);

  const newModule = {
    id: moduleId,
    num: nextModules.length + 1,
    title: moduleData.title.trim(),
    description: moduleData.description ? moduleData.description.trim() : "",
    duration:
      moduleData.duration && moduleData.duration.trim()
        ? moduleData.duration.trim()
        : "8 hours",
    topics: normalizedTopics
  };

  const requestedOrder = Number(moduleData.order ?? moduleData.num);
  const insertIdx =
    Number.isInteger(requestedOrder) && requestedOrder >= 1
      ? Math.max(0, Math.min(nextModules.length, requestedOrder - 1))
      : nextModules.length;

  nextModules.splice(insertIdx, 0, newModule);
  renumberModules(nextModules);

  return nextModules;
}

/**
 * Update an existing module's metadata (and optionally reposition it) while preserving its topics.
 */
export function updateModuleInList(modules, moduleId, updatedFields) {
  if (!moduleId) {
    throw new Error("Module ID is required.");
  }
  if (updatedFields?.title !== undefined && !updatedFields.title.trim()) {
    throw new Error("Module title cannot be empty.");
  }

  const nextModules = cloneModules(modules);
  const currentIdx = nextModules.findIndex((m) => m.id === moduleId);
  if (currentIdx === -1) {
    throw new Error(`Module ${moduleId} not found in syllabus.`);
  }

  const targetModule = { ...nextModules[currentIdx] };

  if (updatedFields.title !== undefined) {
    targetModule.title = updatedFields.title.trim();
  }
  if (updatedFields.description !== undefined) {
    targetModule.description = updatedFields.description.trim();
  }
  if (updatedFields.duration !== undefined) {
    targetModule.duration = updatedFields.duration.trim() || "8 hours";
  }

  const requestedOrder = updatedFields.order ?? updatedFields.num;
  if (requestedOrder !== undefined) {
    const parsedOrder = Number(requestedOrder);
    if (Number.isInteger(parsedOrder) && parsedOrder >= 1) {
      nextModules.splice(currentIdx, 1);
      const insertIdx = Math.max(0, Math.min(nextModules.length, parsedOrder - 1));
      nextModules.splice(insertIdx, 0, targetModule);
    } else {
      nextModules[currentIdx] = targetModule;
    }
  } else {
    nextModules[currentIdx] = targetModule;
  }

  renumberModules(nextModules);
  return nextModules;
}

/**
 * Delete a module (along with its topics) and re-number remaining modules 1..N.
 */
export function deleteModuleFromList(modules, moduleId) {
  if (!moduleId) {
    throw new Error("Module ID is required.");
  }

  const nextModules = cloneModules(modules);
  const initialCount = nextModules.length;
  const filtered = nextModules.filter((m) => m.id !== moduleId);

  if (filtered.length === initialCount) {
    throw new Error(`Module ${moduleId} was not found to delete.`);
  }

  renumberModules(filtered);
  return filtered;
}

/**
 * Reorder a module one slot "up" or "down" within the syllabus and re-number 1..N.
 */
export function reorderModuleInList(modules, moduleId, direction) {
  if (!moduleId) {
    throw new Error("Module ID is required.");
  }
  if (direction !== "up" && direction !== "down") {
    throw new Error("Reorder direction must be 'up' or 'down'.");
  }

  const nextModules = cloneModules(modules);
  const currentIdx = nextModules.findIndex((m) => m.id === moduleId);
  if (currentIdx === -1) {
    throw new Error(`Module ${moduleId} not found.`);
  }

  const targetIdx = direction === "up" ? currentIdx - 1 : currentIdx + 1;
  if (targetIdx < 0 || targetIdx >= nextModules.length) {
    return nextModules;
  }

  const [moved] = nextModules.splice(currentIdx, 1);
  nextModules.splice(targetIdx, 0, moved);
  renumberModules(nextModules);

  return nextModules;
}

/**
 * Add a new topic to a specific module in an immutable copy of modules.
 */
export function addTopicToModules(modules, moduleId, topicData) {
  if (!moduleId) {
    throw new Error("Module ID is required.");
  }
  if (!topicData || !topicData.title || !topicData.title.trim()) {
    throw new Error("Topic title is required and cannot be empty.");
  }

  const nextModules = cloneModules(modules);
  const targetModule = nextModules.find((m) => m.id === moduleId);
  if (!targetModule) {
    throw new Error(`Module ${moduleId} not found in course syllabus.`);
  }

  const uniqueSuffix = Math.random().toString(36).slice(2, 6);
  const newTopic = {
    id: `top-${moduleId}-${Date.now()}-${uniqueSuffix}`,
    title: topicData.title.trim(),
    description: topicData.description ? topicData.description.trim() : "",
    duration:
      topicData.duration && topicData.duration.trim()
        ? topicData.duration.trim()
        : "45 mins",
    order: targetModule.topics.length + 1
  };

  const requestedOrder = Number(topicData.order);
  const insertIdx =
    Number.isInteger(requestedOrder) && requestedOrder >= 1
      ? Math.max(0, Math.min(targetModule.topics.length, requestedOrder - 1))
      : targetModule.topics.length;

  targetModule.topics.splice(insertIdx, 0, newTopic);
  renumberTopics(targetModule.topics);

  return nextModules;
}

/**
 * Update an existing topic inside a module cleanly.
 */
export function updateTopicInModules(modules, moduleId, topicId, updatedFields) {
  if (!moduleId || !topicId) {
    throw new Error("Module ID and Topic ID are required.");
  }
  if (updatedFields?.title !== undefined && !updatedFields.title.trim()) {
    throw new Error("Topic title cannot be empty.");
  }

  const nextModules = cloneModules(modules);
  const targetModule = nextModules.find((m) => m.id === moduleId);
  if (!targetModule) {
    throw new Error(`Module ${moduleId} not found.`);
  }

  const currentIdx = targetModule.topics.findIndex((t) => t.id === topicId);
  if (currentIdx === -1) {
    throw new Error(`Topic ${topicId} not found in module.`);
  }

  const targetTopic = { ...targetModule.topics[currentIdx] };

  if (updatedFields.title !== undefined) {
    targetTopic.title = updatedFields.title.trim();
  }
  if (updatedFields.description !== undefined) {
    targetTopic.description = updatedFields.description.trim();
  }
  if (updatedFields.duration !== undefined) {
    targetTopic.duration = updatedFields.duration.trim() || "45 mins";
  }

  if (updatedFields.order !== undefined) {
    const requestedOrder = Number(updatedFields.order);
    if (Number.isInteger(requestedOrder) && requestedOrder >= 1) {
      targetModule.topics.splice(currentIdx, 1);
      const insertIdx = Math.max(
        0,
        Math.min(targetModule.topics.length, requestedOrder - 1)
      );
      targetModule.topics.splice(insertIdx, 0, targetTopic);
    } else {
      targetModule.topics[currentIdx] = targetTopic;
    }
  } else {
    targetModule.topics[currentIdx] = targetTopic;
  }

  renumberTopics(targetModule.topics);

  return nextModules;
}

/**
 * Delete an existing topic from a module and re-index order positions.
 */
export function deleteTopicFromModules(modules, moduleId, topicId) {
  if (!moduleId || !topicId) {
    throw new Error("Module ID and Topic ID are required.");
  }

  const nextModules = cloneModules(modules);
  const targetModule = nextModules.find((m) => m.id === moduleId);
  if (!targetModule) {
    throw new Error(`Module ${moduleId} not found.`);
  }

  const initialCount = targetModule.topics.length;
  targetModule.topics = targetModule.topics.filter((t) => t.id !== topicId);

  if (targetModule.topics.length === initialCount) {
    throw new Error(`Topic ${topicId} was not found to delete.`);
  }

  renumberTopics(targetModule.topics);

  return nextModules;
}

/**
 * Reorder a topic one slot "up" or "down" within its parent module.
 */
export function reorderTopicInModules(modules, moduleId, topicId, direction) {
  if (!moduleId || !topicId) {
    throw new Error("Module ID and Topic ID are required.");
  }
  if (direction !== "up" && direction !== "down") {
    throw new Error("Reorder direction must be 'up' or 'down'.");
  }

  const nextModules = cloneModules(modules);
  const targetModule = nextModules.find((m) => m.id === moduleId);
  if (!targetModule) {
    throw new Error(`Module ${moduleId} not found.`);
  }

  const currentIdx = targetModule.topics.findIndex((t) => t.id === topicId);
  if (currentIdx === -1) {
    throw new Error(`Topic ${topicId} not found in module.`);
  }

  const targetIdx = direction === "up" ? currentIdx - 1 : currentIdx + 1;
  if (targetIdx < 0 || targetIdx >= targetModule.topics.length) {
    return nextModules;
  }

  const [moved] = targetModule.topics.splice(currentIdx, 1);
  targetModule.topics.splice(targetIdx, 0, moved);
  renumberTopics(targetModule.topics);

  return nextModules;
}
