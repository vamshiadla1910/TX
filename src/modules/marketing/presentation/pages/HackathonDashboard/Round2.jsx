import React, { useState } from "react";
import "./Round2.css";
import EvaluationModal from "./EvaluationModal/EvaluationModal";

const mockRound2Teams = [
  {
    id: "TX-REG-1001",
    lead: "Hari Chari",
    project: "AI Based Learning Platform",
    innovation: "",
    technical: "",
    presentation: "",
    total: "",
    status: "PRESENTED",
    comments: ""
  },
  {
    id: "TX-REG-1002",
    lead: "Rahul Kumar",
    project: "Smart Healthcare System",
    innovation: 8,
    technical: 9,
    presentation: 8,
    total: 25,
    status: "R2 QUALIFIED",
    comments: "Strong technical implementation"
  },
  {
    id: "TX-REG-1003",
    lead: "Priya Sharma",
    project: "Smart Agriculture",
    innovation: 7,
    technical: 8,
    presentation: 8,
    total: 23,
    status: "R2 QUALIFIED",
    comments: "Good solution"
  },
  {
    id: "TX-REG-1004",
    lead: "Vishnu Bommala",
    project: "Cyber Security Assistant",
    innovation: "",
    technical: "",
    presentation: "",
    total: "",
    status: "PRESENTED",
    comments: ""
  },
  {
    id: "TX-REG-1005",
    lead: "Sanjay Kumar",
    project: "AI Travel Assistant",
    innovation: 9,
    technical: 7,
    presentation: 8,
    total: 24,
    status: "ELIMINATED",
    comments: "Needs stronger presentation"
  }
];

function Round2() {
  const [teams, setTeams] =
    useState(mockRound2Teams);

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
      "Round 2 Evaluation:",
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
          status = "R2 QUALIFIED";
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

  return (
    <div className="round2-page">

      <div className="round2-card">

        <div className="round2-table-header">

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
              className="round2-row"
              key={team.id}
            >

              <div className="round2-registration">

                {team.id}

              </div>

              <div className="round2-lead">

                {team.lead}

              </div>

              <div className="round2-project">

                {team.project}

              </div>

              <div className="round2-score-cell">

                {evaluated ? (

                  <div className="round2-score">

                    <strong>
                      {team.total}
                    </strong>

                  </div>

                ) : (

                  <span className="round2-not-scored">
                    Not scored
                  </span>

                )}

              </div>

              <div className="round2-status-cell">

                <span
                  className={`round2-status ${String(
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

              <div className="round2-screening">

                <button
                  className={
                    evaluated
                      ? "round2-edit-button"
                      : "round2-evaluate-button"
                  }
                  onClick={() =>
                    openEvaluation(
                      team
                    )
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
        round={2}
        onReview={
          handleReviewEvaluation
        }
      />

    </div>
  );
}

export default Round2;