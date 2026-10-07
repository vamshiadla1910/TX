import React, { useEffect, useState } from "react";
import {
  getRound1Teams,
  getTeams,
  getLocalAttendanceMap,
  saveRound1Evaluation
} from "./HackethonApi";
import EvaluationModal from "./EvaluationModal/EvaluationModal";
import "./Round1.css";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_.-]+/g, "");

const getField = (team, fields) => {
  if (!team) return "";

  // 1. Direct exact key match
  for (const field of fields) {
    if (
      team[field] !== undefined &&
      team[field] !== null &&
      String(team[field]).trim() !== ""
    ) {
      return String(team[field]).trim();
    }
  }

  // 2. Normalized key match across all keys in team
  const keys = Object.keys(team);
  const normalizedFields = fields.map(normalize);

  for (const key of keys) {
    const val = team[key];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      const normKey = normalize(key);
      if (normalizedFields.some((f) => normKey === f || normKey.includes(f) || f.includes(normKey))) {
        return String(val).trim();
      }
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
    "Reg No",
    "id"
  ]);

const getTeamLead = (team) => {
  if (!team) return "-";

  // 1. Direct object properties
  if (typeof team.lead === "string" && team.lead.trim()) return team.lead.trim();
  if (typeof team.lead === "object" && team.lead !== null) {
    if (team.lead.fullName) return team.lead.fullName;
    if (team.lead.name) return team.lead.name;
  }
  if (typeof team.student === "object" && team.student !== null) {
    if (team.student.fullName) return team.student.fullName;
    if (team.student.name) return team.student.name;
  }

  // 2. Known key priority check
  const priorityKeys = [
    "Team Lead", "Team_Lead", "Team Leader", "Team_Leader",
    "Team Lead Name", "Team_Lead_Name", "Team Leader Name", "Team_Leader_Name",
    "Lead Name", "Lead_Name", "Leader Name", "Leader_Name",
    "Lead / Student Full Name", "Participant / Team Leader Name",
    "Participant Name", "Participant_Name", "Full Name", "Full_Name",
    "lead_fullName", "student_fullName", "lead_name", "student_name",
    "leadFullName", "studentFullName", "leadName", "studentName",
    "Name", "name", "Lead", "lead"
  ];

  for (const k of priorityKeys) {
    if (team[k] !== undefined && team[k] !== null && String(team[k]).trim() !== "" && String(team[k]).trim() !== "-") {
      return String(team[k]).trim();
    }
  }

  // 3. Dynamic key scan for keys containing lead, leader, student, participant, fullname, or name
  const keys = Object.keys(team);
  for (const key of keys) {
    const kLower = key.toLowerCase();
    if (
      kLower.includes("college") ||
      kLower.includes("project") ||
      kLower.includes("challenge") ||
      kLower.includes("title") ||
      kLower.includes("tech") ||
      kLower.includes("department") ||
      kLower.includes("course") ||
      kLower.includes("file") ||
      kLower.includes("id") ||
      kLower.includes("status") ||
      kLower.includes("score")
    ) {
      continue;
    }

    if (
      kLower.includes("lead") ||
      kLower.includes("leader") ||
      kLower.includes("student") ||
      kLower.includes("participant") ||
      kLower.includes("fullname") ||
      kLower.includes("name")
    ) {
      const val = team[key];
      if (val !== undefined && val !== null && String(val).trim() !== "" && String(val).trim() !== "-") {
        return String(val).trim();
      }
    }
  }

  // 4. Fallback: First member from members field
  const membersVal = getField(team, ["Team Members", "Members", "members", "team_members"]);
  if (membersVal) {
    const first = membersVal.split(",")[0];
    if (first && first.trim()) return first.trim();
  }

  return "-";
};

const getProjectTitle = (team) => {
  if (!team) return "Untitled Project";
  if (typeof team.project === "string" && team.project.trim()) return team.project.trim();
  if (typeof team.project === "object" && team.project?.title) return team.project.title;

  const val = getField(team, [
    "Project Title",
    "Project / Solution Title",
    "idea_projectTitle",
    "idea_title",
    "challenge_challengeTitle",
    "challenge_title",
    "Team Name",
    "Team",
    "Challenge Title",
    "Project",
    "Title"
  ]);

  return val || "Untitled Project";
};

const getTechnology = (team) => {
  if (!team) return "-";
  if (typeof team.technology === "string" && team.technology.trim()) return team.technology.trim();

  const val = getField(team, [
    "Technology",
    "Technologies",
    "technology_skills",
    "technology_domains",
    "Tech Stack",
    "Tech",
    "Technologies / Languages",
    "Selected Tech Domains",
    "Technology / Skill Domains",
    "Skills"
  ]);

  return val || "-";
};

const isPresent = (team) => {
  const regId = getRegistrationId(team);
  const localMap = getLocalAttendanceMap();
  if (regId && localMap[String(regId).trim()]) {
    const val = normalize(localMap[String(regId).trim()]);
    if (["present", "yes", "true", "1", "attended"].includes(val)) return true;
    if (["absent", "no", "false", "0", "notpresent", "notattended"].includes(val)) return false;
  }
  const attVal = normalize(
    getField(team, [
      "Attendance",
      "Present",
      "Team Present",
      "Attendance Status",
      "Presence"
    ])
  );
  return ["present", "yes", "true", "1", "attended"].includes(attVal);
};

const hasEvaluation = (team) => {
  return (
    (team?.["Innovation"] !== undefined && team?.["Innovation"] !== "") ||
    (team?.["total"] !== undefined && team?.["total"] !== "") ||
    (team?.["Total"] !== undefined && team?.["Total"] !== "") ||
    Boolean(team?.Evaluation)
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

    const handleAttendanceChange = () => {
      loadRound1();
    };

    window.addEventListener("hackathon_attendance_changed", handleAttendanceChange);
    return () => {
      window.removeEventListener("hackathon_attendance_changed", handleAttendanceChange);
    };
  }, []);

  const loadRound1 = async () => {
    try {
      setLoading(true);
      setError("");

      let r1Teams = [];
      let mainTeams = [];

      try {
        const r1Data = await getRound1Teams();
        if (Array.isArray(r1Data)) r1Teams = r1Data;
      } catch (err) {
        console.warn("getRound1Teams failed, falling back to getTeams:", err);
      }

      try {
        const teamsData = await getTeams();
        if (Array.isArray(teamsData)) mainTeams = teamsData;
      } catch (err) {
        console.warn("getTeams failed in Round1 load:", err);
      }

      // Map mainTeams by registrationId for fast lookup
      const mainTeamMap = new Map();
      for (const t of mainTeams) {
        const id = getRegistrationId(t);
        if (id) mainTeamMap.set(id, t);
      }

      const mergedList = [];
      const processedIds = new Set();

      for (const r1Item of r1Teams) {
        const id = getRegistrationId(r1Item);
        const mainItem = id ? mainTeamMap.get(id) : null;
        const merged = { ...(mainItem || {}), ...r1Item };

        if (mainItem) {
          const mainLead = getTeamLead(mainItem);
          const r1Lead = getTeamLead(r1Item);
          if (mainLead && mainLead !== "-" && (r1Lead === "-" || !r1Lead)) {
            merged["Team Lead"] = mainLead;
            merged["lead_fullName"] = mainLead;
          }
        }

        mergedList.push(merged);
        if (id) processedIds.add(id);
      }

      for (const mainItem of mainTeams) {
        const id = getRegistrationId(mainItem);
        if (id && !processedIds.has(id)) {
          mergedList.push(mainItem);
        }
      }

      // Filter ONLY present teams
      const presentTeams = mergedList.filter((team) => {
        const regId = getRegistrationId(team);
        const lead = getTeamLead(team);
        if (!regId && lead === "-") return false;
        return isPresent(team);
      });

      // Merge saved local evaluations
      const savedEvals = JSON.parse(
        localStorage.getItem("tx_hackathon_round1_evaluations") || "{}"
      );

      const enrichedTeams = presentTeams.map((team) => {
        const regId = getRegistrationId(team);
        if (regId && savedEvals[regId]) {
          const ev = savedEvals[regId];
          return {
            ...team,
            Innovation: ev.scores?.innovation ?? ev.innovation ?? 0,
            Technical: ev.scores?.technical ?? ev.technical ?? 0,
            Presentation: ev.scores?.feasibility ?? ev.presentation ?? 0,
            Total: ev.total ?? 0,
            Status:
              ev.decision === "QUALIFIED"
                ? "R1 QUALIFIED"
                : ev.decision === "NOT_QUALIFIED"
                ? "ELIMINATED"
                : "REQUIRES CLARIFICATION",
            Evaluation: ev
          };
        }
        return team;
      });

      setTeams(enrichedTeams);
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
    const registrationId = evaluation.registrationId;

    try {
      const savedEvals = JSON.parse(
        localStorage.getItem("tx_hackathon_round1_evaluations") || "{}"
      );
      savedEvals[registrationId] = evaluation;
      localStorage.setItem(
        "tx_hackathon_round1_evaluations",
        JSON.stringify(savedEvals)
      );
    } catch (e) {
      console.error(e);
    }

    saveRound1Evaluation(
      registrationId,
      evaluation.scores?.innovation || 0,
      evaluation.scores?.technical || 0,
      evaluation.scores?.feasibility || 0,
      evaluation.total,
      evaluation.comments,
      evaluation.decision
    ).catch((e) => console.warn("Background saveRound1Evaluation error:", e));

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

          Innovation: evaluation.scores?.innovation || 0,
          Technical: evaluation.scores?.technical || 0,
          Presentation: evaluation.scores?.feasibility || 0,
          Total: evaluation.total,
          Evaluation: evaluation,

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