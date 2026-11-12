/**
 * Topic & Module Input Validation
 * Enforces business rules and constraints for syllabus module and topic creation/modification.
 */

function validateOrderedTextEntity({ title, description, duration, order, maxOrder = 99, entityLabel = "Topic" }) {
  const errors = {};

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.title = `${entityLabel} title is required.`;
  } else if (title.trim().length < 3) {
    errors.title = `${entityLabel} title must be at least 3 characters.`;
  } else if (title.trim().length > 150) {
    errors.title = `${entityLabel} title cannot exceed 150 characters.`;
  }

  if (description && typeof description === "string" && description.trim().length > 600) {
    errors.description = "Description cannot exceed 600 characters.";
  }

  if (duration && typeof duration === "string" && duration.trim().length > 40) {
    errors.duration = "Duration text cannot exceed 40 characters (e.g. '45 mins', '2 hours').";
  }

  if (order !== undefined && order !== null && order !== "") {
    const numOrder = Number(order);
    if (isNaN(numOrder) || !Number.isInteger(numOrder) || numOrder < 1) {
      errors.order = "Order must be a positive integer greater than or equal to 1.";
    } else if (numOrder > maxOrder + 1) {
      errors.order = `Order cannot exceed ${maxOrder + 1}.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateTopicInput({ title, description, duration, order, maxOrder = 99 }) {
  return validateOrderedTextEntity({
    title,
    description,
    duration,
    order,
    maxOrder,
    entityLabel: "Topic"
  });
}

export function validateModuleInput({ title, description, duration, order, maxOrder = 99 }) {
  return validateOrderedTextEntity({
    title,
    description,
    duration,
    order,
    maxOrder,
    entityLabel: "Module"
  });
}

export default validateTopicInput;
