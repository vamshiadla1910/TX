import { describe, it, beforeEach, after } from "node:test";
import assert from "node:assert";

import { curriculumDraftService } from "./services/curriculumDraftService.js";
import { syllabusService } from "../MyCourses/services/syllabusService.js";

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear()
  };
}

describe("AI Course Builder — Curriculum Specification Management", () => {
  const originalLocalStorage = globalThis.localStorage;
  const instructorId = "inst-ramana-1";

  beforeEach(() => {
    globalThis.localStorage = createMemoryStorage();
  });

  after(() => {
    if (originalLocalStorage === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = originalLocalStorage;
    }
  });

  it("generates normalized structured modules and topics for default agentic course", () => {
    const blueprint = curriculumDraftService.generateSyllabusBlueprint({
      topic: "Autonomous AI Agents & Multi-Agent Orchestration",
      category: "Artificial Intelligence & Systems",
      level: "Advanced"
    });

    assert.strictEqual(blueprint.title, "Autonomous AI Agents & Multi-Agent Orchestration");
    assert.strictEqual(blueprint.modules.length, 6);

    const firstModule = blueprint.modules[0];
    assert.strictEqual(firstModule.topics.length, 3);
    assert.ok(firstModule.topics[0].id);
    assert.ok(firstModule.topics[0].description);
    assert.ok(firstModule.topics[0].duration);
    assert.strictEqual(firstModule.topics[0].order, 1);
  });

  it("adds, edits, reorders, and deletes topics without regenerating AI syllabus", () => {
    const initial = curriculumDraftService.generateSyllabusBlueprint({
      topic: "Autonomous AI Agents & Multi-Agent Orchestration"
    });
    const targetModule = initial.modules[0];
    const untouchedModule2Title = initial.modules[1].title;

    // 1. Add topic at position 2
    const afterAdd = curriculumDraftService.addTopicToSyllabus(initial, targetModule.id, {
      title: "Agent Evaluation Harnesses",
      description: "Automated grading pipelines for agent trajectory verification.",
      duration: "50 mins",
      order: 2
    });
    const modAfterAdd = afterAdd.modules[0];
    assert.strictEqual(modAfterAdd.topics.length, 4);
    assert.strictEqual(modAfterAdd.topics[1].title, "Agent Evaluation Harnesses");
    assert.strictEqual(modAfterAdd.topics[1].order, 2);
    assert.strictEqual(modAfterAdd.topics[3].order, 4);
    assert.strictEqual(afterAdd.modules[1].title, untouchedModule2Title);

    // 2. Edit added topic and move it to position 1
    const addedTopic = modAfterAdd.topics[1];
    const afterEdit = curriculumDraftService.updateTopicInSyllabus(
      afterAdd,
      targetModule.id,
      addedTopic.id,
      {
        title: "Deterministic Agent Evaluation Suite",
        duration: "65 mins",
        order: 1
      }
    );
    const modAfterEdit = afterEdit.modules[0];
    assert.strictEqual(modAfterEdit.topics[0].id, addedTopic.id);
    assert.strictEqual(modAfterEdit.topics[0].title, "Deterministic Agent Evaluation Suite");
    assert.strictEqual(modAfterEdit.topics[0].duration, "65 mins");
    assert.strictEqual(modAfterEdit.topics[0].order, 1);

    // 3. Reorder first topic down and verify adjacent swap + re-index
    const afterReorder = curriculumDraftService.reorderTopicInSyllabus(
      afterEdit,
      targetModule.id,
      addedTopic.id,
      "down"
    );
    const modAfterReorder = afterReorder.modules[0];
    assert.strictEqual(modAfterReorder.topics[1].id, addedTopic.id);
    assert.strictEqual(modAfterReorder.topics[1].order, 2);

    // 4. Delete edited topic and ensure sequence order re-indexes cleanly 1..3
    const afterDelete = curriculumDraftService.deleteTopicFromSyllabus(
      afterReorder,
      targetModule.id,
      addedTopic.id
    );
    const modAfterDelete = afterDelete.modules[0];
    assert.strictEqual(modAfterDelete.topics.length, 3);
    assert.strictEqual(
      modAfterDelete.topics.some((t) => t.id === addedTopic.id),
      false
    );
    modAfterDelete.topics.forEach((t, idx) => {
      assert.strictEqual(t.order, idx + 1);
    });
  });

  it("supports staged Save Changes & Cancel draft revert across localStorage", () => {
    const initial = curriculumDraftService.generateSyllabusBlueprint({
      topic: "Autonomous AI Agents & Multi-Agent Orchestration"
    });
    const committed = curriculumDraftService.commitDraftChanges(initial, instructorId);
    const firstMod = committed.modules[0];

    const staged = curriculumDraftService.addTopicToSyllabus(committed, firstMod.id, {
      title: "Temporary Unsaved Topic",
      duration: "30 mins"
    });
    curriculumDraftService.saveWorkingDraft(staged, committed, instructorId);

    const loadedWorking = curriculumDraftService.loadDraftState(instructorId);
    assert.strictEqual(loadedWorking.hasUnsavedChanges, true);
    assert.strictEqual(loadedWorking.working.modules[0].topics.length, 4);

    // Cancel reverts back to committed 3 topics
    const reverted = curriculumDraftService.revertWorkingDraft(committed, instructorId);
    assert.strictEqual(reverted.modules[0].topics.length, 3);
    const loadedReverted = curriculumDraftService.loadDraftState(instructorId);
    assert.strictEqual(loadedReverted.hasUnsavedChanges, false);
    assert.strictEqual(loadedReverted.working.modules[0].topics.length, 3);
  });

  it("publishes edited curriculum directly into MyCourses syllabusService persistence", async () => {
    const initial = curriculumDraftService.generateSyllabusBlueprint({
      topic: "Autonomous AI Agents & Multi-Agent Orchestration"
    });
    const mod1 = initial.modules[0];
    const edited = curriculumDraftService.updateTopicInSyllabus(
      initial,
      mod1.id,
      mod1.topics[0].id,
      {
        title: "Custom Published Prompt Engineering Architecture",
        duration: "90 mins"
      }
    );

    const publishedCourse = await curriculumDraftService.publishCourseCurriculum(
      edited,
      instructorId
    );
    assert.ok(publishedCourse.id.startsWith("crs-ai-"));
    assert.strictEqual(publishedCourse.modulesCount, 6);

    // Opening in MyCourses syllabusService must preserve customized topic without regenerating defaults
    const myCoursesModules = await syllabusService.getCourseSyllabus(publishedCourse);
    assert.strictEqual(
      myCoursesModules[0].topics[0].title,
      "Custom Published Prompt Engineering Architecture"
    );
    assert.strictEqual(myCoursesModules[0].topics[0].duration, "90 mins");

    // Draft is cleared post-publish
    assert.strictEqual(curriculumDraftService.loadDraftState(instructorId), null);
  });
});
