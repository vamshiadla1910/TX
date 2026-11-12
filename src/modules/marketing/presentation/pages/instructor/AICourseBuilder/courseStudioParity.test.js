import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { curriculumDraftService } from "./services/curriculumDraftService.js";
import { courseService } from "../MyCourses/services/courseService.js";
import { syllabusService } from "../MyCourses/services/syllabusService.js";

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

describe("Course Studio — Unified AI & Manual Module CRUD and My Courses Parity", () => {
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

  it("supports complete Module CRUD (Add, Edit, Reorder, Delete) and Course Metadata editing inside Course Builder", () => {
    const blueprint = curriculumDraftService.createManualCourseBlueprint({
      title: "Platform Security Engineering",
      category: "Cybersecurity",
      level: "Advanced",
      price: 21000,
      totalHours: 36,
      status: "Draft"
    });
    assert.equal(blueprint.generationMode, "manual");
    assert.equal(blueprint.modules.length, 1);

    const updatedMeta = curriculumDraftService.updateCourseMetadata(blueprint, {
      title: "Enterprise Platform Security",
      code: "SEC-401",
      price: 24999
    });
    assert.equal(updatedMeta.title, "Enterprise Platform Security");
    assert.equal(updatedMeta.code, "SEC-401");
    assert.equal(updatedMeta.price, 24999);
    assert.equal(updatedMeta.modules.length, 1);

    const withSecondModule = curriculumDraftService.addModuleToSyllabus(updatedMeta, {
      title: "Zero Trust Networking",
      duration: "9 hours",
      description: "Service mesh mTLS and policy enforcement."
    });
    assert.equal(withSecondModule.modules.length, 2);
    assert.equal(withSecondModule.modules[1].num, 2);

    const targetModId = withSecondModule.modules[1].id;
    const editedModule = curriculumDraftService.updateModuleInSyllabus(
      withSecondModule,
      targetModId,
      { title: "Zero Trust & Service Mesh Security" }
    );
    assert.equal(editedModule.modules[1].title, "Zero Trust & Service Mesh Security");

    const reordered = curriculumDraftService.reorderModuleInSyllabus(
      editedModule,
      targetModId,
      "up"
    );
    assert.equal(reordered.modules[0].id, targetModId);
    assert.equal(reordered.modules[0].num, 1);
    assert.equal(reordered.modules[1].num, 2);

    const afterDelete = curriculumDraftService.deleteModuleFromSyllabus(reordered, targetModId);
    assert.equal(afterDelete.modules.length, 1);
    assert.equal(afterDelete.modules[0].num, 1);
  });

  it("publishes both AI and Manual courses to My Courses store with identical edit & delete parity", async () => {
    const aiBlueprint = curriculumDraftService.generateSyllabusBlueprint({
      topic: "Agentic RAG Systems",
      code: "RAG-501",
      level: "Advanced",
      category: "Artificial Intelligence & Systems"
    });
    const modifiedAI = curriculumDraftService.addModuleToSyllabus(aiBlueprint, {
      title: "Evaluation & Guardrails",
      duration: "7 hours"
    });
    const publishedAI = await curriculumDraftService.publishCourseCurriculum(
      modifiedAI,
      "inst-ramana-1"
    );

    const manualBlueprint = curriculumDraftService.createManualCourseBlueprint({
      title: "TypeScript Compiler Internals",
      code: "TS-400",
      level: "Advanced",
      category: "Software Development"
    });
    const publishedManual = await curriculumDraftService.publishCourseCurriculum(
      manualBlueprint,
      "inst-ramana-1"
    );

    const allCourses = await courseService.getCourses("inst-ramana-1");
    assert.ok(allCourses.some((c) => c.id === publishedAI.id && c.generationMode === "ai"));
    assert.ok(
      allCourses.some((c) => c.id === publishedManual.id && c.generationMode === "manual")
    );

    // Both courses support syllabusService module CRUD and retention-checked deletion seamlessly
    const aiModules = await syllabusService.getCourseSyllabus(publishedAI);
    assert.equal(aiModules.length, aiBlueprint.modules.length + 1);
    assert.ok(aiModules.some((m) => m.title === "Evaluation & Guardrails"));

    const delAI = await courseService.deleteOrArchiveCourse(publishedAI.id, {
      instructorIdentity: "inst-ramana-1"
    });
    assert.equal(delAI.action, "deleted");

    const delManual = await courseService.deleteOrArchiveCourse(publishedManual.id, {
      instructorIdentity: "inst-ramana-1"
    });
    assert.equal(delManual.action, "deleted");
  });
});
