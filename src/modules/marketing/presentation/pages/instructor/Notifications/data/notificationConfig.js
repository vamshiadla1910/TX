/**
 * Notification Configuration & Metadata
 * Defines categories, filter types, styling tokens, and initial data mappings.
 */

import {
  AlertCircle,
  FileCheck,
  HelpCircle,
  Radio,
  Star,
  Bell,
  BookOpen,
  Users
} from "lucide-react";

import {
  initialAttentionItems,
  initialAssignments,
  initialQnA,
  initialLiveSessions,
  initialReviews
} from "../../data/mockData.js";

export const NOTIFICATION_CATEGORIES = {
  ATTENTION: "attention",
  ASSIGNMENT: "assignment",
  QUESTION: "question",
  SESSION: "session",
  REVIEW: "review",
  SYSTEM: "system"
};

export const NOTIFICATION_FILTERS = {
  ALL: "all",
  UNREAD: "unread"
};

/**
 * Category Visual & Routing Metadata
 */
export const CATEGORY_CONFIG = {
  [NOTIFICATION_CATEGORIES.ATTENTION]: {
    label: "Action Required",
    badgeClass: "badge-attention",
    iconBgClass: "icon-bg-attention",
    icon: AlertCircle,
    color: "#ef4444",
    targetPage: "Dashboard"
  },
  [NOTIFICATION_CATEGORIES.ASSIGNMENT]: {
    label: "Assignment",
    badgeClass: "badge-assignment",
    iconBgClass: "icon-bg-assignment",
    icon: FileCheck,
    color: "#f59e0b",
    targetPage: "Assignments"
  },
  [NOTIFICATION_CATEGORIES.QUESTION]: {
    label: "Q&A Forum",
    badgeClass: "badge-question",
    iconBgClass: "icon-bg-question",
    icon: HelpCircle,
    color: "#0284c7",
    targetPage: "Q&A Forum"
  },
  [NOTIFICATION_CATEGORIES.SESSION]: {
    label: "Live Session",
    badgeClass: "badge-session",
    iconBgClass: "icon-bg-session",
    icon: Radio,
    color: "#7c3aed",
    targetPage: "Live Sessions"
  },
  [NOTIFICATION_CATEGORIES.REVIEW]: {
    label: "Learner Review",
    badgeClass: "badge-review",
    iconBgClass: "icon-bg-review",
    icon: Star,
    color: "#10b981",
    targetPage: "Reviews"
  },
  [NOTIFICATION_CATEGORIES.SYSTEM]: {
    label: "Platform Update",
    badgeClass: "badge-system",
    iconBgClass: "icon-bg-system",
    icon: Bell,
    color: "#2563eb",
    targetPage: "Dashboard"
  }
};

/**
 * Generate seed notifications from canonical dashboard datasets
 */
export const generateSeedNotifications = () => {
  const seed = [];

  // Urgent attention items
  if (Array.isArray(initialAttentionItems)) {
    initialAttentionItems.forEach((item) => {
      seed.push({
        id: `attention-${item.id}`,
        title: item.title || "Action Required",
        message: item.details || item.description || "An item requires your attention.",
        type: NOTIFICATION_CATEGORIES.ATTENTION,
        page: "Dashboard",
        time: item.timestamp || "Recently",
        priority: item.priority || "urgent",
        read: false,
        sourceId: item.id
      });
    });
  }

  // Pending assignments for grading
  if (Array.isArray(initialAssignments)) {
    initialAssignments
      .filter((item) => item.status === "Pending Review")
      .forEach((item) => {
        seed.push({
          id: `assignment-${item.id}`,
          title: "Assignment Pending Review",
          message: `${item.title || "A learner assignment"} is waiting for grading (${item.pendingGrading || 1} submissions).`,
          type: NOTIFICATION_CATEGORIES.ASSIGNMENT,
          page: "Assignments",
          time: item.dueDate ? `Due ${item.dueDate}` : "Recently",
          priority: "high",
          read: false,
          sourceId: item.id
        });
      });
  }

  // Pending Q&A questions from learners
  if (Array.isArray(initialQnA)) {
    initialQnA
      .filter((item) => item.status === "Pending")
      .forEach((item) => {
        seed.push({
          id: `qna-${item.id}`,
          title: `New Question from ${item.student || "Learner"}`,
          message: item.question || "A learner has submitted a new question.",
          type: NOTIFICATION_CATEGORIES.QUESTION,
          page: "Q&A Forum",
          time: item.timestamp || "Recently",
          priority: "normal",
          read: false,
          sourceId: item.id
        });
      });
  }

  // Upcoming live mentoring sessions
  if (Array.isArray(initialLiveSessions)) {
    initialLiveSessions
      .filter((item) => item.status === "Upcoming")
      .forEach((item) => {
        seed.push({
          id: `session-${item.id}`,
          title: "Upcoming Live Session",
          message: `${item.title || "Live Session"} starts at ${item.time || "Scheduled Time"}.`,
          type: NOTIFICATION_CATEGORIES.SESSION,
          page: "Live Sessions",
          time: item.date || "Upcoming",
          priority: "normal",
          read: false,
          sourceId: item.id
        });
      });
  }

  // High rating recent review
  if (Array.isArray(initialReviews) && initialReviews.length > 0) {
    const topReview = initialReviews[0];
    seed.push({
      id: `review-${topReview.id}`,
      title: `New 5-Star Review (${topReview.courseTitle || "Course"})`,
      message: topReview.comment ? `"${topReview.comment}" - ${topReview.learnerName || "Learner"}` : "A learner left positive feedback.",
      type: NOTIFICATION_CATEGORIES.REVIEW,
      page: "Reviews",
      time: topReview.date || "Yesterday",
      priority: "normal",
      read: true,
      sourceId: topReview.id
    });
  }

  return seed;
};
