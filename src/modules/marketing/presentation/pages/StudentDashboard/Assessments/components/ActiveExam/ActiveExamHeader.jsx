import React from "react";
import { Clock, CheckCircle2, Shield, Lock, Pause } from "lucide-react";
import { formatTimer } from "../../services/scoreCalculator.service";

export default function ActiveExamHeader({
  activeExam,
  activeQuestions,
  currentAnsweredCount,
  secondsRemaining,
  isExamPaused,
  onSubmit
}) {
  return (
    <div className="quiz-header-row">
      <div className="quiz-header-left">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span className="quiz-eyebrow">
            <Shield size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
            ATTEMPT IN PROGRESS • AI PROCTORED
          </span>

          <span className="quiz-lock-tag" title="Exit is locked until exam submission">
            <Lock size={11} style={{ display: "inline", marginRight: "3px", verticalAlign: "middle" }} />
            FULLSCREEN ENFORCED • NO MID-EXAM EXIT
          </span>
        </div>

        <h1 className="quiz-title">{activeExam?.examTitle || activeExam?.title}</h1>
        <p className="quiz-meta-sub">
          {activeQuestions.length} questions • Answered: {currentAnsweredCount} / {activeQuestions.length} • Category: {activeExam?.category || "Core"}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        {/* Timer Pill — Highlights PAUSED if multi-person is detected */}
        <div className={`quiz-timer-pill ${isExamPaused ? "timer-paused-pill" : ""}`}>
          {isExamPaused ? <Pause size={16} /> : <Clock size={16} />}
          <span>
            {isExamPaused ? `PAUSED (${formatTimer(secondsRemaining)})` : `${formatTimer(secondsRemaining)} remaining`}
          </span>
        </div>

        {/* Submit Assessment Button */}
        <button
          type="button"
          className="btn-submit-assessment"
          onClick={() => onSubmit("manual")}
          disabled={isExamPaused}
          title={isExamPaused ? "Exam is paused due to proctoring violation" : "Submit your assessment"}
        >
          <CheckCircle2 size={16} />
          <span>Submit Assessment</span>
        </button>
      </div>
    </div>
  );
}
