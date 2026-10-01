import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HERO_STATS } from "./AboutData";
import AboutOrbitAnimation from "./AboutOrbitAnimation";

export default function AboutHeroSection() {
  return (
    <section className="about-hero-section">
      <div className="about-container">
        <div className="about-hero-grid">
          <div className="about-hero-content">
            <div className="about-hero-eyebrow">
              <span className="about-eyebrow-line" />
              ABOUT US
            </div>

            <h1 className="about-hero-title">
              More Than Learning
              <br />
              <span className="about-hero-highlight">
                A Journey Toward Your Future
              </span>
            </h1>

            <p className="about-hero-subtitle">
              We are TX-PathWing — a community of learners, creators and
              dreamers, building a better tomorrow.
            </p>

            <p className="about-hero-desc">
              At TX-PathWing, we believe education is not just about learning
              from books, but about growing through experiences. Our platform
              combines quality learning, mentorship, and a{" "}
              <strong className="about-bold-highlight">vibrant community</strong>{" "}
              to help you build skills, gain confidence, and achieve your goals.
            </p>

            <div className="about-hero-stats">
              {HERO_STATS.map((st) => {
                const Icon = st.icon;

                return (
                  <div key={st.label} className="about-stat-item">
                    <div className={`about-stat-icon-wrap ${st.bgClass}`}>
                      <Icon
                        className="about-stat-icon"
                        style={{ color: st.iconColor }}
                      />
                    </div>

                    <div className="about-stat-info">
                      <div className="about-stat-val">{st.value}</div>
                      <div className="about-stat-lbl">{st.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="about-hero-actions">
              <Link to="/marketplace" className="about-hero-btn-primary">
                Explore Programs
                <ArrowRight className="about-btn-icon" />
              </Link>

              <Link to="/learner-journey" className="about-hero-btn-secondary">
                View 3-Step Journey
              </Link>
            </div>

            <div className="about-hero-trust-strip">
              <div className="about-hero-trust-item">
                <CheckCircle2 className="about-trust-check" />
                <span>Industry-Aligned Curriculum</span>
              </div>

              <div className="about-hero-trust-item">
                <CheckCircle2 className="about-trust-check" />
                <span>Live Capstone Projects</span>
              </div>

              <div className="about-hero-trust-item">
                <CheckCircle2 className="about-trust-check" />
                <span>1-on-1 Mentor Guidance</span>
              </div>

              <div className="about-hero-trust-item">
                <CheckCircle2 className="about-trust-check" />
                <span>Dedicated Career Placement</span>
              </div>
            </div>
          </div>

          <div className="about-hero-orbit-col">
            <AboutOrbitAnimation />
          </div>
        </div>
      </div>

      <div className="about-hero-wave">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C360,70 1080,0 1440,32 L1440,80 L0,80 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}