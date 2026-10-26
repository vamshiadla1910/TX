/**
 * Initial Compliance Register for Institution Dashboard (KITS Warangal)
 */

export const initialCompliance = [
  {
    id: 'CMP-01',
    requirement: 'Learner consent and data processing records',
    category: 'Data governance',
    dueDate: '12 Sep 2026',
    owner: 'Tenant admin',
    status: 'Complete',
    description: 'Verification of digital consent forms and GDPR/DPDP compliant storage for 2,140 enrolled student records.',
    notes: 'All student records have verified consent tokens logged on the tenant portal. Storage retention policy validated.',
    lastReviewed: '08 Sep 2026 · 14:30 IST by R. Sathyanarayana',
    mandatory: true
  },
  {
    id: 'CMP-02',
    requirement: 'Instructor qualification verification',
    category: 'People & safety',
    dueDate: '15 Sep 2026',
    owner: 'Academic office',
    status: 'In review',
    description: 'Formal audit of academic credentials, industry certifications, and trainer onboarding documentation for all active course leads.',
    notes: 'Credentials for 5 of 6 instructors verified. Pending final verification for guest instructor from Tanvox Technologies.',
    lastReviewed: '06 Sep 2026 · 11:15 IST by Academic Dean',
    mandatory: true
  },
  {
    id: 'CMP-03',
    requirement: 'Placement partner due diligence',
    category: 'Industry partners',
    dueDate: '22 Sep 2026',
    owner: 'Career services',
    status: 'Action needed',
    description: 'Review of MoU agreements, workplace safety policies, and compensation frameworks for all participating campus recruitment partners.',
    notes: 'MoU renewal required for two new recruitment partners before the September placement drive commences.',
    lastReviewed: '04 Sep 2026 · 16:00 IST by Head of Placements',
    mandatory: false
  },
  {
    id: 'CMP-04',
    requirement: 'Term outcomes and completion report',
    category: 'Academic outcomes',
    dueDate: '30 Sep 2026',
    owner: 'Tenant admin',
    status: 'Action needed',
    description: 'Statutory end-of-term summary documenting department-wise learner pass rates, certification counts, and skill assessment benchmarks.',
    notes: 'Awaiting final assessment submission marks from CSE and IT department heads before compiling the final sign-off packet.',
    lastReviewed: '02 Sep 2026 · 10:20 IST by Tenant Admin',
    mandatory: true
  },
  {
    id: 'CMP-05',
    requirement: 'Accessibility and course content audit',
    category: 'Learning quality',
    dueDate: '04 Oct 2026',
    owner: 'Programme leads',
    status: 'In review',
    description: 'Evaluation of digital learning modules against WCAG 2.1 AA accessibility guidelines, including video captions and screen reader support.',
    notes: 'Audit completed for 4 modules. Video transcriptions in progress for Applied Data Engineering course modules.',
    lastReviewed: '07 Sep 2026 · 09:45 IST by Learning Quality Lead',
    mandatory: false
  }
];
