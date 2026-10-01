import React from "react";

import {
  Compass,
} from "lucide-react";

import { VISION_CARDS } from "./AboutData";

export default function VisionSection() {
  return (
    <section
      className="about-vision-section"
      id="our-vision"
    >

      <div className="about-container">

        <div className="about-vision-header">

          <div className="about-vision-badge">

            <Compass
              className="about-vision-badge-icon"
              size={16}
            />

            <span>
              OUR NORTH STAR • 2030 HORIZON
            </span>

          </div>

          <h2 className="about-vision-title">
            Connecting Global Potential to{" "}
            <span className="text-highlight-blue">
              Limitless Opportunity
            </span>
          </h2>

          <p className="about-vision-manifesto">
            "To be the preeminent education-to-employment
            bridge that connects aspirational talent from every
            tier and background directly to world-class software
            engineering careers and global tech leadership."
          </p>

        </div>

        <div className="about-vision-cards-grid">

          {VISION_CARDS.map((c) => {

            const Icon = c.icon;

            return (
              <div
                key={c.heading}
                className={`about-vision-card ${
                  c.featured
                    ? "vision-card-featured"
                    : ""
                }`}
              >

                <div className="about-vision-card-header">

                  <div
                    className={`about-vision-icon-wrap ${
                      c.featured
                        ? "featured-icon-wrap"
                        : ""
                    }`}
                  >
                    <Icon
                      size={22}
                      className="about-vision-card-icon"
                    />
                  </div>

                  <span
                    className={`about-vision-target-tag ${
                      c.featured
                        ? "featured-tag"
                        : ""
                    }`}
                  >
                    {c.tag}
                  </span>

                </div>

                <div
                  className={`about-vision-metric ${
                    c.featured
                      ? "featured-metric"
                      : ""
                  }`}
                >
                  {c.metric}
                </div>

                <h3 className="about-vision-card-heading">
                  {c.heading}
                </h3>

                <p className="about-vision-card-text">
                  {c.text}
                </p>

                <div
                  className={`about-vision-card-accent ${
                    c.featured
                      ? "featured-accent"
                      : ""
                  }`}
                />

              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
}