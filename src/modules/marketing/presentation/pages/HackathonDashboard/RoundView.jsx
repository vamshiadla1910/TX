import React from "react";
import { RefreshCw, XCircle } from "lucide-react";
import EvaluationModal from "./EvaluationModal/EvaluationModal";
import { getRegistrationId, getRoundStatus } from "./dashboardHelpers";

const RoundView = ({ roundNum, title, subtitle, dataHook }) => {
  const {
    teams,
    loading,
    error,
    selectedTeam,
    evaluationOpen,
    loadData,
    handleOpenEvaluation,
    handleCloseEvaluation,
    handleReviewSubmit
  } = dataHook;

  if (loading) {
    return (
      <div className="round-page">
        <div className="round-loading">
          <RefreshCw className="spin-icon" size={28} />
          <p>Loading {title} teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="round-page">
        <div className="round-error">
          <XCircle size={36} />
          <h2>Unable to load teams</h2>
          <p>{error}</p>
          <button onClick={loadData}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <section className="round-page">
      <div className="round-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="round-table-card">
        <div className="round-table-wrapper">
          <table className="round-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>PARTICIPANT REG</th>
                <th>TEAM LEAD</th>
                <th>PROJECT TITLE</th>
                <th>TECH STACK</th>
                <th>STATUS</th>
                <th>SCORE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan="8" className="round-empty">
                    {roundNum === 1
                      ? "No present teams found. Mark teams as 'Present' in the Teams section to evaluate them here."
                      : `No qualified teams found for ${title}.`}
                  </td>
                </tr>
              ) : (
                teams.map((team, index) => {
                  const regId = getRegistrationId(team) || `REG-${String(index + 1).padStart(3, "0")}`;
                  const lead = team._computedLead || "-";
                  const project = team._computedProject || "Untitled Project";
                  const tech = team._computedTech || "-";
                  const statusInfo = getRoundStatus(team, roundNum);
                  const totalScore = team.Total ?? team.total;
                  const hasScore = totalScore !== undefined && totalScore !== null && totalScore !== "";

                  return (
                    <tr key={regId || index}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="registration">{regId}</span>
                      </td>
                      <td>
                        <strong>{lead}</strong>
                      </td>
                      <td>{project}</td>
                      <td>{tech}</td>
                      <td>
                        <span className={`status-badge status-${statusInfo.type}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        {hasScore ? (
                          <span className="score-badge">{totalScore}/100</span>
                        ) : (
                          <span className="no-score">—</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="evaluate-btn"
                          onClick={() => handleOpenEvaluation(team)}
                        >
                          Evaluate
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {evaluationOpen && (
        <EvaluationModal
          isOpen={evaluationOpen}
          onClose={handleCloseEvaluation}
          team={selectedTeam}
          round={roundNum}
          onReview={handleReviewSubmit}
        />
      )}
    </section>
  );
};

export default RoundView;
