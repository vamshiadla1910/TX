import React, { useEffect, useState } from "react";
import { Download, Filter, Check, X, Clock3 } from "lucide-react";
import { getTeams, saveAttendance, getLocalAttendanceMap } from "./HackethonApi";
import "./Teams.css";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_.-]+/g, "");

const getField = (team, names) => {
  if (!team) return "";

  // 1. Direct exact key match
  for (const name of names) {
    if (
      team[name] !== undefined &&
      team[name] !== null &&
      String(team[name]).trim() !== ""
    ) {
      return String(team[name]).trim();
    }
  }

  // 2. Normalized key match across all keys in team
  const keys = Object.keys(team);
  const normalizedNames = names.map(normalize);

  for (const key of keys) {
    const val = team[key];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      const normKey = normalize(key);
      if (normalizedNames.some((n) => normKey === n || normKey.includes(n) || n.includes(normKey))) {
        return String(val).trim();
      }
    }
  }

  return "";
};

const getRegistration = (team) =>
  getField(team, [
    "Registration ID",
    "Registration Number",
    "Registration No",
    "Reg No",
    "Participant Reg",
  ]);

const getTeamName = (team) => getField(team, ["Team Name", "Team"]);

const getTeamLead = (team) => {
  if (!team) return "-";
  if (typeof team.lead === "string" && team.lead.trim()) return team.lead.trim();
  if (typeof team.lead === "object" && team.lead !== null) {
    if (team.lead.fullName) return team.lead.fullName;
    if (team.lead.name) return team.lead.name;
  }
  if (typeof team.student === "object" && team.student !== null) {
    if (team.student.fullName) return team.student.fullName;
    if (team.student.name) return team.student.name;
  }

  const val = getField(team, [
    "Team Lead",
    "Team Leader",
    "Team Lead Name",
    "Team Leader Name",
    "Lead Name",
    "Leader Name",
    "Full Name",
    "Participant Name",
    "lead_fullName",
    "student_fullName",
    "lead_name",
    "student_name"
  ]);

  if (val) return val;

  const members = getField(team, ["Team Members", "Members", "members"]);
  if (members) {
    const firstMember = members.split(",")[0];
    if (firstMember && firstMember.trim()) return firstMember.trim();
  }

  return "-";
};

const getMembers = (team) =>
  getField(team, ["Team Members", "Members", "Team Member"]);

const getTechnology = (team) =>
  getField(team, [
    "Technologies",
    "Technology",
    "Tech Stack",
    "Tech",
    "technology_skills",
    "technology_domains"
  ]);

const getChallenge = (team) =>
  getField(team, [
    "Challenge Title",
    "Challenge",
    "Problem Statement",
    "idea_projectTitle",
    "idea_title",
    "challenge_challengeTitle",
    "challenge_title"
  ]);

const getAttendance = (team) => {
  const regId = getRegistration(team);
  const localMap = getLocalAttendanceMap();
  if (regId && localMap[String(regId).trim()]) {
    return localMap[String(regId).trim()];
  }
  const sheetAtt = getField(team, [
    "Attendance",
    "Attendance Status",
    "Attendance_Status",
    "attendance"
  ]);
  const norm = normalize(sheetAtt);
  if (["present", "attended"].includes(norm)) return "Present";
  if (["absent"].includes(norm)) return "Absent";
  return "Pending";
};

const isPresent = (team) => {
  const value = normalize(getAttendance(team));
  return value === "present";
};

const isAbsent = (team) => {
  const value = normalize(getAttendance(team));
  return value === "absent";
};

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTeams();

      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load teams");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async (team, status) => {
    const registrationId = getRegistration(team);

    if (!registrationId) {
      alert("Registration ID is missing for this team.");
      return;
    }

    try {
      await saveAttendance(registrationId, status);

      setTeams((currentTeams) =>
        currentTeams.map((item) => {
          if (getRegistration(item) === registrationId) {
            return {
              ...item,
              Attendance: status,
            };
          }

          return item;
        }),
      );
    } catch (error) {
      console.error(error);

      alert(error.message || "Failed to save attendance.");
    }
  };

  const filteredTeams = teams.filter((team) => {
    if (activeFilter === "all") {
      return true;
    }

    if (activeFilter === "present") {
      return isPresent(team);
    }

    if (activeFilter === "absent") {
      return isAbsent(team);
    }

    return true;
  });

  const exportCSV = () => {
    const headers = [
      "S.No",
      "Registration No",
      "Team Name",
      "Team Lead",
      "Team Members",
      "Technology",
      "Challenge",
      "Attendance",
    ];

    const rows = filteredTeams.map((team, index) => [
      index + 1,
      getRegistration(team),
      getTeamName(team),
      getTeamLead(team),
      getMembers(team),
      getTechnology(team),
      getChallenge(team),
      getAttendance(team) || "Pending",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "hackathon-teams.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="teams-loading">Loading teams...</div>;
  }

  if (error) {
    return (
      <div className="teams-error">
        <h2>Unable to load teams</h2>
        <p>{error}</p>

        <button onClick={loadTeams}>Try Again</button>
      </div>
    );
  }

  return (
    <section className="teams-page">
      <div className="teams-header">
        <div>
          <h1>Team's Section</h1>
        </div>

        <button className="export-btn" onClick={exportCSV}>
          <Download size={17} />
          Export CSV
        </button>
      </div>

      <div className="teams-filters">
        <button
          className={`teams-filter ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          <Filter size={15} />
          All
        </button>

        <button
          className={`teams-filter ${
            activeFilter === "present" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("present")}
        >
          <Filter size={15} />
          Present
        </button>

        <button
          className={`teams-filter ${
            activeFilter === "absent" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("absent")}
        >
          <Filter size={15} />
          Absent
        </button>
      </div>

      <div className="teams-table-card">
        <div className="teams-table-wrapper">
          <table className="teams-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>PARTICIPANT REG</th>
                <th>TEAM LEAD</th>
                <th>TEAM MEMBERS</th>
                <th>TECH / CHALLENGE</th>
                <th>TEAM STATUS</th>
                <th>ATTENDANCE</th>
              </tr>
            </thead>

            <tbody>
              {filteredTeams.map((team, index) => {
                const attendance = isPresent(team)
                  ? "Present"
                  : isAbsent(team)
                    ? "Absent"
                    : "Pending";

                return (
                  <tr key={getRegistration(team) || index}>
                    <td>{index + 1}</td>

                    <td>
                      <span className="registration">
                        {getRegistration(team) ||
                          `REG-${String(index + 1).padStart(3, "0")}`}
                      </span>
                    </td>

                    <td>
                      <strong>{getTeamLead(team) || "—"}</strong>
                    </td>

                    <td>
                      <div className="members-list">
                        {String(getMembers(team) || "")
                          .split(",")
                          .filter(Boolean)
                          .map((member, memberIndex) => (
                            <span key={memberIndex}>{member.trim()}</span>
                          ))}
                      </div>
                    </td>

                    <td>
                      <div className="tech-challenge">
                        <strong>{getTechnology(team) || "—"}</strong>

                        <span>{getChallenge(team) || "—"}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`team-status ${
                          attendance === "Present"
                            ? "status-present"
                            : attendance === "Absent"
                              ? "status-absent"
                              : "status-pending"
                        }`}
                      >
                        {attendance === "Present" && <Check size={14} />}

                        {attendance === "Absent" && <X size={14} />}

                        {attendance === "Pending" && <Clock3 size={14} />}

                        {attendance}
                      </span>
                    </td>

                    <td>
                      <div className="attendance-actions">
                        <button
                          className={`attendance-btn present-btn ${
                            isPresent(team) ? "selected" : ""
                          }`}
                          onClick={() => handleAttendance(team, "Present")}
                        >
                          <Check size={14} />
                          Present
                        </button>

                        <button
                          className={`attendance-btn absent-btn ${
                            isAbsent(team) ? "selected" : ""
                          }`}
                          onClick={() => handleAttendance(team, "Absent")}
                        >
                          <X size={14} />
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTeams.length === 0 && (
            <div className="teams-empty">No teams found for this filter.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Teams;
