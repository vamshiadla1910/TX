import React from "react";
export default function ProgressBar({ steps, currentStep, completedSteps, onStepClick }) {
  return (
    <div className="progressCard">
      <div className="progressTrack">
        <div
          className="progressFill"
          style={{ width: `${steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0}%` }}
        />
      </div>
      <div className="progressItems">
        {steps.map((step, index) => {
          const completed = completedSteps.includes(index);
          const active = currentStep === index;
          const clickable = completed || active;
          return (
            <button
              type="button"
              key={step.key}
              className={`progressItem ${active ? "active" : ""} ${completed ? "completed" : ""}`}
              disabled={!clickable}
              onClick={() => clickable && onStepClick(index)}
            >
              <span className="progressNumber">{completed ? "✓" : index + 1}</span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
