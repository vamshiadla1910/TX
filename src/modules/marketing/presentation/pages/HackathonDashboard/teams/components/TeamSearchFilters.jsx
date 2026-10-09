import { Search } from "lucide-react";
import { TEAM_FILTERS } from "../constants/teamConstants";

export default function TeamSearchFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  counts
}) {
  const { total = 0, present = 0, absent = 0, pending = 0 } = counts || {};

  return (
    <div
      style={{
        margin: "0 10px 20px",
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        alignItems: "center"
      }}
    >
      <div
        style={{
          position: "relative",
          flex: "1",
          minWidth: "280px"
        }}
      >
        <Search
          size={18}
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8"
          }}
        />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Registration ID, Team Name, Lead, or College..."
          style={{
            width: "100%",
            padding: "11px 14px 11px 40px",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
            fontSize: "14px",
            outline: "none"
          }}
        />
      </div>

      <div
        className="teams-filters"
        style={{ margin: 0 }}
      >
        <button
          className={`teams-filter ${
            filter === TEAM_FILTERS.ALL ? "active" : ""
          }`}
          onClick={() => onFilterChange(TEAM_FILTERS.ALL)}
        >
          All ({total})
        </button>

        <button
          className={`teams-filter ${
            filter === TEAM_FILTERS.PRESENT ? "active" : ""
          }`}
          onClick={() => onFilterChange(TEAM_FILTERS.PRESENT)}
        >
          Present ({present})
        </button>

        <button
          className={`teams-filter ${
            filter === TEAM_FILTERS.ABSENT ? "active" : ""
          }`}
          onClick={() => onFilterChange(TEAM_FILTERS.ABSENT)}
        >
          Absent ({absent})
        </button>

        <button
          className={`teams-filter ${
            filter === TEAM_FILTERS.PENDING ? "active" : ""
          }`}
          onClick={() => onFilterChange(TEAM_FILTERS.PENDING)}
        >
          Pending ({pending})
        </button>
      </div>
    </div>
  );
}
