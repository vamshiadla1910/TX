import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { validateModuleInput } from "./validation/topicValidation.js";
import { validateCourseInput, suggestCourseCode } from "./validation/courseValidation.js";
import { syllabusService } from "./services/syllabusService.js";
import { courseService } from "./services/courseService.js";

function installMockLocalStorage() {
  const store = new Map();
  const original = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
  return () => {
    if (original === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = original;
    }
  };
}

describe("My Courses — Module & Course Validation", () => {
  it("validates module titles, positive integer order, and length limits", () => {
    const empty = validateModuleInput({ title: "   ", order: 1 });
    assert.equal(empty.isValid, false);
    assert.ok(empty.errors.title);

    const badOrder = validateModuleInput({ title: "Distributed Consensus", order: 0 });
    assert.equal(badOrder.isValid, false);
    assert.ok(badOrder.errors.order);

    const valid = validateModuleInput({
      title: "Distributed Systems & Consensus",
      duration: "10 hours",
      description: "Raft, Paxos, and replicated logs.",
      order: 2,
      maxOrder: 5
    });
    assert.equal(valid.isValid, true);
    assert.deepEqual(valid.errors, {});
  });

  it("validates course metadata inputs and generates readable course codes", () => {
    assert.equal(suggestCourseCode("Distributed Cloud Architecture"), "DIST-CLOU");

    const invalid = validateCourseInput({
      title: "AI",
      code: "bad code!",
      category: "",
      level: "Intermediate",
      price: -50,
      totalHours: 0
    });
    assert.equal(invalid.isValid, false);
    assert.ok(invalid.errors.title);
    assert.ok(invalid.errors.code);
    assert.ok(invalid.errors.category);
    assert.ok(invalid.errors.price);
    assert.ok(invalid.errors.totalHours);

    const valid = validateCourseInput({
      title: "Full Stack Microservices Architecture",
      code: "MICRO-201",
      category: "Software Development",
      level: "Advanced",
      price: 18999,
      totalHours: 48
    });
    assert.equal(valid.isValid, true);
  });
});

describe("My Courses — Syllabus Module CRUD & Topic Reordering", () => {
  let restoreStorage;

  beforeEach(() => {
    restoreStorage = installMockLocalStorage();
    syllabusService._memoryStore = {};
  });

  afterEach(() => {
    restoreStorage();
  });

  it("adds, edits, reorders, and deletes syllabus modules while keeping numbering sequential", async () => {
    const course = { id: "crs-mod-test", title: "Cloud Native Engineering" };
    const initial = await syllabusService.getCourseSyllabus(course);
    assert.ok(initial.length >= 2);

    const afterAdd = await syllabusService.addModule(course.id, {
      title: "Kubernetes Operators & CRDs",
      duration: "9 hours",
      description: "Custom controllers in Go."
    });
    assert.equal(afterAdd.length, initial.length + 1);
    const addedMod = afterAdd[afterAdd.length - 1];
    assert.equal(addedMod.num, afterAdd.length);
    assert.equal(addedMod.title, "Kubernetes Operators & CRDs");

    const afterEdit = await syllabusService.updateModule(course.id, addedMod.id, {
      title: "Kubernetes Operators & Controllers",
      duration: "11 hours"
    });
    const edited = afterEdit.find((m) => m.id === addedMod.id);
    assert.equal(edited.title, "Kubernetes Operators & Controllers");
    assert.equal(edited.duration, "11 hours");

    // Reorder added module up one slot
    const afterReorder = await syllabusService.reorderModule(course.id, addedMod.id, "up");
    const newIdx = afterReorder.findIndex((m) => m.id === addedMod.id);
    assert.equal(newIdx, afterReorder.length - 2);
    afterReorder.forEach((mod, i) => assert.equal(mod.num, i + 1));

    // Delete module & confirm topics inside are removed and remaining modules renumbered
    await syllabusService.addTopic(course.id, addedMod.id, {
      title: "Reconciliation Loops",
      duration: "50 mins"
    });
    const afterDelete = await syllabusService.deleteModule(course.id, addedMod.id);
    assert.equal(afterDelete.length, initial.length);
    assert.equal(afterDelete.some((m) => m.id === addedMod.id), false);
    afterDelete.forEach((mod, i) => assert.equal(mod.num, i + 1));
  });

  it("reorders topics within a module and renumbers their order field", async () => {
    const courseId = "crs-topic-reorder";
    const seeded = await syllabusService.saveCourseSyllabus(courseId, [
      {
        num: 1,
        title: "Core Module",
        duration: "6 hours",
        topics: [
          { title: "Topic Alpha", duration: "30 mins" },
          { title: "Topic Beta", duration: "40 mins" }
        ]
      }
    ]);
    const mod = seeded[0];
    const secondTopic = mod.topics[1];

    const updated = await syllabusService.reorderTopic(courseId, mod.id, secondTopic.id, "up");
    assert.equal(updated[0].topics[0].title, "Topic Beta");
    assert.equal(updated[0].topics[0].order, 1);
    assert.equal(updated[0].topics[1].title, "Topic Alpha");
    assert.equal(updated[0].topics[1].order, 2);
  });
});

describe("My Courses — Course CRUD, Sync & Enrollment Retention Rules", () => {
  let restoreStorage;

  beforeEach(() => {
    restoreStorage = installMockLocalStorage();
    syllabusService._memoryStore = {};
    courseService.resetCourses();
  });

  afterEach(() => {
    courseService.resetCourses();
    restoreStorage();
  });

  it("enforces instructor authorization checks before course mutations", () => {
    globalThis.localStorage.setItem("isLoggedIn", "true");
    globalThis.localStorage.setItem("userRole", "student");

    assert.throws(
      () => courseService.verifyInstructorAuthorization("inst-ramana-1"),
      /Forbidden: Instructor authorization is required/
    );

    globalThis.localStorage.setItem("userRole", "instructor");
    assert.equal(courseService.verifyInstructorAuthorization("inst-ramana-1"), "inst-ramana-1");
  });

  it("creates, updates, syncs syllabus metrics, and permanently deletes courses with 0 enrolled students", async () => {
    const { course } = await courseService.createCourse(
      {
        title: "Manual Event-Driven Systems",
        code: "EVT-101",
        category: "System Design",
        level: "Intermediate",
        price: 12999,
        totalHours: 32,
        generationMode: "manual",
        status: "Published"
      },
      [
        {
          num: 1,
          title: "Event Sourcing Fundamentals",
          duration: "8 hours",
          topics: [{ title: "CQRS Architecture", duration: "60 mins" }]
        }
      ],
      "inst-ramana-1"
    );

    assert.equal(course.generationMode, "manual");
    assert.equal(course.modulesCount, 1);
    assert.equal(course.topicsCount, 1);

    // Update metadata & verify cache-cleared reload persistence
    await courseService.updateCourse(
      course.id,
      { title: "Event-Driven Microservices", price: 15999 },
      "inst-ramana-1"
    );
    courseService._memoryStore = null;
    const reloaded = await courseService.getCourses("inst-ramana-1");
    const match = reloaded.find((c) => c.id === course.id);
    assert.equal(match.title, "Event-Driven Microservices");
    assert.equal(match.price, 15999);

    // Sync syllabus additions directly onto course summary metrics
    const nextModules = await syllabusService.addModule(course.id, {
      title: "Kafka Streams & Sagas",
      duration: "10 hours"
    });
    const syncRes = await courseService.syncCourseSyllabusSummary(
      course.id,
      nextModules,
      "inst-ramana-1"
    );
    assert.equal(syncRes.course.modulesCount, 2);

    // Permanent deletion allowed when 0 learners enrolled
    const deleteRes = await courseService.deleteOrArchiveCourse(course.id, {
      instructorIdentity: "inst-ramana-1"
    });
    assert.equal(deleteRes.action, "deleted");
    assert.equal(deleteRes.courses.some((c) => c.id === course.id), false);

    // Verify syllabus storage was cleaned up as well
    syllabusService._memoryStore = {};
    const rawSyllabi = JSON.parse(
      globalThis.localStorage.getItem("tx_instructor_course_syllabus_v1") || "{}"
    );
    assert.equal(rawSyllabi[course.id], undefined);
  });

  it("archives instead of deleting when students are enrolled or linked in localStorage, and supports restore", async () => {
    const { course } = await courseService.createCourse(
      {
        title: "Production Go Services",
        code: "GO-301",
        category: "Software Development",
        level: "Advanced",
        status: "Published"
      },
      [],
      "inst-ramana-1"
    );

    // Simulate student enrollment via student portal localStorage
    globalThis.localStorage.setItem(
      "enrolledCourses",
      JSON.stringify([{ courseId: course.id, courseCode: course.code }])
    );

    const impact = courseService.checkCourseEnrollmentImpact(course);
    assert.equal(impact.studentPortalEnrolled, true);
    assert.equal(impact.requiresArchive, true);

    const archiveRes = await courseService.deleteOrArchiveCourse(course.id, {
      instructorIdentity: "inst-ramana-1"
    });
    assert.equal(archiveRes.action, "archived");
    assert.equal(archiveRes.course.status, "Archived");
    assert.ok(archiveRes.courses.some((c) => c.id === course.id));

    const restoreRes = await courseService.restoreCourse(course.id, "inst-ramana-1");
    assert.equal(restoreRes.action, "restored");
    assert.equal(restoreRes.course.status, "Published");
  });
});
