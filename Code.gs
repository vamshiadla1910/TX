const SPREADSHEET_ID = "1Bm0cZhzV07vcYRrcU38Vng5Jmde_ihSPZGhj4Cohfms";
const MAIN_SHEET_NAME = "Sheet1";
const ROUND1_SHEET_NAME = "Round1";
const ROUND2_SHEET_NAME = "Round2";
const ROUND3_SHEET_NAME = "Round3";

/* =========================================================
   GET REQUEST
========================================================= */
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : "";

    if (action === "getTeams") {
      return getTeams();
    }

    if (action === "getRound1") {
      return getRound1Teams();
    }

    if (action === "getRound2") {
      return getRound2Teams();
    }

    if (action === "getRound3") {
      return getRound3Teams();
    }

    if (action === "backfillRound2") {
      return backfillRound2MissingData();
    }

    if (action === "backfillRound3") {
      return backfillRound3MissingData();
    }

    if (action === "saveAttendance") {
      return saveAttendance({
        registrationId: e.parameter.registrationId,
        attendance: e.parameter.attendance
      });
    }

    if (action === "saveRound1Evaluation") {
      return saveRound1Evaluation({
        registrationId: e.parameter.registrationId,
        innovation: e.parameter.innovation,
        technical: e.parameter.technical,
        presentation: e.parameter.presentation,
        total: e.parameter.total,
        comments: e.parameter.comments,
        status: e.parameter.status
      });
    }

    if (action === "saveRound2Evaluation") {
      return saveRound2Evaluation({
        registrationId: e.parameter.registrationId,
        innovation: e.parameter.innovation,
        technical: e.parameter.technical,
        presentation: e.parameter.presentation,
        total: e.parameter.total,
        comments: e.parameter.comments,
        status: e.parameter.status
      });
    }

    if (action === "saveRound3Evaluation") {
      return saveRound3Evaluation({
        registrationId: e.parameter.registrationId,
        innovation: e.parameter.innovation,
        technical: e.parameter.technical,
        presentation: e.parameter.presentation,
        total: e.parameter.total,
        comments: e.parameter.comments,
        status: e.parameter.status
      });
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

/* =========================================================
   POST REQUEST
========================================================= */
function doPost(e) {
  try {
    if (!e || !e.parameter || !e.parameter.formData) {
      throw new Error("No formData received.");
    }

    const data = JSON.parse(e.parameter.formData);
    Logger.log("Received data: " + JSON.stringify(data));

    if (data.action === "register") {
      return saveRegistration(data);
    }

    if (data.action === "saveAttendance") {
      return saveAttendance(data);
    }

    if (data.action === "saveRound1Evaluation") {
      return saveRound1Evaluation(data);
    }

    if (data.action === "saveRound2Evaluation") {
      return saveRound2Evaluation(data);
    }

    if (data.action === "saveRound3Evaluation") {
      return saveRound3Evaluation(data);
    }

    if (data.action === "backfillRound2") {
      return backfillRound2MissingData();
    }

    if (data.action === "backfillRound3") {
      return backfillRound3MissingData();
    }

    throw new Error("Unknown action: " + data.action);
  } catch (error) {
    Logger.log("POST ERROR: " + error.stack);
    return jsonResponse({
      status: "error",
      message: error.message
    });
  }
}

/* =========================================================
   SAVE REGISTRATION
========================================================= */
function saveRegistration(data) {
  if (!data.registrationId) {
    throw new Error("Registration ID is required.");
  }
  if (!data.data) {
    throw new Error("Registration data is missing.");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(MAIN_SHEET_NAME);
  }

  const registration = data.data;
  const flattened = flattenObject(registration);

  flattened.registrationId = data.registrationId;
  flattened.submittedAt = new Date();

  let lastColumn = sheet.getLastColumn();

  if (sheet.getLastRow() === 0 || lastColumn === 0) {
    const headers = Object.keys(flattened);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    let headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    Object.keys(flattened).forEach((key) => {
      if (!headers.includes(key)) {
        headers.push(key);
        sheet.getRange(1, headers.length).setValue(key);
      }
    });
  }

  const finalLastColumn = sheet.getLastColumn();
  const finalHeaders = sheet.getRange(1, 1, 1, finalLastColumn).getValues()[0];

  const newRow = finalHeaders.map((header) => {
    if (flattened.hasOwnProperty(header)) {
      return flattened[header];
    }
    return "";
  });

  sheet.appendRow(newRow);
  SpreadsheetApp.flush();

  return jsonResponse({
    status: "success",
    message: "Registration saved successfully.",
    registrationId: data.registrationId
  });
}

/* =========================================================
   FLATTEN OBJECT
========================================================= */
function flattenObject(object, prefix, result) {
  result = result || {};
  prefix = prefix || "";

  Object.keys(object).forEach((key) => {
    const value = object[key];
    const newKey = prefix ? prefix + "_" + key : key;

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      flattenObject(value, newKey, result);
    } else if (Array.isArray(value)) {
      result[newKey] = value.join(", ");
    } else {
      result[newKey] = value;
    }
  });

  return result;
}

/* =========================================================
   GET ALL TEAMS
========================================================= */
function getTeams() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);

  if (!sheet) {
    throw new Error("Main sheet '" + MAIN_SHEET_NAME + "' not found.");
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return jsonResponse({ status: "success", teams: [] });
  }

  const headers = values[0];
  const teams = values
    .slice(1)
    .filter((row) => row.some((value) => String(value).trim() !== ""))
    .map((row, index) => {
      const team = {};
      headers.forEach((header, columnIndex) => {
        const rawKey = String(header).trim();
        const key = rawKey.replace(/\s+/g, "_");
        team[rawKey] = row[columnIndex] ?? "";
        team[key] = row[columnIndex] ?? "";
      });

      team._rowNumber = index + 2;
      team.registrationId = findRegistrationId(headers, row, index + 2);
      team["Team Lead"] = extractTeamLeadValue(headers, row);

      return team;
    });

  return jsonResponse({ status: "success", teams });
}

/* =========================================================
   GET ROUND 1 TEAMS
========================================================= */
function getRound1Teams() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(ROUND1_SHEET_NAME);

  if (!sheet) {
    return jsonResponse({ status: "success", round1: [] });
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return jsonResponse({ status: "success", round1: [] });
  }

  const headers = values[0];
  const round1 = values
    .slice(1)
    .filter((row) => row.some((value) => String(value).trim() !== ""))
    .map((row, index) => {
      const team = {};
      headers.forEach((header, columnIndex) => {
        const rawKey = String(header).trim();
        const key = rawKey.replace(/\s+/g, "_");
        team[rawKey] = row[columnIndex] ?? "";
        team[key] = row[columnIndex] ?? "";
      });

      team._rowNumber = index + 2;
      team.registrationId = findRegistrationId(headers, row, index + 2);
      team["Team Lead"] = extractTeamLeadValue(headers, row);

      return team;
    });

  return jsonResponse({ status: "success", round1 });
}

/* =========================================================
   GET ROUND 2 TEAMS
========================================================= */
function getRound2Teams() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(ROUND2_SHEET_NAME);

  if (!sheet) {
    return jsonResponse({ status: "success", round2: [] });
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return jsonResponse({ status: "success", round2: [] });
  }

  const headers = values[0];
  const round2 = values
    .slice(1)
    .filter((row) => row.some((value) => String(value).trim() !== ""))
    .map((row, index) => {
      const team = {};
      headers.forEach((header, columnIndex) => {
        const rawKey = String(header).trim();
        const key = rawKey.replace(/\s+/g, "_");
        team[rawKey] = row[columnIndex] ?? "";
        team[key] = row[columnIndex] ?? "";
      });

      team._rowNumber = index + 2;
      team.registrationId = findRegistrationId(headers, row, index + 2);
      team["Team Lead"] = extractTeamLeadValue(headers, row);

      return team;
    });

  return jsonResponse({ status: "success", round2 });
}

/* =========================================================
   GET ROUND 3 TEAMS
========================================================= */
function getRound3Teams() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(ROUND3_SHEET_NAME);

  if (!sheet) {
    return jsonResponse({ status: "success", round3: [] });
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return jsonResponse({ status: "success", round3: [] });
  }

  const headers = values[0];
  const round3 = values
    .slice(1)
    .filter((row) => row.some((value) => String(value).trim() !== ""))
    .map((row, index) => {
      const team = {};
      headers.forEach((header, columnIndex) => {
        const rawKey = String(header).trim();
        const key = rawKey.replace(/\s+/g, "_");
        team[rawKey] = row[columnIndex] ?? "";
        team[key] = row[columnIndex] ?? "";
      });

      team._rowNumber = index + 2;
      team.registrationId = findRegistrationId(headers, row, index + 2);
      team["Team Lead"] = extractTeamLeadValue(headers, row);

      return team;
    });

  return jsonResponse({ status: "success", round3 });
}

/* =========================================================
   SAVE ATTENDANCE
========================================================= */
function saveAttendance(data) {
  if (!data.registrationId) {
    throw new Error("Registration ID is required.");
  }

  if (!data.attendance) {
    throw new Error("Attendance is required.");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);

  if (!mainSheet) {
    throw new Error(
      "Main sheet '" + MAIN_SHEET_NAME + "' not found."
    );
  }

  let round1Sheet = spreadsheet.getSheetByName(ROUND1_SHEET_NAME);
  if (!round1Sheet) {
    round1Sheet = spreadsheet.insertSheet(ROUND1_SHEET_NAME);
  }

  const isPresent = String(data.attendance).trim().toLowerCase() === "present";
  const attendanceStatus = isPresent ? "Present" : "Absent";

  const mainValues = mainSheet.getDataRange().getValues();
  if (mainValues.length < 2) {
    throw new Error("No teams found in main sheet.");
  }

  const mainHeaders = mainValues[0];
  const registrationColumn = findRegistrationColumn(mainHeaders);

  let teamRow = null;
  let mainRowIndex = -1;
  for (let i = 1; i < mainValues.length; i++) {
    const currentId = String(mainValues[i][registrationColumn]).trim();
    if (currentId === String(data.registrationId).trim()) {
      teamRow = mainValues[i];
      mainRowIndex = i + 1;
      break;
    }
  }

  if (!teamRow) {
    throw new Error(
      "Team with Registration ID '" + data.registrationId + "' was not found in Sheet1."
    );
  }

  // 1. UPDATE ATTENDANCE IN MAIN SHEET (Sheet1)
  let attColIndex = -1;
  for (let c = 0; c < mainHeaders.length; c++) {
    const h = String(mainHeaders[c]).trim().toLowerCase().replace(/[\s_-]+/g, "");
    if (h === "attendance" || h === "attendancestatus") {
      attColIndex = c + 1;
      break;
    }
  }
  if (attColIndex === -1) {
    attColIndex = mainSheet.getLastColumn() + 1;
    mainSheet.getRange(1, attColIndex).setValue("Attendance");
    mainHeaders.push("Attendance");
  }
  mainSheet.getRange(mainRowIndex, attColIndex).setValue(attendanceStatus);

  // 2. IF MARKED ABSENT
  if (!isPresent) {
    if (round1Sheet.getLastRow() > 1) {
      const r1Values = round1Sheet.getDataRange().getValues();
      const r1Headers = r1Values[0];
      const r1RegCol = findRegistrationColumn(r1Headers);
      let r1AttCol = -1;
      for (let c = 0; c < r1Headers.length; c++) {
        const h = String(r1Headers[c]).trim().toLowerCase().replace(/[\s_-]+/g, "");
        if (h === "attendance") {
          r1AttCol = c + 1;
          break;
        }
      }
      for (let i = 1; i < r1Values.length; i++) {
        if (String(r1Values[i][r1RegCol]).trim() === String(data.registrationId).trim()) {
          if (r1AttCol !== -1) {
            round1Sheet.getRange(i + 1, r1AttCol).setValue("Absent");
          }
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    return jsonResponse({
      status: "success",
      message: "Team marked absent in Sheet1 and Round1.",
      attendance: "Absent",
      addedToRound1: false
    });
  }

  // 3. IF MARKED PRESENT -> ADD OR UPDATE IN ROUND 1
  const standardHeaders = [
    "Registration ID",
    "Team Lead",
    "Project Title",
    "Technology",
    "Attendance",
    "Round1AddedAt",
    "Innovation",
    "Technical",
    "Presentation",
    "Total",
    "Comments",
    "Status"
  ];

  if (round1Sheet.getLastRow() === 0) {
    round1Sheet.getRange(1, 1, 1, standardHeaders.length).setValues([standardHeaders]);
  } else {
    let existingHeaders = round1Sheet
      .getRange(1, 1, 1, round1Sheet.getLastColumn())
      .getValues()[0]
      .map((header) => String(header).trim());

    standardHeaders.forEach((header) => {
      if (!existingHeaders.includes(header)) {
        round1Sheet.getRange(1, existingHeaders.length + 1).setValue(header);
        existingHeaders.push(header);
      }
    });
  }

  const round1Headers = round1Sheet.getRange(1, 1, 1, round1Sheet.getLastColumn()).getValues()[0];

  if (round1Sheet.getLastRow() > 1) {
    const round1Values = round1Sheet.getDataRange().getValues();
    const round1RegistrationColumn = findRegistrationColumn(round1Headers);

    for (let i = 1; i < round1Values.length; i++) {
      const existingId = String(round1Values[i][round1RegistrationColumn]).trim();
      if (existingId === String(data.registrationId).trim()) {
        let r1AttCol = -1;
        for (let c = 0; c < round1Headers.length; c++) {
          const h = String(round1Headers[c]).trim().toLowerCase().replace(/[\s_-]+/g, "");
          if (h === "attendance") {
            r1AttCol = c + 1;
            break;
          }
        }
        if (r1AttCol !== -1) {
          round1Sheet.getRange(i + 1, r1AttCol).setValue("Present");
        }
        SpreadsheetApp.flush();
        return jsonResponse({
          status: "success",
          message: "Team marked Present in Sheet1 and Round1.",
          attendance: "Present",
          addedToRound1: false,
          alreadyExists: true
        });
      }
    }
  }

  const leadValue = extractTeamLeadValue(mainHeaders, teamRow);
  const projectValue = extractFieldValue(mainHeaders, teamRow, [
    "Project Title", "idea_projectTitle", "idea_title", "challenge_challengeTitle", "challenge_title"
  ]);
  const technologyValue = extractFieldValue(mainHeaders, teamRow, [
    "Technology", "Technologies", "technology_skills", "technology_domains", "Tech Stack"
  ]);

  const newRow = round1Headers.map((header) => {
    const normalizedHeader = String(header).trim().toLowerCase().replace(/[\s_-]+/g, "");

    if (normalizedHeader === "registrationid") return data.registrationId;
    if (normalizedHeader === "teamlead" || normalizedHeader === "leadfullname") return leadValue;
    if (normalizedHeader === "projecttitle" || normalizedHeader === "ideaprojecttitle") return projectValue;
    if (normalizedHeader === "technology" || normalizedHeader === "technologies" || normalizedHeader === "technologyskills") return technologyValue;
    if (normalizedHeader === "attendance") return "Present";
    if (normalizedHeader === "round1addedat") return new Date();

    const mainColumn = mainHeaders.findIndex(
      (mainHeader) => String(mainHeader).trim().toLowerCase() === String(header).trim().toLowerCase()
    );

    if (mainColumn !== -1) return teamRow[mainColumn];
    return "";
  });

  round1Sheet.appendRow(newRow);
  SpreadsheetApp.flush();

  return jsonResponse({
    status: "success",
    message: "Team marked Present in Sheet1 and added to Round1 successfully.",
    registrationId: data.registrationId,
    attendance: "Present",
    addedToRound1: true
  });
}

/* =========================================================
   SAVE ROUND 1 EVALUATION & ADD QUALIFIED TO ROUND 2 SHEET
========================================================= */
function saveRound1Evaluation(data) {
  if (!data.registrationId) {
    throw new Error("Registration ID is required.");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  let r1Sheet = spreadsheet.getSheetByName(ROUND1_SHEET_NAME);
  if (!r1Sheet) {
    r1Sheet = spreadsheet.insertSheet(ROUND1_SHEET_NAME);
  }

  let mainSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);

  const standardR1Headers = [
    "Registration ID", "Team Lead", "Project Title", "Technology",
    "Attendance", "Round1AddedAt", "Innovation", "Technical",
    "Presentation", "Total", "Comments", "Status"
  ];

  if (r1Sheet.getLastRow() === 0) {
    r1Sheet.getRange(1, 1, 1, standardR1Headers.length).setValues([standardR1Headers]);
  }

  let r1Values = r1Sheet.getDataRange().getValues();
  let headers = r1Values[0];
  let registrationColumn = findRegistrationColumn(headers);

  let rowNumber = -1;
  let targetRow = null;

  for (let i = 1; i < r1Values.length; i++) {
    const id = String(r1Values[i][registrationColumn]).trim();
    if (id === String(data.registrationId).trim()) {
      rowNumber = i + 1;
      targetRow = r1Values[i];
      break;
    }
  }

  if (rowNumber === -1 && mainSheet && mainSheet.getLastRow() > 1) {
    const mainValues = mainSheet.getDataRange().getValues();
    const mainHeaders = mainValues[0];
    const mainRegCol = findRegistrationColumn(mainHeaders);

    for (let i = 1; i < mainValues.length; i++) {
      if (String(mainValues[i][mainRegCol]).trim() === String(data.registrationId).trim()) {
        const mRow = mainValues[i];
        const leadVal = extractTeamLeadValue(mainHeaders, mRow);
        const projVal = extractFieldValue(mainHeaders, mRow, ["Project Title", "idea_projectTitle", "idea_title"]);
        const techVal = extractFieldValue(mainHeaders, mRow, ["Technology", "Technologies", "Tech Stack"]);

        const newR1Row = headers.map((h) => {
          const normH = String(h).trim().toLowerCase().replace(/[\s_-]+/g, "");
          if (normH === "registrationid") return data.registrationId;
          if (normH === "teamlead") return leadVal;
          if (normH === "projecttitle") return projVal;
          if (normH === "technology") return techVal;
          if (normH === "attendance") return "Present";
          if (normH === "round1addedat") return new Date();
          return "";
        });

        r1Sheet.appendRow(newR1Row);
        SpreadsheetApp.flush();

        r1Values = r1Sheet.getDataRange().getValues();
        rowNumber = r1Values.length;
        targetRow = r1Values[r1Values.length - 1];
        break;
      }
    }
  }

  if (rowNumber === -1) {
    const newR1Row = headers.map((h) => {
      const normH = String(h).trim().toLowerCase().replace(/[\s_-]+/g, "");
      if (normH === "registrationid") return data.registrationId;
      if (normH === "attendance") return "Present";
      if (normH === "round1addedat") return new Date();
      return "";
    });

    r1Sheet.appendRow(newR1Row);
    SpreadsheetApp.flush();

    r1Values = r1Sheet.getDataRange().getValues();
    rowNumber = r1Values.length;
    targetRow = r1Values[r1Values.length - 1];
  }

  const statusStr = String(data.status || "").trim().toUpperCase();
  const isQualified = statusStr === "QUALIFIED" || statusStr === "R1 QUALIFIED" || statusStr === "PASS";
  const formattedStatus = isQualified ? "R1 QUALIFIED" : (statusStr === "NOT_QUALIFIED" ? "ELIMINATED" : data.status);

  const evaluationFields = {
    Innovation: data.innovation,
    Technical: data.technical,
    Presentation: data.presentation,
    Total: data.total,
    Comments: data.comments,
    Status: formattedStatus
  };

  Object.keys(evaluationFields).forEach((field) => {
    let column = headers.indexOf(field);
    if (column === -1) {
      column = r1Sheet.getLastColumn();
      r1Sheet.getRange(1, column + 1).setValue(field);
      headers.push(field);
      column = headers.length - 1;
    }

    r1Sheet.getRange(rowNumber, column + 1).setValue(evaluationFields[field]);
  });

  SpreadsheetApp.flush();

  /* =========================================================
     IF QUALIFIED IN ROUND 1 -> CREATE / UPDATE IN ROUND 2 SHEET
  ========================================================= */
  if (isQualified) {
    let r2Sheet = spreadsheet.getSheetByName(ROUND2_SHEET_NAME);
    if (!r2Sheet) {
      r2Sheet = spreadsheet.insertSheet(ROUND2_SHEET_NAME);
    }

    const standardR2Headers = [
      "Registration ID",
      "Team Lead",
      "Project Title",
      "Technology",
      "Attendance",
      "Round2AddedAt",
      "Innovation",
      "Technical",
      "Presentation",
      "Total",
      "Comments",
      "Status",
      "Round1 Total",
      "Round1 Qualified Date"
    ];

    if (r2Sheet.getLastRow() === 0) {
      r2Sheet.getRange(1, 1, 1, standardR2Headers.length).setValues([standardR2Headers]);
    } else {
      let existingHeaders = r2Sheet
        .getRange(1, 1, 1, r2Sheet.getLastColumn())
        .getValues()[0]
        .map((h) => String(h).trim());

      standardR2Headers.forEach((header) => {
        if (!existingHeaders.includes(header)) {
          r2Sheet.getRange(1, existingHeaders.length + 1).setValue(header);
          existingHeaders.push(header);
        }
      });
    }

    const r2Headers = r2Sheet.getRange(1, 1, 1, r2Sheet.getLastColumn()).getValues()[0];
    const r2RegCol = findRegistrationColumn(r2Headers);

    const mainData = getTeamDataFromSheet(mainSheet, data.registrationId);
    const r1Data = getTeamDataFromSheet(r1Sheet, data.registrationId);

    const mergedDataMap = {
      ...(mainData ? mainData.dataMap : {}),
      ...(r1Data ? r1Data.dataMap : {})
    };

    const leadValue = extractLeadFromDataMap(mergedDataMap);
    const projectValue = extractValueFromDataMap(mergedDataMap, [
      "Project Title", "Project / Solution Title", "idea_projectTitle", "idea_title", "challenge_challengeTitle", "challenge_title", "Project"
    ]);
    const technologyValue = extractValueFromDataMap(mergedDataMap, [
      "Technology", "Technologies", "technology_skills", "technology_domains", "Tech Stack", "Proposed Technology Stack"
    ]);

    let existingR2RowIndex = -1;
    if (r2Sheet.getLastRow() > 1) {
      const r2Values = r2Sheet.getDataRange().getValues();
      for (let i = 1; i < r2Values.length; i++) {
        if (String(r2Values[i][r2RegCol]).trim() === String(data.registrationId).trim()) {
          existingR2RowIndex = i + 1;
          break;
        }
      }
    }

    const qualifiedDate = new Date();

    if (existingR2RowIndex !== -1) {
      r2Headers.forEach((header, colIndex) => {
        const normH = String(header).trim().toLowerCase().replace(/[\s_-]+/g, "");

        if (normH === "teamlead" && leadValue) {
          r2Sheet.getRange(existingR2RowIndex, colIndex + 1).setValue(leadValue);
        } else if (normH === "projecttitle" && projectValue) {
          r2Sheet.getRange(existingR2RowIndex, colIndex + 1).setValue(projectValue);
        } else if (normH === "technology" && technologyValue) {
          r2Sheet.getRange(existingR2RowIndex, colIndex + 1).setValue(technologyValue);
        } else if (normH === "attendance") {
          r2Sheet.getRange(existingR2RowIndex, colIndex + 1).setValue("Present");
        } else if (normH === "round2addedat") {
          r2Sheet.getRange(existingR2RowIndex, colIndex + 1).setValue(qualifiedDate);
        } else if (normH === "round1total") {
          r2Sheet.getRange(existingR2RowIndex, colIndex + 1).setValue(data.total);
        } else if (normH === "round1qualifieddate" || normH === "qualifieddate") {
          r2Sheet.getRange(existingR2RowIndex, colIndex + 1).setValue(qualifiedDate);
        }
      });
    } else {
      const newR2Row = r2Headers.map((header) => {
        const normH = String(header).trim().toLowerCase().replace(/[\s_-]+/g, "");

        if (normH === "registrationid") return data.registrationId;
        if (normH === "teamlead" || normH === "leadfullname") return leadValue;
        if (normH === "projecttitle") return projectValue;
        if (normH === "technology") return technologyValue;
        if (normH === "attendance") return "Present";
        if (normH === "round2addedat") return qualifiedDate;
        if (normH === "round1total") return data.total;
        if (normH === "round1qualifieddate" || normH === "qualifieddate") return qualifiedDate;
        if (normH === "status") return "PRESENTED";

        if (mergedDataMap[header] !== undefined && mergedDataMap[header] !== null) {
          return mergedDataMap[header];
        }

        return "";
      });

      r2Sheet.appendRow(newR2Row);
    }

    SpreadsheetApp.flush();
  }

  return jsonResponse({
    status: "success",
    message: "Round1 evaluation saved successfully." + (isQualified ? " Qualified team added/updated in Round 2 sheet." : "")
  });
}

/* =========================================================
   SAVE ROUND 2 EVALUATION & ADD QUALIFIED TO ROUND 3 SHEET
========================================================= */
function saveRound2Evaluation(data) {
  if (!data.registrationId) {
    throw new Error("Registration ID is required.");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(ROUND2_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(ROUND2_SHEET_NAME);
  }

  let mainSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
  let r1Sheet = spreadsheet.getSheetByName(ROUND1_SHEET_NAME);

  const standardR2Headers = [
    "Registration ID",
    "Team Lead",
    "Project Title",
    "Technology",
    "Attendance",
    "Round2AddedAt",
    "Innovation",
    "Technical",
    "Presentation",
    "Total",
    "Comments",
    "Status",
    "Round1 Total",
    "Round1 Qualified Date"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, standardR2Headers.length).setValues([standardR2Headers]);
  }

  let values = sheet.getDataRange().getValues();
  let headers = values[0];
  let registrationColumn = findRegistrationColumn(headers);

  let rowNumber = -1;
  for (let i = 1; i < values.length; i++) {
    const id = String(values[i][registrationColumn]).trim();
    if (id === String(data.registrationId).trim()) {
      rowNumber = i + 1;
      break;
    }
  }

  if (rowNumber === -1) {
    const mainData = getTeamDataFromSheet(mainSheet, data.registrationId);
    const r1Data = getTeamDataFromSheet(r1Sheet, data.registrationId);

    const mergedDataMap = {
      ...(mainData ? mainData.dataMap : {}),
      ...(r1Data ? r1Data.dataMap : {})
    };

    const leadValue = extractLeadFromDataMap(mergedDataMap);
    const projectValue = extractValueFromDataMap(mergedDataMap, [
      "Project Title", "Project / Solution Title", "idea_projectTitle", "idea_title", "challenge_challengeTitle", "challenge_title", "Project"
    ]);
    const technologyValue = extractValueFromDataMap(mergedDataMap, [
      "Technology", "Technologies", "technology_skills", "technology_domains", "Tech Stack", "Proposed Technology Stack"
    ]);

    const newRow = headers.map((header) => {
      const normH = String(header).trim().toLowerCase().replace(/[\s_-]+/g, "");

      if (normH === "registrationid") return data.registrationId;
      if (normH === "teamlead" || normH === "leadfullname") return leadValue;
      if (normH === "projecttitle") return projectValue;
      if (normH === "technology") return technologyValue;
      if (normH === "attendance") return "Present";
      if (normH === "round2addedat") return new Date();

      if (mergedDataMap[header] !== undefined && mergedDataMap[header] !== null) {
        return mergedDataMap[header];
      }

      return "";
    });

    sheet.appendRow(newRow);
    SpreadsheetApp.flush();

    values = sheet.getDataRange().getValues();
    rowNumber = values.length;
  }

  const statusStr = String(data.status || "").trim().toUpperCase();
  const isQualified = statusStr.includes("QUALIFIED") || statusStr === "PASS";
  const formattedStatus = isQualified ? "R2 QUALIFIED" : (statusStr === "NOT_QUALIFIED" ? "ELIMINATED" : data.status);

  const evaluationFields = {
    Innovation: data.innovation,
    Technical: data.technical,
    Presentation: data.presentation,
    Total: data.total,
    Comments: data.comments,
    Status: formattedStatus
  };

  Object.keys(evaluationFields).forEach((field) => {
    let column = headers.indexOf(field);
    if (column === -1) {
      column = sheet.getLastColumn();
      sheet.getRange(1, column + 1).setValue(field);
      headers.push(field);
      column = headers.length - 1;
    }

    sheet.getRange(rowNumber, column + 1).setValue(evaluationFields[field]);
  });

  SpreadsheetApp.flush();

  /* =========================================================
     IF STATUS IS R2 QUALIFIED -> ADD / UPDATE IN ROUND 3 SHEET
  ========================================================= */
  if (isQualified) {
    let r3Sheet = spreadsheet.getSheetByName(ROUND3_SHEET_NAME);
    if (!r3Sheet) {
      r3Sheet = spreadsheet.insertSheet(ROUND3_SHEET_NAME);
    }

    const standardR3Headers = [
      "Registration ID",
      "Team Lead",
      "Project Title",
      "Technology",
      "Attendance",
      "Round3AddedAt",
      "Innovation",
      "Technical",
      "Presentation",
      "Total",
      "Comments",
      "Status",
      "Round2 Total",
      "Round2 Qualified Date"
    ];

    if (r3Sheet.getLastRow() === 0) {
      r3Sheet.getRange(1, 1, 1, standardR3Headers.length).setValues([standardR3Headers]);
    } else {
      let existingHeaders = r3Sheet
        .getRange(1, 1, 1, r3Sheet.getLastColumn())
        .getValues()[0]
        .map((h) => String(h).trim());

      standardR3Headers.forEach((header) => {
        if (!existingHeaders.includes(header)) {
          r3Sheet.getRange(1, existingHeaders.length + 1).setValue(header);
          existingHeaders.push(header);
        }
      });
    }

    const r3Headers = r3Sheet.getRange(1, 1, 1, r3Sheet.getLastColumn()).getValues()[0];
    const r3RegCol = findRegistrationColumn(r3Headers);

    const mainData = getTeamDataFromSheet(mainSheet, data.registrationId);
    const r1Data = getTeamDataFromSheet(r1Sheet, data.registrationId);
    const r2Data = getTeamDataFromSheet(sheet, data.registrationId);

    const mergedDataMap = {
      ...(mainData ? mainData.dataMap : {}),
      ...(r1Data ? r1Data.dataMap : {}),
      ...(r2Data ? r2Data.dataMap : {})
    };

    const leadValue = extractLeadFromDataMap(mergedDataMap);
    const projectValue = extractValueFromDataMap(mergedDataMap, [
      "Project Title", "Project / Solution Title", "idea_projectTitle", "idea_title", "challenge_challengeTitle", "challenge_title", "Project"
    ]);
    const technologyValue = extractValueFromDataMap(mergedDataMap, [
      "Technology", "Technologies", "technology_skills", "technology_domains", "Tech Stack", "Proposed Technology Stack"
    ]);

    let existingR3RowIndex = -1;
    if (r3Sheet.getLastRow() > 1) {
      const r3Values = r3Sheet.getDataRange().getValues();
      for (let i = 1; i < r3Values.length; i++) {
        if (String(r3Values[i][r3RegCol]).trim() === String(data.registrationId).trim()) {
          existingR3RowIndex = i + 1;
          break;
        }
      }
    }

    const qualifiedDate = new Date();

    if (existingR3RowIndex !== -1) {
      r3Headers.forEach((header, colIndex) => {
        const normH = String(header).trim().toLowerCase().replace(/[\s_-]+/g, "");

        if (normH === "teamlead" && leadValue) {
          r3Sheet.getRange(existingR3RowIndex, colIndex + 1).setValue(leadValue);
        } else if (normH === "projecttitle" && projectValue) {
          r3Sheet.getRange(existingR3RowIndex, colIndex + 1).setValue(projectValue);
        } else if (normH === "technology" && technologyValue) {
          r3Sheet.getRange(existingR3RowIndex, colIndex + 1).setValue(technologyValue);
        } else if (normH === "attendance") {
          r3Sheet.getRange(existingR3RowIndex, colIndex + 1).setValue("Present");
        } else if (normH === "round3addedat") {
          r3Sheet.getRange(existingR3RowIndex, colIndex + 1).setValue(qualifiedDate);
        } else if (normH === "round2total") {
          r3Sheet.getRange(existingR3RowIndex, colIndex + 1).setValue(data.total);
        } else if (normH === "round2qualifieddate" || normH === "qualifieddate") {
          r3Sheet.getRange(existingR3RowIndex, colIndex + 1).setValue(qualifiedDate);
        }
      });
    } else {
      const newR3Row = r3Headers.map((header) => {
        const normH = String(header).trim().toLowerCase().replace(/[\s_-]+/g, "");

        if (normH === "registrationid") return data.registrationId;
        if (normH === "teamlead" || normH === "leadfullname") return leadValue;
        if (normH === "projecttitle") return projectValue;
        if (normH === "technology") return technologyValue;
        if (normH === "attendance") return "Present";
        if (normH === "round3addedat") return qualifiedDate;
        if (normH === "round2total") return data.total;
        if (normH === "round2qualifieddate" || normH === "qualifieddate") return qualifiedDate;
        if (normH === "status") return "PRESENTED";

        if (mergedDataMap[header] !== undefined && mergedDataMap[header] !== null) {
          return mergedDataMap[header];
        }

        return "";
      });

      r3Sheet.appendRow(newR3Row);
    }

    SpreadsheetApp.flush();
  }

  return jsonResponse({
    status: "success",
    message: "Round2 evaluation saved successfully." + (isQualified ? " Qualified team added/updated in Round 3 sheet." : "")
  });
}

/* =========================================================
   SAVE ROUND 3 EVALUATION
========================================================= */
function saveRound3Evaluation(data) {
  if (!data.registrationId) {
    throw new Error("Registration ID is required.");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(ROUND3_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(ROUND3_SHEET_NAME);
  }

  let mainSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
  let r1Sheet = spreadsheet.getSheetByName(ROUND1_SHEET_NAME);
  let r2Sheet = spreadsheet.getSheetByName(ROUND2_SHEET_NAME);

  const standardR3Headers = [
    "Registration ID",
    "Team Lead",
    "Project Title",
    "Technology",
    "Attendance",
    "Round3AddedAt",
    "Innovation",
    "Technical",
    "Presentation",
    "Total",
    "Comments",
    "Status"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, standardR3Headers.length).setValues([standardR3Headers]);
  } else {
    let existingHeaders = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0]
      .map((h) => String(h).trim());

    standardR3Headers.forEach((header) => {
      if (!existingHeaders.includes(header)) {
        sheet.getRange(1, existingHeaders.length + 1).setValue(header);
        existingHeaders.push(header);
      }
    });
  }

  let values = sheet.getDataRange().getValues();
  let headers = values[0];
  let registrationColumn = findRegistrationColumn(headers);

  let rowNumber = -1;
  for (let i = 1; i < values.length; i++) {
    const id = String(values[i][registrationColumn]).trim();
    if (id === String(data.registrationId).trim()) {
      rowNumber = i + 1;
      break;
    }
  }

  if (rowNumber === -1) {
    const mainData = getTeamDataFromSheet(mainSheet, data.registrationId);
    const r1Data = getTeamDataFromSheet(r1Sheet, data.registrationId);
    const r2Data = getTeamDataFromSheet(r2Sheet, data.registrationId);

    const mergedDataMap = {
      ...(mainData ? mainData.dataMap : {}),
      ...(r1Data ? r1Data.dataMap : {}),
      ...(r2Data ? r2Data.dataMap : {})
    };

    const leadValue = extractLeadFromDataMap(mergedDataMap);
    const projectValue = extractValueFromDataMap(mergedDataMap, [
      "Project Title", "Project / Solution Title", "idea_projectTitle", "idea_title", "challenge_challengeTitle", "challenge_title", "Project"
    ]);
    const technologyValue = extractValueFromDataMap(mergedDataMap, [
      "Technology", "Technologies", "technology_skills", "technology_domains", "Tech Stack", "Proposed Technology Stack"
    ]);

    const newR3Row = headers.map((header) => {
      const normH = String(header).trim().toLowerCase().replace(/[\s_-]+/g, "");

      if (normH === "registrationid") return data.registrationId;
      if (normH === "teamlead" || normH === "leadfullname") return leadValue;
      if (normH === "projecttitle") return projectValue;
      if (normH === "technology") return technologyValue;
      if (normH === "attendance") return "Present";
      if (normH === "round3addedat") return new Date();

      if (mergedDataMap[header] !== undefined && mergedDataMap[header] !== null) {
        return mergedDataMap[header];
      }

      return "";
    });

    sheet.appendRow(newR3Row);
    SpreadsheetApp.flush();

    values = sheet.getDataRange().getValues();
    rowNumber = values.length;
  }

  const statusStr = String(data.status || "").trim().toUpperCase();
  const isQualified = statusStr.includes("QUALIFIED") || statusStr === "PASS";
  const formattedStatus = isQualified ? "R3 QUALIFIED" : (statusStr === "NOT_QUALIFIED" ? "ELIMINATED" : data.status);

  const evaluationFields = {
    Innovation: data.innovation,
    Technical: data.technical,
    Presentation: data.presentation,
    Total: data.total,
    Comments: data.comments,
    Status: formattedStatus
  };

  Object.keys(evaluationFields).forEach((field) => {
    let column = headers.indexOf(field);
    if (column === -1) {
      column = sheet.getLastColumn();
      sheet.getRange(1, column + 1).setValue(field);
      headers.push(field);
      column = headers.length - 1;
    }

    sheet.getRange(rowNumber, column + 1).setValue(evaluationFields[field]);
  });

  SpreadsheetApp.flush();

  return jsonResponse({
    status: "success",
    message: "Round3 evaluation saved successfully."
  });
}

/* =========================================================
   BACKFILL MISSING FIELDS IN ROUND 2 SHEET
========================================================= */
function backfillRound2MissingData() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const r2Sheet = spreadsheet.getSheetByName(ROUND2_SHEET_NAME);
  const r1Sheet = spreadsheet.getSheetByName(ROUND1_SHEET_NAME);
  const mainSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);

  if (!r2Sheet || r2Sheet.getLastRow() < 2) {
    return jsonResponse({ status: "success", message: "No Round2 data to backfill." });
  }

  const r2Values = r2Sheet.getDataRange().getValues();
  const r2Headers = r2Values[0];
  const r2RegCol = findRegistrationColumn(r2Headers);

  let updatedCount = 0;

  for (let i = 1; i < r2Values.length; i++) {
    const row = r2Values[i];
    const regId = String(row[r2RegCol]).trim();
    if (!regId) continue;

    const mainData = getTeamDataFromSheet(mainSheet, regId);
    const r1Data = getTeamDataFromSheet(r1Sheet, regId);

    const mergedDataMap = {
      ...(mainData ? mainData.dataMap : {}),
      ...(r1Data ? r1Data.dataMap : {})
    };

    const leadValue = extractLeadFromDataMap(mergedDataMap);
    const projectValue = extractValueFromDataMap(mergedDataMap, [
      "Project Title", "Project / Solution Title", "idea_projectTitle", "idea_title", "challenge_challengeTitle", "challenge_title", "Project"
    ]);
    const technologyValue = extractValueFromDataMap(mergedDataMap, [
      "Technology", "Technologies", "technology_skills", "technology_domains", "Tech Stack", "Proposed Technology Stack"
    ]);

    r2Headers.forEach((header, colIndex) => {
      const normH = String(header).trim().toLowerCase().replace(/[\s_-]+/g, "");
      const currentVal = String(row[colIndex] ?? "").trim();

      if (normH === "teamlead" && (!currentVal || currentVal === "-") && leadValue) {
        r2Sheet.getRange(i + 1, colIndex + 1).setValue(leadValue);
        updatedCount++;
      } else if (normH === "projecttitle" && (!currentVal || currentVal === "Untitled Project") && projectValue) {
        r2Sheet.getRange(i + 1, colIndex + 1).setValue(projectValue);
        updatedCount++;
      } else if (normH === "technology" && (!currentVal || currentVal === "-") && technologyValue) {
        r2Sheet.getRange(i + 1, colIndex + 1).setValue(technologyValue);
        updatedCount++;
      } else if (normH === "attendance" && !currentVal) {
        r2Sheet.getRange(i + 1, colIndex + 1).setValue("Present");
        updatedCount++;
      } else if (normH === "round2addedat" && !currentVal) {
        r2Sheet.getRange(i + 1, colIndex + 1).setValue(new Date());
        updatedCount++;
      }
    });
  }

  SpreadsheetApp.flush();

  return jsonResponse({
    status: "success",
    message: "Backfilled Round2 sheet successfully.",
    updatedCount
  });
}

/* =========================================================
   BACKFILL MISSING FIELDS IN ROUND 3 SHEET
========================================================= */
function backfillRound3MissingData() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const r3Sheet = spreadsheet.getSheetByName(ROUND3_SHEET_NAME);
  const r2Sheet = spreadsheet.getSheetByName(ROUND2_SHEET_NAME);
  const r1Sheet = spreadsheet.getSheetByName(ROUND1_SHEET_NAME);
  const mainSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);

  if (!r3Sheet || r3Sheet.getLastRow() < 2) {
    return jsonResponse({ status: "success", message: "No Round3 data to backfill." });
  }

  const r3Values = r3Sheet.getDataRange().getValues();
  const r3Headers = r3Values[0];
  const r3RegCol = findRegistrationColumn(r3Headers);

  let updatedCount = 0;

  for (let i = 1; i < r3Values.length; i++) {
    const row = r3Values[i];
    const regId = String(row[r3RegCol]).trim();
    if (!regId) continue;

    const mainData = getTeamDataFromSheet(mainSheet, regId);
    const r1Data = getTeamDataFromSheet(r1Sheet, regId);
    const r2Data = getTeamDataFromSheet(r2Sheet, regId);

    const mergedDataMap = {
      ...(mainData ? mainData.dataMap : {}),
      ...(r1Data ? r1Data.dataMap : {}),
      ...(r2Data ? r2Data.dataMap : {})
    };

    const leadValue = extractLeadFromDataMap(mergedDataMap);
    const projectValue = extractValueFromDataMap(mergedDataMap, [
      "Project Title", "Project / Solution Title", "idea_projectTitle", "idea_title", "challenge_challengeTitle", "challenge_title", "Project"
    ]);
    const technologyValue = extractValueFromDataMap(mergedDataMap, [
      "Technology", "Technologies", "technology_skills", "technology_domains", "Tech Stack", "Proposed Technology Stack"
    ]);

    r3Headers.forEach((header, colIndex) => {
      const normH = String(header).trim().toLowerCase().replace(/[\s_-]+/g, "");
      const currentVal = String(row[colIndex] ?? "").trim();

      if (normH === "teamlead" && (!currentVal || currentVal === "-") && leadValue) {
        r3Sheet.getRange(i + 1, colIndex + 1).setValue(leadValue);
        updatedCount++;
      } else if (normH === "projecttitle" && (!currentVal || currentVal === "Untitled Project") && projectValue) {
        r3Sheet.getRange(i + 1, colIndex + 1).setValue(projectValue);
        updatedCount++;
      } else if (normH === "technology" && (!currentVal || currentVal === "-") && technologyValue) {
        r3Sheet.getRange(i + 1, colIndex + 1).setValue(technologyValue);
        updatedCount++;
      } else if (normH === "attendance" && !currentVal) {
        r3Sheet.getRange(i + 1, colIndex + 1).setValue("Present");
        updatedCount++;
      } else if (normH === "round3addedat" && !currentVal) {
        r3Sheet.getRange(i + 1, colIndex + 1).setValue(new Date());
        updatedCount++;
      }
    });
  }

  SpreadsheetApp.flush();

  return jsonResponse({
    status: "success",
    message: "Backfilled Round3 sheet successfully.",
    updatedCount
  });
}

/* =========================================================
   HELPERS FOR EXTRACTION & REGISTRATION
========================================================= */
function getTeamDataFromSheet(sheet, registrationId) {
  if (!sheet || sheet.getLastRow() < 2) return null;

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const regCol = findRegistrationColumn(headers);

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const id = String(row[regCol]).trim();
    if (id === String(registrationId).trim()) {
      const dataMap = {};
      headers.forEach((header, index) => {
        dataMap[String(header).trim()] = row[index];
      });
      return { row, headers, dataMap };
    }
  }
  return null;
}

function extractLeadFromDataMap(dataMap) {
  if (!dataMap) return "";
  const leadKeys = [
    "Team Lead", "Team_Lead", "Team Leader", "Team_Leader",
    "Team Lead Name", "Team_Lead_Name", "Team Leader Name", "Team_Leader_Name",
    "Lead Name", "Lead_Name", "Leader Name", "Leader_Name",
    "Lead / Student Full Name", "Participant / Team Leader Name",
    "Participant Name", "Participant_Name", "Full Name", "Full_Name",
    "lead_fullName", "student_fullName", "lead_name", "student_name",
    "leadFullName", "studentFullName", "leadName", "studentName",
    "Name", "name", "Lead", "lead"
  ];

  for (const key of leadKeys) {
    if (dataMap[key] !== undefined && dataMap[key] !== null && String(dataMap[key]).trim() !== "" && String(dataMap[key]).trim() !== "-") {
      return String(dataMap[key]).trim();
    }
  }

  const keys = Object.keys(dataMap);
  for (const k of keys) {
    const kLower = k.toLowerCase().replace(/[\s_-]+/g, "");
    if (
      kLower.includes("college") || kLower.includes("project") ||
      kLower.includes("challenge") || kLower.includes("title") ||
      kLower.includes("tech") || kLower.includes("department") ||
      kLower.includes("course") || kLower.includes("file") ||
      kLower.includes("id") || kLower.includes("status") ||
      kLower.includes("score")
    ) {
      continue;
    }

    if (
      kLower.includes("lead") || kLower.includes("leader") ||
      kLower.includes("student") || kLower.includes("participant") ||
      kLower.includes("fullname") || kLower.includes("name")
    ) {
      const val = dataMap[k];
      if (val !== undefined && val !== null && String(val).trim() !== "" && String(val).trim() !== "-") {
        return String(val).trim();
      }
    }
  }

  return "";
}

function extractValueFromDataMap(dataMap, searchKeys) {
  if (!dataMap) return "";

  for (const key of searchKeys) {
    if (dataMap[key] !== undefined && dataMap[key] !== null && String(dataMap[key]).trim() !== "") {
      return String(dataMap[key]).trim();
    }
  }

  const keys = Object.keys(dataMap);
  const searchNorms = searchKeys.map((sk) => sk.toLowerCase().replace(/[\s_-]+/g, ""));

  for (const k of keys) {
    const kNorm = k.toLowerCase().replace(/[\s_-]+/g, "");
    if (searchNorms.some((sn) => kNorm === sn || kNorm.includes(sn) || sn.includes(kNorm))) {
      const val = dataMap[k];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        return String(val).trim();
      }
    }
  }

  return "";
}

function extractTeamLeadValue(headers, row) {
  return extractFieldValue(headers, row, [
    "Team Lead",
    "Team Lead Name",
    "Team Leader",
    "Lead Name",
    "Full Name",
    "lead_fullName",
    "student_fullName",
    "lead_name",
    "student_name"
  ]);
}

function extractFieldValue(headers, row, keys) {
  for (let key of keys) {
    const targetNorm = key.toLowerCase().replace(/[\s_-]+/g, "");
    for (let i = 0; i < headers.length; i++) {
      const hNorm = String(headers[i]).trim().toLowerCase().replace(/[\s_-]+/g, "");
      if (hNorm === targetNorm && row[i] !== undefined && row[i] !== null && String(row[i]).trim() !== "") {
        return row[i];
      }
    }
  }
  return "";
}

function findRegistrationColumn(headers) {
  const possibleNames = [
    "Registration ID", "RegistrationID", "registrationId", "registration_id",
    "Registration_Id", "Registration_ID", "ID", "Id", "id", "Team ID", "TeamID", "teamId"
  ];

  for (const name of possibleNames) {
    const index = headers.findIndex(
      (header) => String(header).trim().toLowerCase() === name.toLowerCase()
    );
    if (index !== -1) return index;
  }
  return 0;
}

function findRegistrationId(headers, row, rowNumber) {
  const column = findRegistrationColumn(headers);
  const value = row[column];
  if (value !== undefined && value !== null && String(value).trim() !== "") {
    return String(value).trim();
  }
  return "ROW-" + rowNumber;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
