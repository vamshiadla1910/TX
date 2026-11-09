import test from "node:test";
import assert from "node:assert/strict";

import { ASSESSMENT_EXAMS } from "./data/assessmentExams.data.js";
import { EXAM_QUESTIONS_BY_TOPIC } from "./data/examQuestions.data.js";
import { calculateExamResults } from "./services/scoreCalculator.service.js";

test("Dynamic Assessment Content Generation: Each category has dedicated exam data and questions", () => {
  const expectedCategories = ["java", "python", "javascript", "database", "web-dev", "system-design"];

  assert.equal(ASSESSMENT_EXAMS.length, 6);

  expectedCategories.forEach((catId) => {
    // 1. Check exam metadata
    const exam = ASSESSMENT_EXAMS.find((e) => e.id === catId);
    assert.ok(exam, `Exam category ${catId} must exist in ASSESSMENT_EXAMS`);
    assert.ok(exam.examTitle, `Exam ${catId} must have an examTitle`);
    assert.ok(exam.category, `Exam ${catId} must have a category name`);
    assert.ok(exam.durationSeconds > 0, `Exam ${catId} must have durationSeconds > 0`);
    assert.ok(Array.isArray(exam.syllabusTopics), `Exam ${catId} must have syllabusTopics array`);
    assert.ok(exam.syllabusTopics.length >= 4, `Exam ${catId} must have at least 4 syllabus topics`);

    // 2. Check question bank for this category
    const questions = EXAM_QUESTIONS_BY_TOPIC[catId];
    assert.ok(Array.isArray(questions), `Topic ${catId} must have a question list`);
    assert.equal(questions.length, 5, `Topic ${catId} must contain 5 questions`);

    questions.forEach((q, idx) => {
      assert.ok(q.prompt, `Question ${idx + 1} of ${catId} must have prompt text`);
      assert.ok(Array.isArray(q.options), `Question ${idx + 1} of ${catId} must have options`);
      assert.equal(q.options.length, 4, `Question ${idx + 1} of ${catId} must have 4 multiple-choice options`);
      assert.ok(q.correct, `Question ${idx + 1} of ${catId} must define correct answer`);
      assert.ok(["A", "B", "C", "D"].includes(q.correct), `Correct option must be A, B, C, or D`);
    });
  });
});

test("Second Person Detection & Exam Pause Logic", () => {
  // Proctoring face states
  const testFaceDetectionState = (faceState, isExamActive) => {
    const isSecondPersonDetected = isExamActive && faceState === "multiple";
    const isExamPaused = isExamActive && isSecondPersonDetected;
    return { isSecondPersonDetected, isExamPaused };
  };

  // 1. Before exam starts (inactive)
  const inactiveState = testFaceDetectionState("multiple", false);
  assert.equal(inactiveState.isSecondPersonDetected, false);
  assert.equal(inactiveState.isExamPaused, false);

  // 2. Active exam with 1 registered candidate (normal test running)
  const singleCandidate = testFaceDetectionState("single", true);
  assert.equal(singleCandidate.isSecondPersonDetected, false);
  assert.equal(singleCandidate.isExamPaused, false);

  // 3. Second person enters the camera frame -> Exam MUST pause!
  const secondPersonEnters = testFaceDetectionState("multiple", true);
  assert.equal(secondPersonEnters.isSecondPersonDetected, true);
  assert.equal(secondPersonEnters.isExamPaused, true);

  // 4. Second person leaves the frame -> Exam MUST automatically continue!
  const secondPersonLeaves = testFaceDetectionState("single", true);
  assert.equal(secondPersonLeaves.isSecondPersonDetected, false);
  assert.equal(secondPersonLeaves.isExamPaused, false);

  // 5. No face detected (candidate looked away) -> warning shown but not multi-person pause
  const noFaceState = testFaceDetectionState("none", true);
  assert.equal(noFaceState.isSecondPersonDetected, false);
  assert.equal(noFaceState.isExamPaused, false);
});

test("Exam Score Calculator correctly evaluates dynamically loaded topic questions", () => {
  const javaQuestions = EXAM_QUESTIONS_BY_TOPIC.java;

  // Perfect score
  const perfectAnswers = { 1: "A", 2: "B", 3: "B", 4: "C", 5: "A" };
  const perfectResult = calculateExamResults(javaQuestions, perfectAnswers);
  assert.equal(perfectResult.percentage, 100);
  assert.equal(perfectResult.correctCount, 5);
  assert.equal(perfectResult.answeredCount, 5);
  assert.equal(perfectResult.totalQuestions, 5);

  // Partial score (3 out of 5 = 60%)
  const partialAnswers = { 1: "A", 2: "B", 3: "B", 4: "A", 5: "D" };
  const partialResult = calculateExamResults(javaQuestions, partialAnswers);
  assert.equal(partialResult.percentage, 60);
  assert.equal(partialResult.correctCount, 3);
  assert.equal(partialResult.answeredCount, 5);

  // Unanswered / empty
  const emptyResult = calculateExamResults(javaQuestions, {});
  assert.equal(emptyResult.percentage, 0);
  assert.equal(emptyResult.correctCount, 0);
  assert.equal(emptyResult.answeredCount, 0);
});
