import React from "react";
import { ArrowLeft } from "lucide-react";
import TopicExamCard from "./TopicExamCard";
import TopicProgressWidgets from "./TopicProgressWidgets";
import ExamInstructionsModal from "../InstructionsModal/ExamInstructionsModal";
import "./OfficialExamCatalogView.css";

const CATEGORIES = [
  { id: "all", label: "All Topics" },
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "database", label: "Database" },
  { id: "web-dev", label: "Web Dev" },
  { id: "system-design", label: "System Design" }
];

export default function OfficialExamCatalogView({
  exams,
  completedExams,
  selectedCategory,
  onSelectCategory,
  instructionExam,
  onOpenInstructions,
  onCloseInstructions,
  onStartExam,
  onBackToPortal
}) {
  const completedExamList = Object.values(completedExams);
  const completedSessionCount = completedExamList.length;
  const totalCompletedCount = completedSessionCount;
  const overallPercent =
    completedSessionCount > 0
      ? Math.round(
          completedExamList.reduce((acc, item) => acc + (item.percentage || 0), 0) /
            completedSessionCount
        )
      : 0;

  const filteredExams =
    selectedCategory === "all"
      ? exams
      : exams.filter(
          (e) =>
            e.id === selectedCategory ||
            e.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="topic-exams-page official-exam-page">
      {/* Instructions Popup Modal with "Start Exam" and "Back" buttons */}
      {instructionExam && (
        <ExamInstructionsModal
          exam={instructionExam}
          onStartExam={onStartExam}
          onClose={onCloseInstructions}
        />
      )}

      <div className="topic-exams-content-grid">
        {/* Left Column: Topic Exam Cards List */}
        <div className="topic-exams-main-col">
          {/* Hero Banner */}
          <div className="topic-hero-banner">
            <div className="topic-hero-text">
              <div
                className="topic-breadcrumb"
                onClick={onBackToPortal}
                role="button"
                tabIndex={0}
              >
                <span>Assessments</span>
                <span>›</span>
                <span>Official Proctored Exam</span>
              </div>
              <h1 className="topic-hero-title">Official  Assessments</h1>
             
            </div>
          </div>

          {/* Back to Choice button */}
          <div className="official-back-bar">
            <button
              type="button"
              onClick={onBackToPortal}
              className="official-back-btn"
            >
              <ArrowLeft size={14} />
              <span>Back to Mode Selection</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="topic-filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`topic-filter-pill ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="topic-cards-list">
            {filteredExams.map((exam) => (
              <TopicExamCard
                key={exam.id}
                exam={exam}
                compData={completedExams[exam.id]}
                onStartExam={onOpenInstructions}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Progress & Stats Widgets */}
        <TopicProgressWidgets
          totalCompletedCount={totalCompletedCount}
          totalExamsCount={exams.length}
          overallPercent={overallPercent}
          recommendedExam={exams[0]}
          onStartExam={onOpenInstructions}
        />
      </div>
    </div>
  );
}
