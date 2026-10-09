import { useState, useEffect, useCallback } from "react";
import { getTeams } from "../../HackethonApi";
import { TEAM_EVENTS } from "../constants/teamConstants";

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTeams();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Unable to load teams from Google Sheets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetchInitialTeams = async () => {
      try {
        setError("");
        const data = await getTeams();
        if (!isCancelled) {
          setTeams(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error(err);
          setError(err?.message || "Unable to load teams from Google Sheets");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitialTeams();

    const handleUpdate = () => {
      loadTeams();
    };

    window.addEventListener(TEAM_EVENTS.REGISTRATION_UPDATED, handleUpdate);

    return () => {
      isCancelled = true;
      window.removeEventListener(TEAM_EVENTS.REGISTRATION_UPDATED, handleUpdate);
    };
  }, [loadTeams]);

  return {
    teams,
    setTeams,
    loading,
    error,
    loadTeams,
  };
}
