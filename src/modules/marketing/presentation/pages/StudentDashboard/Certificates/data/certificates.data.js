/**
 * Student Certificates Data Model & Resolution Helper
 * Dynamically resolves recipient name from the "Create your account" page or signed-in email.
 */

/**
 * Sanitizes a student name (e.g. from "Create your account" form):
 * Strips any digits (0-9) and non-alphabetic symbols, keeping only letters and spaces.
 */
export function sanitizeName(name) {
  if (!name || typeof name !== "string") return "";
  return name
    .replace(/[^a-zA-Z\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Extracts student name and surname from an email address:
 * Strips all numbers and symbols, keeping only name and surname.
 * Example:
 * "john.doe123@gmail.com" -> "John Doe"
 * "alex_smith99@yahoo.com" -> "Alex Smith"
 * "sarah-connor@domain.com" -> "Sarah Connor"
 * "rahul.kumar#2026@test.com" -> "Rahul Kumar"
 */
export function extractStudentNameFromEmail(email) {
  if (!email || typeof email !== "string") {
    return "Aditya Reddy";
  }

  // 1. Get portion before '@' (and strip any plus tags)
  const atSplit = email.trim().split("@")[0] || "";
  const baseLocal = atSplit.split("+")[0] || "";

  // 2. Separate camelCase (e.g. "johnDoe" -> "john Doe")
  const splitCamel = baseLocal.replace(/([a-z])([A-Z])/g, "$1 $2");

  // 3. Remove all numbers (0-9) and all symbols (., _, -, #, etc.)
  const lettersOnly = splitCamel.replace(/[^a-zA-Z]+/g, " ").trim();

  if (!lettersOnly) {
    return "Aditya Reddy";
  }

  // 4. Split into words and capitalize each word (Name and Surname)
  const words = lettersOnly
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  if (words.length === 0) {
    return "Aditya Reddy";
  }

  if (words.length === 1 && words[0].toLowerCase() === "student") {
    return "Aditya Reddy";
  }

  return words.join(" ");
}

/**
 * Resolves the final certificate student name using:
 * 1. Explicit name from "Create your account" page / form
 * 2. Active session userName in localStorage (saved during account creation or login)
 * 3. Registered custom user name in localStorage (tx_custom_users)
 * 4. Dynamic extraction from active user email (name and surname, no numbers/symbols)
 * 5. Default fallback: "Aditya Reddy"
 */
export function resolveStudentCertificateName(email, explicitName) {
  // 1. Check explicit name provided (e.g. from props or signup form)
  if (explicitName) {
    const cleaned = sanitizeName(explicitName);
    if (cleaned && cleaned.toLowerCase() !== "user" && cleaned.toLowerCase() !== "student") {
      return cleaned;
    }
  }

  // 2. Check active session userName from localStorage (e.g. saved from "Create your account" form)
  if (typeof localStorage !== "undefined") {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      const cleaned = sanitizeName(storedName);
      if (cleaned && cleaned.toLowerCase() !== "user" && cleaned.toLowerCase() !== "student") {
        return cleaned;
      }
    }
  }

  const activeEmail = (email || (typeof localStorage !== "undefined" ? localStorage.getItem("userEmail") : "") || "").trim().toLowerCase();

  // 3. Check if this email was registered via "Create your account" in tx_custom_users
  if (typeof localStorage !== "undefined" && activeEmail) {
    try {
      const rawUsers = localStorage.getItem("tx_custom_users");
      if (rawUsers) {
        const customUsers = JSON.parse(rawUsers);
        const matched = customUsers.find(
          (u) => u.email && u.email.toLowerCase() === activeEmail
        );
        if (matched && matched.name) {
          const cleaned = sanitizeName(matched.name);
          if (cleaned) return cleaned;
        }
      }
    } catch {
      // Ignore parse errors and fallback
    }
  }

  // 4. Derive from user's email: extract name and surname, omitting numbers & symbols
  if (activeEmail) {
    const fromEmail = extractStudentNameFromEmail(activeEmail);
    if (fromEmail && fromEmail !== "Student Learner") {
      return fromEmail;
    }
  }

  return "Aditya Reddy";
}

export const CERTIFICATES_DATA = [
  {
    id: "PW-IAC-2026-8831",
    title: "Infrastructure as Code (Terraform) Associate",
    course: "IaC Fundamentals & Cloud Automation",
    studentName: "Aditya Reddy",
    tenant: "KITSW · Learner Pro",
    issuer: "Pathwing & HashiCorp Partner Track",
    issuedDate: "12 Oct 2026",
    grade: "94% (Distinction)",
    skills: ["Terraform", "AWS S3 Backend", "DynamoDB State Locking", "HCL"],
    color: "#2563eb",
    badgeText: "Verified Credential"
  },
  {
    id: "PW-CLOUD-2026-9948",
    title: "Cloud Architecture & DevOps Specialist",
    course: "AWS Solutions Architect Fundamentals",
    studentName: "Aditya Reddy",
    tenant: "KITSW · Learner Pro",
    issuer: "Pathwing Cloud Academy",
    issuedDate: "18 Sep 2026",
    grade: "91% (Distinction)",
    skills: ["AWS EC2 & VPC", "CI/CD Pipelines", "Docker", "IAM Security"],
    color: "#7c3aed",
    badgeText: "Verified Credential"
  },
  {
    id: "PW-MERN-2026-7729",
    title: "Full Stack React & Node.js Engineer",
    course: "Modern Web & Microservices Track",
    studentName: "Aditya Reddy",
    tenant: "KITSW · Learner Pro",
    issuer: "Pathwing Engineering",
    issuedDate: "05 Aug 2026",
    grade: "89% (Merit)",
    skills: ["React 19", "Node.js", "REST APIs", "MongoDB"],
    color: "#16a34a",
    badgeText: "Verified Credential"
  }
];

export function getCertificatesForUser(email, explicitName) {
  const studentName = resolveStudentCertificateName(email, explicitName);
  return CERTIFICATES_DATA.map((cert) => ({
    ...cert,
    studentName,
  }));
}
