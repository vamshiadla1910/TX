import {
  getTeamName,
  getRegistrationId,
  getTeamLeadDetails,
  getTeamLead,
  getTeamMembersDetails,
  getCollege,
  getAttendance,
  getProjectTitle,
  normalize
} from "../../HackethonApi";
import { ATTENDANCE_STATUS } from "../constants/teamConstants";

export default function TeamDetailsModal({ team, onClose, onAttendance }) {
  if (!team) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "28px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px"
          }}
        >
          <div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#2563eb",
                letterSpacing: "1px"
              }}
            >
              TEAM VERIFICATION
            </span>

            <h2
              style={{
                margin: "4px 0 0",
                fontSize: "22px",
                color: "#1e293b"
              }}
            >
              {getTeamName(team)}
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                color: "#64748b",
                fontSize: "14px"
              }}
            >
              Registration ID:{" "}
              <strong>{getRegistrationId(team)}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "24px",
              lineHeight: 1,
              color: "#94a3b8",
              cursor: "pointer"
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "24px"
          }}
        >
          <div
            style={{
              padding: "14px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0"
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#475569",
                textTransform: "uppercase"
              }}
            >
              Team Lead Details
            </span>

            <div
              style={{
                marginTop: "6px",
                fontSize: "14px",
                color: "#1e293b",
                lineHeight: 1.5,
                wordBreak: "break-word"
              }}
            >
              {getTeamLeadDetails(team) ||
                getTeamLead(team) ||
                "Not provided"}
            </div>
          </div>

          <div
            style={{
              padding: "14px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0"
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#475569",
                textTransform: "uppercase"
              }}
            >
              Team Members Details
            </span>

            <div
              style={{
                marginTop: "6px",
                fontSize: "14px",
                color: "#1e293b",
                lineHeight: 1.5,
                wordBreak: "break-word"
              }}
            >
              {getTeamMembersDetails(team) || "None registered"}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px"
            }}
          >
            <div
              style={{
                padding: "12px",
                background: "#f8fafc",
                borderRadius: "10px",
                border: "1px solid #e2e8f0"
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase"
                }}
              >
                College / Organization
              </span>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "13px",
                  color: "#1e293b",
                  fontWeight: 600
                }}
              >
                {getCollege(team)}
              </div>
            </div>

            <div
              style={{
                padding: "12px",
                background: "#f8fafc",
                borderRadius: "10px",
                border: "1px solid #e2e8f0"
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase"
                }}
              >
                Attendance Status
              </span>

              <div style={{ marginTop: "4px" }}>
                <span
                  className={`team-status status-${normalize(
                    getAttendance(team)
                  )}`}
                >
                  {getAttendance(team)}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "12px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0"
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase"
              }}
            >
              Project Title
            </span>

            <div
              style={{
                marginTop: "4px",
                fontSize: "13px",
                color: "#1e293b"
              }}
            >
              {getProjectTitle(team)}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end"
          }}
        >
          <button
            type="button"
            onClick={() => {
              onAttendance(team, ATTENDANCE_STATUS.ABSENT);
              onClose();
            }}
            style={{
              padding: "10px 18px",
              background: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Mark Absent
          </button>

          <button
            type="button"
            onClick={() => {
              onAttendance(team, ATTENDANCE_STATUS.PRESENT);
              onClose();
            }}
            style={{
              padding: "10px 20px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            ✓ Verify & Mark Present
          </button>
        </div>
      </div>
    </div>
  );
}
