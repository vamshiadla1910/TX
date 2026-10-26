import React, { useState, useMemo } from "react";
import {
  AlertCircle, CheckCircle, Clock, FileCheck, HelpCircle,
  Radio, ArrowRight, User
} from "lucide-react";
import { Badge, getStatusTone } from "../../common/Badge";

export function AttentionPanel({ items = [], onResolveItem, onNavigate }) {
  const [filter, setFilter] = useState("all");

  // Filter items without modifying original array, guaranteed unique keys
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter === "all") return true;
      if (filter === "questions") return item.type === "question";
      if (filter === "grading") return item.type === "grading";
      if (filter === "review") return item.type === "review";
      if (filter === "session") return item.type === "session";
      return true;
    });
  }, [items, filter]);

  return (
    <article className="card attention-panel-card">
      <div className="attention-header">
        <div>
          <h3 className="attention-title">Needs Attention</h3>
        </div>
        <Badge tone="purple">{items.length} Pending</Badge>
      </div>

      {/* Filter Chips */}
      <div className="attention-tabs">
        {[
          { id: "all", label: `All (${items.length})` },
          { id: "questions", label: "Questions" },
          { id: "grading", label: "Grading" },
          { id: "review", label: "Reviews" },
          { id: "session", label: "Sessions" }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`attention-tab-btn ${filter === tab.id ? "active" : ""}`}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List of Attention Items with Redesigned Cards */}
      <div className="attention-list">
        {filteredItems.length === 0 ? (
          <div className="attention-empty">
            <CheckCircle size={28} className="text-success" />
            <h4>All caught up!</h4>
            <p>No pending items in this category.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const tone = getStatusTone(item.status);
            return (
              <div
                key={item.id}
                className={`attention-card-item priority-${item.priority || "normal"}`}
              >
                {/* Left Visual Icon Badge */}
                <div className={`att-icon-badge ${item.type}`}>
                  {item.type === "question" && <HelpCircle size={17} />}
                  {item.type === "grading" && <FileCheck size={17} />}
                  {item.type === "review" && <AlertCircle size={17} />}
                  {item.type === "session" && <Radio size={17} />}
                </div>

                {/* Main Card Content */}
                <div className="att-card-body">
                  <div className="att-card-top-meta">
                    <span className="att-course-chip">{item.course}</span>
                    <span className="att-time-chip">
                      <Clock size={11} />
                      {item.timestamp}
                    </span>
                    <span className={`att-priority-pill ${item.priority || "normal"}`}>
                      {item.status}
                    </span>
                  </div>

                  <h4 className="att-card-title">{item.title}</h4>
                  <p className="att-card-desc">{item.details}</p>

                  <div className="att-card-footer">
                    <span className="att-author-tag">
                      <User size={12} />
                      {item.submittedBy}
                    </span>

                    <button
                      type="button"
                      className="att-action-pill-btn"
                      onClick={() => {
                        if (onResolveItem) onResolveItem(item.id);
                      }}
                      title={`Action: ${item.actionLabel}`}
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight size={13} className="att-arrow-icon" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}
