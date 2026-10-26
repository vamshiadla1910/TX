import React from "react";
import { Activity, ArrowUpRight, BarChart3, Clock, TrendingUp, Users } from "lucide-react";
import { initialCourseAnalytics } from "../data/mockData";

export function Analytics({ analytics = initialCourseAnalytics }) {
  const maxActive = Math.max(...analytics.weeklyActivity.map((d) => d.active));

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span> / <span>Instructor</span> / <strong className="current">Pedagogical Insights & Metrics</strong>
          </div>
          <h1 className="module-title">Course Analytics & Engagement Insights</h1>
          <p className="module-sub">Track active learner retention, weekly watch hours, and assignment pass rate funnels.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid">
        <div className="card inst-kpi-card kpi-active-learners">
          <span className="inst-kpi-label">TOTAL LEARNERS</span>
          <strong className="inst-kpi-value">{analytics.totalEnrollments.toLocaleString()}</strong>
          <small className="inst-kpi-foot positive">▲ 16.4% semester growth</small>
        </div>
        <div className="card inst-kpi-card kpi-completion-rate">
          <span className="inst-kpi-label">COMPLETION RATE</span>
          <strong className="inst-kpi-value">{analytics.completionRate}%</strong>
          <small className="inst-kpi-foot positive">▲ 4.2% vs tech benchmark</small>
        </div>
        <div className="card inst-kpi-card kpi-average-rating">
          <span className="inst-kpi-label">AVG WEEKLY WATCH TIME</span>
          <strong className="inst-kpi-value">{analytics.avgWatchTimeHours} Hrs</strong>
          <small className="inst-kpi-foot positive">▲ High content engagement</small>
        </div>
        <div className="card inst-kpi-card kpi-net-earnings">
          <span className="inst-kpi-label">ASSIGNMENT PASS RATE</span>
          <strong className="inst-kpi-value">{analytics.assignmentPassRate}%</strong>
          <small className="inst-kpi-foot positive">First-attempt pass rate</small>
        </div>
      </div>

      {/* Weekly Activity Chart Card */}
      <div className="card analytics-chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-main-title">Weekly Learner Activity & Watch Hours</h3>
            <p className="chart-sub">Daily breakdown of active students and watch hour consumption.</p>
          </div>
          <div className="chart-summary-stat">
            <span className="stat-label">PEAK ACTIVE</span>
            <strong className="stat-amount">1,410 Students</strong>
            <span className="stat-growth"><ArrowUpRight size={14} /> Sunday Peak</span>
          </div>
        </div>

        {/* Bar Chart Representation */}
        <div className="custom-bar-chart-container">
          {analytics.weeklyActivity.map((item) => {
            const barHeight = Math.round((item.active / maxActive) * 160);
            return (
              <div key={item.day} className="bar-column">
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: `${barHeight}px` }}
                    title={`${item.day}: ${item.active} active students · ${item.watchHours} hours`}
                  />
                </div>
                <span className="bar-label">{item.day}</span>
                <small className="bar-sub">{item.active}</small>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learner Drop-off Funnel */}
      <div className="card funnel-card">
        <h3 className="chart-main-title">Curriculum Completion Funnel</h3>
        <p className="chart-sub">Learner progression from enrollment to certification issuance.</p>

        <div className="funnel-steps-list">
          <div className="funnel-step">
            <div className="funnel-meta">
              <strong>Step 1: Enrolled in Course</strong>
              <span>1,428 Students (100%)</span>
            </div>
            <div className="funnel-bar-track"><div className="funnel-bar-fill" style={{ width: "100%" }} /></div>
          </div>

          <div className="funnel-step">
            <div className="funnel-meta">
              <strong>Step 2: Completed Module 1 Labs</strong>
              <span>1,340 Students (93.8%)</span>
            </div>
            <div className="funnel-bar-track"><div className="funnel-bar-fill" style={{ width: "93.8%" }} /></div>
          </div>

          <div className="funnel-step">
            <div className="funnel-meta">
              <strong>Step 3: Midterm Project Submission</strong>
              <span>1,260 Students (88.2%)</span>
            </div>
            <div className="funnel-bar-track"><div className="funnel-bar-fill" style={{ width: "88.2%" }} /></div>
          </div>

          <div className="funnel-step">
            <div className="funnel-meta">
              <strong>Step 4: Final Capstone & Certification</strong>
              <span>1,251 Students (87.6%)</span>
            </div>
            <div className="funnel-bar-track"><div className="funnel-bar-fill purple" style={{ width: "87.6%" }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
