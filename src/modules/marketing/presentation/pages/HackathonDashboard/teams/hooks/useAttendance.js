import { useState, useRef, useEffect, useCallback } from "react";
import {
  getRegistrationId,
  updateAttendance
} from "../../HackethonApi";
import {
  ATTENDANCE_STATUS,
  VERIFICATION_STATUS,
  TEAM_EVENTS,
  NOTIFICATION_TIMEOUT_MS
} from "../constants/teamConstants";

export function useAttendance(onSuccessRefresh) {
  const [savingId, setSavingId] = useState("");
  const [notification, setNotification] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAttendance = useCallback(
    async (team, status) => {
      const registrationId = getRegistrationId(team);

      if (!registrationId) {
        alert("Registration ID not found for this team.");
        return;
      }

      try {
        setSavingId(registrationId);
        setNotification("");

        const verified =
          status === ATTENDANCE_STATUS.PRESENT
            ? VERIFICATION_STATUS.YES
            : VERIFICATION_STATUS.NO;

        await updateAttendance(registrationId, status, verified);

        if (onSuccessRefresh) {
          await onSuccessRefresh();
        }

        window.dispatchEvent(new Event(TEAM_EVENTS.ATTENDANCE_UPDATED));

        setNotification(
          `Team ${registrationId} marked as ${status} successfully.`
        );

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setNotification("");
        }, NOTIFICATION_TIMEOUT_MS);
      } catch (err) {
        console.error(err);
        alert(err?.message || `Unable to update attendance to ${status}.`);
      } finally {
        setSavingId("");
      }
    },
    [onSuccessRefresh]
  );

  return {
    savingId,
    notification,
    handleAttendance,
  };
}
