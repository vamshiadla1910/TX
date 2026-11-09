import React, { useState, useEffect, useCallback } from "react";
import "./Assessments.css";

// Modular Domain Datasets
import { ASSESSMENT_EXAMS } from "./data/assessmentExams.data";
import { EXAM_QUESTIONS_BY_TOPIC } from "./data/examQuestions.data";

// Modular Services & Hooks
import { calculateExamResults } from "./services/scoreCalculator.service";
import { useProctoring } from "./hooks/useProctoring";

// Modular Presentation Components
import TopicExamCard from "./components/TopicExams/TopicExamCard";
import TopicProgressWidgets from "./components/TopicExams/TopicProgressWidgets";
import ActiveExamHeader from "./components/ActiveExam/ActiveExamHeader";
import QuestionCard from "./components/ActiveExam/QuestionCard";
import ProctoringFeed from "./components/ActiveExam/ProctoringFeed";
import ExamCompletedPopup from "./components/CompletedPopup/ExamCompletedPopup";
import ExamInstructionsModal from "./components/InstructionsModal/ExamInstructionsModal";
import SecondPersonWarningModal from "./components/ActiveExam/SecondPersonWarningModal";

export default function Assessments({ onBack, onExamActiveChange }) {
  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Instructions Modal State (Shown when clicking "View Exam" on any topic)
  const [instructionExam, setInstructionExam] = useState(null);

  // Question & Navigation States
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});

  // Exam Workflow Lifecycle: "start" -> "active" -> "completed" -> "start"
  const [examStage, setExamStage] = useState("start");
  const [activeExam, setActiveExam] = useState(ASSESSMENT_EXAMS[0]);
  const [completedExams, setCompletedExams] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(352);
  const [submissionReason, setSubmissionReason] = useState("");

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

  // Anti-cheat navigation lock (prevent accidental exit or tab close during active exam)
  useEffect(() => {
    if (!isExamActive) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Exam attempt in progress. Leaving will forfeit your answers.";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isExamActive]);

  // Monitor fullscreen exit during active exam
  useEffect(() => {
    if (!isExamActive) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isExamActive) {
        setWarningMessage("⚠️ Fullscreen is mandatory! Please keep fullscreen enabled during exam.");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isExamActive, setWarningMessage]);

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

    // Request browser Fullscreen
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
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

  // =========================================================================
  // STAGE 1: TOPIC-WISE EXAMS UI (Percentage shown ONLY after completing exam)
  // =========================================================================
  if (examStage === "start") {
    const completedExamList = Object.values(completedExams);
    const completedSessionCount = completedExamList.length;
    const totalCompletedCount = completedSessionCount;
    const overallPercent =
      completedSessionCount > 0
        ? Math.round(
            completedExamList.reduce((acc, item) => acc + (item.percentage || 0), 0) /
              completedSessionCount
          )
        : 0;

    const filteredExams =
      selectedCategory === "all"
        ? ASSESSMENT_EXAMS
        : ASSESSMENT_EXAMS.filter(
            (e) =>
              e.id === selectedCategory ||
              e.category?.toLowerCase() === selectedCategory.toLowerCase()
          );

    return (
      <div className="topic-exams-page">
        {/* Instructions Popup Modal with "Start Exam" and "Back" buttons */}
        {instructionExam && (
          <ExamInstructionsModal
            exam={instructionExam}
            onStartExam={handleStartExam}
            onClose={() => setInstructionExam(null)}
          />
        )}

        <div className="topic-exams-content-grid">
          {/* Left Column: Topic Exam Cards List */}
          <div className="topic-exams-main-col">
            {/* Hero Banner */}
            <div className="topic-hero-banner">
              <div className="topic-hero-text">
                <div className="topic-breadcrumb" onClick={onBack}>
                  <span>Dashboard</span>
                  <span>›</span>
                  <span>Assessments</span>
                </div>
                <h1 className="topic-hero-title">Topic-wise Proctored Assessments</h1>
                <p className="topic-hero-subtitle">
                  Demonstrate domain mastery with AI-proctored skill evaluations. Complete assessments to earn verified blockchain credentials.
                </p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="topic-filter-pills">
              {[
                { id: "all", label: "All Topics" },
                { id: "java", label: "Java" },
                { id: "python", label: "Python" },
                { id: "javascript", label: "JavaScript" },
                { id: "database", label: "Database" },
                { id: "web-dev", label: "Web Dev" },
                { id: "system-design", label: "System Design" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`topic-filter-pill ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="topic-cards-list">
              {filteredExams.map((exam) => (
                <TopicExamCard
                  key={exam.id}
                  exam={exam}
                  compData={completedExams[exam.id]}
                  onStartExam={handleOpenInstructions}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Progress & Stats Widgets */}
          <TopicProgressWidgets
            totalCompletedCount={totalCompletedCount}
            totalExamsCount={ASSESSMENT_EXAMS.length}
            overallPercent={overallPercent}
            recommendedExam={ASSESSMENT_EXAMS[0]}
            onStartExam={handleOpenInstructions}
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // STAGE 3: EXAM COMPLETED POPUP
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
  // STAGE 2: ACTIVE PROCTORED EXAM (Dedicated Fullscreen, No Sidebar, Camera AI)
  // =========================================================================
  return (
    <div className="proctored-assessment-wrapper">
      {/* Second Person Warning Modal — Pauses Exam when second person is detected */}
      {isSecondPersonDetected && (
        <SecondPersonWarningModal
          faceConfidence={faceConfidence}
          onResume={forceSingleCandidateResume}
        />
      )}

      <main className="assessment-center-area">
        {/* Active Header: No exit/back option midway through exam */}
        <ActiveExamHeader
          activeExam={activeExam}
          activeQuestions={activeQuestions}
          currentAnsweredCount={currentAnsweredCount}
          secondsRemaining={secondsRemaining}
          isExamPaused={isExamPaused}
          onSubmit={handleSubmitAssessment}
        />

        {/* Warning incident alert banner (Single face alert, tab switch, etc.) */}
        {warningMessage && !isSecondPersonDetected && (
          <div className="proctoring-incident-alert incident-warning">
            <span>{warningMessage}</span>
            <span style={{ fontSize: "11px", opacity: 0.85 }}>Live Monitored</span>
          </div>
        )}

        {/* Main Question Card — Input locked while paused */}
        <QuestionCard
          activeQuestions={activeQuestions}
          currentQIndex={currentQIndex}
          currentQuestion={currentQuestion}
          selectedAnswers={selectedAnswers}
          flaggedQuestions={flaggedQuestions}
          currentAnsweredCount={currentAnsweredCount}
          isExamPaused={isExamPaused}
          onSelectOption={handleSelectOption}
          onToggleFlag={handleToggleFlag}
          onSelectQuestionIndex={setCurrentQIndex}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmitAssessment}
        />
      </main>

      {/* Right Proctoring Panel */}
      <ProctoringFeed
        cameraActive={cameraActive}
        cameraStarting={cameraStarting}
        cameraError={cameraError}
        micActive={micActive}
        audioLevel={audioLevel}
        faceDetectionState={faceDetectionState}
        faceConfidence={faceConfidence}
        simulatedMode={simulatedMode}
        setSimulatedMode={setSimulatedMode}
        videoRef={videoRef}
        canvasRef={canvasRef}
        overlayCanvasRef={overlayCanvasRef}
        onRetryCamera={startCameraAndMic}
      />
    </div>
  );
}
