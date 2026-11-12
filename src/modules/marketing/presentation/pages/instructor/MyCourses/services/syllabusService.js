/**
 * Syllabus Service
 * Centralized data access and persistence layer for Course Syllabus & Topics.
 * Uses localStorage persistence to ensure changes survive page refreshes,
 * and exposes an asynchronous Promise-based API prepared for future REST API integration.
 */

import {
  normalizeModulesList,
  addModuleToList,
  updateModuleInList,
  deleteModuleFromList,
  reorderModuleInList,
  addTopicToModules,
  updateTopicInModules,
  deleteTopicFromModules,
  reorderTopicInModules
} from "../utils/topicOperations.js";

const STORAGE_KEY = "tx_instructor_course_syllabus_v1";

class SyllabusService {
  constructor() {
    this._memoryStore = {};
    this._apiEndpoint = null; // Future REST API: e.g. "/api/v1/instructor/courses"
  }

  /**
   * Safely read all course syllabi from storage
   */
  _loadStorage() {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            this._memoryStore = parsed;
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn("[SyllabusService] Storage read error:", err);
    }
    return this._memoryStore;
  }

  /**
   * Safely persist syllabi map to storage and notify subscribers
   */
  _saveStorage(allSyllabi, updatedCourseId, updatedModules) {
    this._memoryStore = allSyllabi || {};
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._memoryStore));
      }
    } catch (err) {
      console.warn("[SyllabusService] Storage write error:", err);
    }

    if (typeof window !== "undefined" && updatedCourseId) {
      window.dispatchEvent(
        new CustomEvent("tx_syllabus_updated", {
          detail: { courseId: updatedCourseId, modules: updatedModules }
        })
      );
    }
  }

  /**
   * Generate canonical standard modules for a course if none exist
   */
  _generateDefaultModules(course) {
    const courseId = course.id || "crs-default";
    const courseTitle = course.title || "Course";
    const firstWord = courseTitle.split(" ")[0];
    const count = course.modulesCount || 4;

    const templates = [
      {
        num: 1,
        title: `Foundations of ${firstWord} & Architecture`,
        duration: "12 hours",
        topics: [
          { title: "Core mental models & structural paradigms", duration: "45 mins", description: `Fundamental mental models, architecture overview, and core syntax for ${courseTitle}.` },
          { title: "Environment configuration & dev toolchain", duration: "60 mins", description: "Configuring development containers, linters, formatters, and local debuggers." },
          { title: "Fundamental syntax, primitives & typing", duration: "50 mins", description: "Deep dive into language primitives, memory layout, and type safety constraints." }
        ]
      },
      {
        num: 2,
        title: "Deep Dive into Enterprise Design Patterns",
        duration: "16 hours",
        topics: [
          { title: "Scalable project topology & clean boundaries", duration: "60 mins", description: "Organizing modular monoliths, domain layers, and boundary enforcement." },
          { title: "State management, caching & lifecycle", duration: "75 mins", description: "In-memory caching strategies, invalidation mechanisms, and reactive state stores." },
          { title: "Resilience, fault tolerance & error boundaries", duration: "55 mins", description: "Circuit breakers, retry policies, and structured exception handling." }
        ]
      },
      {
        num: 3,
        title: "Integration, Automation & Cloud Deployment",
        duration: "14 hours",
        topics: [
          { title: "CI/CD pipelines & automated quality gates", duration: "60 mins", description: "Automated regression testing, linting checks, and pipeline triggers." },
          { title: "Production observability & telemetry", duration: "50 mins", description: "Structured JSON logging, OpenTelemetry traces, and health check probes." },
          { title: "Dockerized containerization & registry deployment", duration: "70 mins", description: "Building multi-stage Dockerfiles and publishing to container registries." }
        ]
      },
      {
        num: 4,
        title: "Capstone Project & Industry Portfolio Evaluation",
        duration: "10 hours",
        topics: [
          { title: "End-to-end architecture build & implementation", duration: "90 mins", description: "Architecting a production-ready application addressing real enterprise requirements." },
          { title: "Automated test suites & contract verification", duration: "60 mins", description: "Writing end-to-end tests, integration tests, and API contract specifications." },
          { title: "Mentor review rubric & deployment audit", duration: "45 mins", description: "Comprehensive code review against performance, security, and scalability rubrics." }
        ]
      }
    ];

    return templates.slice(0, count).map((mod, modIdx) => {
      const moduleId = `mod-${courseId}-${mod.num || modIdx + 1}`;
      return {
        id: moduleId,
        num: mod.num || modIdx + 1,
        title: mod.title,
        duration: mod.duration,
        topics: mod.topics.map((top, topIdx) => ({
          id: `top-${moduleId}-${topIdx + 1}`,
          title: top.title,
          description: top.description || "",
          duration: top.duration || "45 mins",
          order: topIdx + 1
        }))
      };
    });
  }

  /**
   * Normalize any input module array to guaranteed object structures
   */
  _normalizeModules(courseId, rawModules) {
    return normalizeModulesList(courseId, rawModules);
  }

  /**
   * Persist an authored/edited syllabus for a newly published or updated course.
   * Ensures customized AI-generated curricula carry over directly into My Courses.
   * @param {string} courseId
   * @param {Array<Object>} rawModules
   * @returns {Promise<Array>} Normalized saved modules
   */
  async saveCourseSyllabus(courseId, rawModules) {
    if (!courseId) {
      throw new Error("Course ID is required to save syllabus.");
    }
    const store = this._loadStorage();
    const normalized = this._normalizeModules(courseId, rawModules);
    store[courseId] = normalized;
    this._saveStorage(store, courseId, normalized);
    return Promise.resolve(JSON.parse(JSON.stringify(normalized)));
  }

  /**
   * Fetch syllabus for a course.
   * Resolves from persistent storage, course.modules, or generated template.
   * @param {Object} course - The course record
   * @returns {Promise<Array>} List of modules with normalized topics
   */
  async getCourseSyllabus(course) {
    if (!course || !course.id) {
      return Promise.resolve([]);
    }

    const courseId = course.id;
    const store = this._loadStorage();

    if (store[courseId] && Array.isArray(store[courseId])) {
      return Promise.resolve(JSON.parse(JSON.stringify(store[courseId])));
    }

    let initialModules;
    if (course.modules && course.modules.length > 0) {
      initialModules = this._normalizeModules(courseId, course.modules);
    } else {
      initialModules = this._generateDefaultModules(course);
    }

    store[courseId] = initialModules;
    this._saveStorage(store, courseId, initialModules);

    return Promise.resolve(JSON.parse(JSON.stringify(initialModules)));
  }

  async _mutateStoredModules(courseId, mutator) {
    if (!courseId) {
      throw new Error("Course ID is required.");
    }
    const store = this._loadStorage();
    const modules = store[courseId];
    if (!modules) {
      throw new Error(`Syllabus for course ${courseId} not found.`);
    }

    const updatedModules = mutator(modules);
    store[courseId] = updatedModules;
    this._saveStorage(store, courseId, updatedModules);

    return Promise.resolve(JSON.parse(JSON.stringify(updatedModules)));
  }

  /**
   * Add a new module to a course syllabus
   */
  async addModule(courseId, moduleData) {
    if (!courseId) {
      throw new Error("Course ID is required.");
    }
    const store = this._loadStorage();
    const existingModules = Array.isArray(store[courseId]) ? store[courseId] : [];
    const updatedModules = addModuleToList(existingModules, courseId, moduleData);
    store[courseId] = updatedModules;
    this._saveStorage(store, courseId, updatedModules);
    return Promise.resolve(JSON.parse(JSON.stringify(updatedModules)));
  }

  /**
   * Update an existing syllabus module
   */
  async updateModule(courseId, moduleId, updatedFields) {
    if (!courseId || !moduleId) {
      throw new Error("Course ID and Module ID are required.");
    }
    return this._mutateStoredModules(courseId, (modules) =>
      updateModuleInList(modules, moduleId, updatedFields)
    );
  }

  /**
   * Delete a syllabus module (and its topics)
   */
  async deleteModule(courseId, moduleId) {
    if (!courseId || !moduleId) {
      throw new Error("Course ID and Module ID are required.");
    }
    return this._mutateStoredModules(courseId, (modules) =>
      deleteModuleFromList(modules, moduleId)
    );
  }

  /**
   * Reorder a module one slot up or down within a course syllabus
   */
  async reorderModule(courseId, moduleId, direction) {
    if (!courseId || !moduleId) {
      throw new Error("Course ID and Module ID are required.");
    }
    return this._mutateStoredModules(courseId, (modules) =>
      reorderModuleInList(modules, moduleId, direction)
    );
  }

  /**
   * Add a new topic to a specific module in a course
   * @param {string} courseId
   * @param {string} moduleId
   * @param {Object} topicData - { title, description, duration, order }
   * @returns {Promise<Array>} Updated modules
   */
  async addTopic(courseId, moduleId, topicData) {
    if (!courseId || !moduleId) {
      throw new Error("Course ID and Module ID are required.");
    }
    return this._mutateStoredModules(courseId, (modules) =>
      addTopicToModules(modules, moduleId, topicData)
    );
  }

  /**
   * Update an existing syllabus topic
   * @param {string} courseId
   * @param {string} moduleId
   * @param {string} topicId
   * @param {Object} updatedFields - { title, description, duration, order }
   * @returns {Promise<Array>} Updated modules
   */
  async updateTopic(courseId, moduleId, topicId, updatedFields) {
    if (!courseId || !moduleId || !topicId) {
      throw new Error("Course ID, Module ID, and Topic ID are required.");
    }
    return this._mutateStoredModules(courseId, (modules) =>
      updateTopicInModules(modules, moduleId, topicId, updatedFields)
    );
  }

  /**
   * Delete an existing syllabus topic
   * @param {string} courseId
   * @param {string} moduleId
   * @param {string} topicId
   * @returns {Promise<Array>} Updated modules
   */
  async deleteTopic(courseId, moduleId, topicId) {
    if (!courseId || !moduleId || !topicId) {
      throw new Error("Course ID, Module ID, and Topic ID are required.");
    }
    return this._mutateStoredModules(courseId, (modules) =>
      deleteTopicFromModules(modules, moduleId, topicId)
    );
  }

  /**
   * Reorder a topic up or down within a module
   * @param {string} courseId
   * @param {string} moduleId
   * @param {string} topicId
   * @param {"up"|"down"} direction
   * @returns {Promise<Array>} Updated modules
   */
  async reorderTopic(courseId, moduleId, topicId, direction) {
    if (!courseId || !moduleId || !topicId) {
      throw new Error("Course ID, Module ID, and Topic ID are required.");
    }
    return this._mutateStoredModules(courseId, (modules) =>
      reorderTopicInModules(modules, moduleId, topicId, direction)
    );
  }

  /**
   * Remove a course's stored syllabus cleanly when a course is permanently deleted.
   */
  async deleteCourseSyllabus(courseId) {
    if (!courseId) return;
    const store = this._loadStorage();
    delete store[courseId];
    this._saveStorage(store, null, null);
  }

  /**
   * Reset course syllabus back to defaults (useful for testing & resets)
   * @param {Object} course
   * @returns {Promise<Array>}
   */
  async resetCourseSyllabus(course) {
    if (!course || !course.id) return [];
    const store = this._loadStorage();
    delete store[course.id];
    this._saveStorage(store, null, null);
    return this.getCourseSyllabus(course);
  }
}

export const syllabusService = new SyllabusService();
export default syllabusService;
