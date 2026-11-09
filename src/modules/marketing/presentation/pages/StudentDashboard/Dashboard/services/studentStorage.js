/**
 * Student Dashboard Storage & Session Service
 * Encapsulates localStorage interactions, session management, and enrollment persistence.
 * Delegates to studentApi for unified syllabus topic progress and dynamic calculations.
 */

import { studentApi } from "./studentApi";
import { getCourseByIdOrCode } from "./courseCatalogue.data";

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
    if (localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true") {

      if (!localStorage.getItem(STORAGE_KEYS.USER_EMAIL)) {
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, "student@pathwing.com");
      }
      if (!localStorage.getItem(STORAGE_KEYS.USER_NAME)) {
        localStorage.setItem(STORAGE_KEYS.USER_NAME, "Aditya Reddy");
      }
    }
  },

  // Session & Profile
  getSession() {
    const isExplicitlyLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true";
    const email = localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || "";
    const storedName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
    const name = storedName || (email && email.includes("@") ? email.split("@")[0] : "Student Learner");
    const phone = localStorage.getItem(STORAGE_KEYS.USER_PHONE) || "";
    const isAdmin = localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === "true";
    const initials =
      name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "SL";

    return { isLoggedIn: isExplicitlyLoggedIn, isExplicitlyLoggedIn, email, name, phone, isAdmin, initials };
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    localStorage.removeItem(STORAGE_KEYS.USER_PHONE);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);

    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("storage"));
  },

  // Enrollments
  getEnrolledCourses() {
    studentApi.init();
    const allProgress = studentApi.getAllTopicProgress();
    let rawList = [];

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENROLLED_COURSES) || "[]");
      if (Array.isArray(stored) && stored.length > 0) {
        rawList = stored;
      } else {
        rawList = DEFAULT_ENROLLMENTS;
      }
    } catch {
      rawList = DEFAULT_ENROLLMENTS;
    }

    return rawList
      .map((item) => {
        const rawId = item.courseId || item.id || item.code?.toLowerCase() || "course";
        const course = getCourseByIdOrCode(rawId);

        if (!course) {
          return {
            courseId: (item.courseId || item.id || "course").toLowerCase(),
            courseCode: item.courseCode || item.code || "COURSE",
            title: item.title || item.name || "Enrolled Course",
            category: item.category || "Software Development",
            instructor: item.instructor || "Pathwing Faculty",
            currentModule: item.currentModule || "Module 1",
            progressPercent: item.progressPercent || 0,
          };
        }

        const cProg = allProgress[course.id] || allProgress[course.code] || {};
        const topics = course.modules?.flatMap((m) => m.topics) || [];
        const completedCount = topics.filter(
          (t) => cProg.topics?.[t.id]?.status === "completed"
        ).length;
        const calcPercent = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

        return {
          courseId: course.id,
          courseCode: course.code,
          title: course.title,
          category: course.category,
          level: course.level,
          instructor: course.instructor.name,
          instructorRole: course.instructor.role,
          image: course.image,
          currentModule: item.currentModule || `Module 1: ${course.modules?.[0]?.title || "Fundamentals"}`,
          progressPercent: calcPercent,
          completedTopics: completedCount,
          totalTopics: topics.length,
          remainingTopics: topics.length - completedCount,
        };
      })
      .filter(Boolean);
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

    const matched = getCourseByIdOrCode(cleanId);
    const resolvedCode = matched?.code || cleanId.toUpperCase();
    const resolvedTitle = matched?.title || course.title;

    const newCourse = {
      id: cleanId,
      courseId: cleanId,
      code: resolvedCode,
      courseCode: resolvedCode,
      title: resolvedTitle,
      price: course.price,
      category: matched?.category || course.category || "Software Development",
      instructor: matched?.instructor?.name || course.instructor || "Pathwing Faculty",
      progressPercent: 0,
      currentModule: matched?.modules?.[0]?.title
        ? `Module 1: ${matched.modules[0].title}`
        : "Module 1",
    };

    const updated = [...current, newCourse];
    localStorage.setItem(STORAGE_KEYS.ENROLLED_COURSES, JSON.stringify(updated));

    // Initialize progress map
    const allProgress = studentApi.getAllTopicProgress();
    allProgress[cleanId] = {
      lastAccessedTopicId: matched?.modules?.[0]?.topics?.[0]?.id || null,
      topics: {},
    };
    studentApi.saveAllTopicProgress(allProgress);

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("enrollmentChanged", { detail: newCourse }));

    return {
      success: true,
      course: newCourse,
      message: `Successfully enrolled in ${resolvedTitle}!`,
    };
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
