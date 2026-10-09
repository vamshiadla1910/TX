import { Users } from "lucide-react";

export default function TeamsEmptyState({ hasSearch }) {
  return (
    <div className="teams-empty">
      <Users size={50} />
      <h3>No teams found</h3>

      <p>
        {hasSearch
          ? "No registrations match your search filter."
          : "No registered teams found in Google Sheets."}
      </p>
    </div>
  );
}
