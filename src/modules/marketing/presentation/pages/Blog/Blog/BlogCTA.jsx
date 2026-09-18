import { ArrowRight, Send } from "lucide-react";
import "./BlogCTA.css";

const BlogCTA = () => {
  return (
    <section className="tx-blog-cta-section">
      <div className="tx-blog-cta-container">
        <div className="tx-blog-cta-card">
          <div className="tx-blog-cta-content">
            <div className="tx-section-tagline">
              <span className="tx-tagline-bar" />
              <span className="tx-tagline-label">READY TO START YOUR JOURNEY?</span>
            </div>

            <h2 className="tx-blog-cta-title">
              Join Thousands of Learners Building <br />
              A <span className="tx-text-blue">Brighter Future</span> with TX-Path-Wing.
            </h2>

            <p className="tx-blog-cta-desc">
              Get access to industry-relevant programs, hands-on learning, internships, and more.
            </p>
          </div>

          {/* Dotted Trajectory & Handwritten Note */}
          <div className="tx-blog-cta-graphic">
            <svg
              className="tx-trajectory-svg"
              viewBox="0 0 220 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 70 C 60 75, 120 40, 160 35 C 185 30, 200 15, 210 12"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M210 12 L 196 16 L 204 25 Z"
                fill="#2563eb"
              />
            </svg>
            <div className="tx-handwritten-note">
              <span>Your</span>
              <span>Future</span>
              <span>Starts Here</span>
            </div>
          </div>

          {/* Register Button */}
          <div className="tx-blog-cta-action">
            <a href="/learner-journey" className="tx-register-btn">
              <span>Register Now</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogCTA;
