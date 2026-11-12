import React from "react";
import { BookOpen, Award, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react";
import "./PortalSelectView.css";

export default function PortalSelectView({ onSelectMode, onBack }) {
  return (
    <div className="topic-exams-page portal-select-page">
      <div className="topic-hero-banner portal-select-hero">
        <div className="topic-hero-text">
          <div className="topic-breadcrumb" onClick={onBack}>
            <span>Dashboard</span>
            <span>›</span>
            <span>Assessments</span>
          </div>
          <h1 className="topic-hero-title">Select Assessment Mode</h1>
        </div>
      </div>

      {/* Two Large Split Cards */}
      <div className="portal-select-grid">
        {/* BLOCK 1: PRACTICE MODE */}
        <div className="portal-card practice-portal-card">
          <div className="portal-card-top-accent practice-accent" />

          <div>
            <div className="portal-badge-pill practice-badge-pill">
              <GraduationCap size={15} />
              <span>SELF-PACED LEARNING</span>
            </div>

            <div className="portal-icon-wrapper practice-icon-wrapper">
              <BookOpen size={30} color="#2563eb" />
            </div>

            <h2 className="portal-card-title">Practice Dashboard</h2>
          </div>

          <button
            type="button"
            onClick={() => onSelectMode("practice_catalog")}
            className="portal-action-btn practice-action-btn"
          >
            <span>Enter Practice Mode</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* BLOCK 2: OFFICIAL PROCTORED EXAM */}
        <div className="portal-card exam-portal-card">
          <div className="portal-card-top-accent exam-accent" />

          <div>
            <div className="portal-badge-pill exam-badge-pill">
              <ShieldCheck size={15} />
              <span>OFFICIAL VERIFICATION</span>
            </div>

            <div className="portal-icon-wrapper exam-icon-wrapper">
              <Award size={30} color="#ea580c" />
            </div>

            <h2 className="portal-card-title">Official Assessments</h2>
          </div>

          <button
            type="button"
            onClick={() => onSelectMode("exam_catalog")}
            className="portal-action-btn exam-action-btn"
          >
            <span>Take Official Exam</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
