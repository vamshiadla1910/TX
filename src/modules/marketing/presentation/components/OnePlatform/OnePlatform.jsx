import React from "react";
import CreatorsImage from "./assets/Creators_OP.jpg";
import CompaniesImage from "./assets/Companies_OP.jpg";
import OrganizationImage from "./assets/Organization_OP.jpg";
import IndividualImage from "./assets/Individual_OP.jpg";

import "./OnePlatform.css";

const cards = [
  {
    id: "01",
    label: "INDIVIDUALS",
    icon: "◑",
    title: "Learners & Job Seekers",
    desc: "Learn in-demand skills, earn certificates, and get hired by top companies.",
    bullets: [
      "Industry-vetted courses",
      "Verified skill certificates",
      "Direct hiring pipelines",
      "1:1 career mentorship",
    ],
    btn: "See the learner console →",
    img: IndividualImage,
  },
  {
    id: "02",
    label: "COLLEGES",
    icon: "⌖",
    title: "Organizations",
    desc: "Launch your own branded LMS with student and placement analytics.",
    bullets: [
      "White-label LMS & catalog",
      "Placement analytics dashboard",
      "Faculty co-teaching tools",
      "Accredited certification stack",
    ],
    btn: "Explore for Organizations →",
    img: OrganizationImage,
  },
  {
    id: "03",
    label: "COMPANIES",
    icon: "⬢",
    title: "Corporate L&D",
    desc: "Upskill workforce with role-based paths, SSO, and ROI reporting.",
    bullets: [
      "Role-based learning paths",
      "Skills gap & ROI reporting",
      "SSO & HRMS integrations",
      "Custom corporate academies",
    ],
    btn: "View corporate solutions →",
    img: CompaniesImage,
  },
  {
    id: "04",
    label: "CREATORS",
    icon: "✦",
    title: "Instructors",
    desc: "Monetize expertise with 85% revenue share and global distribution.",
    bullets: [
      "85% revenue share model",
      "Drag & drop course builder",
      "Global learner distribution",
      "Live cohort & community tools",
    ],
    btn: "Start teaching today →",
    img: CreatorsImage,
  },
];

const OnePlatform = () => {
  return (
    <section className="op-section">
      <div className="op-container">
        <div className="op-pill">— WHO RUNS ON TX PATHWING —</div>

        <h2 className="op-heading">
          One platform
          <br />
         
        </h2>

        <p className="op-sub">
          Purpose-built for every stakeholder in the learning economy. No compromises,
          no one-size-fits-all.
        </p>

        <div className="op-grid">
          {cards.map((card) => (
            <div className="op-card" key={card.id}>
              <div className="op-img-wrap">
                <img src={card.img} alt={card.title} className="op-img" />
                <span className="op-ghost">{card.id}</span>
                <div className="op-fade" />
              </div>

              <div className="op-content">
                <div className="op-label-row">
                  <span className="op-icon">{card.icon}</span>
                  <span className="op-label">{card.label}</span>
                </div>

                <h3 className="op-title">{card.title}</h3>
                <p className="op-desc">{card.desc}</p>

                <ul className="op-bullets">
                  {card.bullets.map((item, idx) => (
                    <li key={idx}>
                      <span className="op-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <button className="op-btn">{card.btn}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OnePlatform;
