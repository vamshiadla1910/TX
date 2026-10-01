
import { useEffect, useRef, useState } from "react";
import { ORBIT_NODES } from "./AboutData";
import txLogo from "../../../../../assets/tx-icon.jpg";

const ORBIT_CYCLE_DURATION = 8000;

export default function AboutOrbitAnimation() {
  const [progress, setProgress] = useState(0);
  const [isHired, setIsHired] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [confetti, setConfetti] = useState([]);
  const animRef = useRef(null), startTimeRef = useRef(0), prevProgressRef = useRef(0), hiredTimerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loop = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const norm = ((timestamp - startTimeRef.current) % ORBIT_CYCLE_DURATION) / ORBIT_CYCLE_DURATION;
      if (prevProgressRef.current > 0.88 && norm < 0.12) {
        setIsHired(true);
        setConfetti(Array.from({ length: 14 }, (_, idx) => ({
          x: (Math.random() - 0.5) * 160, y: (Math.random() - 0.5) * 160, r: 4 + Math.random() * 6,
          c: ["#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE", "#EFF6FF"][idx % 5], d: Math.random() * 360
        })));
        if (hiredTimerRef.current) window.clearTimeout(hiredTimerRef.current);
        hiredTimerRef.current = window.setTimeout(() => { setIsHired(false); setConfetti([]); }, 1800);
      }
      prevProgressRef.current = norm;
      setProgress(norm);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); if (hiredTimerRef.current) clearTimeout(hiredTimerRef.current); };
  }, []);

  const isMobile = windowWidth < 768, isTablet = windowWidth >= 768 && windowWidth < 1200;
  const stageSize = isMobile ? 340 : isTablet ? 410 : 490;
  const radius = Math.round(stageSize * 0.365);
  const nodeSize = isMobile ? 44 : isTablet ? 48 : 52, hubSize = isMobile ? 74 : isTablet ? 84 : 94;
  const viewBoxSize = 520, centerCoord = viewBoxSize / 2, svgRadius = 190;
  const activeNodeIdx = Math.floor(progress * ORBIT_NODES.length + 0.18);
  const headAngleRad = (-90 + progress * 360) * (Math.PI / 180);
  const headX = Math.cos(headAngleRad) * radius, headY = Math.sin(headAngleRad) * radius;
  const trailDots = [0.022, 0.045].map((offset) => {
    const angle = (-90 + ((progress - offset + 1) % 1) * 360) * (Math.PI / 180);
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });

  return (
    <div className="about-orbit-wrapper">
      <div className="about-orbit-box">
        <div className="about-orbit-stage" style={{ width: stageSize, height: stageSize }}>
          <svg className="about-orbit-svg" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
            <circle className="about-orbit-dash-bg" cx={centerCoord} cy={centerCoord} r={svgRadius} fill="none" stroke="#C7D9FF" strokeWidth="0.8" />
            <circle className="about-orbit-glow-stroke" cx={centerCoord} cy={centerCoord} r={svgRadius} fill="none" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * svgRadius} strokeDashoffset={2 * Math.PI * svgRadius * (1 - progress)} transform={`rotate(-90 ${centerCoord} ${centerCoord})`} />
          </svg>
          {ORBIT_NODES.map((item, idx) => {
            const rad = (-90 + item.angle) * (Math.PI / 180);
            const x = Math.cos(rad) * radius, y = Math.sin(rad) * radius;
            const isActive = idx <= activeNodeIdx, isCurrent = idx === activeNodeIdx;
            const pillDist = radius + (isMobile ? 32 : 42);
            const pillX = Math.cos(rad) * pillDist, pillY = Math.sin(rad) * pillDist;
            return (
              <div key={item.label} className="about-orbit-node-anchor" style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, zIndex: isActive ? 3 : 2 }}>
                <div className={`about-orbit-node-bubble ${isActive ? "is-active" : ""} ${isCurrent && isActive ? "is-current" : ""}`} style={{ width: nodeSize, height: nodeSize }}>
                  <span className="about-orbit-emoji" style={{ fontSize: isMobile ? 18 : 22, filter: isActive ? "brightness(1.08) saturate(1.05)" : "saturate(0.85) brightness(1.05)" }}>{item.emoji}</span>
                  <div className="about-orbit-node-badge" style={{ opacity: isActive ? 1 : 0, transform: isActive ? "scale(1)" : "scale(0.4)" }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                </div>
                <div className="about-orbit-pill-anchor" style={{ transform: `translate(calc(-50% + ${pillX - x}px), calc(-50% + ${pillY - y}px))`, zIndex: 4 }}>
                  <div className={`about-orbit-pill ${isActive ? "is-active" : ""}`} style={{ fontSize: isMobile ? 11 : 12 }}>{item.short}</div>
                </div>
              </div>
            );
          })}
          {trailDots.map((pos, idx) => (
            <div key={idx} className="about-orbit-trail-dot" style={{ width: idx === 0 ? 6 : 3.5, height: idx === 0 ? 6 : 3.5, transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`, opacity: idx === 0 ? 0.35 : 0.18 }} />
          ))}
          <div className="about-orbit-head-anchor" style={{ transform: `translate(calc(-50% + ${headX}px), calc(-50% + ${headY}px))`, zIndex: 10 }}>
            <div className="about-orbit-head-blur-outer" /><div className="about-orbit-head-blur-inner" /><div className="about-orbit-head-dot"><div className="about-orbit-head-spark" /></div>
          </div>
          <div className="about-orbit-center-anchor" style={{ width: hubSize, height: hubSize, animation: isHired ? "centerBounceHired 720ms cubic-bezier(0.34, 1.56, 0.64, 1)" : undefined }}>
            <div className={`about-orbit-center-card ${isHired ? "is-hired" : ""}`}><img src={txLogo} alt="TX Pathwing Logo" className="about-orbit-center-img" /></div>
            {confetti.map((p, idx) => (
              <div key={idx} className="about-orbit-confetti" style={{ width: p.r, height: p.r, backgroundColor: p.c, "--tx": `${p.x}px`, "--ty": `${p.y}px`, "--rot": `${p.d}deg`, animation: `confettiPop 900ms cubic-bezier(0.22, 1, 0.36, 1) ${idx * 28}ms forwards` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
