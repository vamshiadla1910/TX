/**
 * Student Dashboard Storage Service
 * Encapsulates localStorage interactions, session management, and enrollment persistence.
 */

const STORAGE_KEYS = {
  IS_LOGGED_IN: "isLoggedIn",
  USER_EMAIL: "userEmail",
  USER_NAME: "userName",
  USER_PHONE: "userPhone",
  IS_ADMIN: "isAdmin",
  ENROLLED_COURSES: "enrolledCourses",
  COURSE_PROGRESS: "courseProgress",
};

export const DEFAULT_ENROLLMENTS = [
  {
    courseId: "aws-dop",
    courseCode: "AWS-DOP",
    title: "AWS DevOps Engineer",
    category: "Cloud & DevOps",
    instructor: "Meera Krishnan",
    currentModule: "Module 1",
    progressPercent: 0,
  },
  {
    courseId: "java-fs",
    courseCode: "JAVA-FS",
    title: "Java Full Stack Development",
    category: "Software Development",
    instructor: "Naveen Kulkarni",
    currentModule: "Module 1",
    progressPercent: 0,
  },
];

const KNOWN_CODES = {
  "aws-dop": "AWS-DOP",
  "java-fs": "JAVA-FS",
  "react-fs": "REACT-FS",
  "py-fs": "PY-FS",
  "cloud-devops": "AWS-CLOUD",
};
export const studentStorage = {
  initDemoSession() {
    if (localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) !== "true") {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");
      if (!localStorage.getItem(STORAGE_KEYS.USER_EMAIL)) {
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, "student@pathwing.com");
      }
      if (!localStorage.getItem(STORAGE_KEYS.USER_NAME)) {
        localStorage.setItem(STORAGE_KEYS.USER_NAME, "Aditya Reddy");
      }
      window.dispatchEvent(new Event("authChanged"));
      window.dispatchEvent(new Event("storage"));
    }
  },

  // Session & Profile
  getSession() {
    const isExplicitlyLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true";
    const email = localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || "student@pathwing.com";
    const storedName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
    const name = storedName || (email && email.includes("@") ? email.split("@")[0] : "Aditya Reddy");
    const phone = localStorage.getItem(STORAGE_KEYS.USER_PHONE) || "";
    const isAdmin = localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === "true";
    const initials =
      name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "AR";

    return { isLoggedIn: true, isExplicitlyLoggedIn, email, name, phone, isAdmin, initials };
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    localStorage.removeItem(STORAGE_KEYS.USER_PHONE);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    localStorage.removeItem("userRole");
    localStorage.removeItem("isPlatformAdmin");
    localStorage.removeItem("isHackathonAdmin");

    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("storage"));
  },

  // Enrollments
  getEnrolledCourses() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENROLLED_COURSES) || "[]");
      if (Array.isArray(stored) && stored.length > 0) {
        return stored.map((item) => {
          const rawId = item.courseId || item.id || item.code?.toLowerCase() || "course";
          const cleanId = rawId.toLowerCase();
          const resolvedCode =
            (item.courseCode && item.courseCode !== "COURSE" ? item.courseCode : null) ||
            (item.code && item.code !== "COURSE" ? item.code : null) ||
            KNOWN_CODES[cleanId] ||
            cleanId.toUpperCase();

          return {
            courseId: cleanId,
            courseCode: resolvedCode,
            title: item.title || item.name || "Enrolled Course",
            category: item.category || "Software Development",
            instructor: item.instructor || "Pathwing Faculty",
            currentModule: item.currentModule || "Module 1",
            progressPercent:
              item.progressPercent !== undefined
                ? item.progressPercent
                : item.progress !== undefined
                ? item.progress
                : 0,
          };
        });
      }
    } catch {
      // Fallback on parse failure
    }
    return DEFAULT_ENROLLMENTS;
  },

  enrollCourse(course) {
    const current = this.getEnrolledCourses();
    const cleanId = (course.id || course.code || course.courseId || "").toLowerCase();

    const isAlreadyEnrolled = current.some(
      (e) => (e.courseId || e.id || e.courseCode || "").toLowerCase() === cleanId
    );

    if (isAlreadyEnrolled) {
      return { success: false, message: "Already enrolled in this course." };
    }

    const resolvedCode =
      (course.code && course.code !== "COURSE" ? course.code : null) ||
      KNOWN_CODES[cleanId] ||
      cleanId.toUpperCase();

    const newCourse = {
      id: cleanId,
      courseId: cleanId,
      code: resolvedCode,
      courseCode: resolvedCode,
      title: course.title,
      price: course.price,
      category: course.category || "Software Development",
      instructor: course.instructor || "Pathwing Faculty",
      progressPercent: 0,
      currentModule: course.syllabus?.[0]?.t ? `Module 1: ${course.syllabus[0].t}` : "Module 1",
    };

    const updated = [...current, newCourse];
    localStorage.setItem(STORAGE_KEYS.ENROLLED_COURSES, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));

    return { success: true, course: newCourse, message: `Successfully enrolled in ${course.title}!` };
  },

  updateCourseProgress(courseId, progressPercent) {
    const current = this.getEnrolledCourses();
    const cleanId = courseId.toLowerCase();

    const updated = current.map((c) => {
      if ((c.courseId || c.id || "").toLowerCase() === cleanId) {
        return { ...c, progressPercent };
      }
      return c;
    });

    localStorage.setItem(STORAGE_KEYS.ENROLLED_COURSES, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  },
};
