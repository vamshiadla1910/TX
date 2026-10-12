import React, { useEffect, useState } from "react";
import { getRegistrationId, getTeamLead, getProjectTitle } from "../dashboardHelpers";
import "./EvaluationModal.css";

const criteria = [
  { key: "understanding", label: "Problem Understanding", max: 25 },
  { key: "relevance", label: "Problem Relevance", max: 15 },
  { key: "innovation", label: "Innovation & Creativity", max: 25 },
  { key: "feasibility", label: "Solution Feasibility", max: 20 },
  { key: "technical", label: "Technical Approach", max: 15 }
];

function EvaluationModal({ isOpen, onClose, team, round = 1, onReview }) {
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
    if (isOpen) document.body.classList.add("evaluation-modal-open");
    else document.body.classList.remove("evaluation-modal-open");
    return () => document.body.classList.remove("evaluation-modal-open");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setScores({ understanding: 0, relevance: 0, innovation: 0, feasibility: 0, technical: 0 });
    setComments("");
    setDecision("");
  }, [isOpen, team]);

  if (!isOpen) return null;

  const registrationId = getRegistrationId(team);
  const teamLead = getTeamLead(team);
  const projectTitle = getProjectTitle(team);

  const total = criteria.reduce((sum, c) => sum + Number(scores[c.key] || 0), 0);

  const handleScoreChange = (key, value, max) => {
    if (value === "") return setScores((curr) => ({ ...curr, [key]: "" }));
    let num = Number(value);
    if (Number.isNaN(num) || num < 0) num = 0;
    if (num > max) num = max;
    setScores((curr) => ({ ...curr, [key]: num }));
  };

  const handleSubmit = () => {
    const evaluation = {
      round,
      registrationId,
      teamLead,
      projectTitle,
      innovation: Number(scores.innovation || 0),
      technical: Number(scores.technical || 0),
      presentation: Number(scores.understanding || 0) + Number(scores.relevance || 0) + Number(scores.feasibility || 0),
      scores: {
        understanding: Number(scores.understanding || 0),
        relevance: Number(scores.relevance || 0),
        innovation: Number(scores.innovation || 0),
        feasibility: Number(scores.feasibility || 0),
        technical: Number(scores.technical || 0)
      },
      total,
      comments,
      decision
    };
    if (onReview) onReview(evaluation);
  };

  return (
    <div
      className="evaluation-modal-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="evaluation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evaluation-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="evaluation-modal-header">
          <div>
            <h2 id="evaluation-title">Round {round} — Evaluation</h2>
            <p>Evaluate the team performance.</p>
          </div>
          <div className="evaluation-header-right">
            <span className="evaluation-present">Present</span>
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
            <h3>Evaluation — Total 100 Marks</h3>
            <div className="evaluation-criteria">
              {criteria.map((c) => (
                <div className="evaluation-criterion" key={c.key}>
                  <div className="evaluation-criterion-name">{c.label}</div>
                  <div className="evaluation-max">/ {c.max}</div>
                  <input
                    type="number"
                    min="0"
                    max={c.max}
                    value={scores[c.key]}
                    onChange={(e) => handleScoreChange(c.key, e.target.value, c.max)}
                  />
                </div>
              ))}
            </div>
            <div className="evaluation-total">
              <strong>TOTAL</strong>
              <strong>{total} / 100</strong>
            </div>
          </section>

          <section className="evaluation-section">
            <h3>Comments</h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter additional comments..."
            />
          </section>

          <section className="evaluation-section">
            <h3>Decision</h3>
            <div className="evaluation-decisions">
              {[
                { val: "QUALIFIED", label: "Qualified" },
                { val: "NOT_QUALIFIED", label: "Not Qualified" },
                { val: "CLARIFICATION", label: "Requires Clarification" }
              ].map((item) => (
                <label key={item.val}>
                  <input
                    type="radio"
                    name={`decision-${registrationId}`}
                    value={item.val}
                    checked={decision === item.val}
                    onChange={(e) => setDecision(e.target.value)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="evaluation-modal-footer">
          <button type="button" className="evaluation-cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="evaluation-review-button" onClick={handleSubmit}>
            Submit Evaluation
          </button>
        </div>
      </div>
    </div>
  );
}

export default EvaluationModal;