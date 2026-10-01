const SPREADSHEET_ID = "1B807lIU5E0lAAx0RKRoQd3_tkR0OLFf4xYiCDRCBtYg";
const MAX_TEAM_MEMBERS = 6;

const PARTICIPANT_FIELDS = [
  ["fullName", "Full Name"],
  ["gender", "Gender"],
  ["dateOfBirth", "Date of Birth"],
  ["mobile", "Mobile Number"],
  ["alternateContact", "Emergency / Alternate Contact Number"],
  ["email", "Email Address"],
  ["college", "College / University"],
  ["department", "Department"],
  ["course", "Course / Program"],
  ["year", "Year of Study"],
  ["studentId", "Student ID / Roll Number"]
];

const TEAM_MEMBER_FIELDS = [
  ["name", "Name"],
  ["email", "Email"],
  ["mobile", "Mobile Number"],
  ["alternateContact", "Emergency / Alternate Contact Number"],
  ["college", "College / University"],
  ["department", "Department"],
  ["year", "Year of Study"],
  ["studentId", "Student ID / Roll Number"],
  ["skills", "Primary Skills"]
];

const SECTION_FIELDS = [
  ["technology", "skills", "Technology / Skill Domains"],
  ["technology", "otherSkill", "Other Technology / Skill"],
  ["technology", "technologies", "Technologies / Programming Languages"],
  ["technology", "frameworks", "Frameworks / Tools"],
  ["challenge", "category", "Challenge Category"],
  ["challenge", "challengeId", "Preferred Challenge ID"],
  ["challenge", "challengeTitle", "Preferred Challenge Title"],
  ["idea", "title", "Project / Solution Title"],
  ["idea", "beneficiaries", "Target Users / Beneficiaries"],
  ["idea", "problem", "Problem You Intend to Solve"],
  ["idea", "solution", "Proposed Solution - Brief Description"],
  ["idea", "outcome", "Expected Outcome"],
  ["idea", "stack", "Proposed Technology Stack"],
  ["experience", "hackathonBefore", "Participated in a Hackathon Before?"],
  ["experience", "hackathonCount", "Number of Hackathons Participated"],
  ["experience", "previousExperience", "Previous Hackathon / Project Experience"],
  ["experience", "developedProjects", "Have you Developed Projects Previously?"],
  ["experience", "portfolio", "Portfolio / GitHub / LinkedIn / Project URL"],
  ["experience", "projectDescription", "Project Descriptions and Tech Stacks Used"],
  ["institution", "coordinatorName", "Faculty Coordinator Name"],
  ["institution", "designation", "Coordinator Designation"],
  ["institution", "department", "Institutional Department"],
  ["institution", "officialEmail", "Institutional Official Email"],
  ["institution", "contactNumber", "Institutional Contact Number"],
  ["institution", "approval", "Institutional Approval / Recommendation"],
  ["declaration", "rulesAccepted", "Declaration and Event Rules Accepted"],
  ["declaration", "infoConfirmed", "Academic and Contact Information Confirmed"],
  ["declaration", "consent", "Photography, Video and Event Documentation Consent"],
  ["declaration", "name", "Participant / Team Leader Name"],
  ["declaration", "date", "Declaration Date"],
  ["declaration", "place", "Declaration Place"],
  ["declaration", "signature", "Digital Signature"]
];

const SHEET_HEADERS = [
  "Timestamp",
  "Registration Type",
  ...PARTICIPANT_FIELDS.map(([, label]) => `Participant ${label}`),
  ...Array.from({ length: MAX_TEAM_MEMBERS }, (_, memberIndex) =>
    TEAM_MEMBER_FIELDS.map(([, label]) => `Team Member ${memberIndex + 1} ${label}`)
  ).flat(),
  ...SECTION_FIELDS.map(([, , label]) => label)
];

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents;
    if (!body) throw new Error("Request body is empty.");

    const registration = JSON.parse(body);
    if (!registration || typeof registration !== "object" || Array.isArray(registration)) {
      throw new Error("Request body must be a JSON object.");
    }
    if (!["team", "individual"].includes(registration.participantType)) {
      throw new Error("Registration type is missing or invalid.");
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[0];
    if (!sheet) throw new Error("The spreadsheet does not contain a sheet.");

    ensureHeaders(sheet);
    sheet.appendRow(buildRow(registration));

    return jsonResponse({
      success: true,
      message: "Registration submitted successfully"
    });
  } catch (error) {
    Logger.log(error && error.stack ? error.stack : error);
    return jsonResponse({
      success: false,
      message: "Failed to submit registration"
    });
  }
}

function authorizeSpreadsheetAccess() {
  SpreadsheetApp.openById(SPREADSHEET_ID).getSheets();
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);
    return;
  }

  const existingHeaders = sheet.getRange(1, 1, 1, SHEET_HEADERS.length).getValues()[0];
  const match = SHEET_HEADERS.every((header, index) => existingHeaders[index] === header);
  if (!match) {
    throw new Error("The first sheet's header row does not match the registration schema.");
  }
}

function buildRow(registration) {
  const participant = registration.participantType === "team"
    ? registration.lead
    : registration.student;
  const members = Array.isArray(registration.members) ? registration.members : [];

  return [
    new Date(),
    toCellValue(registration.participantType),
    ...PARTICIPANT_FIELDS.map(([key]) => toCellValue(participant && participant[key])),
    ...Array.from({ length: MAX_TEAM_MEMBERS }, (_, memberIndex) => {
      const member = members[memberIndex] || {};
      return TEAM_MEMBER_FIELDS.map(([key]) => toCellValue(member[key]));
    }).flat(),
    ...SECTION_FIELDS.map(([section, key]) => {
      const values = registration[section];
      return toCellValue(values && values[key]);
    })
  ];
}

function toCellValue(value) {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
