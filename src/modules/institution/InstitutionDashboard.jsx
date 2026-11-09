import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from './components/TopBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import NotificationsPopover from './components/NotificationsPopover.jsx';
import RecordDetailModal from './components/RecordDetailModal.jsx';
import CSVImportModal from './components/CSVImportModal.jsx';
import AddEventModal from './components/AddEventModal.jsx';
import AddProgrammeModal from './components/AddProgrammeModal.jsx';
import EditLearnerModal from './components/EditLearnerModal.jsx';
import UserProfileModal from './components/UserProfileModal.jsx';

import OverviewPage from './pages/OverviewPage.jsx';
import LearnersPage from './pages/LearnersPage.jsx';
import LearningPage from './pages/LearningPage.jsx';
import ProgrammesPage from './pages/ProgrammesPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import CompliancePage from './pages/CompliancePage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';

import {
  loadLearners, saveLearners,
  loadCourses, saveCourses,
  loadProgrammes, saveProgrammes,
  loadEvents, saveEvents,
  loadCompliance, saveCompliance,
  loadDepartments, saveDepartments,
  loadReports,
  loadNotifications, saveNotifications,
  loadTheme, saveTheme,
  loadActivePage, saveActivePage,
  resetAllToDefaults,
  computeSummaryMetrics
} from './data/storage.js';

import { CheckCircle2, X } from 'lucide-react';
import './styles.css';

const PATH_TO_PAGE_MAP = {
  '': 'Overview',
  'overview': 'Overview',
  'learners': 'Learners',
  'learning': 'Learning',
  'courses': 'Learning',
  'programmes': 'Programmes',
  'programs': 'Programmes',
  'events': 'Events',
  'compliance': 'Compliance',
  'reports': 'Reports'
};

const PAGE_TO_SUBPATH = {
  Overview: '',
  Learners: 'learners',
  Learning: 'learning',
  Programmes: 'programmes',
  Events: 'events',
  Compliance: 'compliance',
  Reports: 'reports'
};

export default function InstitutionDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve current active page from URL pathname or hash
  const resolvePageFromLocation = useCallback(() => {
    const cleanPath = location.pathname.replace(/^\/(?:institution-dashboard|institution)\/?/i, '');
    const segments = cleanPath.split('/').filter(Boolean);
    const sub = (segments[0] || '').toLowerCase();
    if (PATH_TO_PAGE_MAP[sub] !== undefined) {
      return PATH_TO_PAGE_MAP[sub];
    }
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (PATH_TO_PAGE_MAP[hash]) {
      return PATH_TO_PAGE_MAP[hash];
    }
    return loadActivePage() || 'Overview';
  }, [location.pathname]);

  // Navigation & UI state
  const [page, setPageState] = useState(() => resolvePageFromLocation());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDarkState] = useState(() => loadTheme());
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('All departments');
  const [learnerStatusFilter, setLearnerStatusFilter] = useState('All statuses');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notice, setNotice] = useState('');

  // Persistent Domain Data
  const [learners, setLearnersState] = useState(() => loadLearners());
  const [courses, setCoursesState] = useState(() => loadCourses());
  const [programmes, setProgrammesState] = useState(() => loadProgrammes());
  const [events, setEventsState] = useState(() => loadEvents());
  const [compliance, setComplianceState] = useState(() => loadCompliance());
  const [departments, setDepartmentsState] = useState(() => loadDepartments());
  const [reports] = useState(() => loadReports());
  const [notifications, setNotificationsState] = useState(() => loadNotifications());

  // Modal & Drawer State
  const [activeDetail, setActiveDetail] = useState(null); // { type, record }
  const [isImportCSVOpen, setIsImportCSVOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddProgrammeOpen, setIsAddProgrammeOpen] = useState(false);
  const [editingLearner, setEditingLearner] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sync state when URL changes (direct link, browser back/forward, route click)
  useEffect(() => {
    const resolved = resolvePageFromLocation();
    setPageState(resolved);
    saveActivePage(resolved);
  }, [location.pathname, resolvePageFromLocation]);

  // Sync title with active page
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `Pathwing Institution · ${page}`;
    return () => {
      document.title = originalTitle;
    };
  }, [page]);

  // Navigate between pages and synchronize with router
  const setPage = useCallback((newPage) => {
    setPageState(newPage);
    saveActivePage(newPage);
    setQuery('');
    setMobileOpen(false);

    // Determine target route
    const isAltRoute = location.pathname.startsWith('/institution') && !location.pathname.startsWith('/institution-dashboard');
    const base = isAltRoute ? '/institution' : '/institution-dashboard';
    const sub = PAGE_TO_SUBPATH[newPage];
    const targetUrl = sub ? `${base}/${sub}` : base;

    if (location.pathname !== targetUrl) {
      navigate(targetUrl);
    }
  }, [location.pathname, navigate]);

  // Theme change
  const setDark = useCallback((isDark) => {
    setDarkState(isDark);
    saveTheme(isDark);
  }, []);

  // Toast notice helper
  const flash = useCallback((message) => {
    setNotice(message);
    const timer = setTimeout(() => {
      setNotice('');
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Data updater wrappers
  const updateLearners = useCallback((newLearners) => {
    setLearnersState(newLearners);
    saveLearners(newLearners);
  }, []);

  const updateCourses = useCallback((newCourses) => {
    setCoursesState(newCourses);
    saveCourses(newCourses);
  }, []);

  const updateProgrammes = useCallback((newProgrammes) => {
    setProgrammesState(newProgrammes);
    saveProgrammes(newProgrammes);
  }, []);

  const updateEvents = useCallback((newEvents) => {
    setEventsState(newEvents);
    saveEvents(newEvents);
  }, []);

  const updateCompliance = useCallback((newCompliance) => {
    setComplianceState(newCompliance);
    saveCompliance(newCompliance);
  }, []);

  const updateNotifications = useCallback((newNotifs) => {
    setNotificationsState(newNotifs);
    saveNotifications(newNotifs);
  }, []);

  // Record-specific updates (e.g. from Compliance Review or Learner Edit)
  const handleUpdateRecord = useCallback((type, updatedRecord) => {
    if (type === 'compliance') {
      const nextList = compliance.map(c =>
        (c.id === updatedRecord.id || c.requirement === updatedRecord.requirement)
          ? updatedRecord
          : c
      );
      updateCompliance(nextList);
      if (activeDetail?.type === 'compliance') {
        setActiveDetail({ type: 'compliance', record: updatedRecord });
      }
    } else if (type === 'learner') {
      const nextList = learners.map(l =>
        (l.id === updatedRecord.id || l.email === updatedRecord.email)
          ? updatedRecord
          : l
      );
      updateLearners(nextList);
      if (activeDetail?.type === 'learner') {
        setActiveDetail({ type: 'learner', record: updatedRecord });
      }
    } else if (type === 'programme') {
      const nextList = programmes.map(p =>
        (p.id === updatedRecord.id) ? updatedRecord : p
      );
      updateProgrammes(nextList);
      if (activeDetail?.type === 'programme') {
        setActiveDetail({ type: 'programme', record: updatedRecord });
      }
    }
  }, [compliance, learners, programmes, activeDetail, updateCompliance, updateLearners, updateProgrammes]);

  // Record delete (e.g. Event delete)
  const handleDeleteRecord = useCallback((type, idOrTitle) => {
    if (type === 'event') {
      const nextList = events.filter(e => e.id !== idOrTitle && e.title !== idOrTitle);
      updateEvents(nextList);
      if (activeDetail?.type === 'event') {
        setActiveDetail(null);
      }
    }
  }, [events, activeDetail, updateEvents]);

  // Add Event handler
  const handleAddEvent = useCallback((newEvent) => {
    const nextList = [newEvent, ...events];
    updateEvents(nextList);
  }, [events, updateEvents]);

  // Add Programme handler
  const handleAddProgramme = useCallback((newProgramme) => {
    const nextList = [...programmes, newProgramme];
    updateProgrammes(nextList);
  }, [programmes, updateProgrammes]);

  // Import CSV handler
  const handleImportSuccess = useCallback((newValidLearners) => {
    const existingEmails = new Set(learners.map(l => (l.email || '').toLowerCase()));
    const recordsToAdd = newValidLearners.filter(l => !existingEmails.has((l.email || '').toLowerCase()));
    const updated = [...learners, ...recordsToAdd];
    updateLearners(updated);
  }, [learners, updateLearners]);

  // Reset demo data handler
  const handleResetData = useCallback(() => {
    const def = resetAllToDefaults();
    setLearnersState(def.learners);
    setCoursesState(def.courses);
    setProgrammesState(def.programmes);
    setEventsState(def.events);
    setComplianceState(def.compliance);
    setDepartmentsState(def.departments);
    setNotificationsState(def.notifications);
    setActiveDetail(null);
  }, []);

  // Logout handler - clears session and navigates to home
  const handleSignOut = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isPlatformAdmin");
    localStorage.removeItem("isHackathonAdmin");

    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("storage"));

    navigate("/");
  }, [navigate]);

  // Notifications handlers
  const unreadNotifsCount = useMemo(() => {
    return notifications.filter(n => n.unread).length;
  }, [notifications]);

  const handleMarkAllNotificationsRead = useCallback(() => {
    const nextList = notifications.map(n => ({ ...n, unread: false }));
    updateNotifications(nextList);
    flash('All notifications marked as read.');
  }, [notifications, updateNotifications, flash]);

  const handleNotificationClick = useCallback((notif) => {
    const nextList = notifications.map(n => n.id === notif.id ? { ...n, unread: false } : n);
    updateNotifications(nextList);
    if (notif.page) {
      setPage(notif.page);
    }
  }, [notifications, updateNotifications, setPage]);

  // Dynamic summary metrics
  const stats = useMemo(() => {
    return computeSummaryMetrics({
      learners,
      courses,
      programmes,
      events,
      compliance
    });
  }, [learners, courses, programmes, events, compliance]);

  // Placeholder text for topbar search
  const searchPlaceholder = {
    Overview: 'Search overview...',
    Learners: 'Search learners by name, email, department...',
    Learning: 'Search courses by title, category, instructor...',
    Programmes: 'Search programmes by title or ID...',
    Events: 'Search events by title or category...',
    Compliance: 'Search compliance requirements or owner...',
    Reports: 'Search reports by title or category...'
  }[page] || 'Search...';

  return (
    <div className={`institution-dashboard institutions-dashboard ${dark ? 'dark' : ''}`}>
      <div className={dark ? 'app dark' : 'app'}>
        {/* SIDEBAR */}
        <Sidebar
          page={page}
          setPage={setPage}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          counts={{
            learners: stats.totalLearners,
            courses: courses.length,
            programmes: programmes.length,
            events: events.length,
            compliance: compliance.length
          }}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* MAIN CONTAINER */}
        <main className="main">
          {/* TOPBAR */}
          <TopBar
            page={page}
            setPage={setPage}
            activeDetail={activeDetail}
            setActiveDetail={setActiveDetail}
            query={query}
            setQuery={setQuery}
            searchPlaceholder={searchPlaceholder}
            dark={dark}
            setDark={setDark}
            unreadCount={unreadNotifsCount}
            notifOpen={notifOpen}
            setNotifOpen={setNotifOpen}
            onOpenMobile={() => setMobileOpen(true)}
            flash={flash}
          />

          {/* NOTIFICATIONS POPOVER */}
          <NotificationsPopover
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
            notifications={notifications}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onNotificationClick={handleNotificationClick}
            unreadCount={unreadNotifsCount}
          />

          {/* PAGE CONTENT */}
          <div className="content">
            {page === 'Overview' && (
              <OverviewPage
                stats={stats}
                departments={departments}
                events={events}
                setPage={setPage}
                onOpenImportCSV={() => setIsImportCSVOpen(true)}
                onOpenEventDetail={e => setActiveDetail({ type: 'event', record: e })}
                onFilterDepartment={deptName => {
                  setDepartment(deptName);
                  setPage('Learners');
                }}
              />
            )}

            {page === 'Learners' && (
              <LearnersPage
                learners={learners}
                department={department}
                setDepartment={setDepartment}
                statusFilter={learnerStatusFilter}
                setStatusFilter={setLearnerStatusFilter}
                query={query}
                setQuery={setQuery}
                onOpenImportCSV={() => setIsImportCSVOpen(true)}
                onOpenLearnerDetail={l => setActiveDetail({ type: 'learner', record: l })}
                onOpenEditLearner={l => setEditingLearner(l)}
                flash={flash}
              />
            )}

            {page === 'Learning' && (
              <LearningPage
                courses={courses}
                query={query}
                setQuery={setQuery}
                onOpenCourseDetail={c => setActiveDetail({ type: 'course', record: c })}
                flash={flash}
              />
            )}

            {page === 'Programmes' && (
              <ProgrammesPage
                programmes={programmes}
                query={query}
                setQuery={setQuery}
                onOpenNewProgramme={() => setIsAddProgrammeOpen(true)}
                onOpenProgrammeDetail={p => setActiveDetail({ type: 'programme', record: p })}
                flash={flash}
              />
            )}

            {page === 'Events' && (
              <EventsPage
                events={events}
                query={query}
                setQuery={setQuery}
                onOpenAddEvent={() => setIsAddEventOpen(true)}
                onOpenEventDetail={e => setActiveDetail({ type: 'event', record: e })}
                flash={flash}
              />
            )}

            {page === 'Compliance' && (
              <CompliancePage
                compliance={compliance}
                query={query}
                setQuery={setQuery}
                onOpenComplianceReview={r => setActiveDetail({ type: 'compliance', record: r })}
                flash={flash}
              />
            )}

            {page === 'Reports' && (
              <ReportsPage
                reports={reports}
                departments={departments}
                learners={learners}
                courses={courses}
                programmes={programmes}
                compliance={compliance}
                stats={stats}
                query={query}
                setQuery={setQuery}
                flash={flash}
              />
            )}
          </div>
        </main>

        {/* TOAST FEEDBACK */}
        {notice && (
          <div className="toast" role="status" aria-live="polite">
            <CheckCircle2 size={17} />
            <span>{notice}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => setNotice('')}
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* RECORD DETAIL MODAL (COMPLIANCE REVIEW, LEARNER, COURSE, PROGRAMME, EVENT) */}
        <RecordDetailModal
          isOpen={Boolean(activeDetail)}
          type={activeDetail?.type}
          record={activeDetail?.record}
          onClose={() => setActiveDetail(null)}
          onUpdateRecord={handleUpdateRecord}
          onDeleteRecord={handleDeleteRecord}
          onOpenEdit={(type, record) => {
            if (type === 'learner') setEditingLearner(record);
          }}
          flash={flash}
        />

        {/* CSV IMPORT MODAL */}
        <CSVImportModal
          isOpen={isImportCSVOpen}
          onClose={() => setIsImportCSVOpen(false)}
          existingLearners={learners}
          onImportSuccess={handleImportSuccess}
          flash={flash}
        />

        {/* ADD EVENT MODAL */}
        <AddEventModal
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          onAddEvent={handleAddEvent}
          flash={flash}
        />

        {/* ADD PROGRAMME MODAL */}
        <AddProgrammeModal
          isOpen={isAddProgrammeOpen}
          onClose={() => setIsAddProgrammeOpen(false)}
          onAddProgramme={handleAddProgramme}
          programmesCount={programmes.length}
          flash={flash}
        />

        {/* EDIT LEARNER MODAL */}
        <EditLearnerModal
          isOpen={Boolean(editingLearner)}
          learner={editingLearner}
          onClose={() => setEditingLearner(null)}
          onSaveLearner={updated => handleUpdateRecord('learner', updated)}
          flash={flash}
        />

        {/* USER PROFILE MODAL */}
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onResetData={handleResetData}
          onSignOut={handleSignOut}
          flash={flash}
        />
      </div>
    </div>
  );
}
