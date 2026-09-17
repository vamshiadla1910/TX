import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Users, BookOpen, Star, TrendingUp, Target, Compass,
  CheckCircle2, Sparkles, ArrowRight, Award,
  Briefcase, HeartHandshake, Code2
} from "lucide-react";
import "./About.css";
import txLogo from "../../../../../assets/tx-icon.jpg";

const HERO_STATS = [
  {
    icon: Users,
    value: "1000+",
    label: "Active Learners",
    bgClass: "stat-blue",
    iconColor: "#0284C7"
  },
  {
    icon: BookOpen,
    value: "Expert",
    label: "Mentors & Trainers",
    bgClass: "stat-teal",
    iconColor: "#0D9488"
  },
  {
    icon: Star,
    value: "100%",
    label: "Support & Guidance",
    bgClass: "stat-amber",
    iconColor: "#D97706"
  },
  {
    icon: TrendingUp,
    value: "Infinite",
    label: "Growth Opportunities",
    bgClass: "stat-purple",
    iconColor: "#9333EA"
  }
];

const ORBIT_NODES = [
  { label: "Start", short: "Start", emoji: "💻", angle: 0 },
  { label: "Learning", short: "Learning", emoji: "🎓", angle: 60 },
  { label: "Practice", short: "Practice", emoji: "💪", angle: 120 },
  { label: "Projects", short: "Projects", emoji: "🚀", angle: 180 },
  { label: "Skills", short: "Skills", emoji: "⚡", angle: 240 },
  { label: "Career", short: "Career", emoji: "📈", angle: 300 }
];

const ORBIT_CYCLE_DURATION = 8000;

function AboutOrbitAnimation() {
  const [progress, setProgress] = useState(0);
  const [isHired, setIsHired] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [confetti, setConfetti] = useState([]);

  const animRef = useRef(null);
  const startTimeRef = useRef(0);
  const prevProgressRef = useRef(0);
  const hiredTimerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loop = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const norm = ((timestamp - startTimeRef.current) % ORBIT_CYCLE_DURATION) / ORBIT_CYCLE_DURATION;

      // When crossing the full cycle loop boundary, trigger the HIRED celebration
      if (prevProgressRef.current > 0.88 && norm < 0.12) {
        setIsHired(true);
        const particles = Array.from({ length: 14 }, (_, idx) => ({
          x: (Math.random() - 0.5) * 160,
          y: (Math.random() - 0.5) * 160,
          r: 4 + Math.random() * 6,
          c: ["#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE", "#EFF6FF"][idx % 5],
          d: Math.random() * 360
        }));
        setConfetti(particles);

        if (hiredTimerRef.current) window.clearTimeout(hiredTimerRef.current);
        hiredTimerRef.current = window.setTimeout(() => {
          setIsHired(false);
          setConfetti([]);
        }, 1800);
      }

      prevProgressRef.current = norm;
      setProgress(norm);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (hiredTimerRef.current) clearTimeout(hiredTimerRef.current);
    };
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1200;

  const stageSize = isMobile ? 340 : isTablet ? 410 : 490;
  const radius = Math.round(stageSize * 0.365);
  const nodeSize = isMobile ? 44 : isTablet ? 48 : 52;
  const hubSize = isMobile ? 74 : isTablet ? 84 : 94;
  const viewBoxSize = 520;
  const centerCoord = viewBoxSize / 2;
  const svgRadius = 190;
  const activeNodeIdx = Math.floor(progress * ORBIT_NODES.length + 0.18);

  // Orbit Head angle
  const headAngleRad = (-90 + progress * 360) * (Math.PI / 180);
  const headX = Math.cos(headAngleRad) * radius;
  const headY = Math.sin(headAngleRad) * radius;

  // Trailing dots
  const trailDots = [0.022, 0.045].map((offset) => {
    const angle = (-90 + ((progress - offset + 1) % 1) * 360) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  });

  return (
    <div className="about-orbit-wrapper">
      <div className="about-orbit-box">
        <div
          className="about-orbit-stage"
          style={{ width: stageSize, height: stageSize }}
        >
          {/* Circular Orbit Track SVG */}
          <svg
            className="about-orbit-svg"
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          >
            {/* Background Dashed Circle */}
            <circle
              className="about-orbit-dash-bg"
              cx={centerCoord}
              cy={centerCoord}
              r={svgRadius}
              fill="none"
              stroke="#C7D9FF"
              strokeWidth="0.8"
            />
            {/* Progress Solid Glow Stroke */}
            <circle
              className="about-orbit-glow-stroke"
              cx={centerCoord}
              cy={centerCoord}
              r={svgRadius}
              fill="none"
              stroke="#2563EB"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * svgRadius}
              strokeDashoffset={2 * Math.PI * svgRadius * (1 - progress)}
              transform={`rotate(-90 ${centerCoord} ${centerCoord})`}
            />
          </svg>

          {/* Orbiting Milestone Nodes */}
          {ORBIT_NODES.map((item, idx) => {
            const rad = (-90 + item.angle) * (Math.PI / 180);
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const isActive = idx <= activeNodeIdx;
            const isCurrent = idx === activeNodeIdx;

            const pillDist = radius + (isMobile ? 32 : 42);
            const pillX = Math.cos(rad) * pillDist;
            const pillY = Math.sin(rad) * pillDist;

            return (
              <div
                key={item.label}
                className="about-orbit-node-anchor"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  zIndex: isActive ? 3 : 2
                }}
              >
                {/* Node Bubble */}
                <div
                  className={`about-orbit-node-bubble ${isActive ? "is-active" : ""} ${
                    isCurrent && isActive ? "is-current" : ""
                  }`}
                  style={{
                    width: nodeSize,
                    height: nodeSize
                  }}
                >
                  <span
                    className="about-orbit-emoji"
                    style={{
                      fontSize: isMobile ? 18 : 22,
                      filter: isActive ? "brightness(1.08) saturate(1.05)" : "saturate(0.85) brightness(1.05)"
                    }}
                  >
                    {item.emoji}
                  </span>

                  {/* Top-right Check Badge */}
                  <div
                    className="about-orbit-node-badge"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "scale(1)" : "scale(0.4)"
                    }}
                  >
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                {/* Floating Milestone Pill Label */}
                <div
                  className="about-orbit-pill-anchor"
                  style={{
                    transform: `translate(calc(-50% + ${pillX - x}px), calc(-50% + ${pillY - y}px))`,
                    zIndex: 4
                  }}
                >
                  <div
                    className={`about-orbit-pill ${isActive ? "is-active" : ""}`}
                    style={{
                      fontSize: isMobile ? 11 : 12
                    }}
                  >
                    {item.short}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Trail Particles */}
          {trailDots.map((pos, idx) => (
            <div
              key={idx}
              className="about-orbit-trail-dot"
              style={{
                width: idx === 0 ? 6 : 3.5,
                height: idx === 0 ? 6 : 3.5,
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                opacity: idx === 0 ? 0.35 : 0.18
              }}
            />
          ))}

          {/* Head Glow Particle */}
          <div
            className="about-orbit-head-anchor"
            style={{
              transform: `translate(calc(-50% + ${headX}px), calc(-50% + ${headY}px))`,
              zIndex: 10
            }}
          >
            <div className="about-orbit-head-blur-outer" />
            <div className="about-orbit-head-blur-inner" />
            <div className="about-orbit-head-dot">
              <div className="about-orbit-head-spark" />
            </div>
          </div>

          {/* Center Hub */}
          <div
            className="about-orbit-center-anchor"
            style={{
              width: hubSize,
              height: hubSize,
              animation: isHired
                ? "centerBounceHired 720ms cubic-bezier(0.34, 1.56, 0.64, 1)"
                : undefined
            }}
          >
            <div className={`about-orbit-center-card ${isHired ? "is-hired" : ""}`}>
              <img
                src={txLogo}
                alt="TX Pathwing Logo"
                className="about-orbit-center-img"
              />
            </div>


            {/* Confetti Explosion Particles */}
            {confetti.map((p, idx) => (
              <div
                key={idx}
                className="about-orbit-confetti"
                style={{
                  width: p.r,
                  height: p.r,
                  backgroundColor: p.c,
                  "--tx": `${p.x}px`,
                  "--ty": `${p.y}px`,
                  "--rot": `${p.d}deg`,
                  animation: `confettiPop 900ms cubic-bezier(0.22, 1, 0.36, 1) ${idx * 28}ms forwards`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const PILLARS = [
  {
    icon: Code2,
    title: "Practical, Real-Time Learning",
    desc: "We prioritize building software over memorizing syntax. Our curriculum centers on real-world industry projects, live telemetry, and modern frameworks."
  },
  {
    icon: HeartHandshake,
    title: "Personalized 1-on-1 Mentorship",
    desc: "Every learner receives hands-on guidance from industry veterans, code reviews, and tailored learning tracks to ensure steady technical progress."
  },
  {
    icon: Users,
    title: "Vibrant Community of Creators",
    desc: "Surround yourself with passionate peers, join collaborative hackathons, and tap into an active alumni network thriving across top tech enterprises."
  },
  {
    icon: Briefcase,
    title: "Dedicated Career Outcomes",
    desc: "From resume crafting and system design mock interviews to mega offline placement drives, we support your job search every step of the way."
  }
];

const JOURNEY_MILESTONES = [
  {
    num: "01",
    title: "Foundations First",
    desc: "Master computational logic, data structures, and core web fundamentals with daily guided practice."
  },
  {
    num: "02",
    title: "Specialized Career Tracks",
    desc: "Choose MERN, Java Full Stack, Python with GenAI, or Cloud Engineering aligned with hiring demands."
  },
  {
    num: "03",
    title: "Portfolio Production",
    desc: "Build deployable full-stack apps with authentication, cloud persistence, and third-party APIs."
  },
  {
    num: "04",
    title: "Career Placement",
    desc: "Up to 16 months of placement support, AI mock rounds, and direct access to 1000+ hiring partners."
  }
];

export default function About() {
  return (
    <div className="about-page">
      {/* 1. HERO SECTION */}
      <section className="about-hero-section">
        <div className="about-container">
          <div className="about-hero-grid">
            {/* Left Content */}
            <div className="about-hero-content">
              <div className="about-hero-eyebrow">
                <span className="about-eyebrow-line" />
                ABOUT US
              </div>

              <h1 className="about-hero-title">
                More Than Just <br />
                <span className="about-hero-highlight">An Institution</span>
              </h1>

              <p className="about-hero-subtitle">
                We are TX-PathWing — a community of learners, creators and dreamers, building a better tomorrow.
              </p>

              <p className="about-hero-desc">
                At TX-PathWing, we believe education is not just about learning from books, but about growing through experiences. Our platform combines quality learning, mentorship, and a <strong className="about-bold-highlight">vibrant community</strong> to help you build skills, gain confidence, and achieve your goals.
              </p>

              {/* 4 Stats Badges */}
              <div className="about-hero-stats">
                {HERO_STATS.map((st) => {
                  const Icon = st.icon;
                  return (
                    <div key={st.label} className="about-stat-item">
                      <div className={`about-stat-icon-wrap ${st.bgClass}`}>
                        <Icon className="about-stat-icon" style={{ color: st.iconColor }} />
                      </div>
                      <div className="about-stat-info">
                        <div className="about-stat-val">{st.value}</div>
                        <div className="about-stat-lbl">{st.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hero Action Buttons to fill bottom space */}
              <div className="about-hero-actions">
                <Link to="/" className="about-hero-btn-primary">
                  Explore Programs <ArrowRight className="about-btn-icon" />
                </Link>
                <Link to="/learner-journey" className="about-hero-btn-secondary">
                  View 3-Step Journey
                </Link>
              </div>

              {/* Trust & Differentiators Strip */}
              <div className="about-hero-trust-strip">
                <div className="about-hero-trust-item">
                  <CheckCircle2 className="about-trust-check" />
                  <span>Industry-Aligned Curriculum</span>
                </div>
                <div className="about-hero-trust-item">
                  <CheckCircle2 className="about-trust-check" />
                  <span>Live Capstone Projects</span>
                </div>
                <div className="about-hero-trust-item">
                  <CheckCircle2 className="about-trust-check" />
                  <span>1-on-1 Mentor Guidance</span>
                </div>
                <div className="about-hero-trust-item">
                  <CheckCircle2 className="about-trust-check" />
                  <span>Dedicated Career Placement</span>
                </div>
              </div>
            </div>

            {/* Right Side Orbit Milestone Animation */}
            <div className="about-hero-orbit-col">
              <AboutOrbitAnimation />
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="about-hero-wave">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,32 C360,70 1080,0 1440,32 L1440,80 L0,80 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* 2. MISSION & VISION */}
      <section className="about-mv-section">
        <div className="about-container">
          <div className="about-mv-grid">
            <div className="about-mv-card mission-card">
              <div className="about-mv-icon-box">
                <Target className="about-mv-icon" />
              </div>
              <span className="about-mv-badge">Our Purpose</span>
              <h2 className="about-mv-title">Our Mission</h2>
              <p className="about-mv-text">
                To democratize elite technical education by transforming ambitious learners into job-ready software professionals through industry-grade projects, mentor-led guidance, and structured accountability.
              </p>
              <ul className="about-mv-list">
                <li><CheckCircle2 className="about-check-icon" /> Bridge the academic-industry readiness gap</li>
                <li><CheckCircle2 className="about-check-icon" /> Provide live, project-first training environments</li>
                <li><CheckCircle2 className="about-check-icon" /> Ensure end-to-end career transition support</li>
              </ul>
            </div>

            <div className="about-mv-card vision-card">
              <div className="about-mv-icon-box vision-icon-box">
                <Compass className="about-mv-icon vision-icon" />
              </div>
              <span className="about-mv-badge vision-badge">Our North Star</span>
              <h2 className="about-mv-title">Our Vision</h2>
              <p className="about-mv-text">
                To be the preeminent education-to-employment bridge that connects aspirational talent from every tier and background directly to world-class software engineering careers and global tech leadership.
              </p>
              <ul className="about-mv-list">
                <li><CheckCircle2 className="about-check-icon" /> Empower 100,000+ engineers nationwide</li>
                <li><CheckCircle2 className="about-check-icon" /> Foster long-term technological capability</li>
                <li><CheckCircle2 className="about-check-icon" /> Establish global hiring partner credibility</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS */}
      <section className="about-pillars-section">
        <div className="about-container">
          <div className="about-section-head">
            <div className="about-section-eyebrow">
              <Sparkles className="about-icon-sparkle" /> OUR PHILOSOPHY
            </div>
            <h2 className="about-section-title">The Four Pillars of TX-PathWing</h2>
            <p className="about-section-subtitle">
              Built by engineers and educators who know firsthand what it takes to succeed in today's demanding technical workforce.
            </p>
          </div>

          <div className="about-pillars-grid">
            {PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="about-pillar-card" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="about-pillar-icon-box">
                    <Icon className="about-pillar-icon" />
                  </div>
                  <h3 className="about-pillar-title">{p.title}</h3>
                  <p className="about-pillar-desc">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW WE WORK (ROADMAP) */}
      <section className="about-journey-section">
        <div className="about-container">
          <div className="about-section-head">
            <div className="about-section-eyebrow">
              <Award className="about-icon-sparkle" /> PROVEN FRAMEWORK
            </div>
            <h2 className="about-section-title">Your Blueprint to Tech Success</h2>
            <p className="about-section-subtitle">
              A compounding step-by-step model designed to take you from fundamentals to confident software engineering.
            </p>
          </div>

          <div className="about-milestones-grid">
            {JOURNEY_MILESTONES.map((m) => (
              <div key={m.num} className="about-milestone-card">
                <div className="about-milestone-num">{m.num}</div>
                <h3 className="about-milestone-title">{m.title}</h3>
                <p className="about-milestone-desc">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="about-cta-section">
        <div className="about-container">
          <div className="about-cta-box">
            <div className="about-cta-glow" />
            <div className="about-cta-content">
              <span className="about-cta-pill">Ready to Start?</span>
              <h2 className="about-cta-title">Begin Your Journey With TX-PathWing Today</h2>
              <p className="about-cta-desc">
                Take the first step towards an extraordinary career in tech. Explore our comprehensive learning tracks or experience our structured learner journey.
              </p>
              <div className="about-cta-actions">
                <Link to="/" className="about-btn-primary">
                  Explore Programs <ArrowRight className="about-btn-icon" />
                </Link>
                <Link to="/learner-journey" className="about-btn-secondary">
                  View 3-Step Journey
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
