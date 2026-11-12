/**
 * Course Input Validation & Helpers
 * Shared validation rules for creating and editing both manually authored
 * and AI-generated courses in My Courses and Course Builder workflows.
 */

export const COURSE_CATEGORIES = [
  "Software Development",
  "Artificial Intelligence & Systems",
  "Cloud & DevOps",
  "Web Development",
  "Cybersecurity",
  "System Design"
];

export const COURSE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Intermediate to Advanced",
  "Advanced",
  "All Levels"
];

export const COURSE_STATUSES = [
  "Published",
  "In Review",
  "Draft"
];

/**
 * Generate a concise uppercase course code from a course title.
 * @param {string} title
 * @param {string} [fallback="CUSTOM-101"]
 * @returns {string}
 */
export function suggestCourseCode(title, fallback = "CUSTOM-101") {
  if (!title || typeof title !== "string" || !title.trim()) {
    return fallback;
  }
  const parts = title
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase())
    .filter(Boolean);

  if (parts.length === 0) return fallback;
  return parts.slice(0, 2).join("-");
}

/**
 * Validate course metadata fields prior to persistence.
 * @param {Object} input
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateCourseInput({
  title,
  code,
  category,
  level,
  price,
  totalHours,
  description,
  targetAudience
} = {}) {
  const errors = {};

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.title = "Course title is required.";
  } else if (title.trim().length < 3) {
    errors.title = "Course title must be at least 3 characters.";
  } else if (title.trim().length > 150) {
    errors.title = "Course title cannot exceed 150 characters.";
  }

  if (!code || typeof code !== "string" || !code.trim()) {
    errors.code = "Course code is required.";
  } else if (code.trim().length < 2 || code.trim().length > 24) {
    errors.code = "Course code must be 2 to 24 characters.";
  } else if (!/^[A-Za-z0-9-_]+$/.test(code.trim())) {
    errors.code = "Course code can only contain letters, numbers, '-' or '_'.";
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    errors.category = "Category is required.";
  }

  if (!level || typeof level !== "string" || !level.trim()) {
    errors.level = "Proficiency level is required.";
  }

  if (price !== undefined && price !== null && price !== "") {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0 || numPrice > 10000000) {
      errors.price = "Price must be a valid non-negative amount.";
    }
  }

  if (totalHours !== undefined && totalHours !== null && totalHours !== "") {
    const numHours = Number(totalHours);
    if (isNaN(numHours) || numHours < 1 || numHours > 2000) {
      errors.totalHours = "Estimated hours must be between 1 and 2000.";
    }
  }

  if (description && typeof description === "string" && description.trim().length > 1000) {
    errors.description = "Description cannot exceed 1000 characters.";
  }

  if (targetAudience && typeof targetAudience === "string" && targetAudience.trim().length > 250) {
    errors.targetAudience = "Target audience cannot exceed 250 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export default validateCourseInput;
