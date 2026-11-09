import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, ArrowUpRight, Award, Bell, BookOpen,
  Briefcase, Building2, Calendar, CheckCircle2, ChevronDown,
  ChevronRight, Download, FileText, Layers, LayoutDashboard,
  LockKeyhole, Menu, Plus, Search, SearchX, Send, ShieldAlert,
  ShieldCheck, Tag, UserCheck, UserPlus, UserRound, Users,
  Wallet, X, XCircle, Zap
} from "lucide-react";
import "./styles.css";

// Import Initial Data
import {
  initialTenants,
  initialUsers,
  initialCourses,
  initialApprovals,
  initialInternships,
  initialEvents,
  initialTrainingPrograms,
  initialCertificates,
  initialBatches,
  initialPayments,
  initialSubscriptions,
  initialCoupons,
  initialSecurityEvents,
  initialHelpdeskTickets,
  initialRoles,
  initialNotifications,
  initialPlatformSettings
} from "./data/mockData";

// Import Modules
import { Overview } from "./Overview/Overview";
import { Organizations } from "./Organizations/Organizations";
import { Tenants } from "./Tenants/Tenants";
import { UsersModule } from "./Users/Users";
import { Courses } from "./Courses/Courses";
import { Moderation } from "./Moderation/Moderation";
import { Approvals } from "./Approvals/Approvals";
import { Internships } from "./Internships/Internships";
import { Events } from "./Events/Events";
import { TrainingPrograms } from "./TrainingPrograms/TrainingPrograms";
import { Certificates } from "./Certificates/Certificates";
import { Batches } from "./Batches/Batches";
import { Payments } from "./Payments/Payments";
import { Subscriptions } from "./Subscriptions/Subscriptions";
import { Coupons } from "./Coupons/Coupons";
import { Reports } from "./ReportsAnalytics/ReportsAnalytics";
import { SecurityAudit } from "./SecurityAudit/SecurityAudit";
import { RolesPermissions } from "./RolesPermissions/RolesPermissions";
import { Notifications } from "./Notifications/Notifications";
import { Helpdesk } from "./Helpdesk/Helpdesk";
import { Settings } from "./Settings/Settings";
import { Badge } from "./common/Badge";
import { Sidebar } from "./common/Sidebar";

const navConfig = [
  {
    group: "PLATFORM",
    items: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Organizations", icon: Building2 },
      { name: "Tenants", icon: Layers },
      { name: "Users", icon: Users }
    ]
  },
  {
    group: "LEARNING & PROGRAMS",
    items: [
      { name: "Courses", icon: BookOpen },
      { name: "Internships", icon: Briefcase },
      { name: "Events", icon: Calendar },
      { name: "Training programs", icon: Layers },
      { name: "Certificates", icon: Award },
      { name: "Batches", icon: Users }
    ]
  },
  {
    group: "APPROVALS",
    items: [
      { name: "Moderation", icon: ShieldCheck },
      { name: "Approvals", icon: CheckCircle2 }
    ]
  },
  {
    group: "MONEY & PLANS",
    items: [
      { name: "Payments", icon: Wallet },
      { name: "Subscriptions", icon: Layers },
      { name: "Coupons", icon: Tag }
    ]
  },
  {
    group: "INSIGHTS",
    items: [
      { name: "Reports & analytics", icon: Activity }
    ]
  },
  {
    group: "GOVERNANCE",
    items: [
      { name: "Security & audit", icon: LockKeyhole },
      { name: "Roles & permissions", icon: ShieldCheck },
      { name: "Notifications", icon: Bell },
      { name: "Helpdesk", icon: UserRound },
      { name: "Settings", icon: LockKeyhole }
    ]
  }
];

function AdminDashboard() {
  const [page, setPage] = useState("Overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notice, setNotice] = useState("");
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [currentRole, setCurrentRole] = useState("Super admin — Platform");

  // Sync title with original index.html
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "TX-Pathwing Admin Console";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // Handle keyboard navigation (Escape to close drawer and menus)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setMobileNav(false);
        setShowNotifMenu(false);
        setShowRoleMenu(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileNav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNav]);

  // Auto-close mobile drawer when window resizes to desktop / tablet
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setMobileNav(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Core Platform Datasets
  const [tenants, setTenants] = useState(initialTenants);
  const [users, setUsers] = useState(initialUsers);
  const [courses, setCourses] = useState(initialCourses);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [internships, setInternships] = useState(initialInternships);
  const [events, setEvents] = useState(initialEvents);
  const [trainingPrograms, setTrainingPrograms] = useState(initialTrainingPrograms);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [batches, setBatches] = useState(initialBatches);
  const [payments, setPayments] = useState(initialPayments);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [securityEvents, setSecurityEvents] = useState(initialSecurityEvents);
  const [helpdeskTickets, setHelpdeskTickets] = useState(initialHelpdeskTickets);
  const [roles, setRoles] = useState(initialRoles);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [settings, setSettings] = useState(initialPlatformSettings);

  // Selected item states for inline details
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModerationCourse, setSelectedModerationCourse] = useState(null);

  // Dynamic live counters
  const moderationCount = courses.filter(c => c.status === "Overdue" || c.status === "Pending Review").length;
  const approvalsCount = approvals.filter(a => a.status === "Pending" || a.status === "Overdue").length;
  const securityAlertsCount = securityEvents.filter(e => e.severity === "High" || e.severity === "Critical").length;
  const helpdeskOpenCount = helpdeskTickets.filter(t => t.status === "Open" || t.status === "In Progress").length;

  const systemAlerts = [
    { id: 1, title: `${moderationCount} Courses in Moderation`, sub: "Oldest past SLA window", link: "Moderation" },
    { id: 2, title: "Tenant Seat Alert: TX Hub Academy", sub: "At 99% of contracted capacity", link: "Tenants" },
    { id: 3, title: `${securityAlertsCount} Open Security Alerts`, sub: "Sandbox queue depth spike", link: "Security & audit" }
  ];

  function handleNavigate(targetPage) {
    setPage(targetPage);
    setMobileNav(false);
    setShowNotifMenu(false);
    setShowRoleMenu(false);
  }

  // Selected record breadcrumb label
  const activeRecordName = useMemo(() => {
    if (page === "Tenants" && selectedTenant) return selectedTenant.name;
    if (page === "Courses" && selectedCourse) return selectedCourse.title;
    if (page === "Moderation" && selectedModerationCourse) return selectedModerationCourse.title;
    return null;
  }, [page, selectedTenant, selectedCourse, selectedModerationCourse]);

  return (
    <div className="app-shell">
      {/* Top Header */}
      <header className="topbar">
        <div className="brand-mark">
          <img src="/logo.png" alt="TX Logo" className="brand-logo-img" />
        </div>
        <div className="brand-name">
          TX-Pathwing <span>PLATFORM CONSOLE</span>
        </div>

        <div className="topbar-right">
          <Badge tone="blue"> ADMIN</Badge>

          <div className="topbar-relative">
            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
            >
              <Bell size={18} />
              {moderationCount > 0 && <span className="notification-dot" />}
            </button>

            {showNotifMenu && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-head">
                  <span>Platform System Alerts</span>
                  <Badge tone="danger">{systemAlerts.length} Active</Badge>
                </div>
                <div className="notification-list">
                  {systemAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className="notification-item clickable-row"
                      onClick={() => {
                        handleNavigate(alert.link);
                        setShowNotifMenu(false);
                      }}
                    >
                      <ShieldAlert size={16} className="text-danger" />
                      <div>
                        <strong>{alert.title}</strong>
                        <small>{alert.sub}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            <Menu />
          </button>
        </div>
      </header>

      <div className="layout">
        {/* Responsive Collapsible Sidebar */}
        <Sidebar
          navConfig={navConfig}
          page={page}
          onNavigate={handleNavigate}
          mobileNav={mobileNav}
          setMobileNav={setMobileNav}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          showRoleMenu={showRoleMenu}
          setShowRoleMenu={setShowRoleMenu}
          counts={{
            tenants: tenants.length + 32,
            moderation: moderationCount,
            approvals: approvalsCount,
            security: securityAlertsCount,
            helpdesk: helpdeskOpenCount
          }}
        />

        {/* Main Content Area */}
        <main className="main">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb">
            <span>Pathwing</span>
            <span>/</span>
            <span>Platform</span>
            <span>/</span>
            <strong
              className="clickable-crumb"
              onClick={() => {
                if (activeRecordName) {
                  setSelectedTenant(null);
                  setSelectedCourse(null);
                  setSelectedModerationCourse(null);
                }
              }}
            >
              {page}
            </strong>
            {activeRecordName && (
              <>
                <span>/</span>
                <strong className="text-blue">{activeRecordName}</strong>
              </>
            )}
          </div>

          <div className="page-content">
            {/* Header info */}
            <div className="page-head">
              <div>
                <h1>{page === "Overview" ? "Platform Overview" : page}</h1>
                <p>
                  {({
                    "Overview": "A platform-wide governance view of learning operations, revenue, approvals, and system health.",
                    "Organizations": "Review organization onboarding, subscription entitlements, and compliance documents.",
                    "Tenants": "Manage isolated data boundaries with dedicated subdomains, seats, and contract lifecycles.",
                    "Users": "Manage student accounts, mentors, organization admins, and platform operators.",
                    "Courses": "Manage course catalogue, syllabus units, publication status, and moderation triggers.",
                    "Internships": "Oversee official internships, candidate applications, seat limits, and certificates.",
                    "Events": "Manage hackathons, live coding workshops, bootcamps, and attendee rosters.",
                    "Training programs": "Administer live, hybrid, and offline enterprise cohort programs.",
                    "Certificates": "Verify issued certificates, cryptographic signatures, and student honors.",
                    "Batches": "Schedule faculty mentors, active student batches, timetables, and capacity limits.",
                    "Moderation": "Review pending course submissions, evaluate SLA windows, and assign reviewers.",
                    "Approvals": "Platform governance queue for courses, mentor credentials, and tenant onboarding.",
                    "Payments": "Monitor platform collections, 29.3% take rates, instructor payouts, and settlements.",
                    "Subscriptions": "Manage Basic, Professional, and Enterprise LMS subscription limits.",
                    "Coupons": "Administer percentage and fixed discount coupons and promotional validity.",
                    "Reports & analytics": "Explore enrollment analytics, tenant seat consumption, and revenue trends.",
                    "Security & audit": "Review immutable security audit logs, access changes, and infrastructure incidents.",
                    "Roles & permissions": "Configure granular role-based access controls and module permissions.",
                    "Notifications": "Manage automated communication templates and broadcast system notices.",
                    "Helpdesk": "Respond to support inquiries from students, mentors, and partner organizations.",
                    "Settings": "Configure platform console preferences, video DRM, and security policies."
                  })[page] || "Platform Administration Console"}
                </p>
              </div>

              {page === "Overview" && (
                <Badge tone="success">
                  <CheckCircle2 size={13} /> All systems operational
                </Badge>
              )}
            </div>

            {/* Toast Feedback Notification */}
            {notice && (
              <div className="notice">
                <span>{notice}</span>
                <button onClick={() => setNotice("")} aria-label="Dismiss">
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Page Router */}
            {page === "Overview" && (
              <Overview
                tenants={tenants}
                courses={courses}
                users={users}
                payments={payments}
                helpdeskTickets={helpdeskTickets}
                setPage={setPage}
                onSelectTenant={t => {
                  setSelectedTenant(t);
                  setPage("Tenants");
                }}
                onSelectCourse={c => {
                  setSelectedModerationCourse(c);
                  setPage("Moderation");
                }}
              />
            )}

            {page === "Tenants" && (
              <Tenants
                tenants={tenants}
                setTenants={setTenants}
                selectedTenant={selectedTenant}
                setSelectedTenant={setSelectedTenant}
                setNotice={setNotice}
              />
            )}

            {page === "Organizations" && (
              <Organizations
                tenants={tenants}
                setTenants={setTenants}
                setNotice={setNotice}
                setPage={setPage}
              />
            )}

            {page === "Users" && (
              <UsersModule
                users={users}
                setUsers={setUsers}
                tenants={tenants}
                setNotice={setNotice}
              />
            )}

            {page === "Courses" && (
              <Courses
                courses={courses}
                setCourses={setCourses}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                setNotice={setNotice}
                setPage={setPage}
              />
            )}

            {page === "Moderation" && (
              <Moderation
                courses={courses}
                setCourses={setCourses}
                selectedModerationCourse={selectedModerationCourse}
                setSelectedModerationCourse={setSelectedModerationCourse}
                setNotice={setNotice}
              />
            )}

            {page === "Approvals" && (
              <Approvals
                approvals={approvals}
                setApprovals={setApprovals}
                setNotice={setNotice}
              />
            )}

            {page === "Internships" && (
              <Internships
                internships={internships}
                setInternships={setInternships}
                setNotice={setNotice}
              />
            )}

            {page === "Events" && (
              <Events
                events={events}
                setEvents={setEvents}
                setNotice={setNotice}
              />
            )}

            {page === "Training programs" && (
              <TrainingPrograms
                trainingPrograms={trainingPrograms}
                setTrainingPrograms={setTrainingPrograms}
                setNotice={setNotice}
                setPage={setPage}
              />
            )}

            {page === "Certificates" && (
              <Certificates
                certificates={certificates}
                setCertificates={setCertificates}
                setNotice={setNotice}
              />
            )}

            {page === "Batches" && (
              <Batches
                batches={batches}
                setBatches={setBatches}
                setNotice={setNotice}
              />
            )}

            {page === "Payments" && (
              <Payments
                payments={payments}
                setPayments={setPayments}
                setNotice={setNotice}
              />
            )}

            {page === "Subscriptions" && (
              <Subscriptions
                subscriptions={subscriptions}
                tenants={tenants}
                setTenants={setTenants}
                setNotice={setNotice}
              />
            )}

            {page === "Coupons" && (
              <Coupons
                coupons={coupons}
                setCoupons={setCoupons}
                setNotice={setNotice}
              />
            )}

            {page === "Reports & analytics" && (
              <Reports
                tenants={tenants}
                courses={courses}
                setNotice={setNotice}
              />
            )}

            {page === "Security & audit" && (
              <SecurityAudit
                securityEvents={securityEvents}
                setSecurityEvents={setSecurityEvents}
                setNotice={setNotice}
              />
            )}

            {page === "Roles & permissions" && (
              <RolesPermissions
                roles={roles}
                setRoles={setRoles}
                setNotice={setNotice}
              />
            )}

            {page === "Notifications" && (
              <Notifications
                notifications={notifications}
                setNotifications={setNotifications}
                setNotice={setNotice}
              />
            )}

            {page === "Helpdesk" && (
              <Helpdesk
                helpdeskTickets={helpdeskTickets}
                setHelpdeskTickets={setHelpdeskTickets}
                setNotice={setNotice}
              />
            )}

            {page === "Settings" && (
              <Settings
                settings={settings}
                setSettings={setSettings}
                setNotice={setNotice}
              />
            )}

            <footer>
              TX-PATHWING PLATFORM ADMIN CONSOLE
              <span>Super Admin Operations · Multi-Tenant Architecture</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
export { AdminDashboard };