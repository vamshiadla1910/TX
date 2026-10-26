/**
 * Learner Service
 * Handles filtering, CSV parsing with validation, and learner CSV export
 */

import { buildCSV, triggerDownload, parseCSVLine } from '../utils/csv.utils.js';
import { isValidEmail } from '../utils/validation.utils.js';

export const learnerService = {
  filterLearners(learners = [], { query = '', department = 'All departments', status = 'All statuses' }) {
    const q = query.trim().toLowerCase();
    return learners.filter(l => {
      const matchDept = department === 'All departments' || l.dept === department;
      const matchStatus = status === 'All statuses' || l.status === status;
      const matchQuery = !q ||
        `${l.name} ${l.email} ${l.program} ${l.dept} ${l.status}`
          .toLowerCase()
          .includes(q);
      return matchDept && matchStatus && matchQuery;
    });
  },

  parseAndValidateCSV(csvText, existingLearners = []) {
    if (!csvText || !csvText.trim()) {
      return { error: 'The uploaded file is empty.' };
    }

    const rawLines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (rawLines.length < 2) {
      return { error: 'CSV file must contain a header row and at least one data row.' };
    }

    const rawHeaders = parseCSVLine(rawLines[0]).map(h => h.toLowerCase().replace(/[^a-z]/g, ''));

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
        error: `Missing required header column(s): ${missingColumns.join(', ')}. Expected headers: name, email, dept, program, progress`
      };
    }

    const existingEmails = new Set(existingLearners.map(l => (l.email || '').toLowerCase()));
    const seenInFile = new Set();

    const validRows = [];
    const invalidRows = [];
    const duplicateRows = [];

    for (let i = 1; i < rawLines.length; i++) {
      const rowNum = i + 1;
      const tokens = parseCSVLine(rawLines[i]);
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
      } else if (!isValidEmail(email)) {
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
          reason: 'Email already exists in institutional database or current file'
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
  },

  exportLearnersCSV(learners = []) {
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
};
