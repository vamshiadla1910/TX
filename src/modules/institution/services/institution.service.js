/**
 * Institution Service
 * Manages local browser storage persistence and institutional summary metrics
 */

import { initialLearners } from '../data/learners.data.js';
import { initialCourses } from '../data/courses.data.js';
import { initialProgrammes } from '../data/programmes.data.js';
import { initialEvents } from '../data/events.data.js';
import { initialCompliance } from '../data/compliance.data.js';
import { initialDepartments, initialNotifications } from '../data/departments.data.js';

const STORAGE_KEYS = {
  LEARNERS: 'tx_institution_learners',
  COURSES: 'tx_institution_courses',
  PROGRAMMES: 'tx_institution_programmes',
  EVENTS: 'tx_institution_events',
  COMPLIANCE: 'tx_institution_compliance',
  DEPARTMENTS: 'tx_institution_departments',
  NOTIFICATIONS: 'tx_institution_notifications',
  THEME: 'tx_institution_theme'
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

export const institutionService = {
  loadAll() {
    return {
      learners: safeGet(STORAGE_KEYS.LEARNERS, initialLearners),
      courses: safeGet(STORAGE_KEYS.COURSES, initialCourses),
      programmes: safeGet(STORAGE_KEYS.PROGRAMMES, initialProgrammes),
      events: safeGet(STORAGE_KEYS.EVENTS, initialEvents),
      compliance: safeGet(STORAGE_KEYS.COMPLIANCE, initialCompliance),
      departments: safeGet(STORAGE_KEYS.DEPARTMENTS, initialDepartments),
      notifications: safeGet(STORAGE_KEYS.NOTIFICATIONS, initialNotifications),
      dark: localStorage.getItem(STORAGE_KEYS.THEME) === 'dark'
    };
  },

  saveLearners(data) { safeSet(STORAGE_KEYS.LEARNERS, data); },
  saveCourses(data) { safeSet(STORAGE_KEYS.COURSES, data); },
  saveProgrammes(data) { safeSet(STORAGE_KEYS.PROGRAMMES, data); },
  saveEvents(data) { safeSet(STORAGE_KEYS.EVENTS, data); },
  saveCompliance(data) { safeSet(STORAGE_KEYS.COMPLIANCE, data); },
  saveDepartments(data) { safeSet(STORAGE_KEYS.DEPARTMENTS, data); },
  saveNotifications(data) { safeSet(STORAGE_KEYS.NOTIFICATIONS, data); },

  saveTheme(isDark) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    } catch (e) {
      console.warn('Error saving theme', e);
    }
  },

  resetDefaults() {
    try {
      Object.values(STORAGE_KEYS).forEach(k => {
        if (k !== STORAGE_KEYS.THEME) localStorage.removeItem(k);
      });
    } catch (e) {
      console.error('Error resetting institution storage:', e);
    }
    return {
      learners: initialLearners,
      courses: initialCourses,
      programmes: initialProgrammes,
      events: initialEvents,
      compliance: initialCompliance,
      departments: initialDepartments,
      notifications: initialNotifications
    };
  },

  computeMetrics({ learners = [], courses = [], programmes = [], events = [], compliance = [] }) {
    const baseLearnersCount = 2140;
    const currentLearnersCount = Math.max(learners.length, baseLearnersCount);

    const avgCompletion = Math.round(
      learners.reduce((acc, l) => acc + (Number(l.progress) || 0), 0) / (learners.length || 1)
    );

    const placementReadyCount = learners.filter(l => l.placementReady || (Number(l.progress) >= 80 && (l.fitScore || 70) >= 80)).length;
    const needsSupportCount = learners.filter(l => l.status === 'Needs support').length;

    const totalContractedSeats = 2500;
    const totalEnrolledInProgrammes = programmes.reduce((acc, p) => acc + (Number(p.learners) || 0), 0);
    const seatsRemaining = Math.max(0, totalContractedSeats - totalEnrolledInProgrammes);

    const complianceTotal = compliance.length;
    const complianceComplete = compliance.filter(c => c.status === 'Complete').length;
    const complianceInReview = compliance.filter(c => c.status === 'In review').length;
    const complianceActionNeeded = compliance.filter(c => c.status === 'Action needed').length;

    const upcomingEvents = events.length;
    const placementDrives = events.filter(e => e.category === 'Placement' || (e.title || '').toLowerCase().includes('placement')).length;
    const assessmentsCount = events.filter(e => e.category === 'Academic' || (e.title || '').toLowerCase().includes('assessment')).length;

    return {
      totalLearners: currentLearnersCount.toLocaleString(),
      activeThisTerm: (currentLearnersCount - 154).toLocaleString(),
      programCompletion: `${avgCompletion || 72}%`,
      certifiedCount: '614',
      placementReady: (418 + (placementReadyCount - 4)).toLocaleString(),
      needsSupport: (21 + needsSupportCount).toLocaleString(),
      seatsRemaining: seatsRemaining.toLocaleString(),
      totalProgrammes: programmes.length,
      totalCourses: courses.length,
      upcomingEvents,
      placementDrives,
      assessmentsCount,
      complianceTotal,
      complianceComplete,
      complianceInReview,
      complianceActionNeeded
    };
  }
};
