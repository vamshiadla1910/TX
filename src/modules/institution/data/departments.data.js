/**
 * Department and Analytics Data for Institution Dashboard (KITS Warangal)
 */

export const initialDepartments = [
  { name: 'CSE', value: 78, learners: 720, faculty: 'Dr. K. Srinivas', topProgram: 'Full Stack Engineering' },
  { name: 'IT', value: 74, learners: 510, faculty: 'Dr. P. Radhika', topProgram: 'Cloud & DevOps' },
  { name: 'ECE', value: 69, learners: 420, faculty: 'Prof. M. V. Ramana', topProgram: 'Data Engineering' },
  { name: 'EEE', value: 61, learners: 240, faculty: 'Dr. G. Venkat', topProgram: 'Cloud & DevOps' },
  { name: 'MECH', value: 52, learners: 140, faculty: 'Prof. S. Chandrasekhar', topProgram: 'Campus to Career Accelerator' },
  { name: 'CIVIL', value: 47, learners: 110, faculty: 'Dr. B. Lakshmi', topProgram: 'Campus to Career Accelerator' }
];

export const initialReports = [
  {
    id: 'RPT-01',
    name: 'Term completion and outcomes',
    category: 'Academic outcomes',
    term: '2026–27',
    updatedDate: '08 Sep 2026',
    description: 'Comprehensive term completion rates, pass ratios, and certification milestones broken down by department and cohort.'
  },
  {
    id: 'RPT-02',
    name: 'Learner placement readiness',
    category: 'Career & Placements',
    term: '2026–27',
    updatedDate: '07 Sep 2026',
    description: 'Candidate roster with aptitude benchmark percentiles, technical fit scores, and corporate interview readiness status.'
  },
  {
    id: 'RPT-03',
    name: 'Department participation summary',
    category: 'Department Analytics',
    term: '2026–27',
    updatedDate: '05 Sep 2026',
    description: 'Cross-department comparison of active student engagement, enrolled programmes, and course completion averages.'
  },
  {
    id: 'RPT-04',
    name: 'Programme seat utilization',
    category: 'Resource Allocation',
    term: '2026–27',
    updatedDate: '01 Sep 2026',
    description: 'Analysis of contracted institutional seats, enrolled learners per pathway, and remaining vacancy allocation.'
  }
];

export const initialNotifications = [
  {
    id: 'NTF-01',
    title: 'Term compliance report due soon',
    desc: 'Auto-generated report requires admin review before 30 Sep 2026.',
    time: '10m ago',
    unread: true,
    page: 'compliance'
  },
  {
    id: 'NTF-02',
    title: 'Placement drive confirmed',
    desc: 'ValueLabs placement drive scheduled for 18 Sep. 418 eligible candidates.',
    time: '2h ago',
    unread: true,
    page: 'events'
  },
  {
    id: 'NTF-03',
    title: 'New learner cohort onboarded',
    desc: '186 new learners registered for Batch 2026–27 programmes.',
    time: '1d ago',
    unread: true,
    page: 'learners'
  }
];
