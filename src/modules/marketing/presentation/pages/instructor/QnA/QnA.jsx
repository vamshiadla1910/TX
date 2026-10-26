import React, { useState, useMemo } from "react";
import { CheckCircle2, ChevronRight, HelpCircle, MessageSquare, Send, ThumbsUp, X } from "lucide-react";
import { Badge } from "../common/Badge";

export function QnA({ questions = [], onAnswerQuestion }) {
  const [filter, setFilter] = useState("All");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [replyText, setReplyText] = useState("");

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (filter === "All") return true;
      if (filter === "Pending") return q.status === "Pending";
      if (filter === "Answered") return q.status === "Answered";
      return true;
    });
  }, [questions, filter]);

  const pendingCount = questions.filter((q) => q.status === "Pending").length;

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!selectedQuestion || !replyText.trim()) return;
    if (onAnswerQuestion) {
      onAnswerQuestion(selectedQuestion.id, replyText);
    }
    setSelectedQuestion(null);
    setReplyText("");
  };

  return (
    <div className="qna-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span> / <span>Instructor</span> / <strong className="current">Q&A & Discussions</strong>
          </div>
          <h1 className="module-title">Student Q&A & Technical Discussions</h1>
          <p className="module-sub">Answer engineering queries, unblock learners with code fixes, and curate knowledge bases.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="card inst-kpi-card kpi-open-questions">
          <span className="inst-kpi-label">UNANSWERED QUESTIONS</span>
          <strong className="inst-kpi-value">{pendingCount}</strong>
          <small className="inst-kpi-foot warning">● Awaiting instructor answer</small>
        </div>
        <div className="card inst-kpi-card kpi-completion-rate">
          <span className="inst-kpi-label">RESPONSE RATE</span>
          <strong className="inst-kpi-value">98.4%</strong>
          <small className="inst-kpi-foot positive">▲ 2.1% this month</small>
        </div>
        <div className="card inst-kpi-card kpi-active-learners">
          <span className="inst-kpi-label">AVG RESPONSE TIME</span>
          <strong className="inst-kpi-value">1.4 Hrs</strong>
          <small className="inst-kpi-foot positive">Top 5% instructor speed</small>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="card filter-bar-card">
        <div className="filter-chips">
          {["All", "Pending", "Answered"].map((st) => (
            <button
              key={st}
              type="button"
              className={`filter-chip ${filter === st ? "active" : ""}`}
              onClick={() => setFilter(st)}
            >
              {st} {st === "Pending" ? `(${pendingCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Thread List */}
      <div className="qna-list">
        {filtered.map((q) => (
          <div key={q.id} className="card qna-thread-card">
            <div className="qna-thread-top">
              <div className="qna-meta-left">
                <span className="qna-course-chip">{q.course}</span>
                <span className="qna-time-tag">{q.timestamp}</span>
                <span className="qna-student-tag">Asked by {q.student}</span>
              </div>
              <Badge tone={q.status === "Answered" ? "success" : "warning"}>{q.status}</Badge>
            </div>

            <h3 className="qna-title">{q.title}</h3>
            <p className="qna-content">{q.content}</p>

            {q.answer && (
              <div className="qna-answer-box">
                <div className="qna-answer-head">
                  <CheckCircle2 size={14} className="text-success" />
                  <strong>Instructor Verified Answer</strong>
                </div>
                <p className="qna-answer-text">{q.answer}</p>
              </div>
            )}

            <div className="qna-footer">
              <span className="upvotes-pill">
                <ThumbsUp size={12} /> {q.upvotes} Upvotes
              </span>

              <button
                type="button"
                className="btn-action-sm"
                onClick={() => {
                  setSelectedQuestion(q);
                  setReplyText(q.answer || "");
                }}
              >
                <MessageSquare size={13} />
                <span>{q.answer ? "Edit Answer" : "Reply to Question"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {selectedQuestion && (
        <div className="modal-backdrop" onClick={() => setSelectedQuestion(null)}>
          <form className="card modal-dialog" onClick={(e) => e.stopPropagation()} onSubmit={handleReplySubmit}>
            <div className="modal-header">
              <div>
                <span className="cohort-code">TECHNICAL REPLY</span>
                <h2>{selectedQuestion.title}</h2>
                <small className="modal-sub">Student: {selectedQuestion.student} · {selectedQuestion.course}</small>
              </div>
              <button type="button" className="icon-button" onClick={() => setSelectedQuestion(null)}><X size={16} /></button>
            </div>
            <div className="modal-body form-grid">
              <p className="original-query-quote">"{selectedQuestion.content}"</p>
              <label>
                <span>Your Answer / Code Snippet</span>
                <textarea
                  rows="6"
                  required
                  placeholder="Provide precise technical explanations, links to docs, code examples..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setSelectedQuestion(null)}>Cancel</button>
              <button type="submit" className="btn-primary-gradient">
                <Send size={14} />
                <span>Post Verified Answer</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
