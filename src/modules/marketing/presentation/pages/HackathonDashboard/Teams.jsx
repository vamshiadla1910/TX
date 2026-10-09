import React, { useEffect, useState } from "react";
import { Download, Filter, Check, X } from "lucide-react";
import { getTeams, saveAttendance } from "./HackethonApi";
import "./Teams.css";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const getField = (team, names) => {
  const keys = Object.keys(team || {});
  const normalizedNames = names.map(normalize);

  const exactKey = keys.find((key) => normalizedNames.includes(normalize(key)));

  if (exactKey) return team[exactKey];

  const partialKey = keys.find((key) => {
    const normalizedKey = normalize(key);

    return normalizedNames.some(
      (name) => normalizedKey.includes(name) || name.includes(normalizedKey),
    );
  });

  return partialKey ? team[partialKey] : "";
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

const getTeamLead = (team) =>
  getField(team, [
    "Team Lead",
    "Team Leader",
    "Team Lead Name",
    "Team Leader Name",
    "Lead Name",
    "Leader Name",
    "Full Name",
    "Participant Name",
  ]);

const getMembers = (team) =>
  getField(team, ["Team Members", "Members", "Team Member"]);

const getTechnology = (team) =>
  getField(team, ["Technologies", "Technology", "Tech Stack", "Tech"]);

const getChallenge = (team) =>
  getField(team, ["Challenge Title", "Challenge", "Problem Statement"]);

const getAttendance = (team) =>
  getField(team, [
    "Attendance",
    "Present",
    "Team Present",
    "Attendance Status",
    "Presence",
  ]);

const isPresent = (team) => {
  const value = normalize(getAttendance(team));

  return ["present", "yes", "true", "1", "attended"].includes(value);
};

const isAbsent = (team) => {
  const value = normalize(getAttendance(team));

  return ["absent", "no", "false", "0", "notpresent", "notattended"].includes(
    value,
  );
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
