import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Radio,
  Video,
  Users,
  Briefcase,
  Calendar,
  Award,
  Laptop,
  GraduationCap,
  Building2,
  Trophy,
  Landmark,
  UserCheck,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import aboutClassroomImg from "../../../../../../assets/about-classroom.png";
import "./BlogOverview.css";

const AUDIENCE_CARDS = [
  {
    icon: Users,
    title: "For Students",
    desc: "Learn, practice, get certified and build your career.",
  },
  {
    icon: Landmark,
    title: "For Colleges & Institutions",
    desc: "Access a complete LMS for your students.",
  },
  {
    icon: UserCheck,
    title: "For Mentors & Trainers",
    desc: "Share knowledge and make an impact.",
  },
  {
    icon: Briefcase,
    title: "For Industry Partners",
    desc: "Collaborate, hire talent and grow together.",
  },
];

const OFFERING_CARDS = [
  {
    id: "courses",
    icon: BookOpen,
    title: "Courses",
    desc: "Industry-relevant online courses",
    details:
      "Structured self-paced modules across Full-Stack, AI, Cloud, and DevOps with hands-on practice quizzes and coding exercises.",
    theme: "theme-blue",
  },
  {
    id: "live-training",
    icon: Radio,
    title: "Live Training",
    desc: "Interactive live classes with experts",
    details:
      "Direct instructor-led training with doubt-clearing sessions, live coding walkthroughs, and peer collaboration.",
    theme: "theme-green",
  },
  {
    id: "recorded-courses",
    icon: Video,
    title: "Recorded Courses",
    desc: "Learn at your own pace",
    details:
      "High-definition video lectures available 24/7 on demand with downloadable source codes and reference notes.",
    theme: "theme-red",
  },
  {
    id: "training-programs",
    icon: Users,
    title: "Training Programs",
    desc: "Online, Offline, Hybrid modes",
    details:
      "Comprehensive multi-month bootcamps with flexible scheduling, continuous mentor reviews, and career assistance.",
    theme: "theme-purple",
  },
  {
    id: "internships",
    icon: Briefcase,
    title: "Internships",
    desc: "Real-world work experience",
    details:
      "Work on production sprint cycles, submit pull requests, and earn verified internship credentials for your resume.",
    theme: "theme-orange",
  },
  {
    id: "events",
    icon: Calendar,
    title: "Events",
    desc: "Hackathons, webinars & more",
    details:
      "National-level hackathons, tech tech-talks from industry leaders, and weekend coding sprint competitions.",
    theme: "theme-cyan",
  },
  {
    id: "certifications",
    icon: Award,
    title: "Certifications",
    desc: "Industry-recognized certificates",
    details:
      "Cryptographically verified credentials with tamper-proof QR codes recognized by corporate hiring partners.",
    theme: "theme-yellow",
  },
  {
    id: "virtual-labs",
    icon: Laptop,
    title: "Virtual Labs",
    desc: "Hands-on practice environments",
    details:
      "Instant browser-based coding sandboxes for Python, Java, Linux, and Cloud—zero local software installation needed.",
    theme: "theme-indigo",
  },
];

const STATS_ITEMS = [
  {
    icon: GraduationCap,
    value: "500+",
    label: "Courses",
  },
  {
    icon: Users,
    value: "50K+",
    label: "Students",
  },
  {
    icon: Building2,
    value: "100+",
    label: "Colleges & Institutions",
  },
  {
    icon: Award,
    value: "200+",
    label: "Industry Experts",
  },
  {
    icon: Briefcase,
    value: "1K+",
    label: "Internship Opportunities",
  },
  {
    icon: Trophy,
    value: "50+",
    label: "Events Conducted",
  },
];

const BlogOverview = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showOfferingsModal, setShowOfferingsModal] = useState(false);

  return (
    <section className="tx-overview-section">
      <div className="tx-overview-container">
        {/* ───────────────────────────────────────────────────────
            1. ABOUT TX-PATH-WING (3-Column Layout)
        ──────────────────────────────────────────────────────── */}
        <div className="tx-about-grid">
          {/* Left Column: Heading, description & CTA */}
          <div className="tx-about-info">
            <div className="tx-section-tagline">
              <span className="tx-tagline-bar" />
              <span className="tx-tagline-label">ABOUT TX-PATH-WING</span>
            </div>

            <h2 className="tx-about-heading">
              Empowering Learners <br />
              for a Better Tomorrow
            </h2>

            <p className="tx-about-description">
              TX-Path-Wing is an EdTech platform designed for B.Tech students,
              Degree students, colleges, and industry professionals. We bridge
              the gap between academic learning and industry requirements
              through practical, hands-on, and outcome-driven programs.
            </p>

            <button
              type="button"
              className="tx-know-more-btn"
              onClick={() => setShowAboutModal(true)}
            >
              <span>Know More</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Center Column: Classroom Photo */}
          <div className="tx-about-media">
            <img
              src={aboutClassroomImg}
              alt="Instructor teaching in classroom - Learn Practice Build Grow"
              className="tx-about-img"
              loading="lazy"
            />
          </div>

          {/* Right Column: Stakeholder Cards */}
          <div className="tx-about-audiences">
            {AUDIENCE_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="tx-audience-card">
                  <div className="tx-audience-icon-wrap">
                    <Icon size={20} className="tx-audience-icon" />
                  </div>
                  <div className="tx-audience-details">
                    <h4 className="tx-audience-title">{card.title}</h4>
                    <p className="tx-audience-desc">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────
            2. OUR OFFERINGS ("Explore What You Can Do")
        ──────────────────────────────────────────────────────── */}
        <div className="tx-offerings-wrap">
          <div className="tx-offerings-header">
            <div>
              <div className="tx-section-tagline">
                <span className="tx-tagline-bar" />
                <span className="tx-tagline-label">OUR OFFERINGS</span>
              </div>
              <h2 className="tx-offerings-title">Explore What You Can Do</h2>
              <p className="tx-offerings-subtitle">
                Everything you need to learn, grow, and get industry ready — in one place.
              </p>
            </div>

            <button
              type="button"
              className="tx-view-all-btn"
              onClick={() => setShowOfferingsModal(true)}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 8 Offerings Cards Grid */}
          <div className="tx-offerings-grid">
            {OFFERING_CARDS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`tx-offering-card ${item.theme}`}
                  onClick={() => setShowOfferingsModal(true)}
                >
                  <div className="tx-offering-icon-wrap">
                    <Icon size={22} className="tx-offering-icon" />
                  </div>
                  <h4 className="tx-offering-name">{item.title}</h4>
                  <p className="tx-offering-text">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────
            3. BOTTOM METRICS / STATS BANNER
        ──────────────────────────────────────────────────────── */}
        <div className="tx-stats-banner">
          {STATS_ITEMS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="tx-stat-item">
                <div className="tx-stat-icon-wrap">
                  <Icon size={22} className="tx-stat-icon" />
                </div>
                <div className="tx-stat-text-wrap">
                  <span className="tx-stat-value">{stat.value}</span>
                  <span className="tx-stat-label">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────
          MODAL 1: "ABOUT TX-PATH-WING" MODAL
      ──────────────────────────────────────────────────────── */}
      {showAboutModal && (
        <div
          className="tx-modal-backdrop"
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="tx-overview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tx-overview-modal-head">
              <div>
                <div className="tx-section-tagline">
                  <span className="tx-tagline-bar" />
                  <span className="tx-tagline-label">ABOUT TX-PATH-WING</span>
                </div>
                <h2 className="tx-modal-headline">
                  Empowering Next-Generation Tech Careers
                </h2>
                <p className="tx-modal-subheadline">
                  Bridging the gap between academic learning and high-growth engineering roles.
                </p>
              </div>
              <button
                type="button"
                className="tx-modal-close-btn"
                onClick={() => setShowAboutModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="tx-overview-modal-body">
              <p className="tx-modal-intro">
                TX-Path-Wing is an EdTech platform designed for B.Tech students,
                Degree students, colleges, and industry professionals. We bridge
                the gap between academic learning and industry requirements
                through practical, hands-on, and outcome-driven programs.
              </p>

              <div className="tx-modal-pillars-grid">
                <div className="tx-modal-pillar-card">
                  <div className="tx-pillar-icon icon-blue">
                    <GraduationCap size={22} />
                  </div>
                  <h4>For Students & Aspirants</h4>
                  <p>
                    Gain in-browser coding practice, complete capstone
                    engineering projects, and secure verified internships with
                    reputable tech companies.
                  </p>
                </div>

                <div className="tx-modal-pillar-card">
                  <div className="tx-pillar-icon icon-purple">
                    <Landmark size={22} />
                  </div>
                  <h4>For Colleges & Institutions</h4>
                  <p>
                    Integrate industry-aligned curriculum, leverage outcome-driven
                    LMS analytics, and conduct automated placement readiness
                    evaluations.
                  </p>
                </div>

                <div className="tx-modal-pillar-card">
                  <div className="tx-pillar-icon icon-green">
                    <UserCheck size={22} />
                  </div>
                  <h4>For Mentors & Trainers</h4>
                  <p>
                    Lead interactive live workshops, review real pull requests,
                    and guide thousands of eager engineering students.
                  </p>
                </div>

                <div className="tx-modal-pillar-card">
                  <div className="tx-pillar-icon icon-orange">
                    <Briefcase size={22} />
                  </div>
                  <h4>For Industry Partners</h4>
                  <p>
                    Recruit pre-screened talent with verifiable credentials,
                    proven coding skills, and hands-on project portfolios.
                  </p>
                </div>
              </div>

              <div className="tx-modal-cta-box">
                <div>
                  <h4>Ready to level up your engineering skills?</h4>
                  <p>Explore our structured 6-step learning pathway today.</p>
                </div>
                <div className="tx-modal-btn-row">
                  <a href="/learner-journey" className="tx-modal-primary-btn">
                    <span>Explore Learner Journey</span>
                    <ArrowRight size={15} />
                  </a>
                  <button
                    type="button"
                    className="tx-modal-secondary-btn"
                    onClick={() => setShowAboutModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────
          MODAL 2: "EXPLORE WHAT YOU CAN DO" ALL OFFERINGS MODAL
      ──────────────────────────────────────────────────────── */}
      {showOfferingsModal && (
        <div
          className="tx-modal-backdrop"
          onClick={() => setShowOfferingsModal(false)}
        >
          <div
            className="tx-overview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tx-overview-modal-head">
              <div>
                <div className="tx-section-tagline">
                  <span className="tx-tagline-bar" />
                  <span className="tx-tagline-label">OUR OFFERINGS</span>
                </div>
                <h2 className="tx-modal-headline">Explore What You Can Do</h2>
                <p className="tx-modal-subheadline">
                  Everything you need to learn, build, and become industry ready in one place.
                </p>
              </div>
              <button
                type="button"
                className="tx-modal-close-btn"
                onClick={() => setShowOfferingsModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="tx-overview-modal-body">
              <div className="tx-modal-offerings-grid">
                {OFFERING_CARDS.map((offering) => {
                  const Icon = offering.icon;
                  return (
                    <div
                      key={offering.id}
                      className={`tx-modal-offering-card ${offering.theme}`}
                    >
                      <div className="tx-modal-offering-top">
                        <div className="tx-offering-icon-wrap">
                          <Icon size={22} className="tx-offering-icon" />
                        </div>
                        <span className="tx-modal-offering-tag">Active Program</span>
                      </div>
                      <h4 className="tx-modal-offering-title">
                        {offering.title}
                      </h4>
                      <p className="tx-modal-offering-desc">{offering.desc}</p>
                      <p className="tx-modal-offering-details">
                        {offering.details}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="tx-modal-cta-box">
                <div>
                  <h4>Start Your Practical Learning Pathway</h4>
                  <p>Step through our structured Learn, Practice, Build & Certify roadmap.</p>
                </div>
                <div className="tx-modal-btn-row">
                  <a href="/learner-journey" className="tx-modal-primary-btn">
                    <span>Go to Programs</span>
                    <ArrowRight size={15} />
                  </a>
                  <button
                    type="button"
                    className="tx-modal-secondary-btn"
                    onClick={() => setShowOfferingsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogOverview;
