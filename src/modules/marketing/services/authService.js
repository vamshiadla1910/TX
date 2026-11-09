/**
 * Authentication and Role Authorization Service
 * Manages platform accounts, role verification, and session persistence.
 */

export const ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  INSTITUTION: "institution",
  HACKATHON: "hackathon_admin",
};

export const ROLE_CONFIGS = {
  student: {
    key: "student",
    name: "Student",
    displayName: "Student Dashboard",
    welcomeLabel: "Welcome Student",
    welcomeHeading: "Welcome back, Student",
    subtitle: "Sign in to access your Student Dashboard.",
    route: "/dashboard",
    color: "#2563eb",
    bgTint: "rgba(37, 99, 235, 0.12)",
    borderTint: "rgba(59, 130, 246, 0.25)",
    tagline: "Courses • Progress • Coding Lab",
    description: "Access enrolled courses, track learning progress, submit assignments, and view certificates.",
  },
  admin: {
    key: "admin",
    name: "Admin",
    displayName: "Admin Dashboard",
    welcomeLabel: "Welcome Admin",
    welcomeHeading: "Welcome back, Admin",
    subtitle: "Sign in to access your Admin Dashboard.",
    route: "/admin-dashboard",
    color: "#7c3aed",
    bgTint: "rgba(124, 58, 237, 0.12)",
    borderTint: "rgba(139, 92, 246, 0.25)",
    tagline: "Operations • Security • Governance",
    description: "Manage platform tenants, roles, course approvals, user moderation, and audit security logs.",
  },
  instructor: {
    key: "instructor",
    name: "Instructor",
    displayName: "Instructor Dashboard",
    welcomeLabel: "Welcome Instructor",
    welcomeHeading: "Welcome back, Instructor",
    subtitle: "Sign in to access your Instructor Dashboard.",
    route: "/instructor-dashboard",
    color: "#0284c7",
    bgTint: "rgba(2, 132, 199, 0.12)",
    borderTint: "rgba(14, 165, 233, 0.25)",
    tagline: "Curriculum • Learners • Live Sessions",
    description: "Publish courses, conduct live lectures, review assignments, and mentor active learners.",
  },
  institution: {
    key: "institution",
    name: "Institution",
    displayName: "Institution Dashboard",
    welcomeLabel: "Welcome Institution",
    welcomeHeading: "Welcome back, Institution",
    subtitle: "Sign in to access your Institution Dashboard.",
    route: "/institution-dashboard",
    color: "#059669",
    bgTint: "rgba(5, 150, 105, 0.12)",
    borderTint: "rgba(16, 185, 129, 0.25)",
    tagline: "Campus • Cohorts • Accreditation",
    description: "Monitor university and department metrics, manage cohorts, and review compliance records.",
  },
};

// Canonical Pre-configured Accounts in the platform backend
export const KNOWN_ACCOUNTS = [
  // Platform Admin Accounts
  {
    email: "admin@pathwing.com",
    passwords: ["tanvox12340", "admin123"],
    name: "Sunil Nambiar",
    role: "admin",
    roleLabel: "Admin",
    targetDashboard: "/admin-dashboard",
    isPlatformAdmin: true,
    isAdmin: true,
  },
  {
    email: "sunil.n@pathwing.in",
    passwords: ["tanvox12340", "admin123"],
    name: "Sunil Nambiar",
    role: "admin",
    roleLabel: "Admin",
    targetDashboard: "/admin-dashboard",
    isPlatformAdmin: true,
    isAdmin: true,
  },

  // Instructor Accounts
  {
    email: "ramana.r@kitsw.ac.in",
    passwords: ["instructor123", "tanvox12340"],
    name: "Dr. R. Ramana",
    role: "instructor",
    roleLabel: "Instructor",
    targetDashboard: "/instructor-dashboard",
  },
  {
    email: "instructor@pathwing.com",
    passwords: ["instructor123", "tanvox12340"],
    name: "Dr. R. Ramana",
    role: "instructor",
    roleLabel: "Instructor",
    targetDashboard: "/instructor-dashboard",
  },
  {
    email: "vpatel@txhub.org",
    passwords: ["instructor123", "tanvox12340"],
    name: "Vikram Patel",
    role: "instructor",
    roleLabel: "Instructor",
    targetDashboard: "/instructor-dashboard",
  },

  // Institution Accounts
  {
    email: "institution@pathwing.com",
    passwords: ["institution123", "tanvox12340", "kits123"],
    name: "R. Sathyanarayana",
    role: "institution",
    roleLabel: "Institution",
    targetDashboard: "/institution-dashboard",
  },
  {
    email: "r.sathya@kits.edu",
    passwords: ["institution123", "kits123"],
    name: "R. Sathyanarayana",
    role: "institution",
    roleLabel: "Institution",
    targetDashboard: "/institution-dashboard",
  },
  {
    email: "institutionadmin@kitsw.ac.in",
    passwords: ["institution123", "kits123"],
    name: "Tenant Admin · KITS Warangal",
    role: "institution",
    roleLabel: "Institution",
    targetDashboard: "/institution-dashboard",
  },
  {
    email: "karan.j@anurag.edu.in",
    passwords: ["institution123"],
    name: "Karan Johar",
    role: "institution",
    roleLabel: "Institution",
    targetDashboard: "/institution-dashboard",
  },
  {
    email: "p.varma@deloitte.com",
    passwords: ["institution123"],
    name: "Priya Varma",
    role: "institution",
    roleLabel: "Institution",
    targetDashboard: "/institution-dashboard",
  },

  // Student Accounts
  {
    email: "student@pathwing.com",
    passwords: ["student123"],
    name: "Aditya Reddy",
    role: "student",
    roleLabel: "Student",
    targetDashboard: "/dashboard",
  },
  {
    email: "aarav.sharma@kitsw.pathwing.in",
    passwords: ["student123"],
    name: "Aarav Sharma",
    role: "student",
    roleLabel: "Student",
    targetDashboard: "/dashboard",
  },
  {
    email: "sneha.reddy@student.valuelabs.com",
    passwords: ["student123"],
    name: "Sneha Reddy",
    role: "student",
    roleLabel: "Student",
    targetDashboard: "/dashboard",
  },

  // Hackathon Portal Account
  {
    email: "tanvoxadmin@gmail.com",
    passwords: ["tanvox12340"],
    name: "Lead Judge",
    role: "hackathon_admin",
    roleLabel: "Hackathon Admin",
    targetDashboard: "/hackathon-dashboard",
    isAdmin: true,
  },
];

/**
 * Retrieve custom registered users from localStorage
 */
export function getCustomUsers() {
  try {
    const raw = localStorage.getItem("tx_custom_users");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Find user by email across canonical and registered accounts
 */
export function findUserByEmail(emailInput) {
  if (!emailInput) return null;
  const email = emailInput.trim().toLowerCase();

  // Search canonical presets first
  const canonical = KNOWN_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === email
  );
  if (canonical) return canonical;

  // Search custom registered users
  const customUsers = getCustomUsers();
  const custom = customUsers.find(
    (acc) => acc.email.toLowerCase() === email
  );
  if (custom) return custom;

  return null;
}

/**
 * Normalize role strings into standard keys
 */
export function normalizeRole(role) {
  if (!role) return "student";
  const r = role.toLowerCase().trim();
  if (r === "admin" || r === "platform_admin" || r === "super admin") return "admin";
  if (r === "instructor" || r === "mentor") return "instructor";
  if (r === "institution" || r === "institution_admin" || r === "org admin") return "institution";
  if (r === "hackathon_admin") return "hackathon_admin";
  return "student";
}

/**
 * Return friendly role label
 */
export function getRoleDisplayName(role) {
  const norm = normalizeRole(role);
  if (norm === "admin") return "Admin";
  if (norm === "instructor") return "Instructor";
  if (norm === "institution") return "Institution";
  if (norm === "hackathon_admin") return "Hackathon Admin";
  return "Student";
}

/**
 * Return authorized dashboard route for a role
 */
export function getDashboardRouteForRole(role) {
  const norm = normalizeRole(role);
  if (norm === "admin") return "/admin-dashboard";
  if (norm === "instructor") return "/instructor-dashboard";
  if (norm === "institution") return "/institution-dashboard";
  if (norm === "hackathon_admin") return "/hackathon-dashboard";
  return "/dashboard";
}

/**
 * Verify user credentials (email and password)
 * 
 * In Student login portal (selectedRole === 'student'):
 * - Allows ANY email and ANY password (only student login)
 * - If an existing non-student account (Admin, Instructor, Institution) is entered,
 *   it verifies the password to return the account, enabling the UI to surface
 *   the role mismatch error so that portals stay properly separated.
 * 
 * For all other portals (Admin, Instructor, Institution):
 * - Strictly requires valid, registered credentials matching the respective role.
 */
export function verifyCredentials(emailInput, passwordInput, selectedRole = null) {
  const email = (emailInput || "").trim().toLowerCase();
  const password = passwordInput || "";

  if (!email) {
    return { success: false, error: "Email address is required." };
  }
  if (!password) {
    return { success: false, error: "Password is required." };
  }

  const normalizedSelectedRole = selectedRole ? normalizeRole(selectedRole) : null;
  const account = findUserByEmail(email);

  // If this is the student login portal, allow ANY email and ANY password (only student login)
  if (normalizedSelectedRole === "student") {
    // If the account belongs to a known non-student role (admin, instructor, institution):
    // verify the password so we can trigger the role mismatch error in the UI
    if (account && account.role !== "student") {
      const validPasswords = account.passwords || (account.password ? [account.password] : []);
      const isValid = validPasswords.includes(password);
      if (!isValid) {
        return {
          success: false,
          error: "Invalid email or password. Please verify your credentials.",
        };
      }
      return { success: true, user: account };
    }

    // If it's an existing registered student account, return it
    if (account && account.role === "student") {
      return { success: true, user: account };
    }

    // For any other email address: dynamically create authorized student user
    const prefix = email.split("@")[0] || "Learner";
    const cleanLetters = prefix.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[^a-zA-Z]+/g, " ").trim();
    const formattedName =
      (cleanLetters
        ? cleanLetters
            .split(/\s+/)
            .filter(Boolean)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ")
        : "") || "Student Learner";

    const studentUser = {
      email,
      name: formattedName,
      role: "student",
      roleLabel: "Student",
      targetDashboard: "/dashboard",
    };
    return { success: true, user: studentUser };
  }

  // Strict credential verification for Admin, Instructor, Institution, or when selectedRole is not student
  if (account) {
    const validPasswords = account.passwords || (account.password ? [account.password] : []);
    const isValid = validPasswords.includes(password);
    if (!isValid) {
      return {
        success: false,
        error: "Invalid email or password. Please verify your credentials.",
      };
    }
    return { success: true, user: account };
  }

  return {
    success: false,
    error: "Account not found with this email. Please check your credentials or create a new account.",
  };
}

/**
 * Register a new user account into localStorage
 */
export function registerCustomUser({ email, password, full_name, phone, role }) {
  const customUsers = getCustomUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const assignedRole = normalizeRole(role || "student");

  const newUser = {
    email: normalizedEmail,
    passwords: [password],
    name: (full_name && full_name.trim()) || "Learner",
    phone: (phone && phone.trim()) || "",
    role: assignedRole,
    roleLabel: getRoleDisplayName(assignedRole),
    targetDashboard: getDashboardRouteForRole(assignedRole),
  };

  const existingIdx = customUsers.findIndex(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (existingIdx >= 0) {
    customUsers[existingIdx] = newUser;
  } else {
    customUsers.push(newUser);
  }

  localStorage.setItem("tx_custom_users", JSON.stringify(customUsers));
  localStorage.setItem("userName", newUser.name);
  localStorage.setItem("userEmail", normalizedEmail);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("storage"));
  }
  return newUser;
}

/**
 * Set active authenticated session in localStorage
 */
export function setAuthenticatedSession(user) {
  const normRole = normalizeRole(user.role);

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userName", user.name || "User");
  localStorage.setItem("userRole", normRole);

  if (normRole === "admin" || user.isPlatformAdmin) {
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("isPlatformAdmin", "true");
  } else {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isPlatformAdmin");
  }

  if (normRole === "hackathon_admin") {
    localStorage.setItem("isAdmin", "true");
  }

  window.dispatchEvent(new Event("authChanged"));
  window.dispatchEvent(new Event("storage"));
}

/**
 * Clear authenticated session
 */
export function clearAuthenticatedSession() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userPhone");
  localStorage.removeItem("userRole");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("isPlatformAdmin");
  localStorage.removeItem("isHackathonAdmin");

  window.dispatchEvent(new Event("authChanged"));
  window.dispatchEvent(new Event("storage"));
}
