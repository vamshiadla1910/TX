/**
 * Compliance Service
 * Handles compliance register review workflow, status validation, and exports
 */

import { buildCSV, triggerDownload } from '../utils/csv.utils.js';

export const complianceService = {
  filterCompliance(compliance = [], { query = '', status = 'All statuses' }) {
    const q = query.trim().toLowerCase();
    return compliance.filter(c => {
      const matchStatus = status === 'All statuses' || c.status === status;
      const matchQuery = !q ||
        `${c.requirement} ${c.category} ${c.owner} ${c.status} ${c.dueDate}`
          .toLowerCase()
          .includes(q);
      return matchStatus && matchQuery;
    });
  },

  updateComplianceReview(existingRecord, { status, owner, dueDate, notes }) {
    if (!owner || !owner.trim()) {
      return { error: 'Requirement owner cannot be empty.' };
    }
    if (!dueDate || !dueDate.trim()) {
      return { error: 'Due date is required.' };
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    const updatedRecord = {
      ...existingRecord,
      status: status || existingRecord.status,
      owner: owner.trim(),
      dueDate: dueDate.trim(),
      notes: notes ? notes.trim() : (existingRecord.notes || ''),
      lastReviewed: `${dateStr} · ${timeStr} IST by Tenant Admin`
    };

    return { updatedRecord };
  },

  exportComplianceCSV(compliance = []) {
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
};
