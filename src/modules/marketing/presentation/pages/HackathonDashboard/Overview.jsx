import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock3,
  Trophy,
  Medal,
  Award,
  RefreshCw,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { getTeams, saveAttendance, getLocalAttendanceMap } from "./HackethonApi";
import "./Overview.css";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const getField = (team, names) => {
  const keys = Object.keys(team || {});
  const normalizedNames = names.map(normalize);

  const exactKey = keys.find((key) =>
    normalizedNames.includes(normalize(key))
  );

  if (exactKey) {
    return team[exactKey];
  }

  const partialKey = keys.find((key) => {
    const normalizedKey = normalize(key);

    return normalizedNames.some(
      (name) =>
        normalizedKey.includes(name) ||
        name.includes(normalizedKey)
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
    "Team ID"
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
  return normalize(getAttendance(team)) === "present";
};

const isAbsent = (team) => {
  return normalize(getAttendance(team)) === "absent";
};

const isQualified = (team, round) => {
  const value = normalize(
    getField(team, [
      `Round ${round} Qualified`,
      `Round ${round} Status`,
      `Round ${round} Result`,
      `Round ${round} Qualification`,
      `Round${round}Qualified`,
      `Round${round}Status`
    ])
  );
  return ["yes", "qualified", "pass", "passed", "shortlisted", "selected", "true", "1"].includes(value);
};

const Overview = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTeams();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();

    const handleAttendanceChange = () => {
      loadTeams();
    };

    window.addEventListener("hackathon_attendance_changed", handleAttendanceChange);
    return () => {
      window.removeEventListener("hackathon_attendance_changed", handleAttendanceChange);
    };
  }, []);

  const handleMarkPresent = async (team) => {
    const regId = getRegistration(team);
    if (!regId) {
      alert("Registration ID missing for team.");
      return;
    }

    try {
      setProcessingId(regId);
      await saveAttendance(regId, "Present");
      setTeams((currentTeams) =>
        currentTeams.map((t) => {
          if (getRegistration(t) === regId) {
            return {
              ...t,
              Attendance: "Present"
            };
          }
          return t;
        })
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to mark attendance.");
    } finally {
      setProcessingId(null);
    }
  };

  const total = teams.length;
  const present = teams.filter(isPresent).length;
  const absent = teams.filter(isAbsent).length;
  const pending = Math.max(total - present - absent, 0);
  const round1 = teams.filter((team) => isQualified(team, 1)).length;
  const round2 = teams.filter((team) => isQualified(team, 2)).length;
  const round3 = teams.filter((team) => isQualified(team, 3)).length;
  const recentTeams = teams.slice(0, 10);

  if (loading) {
    return (
      <div className="overview-page">
        <div className="overview-loading">
          <RefreshCw className="overview-spin" size={32} />
          <h3>Loading Dashboard</h3>
          <p>Fetching hackathon data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overview-page">
        <div className="overview-error">
          <XCircle size={45} />
          <h3>Unable to load dashboard</h3>
          <p>{error}</p>
          <button onClick={loadTeams}>
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-page">
      <div className="overview-header">
        <div>
          <p className="overview-eyebrow">HACKATHON OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="overview-description">
            Monitor team registration, attendance and round progress.
          </p>
        </div>
        <button className="overview-refresh" onClick={loadTeams}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="overview-stat-grid">
        <div className="overview-stat-card">
          <div className="overview-stat-icon blue">
            <Users size={23} />
          </div>
          <div className="overview-stat-content">
            <span>Total Teams</span>
            <strong>{total}</strong>
            <small>Registered teams</small>
          </div>
        </div>

        <div className="overview-stat-card">
          <div className="overview-stat-icon green">
            <UserCheck size={23} />
          </div>
          <div className="overview-stat-content">
            <span>Present</span>
            <strong>{present}</strong>
            <small>Teams attended</small>
          </div>
        </div>

        <div className="overview-stat-card">
          <div className="overview-stat-icon red">
            <UserX size={23} />
          </div>
          <div className="overview-stat-content">
            <span>Absent</span>
            <strong>{absent}</strong>
            <small>Teams not present</small>
          </div>
        </div>

        <div className="overview-stat-card">
          <div className="overview-stat-icon orange">
            <Clock3 size={23} />
          </div>
          <div className="overview-stat-content">
            <span>Pending</span>
            <strong>{pending}</strong>
            <small>Attendance pending</small>
          </div>
        </div>
      </div>

      <div className="overview-section-title">
        <div>
          <h2>Evaluation Progress</h2>
          <p>Current qualification status by round</p>
        </div>
      </div>

      <div className="overview-round-grid">
        <div className="overview-round-card">
          <div className="round-icon violet">
            <Trophy size={22} />
          </div>
          <div>
            <span>Round 1</span>
            <strong>{round1}</strong>
            <small>Qualified</small>
          </div>
        </div>

        <div className="overview-round-card">
          <div className="round-icon amber">
            <Medal size={22} />
          </div>
          <div>
            <span>Round 2</span>
            <strong>{round2}</strong>
            <small>Qualified</small>
          </div>
        </div>

        <div className="overview-round-card">
          <div className="round-icon emerald">
            <Award size={22} />
          </div>
          <div>
            <span>Round 3</span>
            <strong>{round3}</strong>
            <small>Finalists</small>
          </div>
        </div>
      </div>

      <div className="overview-table-card">
        <div className="overview-table-header">
          <div>
            <h2>Teams Overview</h2>
            <p>Latest registered teams and attendance status</p>
          </div>
          <div className="overview-total-badge">
            {total} Teams
          </div>
        </div>

        {recentTeams.length === 0 ? (
          <div className="overview-empty">
            <Users size={40} />
            <h3>No teams found</h3>
            <p>Teams registered in Google Sheets will appear here.</p>
          </div>
        ) : (
          <div className="overview-table-wrapper">
            <table className="overview-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Registration No</th>
                  <th>Team Lead</th>
                  <th>Attendance</th>
                  <th>Action</th>
                  <th>Round 1</th>
                  <th>Round 2</th>
                  <th>Round 3</th>
                </tr>
              </thead>

              <tbody>
                {recentTeams.map((team, index) => {
                  const registration = getRegistration(team);

                  const lead = getField(team, [
                    "Team Lead",
                    "Team Leader",
                    "Leader Name",
                    "Lead Name",
                    "Full Name"
                  ]);

                  const attendance = isPresent(team)
                    ? "Present"
                    : isAbsent(team)
                    ? "Absent"
                    : "Pending";

                  const teamIsPresent = isPresent(team);
                  const isProcessing = processingId === registration;

                  return (
                    <tr key={registration || index}>
                      <td>{index + 1}</td>

                      <td>
                        <span className="registration-number">
                          {registration || `REG-${index + 1}`}
                        </span>
                      </td>

                      <td>
                        <strong>{lead || "—"}</strong>
                      </td>

                      <td>
                        <span
                          className={`status-pill attendance-${normalize(
                            attendance
                          )}`}
                        >
                          {attendance === "Present" && (
                            <CheckCircle2 size={14} />
                          )}
                          {attendance === "Absent" && (
                            <XCircle size={14} />
                          )}
                          {attendance === "Pending" && (
                            <Clock3 size={14} />
                          )}
                          {attendance}
                        </span>
                      </td>

                      <td>
                        {teamIsPresent ? (
                          <button className="overview-action-btn added" disabled>
                            <CheckCircle2 size={14} />
                            Added
                          </button>
                        ) : (
                          <button
                            className="overview-action-btn present"
                            disabled={isProcessing}
                            onClick={() => handleMarkPresent(team)}
                          >
                            <UserCheck size={14} />
                            {isProcessing ? "Adding..." : "Present"}
                          </button>
                        )}
                      </td>

                      <td>
                        <span
                          className={
                            isQualified(team, 1)
                              ? "qualified"
                              : "not-qualified"
                          }
                        >
                          {isQualified(team, 1)
                            ? "Qualified"
                            : "Pending"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            isQualified(team, 2)
                              ? "qualified"
                              : "not-qualified"
                          }
                        >
                          {isQualified(team, 2)
                            ? "Qualified"
                            : "Pending"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            isQualified(team, 3)
                              ? "qualified"
                              : "not-qualified"
                          }
                        >
                          {isQualified(team, 3)
                            ? "Finalist"
                            : "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;