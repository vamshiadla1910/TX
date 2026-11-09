import React from "react";
import {
  Clock,
  FileText,
  Award,
  ShieldCheck,
  Camera,
  Users,
  Maximize2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { renderTopicIcon } from "../TopicExams/TopicExamCard";

export default function ExamInstructionsModal({ exam, onStartExam, onClose }) {
  if (!exam) return null;

  const topicsList =
    exam.syllabusTopics || [
      "Core concepts and foundational principles",
      "Real-world problem solving & syntax mastery",
      "Performance optimization & best practices",
      "Scenario-based debugging & edge cases"
    ];

  return (
    <div className="exam-instructions-modal-overlay" role="dialog" aria-modal="true">
      <div className="exam-instructions-card-grid">
        {/* 1. Compact Header */}
        <div className="instructions-header-compact">
          <div className="instructions-title-row">
            <div
              className="instructions-icon-box"
              style={{ backgroundColor: exam.iconBg || "#eff6ff" }}
            >
              {renderTopicIcon(exam.id)}
            </div>
            <div className="instructions-title-meta">
              <div className="instructions-badge-row">
                <span className="instructions-badge">
                  PROCTORED ASSESSMENT &bull; {exam.category ? exam.category.toUpperCase() : "EXAM"}
                </span>
                <span className="instructions-status-tag">Verified Official</span>
              </div>
              <h2 className="instructions-exam-title">{exam.examTitle || exam.title}</h2>
              <p className="instructions-exam-subtitle">
                Official Certification Assessment &bull; {exam.course || exam.title}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Specs Row (4 Quick Metrics in 1 Line) */}
        <div className="instructions-specs-row">
          <div className="spec-card">
            <Clock size={15} className="spec-icon spec-blue" />
            <div className="spec-info">
              <span className="spec-label">Duration</span>
              <strong className="spec-value">{exam.durationLabel || "06:00"} Mins</strong>
            </div>
          </div>

          <div className="spec-card">
            <FileText size={15} className="spec-icon spec-indigo" />
            <div className="spec-info">
              <span className="spec-label">Questions</span>
              <strong className="spec-value">5 Questions (10 Marks)</strong>
            </div>
          </div>

          <div className="spec-card">
            <Award size={15} className="spec-icon spec-amber" />
            <div className="spec-info">
              <span className="spec-label">Passing</span>
              <strong className="spec-value">60% to Qualify</strong>
            </div>
          </div>

          <div className="spec-card">
            <ShieldCheck size={15} className="spec-icon spec-green" />
            <div className="spec-info">
              <span className="spec-label">Proctoring</span>
              <strong className="spec-value">AI Multi-Face Active</strong>
            </div>
          </div>
        </div>

        {/* 3. Side-by-Side Main Grid Boxes (No Scrolling!) */}
        <div className="instructions-main-grid">
          {/* Left Grid Box: Topics Covered */}
          <div className="grid-box topics-grid-box">
            <div className="grid-box-header">
              <CheckCircle2 size={16} color="#2563eb" />
              <h4 className="grid-box-title">Topics Covered in this Assessment</h4>
            </div>
            <div className="grid-box-content topics-content">
              {topicsList.slice(0, 5).map((topic, idx) => (
                <div key={idx} className="topic-grid-item">
                  <span className="topic-num-pill">{idx + 1}</span>
                  <span className="topic-name">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Grid Box: Mandatory Proctoring Rules */}
          <div className="grid-box rules-grid-box">
            <div className="grid-box-header">
              <AlertTriangle size={16} color="#d97706" />
              <h4 className="grid-box-title rules-title">Mandatory Proctoring Instructions</h4>
            </div>
            <div className="grid-box-content rules-content">
              <div className="rule-grid-item">
                <div className="rule-bullet-icon">
                  <Camera size={13} color="#2563eb" />
                </div>
                <div className="rule-desc">
                  <strong>Live Camera &amp; Mic:</strong> Hardware monitoring is active.
                </div>
              </div>

              <div className="rule-grid-item rule-alert-item">
                <div className="rule-bullet-icon rule-red-icon">
                  <Users size={13} color="#dc2626" />
                </div>
                <div className="rule-desc">
                  <strong>Single Candidate:</strong> Exam <strong>auto-pauses</strong> if a 2nd person enters.
                </div>
              </div>

              <div className="rule-grid-item">
                <div className="rule-bullet-icon">
                  <Maximize2 size={13} color="#2563eb" />
                </div>
                <div className="rule-desc">
                  <strong>Fullscreen Mode:</strong> Sidebar removed; tab-switch monitored.
                </div>
              </div>

              <div className="rule-grid-item">
                <div className="rule-bullet-icon rule-lock-icon">
                  <Lock size={13} color="#059669" />
                </div>
                <div className="rule-desc">
                  <strong>No Mid-Exam Exit:</strong> Cannot exit until "Submit Assessment".
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Action Buttons Footer */}
        <div className="instructions-footer-actions">
          <button
            type="button"
            className="btn-instructions-back"
            onClick={onClose}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <button
            type="button"
            className="btn-instructions-start"
            onClick={() => onStartExam(exam)}
          >
            <span>Start Exam</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
