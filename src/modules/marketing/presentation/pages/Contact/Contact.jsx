import React from "react";
import "./Contact.css";
import ContactForm from "./ContactForm";
 
const pathwayData = [
  {
    number: "01",
    title: "Organization",
    description: "Connect your organization with TX Pathwing.",
    className: "pathway-step-one",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 8h3a1 1 0 0 1 1 1v12M2 21h20M8 7h4M8 11h4M8 15h4" />
      </svg>
    )
  },
  {
    number: "02",
    title: "Collaboration",
    description: "Identify meaningful areas for partnership.",
    className: "pathway-step-two",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 12.5 6 15a3 3 0 0 0 4.24 4.24l2.12-2.12M15.5 11.5 18 9a3 3 0 0 0-4.24-4.24l-2.12 2.12M9 15l6-6M7 8H4a2 2 0 0 0-2 2v2M17 16h3a2 2 0 0 0 2-2v-2" />
      </svg>
    )
  },
  {
    number: "03",
    title: "Training",
    description: "Support industry-focused learning initiatives.",
    className: "pathway-step-three",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 9 9-4 9 4-9 4-9-4Z" />
        <path d="M7 11v5c0 2 2.2 4 5 4s5-2 5-4v-5M21 10v5" />
      </svg>
    )
  },
  {
    number: "04",
    title: "Internship",
    description: "Create opportunities for practical exposure.",
    className: "pathway-step-four",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5M8 12h8M8 16h6" />
      </svg>
    )
  },
  {
    number: "05",
    title: "Talent",
    description: "Connect with developing technology professionals.",
    className: "pathway-step-five",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M15 15c3 0 6 1.8 6 5" />
      </svg>
    )
  },
  {
    number: "06",
    title: "Industry",
    description: "Build lasting industry connections.",
    className: "pathway-step-six",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20V10M10 20V6M16 20V12M22 20V3" />
        <path d="M2 20h21" />
      </svg>
    )
  }
];
 
const Organization = () => {
  return (
    <main className="organization-page">
      <section className="organization-information">
        <div className="organization-section-heading">
          <span className="organization-section-label">
            WHO WE CONNECT
          </span>
 
          <h2>
            Connecting Organizations
            <br />
            with <span>Emerging Talent</span>
          </h2>
 
          <p>
            TX Pathwing creates a bridge between learners, organizations,
            and industry. Organizations can connect with skilled students
            and graduates, participate in training and internship
            initiatives, and explore meaningful opportunities for
            collaboration.
          </p>
        </div>
 
        <div className="organization-information-grid">
          <article className="information-card">
            <div className="information-icon">01</div>
 
            <h3>Learners</h3>
 
            <p>
              Collaborate on industry-oriented learning, training,
              internships, and career opportunities.
            </p>
          </article>
 
          <article className="information-card">
            <div className="information-icon">02</div>
 
            <h3>Organizations</h3>
 
            <p>
              Connect with a growing talent and learning ecosystem
              through meaningful institutional opportunities.
            </p>
          </article>
 
          <article className="information-card">
            <div className="information-icon">03</div>
 
            <h3>Companies</h3>
 
            <p>
              Discover opportunities to engage with emerging
              technology professionals and skilled learners.
            </p>
          </article>
 
          <article className="information-card">
            <div className="information-icon">04</div>
 
            <h3>Industry Partners</h3>
 
            <p>
              Create meaningful training, mentoring, internship,
              and hiring connections.
            </p>
          </article>
        </div>
      </section>
 
      <section className="institutional-pathway">
        <div className="organization-section-heading centered-heading">
          <span className="organization-section-label">
            INDUSTRIAL PATHWAY
          </span>
 
          <h2>
            A Pathway from Learning
            <br />
            to <span>Industry</span>
          </h2>
 
          <p>
            Connect organizations with learners through a structured
            journey from collaboration to real-world industry exposure.
          </p>
        </div>
 
        <div className="pathway-roadmap">
          <svg
            className="pathway-roadmap-line"
            viewBox="0 0 1200 440"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="pathway-line-base"
              d="M 92 105
                 C 150 105, 180 315, 290 315
                 C 390 315, 405 105, 510 105
                 C 610 105, 625 315, 730 315
                 C 830 315, 850 105, 955 105
                 C 1060 105, 1080 315, 1140 315"
            />
 
            <path
              className="pathway-line-flow"
              d="M 92 105
                 C 150 105, 180 315, 290 315
                 C 390 315, 405 105, 510 105
                 C 610 105, 625 315, 730 315
                 C 830 315, 850 105, 955 105
                 C 1060 105, 1080 315, 1140 315"
            />
          </svg>
 
          {pathwayData.map((step) => (
            <article
              key={step.number}
              className={`pathway-card ${step.className}`}
            >
              <div className="pathway-card-icon">
                {step.icon}
              </div>
 
              <div className="pathway-card-content">
                <span className="pathway-card-number">
                  {step.number}
                </span>
 
                <h3>{step.title}</h3>
 
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ContactForm />
 
    </main>
  );
};
 
export default Organization;
 