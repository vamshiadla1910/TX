import React, { useEffect, useState } from "react";
import {
  Download,
  Filter,
  Check,
  X,
  Clock3,
  Users,
  User,
  Award,
  Mail,
  Phone,
  Building,
  GraduationCap,
  IdCard,
  Sparkles
} from "lucide-react";
import { getTeams, saveAttendance } from "./HackethonApi";
import {
  getRegistrationId,
  getTeamName,
  getTeamLead,
  getMembers,
  getAllMemberDetails,
  getTechnology,
  getChallenge,
  getAttendance,
  isPresent,
  isAbsent,
  normalize
} from "./dashboardHelpers";
import "./Teams.css";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeamForModal, setSelectedTeamForModal] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedTeamForModal(null);
    };
    if (selectedTeamForModal) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedTeamForModal]);

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
    const registrationId = getRegistrationId(team);
    if (!registrationId) {
      alert("Registration ID is missing for this team.");
      return;
    }

    // Optimistically update attendance so UI reflects the clicked button immediately
    setTeams((current) =>
      current.map((item) =>
        getRegistrationId(item) === registrationId ? { ...item, Attendance: status } : item
      )
    );

    try {
      await saveAttendance(registrationId, status);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save attendance.");
    }
  };

  const filteredTeams = teams.filter((team) => {
    if (activeFilter === "present") return isPresent(team);
    if (activeFilter === "absent") return isAbsent(team);
    return true;
  });

  const exportCSV = () => {
    const headers = ["S.No", "Registration No", "Team Name", "Team Lead", "Team Members", "Technology", "Challenge", "Attendance"];
    const rows = filteredTeams.map((team, index) => [
      index + 1,
      getRegistrationId(team),
      getTeamName(team),
      getTeamLead(team),
      getMembers(team),
      getTechnology(team),
      getChallenge(team),
      getAttendance(team) || "Pending"
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hackathon-teams.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="teams-loading">Loading teams...</div>;

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
        <h1>Team's Section</h1>
        <button className="export-btn" onClick={exportCSV}>
          <Download size={17} /> Export CSV
        </button>
      </div>

      <div className="teams-filters">
        {["all", "present", "absent"].map((filterKey) => (
          <button
            key={filterKey}
            className={`teams-filter ${activeFilter === filterKey ? "active" : ""}`}
            onClick={() => setActiveFilter(filterKey)}
          >
            <Filter size={15} />
            {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
          </button>
        ))}
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
                const attStatus = isPresent(team) ? "Present" : isAbsent(team) ? "Absent" : "Pending";
                const memberDetails = getAllMemberDetails(team);

                return (
                  <tr key={getRegistrationId(team) || index}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="registration">
                        {getRegistrationId(team) || `REG-${String(index + 1).padStart(3, "0")}`}
                      </span>
                    </td>
                    <td>
                      <strong>{getTeamLead(team) || "—"}</strong>
                    </td>
                    <td>
                      <button
                        className="team-members-badge-btn"
                        onClick={() => setSelectedTeamForModal(team)}
                        title="Click to view team member details popup"
                      >
                        {memberDetails.length}
                      </button>
                    </td>
                    <td>
                      <div className="tech-challenge">
                        <strong>{getTechnology(team) || "—"}</strong>
                        <span>{getChallenge(team) || "—"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`team-status status-${attStatus.toLowerCase()}`}>
                        {attStatus === "Present" && <Check size={14} />}
                        {attStatus === "Absent" && <X size={14} />}
                        {attStatus === "Pending" && <Clock3 size={14} />}
                        {attStatus}
                      </span>
                    </td>
                    <td>
                      <div className="attendance-actions">
                        {activeFilter === "all" ? (
                          isPresent(team) ? (
                            <button
                              className="attendance-btn present-btn selected"
                              onClick={() => handleAttendance(team, "Present")}
                            >
                              <Check size={14} /> Present
                            </button>
                          ) : isAbsent(team) ? (
                            <button
                              className="attendance-btn absent-btn selected"
                              onClick={() => handleAttendance(team, "Absent")}
                            >
                              <X size={14} /> Absent
                            </button>
                          ) : (
                            <>
                              <button
                                className="attendance-btn present-btn"
                                onClick={() => handleAttendance(team, "Present")}
                              >
                                <Check size={14} /> Present
                              </button>
                              <button
                                className="attendance-btn absent-btn"
                                onClick={() => handleAttendance(team, "Absent")}
                              >
                                <X size={14} /> Absent
                              </button>
                            </>
                          )
                        ) : (
                          <>
                            <button
                              className={`attendance-btn present-btn ${isPresent(team) ? "selected" : ""}`}
                              onClick={() => handleAttendance(team, "Present")}
                            >
                              <Check size={14} /> Present
                            </button>
                            <button
                              className={`attendance-btn absent-btn ${isAbsent(team) ? "selected" : ""}`}
                              onClick={() => handleAttendance(team, "Absent")}
                            >
                              <X size={14} /> Absent
                            </button>
                          </>
                        )}
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

      {/* Team Members Details Popup Modal */}
      {selectedTeamForModal && (
        <div className="members-modal-backdrop" onClick={() => setSelectedTeamForModal(null)}>
          <div className="members-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="members-modal-header">
              <div className="members-modal-header-left">
                <div className="modal-icon-badge">
                  <Users size={22} />
                </div>
                <div>
                  <h2 className="members-modal-title">Team Member Details</h2>
                  <p className="members-modal-subtitle">
                    <span className="modal-reg-id">
                      {getRegistrationId(selectedTeamForModal) || "REG-000"}
                    </span>
                    <span className="modal-dot">•</span>
                    <span>
                      {getTeamName(selectedTeamForModal) || getTeamLead(selectedTeamForModal)}
                    </span>
                  </p>
                </div>
              </div>
              <button
                className="members-modal-close-btn"
                onClick={() => setSelectedTeamForModal(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="members-modal-body">
              <div className="members-modal-overview-card">
                <div className="overview-item">
                  <span className="overview-label">Team Lead</span>
                  <strong className="overview-val">{getTeamLead(selectedTeamForModal) || "—"}</strong>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Tech Stack</span>
                  <strong className="overview-val">{getTechnology(selectedTeamForModal) || "—"}</strong>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Challenge Title</span>
                  <strong className="overview-val">{getChallenge(selectedTeamForModal) || "—"}</strong>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Attendance</span>
                  <span className={`team-status status-${normalize(getAttendance(selectedTeamForModal))}`}>
                    {getAttendance(selectedTeamForModal)}
                  </span>
                </div>
              </div>

              <div className="members-modal-list-wrapper">
                <div className="members-modal-list-title">
                  <Users size={16} />
                  <span>All Team Members ({getAllMemberDetails(selectedTeamForModal).length})</span>
                </div>
                <div className="members-modal-grid">
                  {getAllMemberDetails(selectedTeamForModal).map((member, idx) => (
                    <div key={idx} className={`member-detail-card ${idx === 0 ? "lead-card-style" : ""}`}>
                      <div className="member-card-left">
                        <div className={`member-avatar ${idx === 0 ? "lead-avatar" : ""}`}>
                          {idx === 0 ? <Award size={18} /> : <User size={18} />}
                        </div>
                      </div>
                      <div className="member-card-right">
                        <div className="member-card-name-row">
                          <h3 className="member-name">{member.name}</h3>
                          <span className={`member-badge ${idx === 0 ? "badge-lead" : "badge-member"}`}>
                            {member.role}
                          </span>
                        </div>
                        <div className="member-card-details-grid">
                          {member.email && (
                            <div className="member-info-row">
                              <Mail size={13} />
                              <span>{member.email}</span>
                            </div>
                          )}
                          {member.phone && (
                            <div className="member-info-row">
                              <Phone size={13} />
                              <span>{member.phone}</span>
                            </div>
                          )}
                          {member.altContact && (
                            <div className="member-info-row">
                              <Phone size={13} />
                              <span>Alt: {member.altContact}</span>
                            </div>
                          )}
                          {member.college && (
                            <div className="member-info-row">
                              <Building size={13} />
                              <span>{member.college}</span>
                            </div>
                          )}
                          {(member.department || member.year) && (
                            <div className="member-info-row">
                              <GraduationCap size={13} />
                              <span>
                                {[member.department, member.year].filter(Boolean).join(" • ")}
                              </span>
                            </div>
                          )}
                          {member.studentId && (
                            <div className="member-info-row">
                              <IdCard size={13} />
                              <span>ID: {member.studentId}</span>
                            </div>
                          )}
                          {member.skills && (
                            <div className="member-info-row">
                              <Sparkles size={13} />
                              <span>Skills: {member.skills}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="members-modal-footer">
              <button
                className="members-modal-close-action"
                onClick={() => setSelectedTeamForModal(null)}
              >
                Close Popup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Teams;
