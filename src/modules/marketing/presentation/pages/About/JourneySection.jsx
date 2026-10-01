import React from "react";
import { BadgeCheck } from "lucide-react";

import { JOURNEY_MILESTONES } from "./AboutData";

export default function JourneySection() {
  return (
    <section className="about-journey-section">

      <div className="about-container">

        <div className="about-section-head">

          <div className="about-section-eyebrow">

            <BadgeCheck className="about-icon-sparkle" />

            PROVEN FRAMEWORK

          </div>

          <h2 className="about-section-title">
            Your Blueprint to Tech Success
          </h2>

          <p className="about-section-subtitle">
            A compounding step-by-step model designed to take
            you from fundamentals to confident software
            engineering.
          </p>

        </div>

        <div className="about-milestones-grid">

          {JOURNEY_MILESTONES.map((m) => (

            <div
              key={m.num}
              className="about-milestone-card"
            >

              <div className="about-milestone-num">
                {m.num}
              </div>

              <h3 className="about-milestone-title">
                {m.title}
              </h3>

              <p className="about-milestone-desc">
                {m.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}