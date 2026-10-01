import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./programtraning.css";

/* ─────────────────────────────────────────────
   Program Data
   ───────────────────────────────────────────── */
const programs = [
  {
    id: "01",
    category: "HACKATHON",
    title: "Hackathon",
    description:
      "Turn ideas into solutions. Collaborate with talented peers, solve real-world challenges, and build innovative projects under time-bound conditions.",
    duration: "Approximately 24–48 hours",
    buttonText: "Join the Challenge",
    image: "/images/programs/hackathon.jpg",
    alt: "Students collaborating during a hackathon event with laptops and code on screens",
  },
  {
    id: "02",
    category: "PRACTICAL LEARNING",
    title: "Workshop",
    description:
      "Learn directly from experienced professionals through hands-on sessions, practical exercises, and collaborative problem-solving designed to build job-ready skills.",
    duration: "Approximately 1–2 days",
    buttonText: "Explore Workshop",
    image: "/images/programs/workshop.jpg",
    alt: "Instructor conducting a technical workshop with students at laptops",
  },
  {
    id: "03",
    category: "INTENSIVE TRAINING",
    title: "Boot Camp",
    description:
      "Accelerate your learning with focused, immersive training. Build practical skills, work on real projects, and prepare yourself for industry opportunities.",
    duration: "Approximately 5 days",
    buttonText: "Start Learning",
    image: "/images/programs/bootcamp.jpg",
    alt: "Students participating in an intensive coding boot camp with mentors",
  },
  {
    id: "04",
    category: "INDUSTRY EXPOSURE",
    title: "Industrial Academic Training",
    description:
      "Bridge the gap between academics and industry with structured training, practical projects, expert guidance, and hands-on exposure to real workplace practices.",
    duration: "Approximately 45 days",
    buttonText: "Explore Training",
    image: "/images/programs/industrial-training.jpg",
    alt: "Student receiving industrial academic training in a professional environment",
  },
];

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
const ProgramsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0); 
  const [animating, setAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const INTERVAL_DURATION = 2500; // Duration of each program display in milliseconds
  const ANIMATION_DURATION = 400; // Duration of the fade animation in milliseconds

  /* Go to a specific program index */
  const goTo = useCallback(
    (index) => {
      if (index === activeIndex || animating) return;
      setAnimating(true);
      setTimeout(() => {
        setActiveIndex(index);
      }, ANIMATION_DURATION / 2);

      setTimeout(() => {
        setAnimating(false);
      }, ANIMATION_DURATION);
    },
    [activeIndex, animating]
  );

  /* Auto-rotate */
  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
      return;
    }

    // setInterval() → automatically changes the program after a certain time.
    intervalRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % programs.length);
      }, ANIMATION_DURATION / 2);

      setTimeout(() => {
        setAnimating(false);
      }, ANIMATION_DURATION);
    }, INTERVAL_DURATION);

    return () => clearInterval(intervalRef.current);
  }, [isPaused, activeIndex]);

  /* Current program */
  const current = programs[activeIndex];

  return (
    <section
      className="pt-showcase"
      aria-label="Our Training Programs"
    >
      <div className="pt-showcase-container">
        
        {/* Main Content Area */}
        <div className="pt-showcase-body">
          {/* Left: Indicators */}
          <div className="pt-indicators" role="tablist" aria-label="Program categories">
            {programs.map((prog, i) => (
              <button
                key={prog.id}
                className={`pt-indicator ${i === activeIndex ? "pt-indicator--active" : ""}`}
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Show ${prog.title}`}
                tabIndex={i === activeIndex ? 0 : -1}
              >
                <span className="pt-indicator-num">{prog.id}</span>
                <span className="pt-indicator-label">{prog.title}</span>
                {i === activeIndex && (
                  <div className="pt-progress-track">
                    <div
                      ref={progressRef}
                      className={`pt-progress-bar ${!isPaused ? "pt-progress-bar--running" : "pt-progress-bar--paused"}`}
                      key={`progress-${activeIndex}-${isPaused}`}
                    ></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Center: Text Content */}
          <div 
            className="pt-text-area"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`pt-text-content ${animating ? "pt-text-content--exit" : "pt-text-content--enter"}`}
            >
              <span className="pt-number">{current.id}</span>
              <span className="pt-category">{current.category}</span>
              <h3 className="pt-program-title">{current.title}</h3>
              <p className="pt-program-desc">{current.description}</p>
              <div className="pt-program-actions">
                <div className="pt-duration-badge">
                  <svg
                    className="pt-clock-svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{current.duration}</span>
                </div>
                
                <Link 
                  to={`/events?category=${current.title.toLowerCase().replace(/\s+/g, '-')}`} 
                  state={{ category: current.title }}
                  className="pt-explore-btn"
                >
                  {current.buttonText}
                  <svg className="pt-arrow-svg" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Premium Spotlight Glass Stage */}
          <div 
            className="pt-image-area"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="pt-spotlight-stage">
              <div className="pt-spotlight-frame">
                <img
                  key={current.id}
                  className={`pt-spotlight-img ${animating ? "pt-spotlight-img--exit" : "pt-spotlight-img--enter"}`}
                  src={current.image}
                  alt={current.alt}
                  loading="lazy"
                />
                
                {/* Gradient Shimmer Overlay */}
                <div className="pt-spotlight-overlay" />

                {/* Floating Glass Chips Overlay */}
                <div className="pt-glass-chips">
                  {programs.map((prog, i) => (
                    <button
                      key={prog.id}
                      className={`pt-glass-chip ${i === activeIndex ? "pt-glass-chip--active" : ""}`}
                      onClick={() => goTo(i)}
                      title={prog.title}
                    >
                      <span className="pt-chip-num">{prog.id}</span>
                      <span className="pt-chip-name">{prog.title}</span>
                    </button>
                  ))}
                </div>

                {/* Bottom Category Badge */}
                <div className="pt-spotlight-badge">
                  <span className="pt-badge-dot" />
                  <span>{current.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Dots */}
        <div className="pt-dots" role="tablist" aria-label="Program indicators">
          {programs.map((prog, i) => (
            <button
              key={prog.id}
              className={`pt-dot ${i === activeIndex ? "pt-dot--active" : ""}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Show ${prog.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;