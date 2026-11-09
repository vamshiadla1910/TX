import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { useStudentAuth } from "./hooks/useStudentAuth";
import { useStudentCourses } from "./hooks/useStudentCourses";
import { useStudentStats } from "./hooks/useStudentStats";

import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";
import WelcomeHero from "./components/WelcomeHero";
import StatsCards from "./components/StatsCards";
import ContinueLearning from "./components/ContinueLearning";
import RecommendedSection from "./components/RecommendedSection";
import SkillProfileSection from "./components/SkillProfileSection";
import ComingUpSection from "./components/ComingUpSection";
import AchievementsSection from "./components/AchievementsSection";
import AIAssistantTab from "./components/AIAssistantTab";
import CodingLabTab from "./components/CodingLabTab";
import CareersTab from "./components/CareersTab";
import CourseLearningDetails from "./components/CourseLearningDetails";
import RecommendedCourseModal from "./components/RecommendedCourseModal";

import MyCourses from "../MyCourses/MyCourses";
import Assessments from "../Assessments/Assessments";
import Certificates from "../Certificates/Certificates";
import VideoPlayer from "./VideoPlayer";
import "./Dashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Custom Modular Hooks
  const { userProfile, logout } = useStudentAuth();
  const {
    enrollments,
    filteredEnrollments,
    recommendedCourses,
    searchQuery,
    setSearchQuery,
    courseFilter,
    setCourseFilter,
    enrollInCourse,
    updateProgress,
    syncCourses,
  } = useStudentCourses();
  const { activeCoursesCount, streakDays, learningHours } = useStudentStats(enrollments);

  // Deep Link Routing helper for Course Learning Details (/dashboard/learning/:id)
  const getInitialLearningCourseId = useCallback(() => {
    const path = location.pathname.toLowerCase();
    const match = path.match(/\/(?:dashboard|student)\/learn(?:ing)?\/([a-z0-9-_]+)/i);
    return match ? match[1] : null;
  }, [location.pathname]);

  // Tab State & Deep Link Routing
  const getInitialTab = useCallback(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("courses")) return "My courses";
    if (path.includes("coding-lab")) return "Coding lab";
    if (path.includes("ai-assistant")) return "AI assistant";
    if (path.includes("careers")) return "Careers";
    if (path.includes("assessments")) return "Assessments";
    if (path.includes("certificates")) return "Certificates";
    return "Dashboard";
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeVideoCourse, setActiveVideoCourse] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedLearningCourseId, setSelectedLearningCourseId] = useState(getInitialLearningCourseId);
  const [selectedRecommendedCourse, setSelectedRecommendedCourse] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }, []);

  // Synchronize Tab and Learning View with Location
  useEffect(() => {
    setActiveTab(getInitialTab());
    const learnId = getInitialLearningCourseId();
    if (learnId) {
      setSelectedLearningCourseId(learnId);
    } else if (!location.pathname.toLowerCase().includes("learn")) {
      setSelectedLearningCourseId(null);
    }
  }, [location.pathname, getInitialTab, getInitialLearningCourseId]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSelectedLearningCourseId(null);
    setMobileMenuOpen(false);
    if (tabName === "Dashboard") navigate("/dashboard");
    else if (tabName === "My courses") navigate("/dashboard/courses");
    else if (tabName === "AI assistant") navigate("/dashboard/ai-assistant");
    else if (tabName === "Coding lab") navigate("/dashboard/coding-lab");
    else if (tabName === "Careers") navigate("/dashboard/careers");
    else if (tabName === "Assessments") navigate("/dashboard/assessments");
    else if (tabName === "Certificates") navigate("/dashboard/certificates");
  };

  const handleResumeLesson = (courseObj) => {
    const target = courseObj || enrollments[0];
    if (typeof target === "string") {
      const found = enrollments.find(
        (e) => (e.courseId || e.id || e.courseCode || "").toLowerCase() === target.toLowerCase()
      );
      setActiveVideoCourse(found || enrollments[0]);
    } else {
      setActiveVideoCourse(target);
    }
  };

  const handleOpenLearningDetails = (course) => {
    const cId = (course.courseId || course.id || course.code || course.courseCode || "").toLowerCase();
    setSelectedLearningCourseId(cId);
    navigate(`/dashboard/learning/${cId}`);
  };

  const handleBackFromLearning = () => {
    setSelectedLearningCourseId(null);
    navigate("/dashboard");
  };

  const handleOpenRecommendedDetails = (course) => {
    setSelectedRecommendedCourse(course);
  };

  const handleQuickEnroll = (course) => {
    const res = enrollInCourse(course);
    showToast(res.message);
    if (res.success) {
      syncCourses();
    }
  };

  const handleEnrollFromModal = async (course) => {
    const res = enrollInCourse(course);
    showToast(res.message);
    if (res.success) {
      setSelectedRecommendedCourse(null);
      syncCourses();
    }
  };

  return (
    <div className="dashboard-root-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="dashboard-toast">
          <Sparkles size={16} color="#3b82f6" /> {toastMessage}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideoCourse && (
        <VideoPlayer
          course={activeVideoCourse}
          onClose={() => setActiveVideoCourse(null)}
          onProgressUpdate={(pct) => {
            updateProgress(activeVideoCourse.courseId || activeVideoCourse.id, pct);
            syncCourses();
            showToast("Lesson progress updated!");
          }}
        />
      )}

      {/* Recommended Course Information & Syllabus Modal */}
      {selectedRecommendedCourse && (
        <RecommendedCourseModal
          course={selectedRecommendedCourse}
          isEnrolled={enrollments.some(
            (e) =>
              (e.courseId || e.id || e.courseCode || "").toLowerCase() ===
              (selectedRecommendedCourse.id || selectedRecommendedCourse.code || "").toLowerCase()
          )}
          onClose={() => setSelectedRecommendedCourse(null)}
          onEnroll={handleEnrollFromModal}
        />
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="dashboard-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <DashboardSidebar
        userProfile={userProfile}
        activeTab={selectedLearningCourseId ? "My courses" : activeTab}
        onTabClick={handleTabClick}
        enrollmentsCount={enrollments.length}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onLogout={logout}
      />

      {/* Main Viewport */}
      <div className="dashboard-viewport">
        {/* Fixed Header */}
        <DashboardHeader
          activeTab={selectedLearningCourseId ? "Course Learning" : activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobile={() => setMobileMenuOpen(true)}
        />

        {/* Scrollable Main Content */}
        <main className="dashboard-content-scroll">
          {/* Dedicated Course Learning Details View */}
          {selectedLearningCourseId ? (
            <CourseLearningDetails
              courseId={selectedLearningCourseId}
              onBack={handleBackFromLearning}
              onLaunchTopic={(topicCourse) => setActiveVideoCourse(topicCourse)}
              showToast={showToast}
            />
          ) : (
            <>
              {activeTab === "My courses" && (
                <MyCourses
                  onResumeCourse={handleResumeLesson}
                  onOpenCourseDetails={handleOpenLearningDetails}
                />
              )}

              {activeTab === "AI assistant" && (
                <AIAssistantTab userName={userProfile.name} />
              )}

              {activeTab === "Coding lab" && (
                <CodingLabTab onOpenSandbox={() => showToast("Launching sandbox environment...")} />
              )}

              {activeTab === "Careers" && <CareersTab />}

              {activeTab === "Assessments" && (
                <Assessments onBack={() => handleTabClick("Dashboard")} />
              )}

              {activeTab === "Certificates" && <Certificates userEmail={userProfile?.email} userName={userProfile?.name} />}

              {activeTab === "Dashboard" && (
                <>
                  {/* Welcome Banner */}
                  <WelcomeHero
                    userName={userProfile.name}
                    streakDays={streakDays}
                    learningHours={learningHours}
                    activeCoursesCount={activeCoursesCount}
                    lastCourse={enrollments[0]}
                    onResume={handleResumeLesson}
                  />

                  {/* Statistics Metric Cards */}
                  <StatsCards
                    activeCoursesCount={activeCoursesCount}
                    learningHours={learningHours}
                    streakDays={streakDays}
                  />

                  {/* Main Content Grid */}
                  <div className="dashboard-main-grid">
                    {/* Primary Column */}
                    <div className="main-column">
                      <ContinueLearning
                        enrollments={filteredEnrollments}
                        courseFilter={courseFilter}
                        onFilterChange={setCourseFilter}
                        onResume={handleResumeLesson}
                        onOpenDetails={handleOpenLearningDetails}
                      />

                      <RecommendedSection
                        recommendedCourses={recommendedCourses}
                        onEnroll={handleQuickEnroll}
                        onViewDetails={handleOpenRecommendedDetails}
                      />
                    </div>

                    {/* Secondary Column */}
                    <div className="sidebar-column">
                      <SkillProfileSection />
                      <ComingUpSection />
                      <AchievementsSection />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
