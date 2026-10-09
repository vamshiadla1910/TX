import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock3,
  Timer,
  CheckCircle2,
  Trophy,
  Medal,
  RefreshCw,
  XCircle,
  Sparkles
} from "lucide-react";
import {
  getTeams,
  getRegistrationId,
  getTeamName,
  getTeamLead,
  getAttendance,
  getRoundStatus,
  getFinalStatus,
  normalize
} from "./HackethonApi";
import "./Overview.css";

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

    const handleUpdate = () => {
      loadTeams();
    };

    window.addEventListener("attendanceUpdated", handleUpdate);
    window.addEventListener("registrationUpdated", handleUpdate);
    window.addEventListener("round1Updated", handleUpdate);
    window.addEventListener("round2Updated", handleUpdate);
    window.addEventListener("round3Updated", handleUpdate);

    return () => {
      window.removeEventListener("attendanceUpdated", handleUpdate);
      window.removeEventListener("registrationUpdated", handleUpdate);
      window.removeEventListener("round1Updated", handleUpdate);
      window.removeEventListener("round2Updated", handleUpdate);
      window.removeEventListener("round3Updated", handleUpdate);
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

  const present = teams.filter(
    (t) => getAttendance(t) === "Present"
  ).length;

  const absent = teams.filter(
    (t) => getAttendance(t) === "Absent"
  ).length;

  const pending = teams.filter(
    (t) => getAttendance(t) === "Pending"
  ).length;

  const round1Eligible = teams.filter(
    (t) => getAttendance(t) === "Present"
  ).length;

  const round1Qualified = teams.filter(
    (t) => getRoundStatus(t, 1) === "Qualified"
  ).length;

  const round2Qualified = teams.filter(
    (t) => getRoundStatus(t, 2) === "Qualified"
  ).length;

  const round3Qualified = teams.filter(
    (t) => getRoundStatus(t, 3) === "Qualified"
  ).length;

  const finalists = teams.filter(
    (t) => getFinalStatus(t) === "Finalist"
  ).length;

  const recentTeams = teams.slice(0, 15);

  if (loading) {
    return (
      <div className="overview-page">
        <div className="overview-loading">
          <RefreshCw className="overview-spin" size={32} />
          <h3>Loading Dashboard</h3>
          <p>Fetching hackathon data from Google Sheets...</p>
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
            Live statistics and team progress synced directly with Google
            Sheets.
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
            <span>Pending Verification</span>
            <strong>{pending}</strong>
            <small>Awaiting check-in</small>
          </div>
        </div>
      </div>

      <div className="overview-section-title">
        <div>
          <h2>Evaluation Progress</h2>
          <p>Real-time qualification status across rounds</p>
        </div>
      </div>

      <div
        className="overview-round-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
        }}
      >
        <div className="overview-round-card">
          <div className="round-icon violet">
            <Timer size={22} />
          </div>

          <div>
            <span>Round 1 Eligible</span>
            <strong>{round1Eligible}</strong>
            <small>Marked Present</small>
          </div>
        </div>

        <div className="overview-round-card">
          <div className="round-icon violet">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Round 1 Qualified</span>
            <strong>{round1Qualified}</strong>
            <small>Passed Round 1</small>
          </div>
        </div>

        <div className="overview-round-card">
          <div className="round-icon amber">
            <Medal size={22} />
          </div>

          <div>
            <span>Round 2 Qualified</span>
            <strong>{round2Qualified}</strong>
            <small>Passed Round 2</small>
          </div>
        </div>

        <div className="overview-round-card">
          <div className="round-icon emerald">
            <Trophy size={22} />
          </div>

          <div>
            <span>Round 3 Qualified</span>
            <strong>{round3Qualified}</strong>
            <small>Passed Round 3</small>
          </div>
        </div>

        <div className="overview-round-card">
          <div className="round-icon emerald">
            <Sparkles size={22} />
          </div>

          <div>
            <span>Finalists</span>
            <strong>{finalists}</strong>
            <small>Selected Finalists</small>
          </div>
        </div>
      </div>

      <div className="overview-table-card">
        <div className="overview-table-header">
          <div>
            <h2>Teams Overview</h2>
            <p>Latest registered teams and their current status</p>
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
                  <th>Registration ID</th>
                  <th>Team Lead</th>
                  <th>Attendance</th>
                  <th>Action</th>
                  <th>Round 1</th>
                  <th>Round 2</th>
                  <th>Round 3</th>
                  <th>Final Status</th>
                </tr>
              </thead>

              <tbody>
                {recentTeams.map((team, index) => {
                  const regId =
                    getRegistrationId(team) || `REG-${index + 1}`;

                  const lead = getTeamLead(team);

                  let leadName = "—";

                  if (
                    typeof lead === "object" &&
                    lead !== null
                  ) {
                    leadName =
                      lead.fullName ||
                      lead.name ||
                      lead.student_fullName ||
                      "—";
                  } else if (typeof lead === "string") {
                    const text = lead.trim();

                    try {
                      const parsed = JSON.parse(text);

                      leadName =
                        parsed?.fullName ||
                        parsed?.name ||
                        parsed?.student_fullName ||
                        "—";
                    } catch {
                      const match = text.match(
                        /["']?(?:name|fullName|student_fullName)["']?\s*:\s*["']?([^"|,\n}]+)["']?/i
                      );

                      leadName =
                        match?.[1]?.trim() || text;
                    }
                  }

                  const attendance = getAttendance(team);
                  const r1 = getRoundStatus(team, 1);
                  const r2 = getRoundStatus(team, 2);
                  const r3 = getRoundStatus(team, 3);
                  const finalStatus = getFinalStatus(team);

                  const teamIsPresent = isPresent(team);
                  const isProcessing = processingId === registration;

                  return (
                    <tr key={regId || index}>
                      <td>{index + 1}</td>

                      <td>
                        <span className="registration-number">
                          {regId}
                        </span>
                      </td>

                      <td>{leadName}</td>

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
                          className={`status-pill status-${normalize(
                            r1
                          )}`}
                        >
                          {r1}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-pill status-${normalize(
                            r2
                          )}`}
                        >
                          {r2}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-pill status-${normalize(
                            r3
                          )}`}
                        >
                          {r3}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-pill status-${normalize(
                            finalStatus
                          )}`}
                        >
                          {finalStatus}
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