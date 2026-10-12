import { useEffect, useState, useMemo } from "react";
import { getTeams, getLocalAttendanceMap } from "./HackethonApi";

export const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_.-]+/g, "");

export const getField = (team, names, fallback = "") => {
  if (!team) return fallback;

  // 1. Direct exact key match
  for (const name of names) {
    if (
      team[name] !== undefined &&
      team[name] !== null &&
      String(team[name]).trim() !== ""
    ) {
      return String(team[name]).trim();
    }
  }

  // 2. Normalized key match across all keys in team
  const keys = Object.keys(team);
  const normalizedNames = names.map(normalize);

  for (const key of keys) {
    const val = team[key];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      const normKey = normalize(key);
      if (normalizedNames.some((n) => normKey === n || normKey.includes(n) || n.includes(normKey))) {
        return String(val).trim();
      }
    }
  }

  return fallback;
};

export const getRegistrationId = (team) =>
  getField(team, [
    "Registration ID",
    "registrationId",
    "Registration Number",
    "Registration No",
    "Reg No",
    "Participant Reg",
    "id"
  ]);

export const getTeamName = (team) => getField(team, ["Team Name", "Team"]);

export const getTeamLead = (team) => {
  if (!team) return "-";
  if (typeof team.lead === "string" && team.lead.trim()) return team.lead.trim();
  if (typeof team.lead === "object" && team.lead !== null) {
    if (team.lead.fullName) return team.lead.fullName;
    if (team.lead.name) return team.lead.name;
  }
  if (typeof team.student === "object" && team.student !== null) {
    if (team.student.fullName) return team.student.fullName;
    if (team.student.name) return team.student.name;
  }

  const priorityKeys = [
    "Team Lead", "Team_Lead", "Team Leader", "Team_Leader",
    "Team Lead Name", "Team_Lead_Name", "Team Leader Name", "Team_Leader_Name",
    "Lead Name", "Lead_Name", "Leader Name", "Leader_Name",
    "Lead / Student Full Name", "Participant / Team Leader Name",
    "Participant Name", "Participant_Name", "Full Name", "Full_Name",
    "lead_fullName", "student_fullName", "lead_name", "student_name",
    "leadFullName", "studentFullName", "leadName", "studentName",
    "Name", "name", "Lead", "lead"
  ];

  for (const k of priorityKeys) {
    if (team[k] !== undefined && team[k] !== null && String(team[k]).trim() !== "" && String(team[k]).trim() !== "-") {
      return String(team[k]).trim();
    }
  }

  const membersVal = getField(team, ["Team Members", "Members", "members", "team_members"]);
  if (membersVal) {
    const first = membersVal.split(",")[0];
    if (first && first.trim()) return first.trim();
  }

  return "-";
};

export const getProjectTitle = (team) => {
  if (!team) return "Untitled Project";
  if (typeof team.project === "string" && team.project.trim()) return team.project.trim();
  if (typeof team.project === "object" && team.project?.title) return team.project.title;

  const val = getField(team, [
    "Project Title",
    "Project / Solution Title",
    "idea_projectTitle",
    "idea_title",
    "challenge_challengeTitle",
    "challenge_title",
    "Team Name",
    "Team",
    "Challenge Title",
    "Project",
    "Title"
  ]);

  return val || "Untitled Project";
};

export const getTechnology = (team) => {
  if (!team) return "-";
  if (typeof team.technology === "string" && team.technology.trim()) return team.technology.trim();

  const val = getField(team, [
    "Technology",
    "Technologies",
    "technology_skills",
    "technology_domains",
    "Tech Stack",
    "Tech",
    "Technologies / Languages",
    "Selected Tech Domains",
    "Technology / Skill Domains",
    "Skills"
  ]);

  return val || "-";
};

export const getChallenge = (team) =>
  getField(team, [
    "Challenge Title",
    "Challenge",
    "Problem Statement",
    "idea_projectTitle",
    "idea_title",
    "challenge_challengeTitle",
    "challenge_title"
  ], "-");

export const parseMemberDetailsString = (text) => {
  if (!text || typeof text !== "string") return [];
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  let blocks = normalized.split(/\n\s*---\s*\n/).filter((b) => b.trim());
  if (blocks.length <= 1 && /#\d+/.test(normalized)) {
    blocks = normalized.split(/(?=#\d+)/).filter((b) => b.trim());
  }

  const results = [];
  blocks.forEach((block, index) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;

    let role = index === 0 ? "Team Lead" : `Member ${index + 1}`;
    let name = "";
    let email = "";
    let phone = "";
    let altContact = "";
    let college = "";
    let department = "";
    let year = "";
    let studentId = "";
    let skills = "";

    lines.forEach((line) => {
      if (/^#\d+/.test(line)) {
        if (/team\s*leader/i.test(line) || /lead/i.test(line)) {
          role = "Team Lead";
        } else {
          const matchNum = line.match(/^#(\d+)/);
          role = matchNum ? `Member ${matchNum[1]}` : `Member ${index + 1}`;
        }
        return;
      }

      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) {
        if (!name && !line.startsWith("#") && !line.startsWith("---")) {
          name = line;
        }
        return;
      }

      const key = line.slice(0, colonIdx).trim().toLowerCase();
      const val = line.slice(colonIdx + 1).trim();

      if (key === "name" || key === "full name" || key === "member name") {
        name = val;
      } else if (key === "email" || key === "email address") {
        email = val;
      } else if (key === "mobile" || key === "phone" || key === "contact") {
        phone = val;
      } else if (key.includes("alt") || key.includes("alternate")) {
        altContact = val;
      } else if (key === "college" || key === "institution" || key === "university") {
        college = val;
      } else if (key === "dept" || key === "department") {
        if (val.includes("|")) {
          val.split("|").forEach((p) => {
            const cIdx = p.indexOf(":");
            if (cIdx !== -1) {
              const pk = p.slice(0, cIdx).trim().toLowerCase();
              const pv = p.slice(cIdx + 1).trim();
              if (pk === "dept" || pk === "department") department = pv;
              if (pk === "year" || pk === "year of study") year = pv;
            } else {
              department = p.trim();
            }
          });
        } else {
          department = val;
        }
      } else if (key === "year" || key === "year of study") {
        year = val;
      } else if (key.includes("student id") || key.includes("roll")) {
        studentId = val;
      } else if (key.includes("skills") || key.includes("primary skills")) {
        skills = val;
      }
    });

    if (name) {
      results.push({
        name,
        role,
        email,
        phone,
        altContact,
        college,
        department,
        year,
        studentId,
        skills
      });
    }
  });

  return results;
};

export const getAllMemberDetails = (team) => {
  if (!team) return [];

  // 1. Check formatted "Team Members Details" string (as saved by Registration form into Google Sheet)
  const rawDetails = getField(team, [
    "Team Members Details",
    "Team_Members_Details",
    "team_members_details",
    "Team Member Details",
    "members_details"
  ]);

  if (rawDetails && typeof rawDetails === "string" && rawDetails.trim()) {
    const parsed = parseMemberDetailsString(rawDetails);
    if (parsed.length > 0) {
      return parsed;
    }
  }

  // 2. Check if team.members is an Array of objects or strings
  if (Array.isArray(team.members) && team.members.length > 0) {
    return team.members
      .map((m, idx) => {
        if (typeof m === "string" && m.trim()) {
          return {
            name: m.trim(),
            role: idx === 0 ? "Team Lead" : `Member ${idx + 1}`,
            email: "",
            phone: "",
            college: ""
          };
        }
        if (typeof m === "object" && m !== null) {
          return {
            name: m.name || m.fullName || `Member ${idx + 1}`,
            role: m.role || (idx === 0 ? "Team Lead" : `Member ${idx + 1}`),
            email: m.email || "",
            phone: m.mobile || m.phone || "",
            altContact: m.alternateContact || m.altContact || "",
            college: m.college || "",
            department: m.department || "",
            year: m.year || "",
            studentId: m.studentId || "",
            skills: m.skills || ""
          };
        }
        return null;
      })
      .filter((m) => m && m.name);
  }

  // 3. Check numbered keys like Member 1, Member 2, ... or members_0_name, members_1_name
  const list = [];
  const addedNames = new Set();

  const addMember = (name, role, extra = {}) => {
    if (!name || name === "-" || name === "null" || name === "undefined") return;
    const cleanName = String(name).trim();
    if (!cleanName || /^\d+$/.test(cleanName)) return;

    const norm = cleanName.toLowerCase();
    if (addedNames.has(norm)) return;
    addedNames.add(norm);

    list.push({
      name: cleanName,
      role: role || (list.length === 0 ? "Team Lead" : `Member ${list.length + 1}`),
      email: extra.email || getField(team, ["Email", "Lead Email", "Email Address", "student_email", "lead_email"]),
      phone: extra.phone || getField(team, ["Phone", "Mobile", "Mobile Number", "Contact Number", "student_phone", "lead_phone"]),
      college: extra.college || getField(team, ["College", "Institution", "University", "College / University", "student_college", "lead_college"]),
      department: extra.department || getField(team, ["Department", "lead_department"]),
      year: extra.year || getField(team, ["Year of Study", "Year", "lead_year"]),
      studentId: extra.studentId || getField(team, ["Student ID / Roll No", "Student ID", "lead_studentId"]),
      skills: extra.skills || getField(team, ["Skills", "Selected Tech Domains", "lead_skills"]),
      ...extra
    });
  };

  [1, 2, 3, 4, 5].forEach((num) => {
    const val = getField(team, [
      `Member ${num}`,
      `Member ${num} Name`,
      `Member_${num}`,
      `member_${num}_name`,
      `members_${num - 1}_name`
    ]);
    if (val) {
      addMember(val, num === 1 ? "Team Lead" : `Member ${num}`, {
        email: getField(team, [`Member ${num} Email`, `members_${num - 1}_email`]),
        phone: getField(team, [`Member ${num} Mobile`, `Member ${num} Phone`, `members_${num - 1}_mobile`]),
        college: getField(team, [`Member ${num} College`, `members_${num - 1}_college`])
      });
    }
  });

  // 4. Check comma-delimited strings in Team Members / Members
  const rawMembers = getField(team, ["Team Members", "Members", "Team Member"]);
  if (typeof rawMembers === "string" && rawMembers.trim()) {
    const splitNames = rawMembers
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter((s) => s && !/^\d+$/.test(s) && !s.toLowerCase().startsWith("name:") && !s.toLowerCase().startsWith("email:"));
    splitNames.forEach((n) => addMember(n));
  }

  // 5. Fallback to Team Lead or student if list is still empty
  if (list.length === 0) {
    const leadName = getTeamLead(team);
    if (leadName && leadName !== "-") {
      addMember(leadName, "Team Lead");
    }
  }

  return list;
};

export const getMembers = (team) => {
  const details = getAllMemberDetails(team);
  if (details.length > 0) {
    return details.map((m) => m.name).join(", ");
  }
  return getField(
    team,
    [
      "Team Members Details",
      "Team_Members_Details",
      "Team Members",
      "Members",
      "Team Member"
    ],
    "-"
  );
};

export const getAttendance = (team) => {
  const regId = getRegistrationId(team);
  const localMap = getLocalAttendanceMap();
  if (regId && localMap[String(regId).trim()]) {
    return localMap[String(regId).trim()];
  }
  const sheetAtt = getField(team, [
    "Attendance",
    "Attendance Status",
    "Attendance_Status",
    "attendance",
    "Presence"
  ]);
  const norm = normalize(sheetAtt);
  if (["present", "attended", "yes", "true", "1"].includes(norm)) return "Present";
  if (["absent", "no", "false", "0"].includes(norm)) return "Absent";
  return "Pending";
};

export const isPresent = (team) => normalize(getAttendance(team)) === "present";
export const isAbsent = (team) => normalize(getAttendance(team)) === "absent";

export const getRoundStatus = (team, roundNum) => {
  if (!team) return { label: "Pending", type: "pending" };

  const regId = getRegistrationId(team);
  let rawStatus = "";

  // 1. Check local evaluation for this specific round first
  if (regId) {
    try {
      const localKey = `tx_hackathon_round${roundNum}_evaluations`;
      const localEvals = JSON.parse(localStorage.getItem(localKey) || "{}");
      if (localEvals[String(regId).trim()]) {
        rawStatus =
          localEvals[String(regId).trim()].decision ||
          localEvals[String(regId).trim()].status;
      }
    } catch (e) {
      // ignore
    }
  }

  // 2. Check round-specific property in team object
  if (!rawStatus) {
    if (roundNum === 1) {
      rawStatus =
        team["Round 1 Status"] ||
        team["Round1 Status"] ||
        team["Round 1"] ||
        team["R1 Status"];
    } else if (roundNum === 2) {
      rawStatus =
        team["Round 2 Status"] ||
        team["Round2 Status"] ||
        team["Round 2"] ||
        team["R2 Status"];
    } else if (roundNum === 3) {
      rawStatus =
        team["Round 3 Status"] ||
        team["Round3 Status"] ||
        team["Round 3"] ||
        team["R3 Status"];
    }
  }

  // 3. Fallback to general Status field only if relevant to current round or generic
  if (!rawStatus && team.Status && typeof team.Status === "string") {
    const s = team.Status.trim();
    const sLower = s.toLowerCase();
    if (roundNum === 1 && !sLower.includes("r2") && !sLower.includes("r3")) {
      rawStatus = s;
    } else if (roundNum === 2 && sLower.includes("r2")) {
      rawStatus = s;
    } else if (roundNum === 3 && sLower.includes("r3")) {
      rawStatus = s;
    }
  }

  const norm = normalize(rawStatus);

  if (
    norm.includes("notqualified") ||
    norm.includes("eliminated") ||
    norm.includes("fail") ||
    norm.includes("reject")
  ) {
    return {
      label: "Eliminated",
      type: "eliminated"
    };
  }

  if (
    norm.includes("qualified") ||
    norm.includes("pass") ||
    norm.includes("selected")
  ) {
    return {
      label: `R${roundNum} Qualified`,
      type: "qualified"
    };
  }

  if (
    norm.includes("clarification") ||
    norm.includes("review")
  ) {
    return {
      label: "Clarification",
      type: "clarification"
    };
  }

  return {
    label: "Pending",
    type: "pending"
  };
};

// Helper hook for Round 1, Round 2, Round 3 data loading and evaluation management
export const useRoundData = (roundNum, getRoundTeamsApi, saveEvaluationApi, localKey) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [evaluationOpen, setEvaluationOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      let roundTeams = [];
      let mainTeams = [];

      try {
        const rData = await getRoundTeamsApi();
        if (Array.isArray(rData)) roundTeams = rData;
      } catch (err) {
        console.warn(`getRound${roundNum}Teams failed, falling back to getTeams:`, err);
      }

      try {
        const teamsData = await getTeams();
        if (Array.isArray(teamsData)) mainTeams = teamsData;
      } catch (err) {
        console.warn("getTeams failed in loadData:", err);
      }

      const mainTeamMap = new Map();
      for (const t of mainTeams) {
        const id = getRegistrationId(t);
        if (id) mainTeamMap.set(String(id).trim(), t);
      }

      const mergedList = [];
      const localEvals = JSON.parse(localStorage.getItem(localKey) || "{}");

      if (roundNum === 1) {
        // Round 1 candidate teams: any team marked Present in Teams section OR in Round 1 sheet (unless absent)
        const candidateMap = new Map();

        // 1. Teams from mainTeams marked Present
        mainTeams.forEach((mTeam) => {
          const regId = getRegistrationId(mTeam);
          if (regId && isPresent(mTeam)) {
            candidateMap.set(String(regId).trim(), { ...mTeam });
          }
        });

        // 2. Teams from round1 sheet (unless marked absent)
        roundTeams.forEach((rTeam) => {
          const regId = getRegistrationId(rTeam);
          if (regId) {
            const cleanId = String(regId).trim();
            if (!isAbsent(rTeam)) {
              const existing = candidateMap.get(cleanId) || mainTeamMap.get(cleanId) || {};
              candidateMap.set(cleanId, { ...existing, ...rTeam });
            }
          }
        });

        candidateMap.forEach((teamObj, regId) => {
          const mainTeamRow = mainTeamMap.get(regId) || {};
          const mergedObj = { ...mainTeamRow, ...teamObj };

          const lead =
            getTeamLead(teamObj) !== "-"
              ? getTeamLead(teamObj)
              : getTeamLead(mainTeamRow) !== "-"
              ? getTeamLead(mainTeamRow)
              : getTeamLead(mergedObj);

          const project =
            getProjectTitle(teamObj) !== "Untitled Project"
              ? getProjectTitle(teamObj)
              : getProjectTitle(mainTeamRow) !== "Untitled Project"
              ? getProjectTitle(mainTeamRow)
              : getProjectTitle(mergedObj);

          const tech =
            getTechnology(teamObj) !== "-"
              ? getTechnology(teamObj)
              : getTechnology(mainTeamRow) !== "-"
              ? getTechnology(mainTeamRow)
              : getTechnology(mergedObj);

          if (localEvals[regId]) {
            const evalData = localEvals[regId];
            mergedObj.Innovation = evalData.innovation;
            mergedObj.Technical = evalData.technical;
            mergedObj.Presentation = evalData.presentation;
            mergedObj.Total = evalData.total;
            mergedObj["Round 1 Status"] = evalData.status;
            mergedObj.Comments = evalData.comments;
          }

          mergedList.push({
            ...mergedObj,
            _computedLead: lead,
            _computedProject: project,
            _computedTech: tech
          });
        });

        setTeams(mergedList);
        return;
      }

      // Round 2 and Round 3:
      const candidateMap = new Map();
      roundTeams.forEach((rTeam) => {
        const regId = getRegistrationId(rTeam);
        if (regId) {
          const cleanId = String(regId).trim();
          candidateMap.set(cleanId, { ...(mainTeamMap.get(cleanId) || {}), ...rTeam });
        }
      });

      // If round 2: also include teams qualified in round 1
      if (roundNum === 2) {
        const r1Evals = JSON.parse(localStorage.getItem("tx_hackathon_round1_evaluations") || "{}");
        Object.keys(r1Evals).forEach((regId) => {
          const ev = r1Evals[regId];
          const st = normalize(ev.decision || ev.status);
          if (["qualified", "r1qualified", "pass"].includes(st)) {
            const existing = candidateMap.get(regId) || mainTeamMap.get(regId) || {};
            candidateMap.set(regId, { ...existing });
          }
        });
      }

      // If round 3: also include teams qualified in round 2
      if (roundNum === 3) {
        const r2Evals = JSON.parse(localStorage.getItem("tx_hackathon_round2_evaluations") || "{}");
        Object.keys(r2Evals).forEach((regId) => {
          const ev = r2Evals[regId];
          const st = normalize(ev.decision || ev.status);
          if (["qualified", "r2qualified", "pass"].includes(st)) {
            const existing = candidateMap.get(regId) || mainTeamMap.get(regId) || {};
            candidateMap.set(regId, { ...existing });
          }
        });
      }

      // Fallback: If empty, show main teams
      if (candidateMap.size === 0) {
        mainTeams.forEach((mTeam) => {
          const regId = getRegistrationId(mTeam);
          if (regId) candidateMap.set(String(regId).trim(), { ...mTeam });
        });
      }

      candidateMap.forEach((teamObj, regId) => {
        const mainTeamRow = mainTeamMap.get(regId) || {};
        const mergedObj = { ...mainTeamRow, ...teamObj };

        const lead =
          getTeamLead(teamObj) !== "-"
            ? getTeamLead(teamObj)
            : getTeamLead(mainTeamRow) !== "-"
            ? getTeamLead(mainTeamRow)
            : getTeamLead(mergedObj);

        const project =
          getProjectTitle(teamObj) !== "Untitled Project"
            ? getProjectTitle(teamObj)
            : getProjectTitle(mainTeamRow) !== "Untitled Project"
            ? getProjectTitle(mainTeamRow)
            : getProjectTitle(mergedObj);

        const tech =
          getTechnology(teamObj) !== "-"
            ? getTechnology(teamObj)
            : getTechnology(mainTeamRow) !== "-"
            ? getTechnology(mainTeamRow)
            : getTechnology(mergedObj);

        if (localEvals[regId]) {
          const evalData = localEvals[regId];
          mergedObj.Innovation = evalData.innovation;
          mergedObj.Technical = evalData.technical;
          mergedObj.Presentation = evalData.presentation;
          mergedObj.Total = evalData.total;
          if (roundNum === 2) mergedObj["Round 2 Status"] = evalData.status;
          if (roundNum === 3) {
            mergedObj["Round 3 Status"] = evalData.status;
            mergedObj["Status"] = evalData.status;
          }
          mergedObj.Comments = evalData.comments;
        }

        mergedList.push({
          ...mergedObj,
          _computedLead: lead,
          _computedProject: project,
          _computedTech: tech
        });
      });

      setTeams(mergedList);
    } catch (err) {
      console.error(err);
      setError(err.message || `Unable to load Round ${roundNum} teams`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleAttendanceChange = () => loadData();
    const handleEvalChange = () => loadData();
    window.addEventListener("hackathon_attendance_changed", handleAttendanceChange);
    window.addEventListener("hackathon_evaluation_changed", handleEvalChange);
    return () => {
      window.removeEventListener("hackathon_attendance_changed", handleAttendanceChange);
      window.removeEventListener("hackathon_evaluation_changed", handleEvalChange);
    };
  }, []);

  const handleOpenEvaluation = (team) => {
    setSelectedTeam(team);
    setEvaluationOpen(true);
  };

  const handleCloseEvaluation = () => {
    setEvaluationOpen(false);
    setSelectedTeam(null);
  };

  const handleReviewSubmit = async (data) => {
    if (!selectedTeam) return;
    const regId = getRegistrationId(selectedTeam);
    if (!regId) return;

    const localEvals = JSON.parse(localStorage.getItem(localKey) || "{}");
    localEvals[regId] = {
      innovation: data.innovation,
      technical: data.technical,
      presentation: data.presentation,
      total: data.total,
      comments: data.comments,
      status: data.decision,
      decision: data.decision,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(localKey, JSON.stringify(localEvals));

    setTeams((prev) =>
      prev.map((t) => {
        if (getRegistrationId(t) === regId) {
          const updated = {
            ...t,
            Innovation: data.innovation,
            Technical: data.technical,
            Presentation: data.presentation,
            Total: data.total,
            Comments: data.comments,
            Status: data.decision
          };
          if (roundNum === 1) updated["Round 1 Status"] = data.decision;
          if (roundNum === 2) updated["Round 2 Status"] = data.decision;
          if (roundNum === 3) {
            updated["Round 3 Status"] = data.decision;
            updated["Status"] = data.decision;
          }
          return updated;
        }
        return t;
      })
    );

    window.dispatchEvent(new CustomEvent("hackathon_evaluation_changed", { detail: { registrationId: regId, round: roundNum } }));

    try {
      await saveEvaluationApi(
        regId,
        data.innovation,
        data.technical,
        data.presentation,
        data.total,
        data.comments,
        data.decision
      );
    } catch (err) {
      console.warn(`Failed backend sync for Round ${roundNum}:`, err);
    }

    handleCloseEvaluation();
  };

  return {
    teams,
    loading,
    error,
    selectedTeam,
    evaluationOpen,
    loadData,
    handleOpenEvaluation,
    handleCloseEvaluation,
    handleReviewSubmit
  };
};
