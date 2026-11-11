import React, { useState, useEffect, useCallback } from "react";
import "./Assessments.css";

// Modular Domain Datasets
import { ASSESSMENT_EXAMS } from "./data/assessmentExams.data";
import { EXAM_QUESTIONS_BY_TOPIC } from "./data/examQuestions.data";
import { PRACTICE_QUESTIONS_BY_COURSE } from "./data/practiceQuestions.data";

// Modular Services & Hooks
import { calculateExamResults } from "./services/scoreCalculator.service";
import { useProctoring } from "./hooks/useProctoring";

// Modular Presentation Views
import PortalSelectView from "./components/PortalSelect/PortalSelectView";
import PracticeCatalogView from "./components/PracticeMode/PracticeCatalogView";
import PracticeActiveSessionView from "./components/PracticeMode/PracticeActiveSessionView";
import PracticeResultView from "./components/PracticeMode/PracticeResultView";
import OfficialExamCatalogView from "./components/TopicExams/OfficialExamCatalogView";
import ActiveExamSessionView from "./components/ActiveExam/ActiveExamSessionView";
import ExamCompletedPopup from "./components/CompletedPopup/ExamCompletedPopup";

export default function Assessments({ onBack, onExamActiveChange }) {
  // Navigation View: "portal_select" | "practice_catalog" | "practice_active" | "exam_catalog"
  const [assessmentView, setAssessmentView] = useState("portal_select");

  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Instructions Modal State (Shown when clicking "View Exam" on any topic)
  const [instructionExam, setInstructionExam] = useState(null);

  // Exam Workflow Lifecycle: "start" -> "active" -> "completed"
  const [examStage, setExamStage] = useState("start");
  const [activeExam, setActiveExam] = useState(ASSESSMENT_EXAMS[0]);
  const [completedExams, setCompletedExams] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(352);
  const [submissionReason, setSubmissionReason] = useState("");

  // Question & Navigation States (Official Exam)
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});

  // Practice Mode State
  const [activePracticeCourse, setActivePracticeCourse] = useState(null);
  const [practiceQIndex, setPracticeQIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [showPracticeResult, setShowPracticeResult] = useState(false);

  // Proctoring Hardware & AI Detection Hook
  const isExamActive = examStage === "active";
  const {
    cameraActive,
    cameraStarting,
    cameraError,
    micActive,
    audioLevel,
    faceDetectionState,
    faceConfidence,
    simulatedMode,
    setSimulatedMode,
    warningMessage,
    setWarningMessage,
    videoRef,
    canvasRef,
    overlayCanvasRef,
    startCameraAndMic,
    stopCameraAndMic,
    forceSingleCandidateResume
  } = useProctoring(isExamActive);

  // Second Person Detection & Auto-Pause Logic
  const isSecondPersonDetected = isExamActive && faceDetectionState === "multiple";
  const isExamPaused = isExamActive && isSecondPersonDetected;

  // Active topic questions based dynamically on active exam category
  const activeQuestions =
    EXAM_QUESTIONS_BY_TOPIC[activeExam?.id] || EXAM_QUESTIONS_BY_TOPIC.java;
  const currentQuestion =
    activeQuestions[currentQIndex] || activeQuestions[0];
  const currentDurationSec = activeExam?.durationSeconds || 352;
  const timeSpentSeconds = Math.max(1, currentDurationSec - secondsRemaining);
  const currentAnsweredCount = activeQuestions.filter((q) =>
    Boolean(selectedAnswers[q.id])
  ).length;

  // Submit Exam Handler -> stops camera & audio, exits fullscreen, opens completed popup
  const handleSubmitAssessment = useCallback(
    (reason = "manual") => {
      stopCameraAndMic();

      // Exit browser fullscreen
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch (err) {
        console.warn("Fullscreen exit error:", err);
      }

      // Notify parent to restore dashboard layout
      onExamActiveChange?.(false);

      const timeUsed = Math.max(1, (activeExam?.durationSeconds || 352) - secondsRemaining);
      const mins = Math.floor(timeUsed / 60);
      const secs = timeUsed % 60;
      const formattedTimeTaken = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

      const examQuestions =
        EXAM_QUESTIONS_BY_TOPIC[activeExam?.id] || EXAM_QUESTIONS_BY_TOPIC.java;
      const results = calculateExamResults(examQuestions, selectedAnswers);

      if (activeExam) {
        setCompletedExams((prev) => ({
          ...prev,
          [activeExam.id]: {
            percentage: results.percentage,
            answeredCount: results.answeredCount,
            correctCount: results.correctCount,
            totalQuestions: results.totalQuestions,
            timeTaken: formattedTimeTaken,
            submissionType:
              reason === "timeout" ? "Auto-Submitted (Timer 00:00)" : "Manual Submission",
            completedAt: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            cameraStatus: "Stopped & Disconnected",
            examStatus: "Completed & Verified"
          }
        }));
      }

      setSubmissionReason(reason);
      setWarningMessage("");
      setExamStage("completed");
    },
    [stopCameraAndMic, onExamActiveChange, activeExam, secondsRemaining, selectedAnswers, setWarningMessage]
  );

  // Countdown Timer (Freezes/Pauses whenever a second person is detected)
  useEffect(() => {
    if (!isExamActive || isExamPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamActive, isExamPaused]);

  // Auto-submit on 00:00 (only if not paused)
  useEffect(() => {
    if (isExamActive && !isExamPaused && secondsRemaining === 0) {
      handleSubmitAssessment("timeout");
    }
  }, [secondsRemaining, isExamActive, isExamPaused, handleSubmitAssessment]);

  // Anti-cheat navigation lock (prevent accidental exit, tab close, back button, and ESC during active exam)
  useEffect(() => {
    if (!isExamActive) return;

    // Push state and trap browser back navigation
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      setWarningMessage("⚠️ Navigation is locked during the official exam. You cannot use the back button until the exam ends.");
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Exam attempt in progress. Leaving will forfeit your answers.";
      return e.returnValue;
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.code === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setWarningMessage("⚠️ ESC key is disabled. Fullscreen mode is strictly required during the exam.");
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isExamActive, setWarningMessage]);

  const [isFsBlocked, setIsFsBlocked] = useState(false);

  // Monitor fullscreen exit during active exam and force immediate re-entry lock overlay
  useEffect(() => {
    if (!isExamActive) {
      setIsFsBlocked(false);
      return;
    }

    const checkFs = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      if (!isFs) {
        setIsFsBlocked(true);
        setWarningMessage("⚠️ Fullscreen required! Escape is disabled. Re-enter full screen to continue.");
      } else {
        setIsFsBlocked(false);
      }
    };

    document.addEventListener("fullscreenchange", checkFs);
    document.addEventListener("webkitfullscreenchange", checkFs);
    document.addEventListener("mozfullscreenchange", checkFs);
    document.addEventListener("MSFullscreenChange", checkFs);

    return () => {
      document.removeEventListener("fullscreenchange", checkFs);
      document.removeEventListener("webkitfullscreenchange", checkFs);
      document.removeEventListener("mozfullscreenchange", checkFs);
      document.removeEventListener("MSFullscreenChange", checkFs);
    };
  }, [isExamActive, setWarningMessage]);

  const handleReEnterFullscreen = () => {
    try {
      const el = document.documentElement;
      const requestMethod =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;

      if (requestMethod) {
        requestMethod.call(el).then(() => {
          setIsFsBlocked(false);
          if (navigator.keyboard && navigator.keyboard.lock) {
            navigator.keyboard.lock(["Escape"]).catch(() => {});
          }
        }).catch(() => {});
      }
    } catch (err) {
      console.warn("Re-enter fullscreen error:", err);
    }
  };

  // Step 1: Click "View Exam" -> Open Instructions Modal
  const handleOpenInstructions = (exam) => {
    const chosenExam = exam || ASSESSMENT_EXAMS[0];
    setInstructionExam(chosenExam);
  };

  // Step 2: Click "Start Exam" in Instructions Modal -> Fullscreen + Remove Sidebar + Start Exam
  const handleStartExam = (exam) => {
    const chosenExam = exam || instructionExam || ASSESSMENT_EXAMS[0];
    setInstructionExam(null);
    setActiveExam(chosenExam);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setSubmissionReason("");
    setSecondsRemaining(chosenExam.durationSeconds || 352);
    setWarningMessage("");
    setExamStage("active");

    // Inform Dashboard to hide sidebar and header
    onExamActiveChange?.(true);

    // Request browser Fullscreen and lock keyboard escape if supported
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(() => {
          if (navigator.keyboard && navigator.keyboard.lock) {
            navigator.keyboard.lock(["Escape"]).catch(() => {});
          }
        }).catch(() => {});
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request error:", err);
    }
  };

  // Step 3 -> Step 1: Done Button from Completed Popup
  const handleDoneExam = () => {
    stopCameraAndMic();
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (err) {}
    onExamActiveChange?.(false);
    setSubmissionReason("");
    setWarningMessage("");
    setExamStage("start");
  };

  // Option selection (disabled when exam is paused)
  const handleSelectOption = (optId) => {
    if (!isExamActive || isExamPaused) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optId
    }));
  };

  // Toggle flag
  const handleToggleFlag = () => {
    if (!isExamActive || isExamPaused) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  // Navigation Next / Previous
  const handleNext = () => {
    if (isExamPaused) return;
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (isExamPaused) return;
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  // -------------------------------------------------------------------------
  // PRACTICE MODE HANDLERS (Completely free, no proctoring, no security)
  // -------------------------------------------------------------------------
  const handleStartPracticeCourse = (course) => {
    setActivePracticeCourse(course);
    setPracticeQIndex(0);
    setPracticeAnswers({});
    setShowPracticeResult(false);
    setAssessmentView("practice_active");
  };

  const handleSelectPracticeOption = (questionId, optId) => {
    setPracticeAnswers((prev) => ({
      ...prev,
      [questionId]: optId
    }));
  };

  // =========================================================================
  // VIEW 1: PORTAL SELECTION (Two Distinct Blocks: Practice vs Official Proctored Exam)
  // =========================================================================
  if (assessmentView === "portal_select") {
    return (
      <PortalSelectView
        onSelectMode={(mode) => setAssessmentView(mode)}
        onBack={onBack}
      />
    );
  }

  // =========================================================================
  // VIEW 2A: PRACTICE CATALOG (List of courses for practice mode)
  // =========================================================================
  if (assessmentView === "practice_catalog") {
    return (
      <PracticeCatalogView
        exams={ASSESSMENT_EXAMS}
        onSelectCourse={handleStartPracticeCourse}
        onBack={() => setAssessmentView("portal_select")}
      />
    );
  }

  // =========================================================================
  // VIEW 2B: ACTIVE PRACTICE SESSION (Choose correct answers, 4 marks, Free Back)
  // =========================================================================
  if (assessmentView === "practice_active" && activePracticeCourse) {
    const questions = PRACTICE_QUESTIONS_BY_COURSE[activePracticeCourse.id] || PRACTICE_QUESTIONS_BY_COURSE.java;
    const currentQ = questions[practiceQIndex] || questions[0];
    const selectedOpt = practiceAnswers[currentQ.id];
    const totalAnswered = Object.keys(practiceAnswers).length;

    // Results calculation
    const correctCount = questions.filter((q) => practiceAnswers[q.id] === q.correct).length;
    const totalMarks = questions.length * 4;
    const scoredMarks = correctCount * 4;
    const percentage = Math.round((scoredMarks / totalMarks) * 100);

    if (showPracticeResult) {
      return (
        <PracticeResultView
          activePracticeCourse={activePracticeCourse}
          scoredMarks={scoredMarks}
          totalMarks={totalMarks}
          percentage={percentage}
          correctCount={correctCount}
          totalAnswered={totalAnswered}
          questions={questions}
          practiceAnswers={practiceAnswers}
          onRetake={() => {
            setPracticeAnswers({});
            setPracticeQIndex(0);
            setShowPracticeResult(false);
          }}
          onBackToCourses={() => setAssessmentView("practice_catalog")}
        />
      );
    }

    return (
      <PracticeActiveSessionView
        activePracticeCourse={activePracticeCourse}
        questions={questions}
        practiceQIndex={practiceQIndex}
        practiceAnswers={practiceAnswers}
        selectedOpt={selectedOpt}
        totalAnswered={totalAnswered}
        onSelectIndex={setPracticeQIndex}
        onSelectOption={handleSelectPracticeOption}
        onPrevious={() => setPracticeQIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setPracticeQIndex((prev) => prev + 1)}
        onFinish={() => setShowPracticeResult(true)}
        onBackToCourses={() => setAssessmentView("practice_catalog")}
      />
    );
  }

  // =========================================================================
  // VIEW 3: OFFICIAL PROCTORED EXAMS CATALOG (Stage 1)
  // =========================================================================
  if (examStage === "start") {
    return (
      <OfficialExamCatalogView
        exams={ASSESSMENT_EXAMS}
        completedExams={completedExams}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        instructionExam={instructionExam}
        onOpenInstructions={handleOpenInstructions}
        onCloseInstructions={() => setInstructionExam(null)}
        onStartExam={handleStartExam}
        onBackToPortal={() => setAssessmentView("portal_select")}
      />
    );
  }

  // =========================================================================
  // VIEW 4: EXAM COMPLETED POPUP
  // =========================================================================
  if (examStage === "completed") {
    const latestComp = completedExams[activeExam?.id];

    return (
      <ExamCompletedPopup
        activeExam={activeExam}
        latestComp={latestComp}
        submissionReason={submissionReason}
        timeSpentSeconds={timeSpentSeconds}
        activeQuestions={activeQuestions}
        onDone={handleDoneExam}
      />
    );
  }

  // =========================================================================
  // VIEW 5: ACTIVE PROCTORED EXAM (Dedicated Fullscreen, No Sidebar, Camera AI)
  // =========================================================================
  return (
    <ActiveExamSessionView
      isFsBlocked={isFsBlocked}
      onReEnterFullscreen={handleReEnterFullscreen}
      isSecondPersonDetected={isSecondPersonDetected}
      faceConfidence={faceConfidence}
      forceSingleCandidateResume={forceSingleCandidateResume}
      activeExam={activeExam}
      activeQuestions={activeQuestions}
      currentAnsweredCount={currentAnsweredCount}
      secondsRemaining={secondsRemaining}
      isExamPaused={isExamPaused}
      onSubmitAssessment={handleSubmitAssessment}
      warningMessage={warningMessage}
      currentQIndex={currentQIndex}
      currentQuestion={currentQuestion}
      selectedAnswers={selectedAnswers}
      flaggedQuestions={flaggedQuestions}
      onSelectOption={handleSelectOption}
      onToggleFlag={handleToggleFlag}
      onSelectQuestionIndex={setCurrentQIndex}
      onPrevious={handlePrevious}
      onNext={handleNext}
      cameraActive={cameraActive}
      cameraStarting={cameraStarting}
      cameraError={cameraError}
      micActive={micActive}
      audioLevel={audioLevel}
      faceDetectionState={faceDetectionState}
      simulatedMode={simulatedMode}
      setSimulatedMode={setSimulatedMode}
      videoRef={videoRef}
      canvasRef={canvasRef}
      overlayCanvasRef={overlayCanvasRef}
      startCameraAndMic={startCameraAndMic}
    />
  );
}
