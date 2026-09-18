import { useState } from "react";
import { ArrowRight, PenTool, Users, Star, X, Check, Send } from "lucide-react";
import writeForUsImg from "../../../../../../assets/write-for-us.png";
import "./BlogWriteForUs.css";

const BlogWriteForUs = () => {
  const [showContributorModal, setShowContributorModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Student",
    category: "Career Guidance & Roadmaps",
    pitch: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      setIsSubmitted(true);
    }
  };

  const handleResetAndClose = () => {
    setShowContributorModal(false);
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      role: "Student",
      category: "Career Guidance & Roadmaps",
      pitch: "",
    });
  };

  return (
    <section className="tx-wfu-section">
      <div className="tx-wfu-container">
        <div className="tx-wfu-card">
          {/* Left Column: Text & Features */}
          <div className="tx-wfu-content">
            <div className="tx-wfu-tagline">
              <span className="tx-wfu-tagline-bar" />
              <span className="tx-wfu-tagline-text">WRITE FOR US</span>
            </div>

            <h2 className="tx-wfu-title">
              Share Your Knowledge. <br />
              <span className="tx-wfu-title-blue">Inspire Others.</span>
            </h2>

            <p className="tx-wfu-desc">
              Are you a student, educator, or industry professional? Share your
              experience, ideas, and knowledge with the TX-Path-Wing community.
            </p>

            <div className="tx-wfu-features">
              {/* Feature 1: Share Insights */}
              <div className="tx-wfu-feature">
                <div className="tx-wfu-icon-circle icon-blue">
                  <PenTool size={16} />
                </div>
                <h4 className="tx-wfu-feature-title">Share Insights</h4>
                <p className="tx-wfu-feature-desc">
                  Write about your learning journey, projects, or industry experience.
                </p>
              </div>

              {/* Feature 2: Reach a Wider Audience */}
              <div className="tx-wfu-feature">
                <div className="tx-wfu-icon-circle icon-pink">
                  <Users size={16} />
                </div>
                <h4 className="tx-wfu-feature-title">Reach a Wider Audience</h4>
                <p className="tx-wfu-feature-desc">
                  Get featured on our blog and inspire thousands of learners.
                </p>
              </div>

              {/* Feature 3: Build Your Profile */}
              <div className="tx-wfu-feature">
                <div className="tx-wfu-icon-circle icon-green">
                  <Star size={16} />
                </div>
                <h4 className="tx-wfu-feature-title">Build Your Profile</h4>
                <p className="tx-wfu-feature-desc">
                  Showcase your expertise and grow your personal brand.
                </p>
              </div>
            </div>

            <div className="tx-wfu-action">
              <button
                type="button"
                className="tx-wfu-btn"
                onClick={() => setShowContributorModal(true)}
              >
                <span>Become a Contributor</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Graphic */}
          <div className="tx-wfu-media">
            <img
              src={writeForUsImg}
              alt="Share your ideas with TX-Path-Wing"
              className="tx-wfu-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          "BECOME A CONTRIBUTOR" MODAL
      ────────────────────────────────────────────────────────── */}
      {showContributorModal && (
        <div className="tx-modal-backdrop" onClick={handleResetAndClose}>
          <div
            className="tx-contributor-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tx-contributor-modal-head">
              <div>
                <div className="tx-section-tagline">
                  <span className="tx-tagline-bar" />
                  <span className="tx-tagline-label">CONTRIBUTOR APPLICATION</span>
                </div>
                <h2 className="tx-modal-headline">
                  Share Your Story with 50,000+ Learners
                </h2>
                <p className="tx-modal-subheadline">
                  Submit your article pitch, tutorial outline, or career advice to be featured on TX-Path-Wing.
                </p>
              </div>
              <button
                type="button"
                className="tx-modal-close-btn"
                onClick={handleResetAndClose}
              >
                <X size={20} />
              </button>
            </div>

            <div className="tx-contributor-modal-body">
              {isSubmitted ? (
                <div className="tx-contributor-success-card">
                  <div className="tx-contributor-success-icon">
                    <Check size={32} />
                  </div>
                  <h3>Proposal Submitted Successfully!</h3>
                  <p>
                    Thank you, <strong>{formData.name}</strong>! Our editorial
                    team will review your article pitch and reach out to{" "}
                    <strong>{formData.email}</strong> within 48 hours with
                    submission guidelines.
                  </p>
                  <button
                    type="button"
                    className="tx-modal-primary-btn"
                    onClick={handleResetAndClose}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="tx-contributor-form">
                  <div className="tx-form-row">
                    <div className="tx-form-group">
                      <label className="tx-form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nagaraju K."
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="tx-form-input"
                      />
                    </div>

                    <div className="tx-form-group">
                      <label className="tx-form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. name@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="tx-form-input"
                      />
                    </div>
                  </div>

                  <div className="tx-form-row">
                    <div className="tx-form-group">
                      <label className="tx-form-label">I am a *</label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="tx-form-select"
                      >
                        <option value="Student">B.Tech / Degree Student</option>
                        <option value="Software Engineer">Software Engineer / Placed Alumni</option>
                        <option value="Educator">College Educator / Faculty</option>
                        <option value="Industry Mentor">Industry Mentor / Corporate Lead</option>
                      </select>
                    </div>

                    <div className="tx-form-group">
                      <label className="tx-form-label">Primary Topic Area *</label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="tx-form-select"
                      >
                        <option value="Career Guidance & Roadmaps">Career Guidance & Roadmaps</option>
                        <option value="Internship & Placement Experience">Internship & Placement Experience</option>
                        <option value="Full-Stack & System Design">Full-Stack & System Design</option>
                        <option value="AI, ML & Cloud Technologies">AI, ML & Cloud Technologies</option>
                        <option value="Student Project Case Studies">Student Project Case Studies</option>
                      </select>
                    </div>
                  </div>

                  <div className="tx-form-group">
                    <label className="tx-form-label">
                      Article Topic & Short Pitch *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Briefly describe the key lessons, code walkthroughs, or experiences you would like to write about..."
                      value={formData.pitch}
                      onChange={(e) =>
                        setFormData({ ...formData, pitch: e.target.value })
                      }
                      className="tx-form-textarea"
                    />
                  </div>

                  <div className="tx-contributor-form-actions">
                    <button type="submit" className="tx-wfu-btn">
                      <span>Submit Contributor Application</span>
                      <Send size={15} />
                    </button>
                    <button
                      type="button"
                      className="tx-modal-secondary-btn"
                      onClick={handleResetAndClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogWriteForUs;
