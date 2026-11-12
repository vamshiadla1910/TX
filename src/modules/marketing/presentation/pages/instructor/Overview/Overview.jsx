import { Sparkles, Award, BookOpen } from "lucide-react";
import { KPISection } from "./components/KPISection";
import { EarningsChart } from "./components/EarningsChart";
import { AttentionPanel } from "./components/AttentionPanel";
import { RecentReviews } from "./components/RecentReviews";
import "./Overview.css";

export function Overview({
  instructorProfile,
  earningsData,
  attentionItems,
  reviews,
  onNavigate,
  onCreateCourse,
  onResolveItem
}) {
  return (
    <div className="overview-container">
      {/* Overview Top Header Banner */}
      <header className="overview-hero">
        <div className="overview-hero-content">
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span>
            <span className="separator">/</span>
            <span>Instructor</span>
            <span className="separator">/</span>
            <strong className="current">Dashboard</strong>
          </div>

          <h1 className="overview-title"> Welcome back, {instructorProfile.name}</h1>

          <div className="instructor-meta-pills">
            <span className="meta-pill verified">
              <Award size={14} /> Verified Mentor
            </span>
            <span className="meta-pill">
              <BookOpen size={14} /> {instructorProfile.publishedCoursesCount} Courses
            </span>
            <span className="meta-pill highlight">
              ★ {instructorProfile.averageRating} Rating
            </span>
          </div>

          <p className="overview-subtitle">
           <strong>{instructorProfile.name}</strong>. Here is your courses and learners performance overview.
          </p>
        </div>

        <div className="overview-hero-action">
          <button
            type="button"
            className="btn-ai-builder-hero"
            onClick={() => (onCreateCourse ? onCreateCourse() : onNavigate("My Courses"))}
            title="Create a new course"
          >
            <Sparkles size={16} />
            <span>Create Course</span>
          </button>
        </div>
      </header>

      {/* 5 KPI Metric Cards */}
      <KPISection instructorProfile={instructorProfile} />

      {/* Two-Column Analytics & Action Layout */}
      <div className="overview-dual-grid">
        <div className="grid-left-col">
          <EarningsChart
            earningsData={earningsData}
            onViewFullAnalytics={() => onNavigate("Revenue Analytics")}
          />
          <RecentReviews reviews={reviews} />
        </div>

        <div className="grid-right-col">
          <AttentionPanel
            items={attentionItems}
            onResolveItem={onResolveItem}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}
