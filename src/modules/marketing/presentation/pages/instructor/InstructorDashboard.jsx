import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import txIcon from "../../../../../assets/tx-icon.jpg";
import {
  Activity, Award, BookOpen, Calendar, CheckCircle2,
  ExternalLink, FileCheck, Globe, HelpCircle, Layers,
  LayoutDashboard, LogOut, Mail, Menu, MessageSquare, Plus,
  Radio, Settings as SettingsIcon, ShieldCheck, Sparkles, Star,
  TrendingUp, Users, Video, X
} from "lucide-react";
import "./styles.css";

// Canonical Datasets
import {
  instructorProfile as initialProfile,
  initialEarningsData,
  initialAttentionItems,
  initialInstructorCourses,
  initialLearners,
  initialReviews,
  initialBatches,
  initialAssignments,
  initialLiveSessions,
  initialQnA,
  initialCertificates,
  initialCourseAnalytics
} from "./data/mockData";

// Components & Modules (Advanced Monolithic Model)
import { Sidebar } from "./common/Sidebar";
import { Badge } from "./common/Badge";
import { Overview } from "./Overview/Overview";
import { MyCourses } from "./MyCourses/MyCourses";
import { AICourseBuilder } from "./AICourseBuilder/AICourseBuilder";
import { Batches } from "./Batches/Batches";
import { Learners } from "./Learners/Learners";
import { Assignments } from "./Assignments/Assignments";
import { LiveSessions } from "./LiveSessions/LiveSessions";
import { Certificates } from "./Certificates/Certificates";
import { QnA } from "./QnA/QnA";
import { Reviews } from "./Reviews/Reviews";
import { Analytics } from "./Analytics/Analytics";
import { Settings } from "./Settings/Settings";

export function InstructorDashboard() {
  const navigate = useNavigate();

  const [page, setPage] = useState("Dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Master Stateful Datasets
  const [profile, setProfile] = useState(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    const effectiveEmail = storedEmail || initialProfile.email;
    const effectiveName = storedName
      ? storedName.replace(" (Lead Instructor)", "")
      : (storedEmail && !storedEmail.includes("ramana") ? storedEmail.split("@")[0] : initialProfile.name);
    const initials = effectiveName
      .replace(/Dr\.\s*/i, "")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "RR";

    return {
      ...initialProfile,
      email: effectiveEmail,
      name: effectiveName,
      avatarInitials: initials,
    };
  });

  const [courses, setCourses] = useState(initialInstructorCourses);
  const [earnings, setEarnings] = useState(initialEarningsData);
  const [attentionItems, setAttentionItems] = useState(initialAttentionItems);
  const [learners, setLearners] = useState(initialLearners);
  const [reviews, setReviews] = useState(initialReviews);
  const [batches, setBatches] = useState(initialBatches);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [liveSessions, setLiveSessions] = useState(initialLiveSessions);
  const [qna, setQnA] = useState(initialQnA);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [analytics, setAnalytics] = useState(initialCourseAnalytics);

  // Sync profile when localStorage changes or authChanged fires
  useEffect(() => {
    const handleStorageUpdate = () => {
      const storedEmail = localStorage.getItem("userEmail");
      const storedName = localStorage.getItem("userName");
      if (storedEmail) {
        setProfile((prev) => ({
          ...prev,
          email: storedEmail,
          name: storedName ? storedName.replace(" (Lead Instructor)", "") : prev.name,
          avatarInitials: (storedName || storedEmail)
            .replace(/Dr\.\s*/i, "")
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "RR"
        }));
      }
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("authChanged", handleStorageUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("authChanged", handleStorageUpdate);
    };
  }, []);

  // Dynamic Navigation Configuration for Advanced Monolithic Model
  const navConfig = useMemo(() => [
    {
      group: "TEACH & CURRICULUM",
      items: [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "My Courses", icon: BookOpen, badge: courses.length, badgeTone: "blue" },
        { name: "AI Course Builder", icon: Sparkles },
        { name: "Batches", icon: Layers, badge: batches.length, badgeTone: "neutral" }
      ]
    },
    {
      group: "STUDENTS & GRADING",
      items: [
        { name: "Learners", icon: Users, badge: learners.length > 0 ? learners.length : 1428, badgeTone: "neutral" },
        { name: "Assignments", icon: FileCheck, badge: assignments.filter(a => a.status === "Pending Review").length || undefined, badgeTone: "warning" },
        { name: "Live Sessions", icon: Radio, badge: liveSessions.filter(s => s.status === "Upcoming").length || undefined, badgeTone: "danger" },
        { name: "Certificates", icon: Award, badge: certificates.length, badgeTone: "neutral" }
      ]
    },
    {
      group: "COMMUNITY & INSIGHTS",
      items: [
        { name: "Q&A Forum", icon: HelpCircle, badge: qna.filter(q => q.status === "Pending").length || undefined, badgeTone: "warning" },
        { name: "Reviews", icon: Star, badge: "4.9★", badgeTone: "purple" },
        { name: "Analytics", icon: Activity },
        { name: "Settings", icon: SettingsIcon }
      ]
    }
  ], [courses.length, batches.length, learners.length, assignments, liveSessions, qna, certificates.length]);

  // Sync document title
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `Pathwing Instructor Console · ${page}`;
    return () => {
      document.title = prevTitle;
    };
  }, [page]);

  // Keyboard navigation (Escape to close menus/drawers)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setMobileNav(false);
        setShowNotifMenu(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll on mobile open
  useEffect(() => {
    document.body.style.overflow = mobileNav ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNav]);

  // Session Logout Handler
  const handleLogout = () => {
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
  };

  // State Action Handlers
  const handleSaveAICourse = (newCourse) => {
    setCourses((prev) => {
      if (prev.some((c) => c.id === newCourse.id)) return prev;
      return [newCourse, ...prev];
    });

    setProfile((prev) => ({
      ...prev,
      publishedCoursesCount: prev.publishedCoursesCount + 1
    }));
  };

  const handleAddBatch = (newBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
  };

  const handleGradeAssignment = (asgId, score, feedback) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === asgId ? { ...a, score, feedback, status: "Graded" } : a))
    );
  };

  const handleAddLiveSession = (newSess) => {
    setLiveSessions((prev) => [newSess, ...prev]);
  };

  const handleIssueCertificate = (newCert) => {
    setCertificates((prev) => [newCert, ...prev]);
  };

  const handleAnswerQnA = (qnaId, answer) => {
    setQnA((prev) =>
      prev.map((q) => (q.id === qnaId ? { ...q, answer, status: "Answered" } : q))
    );
  };

  const handleUpdateProfile = (updatedFields) => {
    setProfile((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleResolveAttentionItem = (itemId) => {
    setAttentionItems((prev) => prev.filter((item) => item.id !== itemId));
    setProfile((prev) => ({
      ...prev,
      openQuestionsCount: Math.max(0, prev.openQuestionsCount - 1)
    }));
  };

  return (
    <div className="instructor-app-shell blue-white-theme">
      {/* Atmospheric Ambient Glow Background */}
      <div className="ambient-glow-orb glow-orb-1" aria-hidden="true" />
      <div className="ambient-glow-orb glow-orb-2" aria-hidden="true" />
      <div className="ambient-glow-orb glow-orb-3" aria-hidden="true" />

      {/* Top Navigation Bar */}
      <header className="instructor-topbar">
        <div className="brand-cluster">
          <Link to="/" className="topbar-brand-link" title="Return to Website Home">
            <div className="topbar-brand-mark">
              <img src={txIcon} alt="TX Pathwing Logo" className="brand-logo-img" />
            </div>
            <div className="topbar-brand-name">
              <span className="brand-title-gradient">TX Pathwing</span>
            </div>
          </Link>
        </div>

        {/* Topbar Right Actions */}
        <div className="topbar-right">
          <Link to="/" className="topbar-link-btn" title="Go to Website">
            <Globe size={15} />
            <span>Visit Website</span>
          </Link>

          <Link to="/admin-dashboard" className="topbar-link-btn" title="Switch to Platform Admin">
            <ShieldCheck size={15} />
            <span>Platform Console</span>
          </Link>

          {/* Logged in Instructor Email */}
          <div className="topbar-user-pill" title={`Signed in as ${profile.email}`}>
            <div className="topbar-user-avatar">
              <Mail size={13} />
            </div>
            <div className="topbar-user-info">
              <span className="topbar-user-email">{profile.email}</span>
            </div>
          </div>

          {/* Mobile Drawer Hamburger */}
          <button
            className="menu-toggle"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="instructor-layout">
        {/* Sidebar */}
        <Sidebar
          navConfig={navConfig}
          page={page}
          onNavigate={(targetPage) => {
            setPage(targetPage);
            setMobileNav(false);
          }}
          mobileNav={mobileNav}
          setMobileNav={setMobileNav}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          instructorProfile={profile}
          onLogout={handleLogout}
        />

        {/* View Router Main Area (Monolithic Multi-Module Dispatcher) */}
        <main className="instructor-main">
          {page === "Dashboard" && (
            <Overview
              instructorProfile={profile}
              earningsData={earnings}
              attentionItems={attentionItems}
              reviews={reviews}
              onNavigate={setPage}
              onResolveItem={handleResolveAttentionItem}
            />
          )}

          {page === "My Courses" && (
            <MyCourses
              courses={courses}
              onNavigate={setPage}
              onSelectCourse={(c) => {
                setPage("AI Course Builder");
              }}
            />
          )}

          {page === "AI Course Builder" && (
            <AICourseBuilder
              onSaveCourse={handleSaveAICourse}
              onNavigate={setPage}
            />
          )}

          {page === "Batches" && (
            <Batches
              batches={batches}
              onAddBatch={handleAddBatch}
            />
          )}

          {page === "Learners" && (
            <Learners learners={learners} />
          )}

          {page === "Assignments" && (
            <Assignments
              assignments={assignments}
              onGradeAssignment={handleGradeAssignment}
            />
          )}

          {page === "Live Sessions" && (
            <LiveSessions
              sessions={liveSessions}
              onAddSession={handleAddLiveSession}
            />
          )}

          {page === "Certificates" && (
            <Certificates
              certificates={certificates}
              onIssueCertificate={handleIssueCertificate}
            />
          )}

          {page === "Q&A Forum" && (
            <QnA
              questions={qna}
              onAnswerQuestion={handleAnswerQnA}
            />
          )}

          {page === "Reviews" && (
            <Reviews
              reviews={reviews}
            />
          )}

          {page === "Analytics" && (
            <Analytics
              analytics={analytics}
            />
          )}

          {page === "Settings" && (
            <Settings
              instructorProfile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default InstructorDashboard;
