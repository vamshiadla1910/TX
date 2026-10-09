import React, { useState } from "react";
import "./Round3.css";
import EvaluationModal from "./EvaluationModal/EvaluationModal";

const mockRound3Teams = [
  {
    id: "TX-REG-2001",
    lead: "Hari Chari",
    project: "AI Learning Platform",
    innovation: 9,
    technical: 9,
    presentation: 9,
    total: 27,
    status: "R3 QUALIFIED",
    comments: "Excellent overall performance"
  },
  {
    id: "TX-REG-2002",
    lead: "Rahul Kumar",
    project: "Smart Healthcare",
    innovation: 9,
    technical: 8,
    presentation: 9,
    total: 26,
    status: "R3 QUALIFIED",
    comments: "Very strong solution"
  },
  {
    id: "TX-REG-2003",
    lead: "Priya Sharma",
    project: "Smart Agriculture",
    innovation: 8,
    technical: 8,
    presentation: 8,
    total: 24,
    status: "R3 QUALIFIED",
    comments: "Good implementation"
  },
  {
    id: "TX-REG-2004",
    lead: "Vishnu Bommala",
    project: "Cyber Security Assistant",
    innovation: "",
    technical: "",
    presentation: "",
    total: "",
    status: "PRESENTED",
    comments: ""
  }
];

function Round3() {
  const [teams, setTeams] =
    useState(mockRound3Teams);

  const [selectedTeam, setSelectedTeam] =
    useState(null);

  const [evaluationOpen, setEvaluationOpen] =
    useState(false);

  const openEvaluation = (team) => {
    setSelectedTeam(team);
    setEvaluationOpen(true);
  };

  const closeEvaluation = () => {
    setSelectedTeam(null);
    setEvaluationOpen(false);
  };

  const handleReviewEvaluation = (
    evaluation
  ) => {
    console.log(
      "Round 3 Evaluation:",
      evaluation
    );

    const registrationId =
      evaluation.registrationId;

    setTeams((currentTeams) =>
      currentTeams.map((team) => {
        if (
          team.id !== registrationId
        ) {
          return team;
        }

        const innovation =
          Number(
            evaluation.scores?.innovation ||
              0
          );

        const technical =
          Number(
            evaluation.scores?.technical ||
              0
          );

        const presentation =
          Number(
            evaluation.scores?.feasibility ||
              0
          );

        let status = "PRESENTED";

        if (
          evaluation.decision ===
          "QUALIFIED"
        ) {
          status = "R3 QUALIFIED";
        }

        if (
          evaluation.decision ===
          "NOT_QUALIFIED"
        ) {
          status = "ELIMINATED";
        }

        if (
          evaluation.decision ===
          "CLARIFICATION"
        ) {
          status =
            "REQUIRES CLARIFICATION";
        }

        return {
          ...team,

          innovation,
          technical,
          presentation,

          total:
            evaluation.total,

          status,

          comments:
            evaluation.comments
        };
      })
    );

    closeEvaluation();
  };

  const rankedTeams = [...teams]
    .filter(
      (team) =>
        team.total !== "" &&
        team.total !== undefined
    )
    .sort(
      (a, b) =>
        Number(b.total) -
        Number(a.total)
    );

  const winner =
    rankedTeams[0];

  const runnerUp =
    rankedTeams[1];

  const finalists =
    rankedTeams.slice(2);

  return (
    <div className="round3-page">

      <div className="round3-card">

        <div className="round3-table-header">

          <div>
            REGISTRATION ID
          </div>

          <div>
            TEAM LEAD
          </div>

          <div>
            PROJECT TITLE
          </div>

          <div>
            SCORES
          </div>

          <div>
            STATUS
          </div>

          <div>
            SCREENING
          </div>

        </div>

        {teams.map((team) => {

          const evaluated =
            team.innovation !== "" &&
            team.innovation !== undefined;

          return (
            <div
              className="round3-row"
              key={team.id}
            >

              <div className="round3-registration">
                {team.id}
              </div>

              <div className="round3-lead">
                {team.lead}
              </div>

              <div className="round3-project">
                {team.project}
              </div>

              <div className="round3-score-cell">

                {evaluated ? (

                  <div className="round3-score">

                    <strong>
                      {team.total}
                    </strong>

                  </div>

                ) : (

                  <span className="round3-not-scored">
                    Not scored
                  </span>

                )}

              </div>

              <div className="round3-status-cell">

                <span
                  className={`round3-status ${String(
                    team.status
                  )
                    .toLowerCase()
                    .replace(
                      /\s+/g,
                      "-"
                    )}`}
                >
                  {team.status}
                </span>

              </div>

              <div className="round3-screening">

                <button
                  className={
                    evaluated
                      ? "round3-edit-button"
                      : "round3-evaluate-button"
                  }
                  onClick={() =>
                    openEvaluation(team)
                  }
                >
                  {evaluated
                    ? "Edit Screening"
                    : "Evaluation Setup"}
                </button>

              </div>

            </div>
          );
        })}

      </div>

      <div className="round3-results">

        <div className="round3-results-header">

          <span>
            FINAL RESULTS
          </span>

          <h2>
            Hackathon Winners
          </h2>

          <p>
            Final ranking based on Round 3
            scores.
          </p>

        </div>

        <div className="round3-winners-grid">

          {winner && (

            <div className="round3-winner-card winner">

              <div className="round3-medal">
                🥇
              </div>

              <span className="round3-rank-label">
                WINNER
              </span>

              <h3>
                {winner.project}
              </h3>

              <p>
                {winner.lead}
              </p>

              <strong>
                {winner.total} Points
              </strong>

            </div>

          )}

          {runnerUp && (

            <div className="round3-winner-card runner">

              <div className="round3-medal">
                🥈
              </div>

              <span className="round3-rank-label">
                RUNNER-UP
              </span>

              <h3>
                {runnerUp.project}
              </h3>

              <p>
                {runnerUp.lead}
              </p>

              <strong>
                {runnerUp.total} Points
              </strong>

            </div>

          )}

        </div>

        {finalists.length > 0 && (

          <div className="round3-finalists">

            <h3>
              Other Finalists
            </h3>

            {finalists.map(
              (team, index) => (

                <div
                  className="round3-finalist-row"
                  key={team.id}
                >

                  <span>
                    #{index + 3}
                  </span>

                  <div>

                    <strong>
                      {team.project}
                    </strong>

                    <small>
                      {team.lead}
                    </small>

                  </div>

                  <strong>
                    {team.total}
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </div>

      <EvaluationModal
        isOpen={evaluationOpen}
        onClose={closeEvaluation}
        team={
          selectedTeam
            ? {
                "Registration ID":
                  selectedTeam.id,

                "Team Lead":
                  selectedTeam.lead,

                "Project Title":
                  selectedTeam.project
              }
            : null
        }
        round={3}
        onReview={
          handleReviewEvaluation
        }
      />

    </div>
  );
}

export default Round3;