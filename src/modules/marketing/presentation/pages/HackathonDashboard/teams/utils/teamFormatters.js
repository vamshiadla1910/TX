import { getTeamLead, getTeamMembersDetails } from "../../HackethonApi.js";

export const getLeadNameOnly = (team) => {
  const lead = getTeamLead(team);

  if (!lead) {
    return "—";
  }

  if (typeof lead === "object" && lead !== null) {
    return (
      lead.fullName ||
      lead.name ||
      lead.student_fullName ||
      "—"
    );
  }

  if (typeof lead === "string") {
    const text = lead.trim();

    try {
      const parsed = JSON.parse(text);

      return (
        parsed?.fullName ||
        parsed?.name ||
        parsed?.student_fullName ||
        "—"
      );
    } catch {
      const match = text.match(
        /["']?(?:name|fullName|student_fullName)["']?\s*:\s*["']?([^"|,\n}]+)["']?/i
      );

      return match?.[1]?.trim() || text;
    }
  }

  return "—";
};

export const getMemberCount = (team) => {
  const members = getTeamMembersDetails(team);

  if (!members) {
    return 0;
  }

  if (Array.isArray(members)) {
    return members.length;
  }

  if (typeof members === "object") {
    if (Array.isArray(members.members)) {
      return members.members.length;
    }

    return Object.keys(members).length;
  }

  if (typeof members === "string") {
    const text = members.trim();

    if (!text) {
      return 0;
    }

    try {
      const parsed = JSON.parse(text);

      if (Array.isArray(parsed)) {
        return parsed.length;
      }

      if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.members)) {
          return parsed.members.length;
        }

        return Object.keys(parsed).length;
      }
    } catch {
      const nameMatches = text.match(
        /(?:name|fullName|student_fullName)\s*:/gi
      );

      if (nameMatches) {
        return nameMatches.length;
      }

      const lines = text
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length > 1) {
        return lines.length;
      }
    }
  }

  return 0;
};
