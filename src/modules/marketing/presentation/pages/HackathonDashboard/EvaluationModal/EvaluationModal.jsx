import React, { useEffect, useState } from "react";
import "./EvaluationModal.css";

const criteria = [
  {
    key: "understanding",
    label: "Problem Understanding",
    max: 25
  },
  {
    key: "relevance",
    label: "Problem Relevance",
    max: 15
  },
  {
    key: "innovation",
    label: "Innovation & Creativity",
    max: 25
  },
  {
    key: "feasibility",
    label: "Solution Feasibility",
    max: 20
  },
  {
    key: "technical",
    label: "Technical Approach",
    max: 15
  }
];

function getField(team, names, fallback = "-") {
  if (!team) return fallback;

  for (const name of names) {
    if (
      team[name] !== undefined &&
      team[name] !== null &&
      String(team[name]).trim() !== ""
    ) {
      return team[name];
    }
  }

  return fallback;
}

function EvaluationModal({
  isOpen,
  onClose,
  team,
  round = 1,
  onReview
}) {
  const [scores, setScores] = useState({
    understanding: 0,
    relevance: 0,
    innovation: 0,
    feasibility: 0,
    technical: 0
  });

  const [comments, setComments] = useState("");
  const [decision, setDecision] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add(
        "evaluation-modal-open"
      );
    } else {
      document.body.classList.remove(
        "evaluation-modal-open"
      );
    }

    return () => {
      document.body.classList.remove(
        "evaluation-modal-open"
      );
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setScores({
      understanding: 0,
      relevance: 0,
      innovation: 0,
      feasibility: 0,
      technical: 0
    });

    setComments("");
    setDecision("");
  }, [isOpen, team]);

  if (!isOpen) {
    return null;
  }

  const registrationId = getField(team, [
    "Registration ID",
    "registrationId",
    "id"
  ]);

  const teamLead = getField(team, [
    "Team Lead",
    "teamLead",
    "lead",
    "Lead"
  ]);

  const projectTitle = getField(team, [
    "Project Title",
    "projectTitle",
    "project"
  ], "Untitled Project");

  const total = criteria.reduce(
    (sum, criterion) =>
      sum + Number(scores[criterion.key] || 0),
    0
  );

  const handleScoreChange = (
    key,
    value,
    max
  ) => {
    if (value === "") {
      setScores((current) => ({
        ...current,
        [key]: ""
      }));
      return;
    }

    let numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      numberValue = 0;
    }

    if (numberValue < 0) {
      numberValue = 0;
    }

    if (numberValue > max) {
      numberValue = max;
    }

    setScores((current) => ({
      ...current,
      [key]: numberValue
    }));
  };

  const handleSubmit = () => {
    const evaluation = {
      round,
      registrationId,
      teamLead,
      projectTitle,
      scores: {
        understanding: Number(
          scores.understanding || 0
        ),
        relevance: Number(
          scores.relevance || 0
        ),
        innovation: Number(
          scores.innovation || 0
        ),
        feasibility: Number(
          scores.feasibility || 0
        ),
        technical: Number(
          scores.technical || 0
        )
      },
      total,
      comments,
      decision
    };

    if (onReview) {
      onReview(evaluation);
    }
  };

  return (
    <div
      className="evaluation-modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="evaluation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evaluation-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="evaluation-modal-header">
          <div>
            <h2 id="evaluation-title">
              Round {round} — Evaluation
            </h2>

            <p>
              Evaluate the team performance.
            </p>
          </div>

          <div className="evaluation-header-right">
            <span className="evaluation-present">
              Present
            </span>

            <button
              type="button"
              className="evaluation-close-button"
              onClick={onClose}
              aria-label="Close evaluation"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="evaluation-modal-body">
          <div className="evaluation-team-info">
            <div className="evaluation-info-card">
              <span>Registration ID</span>
              <strong>{registrationId}</strong>
            </div>

            <div className="evaluation-info-card">
              <span>Team Lead</span>
              <strong>{teamLead}</strong>
            </div>

            <div className="evaluation-info-card">
              <span>Project</span>
              <strong>{projectTitle}</strong>
            </div>
          </div>

          <section className="evaluation-section">
            <h3>
              Evaluation — Total 100 Marks
            </h3>

            <div className="evaluation-criteria">
              {criteria.map((criterion) => (
                <div
                  className="evaluation-criterion"
                  key={criterion.key}
                >
                  <div className="evaluation-criterion-name">
                    {criterion.label}
                  </div>

                  <div className="evaluation-max">
                    / {criterion.max}
                  </div>

                  <input
                    type="number"
                    min="0"
                    max={criterion.max}
                    value={
                      scores[criterion.key]
                    }
                    onChange={(event) =>
                      handleScoreChange(
                        criterion.key,
                        event.target.value,
                        criterion.max
                      )
                    }
                  />
                </div>
              ))}
            </div>

            <div className="evaluation-total">
              <strong>TOTAL</strong>

              <strong>
                {total} / 100
              </strong>
            </div>
          </section>

          <section className="evaluation-section">
            <h3>Comments</h3>

            <textarea
              value={comments}
              onChange={(event) =>
                setComments(
                  event.target.value
                )
              }
              placeholder="Enter additional comments..."
            />
          </section>

          <section className="evaluation-section">
            <h3>Decision</h3>

            <div className="evaluation-decisions">
              <label>
                <input
                  type="radio"
                  name={`decision-${registrationId}`}
                  value="QUALIFIED"
                  checked={
                    decision === "QUALIFIED"
                  }
                  onChange={(event) =>
                    setDecision(
                      event.target.value
                    )
                  }
                />

                <span>Qualified</span>
              </label>

              <label>
                <input
                  type="radio"
                  name={`decision-${registrationId}`}
                  value="NOT_QUALIFIED"
                  checked={
                    decision ===
                    "NOT_QUALIFIED"
                  }
                  onChange={(event) =>
                    setDecision(
                      event.target.value
                    )
                  }
                />

                <span>Not Qualified</span>
              </label>

              <label>
                <input
                  type="radio"
                  name={`decision-${registrationId}`}
                  value="CLARIFICATION"
                  checked={
                    decision ===
                    "CLARIFICATION"
                  }
                  onChange={(event) =>
                    setDecision(
                      event.target.value
                    )
                  }
                />

                <span>
                  Requires Clarification
                </span>
              </label>
            </div>
          </section>
        </div>

        <div className="evaluation-modal-footer">
          <button
            type="button"
            className="evaluation-cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="evaluation-review-button"
            onClick={handleSubmit}
          >
            Submit Evaluation
          </button>
        </div>
      </div>
    </div>
  );
}

export default EvaluationModal;