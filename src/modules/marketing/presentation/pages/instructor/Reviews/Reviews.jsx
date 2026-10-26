import React, { useState, useMemo } from "react";
import { MessageSquare, Star, ThumbsUp, User } from "lucide-react";
import { Badge } from "../common/Badge";

export function Reviews({ reviews = [] }) {
  const [starFilter, setStarFilter] = useState("All");

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (starFilter === "All") return true;
      if (starFilter === "5") return Math.floor(r.rating) === 5;
      if (starFilter === "4") return Math.floor(r.rating) === 4;
      return true;
    });
  }, [reviews, starFilter]);

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(2);

  return (
    <div className="reviews-module-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span> / <span>Instructor</span> / <strong className="current">Student Feedback & Ratings</strong>
          </div>
          <h1 className="module-title">Student Reviews & Pedagogical Feedback</h1>
          <p className="module-sub">Explore course evaluations, testimonials, and student feedback across your courses.</p>
        </div>
      </div>

      {/* Ratings Overview Card */}
      <div className="card ratings-hero-card">
        <div className="ratings-hero-score">
          <strong className="huge-rating-num">{avgRating}</strong>
          <div className="stars-cluster">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
          <span>Based on {reviews.length * 57} verified student reviews</span>
        </div>

        <div className="ratings-bars-list">
          <div className="rating-bar-row">
            <span>5 Stars</span>
            <div className="rating-track"><div className="rating-fill" style={{ width: "92%" }} /></div>
            <strong>92%</strong>
          </div>
          <div className="rating-bar-row">
            <span>4 Stars</span>
            <div className="rating-track"><div className="rating-fill" style={{ width: "6%" }} /></div>
            <strong>6%</strong>
          </div>
          <div className="rating-bar-row">
            <span>3 Stars</span>
            <div className="rating-track"><div className="rating-fill" style={{ width: "2%" }} /></div>
            <strong>2%</strong>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="card filter-bar-card">
        <div className="filter-chips">
          {["All", "5", "4"].map((s) => (
            <button
              key={s}
              type="button"
              className={`filter-chip ${starFilter === s ? "active" : ""}`}
              onClick={() => setStarFilter(s)}
            >
              {s === "All" ? "All Reviews" : `${s} Stars Only`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="reviews-cards-grid">
        {filtered.map((rev) => (
          <div key={rev.id} className="card review-card-pro">
            <div className="review-top">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {rev.avatarInitials || rev.learner.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong className="reviewer-name">{rev.learner}</strong>
                  <span className="reviewed-course">{rev.course}</span>
                </div>
              </div>

              <div className="review-stars-wrap">
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(rev.rating) ? "#f59e0b" : "none"}
                      color="#f59e0b"
                    />
                  ))}
                </div>
                <span className="rating-num">{rev.rating}</span>
              </div>
            </div>

            <p className="review-text">"{rev.comment}"</p>

            <div className="review-footer">
              <span className="review-date">{rev.date}</span>
              <span className="verified-pill">✔ Verified Enrollment</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
