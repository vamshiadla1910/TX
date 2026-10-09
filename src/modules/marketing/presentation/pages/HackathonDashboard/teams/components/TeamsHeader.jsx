import { RefreshCw } from "lucide-react";

export default function TeamsHeader({ onRefresh }) {
  return (
    <div className="teams-header">
      <div>
        <p
          style={{
            margin: "0 0 6px 10px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#64748b",
            letterSpacing: "1px"
          }}
        >
          COORDINATOR PORTAL
        </p>

        <h1>Team Verification & Attendance</h1>

        <p
          style={{
            margin: "4px 0 0 10px",
            fontSize: "14px",
            color: "#64748b"
          }}
        >
          Search teams and mark attendance. Marking
          Present qualifies the team for Round 1.
        </p>
      </div>

      <button
        className="export-btn"
        onClick={onRefresh}
        title="Refresh latest data"
      >
        <RefreshCw size={16} />
        Refresh
      </button>
    </div>
  );
}
