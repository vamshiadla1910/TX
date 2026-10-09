export const API_URL = "https://script.google.com/macros/s/AKfycbx9xPOsRUkcydceK1SP_-qV86LkSYR1bfSEYdjEag0Kax2NQlWF9oCwNNwMPyJ_ZXImxA/exec";

export const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

export const getField = (team, names, fallback = "") => {
  if (!team || typeof team !== "object") return fallback;
  const keys = Object.keys(team);
  const normalizedNames = names.map(normalize);

  // Exact match
  const exactKey = keys.find((key) => normalizedNames.includes(normalize(key)));
  if (exactKey && team[exactKey] !== undefined && team[exactKey] !== null && String(team[exactKey]).trim() !== "") {
    return team[exactKey];
  }

  // Partial match
  const partialKey = keys.find((key) => {
    const normalizedKey = normalize(key);
    return normalizedNames.some((name) => normalizedKey.includes(name) || name.includes(normalizedKey));
  });

  if (partialKey && team[partialKey] !== undefined && team[partialKey] !== null && String(team[partialKey]).trim() !== "") {
    return team[partialKey];
  }

  return fallback;
};

export const getRegistrationId = (team) => {
  return String(
    team?.registrationId ||
    getField(team, [
      "Registration ID",
      "Registration Number",
      "Registration No",
      "Reg No",
      "Team ID",
      "id",
      "ID"
    ]) ||
    ""
  ).trim();
};

export const getTeamName = (team) => {
  return (
    getField(team, [
      "Team Name",
      "Team",
      "Name of Team",
      "teamName",
      "name"
    ]) ||
    getField(team, [
      "title",
      "Project / Solution Title",
      "Project Title"
    ]) ||
    getTeamLead(team) ||
    "Unnamed Team"
  );
};

export const getTeamLeadDetails = (team) => {
  return (
    getField(team, [
      "Team Lead Details",
      "teamLeadDetails",
      "Team Lead",
      "Team Leader"
    ]) || ""
  );
};

export const getTeamMembersDetails = (team) => {
  return (
    getField(team, [
      "Team Members Details",
      "teamMembersDetails",
      "Team Members",
      "teamMembers",
      "members"
    ]) || ""
  );
};

export const getTeamLead = (team) => {
  // First check direct name fields
  const explicit = getField(team, [
    "lead_fullName",
    "student_fullName",
    "Leader Name",
    "Lead Name",
    "Participant Full Name"
  ]);
  if (explicit) return explicit;

  // Next check combined Team Lead Details
  const details = getTeamLeadDetails(team);
  if (details) {
    // If formatted like 'name: Ajay | ...' or 'fullName: Ajay | ...'
    const match = details.match(/(?:name|fullName)\s*:\s*([^|]+)/i);
    if (match && match[1]) {
      return match[1].trim();
    }
    return details;
  }

  return (
    getField(team, [
      "Team Lead",
      "Team Leader",
      "Full Name"
    ]) || "—"
  );
};

export const getCollege = (team) => {
  return (
    getField(team, [
      "lead_college",
      "student_college",
      "College / University",
      "Participant College / University",
      "College",
      "University",
      "Organization"
    ]) ||
    "—"
  );
};

export const getProjectTitle = (team) => {
  return (
    getField(team, [
      "title",
      "Project / Solution Title",
      "Project Title",
      "challengeTitle",
      "Preferred Challenge Title"
    ]) ||
    "Untitled Project"
  );
};

export const getAttendance = (team) => {
  const val = normalize(
    getField(team, [
      "Attendance",
      "Present",
      "Attendance Status",
      "Team Present",
      "Presence"
    ])
  );
  if (["present", "yes", "true", "1", "attended"].includes(val)) return "Present";
  if (["absent", "no", "false", "0", "notpresent", "notattended"].includes(val)) return "Absent";
  return "Pending";
};

export const isTeamVerified = (team) => {
  const val = normalize(
    getField(team, [
      "Team Verified",
      "TeamVerified",
      "Verified",
      "Team Verification"
    ])
  );
  if (["yes", "true", "1", "verified"].includes(val)) return "Yes";
  // If team is Present, it is also verified by coordinator
  if (getAttendance(team) === "Present") return "Yes";
  return "No";
};

export const getRoundStatus = (team, roundNum) => {
  if (roundNum === 1) {
    // CRITICAL: A team must NEVER appear in Round 1 if not Present
    if (getAttendance(team) !== "Present") return "Not Eligible";

    const explicit = normalize(
      getField(team, [
        "Round 1",
        "Round1",
        "Round 1 Status",
        "Round1_Status",
        "Round1_Decision",
        "Round1 Decision"
      ])
    );

    if (["qualified", "pass", "yes"].includes(explicit)) return "Qualified";
    if (["notqualified", "fail", "no", "eliminated"].includes(explicit)) return "Not Qualified";
    return "Eligible";
  }

  if (roundNum === 2) {
    const explicit = normalize(
      getField(team, [
        "Round 2",
        "Round2",
        "Round 2 Status",
        "Round2_Status",
        "Round2_Decision",
        "Round2 Decision"
      ])
    );

    if (["qualified", "pass", "yes"].includes(explicit)) return "Qualified";
    if (["notqualified", "fail", "no", "eliminated"].includes(explicit)) return "Not Qualified";
    if (["eligible"].includes(explicit)) return "Eligible";

    // If Round 1 is Qualified and Round 2 not marked yet, it is Eligible
    if (getRoundStatus(team, 1) === "Qualified") return "Eligible";
    return "Not Eligible";
  }

  if (roundNum === 3) {
    const explicit = normalize(
      getField(team, [
        "Round 3",
        "Round3",
        "Round 3 Status",
        "Round3_Status",
        "Round3_Decision",
        "Round3 Decision"
      ])
    );

    if (["qualified", "pass", "yes"].includes(explicit)) return "Qualified";
    if (["notqualified", "fail", "no", "eliminated"].includes(explicit)) return "Not Qualified";
    if (["eligible"].includes(explicit)) return "Eligible";

    // If Round 2 is Qualified and Round 3 not marked yet, it is Eligible
    if (getRoundStatus(team, 2) === "Qualified") return "Eligible";
    return "Not Eligible";
  }

  return "Not Eligible";
};

export const getFinalStatus = (team) => {
  const explicit = normalize(
    getField(team, [
      "Final Status",
      "FinalStatus",
      "Status",
      "Result"
    ])
  );

  if (["finalist", "qualified", "selected", "winner"].includes(explicit)) return "Finalist";
  if (["notselected", "eliminated", "rejected"].includes(explicit)) return "Not Selected";

  // Derive from Round 3 status if not explicitly set
  const r3 = getRoundStatus(team, 3);
  if (r3 === "Qualified") return "Finalist";
  if (r3 === "Not Qualified") return "Not Selected";

  return "Pending";
};

export const getJudgeRemarks = (team) => {
  return (
    getField(team, [
      "Judge Remarks",
      "JudgeRemarks",
      "Comments",
      "Round1_Comments",
      "Round2_Comments",
      "Round3_Comments"
    ]) ||
    ""
  );
};

// Response parser with detailed diagnostics
async function parseResponse(response) {
  const status = response.status;
  const url = response.url || API_URL;
  const contentType = response.headers?.get("content-type") || "";

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    const snippet = errorText.slice(0, 300);
    console.error(
      `Google Apps Script API error:\nstatus: ${status}\nurl: ${url}\ncontentType: ${contentType}\nresponse: ${snippet}`
    );
    throw new Error(
      `Google Apps Script API error (HTTP ${status}): ${snippet || response.statusText || "Request failed"}`
    );
  }

  const text = await response.text();
  if (!text || !text.trim()) {
    console.error(
      `Google Apps Script empty response:\nstatus: ${status}\nurl: ${url}\ncontentType: ${contentType}`
    );
    throw new Error("Empty response received from Google Apps Script.");
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    const snippet = text.slice(0, 300);
    console.error(
      `Google Apps Script API error:\nstatus: ${status}\nurl: ${url}\ncontentType: ${contentType}\nresponse: ${snippet}`
    );
    throw new Error(
      `Invalid response received from Google Apps Script (HTTP ${status}): ${snippet}`
    );
  }

  if (data && (data.status === "error" || data.success === false)) {
    throw new Error(data.message || data.error || "Google Apps Script returned an error.");
  }

  return data;
}

// Fetch helper with retry - always requests the target URL/API_URL, never a stale redirected URL
async function fetchWithRetry(url, options = {}, retries = 2) {
  const targetUrl = url.startsWith("http") ? url : `${API_URL}${url}`;
  const requestMethod = (options.method || "GET").toUpperCase();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(targetUrl, options);
      return await parseResponse(response);
    } catch (err) {
      // Never retry POST requests because registration may already
      // have been saved by Google Apps Script.
      if (requestMethod === "POST") {
        throw err;
      }

      if (attempt === retries) {
        throw err;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (attempt + 1))
      );
    }
  }
}

// API: Retrieve all teams directly from Google Sheets
export async function getTeams() {
  const data = await fetchWithRetry(`${API_URL}?action=getTeams&t=${Date.now()}`, {
    method: "GET",
    redirect: "follow"
  });
export function getLocalAttendanceMap() {
  try {
    return JSON.parse(localStorage.getItem("tx_hackathon_attendance") || "{}");
  } catch {
    return {};
  }
}

export function setLocalAttendanceMap(registrationId, attendance) {
  try {
    const map = getLocalAttendanceMap();
    map[String(registrationId).trim()] = attendance;
    localStorage.setItem("tx_hackathon_attendance", JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("hackathon_attendance_changed", { detail: { registrationId, attendance } }));
  } catch (err) {
    console.error("Failed to store local attendance", err);
  }
}

export async function saveAttendance(
  registrationId,
  attendance
) {
  // Store locally immediately for responsive local state sync
  setLocalAttendanceMap(registrationId, attendance);

  const list = data?.teams || data?.registrations || (Array.isArray(data) ? data : []);
  return Array.isArray(list) ? list : [];
}

// API: Retrieve Round 1 teams
export async function getRound1Teams() {
  const teams = await getTeams();
  return teams.filter((t) => getAttendance(t) === "Present");
}

// API: Retrieve Round 2 teams
export async function getRound2Teams() {
  const teams = await getTeams();
  return teams.filter((t) => {
    const status = getRoundStatus(t, 2);
    return status === "Eligible" || status === "Qualified" || status === "Not Qualified";
  });
}

// API: Retrieve Round 3 teams
export async function getRound3Teams() {
  const teams = await getTeams();
  return teams.filter((t) => {
    const status = getRoundStatus(t, 3);
    return status === "Eligible" || status === "Qualified" || status === "Not Qualified";
  });
}

// Generic Form-Encoded Post Helper (avoids CORS preflight OPTIONS request)
export async function postToApi(payload) {
  const formData = new URLSearchParams();
  Object.entries(payload || {}).forEach(([key, value]) => {
    formData.append(
      key,
      typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : String(value ?? "")
    );
  });
  // Backward compatibility with older Apps Script deployments that read e.parameter.formData
  formData.append("formData", JSON.stringify(payload || {}));

  console.log(`[HackathonApi] Dispatching form-encoded POST: ${payload?.action || "unknown"}`);

  return fetchWithRetry(API_URL, {
    method: "POST",
    redirect: "follow",
    body: formData
  });
}

// API: Save new registration
export async function saveRegistration(registrationData, registrationId) {
  const normalizedData = {
    ...registrationData,
    registrationId,
    teamLead:
      registrationData.teamLead ||
      registrationData.lead ||
      registrationData.student ||
      {},
    teamMembers:
      registrationData.teamMembers ||
      registrationData.members ||
      []
  };

  const payload = {
    action: "register",
    registrationId,
    data: normalizedData
  };

  return postToApi(payload);
}

// API: Update attendance
export async function updateAttendance(registrationId, attendance, verified = "Yes") {
  try {
    return await postToApi({
      action: "updateAttendance",
      registrationId,
      attendance,
      verified
    });
  } catch (err) {
    // Graceful fallback for existing script versions
    if (err.message && err.message.includes("Unknown action")) {
      return await postToApi({
        action: "saveAttendance",
        registrationId,
        attendance
      });
    }
    throw err;
  }
}

// Legacy alias for existing callers
export const saveAttendance = updateAttendance;

// API: Update Team Verification
export async function updateTeamVerification(registrationId, verified = "Yes") {
  return postToApi({
    action: "updateTeamVerification",
    registrationId,
    verified
  });
}

// API: Update Round 1
export async function updateRound1(registrationId, status, remarks = "", scores = {}) {
  try {
    return await postToApi({
      action: "updateRound1",
      registrationId,
      status,
      remarks,
      comments: remarks,
      ...scores
    });
  } catch (err) {
    if (err.message && err.message.includes("Unknown action")) {
      return await postToApi({
        action: "saveRound1Evaluation",
        registrationId,
        decision: status,
        comments: remarks,
        ...scores
      });
    }
    throw err;
  }
}

// Legacy alias for existing callers
export async function saveRound1Evaluation(evaluation) {
  const regId = evaluation.registrationId;
  const status =
    evaluation.decision === "QUALIFIED"
      ? "Qualified"
      : evaluation.decision === "NOT_QUALIFIED"
      ? "Not Qualified"
      : evaluation.decision || "Eligible";

  return updateRound1(regId, status, evaluation.comments, {
    understanding: evaluation.scores?.understanding ?? "",
    relevance: evaluation.scores?.relevance ?? "",
    innovation: evaluation.scores?.innovation ?? "",
    feasibility: evaluation.scores?.feasibility ?? "",
    technical: evaluation.scores?.technical ?? "",
    total: evaluation.total ?? ""
  });
}

// API: Update Round 2
export async function updateRound2(registrationId, status, remarks = "", scores = {}) {
  try {
    return await postToApi({
      action: "updateRound2",
      registrationId,
      status,
      remarks,
      comments: remarks,
      ...scores
    });
  } catch (err) {
    if (err.message && err.message.includes("Unknown action")) {
      return await postToApi({
        action: "saveRound1Evaluation",
        registrationId,
        Round2_Decision: status,
        comments: remarks,
        ...scores
      });
    }
    throw err;
  }
}

// API: Update Round 3
export async function updateRound3(registrationId, status, remarks = "", scores = {}) {
  try {
    return await postToApi({
      action: "updateRound3",
      registrationId,
      status,
      remarks,
      comments: remarks,
      ...scores
    });
  } catch (err) {
    if (err.message && err.message.includes("Unknown action")) {
      return await postToApi({
        action: "saveRound1Evaluation",
        registrationId,
        Round3_Decision: status,
        comments: remarks,
        ...scores
      });
    }
    throw err;
  }
}

// API: Update Final Status
export async function updateFinalStatus(registrationId, finalStatus) {
  return postToApi({
    action: "updateFinalStatus",
    registrationId,
    status: finalStatus,
    finalStatus
  });
}