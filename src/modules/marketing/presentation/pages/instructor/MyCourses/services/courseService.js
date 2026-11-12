/**
 * Course Management Service
 * Unified persistent CRUD & retention layer for both manually authored and AI-generated courses.
 * Stores course records in localStorage (`tx_instructor_courses_v1`) with REST API-ready
 * async methods and enforces instructor authorization & student enrollment retention rules.
 */

import { initialInstructorCourses } from "../../data/mockData.js";
import { validateCourseInput, suggestCourseCode } from "../validation/courseValidation.js";
import { computeSyllabusMetrics } from "../utils/topicOperations.js";
import { syllabusService } from "./syllabusService.js";

const COURSES_STORAGE_KEY = "tx_instructor_courses_v1";

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatShortDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

class CourseService {
  constructor() {
    this._memoryStore = null;
    this._apiEndpoint = null; // Future REST API: "/api/v1/instructor/courses"
  }

  /**
   * Verify instructor authorization before performing course mutations.
   * Accepts an instructor profile object or string ID.
   * @param {Object|string} instructorIdentity
   * @returns {string}
   */
  verifyInstructorAuthorization(instructorIdentity) {
    if (typeof localStorage !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const userRole = (localStorage.getItem("userRole") || "").trim().toLowerCase();
      if (isLoggedIn === "true" && userRole && userRole !== "instructor") {
        throw new Error(
          "Forbidden: Instructor authorization is required to manage courses."
        );
      }
    }

    const instructorId =
      typeof instructorIdentity === "string"
        ? instructorIdentity.trim()
        : instructorIdentity?.id ||
          (typeof localStorage !== "undefined" ? localStorage.getItem("instructorId") : null) ||
          "inst-ramana-1";

    if (!instructorId) {
      throw new Error("Unauthorized: Valid instructor identity is required.");
    }

    return instructorId;
  }

  _normalizeCourseRecord(course, defaultInstructorId = "inst-ramana-1") {
    const modulesCount = Number(course?.modulesCount) || 4;
    return {
      ...course,
      id: course.id || `crs-inst-${Date.now()}`,
      instructorId: course.instructorId || defaultInstructorId,
      code: String(course.code || suggestCourseCode(course.title)).toUpperCase(),
      title: course.title || "Untitled Course",
      category: course.category || "Software Development",
      level: course.level || "Intermediate",
      description:
        course.description ||
        `Structured instructor-led curriculum covering ${course.title || "core topics"}.`,
      targetAudience: course.targetAudience || "Software Engineers & Technical Learners",
      generationMode: course.generationMode || (String(course.id || "").startsWith("crs-ai-") ? "ai" : "manual"),
      status: course.status || "Draft",
      enrolledLearners: Number(course.enrolledLearners) || 0,
      completionRate: Number(course.completionRate) || 0,
      rating: Number(course.rating) || 4.9,
      reviewsCount: Number(course.reviewsCount) || 0,
      modulesCount,
      topicsCount: Number(course.topicsCount) || modulesCount * 3,
      totalHours: Number(course.totalHours) || 40,
      price: Number(course.price ?? 14999),
      revenue: Number(course.revenue) || 0,
      lastUpdated: course.lastUpdated || formatShortDate()
    };
  }

  _loadCoursesStore(instructorId = "inst-ramana-1") {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(COURSES_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const normalized = parsed.map((c) => this._normalizeCourseRecord(c, instructorId));
            this._memoryStore = normalized;
            return normalized;
          }
        }
      }
    } catch (err) {
      console.warn("[CourseService] Storage read warning:", err);
    }

    if (Array.isArray(this._memoryStore)) {
      return cloneData(this._memoryStore);
    }

    const seeded = initialInstructorCourses.map((c) =>
      this._normalizeCourseRecord(c, instructorId)
    );
    this._saveCoursesStore(seeded);
    return cloneData(seeded);
  }

  _saveCoursesStore(courses) {
    const clean = cloneData(courses || []);
    this._memoryStore = clean;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(clean));
      }
    } catch (err) {
      console.warn("[CourseService] Storage write warning:", err);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("tx_instructor_courses_updated", {
          detail: { courses: clean }
        })
      );
    }
  }

  /**
   * Retrieve all courses managed by the authenticated instructor.
   */
  async getCourses(instructorIdentity) {
    const instructorId = this.verifyInstructorAuthorization(instructorIdentity);
    const all = this._loadCoursesStore(instructorId);
    return Promise.resolve(
      cloneData(all.filter((c) => !c.instructorId || c.instructorId === instructorId))
    );
  }

  /**
   * Create and persist a new course (either manual or AI-generated) alongside its syllabus.
   */
  async createCourse(courseInput, rawModules = [], instructorIdentity) {
    const instructorId = this.verifyInstructorAuthorization(instructorIdentity);

    const validation = validateCourseInput(courseInput);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] || "Invalid course details.";
      const err = new Error(firstError);
      err.fieldErrors = validation.errors;
      throw err;
    }

    const generationMode = courseInput.generationMode === "ai" ? "ai" : "manual";
    const courseId =
      courseInput.id ||
      `${generationMode === "ai" ? "crs-ai" : "crs-inst"}-${Date.now()}`;

    const seedModules =
      Array.isArray(rawModules) && rawModules.length > 0
        ? rawModules
        : [
            {
              num: 1,
              title: `Foundations of ${courseInput.title.trim()}`,
              duration: "8 hours",
              description: "Introductory module covering core concepts and environment setup.",
              topics: []
            }
          ];

    const savedModules = await syllabusService.saveCourseSyllabus(courseId, seedModules);
    const { modulesCount, topicsCount } = computeSyllabusMetrics(savedModules);

    const nowIso = new Date().toISOString();
    const newCourse = this._normalizeCourseRecord(
      {
        id: courseId,
        instructorId,
        code: String(courseInput.code || suggestCourseCode(courseInput.title)).trim().toUpperCase(),
        title: courseInput.title.trim(),
        category: courseInput.category.trim(),
        level: courseInput.level.trim(),
        description: (courseInput.description || "").trim(),
        targetAudience: (courseInput.targetAudience || "").trim(),
        generationMode,
        status: courseInput.status || "Published",
        enrolledLearners: 0,
        completionRate: 0,
        rating: 5.0,
        reviewsCount: 0,
        modulesCount,
        topicsCount,
        totalHours: Number(courseInput.totalHours) || Math.max(8, modulesCount * 6),
        price: Number(courseInput.price ?? 14999),
        revenue: 0,
        lastUpdated: "Just now",
        thumbnailTone: generationMode === "ai" ? "purple" : "blue",
        createdAt: nowIso,
        updatedAt: nowIso,
        modules: savedModules
      },
      instructorId
    );

    const existing = this._loadCoursesStore(instructorId);
    const updatedList = [newCourse, ...existing.filter((c) => c.id !== courseId)];
    this._saveCoursesStore(updatedList);

    return Promise.resolve({
      course: cloneData(newCourse),
      courses: cloneData(updatedList)
    });
  }

  /**
   * Update an existing course's metadata cleanly and persist immediately.
   */
  async updateCourse(courseId, updatedFields, instructorIdentity) {
    const instructorId = this.verifyInstructorAuthorization(instructorIdentity);
    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    const existing = this._loadCoursesStore(instructorId);
    const targetIdx = existing.findIndex((c) => c.id === courseId);
    if (targetIdx === -1) {
      throw new Error(`Course ${courseId} not found.`);
    }

    const current = existing[targetIdx];
    const mergedCandidate = {
      ...current,
      ...updatedFields,
      title: updatedFields?.title !== undefined ? updatedFields.title : current.title,
      code: updatedFields?.code !== undefined ? updatedFields.code : current.code,
      category: updatedFields?.category !== undefined ? updatedFields.category : current.category,
      level: updatedFields?.level !== undefined ? updatedFields.level : current.level
    };

    const validation = validateCourseInput(mergedCandidate);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] || "Invalid course metadata.";
      const err = new Error(firstError);
      err.fieldErrors = validation.errors;
      throw err;
    }

    const updatedCourse = {
      ...current,
      ...updatedFields,
      title: mergedCandidate.title.trim(),
      code: String(mergedCandidate.code).trim().toUpperCase(),
      category: mergedCandidate.category.trim(),
      level: mergedCandidate.level.trim(),
      description:
        updatedFields?.description !== undefined
          ? updatedFields.description.trim()
          : current.description,
      targetAudience:
        updatedFields?.targetAudience !== undefined
          ? updatedFields.targetAudience.trim()
          : current.targetAudience,
      price:
        updatedFields?.price !== undefined
          ? Number(updatedFields.price)
          : current.price,
      totalHours:
        updatedFields?.totalHours !== undefined
          ? Number(updatedFields.totalHours)
          : current.totalHours,
      lastUpdated: "Just now",
      updatedAt: new Date().toISOString()
    };

    const nextList = [...existing];
    nextList[targetIdx] = updatedCourse;
    this._saveCoursesStore(nextList);

    return Promise.resolve({
      course: cloneData(updatedCourse),
      courses: cloneData(nextList)
    });
  }

  /**
   * Synchronize a course's module/topic counters immediately when syllabus changes occur.
   */
  async syncCourseSyllabusSummary(courseId, modules, instructorIdentity) {
    const instructorId = this.verifyInstructorAuthorization(instructorIdentity);
    if (!courseId || !Array.isArray(modules)) return null;

    const existing = this._loadCoursesStore(instructorId);
    const targetIdx = existing.findIndex((c) => c.id === courseId);
    if (targetIdx === -1) return null;

    const { modulesCount, topicsCount } = computeSyllabusMetrics(modules);
    const updatedCourse = {
      ...existing[targetIdx],
      modulesCount,
      topicsCount,
      modules: cloneData(modules),
      lastUpdated: "Just now",
      updatedAt: new Date().toISOString()
    };

    const nextList = [...existing];
    nextList[targetIdx] = updatedCourse;
    this._saveCoursesStore(nextList);

    return Promise.resolve({
      course: cloneData(updatedCourse),
      courses: cloneData(nextList)
    });
  }

  /**
   * Inspect student enrollment and cohort relationships before course deletion.
   * Enforces data-retention rules: courses with enrolled learners or active cohorts
   * must be archived/deactivated rather than permanently destroyed.
   */
  checkCourseEnrollmentImpact(course, { learners = [], batches = [] } = {}) {
    if (!course) {
      return {
        enrolledLearners: 0,
        linkedLearnersCount: 0,
        linkedBatchesCount: 0,
        studentPortalEnrolled: false,
        hasEnrolledStudents: false,
        requiresArchive: false
      };
    }

    const courseEnrolledCount = Number(course.enrolledLearners) || 0;
    const normalizedCode = String(course.code || "").trim().toLowerCase();
    const normalizedId = String(course.id || "").trim().toLowerCase();

    const linkedLearnersCount = Array.isArray(learners)
      ? learners.filter(
          (l) =>
            String(l.courseId || "").toLowerCase() === normalizedId ||
            String(l.courseName || "").toLowerCase() === String(course.title || "").toLowerCase()
        ).length
      : 0;

    const linkedBatchesCount = Array.isArray(batches)
      ? batches.filter(
          (b) =>
            String(b.courseId || "").toLowerCase() === normalizedId ||
            String(b.courseName || "").toLowerCase() === String(course.title || "").toLowerCase()
        ).length
      : 0;

    let studentPortalEnrolled = false;
    try {
      if (typeof localStorage !== "undefined") {
        const enrolledRaw = localStorage.getItem("enrolledCourses");
        if (enrolledRaw) {
          const parsed = JSON.parse(enrolledRaw);
          if (Array.isArray(parsed)) {
            studentPortalEnrolled = parsed.some((item) => {
              const idMatch = String(item.courseId || item.id || "").toLowerCase() === normalizedId;
              const codeMatch =
                normalizedCode &&
                String(item.courseCode || item.code || "").toLowerCase() === normalizedCode;
              return idMatch || codeMatch;
            });
          }
        }
      }
    } catch {
      studentPortalEnrolled = false;
    }

    const hasEnrolledStudents =
      courseEnrolledCount > 0 || linkedLearnersCount > 0 || studentPortalEnrolled;

    return {
      enrolledLearners: courseEnrolledCount,
      linkedLearnersCount,
      linkedBatchesCount,
      studentPortalEnrolled,
      hasEnrolledStudents,
      requiresArchive: hasEnrolledStudents || linkedBatchesCount > 0
    };
  }

  /**
   * Archive / deactivate a course while preserving student enrollments and history.
   */
  async archiveCourse(courseId, instructorIdentity) {
    const instructorId = this.verifyInstructorAuthorization(instructorIdentity);
    const existing = this._loadCoursesStore(instructorId);
    const targetIdx = existing.findIndex((c) => c.id === courseId);
    if (targetIdx === -1) {
      throw new Error(`Course ${courseId} not found.`);
    }

    const current = existing[targetIdx];
    const archivedCourse = {
      ...current,
      previousStatus: current.status !== "Archived" ? current.status : current.previousStatus || "Draft",
      status: "Archived",
      archivedAt: new Date().toISOString(),
      lastUpdated: "Archived just now",
      updatedAt: new Date().toISOString()
    };

    const nextList = [...existing];
    nextList[targetIdx] = archivedCourse;
    this._saveCoursesStore(nextList);

    return Promise.resolve({
      action: "archived",
      course: cloneData(archivedCourse),
      courses: cloneData(nextList)
    });
  }

  /**
   * Restore an archived course back to its previous active status (or Draft).
   */
  async restoreCourse(courseId, instructorIdentity) {
    const instructorId = this.verifyInstructorAuthorization(instructorIdentity);
    const existing = this._loadCoursesStore(instructorId);
    const targetIdx = existing.findIndex((c) => c.id === courseId);
    if (targetIdx === -1) {
      throw new Error(`Course ${courseId} not found.`);
    }

    const current = existing[targetIdx];
    const restoredCourse = {
      ...current,
      status: current.previousStatus && current.previousStatus !== "Archived"
        ? current.previousStatus
        : "Draft",
      archivedAt: null,
      lastUpdated: "Restored just now",
      updatedAt: new Date().toISOString()
    };
    delete restoredCourse.previousStatus;

    const nextList = [...existing];
    nextList[targetIdx] = restoredCourse;
    this._saveCoursesStore(nextList);

    return Promise.resolve({
      action: "restored",
      course: cloneData(restoredCourse),
      courses: cloneData(nextList)
    });
  }

  /**
   * Delete or archive a course according to enrollment retention policy.
   * If students are enrolled or linked cohort history exists, archives instead of hard-deleting.
   * If zero students are enrolled (and `forceArchive` is false), permanently removes course + syllabus.
   */
  async deleteOrArchiveCourse(
    courseId,
    { forceArchive = false, learners = [], batches = [], instructorIdentity } = {}
  ) {
    const instructorId = this.verifyInstructorAuthorization(instructorIdentity);
    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    const existing = this._loadCoursesStore(instructorId);
    const targetCourse = existing.find((c) => c.id === courseId);
    if (!targetCourse) {
      throw new Error(`Course ${courseId} not found.`);
    }

    const impact = this.checkCourseEnrollmentImpact(targetCourse, { learners, batches });
    if (impact.requiresArchive || forceArchive) {
      const archiveResult = await this.archiveCourse(courseId, instructorId);
      return {
        ...archiveResult,
        impact
      };
    }

    const nextList = existing.filter((c) => c.id !== courseId);
    this._saveCoursesStore(nextList);
    await syllabusService.deleteCourseSyllabus(courseId);

    return Promise.resolve({
      action: "deleted",
      deletedCourseId: courseId,
      course: cloneData(targetCourse),
      courses: cloneData(nextList),
      impact
    });
  }

  /**
   * Clear persisted courses storage/cache (for isolated test suites).
   */
  resetCourses() {
    this._memoryStore = null;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(COURSES_STORAGE_KEY);
      }
    } catch (err) {
      console.warn("[CourseService] Reset error:", err);
    }
  }
}

export const courseService = new CourseService();
export default courseService;
