import {
  initialLearners,
  initialCourses,
  initialProgrammes,
  initialEvents,
  initialCompliance,
  initialDepartments,
  initialReports,
  initialNotifications
} from './initialData.js';

const STORAGE_KEYS = {
  LEARNERS: 'tx_institution_learners',
  COURSES: 'tx_institution_courses',
  PROGRAMMES: 'tx_institution_programmes',
  EVENTS: 'tx_institution_events',
  COMPLIANCE: 'tx_institution_compliance',
  DEPARTMENTS: 'tx_institution_departments',
  NOTIFICATIONS: 'tx_institution_notifications',
  THEME: 'tx_institution_theme',
  ACTIVE_PAGE: 'tx_institution_active_page'
};

function getStored(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key) || (key.startsWith('tx_institution_') ? localStorage.getItem(key.replace('tx_institution_', 'tx_')) : null);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to localStorage:`, err);
  }
}

export function loadLearners() {
  return getStored(STORAGE_KEYS.LEARNERS, initialLearners);
}

export function saveLearners(learners) {
  setStored(STORAGE_KEYS.LEARNERS, learners);
}

export function loadCourses() {
  return getStored(STORAGE_KEYS.COURSES, initialCourses);
}

export function saveCourses(courses) {
  setStored(STORAGE_KEYS.COURSES, courses);
}

export function loadProgrammes() {
  return getStored(STORAGE_KEYS.PROGRAMMES, initialProgrammes);
}

export function saveProgrammes(programmes) {
  setStored(STORAGE_KEYS.PROGRAMMES, programmes);
}

export function loadEvents() {
  return getStored(STORAGE_KEYS.EVENTS, initialEvents);
}

export function saveEvents(events) {
  setStored(STORAGE_KEYS.EVENTS, events);
}

export function loadCompliance() {
  return getStored(STORAGE_KEYS.COMPLIANCE, initialCompliance);
}

export function saveCompliance(compliance) {
  setStored(STORAGE_KEYS.COMPLIANCE, compliance);
}

export function loadDepartments() {
  return getStored(STORAGE_KEYS.DEPARTMENTS, initialDepartments);
}

export function saveDepartments(departments) {
  setStored(STORAGE_KEYS.DEPARTMENTS, departments);
}

export function loadReports() {
  return initialReports;
}

export function loadNotifications() {
  return getStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
}

export function saveNotifications(notifications) {
  setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

export function loadTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark' || localStorage.getItem('tx_theme') === 'dark';
  } catch {
    return false;
  }
}

export function saveTheme(isDark) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    localStorage.setItem('tx_theme', isDark ? 'dark' : 'light');
  } catch (e) {
    console.warn('Error saving theme', e);
  }
}

export function loadActivePage() {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const map = {
      overview: 'Overview',
      learners: 'Learners',
      learning: 'Learning',
      programmes: 'Programmes',
      events: 'Events',
      compliance: 'Compliance',
      reports: 'Reports'
    };
    if (hash && map[hash]) return map[hash];
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PAGE) || localStorage.getItem('tx_active_page') || 'Overview';
  } catch {
    return 'Overview';
  }
}

export function saveActivePage(page) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PAGE, page);
    localStorage.setItem('tx_active_page', page);
  } catch (e) {
    console.warn('Error saving active page', e);
  }
}

export function resetAllToDefaults() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.THEME) {
        localStorage.removeItem(key);
        if (key.startsWith('tx_institution_')) {
          localStorage.removeItem(key.replace('tx_institution_', 'tx_'));
        }
      }
    });
  } catch (err) {
    console.warn('Error resetting storage keys:', err);
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
}

export function computeSummaryMetrics({ learners, courses, programmes, events, compliance }) {
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

// Format values for CSV output
function escapeCSV(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replaceAll('"', '""')}"`;
}

export function buildCSV(headers, rows) {
  const headerLine = headers.map(escapeCSV).join(',');
  const rowLines = rows.map(row => row.map(escapeCSV).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

export function triggerDownload(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCatalogueCSV(courses) {
  const headers = ['Course ID', 'Course Title', 'Category', 'Instructor', 'Enrolled Learners', 'Completion Rate', 'Rating', 'Duration', 'Schedule'];
  const rows = courses.map(c => [
    c.id || '',
    c.title,
    c.category,
    c.teacher,
    c.learners,
    `${c.progress}%`,
    c.rating || '4.5',
    c.duration || '12 weeks',
    c.schedule || ''
  ]);
  const csv = buildCSV(headers, rows);
  triggerDownload('learning-catalogue.csv', csv);
}

export function exportComplianceCSV(compliance) {
  const headers = ['Requirement ID', 'Requirement Name', 'Category', 'Due Date', 'Owner', 'Status', 'Last Reviewed', 'Mandatory', 'Notes'];
  const rows = compliance.map(c => [
    c.id || '',
    c.requirement,
    c.category,
    c.dueDate,
    c.owner,
    c.status,
    c.lastReviewed || '',
    c.mandatory ? 'Yes' : 'No',
    c.notes || ''
  ]);
  const csv = buildCSV(headers, rows);
  triggerDownload('compliance-register.csv', csv);
}

export function exportLearnersCSV(learners) {
  const headers = ['ID', 'Name', 'Email', 'Department', 'Programme', 'Progress (%)', 'Status', 'Fit Score', 'Placement Ready', 'Attendance (%)', 'Modules Completed'];
  const rows = learners.map(l => [
    l.id || '',
    l.name,
    l.email,
    l.dept,
    l.program,
    l.progress,
    l.status,
    l.fitScore || 75,
    l.placementReady ? 'Yes' : 'No',
    l.attendance ? `${l.attendance}%` : '85%',
    l.modulesCompleted ? `${l.modulesCompleted}/${l.totalModules || 10}` : ''
  ]);
  const csv = buildCSV(headers, rows);
  triggerDownload('learners-directory.csv', csv);
}

export function exportInstitutionSummaryCSV({ stats, departments, programmes }) {
  const headers = ['Metric', 'Value', 'Term', 'Notes'];
  const rows = [
    ['Institution Name', 'KITS Warangal', '2026–27', 'Autonomous Institution'],
    ['Total Enrolled Learners', stats.totalLearners, '2026–27', 'Across 6 departments'],
    ['Overall Programme Completion', stats.programCompletion, '2026–27', '+6 pts vs previous term'],
    ['Certified Learners', stats.certifiedCount, '2026–27', 'Eligible cohort: 852'],
    ['Placement-Ready Candidates', stats.placementReady, '2026–27', 'Fit score ≥ 80'],
    ['Contracted Seats Remaining', stats.seatsRemaining, '2026–27', 'Out of 2,500 total contracted'],
    ['Active Programmes', programmes.length, '2026–27', programmes.map(p => p.title).join('; ')],
    ['Compliance Requirements Met', `${stats.complianceComplete}/${stats.complianceTotal}`, '2026–27', 'Audited term register'],
    ...departments.map(d => [
      `Department Completion: ${d.name}`,
      `${d.value}%`,
      '2026–27',
      `${d.learners} learners · Head: ${d.faculty || 'Faculty Lead'}`
    ])
  ];
  const csv = buildCSV(headers, rows);
  triggerDownload('institution-summary.csv', csv);
}

export function exportReportByName(reportName, { learners, courses, programmes, compliance, departments }) {
  const filename = `${reportName.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-2026-27.csv`;

  if (reportName.includes('Term completion and outcomes')) {
    const headers = ['Department', 'Department Head', 'Enrolled Learners', 'Completion Rate (%)', 'Primary Programme', 'Status'];
    const rows = departments.map(d => [
      d.name,
      d.faculty || 'Faculty Lead',
      d.learners,
      `${d.value}%`,
      d.topProgram || 'Industry Pathway',
      d.value >= 70 ? 'On Target' : 'Under Review'
    ]);
    const csv = buildCSV(headers, rows);
    triggerDownload(filename, csv);
    return true;
  }

  if (reportName.includes('Learner placement readiness')) {
    const headers = ['Learner Name', 'Email', 'Department', 'Programme', 'Progress (%)', 'Fit Score', 'Attendance (%)', 'Placement Ready Status'];
    const rows = learners.map(l => [
      l.name,
      l.email,
      l.dept,
      l.program,
      `${l.progress}%`,
      l.fitScore || (l.progress >= 80 ? 85 : 65),
      l.attendance ? `${l.attendance}%` : '88%',
      l.placementReady || l.progress >= 80 ? 'Ready for Placement Drive' : 'Additional Training Required'
    ]);
    const csv = buildCSV(headers, rows);
    triggerDownload(filename, csv);
    return true;
  }

  if (reportName.includes('Department participation summary')) {
    const headers = ['Department Code', 'Active Learners', 'Average Progress (%)', 'Top Learning Pathway', 'Lead Faculty Member'];
    const rows = departments.map(d => [
      d.name,
      d.learners,
      `${d.value}%`,
      d.topProgram || 'Industry Pathway',
      d.faculty || 'Academic Council Member'
    ]);
    const csv = buildCSV(headers, rows);
    triggerDownload(filename, csv);
    return true;
  }

  if (reportName.includes('Programme seat utilization')) {
    const headers = ['Programme ID', 'Programme Title', 'Duration', 'Allocated Capacity', 'Enrolled Learners', 'Remaining Seats', 'Utilization Rate (%)', 'Status'];
    const rows = programmes.map(p => {
      const cap = p.capacity || 500;
      const enrolled = p.learners || 0;
      const remaining = Math.max(0, cap - enrolled);
      const util = Math.round((enrolled / cap) * 100);
      return [
        p.id,
        p.title,
        p.detail || p.duration,
        cap,
        enrolled,
        remaining,
        `${util}%`,
        p.status
      ];
    });
    const csv = buildCSV(headers, rows);
    triggerDownload(filename, csv);
    return true;
  }

  // Fallback generic report
  const headers = ['Report Title', 'Term', 'Generated Timestamp', 'Institution'];
  const rows = [
    [reportName, '2026–27', new Date().toLocaleString(), 'KITS Warangal']
  ];
  const csv = buildCSV(headers, rows);
  triggerDownload(filename, csv);
  return true;
}

// Client-side CSV parser and validator for learner imports
export function parseLearnerCSV(csvText, existingLearners = []) {
  if (!csvText || !csvText.trim()) {
    return { error: 'The selected file is empty.' };
  }

  const rawLines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (rawLines.length < 2) {
    return { error: 'CSV file must contain a header row and at least one data row.' };
  }

  function parseLine(line) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  }

  const rawHeaders = parseLine(rawLines[0]).map(h => h.toLowerCase().replace(/[^a-z]/g, ''));

  // Expected columns: name, email, dept, program, progress
  const nameIdx = rawHeaders.findIndex(h => h.includes('name'));
  const emailIdx = rawHeaders.findIndex(h => h.includes('email') || h.includes('mail'));
  const deptIdx = rawHeaders.findIndex(h => h.includes('dept') || h.includes('department'));
  const programIdx = rawHeaders.findIndex(h => h.includes('prog') || h.includes('course') || h.includes('track'));
  const progressIdx = rawHeaders.findIndex(h => (h.includes('prog') && h !== rawHeaders[programIdx]) || h.includes('percent') || h.includes('score') || h.includes('progress'));

  const missingColumns = [];
  if (nameIdx === -1) missingColumns.push('name');
  if (emailIdx === -1) missingColumns.push('email');
  if (deptIdx === -1) missingColumns.push('dept');
  if (programIdx === -1) missingColumns.push('program');
  if (progressIdx === -1) missingColumns.push('progress');

  if (missingColumns.length > 0) {
    return {
      error: `Missing required header column(s): ${missingColumns.join(', ')}. Required format: name, email, dept, program, progress`
    };
  }

  const existingEmails = new Set(existingLearners.map(l => (l.email || '').toLowerCase()));
  const seenInFile = new Set();

  const validRows = [];
  const invalidRows = [];
  const duplicateRows = [];

  for (let i = 1; i < rawLines.length; i++) {
    const rowNum = i + 1;
    const tokens = parseLine(rawLines[i]);
    const name = tokens[nameIdx]?.trim() || '';
    const email = tokens[emailIdx]?.trim() || '';
    const dept = (tokens[deptIdx]?.trim() || '').toUpperCase();
    const program = tokens[programIdx]?.trim() || '';
    const rawProgress = tokens[progressIdx]?.trim() || '';
    const numProgress = Number(rawProgress.replace('%', ''));

    const issues = [];
    if (!name) issues.push('Missing learner name');
    if (!email) {
      issues.push('Missing email address');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      issues.push('Invalid email format');
    }

    if (!dept) issues.push('Missing department');
    if (!program) issues.push('Missing programme');

    if (!rawProgress || isNaN(numProgress) || numProgress < 0 || numProgress > 100) {
      issues.push(`Invalid or missing progress value "${rawProgress}" (must be a number between 0 and 100)`);
    }

    if (issues.length > 0) {
      invalidRows.push({
        rowNumber: rowNum,
        raw: rawLines[i],
        data: { name, email, dept, program, progress: rawProgress },
        issues
      });
      continue;
    }

    const cleanEmail = email.toLowerCase();
    const isDuplicate = existingEmails.has(cleanEmail) || seenInFile.has(cleanEmail);
    seenInFile.add(cleanEmail);

    const record = {
      id: `LRN-${Date.now().toString().slice(-4)}-${i}`,
      name,
      email,
      dept,
      program,
      progress: Math.round(numProgress),
      status: numProgress < 60 ? 'Needs support' : 'On track',
      enrolledDate: '26 Oct 2026',
      fitScore: Math.min(98, Math.max(45, Math.round(numProgress * 0.95))),
      placementReady: numProgress >= 80,
      attendance: Math.min(100, Math.max(60, Math.round(numProgress * 0.98))),
      modulesCompleted: Math.round((numProgress / 100) * 10),
      totalModules: 10,
      isDuplicate
    };

    if (isDuplicate) {
      duplicateRows.push({
        rowNumber: rowNum,
        record,
        reason: 'Email already exists in institutional database or file'
      });
    }

    validRows.push(record);
  }

  return {
    valid: validRows,
    invalid: invalidRows,
    duplicates: duplicateRows,
    totalRows: rawLines.length - 1
  };
}
