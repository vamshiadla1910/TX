import React, { useEffect, useState } from "react";
import { getRound1Teams } from "./HackethonApi";
import EvaluationModal from "./EvaluationModal/EvaluationModal";
import "./Round1.css";

const getField = (team, fields) => {
  for (const field of fields) {
    if (
      team?.[field] !== undefined &&
      team?.[field] !== null &&
      team?.[field] !== ""
    ) {
      return team[field];
    }
  }

  return "";
};

const getRegistrationId = (team) =>
  getField(team, [
    "Registration ID",
    "registrationId",
    "Registration Number",
    "Registration No",
    "Reg No"
  ]);

const getTeamLead = (team) =>
  getField(team, [
    "Team Lead",
    "Team Leader",
    "Team Lead Name",
    "Team Leader Name",
    "Lead Name",
    "Leader Name",
    "Lead / Student Full Name",
    "Full Name",
    "Participant Name"
  ]) || "-";

const getProjectTitle = (team) =>
  getField(team, [
    "Project Title",
    "Project / Solution Title",
    "Team Name",
    "Team",
    "Challenge Title"
  ]) || "Untitled Project";

const getTechnology = (team) =>
  getField(team, [
    "Technology",
    "Technologies",
    "Tech Stack",
    "Tech",
    "Technologies / Languages",
    "Selected Tech Domains",
    "Technology / Skill Domains"
  ]) || "-";

const hasEvaluation = (team) => {
  return (
    team?.["Innovation"] !== undefined &&
    team?.["Innovation"] !== "" &&
    team?.["Technical"] !== undefined &&
    team?.["Technical"] !== "" &&
    team?.["Presentation"] !== undefined &&
    team?.["Presentation"] !== ""
  );
};

const Round1 = () => {
  const [teams, setTeams] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedTeam, setSelectedTeam] =
    useState(null);

  const [evaluationOpen, setEvaluationOpen] =
    useState(false);

  useEffect(() => {
    loadRound1();
  }, []);

  const loadRound1 = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getRound1Teams();

      setTeams(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load Round 1 teams."
      );
    } finally {
      setLoading(false);
    }
  };

  const openEvaluation = (team) => {
    setSelectedTeam(team);
    setEvaluationOpen(true);
  };

  const closeEvaluation = () => {
    setEvaluationOpen(false);
    setSelectedTeam(null);
  };

  const handleReviewEvaluation = (
    evaluation
  ) => {
    console.log(
      "Round 1 Evaluation:",
      evaluation
    );

    const registrationId =
      evaluation.registrationId;

    setTeams((currentTeams) =>
      currentTeams.map((team) => {
        if (
          getRegistrationId(team) !==
          registrationId
        ) {
          return team;
        }

        return {
          ...team,

          Evaluation:
            evaluation,

          Total:
            evaluation.total,

          Status:
            evaluation.decision ===
            "QUALIFIED"
              ? "R1 QUALIFIED"
              : evaluation.decision ===
                "NOT_QUALIFIED"
              ? "ELIMINATED"
              : "REQUIRES CLARIFICATION"
        };
      })
    );

    closeEvaluation();
  };

  if (loading) {
    return (
      <div className="round1-page">
        <div className="round1-loading">
          Loading Round 1 teams...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="round1-page">

        <div className="round1-error">

          <h3>
            Unable to load Round 1
          </h3>

          <p>
            {error}
          </p>

          <button
            onClick={loadRound1}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="round1-page">

      <div className="round1-card">

        <div className="round1-table-header">

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

        {teams.length === 0 ? (

          <div className="round1-empty">
            No present teams available
            for Round 1.
          </div>

        ) : (

          teams.map(
            (team, index) => {

              const registrationId =
                getRegistrationId(
                  team
                );

              const teamLead =
                getTeamLead(team);

              const projectTitle =
                getProjectTitle(team);

              const technology =
                getTechnology(team);

              const status =
                team["Status"] ||
                "PRESENTED";

              const evaluated =
                hasEvaluation(team);

              return (
                <div
                  className="round1-row"
                  key={
                    registrationId ||
                    `round1-${index}`
                  }
                >

                  <div className="round1-registration">

                    <strong>
                      {registrationId ||
                        "-"}
                    </strong>

                  </div>

                  <div className="round1-lead">

                    {teamLead}

                  </div>

                  <div className="round1-project">

                    <strong>
                      {projectTitle}
                    </strong>

                  </div>

                  <div className="round1-score-cell">

                    {evaluated ? (

                      <div className="round1-score-card">

                        <span>
                          {team[
                            "Innovation"
                          ]}
                          /
                          {team[
                            "Technical"
                          ]}
                          /
                          {team[
                            "Presentation"
                          ]}
                        </span>

                        <strong>
                          =
                          {" "}
                          {team[
                            "Total"
                          ]}
                        </strong>

                      </div>

                    ) : (

                      <span className="round1-not-scored">
                        Not scored
                      </span>

                    )}

                  </div>

                  <div className="round1-status-cell">

                    <span
                      className={`round1-status ${String(
                        status
                      )
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )}`}
                    >
                      {status}
                    </span>

                  </div>

                  <div className="round1-screening">

                    <button
                      className={
                        evaluated
                          ? "round1-edit-button"
                          : "round1-setup-button"
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
            }
          )
        )}

      </div>

      <EvaluationModal
        isOpen={evaluationOpen}
        onClose={closeEvaluation}
        team={selectedTeam}
        round={1}
        onReview={
          handleReviewEvaluation
        }
      />

    </div>
  );
};

export default Round1;