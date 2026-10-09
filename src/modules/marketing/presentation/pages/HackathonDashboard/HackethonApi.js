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


export async function saveAttendance(
  registrationId,
  attendance
) {

  const payload = {
    action: "saveAttendance",
    registrationId,
    attendance
  };

  const response = await fetch(
    API_URL,
    {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        formData:
          JSON.stringify(payload)
      })
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
      "Failed to save attendance."
    );
  }

  return data;
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
    action:
      "saveRound1Evaluation",

    registrationId,
    innovation,
    technical,
    presentation,
    total,
    comments,
    status
  };

  const response = await fetch(
    API_URL,
    {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        formData:
          JSON.stringify(payload)
      })
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
      "Failed to save Round1 evaluation."
    );
  }

  return data;
}