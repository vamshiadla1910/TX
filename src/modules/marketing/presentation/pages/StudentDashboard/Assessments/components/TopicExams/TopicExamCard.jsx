import React from "react";
import { BookOpen, FileText, CheckCircle2, ArrowRight, Database, Globe, Cpu } from "lucide-react";
import "./TopicExamCard.css";

export function renderTopicIcon(id) {
  switch (id) {
    case "java":
      return (
        <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
          <path
            d="M14 23C14 23 12.5 24 15.5 24.5C19 25 22 24.5 24.5 23.2C24.5 23.2 25.5 24 27 23C28.5 22 28.5 19.5 26.5 19.5C25 19.5 24.5 20.5 24.5 20.5"
            stroke="#ea580c"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M11 26.5C15 28 22 28 26 26.2"
            stroke="#2563eb"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M16.5 8C18.5 10.5 14 13 16.5 16C18 17.5 17.5 19.5 17.5 19.5"
            stroke="#ef4444"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M21 10.5C22.5 12.5 19.5 14.5 21 17C22 18.2 21.5 19.5 21.5 19.5"
            stroke="#ea580c"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "python":
      return (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path
            d="M15.8 4C11.2 4 11.5 6 11.5 6V9H16V10H9.5C9.5 10 6 9.6 6 14.5C6 19.4 9 19.2 9 19.2H11V16.5C11 16.5 10.9 13.5 14 13.5H19.5C19.5 13.5 22 13.6 22 11V6.8C22 6.8 22.4 4 15.8 4Z"
            fill="#2563eb"
          />
          <path
            d="M16.2 28C20.8 28 20.5 26 20.5 26V23H16V22H22.5C22.5 22 26 22.4 26 17.5C26 12.6 23 12.8 23 12.8H21V15.5C21 15.5 21.1 18.5 18 18.5H12.5C12.5 18.5 10 18.4 10 21V25.2C10 25.2 9.6 28 16.2 28Z"
            fill="#eab308"
          />
        </svg>
      );
    case "javascript":
      return <div className="js-square-badge">JS</div>;
    case "database":
      return <Database size={26} color="#6366f1" />;
    case "web-dev":
      return <Globe size={26} color="#10b981" />;
    default:
      return <Cpu size={26} color="#0284c7" />;
  }
}

export default function TopicExamCard({ exam, compData, onStartExam }) {
  const isExamCompleted = Boolean(compData);
  const pct = isExamCompleted ? compData.percentage : 0;
  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className={`topic-exam-card ${isExamCompleted ? "topic-card-completed" : ""}`}>
      {/* Left Topic Icon Box */}
      <div className="topic-card-icon-box" style={{ backgroundColor: exam.iconBg }}>
        {renderTopicIcon(exam.id)}
      </div>

      {/* Center Topic Details */}
      <div className="topic-card-info">
        <div className="topic-card-title-row">
          <h3 className="topic-card-name">{exam.title}</h3>
          <span className="topic-exams-count-pill">{exam.examsBadge}</span>
          {isExamCompleted && (
            <span className="topic-completed-tag">
              ✓ Completed • {pct}% ({compData.answeredCount}/{compData.totalQuestions} Answered)
            </span>
          )}
        </div>

        <p className="topic-card-desc">{exam.description}</p>

        {/* Meta Pills Row */}
        <div className="topic-card-meta-row">
          <span className="topic-meta-chip">
            <BookOpen size={13} color="#3b82f6" />
            <span>{exam.topicsCount}</span>
          </span>
          <span className="topic-meta-chip">
            <FileText size={13} color="#3b82f6" />
            <span>{exam.examsCount}</span>
          </span>
          <span className="topic-meta-chip">
            <span
              className={`diff-dot ${
                exam.difficultyType === "easy" ? "dot-easy" : "dot-medium"
              }`}
            />
            <span>{exam.difficulty}</span>
          </span>
        </div>

        {/* Completed Exam Related Data Strip (shown once exam is completed) */}
        {isExamCompleted && (
          <div className="topic-completed-data-strip">
            <span>
              <strong>Percentage:</strong> {pct}%
            </span>
            <span>•</span>
            <span>
              <strong>Questions Answered:</strong> {compData.answeredCount} / {compData.totalQuestions}
            </span>
            <span>•</span>
            <span>
              <strong>Time Taken:</strong> {compData.timeTaken} / {exam.durationLabel}
            </span>
            <span>•</span>
            <span>
              <strong>Camera:</strong> {compData.cameraStatus}
            </span>
          </div>
        )}
      </div>

      {/* Circular Percentage Ring — ONLY shown AFTER exam is completed! */}
      {isExamCompleted && (
        <div className="topic-card-progress-col">
          <div className="topic-progress-ring-wrap">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r={radius} stroke="#e2e8f0" strokeWidth="4.5" fill="none" />
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="#16a34a"
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 28 28)"
              />
            </svg>
            <span className="topic-ring-pct-text">{pct}%</span>
          </div>
          <span className="topic-ring-sublabel">Score</span>
        </div>
      )}

      {/* Right Action Button */}
      <div className="topic-card-action-col">
        {isExamCompleted ? (
          <button type="button" className="btn-topic-completed" disabled>
            <CheckCircle2 size={15} />
            <span>Completed</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn-topic-view-exams"
            onClick={() => onStartExam(exam)}
          >
            <span>View Exams</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
