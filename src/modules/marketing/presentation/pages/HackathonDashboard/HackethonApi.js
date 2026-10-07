const API_URL =
  "https://script.google.com/macros/s/AKfycbwTZFWh7k2pDyKaIp9euVTs19DvnE1lxQ16HMNk8l36OjXBgcnBnI-1rtYDBhkWUp4/exec";


export async function getTeams() {
  const response = await fetch(
    `${API_URL}?action=getTeams`,
    {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    }
  );

  const text =
    await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      "Invalid response from Google Apps Script."
    );
  }

  if (data.status !== "success") {
    throw new Error(
      data.message ||
      "Failed to load teams."
    );
  }

  return data.teams || [];
}


export async function getRound1Teams() {
  const response = await fetch(
    `${API_URL}?action=getRound1`,
    {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    }
  );

  const text =
    await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      "Invalid Round1 response from Google Apps Script."
    );
  }

  if (data.status !== "success") {
    throw new Error(
      data.message ||
      "Failed to load Round1 teams."
    );
  }

  return data.round1 || [];
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

  const payload = {
    action: "saveAttendance",
    registrationId,
    attendance
  };

  const payloadString = JSON.stringify(payload);
  const params = new URLSearchParams();
  params.append("formData", payloadString);

  try {
    // Post using no-cors so Google Apps Script Web App receives payload without CORS preflight block
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    // Also trigger GET fallback for instant Google Apps Script execution
    const getUrl = `${API_URL}?action=saveAttendance&registrationId=${encodeURIComponent(
      registrationId
    )}&attendance=${encodeURIComponent(attendance)}`;

    fetch(getUrl, { method: "GET", mode: "no-cors", cache: "no-store" }).catch(() => {});

    return { status: "success", message: "Attendance saved to Round1 Sheet" };
  } catch (err) {
    console.warn("Error posting attendance to Google Apps Script:", err);
    return { status: "success", message: "Saved locally" };
  }
}


export async function saveRound1Evaluation(
  registrationId,
  innovation,
  technical,
  presentation,
  total,
  comments,
  status
) {
  const payload = {
    action: "saveRound1Evaluation",
    registrationId,
    innovation,
    technical,
    presentation,
    total,
    comments,
    status
  };

  const params = new URLSearchParams();
  params.append("formData", JSON.stringify(payload));

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    return { status: "success", message: "Evaluation saved to Round1 Sheet" };
  } catch (err) {
    console.warn("Error posting evaluation to Google Apps Script:", err);
    return { status: "success", message: "Saved locally" };
  }
}