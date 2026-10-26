import { useRef, useState } from "react";
import {
  Activity, ArrowDownToLine, ArrowLeft, ArrowRight, Award, Bell, BookOpen,
  BriefcaseBusiness, Building2, CalendarDays, Check, CheckCircle2, Clock3, FileText, FileUp, Globe2,
  GraduationCap, LayoutDashboard, Menu, Moon, Plus, Search, ShieldCheck, TrendingUp, Users, X
} from "lucide-react";
import { Link } from "react-router-dom";
import txIcon from "./assets/tx-icon.jpg";
import "./App.css";

const departments = [
  { name: "CSE", completion: 78 }, { name: "IT", completion: 74 },
  { name: "ECE", completion: 69 }, { name: "EEE", completion: 61 },
  { name: "MECH", completion: 52 }, { name: "CIVIL", completion: 47 }
];

const initialEvents = [
  { day: "10", month: "Sep", title: "Mid-term assessment window opens", detail: "CSE & IT · 640 learners", time: "09:00 – 17:00", place: "KITS Warangal · Examination block", type: "Assessment", owner: "Academic office" },
  { day: "18", month: "Sep", title: "Placement drive — ValueLabs", detail: "Eligibility: fit ≥ 80, no active backlog", time: "10:00 – 16:00", place: "Main auditorium", type: "Placement", owner: "Career services" },
  { day: "26", month: "Sep", title: "Industry guest module — Cloud Security", detail: "Delivered by Tanvox Technologies", time: "14:00 – 16:00", place: "Online · Lecture hall 3", type: "Guest module", owner: "CSE department" },
  { day: "30", month: "Sep", title: "Term compliance report due", detail: "Auto-generated, needs admin sign-off", time: "Due by 17:00", place: "Institution console", type: "Compliance", owner: "Tenant admin", urgent: true }
];

const learners = [
  { name: "Aarav Reddy", email: "aarav.reddy@kits.edu", department: "CSE", programme: "Full Stack Engineering", progress: 92, status: "On track" },
  { name: "Ananya Sharma", email: "ananya.sharma@kits.edu", department: "IT", programme: "Cloud & DevOps", progress: 86, status: "On track" },
  { name: "Kiran Kumar", email: "kiran.kumar@kits.edu", department: "ECE", programme: "Data Engineering", progress: 58, status: "Needs support" },
  { name: "Priya Nair", email: "priya.nair@kits.edu", department: "CSE", programme: "Full Stack Engineering", progress: 74, status: "On track" },
  { name: "Rahul Varma", email: "rahul.varma@kits.edu", department: "EEE", programme: "Cloud & DevOps", progress: 41, status: "Needs support" }
];

const courses = [
  { name: "Full Stack Engineering", category: "SOFTWARE DEVELOPMENT", instructor: "Meera Krishnan", learners: 680, completion: 76, state: "Active", tone: "blue" },
  { name: "Cloud & DevOps Foundations", category: "CLOUD COMPUTING", instructor: "Arjun Menon", learners: 520, completion: 71, state: "Active", tone: "green" },
  { name: "Applied Data Engineering", category: "DATA & AI", instructor: "Nisha Rao", learners: 410, completion: 68, state: "Active", tone: "orange" },
  { name: "Cybersecurity Essentials", category: "SECURITY", instructor: "Tanvox Technologies", learners: 320, completion: 63, state: "Review due", tone: "red" }
];

const programmes = [
  { name: "Industry-Ready Software Engineer", code: "PRG-2026-01", duration: "24 weeks", learners: 820, departments: "CSE, IT", progress: 78, state: "In progress" },
  { name: "Cloud & DevOps Career Track", code: "PRG-2026-02", duration: "20 weeks", learners: 540, departments: "CSE, IT, ECE", progress: 71, state: "In progress" },
  { name: "Data Engineering Pathway", code: "PRG-2026-03", duration: "18 weeks", learners: 410, departments: "CSE, ECE", progress: 68, state: "In progress" },
  { name: "Campus to Career Accelerator", code: "PRG-2026-04", duration: "12 weeks", learners: 370, departments: "All departments", progress: 52, state: "Enrollment open" }
];

const requirements = [
  { name: "Learner consent and data processing records", category: "Data governance", due: "12 Sep 2026", owner: "Tenant admin", state: "Complete" },
  { name: "Instructor qualification verification", category: "People & safety", due: "15 Sep 2026", owner: "Academic office", state: "In review" },
  { name: "Placement partner due diligence", category: "Industry partners", due: "22 Sep 2026", owner: "Career services", state: "Action needed" },
  { name: "Term outcomes and completion report", category: "Academic outcomes", due: "30 Sep 2026", owner: "Tenant admin", state: "Action needed" },
  { name: "Accessibility and course content audit", category: "Learning quality", due: "04 Oct 2026", owner: "Programme leads", state: "In review" }
];

const reports = [
  { name: "Term completion and outcomes", period: "2026–27 · Current term", updated: "08 Sep 2026", format: "CSV" },
  { name: "Learner placement readiness", period: "2026–27 · Current term", updated: "07 Sep 2026", format: "CSV" },
  { name: "Department participation summary", period: "2026–27 · Current term", updated: "05 Sep 2026", format: "CSV" },
  { name: "Programme seat utilization", period: "2026–27 · Current term", updated: "01 Sep 2026", format: "CSV" }
];

const metrics = [
  { label: "ENROLLED LEARNERS", value: "2,140", note: "186 added this term", page: "Learners", positive: true, icon: Users, tone: "blue" },
  { label: "PROGRAMME COMPLETION", value: "72%", note: "6 pts vs last term", page: "Programmes", positive: true, icon: TrendingUp, tone: "green" },
  { label: "CERTIFIED THIS TERM", value: "614", note: "of 852 eligible", page: "Learning", icon: Award, tone: "amber" },
  { label: "PLACEMENT-READY", value: "418", note: "fit score ≥ 80", page: "Reports", icon: BriefcaseBusiness, tone: "teal" },
  { label: "SEATS REMAINING", value: "360", note: "of 2,500 contracted", page: "Programmes", icon: BookOpen, tone: "coral" }
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard, group: "INSTITUTION" },
  { label: "Learners", icon: Users, count: "2,140" },
  { label: "Learning", icon: GraduationCap, count: "6" },
  { label: "Programmes", icon: BookOpen, count: "4" },
  { label: "Events", icon: CalendarDays, count: "4" },
  { label: "Compliance", icon: ShieldCheck, group: "GOVERNANCE", count: "5" },
  { label: "Reports", icon: Activity }
];

function matchesSearch(record, search) {
  return JSON.stringify(record).toLowerCase().includes(search.trim().toLowerCase());
}

function downloadCsv(fileName, rows) {
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

function PageHeading({ eyebrow, title, description, children }) {
  return <div className="page-heading"><div><div className="page-eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><div className="page-heading-actions">{children}</div></div>;
}

function StatusTag({ children }) {
  const className = children.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-tag status-${className}`}>{children}</span>;
}

function DataTable({ columns, rows, emptyText = "No matching records." }) {
  if (!rows.length) return <div className="table-empty">{emptyText}</div>;
  return <div className="data-table-wrap"><table className="data-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.key ?? index}>{row.cells.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

function EventRow({ event, onSelect }) {
  return <button className="event-row event-row-button" type="button" onClick={() => onSelect(event)}><div className={`event-date${event.urgent ? " event-date-urgent" : ""}`}><strong>{event.day}</strong><span>{event.month}</span></div><div className="event-copy"><h3>{event.title}</h3><p>{event.detail}</p></div><ArrowRight className="event-arrow" size={15} /></button>;
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState("All departments");
  const fileInputRef = useRef(null);

  function showMessage(text) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3200);
  }

  function navigate(page) {
    setActiveNav(page);
    setMobileNavOpen(false);
    setSearch("");
    setSelectedEvent(null);
  }

  function selectEvent(event) {
    setSelectedEvent(event);
    setActiveNav("Events");
    setSearch("");
  }

  function renderOverview() {
    const visibleEvents = initialEvents.filter((event) => matchesSearch(event, search));
    return <>
      <PageHeading eyebrow="INSTITUTION OVERVIEW" title="KITS Warangal" description="2,140 learners across 6 departments · industry-academia programme, batch 2026–27">
        <button className="primary-action" type="button" onClick={() => navigate("Learners")}><FileUp size={16} />Bulk import learners</button>
      </PageHeading>
      <div className="metric-grid">{metrics.map((metric) => { const Icon = metric.icon; return <button className="metric-card metric-card-button" type="button" key={metric.label} onClick={() => navigate(metric.page)}><div className="metric-card-top"><div className="metric-label">{metric.label}</div><span className={`metric-icon metric-icon-${metric.tone}`}><Icon size={17} /></span></div><strong className="metric-value">{metric.value}</strong><div className={`metric-note${metric.positive ? " metric-positive" : ""}`}>{metric.positive && <span aria-hidden="true">↑</span>}{metric.note}<ArrowRight size={13} /></div></button>; })}</div>
      <div className="dashboard-panels">
        <section className="panel completion-panel"><header className="panel-header"><h2>Completion by department</h2><span>Current term</span></header><div className="department-chart" role="img" aria-label="Programme completion by department">{departments.map((department) => <div className="department-row" key={department.name}><span className="department-name">{department.name}</span><div className="progress-track"><div className="progress-fill" style={{ width: `${department.completion}%` }} /></div><strong>{department.completion}%</strong></div>)}</div></section>
        <section className="panel calendar-panel"><header className="panel-header"><h2>Programme calendar</h2><button className="text-action" type="button" onClick={() => navigate("Events")}>All events <ArrowRight size={14} /></button></header><div className="event-list">{visibleEvents.length ? visibleEvents.map((event) => <EventRow key={event.day} event={event} onSelect={selectEvent} />) : <p className="empty-events">No matching events.</p>}</div></section>
      </div>
      <section className="panel overview-shortcuts"><header className="panel-header"><h2>Institution workspace</h2><span>Quick access</span></header><div className="shortcut-grid">{navigation.slice(1).map((item) => { const Icon = item.icon; return <button type="button" className="shortcut-item" key={item.label} onClick={() => navigate(item.label)}><Icon size={18} /><span>{item.label}</span><ArrowRight size={14} /></button>; })}</div></section>
    </>;
  }

  function renderLearners() {
    const filteredLearners = learners.filter((learner) => matchesSearch(learner, search) && (departmentFilter === "All departments" || learner.department === departmentFilter));
    const rows = filteredLearners.map((learner) => ({ key: learner.email, cells: [<div className="person-cell"><span className="table-avatar">{learner.name.split(" ").map((part) => part[0]).join("")}</span><span><strong>{learner.name}</strong><small>{learner.email}</small></span></div>, learner.department, learner.programme, <div className="table-progress"><div className="progress-track"><div className="progress-fill" style={{ width: `${learner.progress}%` }} /></div><span>{learner.progress}%</span></div>, <StatusTag>{learner.status}</StatusTag>] }));
    return <><PageHeading eyebrow="PEOPLE · LEARNERS" title="Learners" description="Monitor learner progress, programme enrollment, and support needs."><input ref={fileInputRef} className="visually-hidden" type="file" accept=".csv" onChange={(event) => event.target.files?.[0] && showMessage(`${event.target.files[0].name} selected. CSV import is ready for review.`)} /><button className="primary-action" type="button" onClick={() => fileInputRef.current?.click()}><FileUp size={16} />Import CSV</button></PageHeading>
      <div className="summary-strip"><div><strong>2,140</strong><span>Total learners</span></div><div><strong>1,986</strong><span>Active this term</span></div><div><strong>418</strong><span>Placement ready</span></div><div><strong>23</strong><span>Need support</span></div></div>
      <section className="panel page-panel"><div className="table-toolbar"><div><h2>Learner directory</h2><p>Showing sample records from 2,140 enrolled learners</p></div><label className="filter-control"><span>Department</span><select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}><option>All departments</option>{departments.map((department) => <option key={department.name}>{department.name}</option>)}</select></label></div><DataTable columns={["LEARNER", "DEPT.", "PROGRAMME", "PROGRESS", "STATUS"]} rows={rows} /></section>
    </>;
  }

  function renderLearning() {
    const visibleCourses = courses.filter((course) => matchesSearch(course, search));
    return <><PageHeading eyebrow="ACADEMICS · LEARNING" title="Learning" description="Track courses delivered across your institution and their learner outcomes."><button className="secondary-action" type="button" onClick={() => showMessage("Course catalogue export is being prepared.")}><ArrowDownToLine size={16} />Export catalogue</button></PageHeading>
      <div className="summary-strip"><div><strong>6</strong><span>Courses available</span></div><div><strong>1,930</strong><span>Course enrollments</span></div><div><strong>72%</strong><span>Average completion</span></div><div><strong>4.7</strong><span>Average feedback</span></div></div>
      <div className="institution-course-grid">{visibleCourses.map((course) => <article className="panel institution-course-card" key={course.name}><div className={`institution-course-accent institution-course-accent-${course.tone}`}><GraduationCap size={21} /><span>{course.category}</span></div><div className="institution-course-card-body"><StatusTag>{course.state}</StatusTag><h2>{course.name}</h2><p>Delivered by {course.instructor}</p><div className="institution-course-meta"><span><Users size={14} />{course.learners} learners</span><span><CheckCircle2 size={14} />{course.completion}% complete</span></div><div className="institution-course-progress"><div className="progress-track"><div className="progress-fill" style={{ width: `${course.completion}%` }} /></div></div><button className="institution-course-link" type="button" onClick={() => showMessage(`${course.name} course details`)}>View course details <ArrowRight size={14} /></button></div></article>)}</div>
      {!visibleCourses.length && <div className="panel table-empty">No courses match your search.</div>}
    </>;
  }

  function renderProgrammes() {
    const visibleProgrammes = programmes.filter((programme) => matchesSearch(programme, search));
    return <><PageHeading eyebrow="ACADEMICS · PROGRAMMES" title="Programmes" description="Manage structured learning pathways, cohorts, capacity, and term progress."><button className="primary-action" type="button" onClick={() => showMessage("New programme draft created.")}><Plus size={16} />New programme</button></PageHeading>
      <div className="summary-strip"><div><strong>4</strong><span>Active programmes</span></div><div><strong>2,140</strong><span>Enrolled learners</span></div><div><strong>72%</strong><span>Average completion</span></div><div><strong>360</strong><span>Seats remaining</span></div></div>
      <div className="programme-list">{visibleProgrammes.map((programme, index) => <article className="panel programme-card" key={programme.code}><div className="programme-index">0{index + 1}</div><div className="programme-main"><div className="programme-code">{programme.code} <StatusTag>{programme.state}</StatusTag></div><h2>{programme.name}</h2><p>{programme.duration} · {programme.departments}</p><div className="programme-progress-label"><span>Cohort completion</span><strong>{programme.progress}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${programme.progress}%` }} /></div></div><div className="programme-count"><strong>{programme.learners}</strong><span>learners</span></div><button className="icon-button record-action" type="button" aria-label={`View ${programme.name}`} onClick={() => showMessage(`${programme.name}: ${programme.learners} learners enrolled`)}><ArrowRight size={17} /></button></article>)}</div>
      {!visibleProgrammes.length && <div className="panel table-empty">No programmes match your search.</div>}
    </>;
  }

  function renderEvents() {
    const visibleEvents = initialEvents.filter((event) => matchesSearch(event, search));
    if (selectedEvent) return <><button className="back-link" type="button" onClick={() => setSelectedEvent(null)}><ArrowLeft size={15} />All events</button><PageHeading eyebrow={`${selectedEvent.type.toUpperCase()} · EVENT DETAILS`} title={selectedEvent.title} description={selectedEvent.detail}><StatusTag>{selectedEvent.urgent ? "Action needed" : "Scheduled"}</StatusTag></PageHeading><div className="event-detail-grid"><section className="panel detail-panel"><h2>Event information</h2><dl className="detail-list"><div><dt>Date</dt><dd>{selectedEvent.day} {selectedEvent.month} 2026</dd></div><div><dt>Time</dt><dd>{selectedEvent.time}</dd></div><div><dt>Location</dt><dd>{selectedEvent.place}</dd></div><div><dt>Responsible team</dt><dd>{selectedEvent.owner}</dd></div><div><dt>Audience</dt><dd>{selectedEvent.detail}</dd></div></dl></section><aside className="panel detail-aside"><CalendarDays size={20} /><h2>On the programme calendar</h2><p>This event is included in the institution schedule for the 2026–27 term.</p><button className="secondary-action" type="button" onClick={() => showMessage("Event details are up to date.")}><CheckCircle2 size={15} />Mark reviewed</button></aside></div></>;
    return <><PageHeading eyebrow="SCHEDULE · EVENTS" title="Events" description="Browse upcoming academic, placement, and industry events for your institution."><button className="primary-action" type="button" onClick={() => showMessage("New event draft created.")}><Plus size={16} />Add event</button></PageHeading><div className="summary-strip"><div><strong>4</strong><span>Upcoming events</span></div><div><strong>640</strong><span>Learners in assessments</span></div><div><strong>1</strong><span>Placement drives</span></div><div><strong>1</strong><span>Needs attention</span></div></div><section className="panel page-panel"><div className="table-toolbar"><div><h2>September 2026</h2><p>Select an event to view its schedule and details.</p></div><CalendarDays size={18} /></div><div className="event-list event-list-full">{visibleEvents.length ? visibleEvents.map((event) => <EventRow key={event.day} event={event} onSelect={selectEvent} />) : <p className="empty-events">No matching events.</p>}</div></section></>;
  }

  function renderCompliance() {
    const visibleRequirements = requirements.filter((requirement) => matchesSearch(requirement, search));
    const rows = visibleRequirements.map((requirement) => ({ cells: [<span><strong>{requirement.name}</strong><small className="cell-subtext">{requirement.category}</small></span>, requirement.due, requirement.owner, <StatusTag>{requirement.state}</StatusTag>, <button className="table-action" type="button" onClick={() => showMessage(`${requirement.name} opened for review.`)}>Review <ArrowRight size={13} /></button>] }));
    return <><PageHeading eyebrow="GOVERNANCE · COMPLIANCE" title="Compliance" description="Track institutional requirements, owners, due dates, and review status."><button className="secondary-action" type="button" onClick={() => downloadCsv("kits-compliance.csv", [["Requirement", "Category", "Due", "Owner", "Status"], ...requirements.map((item) => [item.name, item.category, item.due, item.owner, item.state])])}><ArrowDownToLine size={16} />Export register</button></PageHeading>
      <div className="summary-strip"><div><strong>5</strong><span>Requirements</span></div><div><strong>1</strong><span>Complete</span></div><div><strong>2</strong><span>In review</span></div><div><strong>2</strong><span>Action needed</span></div></div>
      <section className="panel page-panel"><div className="table-toolbar"><div><h2>Compliance register</h2><p>Current term · 2026–27</p></div><div className="compliance-callout"><Clock3 size={15} />Next deadline: 12 Sep 2026</div></div><DataTable columns={["REQUIREMENT", "DUE DATE", "OWNER", "STATUS", ""]} rows={rows} /></section>
      <section className="panel compliance-note"><ShieldCheck size={18} /><div><strong>Institutional data is up to date</strong><p>Last register update: 08 Sep 2026 · 09:40 IST</p></div><button className="text-action" type="button" onClick={() => showMessage("Register refreshed.")}>Refresh <Activity size={14} /></button></section>
    </>;
  }

  function renderReports() {
    const visibleReports = reports.filter((report) => matchesSearch(report, search));
    return <><PageHeading eyebrow="INSIGHTS · REPORTS" title="Reports" description="Review institutional outcomes and export term data for your teams."><button className="primary-action" type="button" onClick={() => downloadCsv("kits-term-summary.csv", [["Department", "Completion"], ...departments.map((department) => [department.name, `${department.completion}%`])])}><ArrowDownToLine size={16} />Download summary</button></PageHeading>
      <div className="summary-strip"><div><strong>72%</strong><span>Programme completion</span></div><div><strong>614</strong><span>Certified this term</span></div><div><strong>418</strong><span>Placement-ready</span></div><div><strong>+6 pts</strong><span>Vs last term</span></div></div>
      <section className="panel report-chart-panel"><header className="panel-header"><div><h2>Completion by department</h2><p>Current academic term</p></div><span>2026–27</span></header><div className="report-bars">{departments.map((department) => <div className="report-bar-row" key={department.name}><span>{department.name}</span><div className="progress-track"><div className="progress-fill" style={{ width: `${department.completion}%` }} /></div><strong>{department.completion}%</strong></div>)}</div></section>
      <section className="panel page-panel report-list-panel"><div className="table-toolbar"><div><h2>Available reports</h2><p>Download a CSV snapshot for local analysis.</p></div><FileText size={18} /></div><div className="report-list">{visibleReports.map((report) => <article className="report-row" key={report.name}><div className="report-file-icon"><FileText size={18} /></div><div className="report-copy"><strong>{report.name}</strong><span>{report.period} · Updated {report.updated}</span></div><span className="format-tag">{report.format}</span><button className="icon-button record-action" type="button" aria-label={`Download ${report.name}`} onClick={() => downloadCsv(`${report.name.toLowerCase().replaceAll(" ", "-")}.csv`, [["Report", "Period", "Updated"], [report.name, report.period, report.updated]])}><ArrowDownToLine size={16} /></button></article>)}</div>{!visibleReports.length && <p className="empty-events">No matching reports.</p>}</section>
    </>;
  }

  const pageRenderers = { Overview: renderOverview, Learners: renderLearners, Learning: renderLearning, Programmes: renderProgrammes, Events: renderEvents, Compliance: renderCompliance, Reports: renderReports };

  return <div className={`institution-app${darkMode ? " institution-app-dark" : ""}`}>
    <div className="institution-shell">
      <aside className={`institution-sidebar${mobileNavOpen ? " institution-sidebar-open" : ""}`}><div className="institution-brand"><img src={txIcon} alt="TX Pathwing" /><span>Pathwing</span><button className="icon-button mobile-close" type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X size={18} /></button></div><div className="signed-in-label">SIGNED IN AS</div><div className="institution-context"><Building2 size={17} /><div><span>Institution</span><strong>KITS Warangal</strong></div></div><nav className="institution-nav" aria-label="Institution navigation">{navigation.map((item) => { const Icon = item.icon; return <div key={item.label}>{item.group && <div className="nav-group-label">{item.group}</div>}<button type="button" className={`nav-item${activeNav === item.label ? " nav-item-active" : ""}`} onClick={() => navigate(item.label)}><Icon size={17} /><span>{item.label}</span>{item.count && <small>{item.count}</small>}</button></div>; })}</nav><div className="sidebar-profile"><div className="profile-avatar">RS</div><div><strong>R. Sathyanarayana</strong><span>Tenant admin · KITS Warangal</span></div></div></aside>
      <main className="institution-main"><header className="console-header"><button className="icon-button mobile-menu" type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={19} /></button><div className="breadcrumbs"><span>Pathwing</span><span>/</span><span>Institution</span><span>/</span><strong>{selectedEvent ? "Event details" : activeNav}</strong></div><div className="header-actions"><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${activeNav.toLowerCase()}...`} aria-label={`Search ${activeNav}`} /></label><div className="notification-wrap"><button className="icon-button notification-button" type="button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications" aria-expanded={notificationsOpen}><Bell size={18} /><span className="notification-count">3</span></button>{notificationsOpen && <div className="notification-menu"><strong>Notifications</strong><p>3 learners need profile verification.</p><p>Compliance report due 30 Sep.</p><button type="button" onClick={() => setNotificationsOpen(false)}>Dismiss</button></div>}</div><button className="icon-button theme-toggle" type="button" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}><Moon size={17} /></button><Link className="website-button" to="/"><Globe2 size={15} /><span>Website</span></Link></div></header><section className="dashboard-content">{pageRenderers[activeNav]()}</section></main>
    </div>
    {mobileNavOpen && <button className="mobile-scrim" type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}{message && <div className="status-toast" role="status"><Check size={16} />{message}</div>}
  </div>;
}