import { RefreshCw, XCircle } from "lucide-react";

export default function TeamsError({ error, onRetry }) {
  return (
    <div className="teams-page">
      <div className="teams-error">
        <XCircle size={45} color="#dc2626" />
        <h2>Unable to load teams</h2>
        <p>{error}</p>

        <button onClick={onRetry}>
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    </div>
  );
}
