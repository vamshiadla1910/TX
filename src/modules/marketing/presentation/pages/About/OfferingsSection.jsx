import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { OFFERING_CATEGORIES, ABOUT_OFFERINGS, OFFERING_STATS } from "./AboutData";
import "./About.css";

export default function OfferingsSection() {
  const [activeOfferingsTab, setActiveOfferingsTab] = useState("all");
  const [showOfferingsModal, setShowOfferingsModal] = useState(false);

  const filteredOfferings =
    activeOfferingsTab === "all"
      ? ABOUT_OFFERINGS
      : ABOUT_OFFERINGS.filter((item) => item.category === activeOfferingsTab);

  return (
    <section className="about-offerings-section">
      <div className="about-container">
        <div className="about-offerings-header-row">
          <div className="about-offerings-header-content">
            <div className="about-offerings-tagline">
              <span className="about-tagline-bar" />
              <span className="about-tagline-label">OUR OFFERINGS</span>
            </div>
            <h2 className="about-offerings-title">Explore What You Can Do</h2>
            <p className="about-offerings-subtitle">
              Everything you need to learn, grow, and get industry ready — in one place.
            </p>
          </div>

          <button
            type="button"
            className="about-offerings-view-all-btn"
            onClick={() => setShowOfferingsModal(true)}
          >
            <span>View All</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="about-offerings-filters">
          {OFFERING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`about-offerings-pill-btn ${
                activeOfferingsTab === cat.id ? "active" : ""
              }`}
              onClick={() => setActiveOfferingsTab(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="about-offerings-grid">
          {filteredOfferings.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`about-offering-tile ${item.theme}`}
                onClick={() => setShowOfferingsModal(true)}
              >
                <div className="about-offering-tile-header">
                  <div className="about-offering-tile-icon-box">
                    <Icon size={22} className="about-offering-tile-icon" />
                  </div>
                  <span className="about-offering-tile-tag">{item.tag}</span>
                </div>
                <h3 className="about-offering-tile-title">{item.title}</h3>
                <p className="about-offering-tile-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="about-offerings-stats-strip">
          {OFFERING_STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="about-offering-stat-box">
                <div className="about-offering-stat-icon-wrap">
                  <Icon className="about-offering-stat-icon" size={18} />
                </div>
                <div className="about-offering-stat-texts">
                  <span className="about-offering-stat-val">{stat.value}</span>
                  <span className="about-offering-stat-lbl">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showOfferingsModal && (
        <div className="about-modal-backdrop" onClick={() => setShowOfferingsModal(false)}>
          <div className="about-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="about-modal-head">
              <div>
                <div className="about-offerings-tagline">
                  <span className="about-tagline-bar" />
                  <span className="about-tagline-label">OUR OFFERINGS</span>
                </div>
                <h3 className="about-modal-title">Everything you can explore</h3>
                <p className="about-modal-subtitle">
                  Built to help learners move from curiosity to career confidence.
                </p>
              </div>

              <button
                type="button"
                className="about-modal-close"
                aria-label="Close offerings menu"
                onClick={() => setShowOfferingsModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="about-modal-body">
              <div className="about-modal-grid">
                {ABOUT_OFFERINGS.map((item) => (
                  <div key={item.id} className={`about-modal-card ${item.theme}`}>
                    <div className="about-modal-card-top">
                      <span className="about-modal-card-tag">{item.tag}</span>
                    </div>
                    <h4 className="about-modal-card-title">{item.title}</h4>
                    <p className="about-modal-card-desc">{item.desc}</p>
                    <p className="about-modal-card-details">{item.details}</p>
                  </div>
                ))}
              </div>

              <div className="about-modal-cta">
                <div>
                  <h4 className="about-modal-cta-title">Ready to build your future?</h4>
                  <p className="about-modal-cta-desc">
                    Explore the right track for your goals and start your journey today.
                  </p>
                </div>

                <div className="about-modal-cta-btns">
                  <button
                    type="button"
                    className="about-modal-secondary-btn"
                    onClick={() => setShowOfferingsModal(false)}
                  >
                    Keep Exploring
                  </button>
                  <button
                    type="button"
                    className="about-modal-primary-btn"
                    onClick={() => setShowOfferingsModal(false)}
                  >
                    Explore Programs
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
