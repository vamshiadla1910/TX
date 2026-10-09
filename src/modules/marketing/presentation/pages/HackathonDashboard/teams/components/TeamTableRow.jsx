import {
  CheckCircle2,
  Clock3,
  FileText,
  School,
  UserCheck,
  XCircle
} from "lucide-react";
import {
  getRegistrationId,
  getCollege,
  getProjectTitle,
  getAttendance,
  isTeamVerified,
  normalize
} from "../../HackethonApi";
import { getLeadNameOnly, getMemberCount } from "../utils/teamFormatters";
import { ATTENDANCE_STATUS, VERIFICATION_STATUS } from "../constants/teamConstants";

export default function TeamTableRow({
  team,
  index,
  isSaving,
  onAttendance,
  onSelectTeam
}) {
  const regId = getRegistrationId(team) || `REG-${index + 1}`;
  const leadName = getLeadNameOnly(team);
  const memberCount = getMemberCount(team);
  const college = getCollege(team);
  const project = getProjectTitle(team);
  const attendance = getAttendance(team);
  const verified = isTeamVerified(team);

  return (
    <tr>
      <td>{index + 1}</td>

      <td>
        <span className="registration">{regId}</span>
      </td>

      <td>
        <strong
          style={{
            color: "#1e293b",
            fontSize: "13px"
          }}
        >
          {leadName}
        </strong>
      </td>

      <td>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569"
          }}
        >
          {memberCount} {memberCount === 1 ? "Member" : "Members"}
        </span>
      </td>

      <td>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <School size={14} color="#64748b" />
          <span>{college}</span>
        </div>
      </td>

      <td>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            maxWidth: "200px"
          }}
        >
          <FileText size={14} color="#64748b" />
          <span
            style={{
              fontSize: "13px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {project}
          </span>
        </div>
      </td>

      <td>
        <span className={`team-status status-${normalize(attendance)}`}>
          {attendance === ATTENDANCE_STATUS.PRESENT && <CheckCircle2 size={13} />}
          {attendance === ATTENDANCE_STATUS.ABSENT && <XCircle size={13} />}
          {attendance === ATTENDANCE_STATUS.PENDING && <Clock3 size={13} />}
          {attendance}
        </span>
      </td>

      <td>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: verified === VERIFICATION_STATUS.YES ? "#16a34a" : "#94a3b8"
          }}
        >
          {verified === VERIFICATION_STATUS.YES ? "✓ Yes" : "No"}
        </span>
      </td>

      <td>
        <div
          className="attendance-actions"
          style={{
            justifyContent: "center"
          }}
        >
          <button
            className={`attendance-btn present-btn ${
              attendance === ATTENDANCE_STATUS.PRESENT ? "selected" : ""
            }`}
            disabled={isSaving}
            onClick={() => onAttendance(team, ATTENDANCE_STATUS.PRESENT)}
            style={{
              background:
                attendance === ATTENDANCE_STATUS.PRESENT ? "#16a34a" : "#fff",
              color:
                attendance === ATTENDANCE_STATUS.PRESENT ? "#fff" : "#16a34a",
              borderColor: "#16a34a",
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.6 : 1
            }}
          >
            <CheckCircle2 size={15} />
            {isSaving ? "Saving..." : "PRESENT"}
          </button>

          <button
            className={`attendance-btn absent-btn ${
              attendance === ATTENDANCE_STATUS.ABSENT ? "selected" : ""
            }`}
            disabled={isSaving}
            onClick={() => onAttendance(team, ATTENDANCE_STATUS.ABSENT)}
            style={{
              background:
                attendance === ATTENDANCE_STATUS.ABSENT ? "#dc2626" : "#fff",
              color:
                attendance === ATTENDANCE_STATUS.ABSENT ? "#fff" : "#dc2626",
              borderColor: "#dc2626",
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.6 : 1
            }}
          >
            <XCircle size={15} />
            {isSaving ? "Saving..." : "ABSENT"}
          </button>

          <button
            type="button"
            onClick={() => onSelectTeam(team)}
            title="Verify Full Team Details"
            style={{
              padding: "6px 10px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              color: "#475569",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <UserCheck size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
