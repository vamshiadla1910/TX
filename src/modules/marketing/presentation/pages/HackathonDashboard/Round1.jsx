import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  School,
  FileText,
  SlidersHorizontal
} from "lucide-react";
import {
  getTeams,
  updateRound1,
  getRegistrationId,
  getTeamName,
  getTeamLead,
  getCollege,
  getProjectTitle,
  getAttendance,
  getRoundStatus,
  getJudgeRemarks,
  normalize
} from "./HackethonApi";
import EvaluationModal from "./EvaluationModal/EvaluationModal";
import "./Round1.css";

const Round1 = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [notification, setNotification] = useState("");

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTeams();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load Round 1 teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();

    const handleUpdate = () => {
      loadTeams();
    };

    window.addEventListener("attendanceUpdated", handleUpdate);
    window.addEventListener("round1Updated", handleUpdate);

    return () => {
      window.removeEventListener("attendanceUpdated", handleUpdate);
      window.removeEventListener("round1Updated", handleUpdate);
    };
  }, []);

  // CRITICAL RULE: Round 1 displays ONLY teams where Attendance === "Present"
  const eligibleTeams = teams.filter((t) => getAttendance(t) === "Present");

  const filteredTeams = eligibleTeams.filter((team) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const regId = getRegistrationId(team).toLowerCase();
    const teamName = getTeamName(team).toLowerCase();
    const lead = getTeamLead(team).toLowerCase();
    const college = getCollege(team).toLowerCase();
    const project = getProjectTitle(team).toLowerCase();

    return (
      regId.includes(q) ||
      teamName.includes(q) ||
      lead.includes(q) ||
      college.includes(q) ||
      project.includes(q)
    );
  });

  const handleDecision = async (team, decisionStatus) => {
    const regId = getRegistrationId(team);
    if (!regId) return;

    try {
      setSavingId(regId);
      setNotification("");

      const existingRemarks = getJudgeRemarks(team);
      await updateRound1(regId, decisionStatus, existingRemarks);

      await loadTeams();
      window.dispatchEvent(new Event("round1Updated"));

      setNotification(`Team ${regId} marked as ${decisionStatus}.`);
      setTimeout(() => setNotification(""), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update Round 1 decision.");
    } finally {
      setSavingId("");
    }
  };

  const handleEvaluationSubmit = async (evaluation) => {
    try {
      const regId = evaluation.registrationId;
      setSavingId(regId);

      const decisionStatus =
        evaluation.decision === "QUALIFIED"
          ? "Qualified"
          : evaluation.decision === "NOT_QUALIFIED"
          ? "Not Qualified"
          : "Qualified";

      await updateRound1(regId, decisionStatus, evaluation.comments, {
        understanding: evaluation.scores?.understanding ?? "",
        relevance: evaluation.scores?.relevance ?? "",
        innovation: evaluation.scores?.innovation ?? "",
        feasibility: evaluation.scores?.feasibility ?? "",
        technical: evaluation.scores?.technical ?? "",
        total: evaluation.total ?? ""
      });

      setSelectedTeam(null);
      await loadTeams();
      window.dispatchEvent(new Event("round1Updated"));

      setNotification(`Round 1 evaluation for ${regId} saved successfully.`);
      setTimeout(() => setNotification(""), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to save evaluation.");
    } finally {
      setSavingId("");
    }
  };

  if (loading) {
    return (
      <div className="round1-page">
        <div className="round1-loading">
          <RefreshCw className="round1-spin" size={32} />
          <h3>Loading Round 1</h3>
          <p>Verifying present teams from Google Sheets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="round1-page">
        <div className="round1-error">
          <AlertCircle size={45} color="#dc2626" />
          <h3>Unable to load Round 1</h3>
          <p>{error}</p>
          <button onClick={loadTeams}>
            <RefreshCw size={17} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const qualifiedCount = eligibleTeams.filter((t) => getRoundStatus(t, 1) === "Qualified").length;
  const notQualifiedCount = eligibleTeams.filter((t) => getRoundStatus(t, 1) === "Not Qualified").length;
  const pendingCount = eligibleTeams.filter((t) => getRoundStatus(t, 1) === "Eligible").length;

  return (
    <div className="round1-page">
      <div className="round1-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <p className="round1-eyebrow" style={{ margin: "0 0 6px", fontSize: "12px", fontWeight: 700, color: "#64748b", letterSpacing: "1px" }}>
            HACKATHON EVALUATION
          </p>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#1e293b", fontWeight: 750 }}>Round 1 Evaluation</h1>
          <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
            Only teams marked <strong>Present</strong> appear in Round 1. Qualified teams advance to Round 2.
          </p>
        </div>

        <button
          onClick={loadTeams}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "#fff",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
            color: "#4f46e5",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {notification && (
        <div
          style={{
            marginBottom: "16px",
            padding: "10px 16px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: "8px",
            color: "#065f46",
            fontSize: "14px",
            fontWeight: 600
          }}
        >
          ✓ {notification}
        </div>
      )}

      {/* Summary Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        <div style={{ padding: "16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4f46e5" }}>
            <Users size={18} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Eligible (Present)</span>
          </div>
          <strong style={{ fontSize: "24px", color: "#1e293b", marginTop: "6px", display: "block" }}>{eligibleTeams.length}</strong>
        </div>

        <div style={{ padding: "16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#16a34a" }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Qualified → Round 2</span>
          </div>
          <strong style={{ fontSize: "24px", color: "#16a34a", marginTop: "6px", display: "block" }}>{qualifiedCount}</strong>
        </div>

        <div style={{ padding: "16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dc2626" }}>
            <XCircle size={18} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Not Qualified</span>
          </div>
          <strong style={{ fontSize: "24px", color: "#dc2626", marginTop: "6px", display: "block" }}>{notQualifiedCount}</strong>
        </div>

        <div style={{ padding: "16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#d97706" }}>
            <Award size={18} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Awaiting Decision</span>
          </div>
          <strong style={{ fontSize: "24px", color: "#d97706", marginTop: "6px", display: "block" }}>{pendingCount}</strong>
        </div>
      </div>

      {/* Toolbar Search */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Round 1 teams by ID, Name, Lead, College, or Project..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px 14px 11px 40px",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
            fontSize: "14px",
            outline: "none"
          }}
        />
      </div>

      {filteredTeams.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#64748b" }}>
          <Users size={48} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
          <h3 style={{ margin: "0 0 6px", color: "#1e293b" }}>
            {eligibleTeams.length === 0 ? "No Present Teams for Round 1" : "No matching teams"}
          </h3>
          <p style={{ margin: 0, fontSize: "14px" }}>
            {eligibleTeams.length === 0
              ? "Mark a team Present in the Team Verification section to make it eligible for Round 1."
              : "Try adjusting your search query."}
          </p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1150px" }}>
            <thead>
              <tr style={{ background: "#4f46e5", color: "#fff", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <th style={{ padding: "16px", textAlign: "left" }}>#</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Registration ID</th>
                
                <th style={{ padding: "16px", textAlign: "left" }}>Team Lead</th>
                <th style={{ padding: "16px", textAlign: "left" }}>College / Organization</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Project Name</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Attendance</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Round 1 Status</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Judge Remarks</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team, index) => {
                const regId = getRegistrationId(team) || `REG-${index + 1}`;
               
                const lead = getTeamLead(team);
                const college = getCollege(team);
                const project = getProjectTitle(team);
                const attendance = getAttendance(team);
                const r1Status = getRoundStatus(team, 1);
                const remarks = getJudgeRemarks(team);
                const isSaving = savingId === regId;

                return (
                  <tr key={regId || index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px", color: "#64748b" }}>{index + 1}</td>
                    <td style={{ padding: "16px", fontWeight: 700, color: "#4f46e5" }}>{regId}</td>
                    
                    <td style={{ padding: "16px", color: "#334155" }}>{lead}</td>
                    <td style={{ padding: "16px", color: "#64748b" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <School size={14} />
                        <span>{college}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px", color: "#334155" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", maxWidth: "200px" }}>
                        <FileText size={14} color="#64748b" />
                        <span style={{ fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {project}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 10px",
                          background: "#ecfdf5",
                          color: "#16a34a",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 700
                        }}
                      >
                        <CheckCircle2 size={13} /> {attendance}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 700,
                          background:
                            r1Status === "Qualified"
                              ? "#ecfdf5"
                              : r1Status === "Not Qualified"
                              ? "#fef2f2"
                              : "#f5f3ff",
                          color:
                            r1Status === "Qualified"
                              ? "#16a34a"
                              : r1Status === "Not Qualified"
                              ? "#dc2626"
                              : "#6d28d9"
                        }}
                      >
                        {r1Status}
                      </span>
                    </td>
                    <td style={{ padding: "16px", color: "#64748b", fontSize: "13px", maxWidth: "180px" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                        {remarks || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <button
                          disabled={isSaving}
                          onClick={() => handleDecision(team, "Qualified")}
                          style={{
                            padding: "6px 12px",
                            background: r1Status === "Qualified" ? "#16a34a" : "#fff",
                            color: r1Status === "Qualified" ? "#fff" : "#16a34a",
                            border: "1px solid #16a34a",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: isSaving ? "not-allowed" : "pointer"
                          }}
                        >
                          Qualified
                        </button>

                        <button
                          disabled={isSaving}
                          onClick={() => handleDecision(team, "Not Qualified")}
                          style={{
                            padding: "6px 12px",
                            background: r1Status === "Not Qualified" ? "#dc2626" : "#fff",
                            color: r1Status === "Not Qualified" ? "#fff" : "#dc2626",
                            border: "1px solid #dc2626",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: isSaving ? "not-allowed" : "pointer"
                          }}
                        >
                          Not Qualified
                        </button>

                        <button
                          disabled={isSaving}
                          onClick={() => setSelectedTeam(team)}
                          title="Detailed Evaluation Rubric"
                          style={{
                            padding: "6px 10px",
                            background: "#f8fafc",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            color: "#475569",
                            fontSize: "12px",
                            cursor: isSaving ? "not-allowed" : "pointer"
                          }}
                        >
                          <SlidersHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedTeam && (
        <EvaluationModal
          isOpen={Boolean(selectedTeam)}
          round={1}
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onReview={handleEvaluationSubmit}
          onSubmit={handleEvaluationSubmit}
        />
      )}
    </div>
  );
};

export default Round1;