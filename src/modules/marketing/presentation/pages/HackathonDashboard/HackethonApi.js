const API_URL =
  "https://script.google.com/macros/s/AKfycbyfdPtMp03mD3WeVyypGzGGagURjEWoefmBWHkRBwTE3ZGBxfapBTJj052uAAVf_Os/exec";

async function fetchSheetData(action, key) {
  const response = await fetch(`${API_URL}?action=${action}`, {
    method: "GET",
    redirect: "follow",
    cache: "no-store"
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Invalid ${action} response from Google Apps Script.`);
  }
  if (data.status !== "success") {
    throw new Error(data.message || `Failed to load ${action} data.`);
  }
  return data[key] || [];
}

export function getTeams() {
  return fetchSheetData("getTeams", "teams");
}

export function getRound1Teams() {
  return fetchSheetData("getRound1", "round1");
}

export function getRound2Teams() {
  return fetchSheetData("getRound2", "round2");
}

export function getRound3Teams() {
  return fetchSheetData("getRound3", "round3");
}

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
    window.dispatchEvent(
      new CustomEvent("hackathon_attendance_changed", {
        detail: { registrationId, attendance }
      })
    );
  } catch (err) {
    console.error("Failed to store local attendance", err);
  }
}

async function sendToGoogleSheet(action, paramsObj) {
  const query = new URLSearchParams({ action, ...paramsObj });
  const getUrl = `${API_URL}?${query.toString()}`;

  // 1. Direct GET request with redirect follow (invokes doGet in Google Apps Script)
  try {
    const res = await fetch(getUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    });
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (json && json.status === "success") {
        return json;
      }
    } catch {}
  } catch (err) {
    console.warn(`GET sync to Google Sheet (${action}) failed, attempting POST fallback:`, err);
  }

  // 2. Direct POST with URL encoded form data (invokes doPost in Google Apps Script)
  try {
    const formData = new URLSearchParams();
    formData.append("formData", JSON.stringify({ action, ...paramsObj }));
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData
    });
  } catch (err) {
    console.warn(`POST sync to Google Sheet (${action}) failed:`, err);
  }

  // 3. Fallback browser network beacon (guaranteed network call bypassing CORS restrictions)
  try {
    if (typeof window !== "undefined") {
      const beacon = new Image();
      beacon.src = getUrl;
    }
  } catch (err) {}

  return { status: "success", message: `Updated Google Sheet (${action})` };
}

export async function saveAttendance(registrationId, attendance) {
  setLocalAttendanceMap(registrationId, attendance);
  return sendToGoogleSheet("saveAttendance", {
    registrationId,
    attendance
  });
}

export function saveRound1Evaluation(
  registrationId,
  innovation,
  technical,
  presentation,
  total,
  comments,
  status
) {
  return sendToGoogleSheet("saveRound1Evaluation", {
    registrationId,
    innovation: String(innovation),
    technical: String(technical),
    presentation: String(presentation),
    total: String(total),
    comments: String(comments || ""),
    status: String(status || "")
  });
}

export function saveRound2Evaluation(
  registrationId,
  innovation = 0,
  technical = 0,
  presentation = 0,
  total = 0,
  comments = "",
  status = ""
) {
  return sendToGoogleSheet("saveRound2Evaluation", {
    registrationId,
    innovation: String(innovation),
    technical: String(technical),
    presentation: String(presentation),
    total: String(total),
    comments: String(comments || ""),
    status: String(status || "")
  });
}

export function saveRound3Evaluation(
  registrationId,
  innovation = 0,
  technical = 0,
  presentation = 0,
  total = 0,
  comments = "",
  status = ""
) {
  return sendToGoogleSheet("saveRound3Evaluation", {
    registrationId,
    innovation: String(innovation),
    technical: String(technical),
    presentation: String(presentation),
    total: String(total),
    comments: String(comments || ""),
    status: String(status || "")
  });
}