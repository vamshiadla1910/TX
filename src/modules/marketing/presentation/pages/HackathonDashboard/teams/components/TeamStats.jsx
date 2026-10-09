import { CheckCircle2, Clock3, Users, XCircle } from "lucide-react";
import { TEAM_FILTERS } from "../constants/teamConstants";

export default function TeamStats({ filter, counts, onSelectFilter }) {
  const { total = 0, present = 0, absent = 0, pending = 0 } = counts || {};

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        margin: "0 10px 20px"
      }}
    >
      <div
        onClick={() => onSelectFilter(TEAM_FILTERS.ALL)}
        style={{
          padding: "16px",
          background:
            filter === TEAM_FILTERS.ALL ? "#f1f5f9" : "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#2563eb"
          }}
        >
          <Users size={20} />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#64748b"
            }}
          >
            Total Teams
          </span>
        </div>

        <strong
          style={{
            fontSize: "24px",
            color: "#1e293b",
            marginTop: "6px",
            display: "block"
          }}
        >
          {total}
        </strong>
      </div>

      <div
        onClick={() => onSelectFilter(TEAM_FILTERS.PRESENT)}
        style={{
          padding: "16px",
          background:
            filter === TEAM_FILTERS.PRESENT ? "#ecfdf5" : "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#16a34a"
          }}
        >
          <CheckCircle2 size={20} />

          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#64748b"
            }}
          >
            Present
          </span>
        </div>

        <strong
          style={{
            fontSize: "24px",
            color: "#16a34a",
            marginTop: "6px",
            display: "block"
          }}
        >
          {present}
        </strong>
      </div>

      <div
        onClick={() => onSelectFilter(TEAM_FILTERS.ABSENT)}
        style={{
          padding: "16px",
          background:
            filter === TEAM_FILTERS.ABSENT ? "#fef2f2" : "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#dc2626"
          }}
        >
          <XCircle size={20} />

          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#64748b"
            }}
          >
            Absent
          </span>
        </div>

        <strong
          style={{
            fontSize: "24px",
            color: "#dc2626",
            marginTop: "6px",
            display: "block"
          }}
        >
          {absent}
        </strong>
      </div>

      <div
        onClick={() => onSelectFilter(TEAM_FILTERS.PENDING)}
        style={{
          padding: "16px",
          background:
            filter === TEAM_FILTERS.PENDING ? "#fffbeb" : "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#d97706"
          }}
        >
          <Clock3 size={20} />

          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#64748b"
            }}
          >
            Pending Verification
          </span>
        </div>

        <strong
          style={{
            fontSize: "24px",
            color: "#d97706",
            marginTop: "6px",
            display: "block"
          }}
        >
          {pending}
        </strong>
      </div>
    </div>
  );
}
