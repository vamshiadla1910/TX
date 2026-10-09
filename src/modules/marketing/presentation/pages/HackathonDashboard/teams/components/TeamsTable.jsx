import TeamTableRow from "./TeamTableRow";
import { getRegistrationId } from "../../HackethonApi";

export default function TeamsTable({
  teams,
  savingId,
  onAttendance,
  onSelectTeam
}) {
  return (
    <div className="teams-table-card">
      <div className="teams-table-wrapper">
        <table className="teams-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Registration ID</th>
              <th>Team Lead Name</th>
              <th>Team Members</th>
              <th>College / Organization</th>
              <th>Project Name</th>
              <th>Attendance</th>
              <th>Verified</th>
              <th style={{ textAlign: "center" }}>
                Mark Attendance
              </th>
            </tr>
          </thead>

          <tbody>
            {teams.map((team, index) => {
              const regId = getRegistrationId(team) || `REG-${index + 1}`;
              const isSaving = savingId === regId;

              return (
                <TeamTableRow
                  key={regId || index}
                  team={team}
                  index={index}
                  isSaving={isSaving}
                  onAttendance={onAttendance}
                  onSelectTeam={onSelectTeam}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
