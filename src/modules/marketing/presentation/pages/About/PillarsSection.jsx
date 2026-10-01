import React from "react";
import { PILLARS } from "./AboutData";
export default function PillarsSection() {
  return (
    <section className="about-pillars-section">
      <div className="about-container">
        <div className="about-section-head">
          <div className="about-section-eyebrow">
            OUR PHILOSOPHY
          </div>

          <h2 className="about-section-title">
            The Four Pillars of TX-PathWing
          </h2>

          <p className="about-section-subtitle">
            Built by engineers and educators who know firsthand
            what it takes to succeed in today's demanding
            technical workforce.
          </p>

        </div>

        <div className="about-pillars-grid">

          {PILLARS.map((p, idx) => {

            const Icon = p.icon;

            return (
              <div
                key={p.title}
                className="about-pillar-card"
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >

                <div className="about-pillar-icon-box">

                  <Icon className="about-pillar-icon" />

                </div>

                <h3 className="about-pillar-title">
                  {p.title}
                </h3>

                <p className="about-pillar-desc">
                  {p.desc}
                </p>

              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
}