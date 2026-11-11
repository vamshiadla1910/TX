import React from "react";
import { ShieldCheck } from "lucide-react";
import ActiveExamHeader from "./ActiveExamHeader";
import QuestionCard from "./QuestionCard";
import ProctoringFeed from "./ProctoringFeed";
import SecondPersonWarningModal from "./SecondPersonWarningModal";
import "./ActiveExamSessionView.css";

export default function ActiveExamSessionView({
  isFsBlocked,
  onReEnterFullscreen,
  isSecondPersonDetected,
  faceConfidence,
  forceSingleCandidateResume,
  activeExam,
  activeQuestions,
  currentAnsweredCount,
  secondsRemaining,
  isExamPaused,
  onSubmitAssessment,
  warningMessage,
  currentQIndex,
  currentQuestion,
  selectedAnswers,
  flaggedQuestions,
  onSelectOption,
  onToggleFlag,
  onSelectQuestionIndex,
  onPrevious,
  onNext,
  cameraActive,
  cameraStarting,
  cameraError,
  micActive,
  audioLevel,
  faceDetectionState,
  simulatedMode,
  setSimulatedMode,
  videoRef,
  canvasRef,
  overlayCanvasRef,
  startCameraAndMic
}) {
  return (
    <div className="proctored-assessment-wrapper">
      {/* Fullscreen Recovery Lock Overlay */}
      {isFsBlocked && (
        <div className="fs-recovery-overlay">
          <div className="fs-recovery-icon-circle">
            <ShieldCheck size={36} color="#ffffff" />
          </div>
          <h2 className="fs-recovery-title">
            Can't EXIT from Exam
          </h2>
          <p className="fs-recovery-text">
            Escape and exiting fullscreen are disabled during the official exam. You cannot exit until the exam timer ends or you click Submit.
          </p>
          <button
            type="button"
            onClick={onReEnterFullscreen}
            className="btn-reenter-fullscreen"
          >
            Re-enter exam
          </button>
        </div>
      )}

      {/* Second Person Warning Modal */}
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
          onSubmit={onSubmitAssessment}
        />

        {/* Warning incident alert banner */}
        {warningMessage && !isSecondPersonDetected && (
          <div className="proctoring-incident-alert incident-warning">
            <span>{warningMessage}</span>
            <span style={{ fontSize: "11px", opacity: 0.85 }}>Live Monitored</span>
          </div>
        )}

        {/* Main Question Card */}
        <QuestionCard
          activeQuestions={activeQuestions}
          currentQIndex={currentQIndex}
          currentQuestion={currentQuestion}
          selectedAnswers={selectedAnswers}
          flaggedQuestions={flaggedQuestions}
          currentAnsweredCount={currentAnsweredCount}
          isExamPaused={isExamPaused}
          onSelectOption={onSelectOption}
          onToggleFlag={onToggleFlag}
          onSelectQuestionIndex={onSelectQuestionIndex}
          onPrevious={onPrevious}
          onNext={onNext}
          onSubmit={onSubmitAssessment}
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
