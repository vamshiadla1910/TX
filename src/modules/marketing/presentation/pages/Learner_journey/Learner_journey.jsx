import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, BookOpen, Brain, Briefcase, Check, ChevronLeft, ChevronRight, CircleCheck, Clock, CodeXml, Database, ExternalLink, FileText, Globe, Layers, Search, ShoppingCart, Sparkles, Star, Users, Zap } from "lucide-react";
import "./Learner_journey.css";

const STAGES = [
  { step: "Step 1 — Fundamentals", pfx: "Build Your ", hl: "Strong Foundation", desc: "Start with the essential IT fundamentals and core technical concepts. Develop a clear understanding of programming, tools, and technologies that form the foundation for your career." },
  { step: "Step 2 — Choose Your Job Track", pfx: "Focus on the ", hl: "Career You Want", desc: "Choose a job-oriented career track based on your interests and goals. Build the practical skills, projects, and industry knowledge required for your chosen IT role." },
  { step: "Step 3 — Placement Assistance for Your Job", pfx: "Turn Your Skills Into ", hl: "Opportunities", desc: "Get career-focused placement support to help you become job-ready. Prepare with resume guidance, interview preparation, mock interviews, and assistance throughout your job search." }
];
const CORE_TECH = [
  { name: "HTML", color: "#E34F26", letter: "H" }, { name: "CSS", color: "#1572B6", letter: "C" },
  { name: "Python", color: "#3776AB", letter: "Py" }, { name: "SQL", color: "#4479A1", letter: "S" },
];
const JOB_TRACKS = [
  { title: "MERN Full Stack", duration: "8 Months", includes: "Includes Fundamentals", mode: "Online", projects: "10+ Real-time Projects", stack: ["mongoDB", "Express", "React", "Node"], accent: "#3B82F6", popular: true },
  { title: "Java Full Stack", duration: "8 Months", includes: "Includes Fundamentals", mode: "Online", projects: "10+ Projects", stack: ["React", "Java", "Spring"], accent: "#F59E0B" },
  { title: "Python Full Stack with GenAI", duration: "6 Months", includes: "After Fundamentals", mode: "Online + Offline", projects: "AI Projects", stack: ["Python", "GenAI", "Django"], accent: "#10B981" },
  { title: "Java Full Stack with Gen AI", duration: "6 Months", includes: "After Fundamentals", mode: "Online + Offline", projects: "AI Integrated", stack: ["Java", "Gen AI", "Spring AI"], accent: "#8B5CF6" },
];
const PLACEMENT_BENEFITS = [
  { icon: Brain, label: "Aptitude Training" }, { icon: Users, label: "Soft Skills Training" },
  { icon: FileText, label: "Resume Preparation" }, { icon: Zap, label: "AI-Powered Mock Interviews" },
  { icon: Users, label: "Mock Interviews by Tech and HR Panels" }, { icon: Briefcase, label: "Scheduling Interviews" },
  { icon: Globe, label: "Access to Placement Portal" }, { icon: Sparkles, label: "Mega Offline Placement Drives" },
];
const ECOM_PRODUCTS = [
  { name: "Pro Wireless ANC", cat: "Audio", price: "$89.99", rating: "4.9", tag: "Best Seller", bg: "gradient-blue-sky" },
  { name: "Smart Watch Ultra", cat: "Wearable", price: "$149.00", rating: "4.8", tag: "Trending", bg: "gradient-indigo-blue" },
  { name: "RGB Mechanical Board", cat: "Accessories", price: "$119.50", rating: "5.0", tag: "Hot", bg: "gradient-sky-cyan" },
];

const EcomSlide = () => (
  <div className="lj-slide-card">
    <div className="lj-ecom-header">
      <div className="lj-ecom-brand-wrap"><span className="lj-ecom-brand">NXT<span className="lj-text-white">STORE</span></span><span className="lj-ecom-badge">E-Commerce App</span></div>
      <div className="lj-ecom-actions"><div className="lj-ecom-search"><Search className="lj-icon-sm" /><span>Search products...</span></div><div className="lj-ecom-cart"><ShoppingCart className="lj-icon-sm" /><span>3 items</span></div></div>
    </div>
    <div className="lj-ecom-grid">
      {ECOM_PRODUCTS.map((it) => (
        <div key={it.name} className="lj-ecom-product-card">
          <div className={`lj-ecom-thumb ${it.bg}`}><span className="lj-ecom-product-tag">{it.tag}</span><div className="lj-ecom-thumb-meta"><span>{it.cat}</span><span className="lj-ecom-rating"><Star className="lj-icon-xs lj-star-icon" />{it.rating}</span></div></div>
          <div className="lj-ecom-product-name">{it.name}</div><div className="lj-ecom-product-footer"><span className="lj-ecom-price">{it.price}</span><span className="lj-ecom-add-btn">+ Add</span></div>
        </div>
      ))}
    </div>
    <div className="lj-ecom-bottom">
      <div className="lj-ecom-features"><span><Check className="lj-icon-sm" /> State Management</span><span><Check className="lj-icon-sm" /> Stripe Checkout</span></div>
      <span className="lj-ecom-preview-link">Live Preview <ExternalLink className="lj-icon-sm" /></span>
    </div>
  </div>
);

const ProjectSlide = () => (
  <div className="lj-slide-card">
    <div className="lj-proj-header"><div className="lj-proj-title"><CodeXml className="lj-icon-sm lj-sky" /><span>DevStudio / Analytics Dashboard</span></div><div className="lj-proj-badge"><span className="lj-pulse-dot" /><span>Build: Passing</span></div></div>
    <div className="lj-proj-grid">
      <div className="lj-code-window">
        <div className="lj-code-title"><span>Dashboard.jsx</span><span className="lj-code-tag">React 19</span></div>
        <p className="lj-code-pink">export default function <span className="lj-code-yellow">App</span>() &#123;</p>
        <p className="lj-code-indent lj-code-slate">const [stats, setStats] = <span className="lj-code-sky">useState</span>([]);</p>
        <p className="lj-code-indent lj-code-comment">&#47;&#47; REST API + Cloud sync</p>
        <p className="lj-code-indent lj-code-green">&lt;<span className="lj-code-cyan">AnalyticsView</span> data=&#123;stats&#125; /&gt;</p>
        <p className="lj-code-pink">&#125;</p>
      </div>
      <div className="lj-telemetry-box">
        <div>
          <div className="lj-telemetry-header"><span>Live Telemetry</span><span className="lj-latency-badge">24ms Latency</span></div>
          <div className="lj-telemetry-grid">
            <div className="lj-telemetry-stat"><div className="lj-stat-sub">Active Users</div><div className="lj-stat-val">2,480+</div></div>
            <div className="lj-telemetry-stat"><div className="lj-stat-sub">Uptime</div><div className="lj-stat-val lj-emerald">99.98%</div></div>
          </div>
        </div>
        <div className="lj-telemetry-footer"><span>Cloud Deployed</span><span className="lj-view-project-btn">View Project <ArrowRight className="lj-icon-xs" /></span></div>
      </div>
    </div>
    <div className="lj-proj-footer">
      <div className="lj-proj-tags">{["React", "CSS3", "APIs"].map((t) => (<span key={t} className="lj-proj-tag">{t}</span>))}</div>
      <span className="lj-proj-highlight">10+ Real-Time Projects</span>
    </div>
  </div>
);

const CareerSlide = () => (
  <div className="lj-slide-card">
    <div className="lj-career-header"><div className="lj-career-title"><Briefcase className="lj-icon-sm lj-sky" /><span>Candidate Career Readiness</span></div><span className="lj-ready-badge">94% Job Ready</span></div>
    <div className="lj-career-grid">
      <div className="lj-eval-box">
        <div className="lj-eval-heading">Evaluation Score</div>
        <div className="lj-score-row"><span className="lj-big-score">9.4</span><span className="lj-score-max">/ 10</span></div>
        <div className="lj-progress-bars">
          <div className="lj-progress-info"><span>DSA & Logic</span><span className="lj-progress-val">92%</span></div><div className="lj-progress-track"><div className="lj-progress-fill-sky" style={{ width: "92%" }} /></div>
          <div className="lj-progress-info"><span>Full Stack Dev</span><span className="lj-progress-val lj-blue">96%</span></div><div className="lj-progress-track"><div className="lj-progress-fill-blue" style={{ width: "96%" }} /></div>
        </div>
      </div>
      <div className="lj-interview-box">
        <div><div className="lj-interview-tag"><Clock className="lj-icon-sm" /><span>Next Scheduled Interview</span></div><div className="lj-interview-topic">Technical Mock Round with Senior SDE</div><p className="lj-interview-desc">Live Coding, Problem Solving & System Architecture Review</p></div>
        <div className="lj-interview-footer"><span className="lj-feedback-tag">Feedback: Top 5%</span><button className="lj-room-btn">Enter Interview Room</button></div>
      </div>
    </div>
    <div className="lj-career-footer"><span className="lj-career-partners"><Sparkles className="lj-icon-sm" /> 1000+ Hiring Partners</span><span className="lj-career-support">16 Months Placement Support</span></div>
  </div>
);

const SHOWCASE_SLIDES = [
  { id: "ecommerce", title: "E-Commerce", badge: "Full-Stack Storefront", url: "shopnext-store.dev", content: <EcomSlide /> },
  { id: "projects", title: "Projects", badge: "Portfolio Project", url: "dev-studio.portfolio.dev", content: <ProjectSlide /> },
  { id: "career", title: "Career", badge: "Career Hub", url: "career-readiness.nxtwave.io", content: <CareerSlide /> },
];

const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `perspective(1000px) rotateX(${((r.height / 2 - (e.clientY - r.top)) / (r.height / 2)) * 4}deg) rotateY(${(((e.clientX - r.left) - r.width / 2) / (r.width / 2)) * 4}deg) translateY(-6px)`;
  };
  return (<div ref={ref} onMouseMove={onMouseMove} onMouseLeave={() => ref.current && (ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)")} className={`lj-tilt-card ${className}`}>{children}</div>);
};

const StepBadge = ({ num, activeStep }) => (<div className={`lj-step-badge ${activeStep === num ? "active" : ""} ${activeStep > num ? "done" : ""}`}>{activeStep > num ? <Check className="lj-badge-check" /> : num}</div>);

const ShowcaseCarousel = () => {
  const [idx, setIdx] = useState(0), [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % SHOWCASE_SLIDES.length), 3800);
    return () => clearInterval(t);
  }, [paused]);
  const slide = SHOWCASE_SLIDES[idx];
  return (
    <div className="lj-showcase-card" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="lj-showcase-topbar">
        <div className="lj-window-controls">
          <div className="lj-window-dots"><div className="lj-dot dot-red" /><div className="lj-dot dot-yellow" /><div className="lj-dot dot-green" /></div>
          <span className="lj-showcase-url">{slide.url}</span>
        </div>
        <div className="lj-showcase-tabs">
          {SHOWCASE_SLIDES.map((s, i) => (<button key={s.id} type="button" onClick={() => setIdx(i)} className={`lj-tab-btn ${idx === i ? "active" : ""}`}>{s.title}</button>))}
        </div>
        <div className="lj-showcase-arrows">
          <button type="button" onClick={() => setIdx((p) => (p === 0 ? SHOWCASE_SLIDES.length - 1 : p - 1))} className="lj-arrow-btn" aria-label="Previous"><ChevronLeft className="lj-icon-sm" /></button>
          <button type="button" onClick={() => setIdx((p) => (p + 1) % SHOWCASE_SLIDES.length)} className="lj-arrow-btn" aria-label="Next"><ChevronRight className="lj-icon-sm" /></button>
        </div>
      </div>
      <div key={idx} className="lj-slide-container">{slide.content}</div>
      <div className="lj-showcase-foot">
        <div className="lj-indicators">
          {SHOWCASE_SLIDES.map((_, i) => (<button key={i} type="button" onClick={() => setIdx(i)} className={`lj-ind-dot ${idx === i ? "active" : ""}`} aria-label={`Slide ${i + 1}`} />))}
          <span className="lj-cycle-note">Auto-cycling • One after another</span>
        </div>
        <span className="lj-showcase-badge">{slide.badge}</span>
      </div>
    </div>
  );
};

export default function LearnerJourney() {
  const [activeStep, setActiveStep] = useState(1), [progress, setProgress] = useState(0);
  const s1Ref = useRef(null), s2Ref = useRef(null), s3Ref = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const { scrollY, innerHeight } = window, els = [s1Ref.current, s2Ref.current, s3Ref.current].filter(Boolean);
      if (!els.length) return;
      let step = 1;
      els.forEach((el, i) => { if (el.getBoundingClientRect().top < innerHeight * 0.55) step = i + 1; });
      setActiveStep(step);
      const top = els[0].getBoundingClientRect().top + scrollY, total = els[2].getBoundingClientRect().bottom + scrollY - top - innerHeight * 0.5;
      setProgress(Math.min(1, Math.max(0, (scrollY - top + innerHeight * 0.3) / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lj-page">
      <div className="lj-section-header">
        <h1 className="lj-main-title">Get Ready for Your <span className="lj-title-highlight">IT Career</span> in <span className="lj-blue-text">3 Steps</span></h1>
        <p className="lj-main-desc">A structured, industry-aligned path from fundamentals to placement. Scroll to explore how each stage compounds your growth.</p>
        <div className="lj-accent-line"><div className="lj-accent-bar" /><div className="lj-accent-dot-1" /><div className="lj-accent-dot-2" /></div>
      </div>

      <div className="lj-container">
        <div className="lj-sticky-sidebar">
          <div className="lj-sidebar-inner">
            <div key={activeStep} className="lj-stage-text-block">
              <div className="lj-stage-text-meta"><span className="lj-stage-text-tag">{STAGES[activeStep - 1].step}</span><span className="lj-stage-text-num">0{activeStep} / 03</span></div>
              <h2 className="lj-stage-main-title">{STAGES[activeStep - 1].pfx}<span className="lj-title-highlight">{STAGES[activeStep - 1].hl}</span></h2>
              <p className="lj-stage-desc-text">{STAGES[activeStep - 1].desc}</p>
            </div>
            <div className="lj-stage-text-steps">
              {STAGES.map((s, i) => (
                <button key={s.step} type="button" onClick={() => [s1Ref, s2Ref, s3Ref][i].current?.scrollIntoView({ behavior: "smooth", block: "center" })} className={`lj-stage-step-btn ${activeStep === i + 1 ? "active" : activeStep > i + 1 ? "done" : ""}`}>
                  <span className="lj-stage-step-bar" /><span>Stage {i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lj-steps-column">
          <div className="lj-timeline-wrapper"><div className="lj-timeline-track"><div className="lj-timeline-fill" style={{ height: `${progress * 100}%` }} /></div></div>

          {/* STEP 1 */}
          <div ref={s1Ref} className="lj-step-section">
            <StepBadge num={1} activeStep={activeStep} />
            <div className="lj-mobile-pill step-1-pill">Step 1 — Fundamentals</div>
            <div className="lj-step-header"><h2 className="lj-step-title">Fundamentals</h2><span className="lj-step-duration-badge">2 Months</span></div>
            <div className="lj-step-stack">
              <div className="lj-schedule-grid">
                {[
                  { icon: Clock, title: "Schedule", desc: "3 Hours Classes + 3 Hours Labs per day", delay: "0ms" },
                  { icon: BookOpen, title: "Milestone", desc: "Fundamentals Exam + Project Review", delay: "100ms" },
                ].map((c) => (
                  <div key={c.title} className="lj-info-card" style={{ animationDelay: c.delay }}>
                    <div className="lj-info-card-header"><c.icon className="lj-info-icon" /> {c.title}</div><p className="lj-info-card-desc">{c.desc}</p>
                  </div>
                ))}
              </div>
              <div className="lj-tech-card">
                <div className="lj-tech-card-header"><p className="lj-tech-label">Courses Include</p><span className="lj-tech-count">4 Core Tech</span></div>
                <div className="lj-tech-grid">
                  {CORE_TECH.map((v, i) => (
                    <div key={v.name} className={`lj-tech-item float-${(i % 4) + 1}`}>
                      <div className="lj-tech-letter" style={{ background: v.color }}>{v.letter}</div>
                      <div className="lj-tech-name">{v.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <ShowcaseCarousel />
            </div>
          </div>

          {/* STEP 2 */}
          <div ref={s2Ref} className="lj-step-section">
            <StepBadge num={2} activeStep={activeStep} />
            <div className="lj-mobile-pill step-2-pill">Step 2 — Choose your Job Track</div>
            <div className="lj-step-header"><h2 className="lj-step-title">Choose your Job Track</h2></div>
            <p className="lj-step-intro">After fundamentals, pick a specialization aligned to hiring demand. Each track includes live classes, mentorship, and production projects.</p>
            <div className="lj-tracks-grid">
              {JOB_TRACKS.map((t, i) => (
                <TiltCard key={t.title}>
                  <div className="lj-track-card" style={{ animationDelay: `${i * 110}ms` }}>
                    {t.popular && <div className="lj-popular-badge">Most Popular</div>}
                    <div className="lj-track-top">
                      <div><div className="lj-track-title">{t.title}</div><div className="lj-track-pills"><span className="lj-pill-duration">{t.duration}</span><span className="lj-pill-mode">{t.mode}</span></div></div>
                      <div className="lj-track-icon" style={{ background: t.accent }}><Layers className="lj-icon-sm" /></div>
                    </div>
                    <div className="lj-track-checks">
                      <div className="lj-check-row"><CircleCheck className="lj-check-icon" /><span>{t.includes}</span></div>
                      <div className="lj-check-row"><CircleCheck className="lj-check-icon" /><span>{t.projects}</span></div>
                    </div>
                    <div className="lj-track-chips">{t.stack.map((item) => (<span key={item} className="lj-tech-chip">{item}</span>))}</div>
                    <div className="lj-track-divider" />
                    <div className="lj-track-footer"><span className="lj-curriculum-label">Curriculum</span><span className="lj-explore-link">Explore track <ArrowRight className="lj-icon-xs lj-arrow-slide" /></span></div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* STEP 3 */}
          <div ref={s3Ref} className="lj-step-section lj-step-3-section">
            <StepBadge num={3} activeStep={activeStep} />
            <div className="lj-mobile-pill step-3-pill">Step 3 — Placement Assistance</div>
            <div className="lj-step-header"><h2 className="lj-step-title">Placement Assistance for Your Job</h2><span className="lj-step-3-badge">Up to 16 Months from date of joining</span></div>
            <div className="lj-placement-card">
              <div className="lj-placement-header"><p className="lj-placement-title">Free Add-ons Included</p><span className="lj-placement-count">8 Benefits</span></div>
              <div className="lj-benefits-grid">
                {PLACEMENT_BENEFITS.map((item, i) => (
                  <div key={item.label} className={`lj-benefit-item ${activeStep >= 3 ? "active" : ""}`} style={{ animationDelay: `${i * 90}ms` }}>
                    <div className="lj-benefit-icon-box"><item.icon className="lj-benefit-icon" /></div><span className="lj-benefit-label">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="lj-stats-grid">
                {[{ k: "16 Months", v: "Placement Support" }, { k: "1000+ Companies", v: "Hiring Network" }, { k: "Live + Portal", v: "Interview Access" }].map((st) => (
                  <div key={st.k} className="lj-stat-item"><div className="lj-stat-k">{st.k}</div><div className="lj-stat-v">{st.v}</div></div>
                ))}
              </div>
            </div>
            <div className="lj-drive-banner">
              <div className="lj-drive-glow" />
              <div className="lj-drive-content">
                <div><div className="lj-drive-tag">Placement Drive</div><div className="lj-drive-title">Mega Offline Drives + AI Mock Interviews</div></div><div className="lj-drive-icon-box"><Database className="lj-drive-icon" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { LearnerJourney as ElevenStages };
