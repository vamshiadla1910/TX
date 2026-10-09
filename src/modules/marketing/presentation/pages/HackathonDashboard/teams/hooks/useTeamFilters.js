import { useState, useMemo } from "react";
import {
  getRegistrationId,
  getTeamName,
  getCollege,
  getAttendance
} from "../../HackethonApi";
import { getLeadNameOnly } from "../utils/teamFormatters";
import { TEAM_FILTERS, ATTENDANCE_STATUS } from "../constants/teamConstants";

export function useTeamFilters(teams = []) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(TEAM_FILTERS.ALL);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const regId = getRegistrationId(team);
      const teamName = getTeamName(team);
      const lead = getLeadNameOnly(team);
      const college = getCollege(team);
      const attendance = getAttendance(team);

      if (
        filter === TEAM_FILTERS.PRESENT &&
        attendance !== ATTENDANCE_STATUS.PRESENT
      ) {
        return false;
      }

      if (
        filter === TEAM_FILTERS.ABSENT &&
        attendance !== ATTENDANCE_STATUS.ABSENT
      ) {
        return false;
      }

      if (
        filter === TEAM_FILTERS.PENDING &&
        attendance !== ATTENDANCE_STATUS.PENDING
      ) {
        return false;
      }

      if (!search.trim()) {
        return true;
      }

      const query = search.toLowerCase();

      return (
        String(regId || "")
          .toLowerCase()
          .includes(query) ||
        String(teamName || "")
          .toLowerCase()
          .includes(query) ||
        String(lead || "")
          .toLowerCase()
          .includes(query) ||
        String(college || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [teams, filter, search]);

  const counts = useMemo(() => {
    const total = teams.length;
    let present = 0;
    let absent = 0;
    let pending = 0;

    for (let i = 0; i < teams.length; i++) {
      const attendance = getAttendance(teams[i]);
      if (attendance === ATTENDANCE_STATUS.PRESENT) {
        present++;
      } else if (attendance === ATTENDANCE_STATUS.ABSENT) {
        absent++;
      } else if (attendance === ATTENDANCE_STATUS.PENDING) {
        pending++;
      }
    }

    return { total, present, absent, pending };
  }, [teams]);

  return {
    search,
    setSearch,
    filter,
    setFilter,
    filteredTeams,
    counts,
  };
}
