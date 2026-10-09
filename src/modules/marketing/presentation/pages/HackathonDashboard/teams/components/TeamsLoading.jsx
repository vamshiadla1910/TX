import { RefreshCw } from "lucide-react";

export default function TeamsLoading() {
  return (
    <div className="teams-page">
      <div className="teams-loading">
        <RefreshCw
          className="teams-spin"
          size={32}
        />
        <h3>Loading Team Verification</h3>
        <p>
          Fetching registrations from Google Sheets...
        </p>
      </div>
    </div>
  );
}
