import React from "react";
import { Star, MessageSquare } from "lucide-react";

export function RecentReviews({ reviews = [] }) {
  return (
    <article className="card recent-reviews-card">
      <div className="reviews-header">
        <div>
          <h3 className="reviews-title">Learner Feedback</h3>
        </div>
        <div className="reviews-score-pill">
          <Star size={14} className="star-icon" />
          <strong>4.92</strong>
          <span>(342 ratings)</span>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((rev) => (
          <div key={rev.id} className="review-item">
            <div className="review-top">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {rev.avatarInitials || rev.learner.split(" ").map((n) => n[0]).join("")}
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
                      size={13}
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
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
