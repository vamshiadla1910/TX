/**
 * TX Hackathon Event Management - Google Apps Script
 * Spreadsheet ID: 1za1RkfrjAvHIIqYFEoyW-xwMuBcDL0tvuYo5lTDbszA
 * Main Sheet: pathwing
 */

const SPREADSHEET_ID = "1za1RkfrjAvHIIqYFEoyW-xwMuBcDL0tvuYo5lTDbszA";
const MAIN_SHEET_NAME = "pathwing";

const HEADERS = [
  "registrationId",
  "submittedAt",
  "Participant Type",
  "Team Lead Details",
  "Team Member 1 Details",
  "Team Member 2 Details",
  "Team Member 3 Details",
  "Team Member 4 Details",
  "Team Member 5 Details",
  "Team Member 6 Details",
  "Student Details",
  "Technology & Skills",
  "Challenge Selection",
  "Project Idea",
  "Previous Experience",
  "Institution",
  "Declaration & Consent",
  "Attendance",
  "AttendanceAt",
  "Team Verified",
  "Team Verified At",
  "Round 1 Status",
  "Round 1 Details",
  "Round 1 Evaluated At",
  "Round 2 Status",
  "Round 2 Details",
  "Round 2 Evaluated At",
  "Round 3 Status",
  "Round 3 Details",
  "Round 3 Evaluated At",
  "Final Status",
  "Final Updated At"
];

function setupSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(MAIN_SHEET_NAME);
  }

  sheet.clear();

  sheet
    .getRange(1, 1, 1, HEADERS.length)
    .setValues([HEADERS]);

  sheet.setFrozenRows(1);

  const headerRange = sheet.getRange(
    1,
    1,
    1,
    HEADERS.length
  );

  headerRange.setFontWeight("bold");
  headerRange.setBackground("#1e3a8a");
  headerRange.setFontColor("#ffffff");
  headerRange.setHorizontalAlignment("center");

  sheet.autoResizeColumns(
    1,
    HEADERS.length
  );

  return jsonResponse({
    status: "success",
    message: "New hackathon sheet structure created successfully.",
    sheet: MAIN_SHEET_NAME,
    columns: HEADERS
  });
}

function doGet(e) {
  try {
    const action =
      e &&
      e.parameter &&
      e.parameter.action
        ? e.parameter.action
        : "";

    if (action === "getTeams") {
      return getTeams();
    }

    if (action === "getRound1") {
      return getRound1Teams();
    }

    return jsonResponse({
      status: "success",
      message: "Hackathon API is running"
    });

  } catch (error) {
    return jsonResponse({
      status: "error",
      message: error.message
    });
  }
}

function doPost(e) {
  try {
    const data = parseRequest(e);

    if (!data || !data.action) {
      throw new Error("Action is required.");
    }

    switch (data.action) {
      case "register":
        return saveRegistration(data);

      case "saveAttendance":
      case "updateAttendance":
        return saveAttendance(data);

      case "updateTeamVerification":
        return updateTeamVerification(data);

      case "saveRound1Evaluation":
      case "updateRound1":
        return saveRoundEvaluation(data, 1);

      case "updateRound2":
        return saveRoundEvaluation(data, 2);

      case "updateRound3":
        return saveRoundEvaluation(data, 3);

      case "updateFinalStatus":
        return updateFinalStatus(data);

      default:
        throw new Error(
          "Unknown action: " +
          data.action
        );
    }

  } catch (error) {
    return jsonResponse({
      status: "error",
      message: error.message
    });
  }
}

function parseRequest(e) {
  if (
    e &&
    e.parameter &&
    e.parameter.formData
  ) {
    return JSON.parse(
      e.parameter.formData
    );
  }

  if (
    e &&
    e.postData &&
    e.postData.contents
  ) {
    return JSON.parse(
      e.postData.contents
    );
  }

  if (
    e &&
    e.parameter
  ) {
    const data = {};

    Object.keys(e.parameter).forEach(
      function(key) {
        data[key] = e.parameter[key];
      }
    );

    return data;
  }

  throw new Error(
    "No request data received."
  );
}

function getSheet() {
  const spreadsheet =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );

  let sheet =
    spreadsheet.getSheetByName(
      MAIN_SHEET_NAME
    );

  if (!sheet) {
    sheet =
      spreadsheet.insertSheet(
        MAIN_SHEET_NAME
      );

    sheet
      .getRange(
        1,
        1,
        1,
        HEADERS.length
      )
      .setValues([HEADERS]);

    sheet.setFrozenRows(1);
  }

  return sheet;
}

function saveRegistration(data) {
  if (!data.data) {
    throw new Error(
      "Registration data is missing."
    );
  }

  const sheet = getSheet();

  const lock =
    LockService.getScriptLock();

  lock.waitLock(10000);

  try {
    const registrationId =
      String(
        data.registrationId ||
        data.data.registrationId ||
        generateRegistrationId()
      ).trim();

    if (!registrationId) {
      throw new Error(
        "Registration ID is required."
      );
    }

    const values =
      sheet
        .getDataRange()
        .getValues();

    const headers = values[0];

    const registrationColumn =
      headers.indexOf(
        "registrationId"
      );

    for (
      let i = 1;
      i < values.length;
      i++
    ) {
      const existingId =
        String(
          values[i][
            registrationColumn
          ] || ""
        )
          .trim()
          .toLowerCase();

      if (
        existingId ===
        registrationId.toLowerCase()
      ) {
        return jsonResponse({
          status: "error",
          message:
            "Registration ID already exists.",
          registrationId:
            registrationId
        });
      }
    }

    const form =
      data.data || {};

    const participantType =
      form.participantType || "";

    const lead =
      participantType === "individual"
        ? (
            form.student ||
            form.lead ||
            form.teamLead ||
            {}
          )
        : (
            form.lead ||
            form.teamLead ||
            {}
          );

    const members =
      form.members ||
      form.teamMembers ||
      [];

    const rowData = {};

    rowData.registrationId =
      registrationId;

    rowData.submittedAt =
      new Date();

    rowData["Participant Type"] =
      participantType;

    rowData["Team Lead Details"] =
      stringifyObject(lead);

    for (
      let i = 0;
      i < 6;
      i++
    ) {
      rowData[
        "Team Member " +
        (i + 1) +
        " Details"
      ] =
        members[i]
          ? stringifyObject(
              members[i]
            )
          : "";
    }

    if (
      participantType ===
      "individual"
    ) {
      rowData["Student Details"] =
        stringifyObject(
          form.student || lead
        );
    } else {
      rowData["Student Details"] =
        "";
    }

    rowData["Technology & Skills"] =
      stringifyObject(
        form.technology || {}
      );

    rowData["Challenge Selection"] =
      stringifyObject(
        form.challenge || {}
      );

    rowData["Project Idea"] =
      stringifyObject(
        form.idea || {}
      );

    rowData["Previous Experience"] =
      stringifyObject(
        form.experience || {}
      );

    rowData["Institution"] =
      stringifyObject(
        form.institution || {}
      );

    rowData["Declaration & Consent"] =
      stringifyObject(
        form.declaration || {}
      );

    rowData["Attendance"] =
      "Pending";

    rowData["AttendanceAt"] =
      "";

    rowData["Team Verified"] =
      "No";

    rowData["Team Verified At"] =
      "";

    rowData["Round 1 Status"] =
      "Not Started";

    rowData["Round 1 Details"] =
      "";

    rowData["Round 1 Evaluated At"] =
      "";

    rowData["Round 2 Status"] =
      "Not Started";

    rowData["Round 2 Details"] =
      "";

    rowData["Round 2 Evaluated At"] =
      "";

    rowData["Round 3 Status"] =
      "Not Started";

    rowData["Round 3 Details"] =
      "";

    rowData["Round 3 Evaluated At"] =
      "";

    rowData["Final Status"] =
      "Pending";

    rowData["Final Updated At"] =
      "";

    const newRow =
      headers.map(function(header) {
        return rowData[header] !== undefined
          ? rowData[header]
          : "";
      });

    sheet.appendRow(newRow);

    SpreadsheetApp.flush();

    return jsonResponse({
      status: "success",
      message:
        "Registration saved successfully.",
      registrationId:
        registrationId
    });

  } finally {
    lock.releaseLock();
  }
}

function getTeams() {
  const sheet =
    getSheet();

  const values =
    sheet
      .getDataRange()
      .getValues();

  if (
    values.length < 2
  ) {
    return jsonResponse({
      status: "success",
      teams: []
    });
  }

  const headers =
    values[0];

  const teams =
    values
      .slice(1)
      .filter(function(row) {
        return row.some(function(value) {
          return (
            String(value || "")
              .trim() !== ""
          );
        });
      })
      .map(function(row, index) {
        return buildDashboardTeam(
          headers,
          row,
          index + 2
        );
      });

  return jsonResponse({
    status: "success",
    teams: teams
  });
}

function getRound1Teams() {
  const sheet =
    getSheet();

  const values =
    sheet
      .getDataRange()
      .getValues();

  if (
    values.length < 2
  ) {
    return jsonResponse({
      status: "success",
      round1: []
    });
  }

  const headers =
    values[0];

  const teams =
    values
      .slice(1)
      .map(function(row, index) {
        return buildDashboardTeam(
          headers,
          row,
          index + 2
        );
      })
      .filter(function(team) {
        return (
          normalize(
            team.Attendance
          ) === "present"
        );
      });

  return jsonResponse({
    status: "success",
    round1: teams
  });
}

function buildDashboardTeam(
  headers,
  row,
  rowNumber
) {
  const team = {};

  headers.forEach(
    function(header, index) {
      const key =
        String(header)
          .trim()
          .replace(
            /\s+/g,
            "_"
          );

      team[key] =
        row[index] !== undefined
          ? row[index]
          : "";
    }
  );

  const registrationId =
    String(
      getCell(
        headers,
        row,
        "registrationId"
      ) || ""
    ).trim();

  const participantType =
    String(
      getCell(
        headers,
        row,
        "Participant Type"
      ) || ""
    ).trim();

  const leadRaw =
    parseStoredObject(
      getCell(
        headers,
        row,
        "Team Lead Details"
      )
    );

  const studentRaw =
    parseStoredObject(
      getCell(
        headers,
        row,
        "Student Details"
      )
    );

  const lead =
    Object.keys(leadRaw).length
      ? leadRaw
      : studentRaw;

  const members = [];

  for (
    let i = 1;
    i <= 6;
    i++
  ) {
    const member =
      parseStoredObject(
        getCell(
          headers,
          row,
          "Team Member " +
            i +
            " Details"
        )
      );

    if (
      Object.keys(member).length
    ) {
      members.push(member);
    }
  }

  const project =
    parseStoredObject(
      getCell(
        headers,
        row,
        "Project Idea"
      )
    );

  const challenge =
    parseStoredObject(
      getCell(
        headers,
        row,
        "Challenge Selection"
      )
    );

  const technology =
    parseStoredObject(
      getCell(
        headers,
        row,
        "Technology & Skills"
      )
    );

  const attendance =
    getCell(
      headers,
      row,
      "Attendance"
    ) || "Pending";

  const teamVerified =
    getCell(
      headers,
      row,
      "Team Verified"
    ) || "No";

  const round1Status =
    getCell(
      headers,
      row,
      "Round 1 Status"
    ) || "Not Started";

  const round2Status =
    getCell(
      headers,
      row,
      "Round 2 Status"
    ) || "Not Started";

  const round3Status =
    getCell(
      headers,
      row,
      "Round 3 Status"
    ) || "Not Started";

  const finalStatus =
    getCell(
      headers,
      row,
      "Final Status"
    ) || "Pending";

  team.registrationId =
    registrationId;

  team["Registration ID"] =
    registrationId;

  team["Participant Type"] =
    participantType;

  team["Team Lead"] =
    lead.fullName ||
    "";

  team.teamLead =
    lead.fullName ||
    "";

  team.lead_fullName =
    lead.fullName ||
    "";

  team.student_fullName =
    studentRaw.fullName ||
    "";

  team["Team Lead Details"] =
    formatDetails(
      lead
    );

  team.teamLeadDetails =
    formatDetails(
      lead
    );

  team["Team Members Details"] =
    members
      .map(function(member, index) {
        return (
          "Member " +
          (index + 1) +
          ": " +
          formatDetails(member)
        );
      })
      .join("\n");

  team.teamMembersDetails =
    team["Team Members Details"];

  team.teamMembers =
    members;

  team["College / University"] =
    lead.college ||
    studentRaw.college ||
    "";

  team.lead_college =
    lead.college ||
    "";

  team.student_college =
    studentRaw.college ||
    "";

  team.College =
    lead.college ||
    studentRaw.college ||
    "";

  team.Department =
    lead.department ||
    studentRaw.department ||
    "";

  team.Email =
    lead.email ||
    studentRaw.email ||
    "";

  team.Mobile =
    lead.mobile ||
    studentRaw.mobile ||
    "";

  team["Project / Solution Title"] =
    project.title ||
    "";

  team["Project Title"] =
    project.title ||
    "";

  team.title =
    project.title ||
    "";

  team.projectTitle =
    project.title ||
    "";

  team["Challenge Category"] =
    challenge.category ||
    "";

  team.challengeId =
    challenge.challengeId ||
    "";

  team.challengeTitle =
    challenge.challengeTitle ||
    "";

  team["Technology / Skills"] =
    formatDetails(
      technology
    );

  team.Attendance =
    attendance;

  team.Present =
    attendance;

  team["Team Verified"] =
    teamVerified;

  team.Verified =
    teamVerified;

  team["Round 1"] =
    round1Status;

  team.Round1 =
    round1Status;

  team["Round 1 Status"] =
    round1Status;

  team["Round 2"] =
    round2Status;

  team.Round2 =
    round2Status;

  team["Round 2 Status"] =
    round2Status;

  team["Round 3"] =
    round3Status;

  team.Round3 =
    round3Status;

  team["Round 3 Status"] =
    round3Status;

  team["Final Status"] =
    finalStatus;

  team.FinalStatus =
    finalStatus;

  const round1Details =
    getCell(
      headers,
      row,
      "Round 1 Details"
    );

  const round2Details =
    getCell(
      headers,
      row,
      "Round 2 Details"
    );

  const round3Details =
    getCell(
      headers,
      row,
      "Round 3 Details"
    );

  team["Round 1 Details"] =
    round1Details || "";

  team["Round 2 Details"] =
    round2Details || "";

  team["Round 3 Details"] =
    round3Details || "";

  team["Judge Remarks"] =
    extractRemarks(
      round3Details ||
      round2Details ||
      round1Details
    );

  team.JudgeRemarks =
    team["Judge Remarks"];

  team.Comments =
    team["Judge Remarks"];

  team._rowNumber =
    rowNumber;

  return team;
}

function saveAttendance(data) {
  if (!data.registrationId) {
    throw new Error(
      "Registration ID is required."
    );
  }

  if (!data.attendance) {
    throw new Error(
      "Attendance is required."
    );
  }

  const sheet =
    getSheet();

  const values =
    sheet
      .getDataRange()
      .getValues();

  const headers =
    values[0];

  const rowNumber =
    findRowByRegistrationId(
      values,
      headers,
      data.registrationId
    );

  if (
    rowNumber === -1
  ) {
    throw new Error(
      "Registration not found: " +
      data.registrationId
    );
  }

  const attendance =
    normalize(
      data.attendance
    ) === "present"
      ? "Present"
      : "Absent";

  setCell(
    sheet,
    rowNumber,
    headers,
    "Attendance",
    attendance
  );

  setCell(
    sheet,
    rowNumber,
    headers,
    "AttendanceAt",
    new Date()
  );

  let verified =
    data.verified;

  if (
    verified === undefined ||
    verified === null ||
    verified === ""
  ) {
    verified =
      attendance === "Present"
        ? "Yes"
        : "No";
  }

  setCell(
    sheet,
    rowNumber,
    headers,
    "Team Verified",
    String(
      verified
    )
  );

  setCell(
    sheet,
    rowNumber,
    headers,
    "Team Verified At",
    new Date()
  );

  return jsonResponse({
    status: "success",
    message:
      "Attendance updated successfully.",
    registrationId:
      data.registrationId,
    attendance:
      attendance
  });
}

function updateTeamVerification(data) {
  if (!data.registrationId) {
    throw new Error(
      "Registration ID is required."
    );
  }

  const sheet =
    getSheet();

  const values =
    sheet
      .getDataRange()
      .getValues();

  const headers =
    values[0];

  const rowNumber =
    findRowByRegistrationId(
      values,
      headers,
      data.registrationId
    );

  if (
    rowNumber === -1
  ) {
    throw new Error(
      "Registration not found."
    );
  }

  const verified =
    normalize(
      data.verified
    ) === "yes" ||
    normalize(
      data.verified
    ) === "true" ||
    normalize(
      data.verified
    ) === "verified"
      ? "Yes"
      : "No";

  setCell(
    sheet,
    rowNumber,
    headers,
    "Team Verified",
    verified
  );

  setCell(
    sheet,
    rowNumber,
    headers,
    "Team Verified At",
    new Date()
  );

  return jsonResponse({
    status: "success",
    message:
      "Team verification updated successfully.",
    registrationId:
      data.registrationId,
    verified:
      verified
  });
}

function saveRoundEvaluation(
  data,
  round
) {
  if (!data.registrationId) {
    throw new Error(
      "Registration ID is required."
    );
  }

  const sheet =
    getSheet();

  const values =
    sheet
      .getDataRange()
      .getValues();

  const headers =
    values[0];

  const rowNumber =
    findRowByRegistrationId(
      values,
      headers,
      data.registrationId
    );

  if (
    rowNumber === -1
  ) {
    throw new Error(
      "Registration not found."
    );
  }

  const decision =
    normalizeDecision(
      data.status ||
      data.decision
    );

  const details = {
    decision:
      decision,

    understanding:
      numberOrBlank(
        data.understanding
      ),

    relevance:
      numberOrBlank(
        data.relevance
      ),

    innovation:
      numberOrBlank(
        data.innovation
      ),

    feasibility:
      numberOrBlank(
        data.feasibility
      ),

    technical:
      numberOrBlank(
        data.technical
      ),

    total:
      numberOrBlank(
        data.total
      ),

    comments:
      data.comments ||
      data.remarks ||
      "",

    evaluatedAt:
      new Date()
  };

  const statusColumn =
    "Round " +
    round +
    " Status";

  const detailsColumn =
    "Round " +
    round +
    " Details";

  const evaluatedColumn =
    "Round " +
    round +
    " Evaluated At";

  setCell(
    sheet,
    rowNumber,
    headers,
    statusColumn,
    decision
  );

  setCell(
    sheet,
    rowNumber,
    headers,
    detailsColumn,
    JSON.stringify(
      details
    )
  );

  setCell(
    sheet,
    rowNumber,
    headers,
    evaluatedColumn,
    new Date()
  );

  if (
    round === 3
  ) {
    if (
      decision ===
      "Qualified"
    ) {
      setCell(
        sheet,
        rowNumber,
        headers,
        "Final Status",
        "Finalist"
      );

      setCell(
        sheet,
        rowNumber,
        headers,
        "Final Updated At",
        new Date()
      );
    }

    if (
      decision ===
      "Not Qualified"
    ) {
      setCell(
        sheet,
        rowNumber,
        headers,
        "Final Status",
        "Not Selected"
      );

      setCell(
        sheet,
        rowNumber,
        headers,
        "Final Updated At",
        new Date()
      );
    }
  }

  SpreadsheetApp.flush();

  return jsonResponse({
    status: "success",
    message:
      "Round " +
      round +
      " evaluation saved successfully.",
    registrationId:
      data.registrationId,
    round:
      round,
    decision:
      decision
  });
}

function updateFinalStatus(data) {
  if (!data.registrationId) {
    throw new Error(
      "Registration ID is required."
    );
  }

  const sheet =
    getSheet();

  const values =
    sheet
      .getDataRange()
      .getValues();

  const headers =
    values[0];

  const rowNumber =
    findRowByRegistrationId(
      values,
      headers,
      data.registrationId
    );

  if (
    rowNumber === -1
  ) {
    throw new Error(
      "Registration not found."
    );
  }

  let status =
    data.finalStatus ||
    data.status ||
    "Pending";

  status =
    String(status)
      .trim();

  if (
    normalize(status) ===
    "qualified"
  ) {
    status =
      "Finalist";
  }

  if (
    normalize(status) ===
    "selected"
  ) {
    status =
      "Finalist";
  }

  if (
    normalize(status) ===
    "rejected"
  ) {
    status =
      "Not Selected";
  }

  setCell(
    sheet,
    rowNumber,
    headers,
    "Final Status",
    status
  );

  setCell(
    sheet,
    rowNumber,
    headers,
    "Final Updated At",
    new Date()
  );

  return jsonResponse({
    status: "success",
    message:
      "Final status updated successfully.",
    registrationId:
      data.registrationId,
    finalStatus:
      status
  });
}

function findRowByRegistrationId(
  values,
  headers,
  registrationId
) {
  const column =
    headers.indexOf(
      "registrationId"
    );

  if (
    column === -1
  ) {
    return -1;
  }

  const target =
    String(
      registrationId
    )
      .trim()
      .toLowerCase();

  for (
    let i = 1;
    i < values.length;
    i++
  ) {
    const current =
      String(
        values[i][column] || ""
      )
        .trim()
        .toLowerCase();

    if (
      current === target
    ) {
      return i + 1;
    }
  }

  return -1;
}

function getCell(
  headers,
  row,
  columnName
) {
  const index =
    headers.indexOf(
      columnName
    );

  if (
    index === -1
  ) {
    return "";
  }

  return row[index] !== undefined
    ? row[index]
    : "";
}

function setCell(
  sheet,
  rowNumber,
  headers,
  columnName,
  value
) {
  const column =
    headers.indexOf(
      columnName
    );

  if (
    column === -1
  ) {
    throw new Error(
      "Column not found: " +
      columnName
    );
  }

  sheet
    .getRange(
      rowNumber,
      column + 1
    )
    .setValue(value);
}

function stringifyObject(object) {
  if (
    object === null ||
    object === undefined
  ) {
    return "";
  }

  if (
    typeof object !==
    "object"
  ) {
    return String(object);
  }

  if (
    Array.isArray(object) &&
    object.length === 0
  ) {
    return "";
  }

  return JSON.stringify(
    object
  );
}

function parseStoredObject(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return {};
  }

  if (
    typeof value ===
    "object"
  ) {
    return value;
  }

  try {
    const parsed =
      JSON.parse(
        String(value)
      );

    if (
      parsed &&
      typeof parsed ===
      "object"
    ) {
      return parsed;
    }
  } catch (_) {}

  return {};
}

function formatDetails(object) {
  if (
    !object ||
    typeof object !==
    "object"
  ) {
    return String(
      object || ""
    );
  }

  return Object.keys(object)
    .map(function(key) {
      const value =
        object[key];

      if (
        Array.isArray(value)
      ) {
        return (
          key +
          ": " +
          value.join(", ")
        );
      }

      if (
        value !== null &&
        typeof value ===
        "object"
      ) {
        return (
          key +
          ": " +
          JSON.stringify(value)
        );
      }

      return (
        key +
        ": " +
        String(
          value ?? ""
        )
      );
    })
    .join(" | ");
}

function extractRemarks(value) {
  if (!value) {
    return "";
  }

  const parsed =
    parseStoredObject(
      value
    );

  if (
    parsed.comments
  ) {
    return parsed.comments;
  }

  return "";
}

function normalize(value) {
  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /[\s_-]+/g,
      ""
    );
}

function normalizeDecision(value) {
  const normalized =
    normalize(value);

  if (
    normalized ===
    "qualified" ||
    normalized ===
    "pass" ||
    normalized ===
    "yes"
  ) {
    return "Qualified";
  }

  if (
    normalized ===
    "notqualified" ||
    normalized ===
    "fail" ||
    normalized ===
    "no" ||
    normalized ===
    "eliminated"
  ) {
    return "Not Qualified";
  }

  return "Eligible";
}

function numberOrBlank(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "";
  }

  const number =
    Number(value);

  return Number.isNaN(
    number
  )
    ? ""
    : number;
}

function generateRegistrationId() {
  return (
    "TX2026-" +
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyyMMdd-HHmmss"
    )
  );
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(
      JSON.stringify(data)
    )
    .setMimeType(
      ContentService
        .MimeType
        .JSON
    );
}
