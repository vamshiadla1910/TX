import React from "react";
import { CheckCircle2, Compass } from "lucide-react";

import { MISSION_PILLARS } from "./AboutData";

export default function MissionSection() {
  return (
    <section className="about-mission-section" id="our-mission">
      <div className="about-container">
        <div className="about-mission-layout">
          <div className="about-mission-manifesto">
            <div className="about-mission-pill">
              <span className="about-mission-dot" />
              Our Mission
            </div>

            <h2 className="about-mission-headline">
              Building a future where{" "}
              <span className="text-highlight-blue">
                skills matter more than access
              </span>
            </h2>

            <p className="about-mission-lead">
              We exist to make career-ready engineering education accessible,
              practical, and outcome-driven for every learner who is ready to
              build a better future.
            </p>

            <div className="about-mission-proof-card">
              <div className="about-proof-card-icon-wrap">
                <Compass className="about-mission-pill-icon" size={20} />
              </div>

              <div className="about-proof-card-body">
                <h3 className="about-proof-card-title">
                  Accountability is built into every learning path.
                </h3>
                <p className="about-proof-card-text">
                  We pair mentorship, project outcomes, and career support so
                  learners keep growing with clarity, confidence, and momentum.
                </p>
              </div>
            </div>
          </div>

          <div className="about-mission-pillars">
            {MISSION_PILLARS.map((pillar, index) => (
              <div key={pillar.title} className="about-mission-pillar-card">
                <div className="about-mission-pillar-num">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="about-mission-pillar-content">
                  <div className="about-mission-pillar-top">
                    <span className="about-pillar-tag">{pillar.tag}</span>
                    <h3 className="about-mission-pillar-title">{pillar.title}</h3>
                  </div>

                  <p className="about-mission-pillar-desc">{pillar.desc}</p>

                  <div className="about-mission-pillar-footer">
                    <CheckCircle2 className="about-pillar-check" size={14} />
                    {pillar.foot}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}