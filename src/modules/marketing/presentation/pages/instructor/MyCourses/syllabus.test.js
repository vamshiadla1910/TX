import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

import { syllabusService } from "./services/syllabusService.js";
import { validateTopicInput } from "./validation/topicValidation.js";

describe("Instructor Course Syllabus & Topic Management Module", () => {
  const mockCourse = {
    id: "crs-test-1",
    code: "TEST-101",
    title: "Test Course Architecture",
    category: "Software Development",
    level: "Advanced",
    modulesCount: 2
  };

  beforeEach(async () => {
    await syllabusService.resetCourseSyllabus(mockCourse);
  });

  describe("Topic Input Validation Engine", () => {
    it("rejects empty or whitespace-only topic title", () => {
      const res1 = validateTopicInput({ title: "" });
      assert.strictEqual(res1.isValid, false);
      assert.ok(res1.errors.title);

      const res2 = validateTopicInput({ title: "   " });
      assert.strictEqual(res2.isValid, false);
      assert.ok(res2.errors.title);
    });

    it("rejects topic titles under 3 characters or over 150 characters", () => {
      const resShort = validateTopicInput({ title: "ab" });
      assert.strictEqual(resShort.isValid, false);
      assert.strictEqual(resShort.errors.title, "Topic title must be at least 3 characters.");

      const resLong = validateTopicInput({ title: "a".repeat(151) });
      assert.strictEqual(resLong.isValid, false);
      assert.strictEqual(resLong.errors.title, "Topic title cannot exceed 150 characters.");
    });

    it("rejects descriptions exceeding 600 characters", () => {
      const res = validateTopicInput({
        title: "Valid Title",
        description: "d".repeat(601)
      });
      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.description);
    });

    it("rejects invalid non-integer or negative order values", () => {
      const res = validateTopicInput({
        title: "Valid Title",
        order: -1
      });
      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.order);
    });

    it("approves valid topic input data", () => {
      const res = validateTopicInput({
        title: "Microservices Resiliency Patterns",
        description: "Hands-on implementation of circuit breakers and retries.",
        duration: "45 mins",
        order: 2,
        maxOrder: 5
      });
      assert.strictEqual(res.isValid, true);
      assert.deepStrictEqual(res.errors, {});
    });
  });

  describe("Syllabus Service Data Operations & Persistence", () => {
    it("loads and normalizes default modules and topics for a course", async () => {
      const modules = await syllabusService.getCourseSyllabus(mockCourse);
      assert.ok(Array.isArray(modules));
      assert.strictEqual(modules.length, 2);

      const firstMod = modules[0];
      assert.ok(firstMod.id);
      assert.ok(firstMod.title);
      assert.ok(Array.isArray(firstMod.topics));
      assert.ok(firstMod.topics.length > 0);

      const firstTopic = firstMod.topics[0];
      assert.ok(firstTopic.id);
      assert.ok(firstTopic.title);
      assert.ok(firstTopic.duration);
      assert.strictEqual(firstTopic.order, 1);
    });

    it("adds a new topic to a specific module", async () => {
      const initialModules = await syllabusService.getCourseSyllabus(mockCourse);
      const targetModule = initialModules[0];
      const initialTopicCount = targetModule.topics.length;

      const updatedModules = await syllabusService.addTopic(
        mockCourse.id,
        targetModule.id,
        {
          title: "New Automated Pipeline Topic",
          description: "Setting up GitHub Actions CI/CD workflows.",
          duration: "60 mins"
        }
      );

      const updatedModule = updatedModules.find((m) => m.id === targetModule.id);
      assert.strictEqual(updatedModule.topics.length, initialTopicCount + 1);

      const addedTopic = updatedModule.topics.find(
        (t) => t.title === "New Automated Pipeline Topic"
      );
      assert.ok(addedTopic, "Added topic must exist in the module");
      assert.strictEqual(addedTopic.description, "Setting up GitHub Actions CI/CD workflows.");
      assert.strictEqual(addedTopic.duration, "60 mins");
      assert.strictEqual(addedTopic.order, initialTopicCount + 1);

      // Verify persistent storage retrieval
      const reloadedModules = await syllabusService.getCourseSyllabus(mockCourse);
      const reloadedModule = reloadedModules.find((m) => m.id === targetModule.id);
      assert.strictEqual(reloadedModule.topics.length, initialTopicCount + 1);
    });

    it("edits an existing topic and saves changes immediately", async () => {
      const initialModules = await syllabusService.getCourseSyllabus(mockCourse);
      const targetModule = initialModules[0];
      const targetTopic = targetModule.topics[0];

      const updatedModules = await syllabusService.updateTopic(
        mockCourse.id,
        targetModule.id,
        targetTopic.id,
        {
          title: "Updated Topic Title: Advanced Reactive Streams",
          description: "Revised syllabus content for reactive microservices.",
          duration: "90 mins",
          order: 1
        }
      );

      const updatedModule = updatedModules.find((m) => m.id === targetModule.id);
      const updatedTopic = updatedModule.topics.find((t) => t.id === targetTopic.id);

      assert.strictEqual(updatedTopic.title, "Updated Topic Title: Advanced Reactive Streams");
      assert.strictEqual(updatedTopic.description, "Revised syllabus content for reactive microservices.");
      assert.strictEqual(updatedTopic.duration, "90 mins");

      // Verify persistence across reload
      const reloadedModules = await syllabusService.getCourseSyllabus(mockCourse);
      const reloadedTopic = reloadedModules[0].topics.find((t) => t.id === targetTopic.id);
      assert.strictEqual(reloadedTopic.title, "Updated Topic Title: Advanced Reactive Streams");
    });

    it("deletes a topic and re-indexes remaining topics sequence order", async () => {
      const initialModules = await syllabusService.getCourseSyllabus(mockCourse);
      const targetModule = initialModules[0];
      const initialCount = targetModule.topics.length;
      const topicToDelete = targetModule.topics[0];

      const updatedModules = await syllabusService.deleteTopic(
        mockCourse.id,
        targetModule.id,
        topicToDelete.id
      );

      const updatedModule = updatedModules.find((m) => m.id === targetModule.id);
      assert.strictEqual(updatedModule.topics.length, initialCount - 1);
      assert.strictEqual(
        updatedModule.topics.some((t) => t.id === topicToDelete.id),
        false,
        "Deleted topic must no longer exist"
      );

      // Verify sequence re-indexing
      updatedModule.topics.forEach((t, idx) => {
        assert.strictEqual(t.order, idx + 1);
      });

      // Verify persistence
      const reloaded = await syllabusService.getCourseSyllabus(mockCourse);
      assert.strictEqual(reloaded[0].topics.length, initialCount - 1);
    });
  });
});
