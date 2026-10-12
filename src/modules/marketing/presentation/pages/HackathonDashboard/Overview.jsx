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
import {
  getTeams,
  getRound1Teams,
  getRound2Teams,
  getRound3Teams,
  saveAttendance,
  getLocalAttendanceMap
} from "./HackethonApi";
import {
  getRegistrationId,
  getTeamLead,
  getField,
  normalize
} from "./dashboardHelpers";
import "./Overview.css";

const getLocalMap = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
};

const Overview = () => {
  const [teams, setTeams] = useState([]);
  const [r1SheetTeams, setR1SheetTeams] = useState([]);
  const [r2SheetTeams, setR2SheetTeams] = useState([]);
  const [r3SheetTeams, setR3SheetTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const [mainRes, r1Res, r2Res, r3Res] = await Promise.all([
        getTeams().catch(() => []),
        getRound1Teams().catch(() => []),
        getRound2Teams().catch(() => []),
        getRound3Teams().catch(() => [])
      ]);

      setTeams(Array.isArray(mainRes) ? mainRes : []);
      setR1SheetTeams(Array.isArray(r1Res) ? r1Res : []);
      setR2SheetTeams(Array.isArray(r2Res) ? r2Res : []);
      setR3SheetTeams(Array.isArray(r3Res) ? r3Res : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    const handleDataChange = () => loadAllData();
    window.addEventListener("hackathon_attendance_changed", handleDataChange);
    window.addEventListener("hackathon_evaluation_changed", handleDataChange);
    return () => {
      window.removeEventListener("hackathon_attendance_changed", handleDataChange);
      window.removeEventListener("hackathon_evaluation_changed", handleDataChange);
    };
  }, []);

  const handleMarkPresent = async (team) => {
    const regId = getRegistrationId(team);
    if (!regId) return alert("Registration ID missing for team.");

    try {
      setProcessingId(regId);
      await saveAttendance(regId, "Present");
      loadAllData();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to mark attendance.");
    } finally {
      setProcessingId(null);
    }
  };

  const attendanceMap = getLocalAttendanceMap();
  const r1Evals = getLocalMap("tx_hackathon_round1_evaluations");
  const r2Evals = getLocalMap("tx_hackathon_round2_evaluations");
  const r3Evals = getLocalMap("tx_hackathon_round3_evaluations");

  const isTeamPresent = (team) => {
    const regId = String(getRegistrationId(team) || "").trim();
    if (regId && attendanceMap[regId]) {
      const norm = normalize(attendanceMap[regId]);
      if (["present", "yes", "true", "1", "attended"].includes(norm)) return true;
      if (["absent", "no", "false", "0", "notpresent"].includes(norm)) return false;
    }
    if (r1SheetTeams.some((t) => String(getRegistrationId(t)).trim() === regId)) return true;
    const sheetAtt = normalize(getField(team, ["Attendance", "Attendance Status", "attendance"]));
    return ["present", "attended", "yes"].includes(sheetAtt);
  };

  const isTeamAbsent = (team) => {
    const regId = String(getRegistrationId(team) || "").trim();
    if (regId && attendanceMap[regId]) return normalize(attendanceMap[regId]) === "absent";
    const sheetAtt = normalize(getField(team, ["Attendance", "Attendance Status", "attendance"]));
    return sheetAtt === "absent";
  };

  const getR1Status = (regId) => {
    if (!regId) return "Pending";
    const cleanId = String(regId).trim();
    if (r1Evals[cleanId]) {
      const dec = normalize(r1Evals[cleanId].decision || r1Evals[cleanId].status);
      if (["qualified", "r1qualified", "pass"].includes(dec)) return "Qualified";
      if (["not_qualified", "eliminated"].includes(dec)) return "Eliminated";
    }
    const r1Row = r1SheetTeams.find((t) => String(getRegistrationId(t)).trim() === cleanId);
    if (r1Row) {
      const st = normalize(getField(r1Row, ["Status", "status"]));
      if (["qualified", "r1qualified", "pass"].includes(st)) return "Qualified";
      if (["eliminated", "not_qualified"].includes(st)) return "Eliminated";
    }
    if (r2SheetTeams.some((t) => String(getRegistrationId(t)).trim() === cleanId)) return "Qualified";
    return "Pending";
  };

  const getR2Status = (regId) => {
    if (!regId) return "Pending";
    const cleanId = String(regId).trim();
    if (r2Evals[cleanId]) {
      const dec = normalize(r2Evals[cleanId].decision || r2Evals[cleanId].status);
      if (["qualified", "r2qualified", "pass"].includes(dec)) return "Qualified";
      if (["not_qualified", "eliminated"].includes(dec)) return "Eliminated";
    }
    const r2Row = r2SheetTeams.find((t) => String(getRegistrationId(t)).trim() === cleanId);
    if (r2Row) {
      const st = normalize(getField(r2Row, ["Status", "status"]));
      if (["qualified", "r2qualified", "pass"].includes(st)) return "Qualified";
      if (["eliminated", "not_qualified"].includes(st)) return "Eliminated";
    }
    if (r3SheetTeams.some((t) => String(getRegistrationId(t)).trim() === cleanId)) return "Qualified";
    if (getR1Status(cleanId) === "Qualified") return "Pending";
    return "—";
  };

  const getR3Status = (regId) => {
    if (!regId) return "Pending";
    const cleanId = String(regId).trim();
    if (r3Evals[cleanId]) {
      const dec = normalize(r3Evals[cleanId].decision || r3Evals[cleanId].status);
      if (["qualified", "r3qualified", "pass"].includes(dec)) return "Finalist";
      if (["not_qualified", "eliminated"].includes(dec)) return "Eliminated";
    }
    const r3Row = r3SheetTeams.find((t) => String(getRegistrationId(t)).trim() === cleanId);
    if (r3Row) {
      const st = normalize(getField(r3Row, ["Status", "status"]));
      if (["qualified", "r3qualified", "pass"].includes(st)) return "Finalist";
      if (["eliminated", "not_qualified"].includes(st)) return "Eliminated";
    }
    if (getR2Status(cleanId) === "Qualified" || r3SheetTeams.some((t) => String(getRegistrationId(t)).trim() === cleanId)) return "Pending";
    return "—";
  };

  const total = teams.length;
  const present = teams.filter(isTeamPresent).length;
  const absent = teams.filter(isTeamAbsent).length;
  const pending = Math.max(total - present - absent, 0);

  const round1Qualified = teams.filter((t) => getR1Status(getRegistrationId(t)) === "Qualified").length;
  const round2Qualified = teams.filter((t) => getR2Status(getRegistrationId(t)) === "Qualified").length;
  const round3Finalists = teams.filter((t) => getR3Status(getRegistrationId(t)) === "Finalist" || r3SheetTeams.some((r3) => String(getRegistrationId(r3)).trim() === String(getRegistrationId(t)).trim())).length;

  const recentTeams = teams.slice(0, 15);

  if (loading) {
    return (
      <div className="overview-page">
        <div className="overview-loading">
          <RefreshCw className="overview-spin" size={32} />
          <h3>Loading Dashboard</h3>
          <p>Fetching hackathon data across Round 1, 2, and 3...</p>
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
          <button onClick={loadAllData}>
            <RefreshCw size={17} /> Try Again
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
            Monitor team registration, attendance, and evaluation progress across Round 1, Round 2, and Round 3.
          </p>
        </div>
        <button className="overview-refresh" onClick={loadAllData}>
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      <div className="overview-stat-grid">
        {[
          { icon: Users, color: "blue", label: "Total Teams", val: total, sub: "Registered teams" },
          { icon: UserCheck, color: "green", label: "Present", val: present, sub: "Teams attended" },
          { icon: UserX, color: "red", label: "Absent", val: absent, sub: "Teams not present" },
          { icon: Clock3, color: "orange", label: "Pending", val: pending, sub: "Attendance pending" }
        ].map((item, i) => (
          <div key={i} className="overview-stat-card">
            <div className={`overview-stat-icon ${item.color}`}>
              <item.icon size={23} />
            </div>
            <div className="overview-stat-content">
              <span>{item.label}</span>
              <strong>{item.val}</strong>
              <small>{item.sub}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="overview-section-title">
        <div>
          <h2>Evaluation Progress</h2>
          <p>Current qualification status by round</p>
        </div>
      </div>

      <div className="overview-round-grid">
        {[
          { icon: Trophy, color: "violet", label: "Round 1", val: round1Qualified, sub: "Qualified for R2" },
          { icon: Medal, color: "amber", label: "Round 2", val: round2Qualified, sub: "Qualified for R3" },
          { icon: Award, color: "emerald", label: "Round 3", val: round3Finalists, sub: "Finalists" }
        ].map((item, i) => (
          <div key={i} className="overview-round-card">
            <div className={`round-icon ${item.color}`}>
              <item.icon size={22} />
            </div>
            <div>
              <span>{item.label}</span>
              <strong>{item.val}</strong>
              <small>{item.sub}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="overview-table-card">
        <div className="overview-table-header">
          <div>
            <h2>Teams Overview</h2>
            <p>Latest registered teams and multi-round qualification status</p>
          </div>
          <div className="overview-total-badge">{total} Teams</div>
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
                  const registration = getRegistrationId(team);
                  const lead = getTeamLead(team);
                  const teamPresent = isTeamPresent(team);
                  const teamAbsent = isTeamAbsent(team);
                  const attendance = teamPresent ? "Present" : teamAbsent ? "Absent" : "Pending";
                  const isProcessing = processingId === registration;

                  const r1Status = getR1Status(registration);
                  const r2Status = getR2Status(registration);
                  const r3Status = getR3Status(registration);

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
                        <span className={`status-pill attendance-${normalize(attendance)}`}>
                          {attendance === "Present" && <CheckCircle2 size={14} />}
                          {attendance === "Absent" && <XCircle size={14} />}
                          {attendance === "Pending" && <Clock3 size={14} />}
                          {attendance}
                        </span>
                      </td>
                      <td>
                        {teamPresent ? (
                          <button className="overview-action-btn added" disabled>
                            <CheckCircle2 size={14} /> Added
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
                        <span className={r1Status === "Qualified" ? "qualified" : r1Status === "Eliminated" ? "not-qualified" : ""}>
                          {r1Status}
                        </span>
                      </td>
                      <td>
                        <span className={r2Status === "Qualified" ? "qualified" : r2Status === "Eliminated" ? "not-qualified" : ""}>
                          {r2Status}
                        </span>
                      </td>
                      <td>
                        <span className={r3Status === "Finalist" || r3Status === "Qualified" ? "qualified" : r3Status === "Eliminated" ? "not-qualified" : ""}>
                          {r3Status}
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