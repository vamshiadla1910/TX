const API_URL =
  "https://script.google.com/macros/s/AKfycbwTZFWh7k2pDyKaIp9euVTs19DvnE1lxQ16HMNk8l36OjXBgcnBnI-1rtYDBhkWUp4/exec";

export async function getHackathonData() {
  try {
    console.log("Calling Google Sheets API...");

    const response = await fetch(API_URL, {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    });

    console.log("API status:", response.status);

    if (!response.ok) {
      throw new Error(
        `Google Sheets API returned ${response.status}`
      );
    }

    const text = await response.text();

    console.log("Google Sheets response:", text);

    if (!text) {
      throw new Error("Google Sheets returned an empty response");
    }

    const data = JSON.parse(text);

    console.log("Parsed Google Sheets data:", data);

    if (data.status !== "success") {
      throw new Error(
        data.message || "Google Sheets API returned an error"
      );
    }

    return data;
  } catch (error) {
    console.error("Google Sheets API Error:", error);
    throw error;
  }
}

export async function getTeams() {
  const data = await getHackathonData();

  return data.registrations || [];
}