import React from "react";
import { Flag, CheckCircle2 } from "lucide-react";

export default function QuestionCard({
  activeQuestions,
  currentQIndex,
  currentQuestion,
  selectedAnswers,
  flaggedQuestions,
  currentAnsweredCount,
  isExamPaused,
  onSelectOption,
  onToggleFlag,
  onSelectQuestionIndex,
  onPrevious,
  onNext,
  onSubmit
}) {
  const isFlagged = Boolean(flaggedQuestions[currentQuestion.id]);
  const currentSelectedOption = selectedAnswers[currentQuestion.id];

  return (
    <div className={`question-card ${isExamPaused ? "question-card-paused" : ""}`}>
      {/* Question Number Pills Navigator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "16px",
          paddingBottom: "14px",
          borderBottom: "1px solid #e2e8f0"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {activeQuestions.map((q, idx) => {
            const isQAnswered = Boolean(selectedAnswers[q.id]);
            const isQCurrent = idx === currentQIndex;
            return (
              <button
                key={q.id}
                type="button"
                disabled={isExamPaused}
                onClick={() => onSelectQuestionIndex(idx)}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "9px",
                  border: isQCurrent
                    ? "2px solid #2563eb"
                    : isQAnswered
                    ? "1.5px solid #16a34a"
                    : "1px solid #cbd5e1",
                  background: isQCurrent
                    ? "#2563eb"
                    : isQAnswered
                    ? "#dcfce7"
                    : "#f8fafc",
                  color: isQCurrent
                    ? "#ffffff"
                    : isQAnswered
                    ? "#15803d"
                    : "#334155",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: isExamPaused ? "not-allowed" : "pointer",
                  opacity: isExamPaused ? 0.6 : 1
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#2563eb" }}>
          Answered: {currentAnsweredCount} of {activeQuestions.length}
        </span>
      </div>

      <div className="question-card-top">
        <span className="question-number-badge">
          {currentQuestion.number} • {currentQuestion.type} • {currentQuestion.marks}
        </span>
        <button
          type="button"
          className={`flag-question-btn ${isFlagged ? "flagged" : ""}`}
          onClick={onToggleFlag}
          disabled={isExamPaused}
        >
          <Flag size={14} />
          <span>{isFlagged ? "Flagged" : "Flag"}</span>
        </button>
      </div>

      <h2 className="question-text">{currentQuestion.prompt}</h2>

      <div className="options-list">
        {currentQuestion.options.map((option) => {
          const isSelected = currentSelectedOption === option.id;
          return (
            <div
              key={option.id}
              className={`option-card ${isSelected ? "selected" : ""} ${isExamPaused ? "disabled-paused" : ""}`}
              onClick={() => {
                if (!isExamPaused) {
                  onSelectOption(option.id);
                }
              }}
              style={{ cursor: isExamPaused ? "not-allowed" : "pointer" }}
            >
              <div className="option-letter-circle">{option.id}</div>
              <span className="option-label-text">{option.text}</span>
            </div>
          );
        })}
      </div>

      <div className="question-actions-row">
        <button
          type="button"
          className="btn-secondary"
          onClick={onPrevious}
          disabled={currentQIndex === 0 || isExamPaused}
        >
          &lt; Previous
        </button>

        <button
          type="button"
          className="btn-flag-review"
          onClick={onToggleFlag}
          disabled={isExamPaused}
        >
          {isFlagged ? "Unflag question" : "Flag for review"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            className="btn-primary-blue"
            onClick={onNext}
            disabled={currentQIndex === activeQuestions.length - 1 || isExamPaused}
          >
            Save &amp; next &gt;
          </button>

          <button
            type="button"
            className="btn-submit-assessment"
            onClick={() => onSubmit("manual")}
            disabled={isExamPaused}
          >
            <CheckCircle2 size={16} />
            <span>Submit Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
