import { useState } from "react";
import "./Teams.css";

// Extracted Custom Hooks
import { useTeams } from "./hooks/useTeams";
import { useTeamFilters } from "./hooks/useTeamFilters";
import { useAttendance } from "./hooks/useAttendance";

// Extracted Presentation Components
import TeamsHeader from "./components/TeamsHeader";
import TeamStats from "./components/TeamStats";
import TeamSearchFilters from "./components/TeamSearchFilters";
import TeamsTable from "./components/TeamsTable";
import TeamDetailsModal from "./components/TeamDetailsModal";
import TeamsLoading from "./components/TeamsLoading";
import TeamsError from "./components/TeamsError";
import TeamsEmptyState from "./components/TeamsEmptyState";
import TeamsNotification from "./components/TeamsNotification";

const Teams = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  // 1. Data loading & lifecycle hook
  const { teams, loading, error, loadTeams } = useTeams();

  // 2. Search, filter & counting hook
  const {
    search,
    setSearch,
    filter,
    setFilter,
    filteredTeams,
    counts,
  } = useTeamFilters(teams);

  // 3. Attendance management hook
  const { savingId, notification, handleAttendance } = useAttendance(loadTeams);

  if (loading) {
    return <TeamsLoading />;
  }

  if (error) {
    return <TeamsError error={error} onRetry={loadTeams} />;
  }

  return (
    <div className="teams-page">
      <TeamsHeader onRefresh={loadTeams} />

      <TeamsNotification notification={notification} />

      <TeamStats
        filter={filter}
        counts={counts}
        onSelectFilter={setFilter}
      />

      <TeamSearchFilters
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        counts={counts}
      />

      {filteredTeams.length === 0 ? (
        <TeamsEmptyState hasSearch={Boolean(search.trim())} />
      ) : (
        <TeamsTable
          teams={filteredTeams}
          savingId={savingId}
          onAttendance={handleAttendance}
          onSelectTeam={setSelectedTeam}
        />
      )}

      <TeamDetailsModal
        team={selectedTeam}
        onClose={() => setSelectedTeam(null)}
        onAttendance={handleAttendance}
      />
    </div>
  );
};

export default Teams;
