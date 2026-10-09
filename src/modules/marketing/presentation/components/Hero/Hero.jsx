import React from "react";
import "./Hero.css";
import heroSkills from "./heroSkills";
import SkillsOrbit from "./SkillsOrbit";
import { Link } from "react-router-dom";

function HeroWord({ children, highlight = false }) {
  return (
    <span className={`hero-word ${highlight ? "hero-word-highlight" : ""}`}>
      {children}
    </span>
  );
}

function HeroSkill({ skill }) {
  return (
    <div className="hero-skill">
      <div className="hero-skill-icon">
        <img
          src={skill.icon}
          alt={`${skill.name} logo`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>

      <span className="hero-skill-name">{skill.name}</span>
    </div>
  );
}

function HeroSkills() {
  return (
    <div className="hero-skills-wrapper">
      <div className="hero-skills-track">
        <div className="hero-skills-group">
          {heroSkills.map((skill) => (
            <HeroSkill
              key={`first-${skill.name}`}
              skill={skill}
            />
          ))}
        </div>

        <div
          className="hero-skills-group"
          aria-hidden="true"
        >
          {heroSkills.map((skill) => (
            <HeroSkill
              key={`second-${skill.name}`}
              skill={skill}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">

        <div className="hero-left">

          <div className="hero-eyebrow">
            <span>LXP</span>
            <span>·</span>
            <span>LMS</span>
            <span>·</span>
            <span>ASSESSMENT</span>
            <span>·</span>
            <span>CAREERS</span>
            <span>·</span>
            <span>MARKETPLACE</span>
          </div>

          <h1 className="hero-title">

            <span className="hero-title-line">
              <HeroWord>From</HeroWord>
              <HeroWord>first</HeroWord>
              <HeroWord>lesson</HeroWord>
            </span>

            <span className="hero-title-line">
              <HeroWord>to</HeroWord>
              <HeroWord highlight>first</HeroWord>
              <HeroWord highlight>offer,</HeroWord>
              <HeroWord>on</HeroWord>
            </span>

            <span className="hero-title-line">
              <HeroWord>one</HeroWord>
              <HeroWord>platform.</HeroWord>
            </span>

          </h1>

          <p className="hero-description">
            Pathwing closes the loop between learning and employment.
            Courses, AI tutoring, proctored exams, verifiable credentials
            and job matching all run on one skill graph — so a learner's
            progress becomes an employer's shortlist without anyone
            re-keying a spreadsheet.
          </p>

          <div className="hero-actions">

            <Link
              to="/marketplace"
              className="hero-button hero-button-primary"
            >
              <span>Explore programs</span>
              <span className="hero-button-arrow">→</span>
            </Link>

            <Link
              to="/events"
              className="hero-button hero-button-secondary"
            >
              <span>Register for Events</span>
            </Link>

          </div>

          <HeroSkills />

        </div>

        <div className="hero-right">
          <SkillsOrbit />
        </div>

      </div>
    </section>
  );
}