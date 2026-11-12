/**
 * Curriculum Draft Service
 * Manages AI-generated curriculum blueprint creation, draft persistence in localStorage,
 * modular topic CRUD/reordering via shared topicOperations, and publishing directly
 * into MyCourses syllabusService so edited topics remain intact after publish.
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
  reorderTopicInModules,
  computeSyllabusMetrics
} from "../../MyCourses/utils/topicOperations.js";
import { courseService } from "../../MyCourses/services/courseService.js";
import { suggestCourseCode } from "../../MyCourses/validation/courseValidation.js";

const DRAFT_STORAGE_KEY = "tx_instructor_curriculum_draft_v1";

const DEFAULT_AGENTIC_TOPIC = "Autonomous AI Agents & Multi-Agent Orchestration";

function createDefaultAgenticModules(scopeId) {
  const raw = [
    {
      num: 1,
      title: "Foundations of Autonomous Agents & LLM Function Calling",
      duration: "8 hours",
      topics: [
        {
          title: "Prompt orchestration",
          duration: "60 mins",
          description: "Designing structured system prompts, role contracts, and deterministic output schemas."
        },
        {
          title: "Structured tool calling with JSON Schema",
          duration: "75 mins",
          description: "Binding external APIs and validation schemas cleanly to LLM tool invocations."
        },
        {
          title: "Memory systems (Short-term & Vector Store)",
          duration: "75 mins",
          description: "Combining conversation context buffers with semantic vector retrieval pipelines."
        }
      ]
    },
    {
      num: 2,
      title: "LangGraph & State Machine Agent Workflows",
      duration: "10 hours",
      topics: [
        {
          title: "Stateful graph topologies",
          duration: "60 mins",
          description: "Modeling execution nodes, shared state reducers, and deterministic edge transitions."
        },
        {
          title: "Cyclic execution loops",
          duration: "70 mins",
          description: "Implementing bounded retry cycles, critic reflections, and step termination checks."
        },
        {
          title: "Human-in-the-loop validation checkpoints",
          duration: "60 mins",
          description: "Pausing autonomous graphs cleanly for operator review and state resumption."
        }
      ]
    },
    {
      num: 3,
      title: "Multi-Agent Collaboration & Role Delegation",
      duration: "10 hours",
      topics: [
        {
          title: "Hierarchical supervisor architecture",
          duration: "60 mins",
          description: "Coordinating planner, executor, and verifier subagents under supervisor routing."
        },
        {
          title: "Peer-to-peer consensus",
          duration: "60 mins",
          description: "Building critique rounds and voting consensus across specialized domain agents."
        },
        {
          title: "Subagent task distribution",
          duration: "65 mins",
          description: "Parallelizing isolated research and synthesis tasks cleanly across agents."
        }
      ]
    },
    {
      num: 4,
      title: "Real-World Sandboxed Coding & Browser Automation",
      duration: "8 hours",
      topics: [
        {
          title: "Dockerized sandbox execution",
          duration: "60 mins",
          description: "Running untrusted generated code inside isolated containers with resource limits."
        },
        {
          title: "Playwright & Chrome DevTools Protocol",
          duration: "70 mins",
          description: "Automating authenticated DOM interactions, assertions, and screenshot verification."
        },
        {
          title: "Security sandboxing",
          duration: "55 mins",
          description: "Enforcing network allowlists, permission boundaries, and secret isolation."
        }
      ]
    },
    {
      num: 5,
      title: "Production Observability & Token Cost Optimization",
      duration: "8 hours",
      topics: [
        {
          title: "OpenTelemetry tracing",
          duration: "55 mins",
          description: "Instrumenting multi-step agent traces, latency spans, and tool failure diagnostics."
        },
        {
          title: "Latency mitigation & caching",
          duration: "60 mins",
          description: "Applying prompt prefix caching and tiered model routing for lower response times."
        },
        {
          title: "Rate limiting & failovers",
          duration: "50 mins",
          description: "Handling provider throttling gracefully with exponential backoff and fallbacks."
        }
      ]
    },
    {
      num: 6,
      title: "Capstone Project: Enterprise AI Coding Assistant",
      duration: "8 hours",
      topics: [
        {
          title: "End-to-end repository indexing",
          duration: "75 mins",
          description: "Building AST symbol graphs and incremental codebase retrieval indexes."
        },
        {
          title: "Automated unit test generation",
          duration: "75 mins",
          description: "Synthesizing targeted regression suites and verifying assertions in CI."
        },
        {
          title: "Pull request self-healing",
          duration: "90 mins",
          description: "Reading build logs automatically to repair failing checks before final review."
        }
      ]
    }
  ];

  return normalizeModulesList(scopeId, raw);
}

function createGenericModules(scopeId, topicTitle, category, level) {
  const cleanTitle = topicTitle || DEFAULT_AGENTIC_TOPIC;
  const raw = [
    {
      num: 1,
      title: `Foundations of ${cleanTitle}`,
      duration: "8 hours",
      topics: [
        {
          title: `Core architecture & mental models for ${cleanTitle}`,
          duration: "55 mins",
          description: `Establish ${level.toLowerCase()} foundations across ${category}.`
        },
        {
          title: "Tooling setup, standards & workspace configuration",
          duration: "60 mins",
          description: "Configure local development, linting, and reproducible test workflows."
        }
      ]
    },
    {
      num: 2,
      title: `Core Implementation Patterns in ${category}`,
      duration: "10 hours",
      topics: [
        {
          title: "Modular domain decomposition & clean boundaries",
          duration: "65 mins",
          description: "Design loosely coupled modules with strict interfaces."
        },
        {
          title: "State management, validation & error handling",
          duration: "60 mins",
          description: "Implement schema validation and resilient error recovery workflows."
        }
      ]
    },
    {
      num: 3,
      title: "Testing, Observability & Production Hardening",
      duration: "8 hours",
      topics: [
        {
          title: "Automated integration & contract testing",
          duration: "60 mins",
          description: "Verify component behavior under edge cases and regressions."
        },
        {
          title: "Deployment pipelines & runtime diagnostics",
          duration: "55 mins",
          description: "Configure release telemetry, alerts, and health verification."
        }
      ]
    },
    {
      num: 4,
      title: `Capstone: Production ${cleanTitle} System`,
      duration: "8 hours",
      topics: [
        {
          title: "End-to-end capstone build & review",
          duration: "90 mins",
          description: "Deliver a production-ready capstone evaluated against industry rubrics."
        }
      ]
    }
  ];

  return normalizeModulesList(scopeId, raw);
}

class CurriculumDraftService {
  _storageKeyFor(instructorId) {
    return `${DRAFT_STORAGE_KEY}:${instructorId || "default"}`;
  }

  _readEnvelope(instructorId) {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(this._storageKeyFor(instructorId));
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn("[CurriculumDraftService] Read draft error:", err);
    }
    return null;
  }

  _writeEnvelope(instructorId, envelope) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this._storageKeyFor(instructorId), JSON.stringify(envelope));
      }
    } catch (err) {
      console.warn("[CurriculumDraftService] Write draft error:", err);
    }
  }

  /**
   * Generate a structured AI syllabus outline tailored to the form specification.
   * Synchronous/pure builder wrapped easily for async UI simulation.
   */
  generateSyllabusBlueprint({
    topic = DEFAULT_AGENTIC_TOPIC,
    code = "",
    category = "Artificial Intelligence & Systems",
    level = "Advanced",
    targetAudience = "Software Engineers & Full Stack Developers",
    price = 19999,
    totalHours,
    description = "",
    status = "Published"
  } = {}) {
    const trimmedTopic = topic.trim() || DEFAULT_AGENTIC_TOPIC;
    const scopeId = `draft-${Date.now()}`;
    const isDefaultAgentic =
      trimmedTopic.toLowerCase().includes("autonomous ai agents") ||
      trimmedTopic.toLowerCase().includes("multi-agent");

    const modules = isDefaultAgentic
      ? createDefaultAgenticModules(scopeId)
      : createGenericModules(scopeId, trimmedTopic, category, level);

    const resolvedCode =
      (code && code.trim().toUpperCase()) ||
      (isDefaultAgentic ? "AGENT-AI" : suggestCourseCode(trimmedTopic, "CUSTOM-AI"));
    const estimatedHours = Number(totalHours) || (isDefaultAgentic ? 52 : 34);
    const { modulesCount, topicsCount } = computeSyllabusMetrics(modules);

    return {
      draftId: scopeId,
      title: trimmedTopic,
      code: resolvedCode,
      category,
      level,
      targetAudience,
      description:
        description.trim() ||
        `Comprehensive ${level.toLowerCase()} curriculum for ${trimmedTopic} designed for ${targetAudience}.`,
      price: Number(price ?? 19999),
      estimatedHours,
      totalHours: estimatedHours,
      status,
      generationMode: "ai",
      modulesCount,
      topicsCount,
      modules,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Create an initial manual course skeleton using the exact same unified schema.
   */
  createManualCourseBlueprint({
    title = "",
    code = "",
    category = "Software Development",
    level = "Intermediate",
    targetAudience = "Software Engineers & Technical Learners",
    price = 14999,
    totalHours = 40,
    description = "",
    status = "Draft"
  } = {}) {
    const cleanTitle = title.trim() || "New Course Track";
    const scopeId = `manual-${Date.now()}`;
    const resolvedCode =
      (code && code.trim().toUpperCase()) || suggestCourseCode(cleanTitle, "NEW-101");
    const modules = normalizeModulesList(scopeId, [
      {
        num: 1,
        title: `Module 1: Introduction to ${cleanTitle}`,
        duration: "8 hours",
        description: "Foundational concepts, setup, and core architecture.",
        topics: [
          {
            title: `Overview & Core Concepts of ${cleanTitle}`,
            duration: "45 mins",
            description: "Key fundamentals, tooling setup, and learning objectives."
          }
        ]
      }
    ]);
    const { modulesCount, topicsCount } = computeSyllabusMetrics(modules);

    return {
      draftId: scopeId,
      title: cleanTitle,
      code: resolvedCode,
      category,
      level,
      targetAudience,
      description: description.trim(),
      price: Number(price ?? 14999),
      estimatedHours: Number(totalHours) || 40,
      totalHours: Number(totalHours) || 40,
      status,
      generationMode: "manual",
      modulesCount,
      topicsCount,
      modules,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Load persisted working and committed draft snapshots for an instructor.
   */
  loadDraftState(instructorId) {
    const envelope = this._readEnvelope(instructorId);
    if (!envelope || !envelope.committed) {
      return null;
    }
    return {
      committed: envelope.committed,
      working: envelope.working || envelope.committed,
      hasUnsavedChanges: Boolean(envelope.hasUnsavedChanges)
    };
  }

  /**
   * Save working staged changes without overwriting committed snapshot until user clicks Save Changes.
   */
  saveWorkingDraft(workingSyllabus, committedSyllabus, instructorId) {
    const payload = {
      committed: committedSyllabus || workingSyllabus,
      working: workingSyllabus,
      hasUnsavedChanges: true
    };
    this._writeEnvelope(instructorId, payload);
    return payload;
  }

  /**
   * Commit all curriculum edits persistently as the saved draft baseline.
   */
  commitDraftChanges(syllabus, instructorId) {
    const cleanCopy = {
      ...syllabus,
      modulesCount: Array.isArray(syllabus?.modules) ? syllabus.modules.length : 0,
      updatedAt: new Date().toISOString()
    };
    const payload = {
      committed: cleanCopy,
      working: cleanCopy,
      hasUnsavedChanges: false
    };
    this._writeEnvelope(instructorId, payload);
    return cleanCopy;
  }

  /**
   * Revert working edits back to the last committed snapshot.
   */
  revertWorkingDraft(committedSyllabus, instructorId) {
    const restored = JSON.parse(JSON.stringify(committedSyllabus));
    this._writeEnvelope(instructorId, {
      committed: restored,
      working: restored,
      hasUnsavedChanges: false
    });
    return restored;
  }

  /**
   * Clear persisted draft for an instructor (e.g., after publishing or test teardown).
   */
  clearDraft(instructorId) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(this._storageKeyFor(instructorId));
      }
    } catch (err) {
      console.warn("[CurriculumDraftService] Clear draft error:", err);
    }
  }

  _withUpdatedModules(syllabus, updatedModules) {
    const { modulesCount, topicsCount } = computeSyllabusMetrics(updatedModules);
    return {
      ...syllabus,
      modulesCount,
      topicsCount,
      modules: updatedModules,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Update draft course metadata fields (title, code, category, level, price, description, etc.)
   */
  updateCourseMetadata(syllabus, updatedFields) {
    if (!syllabus) return null;
    return {
      ...syllabus,
      ...updatedFields,
      title: updatedFields?.title !== undefined ? updatedFields.title.trim() : syllabus.title,
      code:
        updatedFields?.code !== undefined
          ? String(updatedFields.code).trim().toUpperCase()
          : syllabus.code,
      totalHours:
        updatedFields?.totalHours !== undefined
          ? Number(updatedFields.totalHours)
          : syllabus.totalHours || syllabus.estimatedHours,
      estimatedHours:
        updatedFields?.totalHours !== undefined
          ? Number(updatedFields.totalHours)
          : syllabus.estimatedHours || syllabus.totalHours,
      price:
        updatedFields?.price !== undefined ? Number(updatedFields.price) : syllabus.price ?? 19999,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Immutable module CRUD & reorder methods delegating to shared topicOperations.js.
   */
  addModuleToSyllabus(syllabus, moduleData) {
    const scopeId = syllabus?.draftId || "draft";
    const updatedModules = addModuleToList(syllabus.modules, scopeId, moduleData);
    return this._withUpdatedModules(syllabus, updatedModules);
  }

  updateModuleInSyllabus(syllabus, moduleId, updatedFields) {
    const updatedModules = updateModuleInList(syllabus.modules, moduleId, updatedFields);
    return this._withUpdatedModules(syllabus, updatedModules);
  }

  deleteModuleFromSyllabus(syllabus, moduleId) {
    const updatedModules = deleteModuleFromList(syllabus.modules, moduleId);
    return this._withUpdatedModules(syllabus, updatedModules);
  }

  reorderModuleInSyllabus(syllabus, moduleId, direction) {
    const updatedModules = reorderModuleInList(syllabus.modules, moduleId, direction);
    return this._withUpdatedModules(syllabus, updatedModules);
  }

  /**
   * Immutable topic mutation methods delegating to shared topicOperations.js.
   */
  addTopicToSyllabus(syllabus, moduleId, topicData) {
    const updatedModules = addTopicToModules(syllabus.modules, moduleId, topicData);
    return this._withUpdatedModules(syllabus, updatedModules);
  }

  updateTopicInSyllabus(syllabus, moduleId, topicId, updatedFields) {
    const updatedModules = updateTopicInModules(
      syllabus.modules,
      moduleId,
      topicId,
      updatedFields
    );
    return this._withUpdatedModules(syllabus, updatedModules);
  }

  deleteTopicFromSyllabus(syllabus, moduleId, topicId) {
    const updatedModules = deleteTopicFromModules(syllabus.modules, moduleId, topicId);
    return this._withUpdatedModules(syllabus, updatedModules);
  }

  reorderTopicInSyllabus(syllabus, moduleId, topicId, direction) {
    const updatedModules = reorderTopicInModules(
      syllabus.modules,
      moduleId,
      topicId,
      direction
    );
    return this._withUpdatedModules(syllabus, updatedModules);
  }

  /**
   * Publish draft curriculum (AI-generated or manual) through unified courseService + syllabusService
   * so created courses immediately persist in My Courses with identical management capabilities.
   */
  async publishCourseCurriculum(syllabus, instructorId) {
    if (!syllabus || !Array.isArray(syllabus.modules)) {
      throw new Error("Generate or build a course curriculum before publishing.");
    }

    const modePrefix = syllabus.generationMode === "manual" ? "crs-inst" : "crs-ai";
    const courseId = syllabus.existingCourseId || `${modePrefix}-${Date.now()}`;

    const courseInput = {
      id: courseId,
      title: syllabus.title || DEFAULT_AGENTIC_TOPIC,
      code: syllabus.code || suggestCourseCode(syllabus.title, "AGENT-AI"),
      category: syllabus.category || "Artificial Intelligence & Systems",
      level: syllabus.level || "Advanced",
      description: syllabus.description || "",
      targetAudience: syllabus.targetAudience || "Software Engineers & Full Stack Developers",
      status: syllabus.status || "Published",
      totalHours: Number(syllabus.totalHours || syllabus.estimatedHours) || 52,
      price: Number(syllabus.price ?? 19999),
      generationMode: syllabus.generationMode || "ai"
    };

    const { course } = await courseService.createCourse(
      courseInput,
      syllabus.modules,
      instructorId
    );

    this.clearDraft(instructorId);
    return course;
  }
}

export const curriculumDraftService = new CurriculumDraftService();
export default curriculumDraftService;
