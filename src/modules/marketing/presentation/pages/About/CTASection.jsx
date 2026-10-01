import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="about-cta-section">

      <div className="about-container">

        <div className="about-cta-box">

          <div className="about-cta-glow" />

          <div className="about-cta-content">

            <span className="about-cta-pill">
              Ready to Start?
            </span>

            <h2 className="about-cta-title">
              Begin Your Journey With TX-PathWing Today
            </h2>

            <p className="about-cta-desc">
              Take the first step towards an extraordinary
              career in tech. Explore our comprehensive
              learning tracks or experience our structured
              learner journey.
            </p>

            <div className="about-cta-actions">

              <Link
                to="/marketplace"
                className="about-btn-primary"
              >
                Explore Programs
                <ArrowRight className="about-btn-icon" />
              </Link>

              <Link
                to="/learner-journey"
                className="about-btn-secondary"
              >
                View 3-Step Journey
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}