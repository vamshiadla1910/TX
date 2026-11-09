import React, { useState } from "react";
import {
  Trophy,
  Search,
  Users,
  ShieldCheck,
  Inbox
} from "lucide-react";
import "./LeaderboardTab.css";

export default function LeaderboardTab({
  currentUserName = "",
  currentUserEmail = ""
}) {
  const [timeframe, setTimeframe] = useState("week"); // 'week' | 'month' | 'all'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Leaderboard is empty - no mock or hardcoded student data
  const leadersList = [];

  return (
    <div className="leaderboard-tab-container">
      {/* 1. Hero Header Banner (Clean / Empty) */}
      <div className="leaderboard-hero-banner">
        <div className="leaderboard-hero-content">
          <div className="leaderboard-badge-row">
            <span className="leaderboard-pill">
              <Trophy size={13} />
              <span>GLOBAL STUDENT LEADERBOARD</span>
            </span>
            <span className="live-sync-pill">
              <span className="live-dot" />
              <span>Standings Reset</span>
            </span>
          </div>
          <h1 className="leaderboard-hero-title">Pathwing Skill Leaderboard</h1>
          <p className="leaderboard-hero-subtitle">
            Rankings and performance metrics will be calculated here once proctored assessments are completed.
          </p>
        </div>

        <div className="leaderboard-hero-stats">
          <div className="stat-metric-box">
            <span className="metric-label">Ranked Learners</span>
            <strong className="metric-number">0</strong>
          </div>
          <div className="stat-metric-box">
            <span className="metric-label">Assessments</span>
            <strong className="metric-number">0</strong>
          </div>
          <div className="stat-metric-box">
            <span className="metric-label">Total XP</span>
            <strong className="metric-number">0</strong>
          </div>
        </div>
      </div>

      {/* 2. Filter Toolbar & Search */}
      <div className="leaderboard-controls-bar">
        {/* Timeframe Buttons */}
        <div className="timeframe-switch">
          {[
            { id: "week", label: "This Week" },
            { id: "month", label: "This Month" },
            { id: "all", label: "All Time" }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={`timeframe-btn ${timeframe === t.id ? "active" : ""}`}
              onClick={() => setTimeframe(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="category-filter-group">
          {[
            { id: "all", label: "All Categories" },
            { id: "java", label: "Java" },
            { id: "full stack", label: "Full Stack" },
            { id: "python", label: "Python" },
            { id: "database", label: "Database" },
            { id: "system design", label: "System Design" }
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              className={`category-pill ${selectedCategory === c.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="leaderboard-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search learner or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Empty Rankings Table Card */}
      <div className="rankings-table-card">
        <div className="table-header-row">
          <div className="th-cell th-rank">RANK</div>
          <div className="th-cell th-student">STUDENT &amp; INSTITUTION</div>
          <div className="th-cell th-track">PRIMARY TRACK</div>
          <div className="th-cell th-assessments">PROCTORED EXAMS</div>
          <div className="th-cell th-streak">STREAK</div>
          <div className="th-cell th-xp">TOTAL XP</div>
        </div>

        <div className="table-body">
          {/* Completely Empty State Display */}
          <div className="leaderboard-empty-state">
            <div className="empty-state-icon-box">
              <Trophy size={42} color="#94a3b8" />
            </div>
            <h3 className="empty-state-title">No Rankings Available</h3>
            <p className="empty-state-subtitle">
              The leaderboard is currently empty. Complete proctored assessments to earn XP, build coding streaks, and appear on the global leaderboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
