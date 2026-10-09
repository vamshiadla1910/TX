import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  TEAM_FILTERS,
  ATTENDANCE_STATUS,
  VERIFICATION_STATUS,
  TEAM_EVENTS,
  NOTIFICATION_TIMEOUT_MS
} from "./constants/teamConstants.js";

import {
  getLeadNameOnly,
  getMemberCount
} from "./utils/teamFormatters.js";

import {
  getRegistrationId,
  getTeamName,
  getCollege,
  getAttendance
} from "../HackethonApi.js";

function filterTeam(team, filter, search) {
  const regId = getRegistrationId(team);
  const teamName = getTeamName(team);
  const lead = getLeadNameOnly(team);
  const college = getCollege(team);
  const attendance = getAttendance(team);

  if (filter === TEAM_FILTERS.PRESENT && attendance !== ATTENDANCE_STATUS.PRESENT) {
    return false;
  }
  if (filter === TEAM_FILTERS.ABSENT && attendance !== ATTENDANCE_STATUS.ABSENT) {
    return false;
  }
  if (filter === TEAM_FILTERS.PENDING && attendance !== ATTENDANCE_STATUS.PENDING) {
    return false;
  }

  if (!search.trim()) {
    return true;
  }

  const query = search.toLowerCase();
  return (
    String(regId || "").toLowerCase().includes(query) ||
    String(teamName || "").toLowerCase().includes(query) ||
    String(lead || "").toLowerCase().includes(query) ||
    String(college || "").toLowerCase().includes(query)
  );
}

function calculateCounts(teams) {
  const total = teams.length;
  let present = 0;
  let absent = 0;
  let pending = 0;

  for (let i = 0; i < teams.length; i++) {
    const attendance = getAttendance(teams[i]);
    if (attendance === ATTENDANCE_STATUS.PRESENT) {
      present++;
    } else if (attendance === ATTENDANCE_STATUS.ABSENT) {
      absent++;
    } else if (attendance === ATTENDANCE_STATUS.PENDING) {
      pending++;
    }
  }

  return { total, present, absent, pending };
}

describe("teams module - constants", () => {
  it("should have correct team filter values", () => {
    assert.equal(TEAM_FILTERS.ALL, "all");
    assert.equal(TEAM_FILTERS.PRESENT, "present");
    assert.equal(TEAM_FILTERS.ABSENT, "absent");
    assert.equal(TEAM_FILTERS.PENDING, "pending");
  });

  it("should have correct attendance status values", () => {
    assert.equal(ATTENDANCE_STATUS.PRESENT, "Present");
    assert.equal(ATTENDANCE_STATUS.ABSENT, "Absent");
    assert.equal(ATTENDANCE_STATUS.PENDING, "Pending");
  });

  it("should have correct verification values", () => {
    assert.equal(VERIFICATION_STATUS.YES, "Yes");
    assert.equal(VERIFICATION_STATUS.NO, "No");
  });

  it("should have correct custom events", () => {
    assert.equal(TEAM_EVENTS.REGISTRATION_UPDATED, "registrationUpdated");
    assert.equal(TEAM_EVENTS.ATTENDANCE_UPDATED, "attendanceUpdated");
  });

  it("should have 4000ms notification timeout", () => {
    assert.equal(NOTIFICATION_TIMEOUT_MS, 4000);
  });
});

describe("teams module - formatters", () => {
  describe("getLeadNameOnly", () => {
    it("should return fallback when team is empty", () => {
      assert.equal(getLeadNameOnly(null), "—");
      assert.equal(getLeadNameOnly({}), "—");
    });

    it("should return lead name when lead_fullName is present", () => {
      const team = { lead_fullName: "Aarav Sharma" };
      assert.equal(getLeadNameOnly(team), "Aarav Sharma");
    });

    it("should parse lead name when Team Lead Details has a JSON string", () => {
      const team = { "Team Lead Details": JSON.stringify({ fullName: "Priya Patel" }) };
      assert.equal(getLeadNameOnly(team), "Priya Patel");
    });

    it("should extract lead name from formatted Team Lead Details text", () => {
      const team = { "Team Lead Details": "name: Rahul Varma | email: rahul@example.com" };
      assert.equal(getLeadNameOnly(team), "Rahul Varma");
    });
  });

  describe("getMemberCount", () => {
    it("should return 0 when members are empty or null", () => {
      assert.equal(getMemberCount(null), 0);
      assert.equal(getMemberCount({}), 0);
    });

    it("should count array members correctly", () => {
      const team = { "Team Members Details": ["Alice", "Bob"] };
      assert.equal(getMemberCount(team), 2);
    });

    it("should parse JSON array of members", () => {
      const team = { "Team Members Details": JSON.stringify(["Alice", "Bob", "Charlie"]) };
      assert.equal(getMemberCount(team), 3);
    });

    it("should parse JSON object containing members array", () => {
      const team = { "Team Members Details": JSON.stringify({ members: ["M1", "M2"] }) };
      assert.equal(getMemberCount(team), 2);
    });

    it("should count newline-separated members", () => {
      const team = { "Team Members Details": "Member 1\nMember 2\nMember 3" };
      assert.equal(getMemberCount(team), 3);
    });
  });
});

describe("teams module - filter and count logic", () => {
  const sampleTeams = [
    {
      registrationId: "TX-101",
      teamName: "CodeCrafters",
      lead_fullName: "Alice",
      lead_college: "IIT Madras",
      Attendance: "Present"
    },
    {
      registrationId: "TX-102",
      teamName: "ByteBuilders",
      lead_fullName: "Bob",
      lead_college: "NIT Trichy",
      Attendance: "Absent"
    },
    {
      registrationId: "TX-103",
      teamName: "CyberKnights",
      lead_fullName: "Charlie",
      lead_college: "BITS Pilani",
      Attendance: "Pending"
    }
  ];

  it("should calculate correct total and status counts", () => {
    const counts = calculateCounts(sampleTeams);
    assert.deepEqual(counts, {
      total: 3,
      present: 1,
      absent: 1,
      pending: 1
    });
  });

  it("should filter by attendance status correctly", () => {
    const presentOnly = sampleTeams.filter(t => filterTeam(t, TEAM_FILTERS.PRESENT, ""));
    assert.equal(presentOnly.length, 1);
    assert.equal(presentOnly[0].registrationId, "TX-101");

    const absentOnly = sampleTeams.filter(t => filterTeam(t, TEAM_FILTERS.ABSENT, ""));
    assert.equal(absentOnly.length, 1);
    assert.equal(absentOnly[0].registrationId, "TX-102");

    const pendingOnly = sampleTeams.filter(t => filterTeam(t, TEAM_FILTERS.PENDING, ""));
    assert.equal(pendingOnly.length, 1);
    assert.equal(pendingOnly[0].registrationId, "TX-103");
  });

  it("should search by registration ID, team name, lead, or college", () => {
    const byId = sampleTeams.filter(t => filterTeam(t, TEAM_FILTERS.ALL, "TX-101"));
    assert.equal(byId.length, 1);
    assert.equal(byId[0].teamName, "CodeCrafters");

    const byName = sampleTeams.filter(t => filterTeam(t, TEAM_FILTERS.ALL, "ByteBuilders"));
    assert.equal(byName.length, 1);

    const byLead = sampleTeams.filter(t => filterTeam(t, TEAM_FILTERS.ALL, "Charlie"));
    assert.equal(byLead.length, 1);

    const byCollege = sampleTeams.filter(t => filterTeam(t, TEAM_FILTERS.ALL, "Trichy"));
    assert.equal(byCollege.length, 1);
  });
});
