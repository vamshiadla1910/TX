import React from "react";
import {
  Video,
  Building2,
  MonitorSmartphone,
} from "lucide-react";

import "./Modes.css";

const benefits = [
  {
    icon: Video,
    title: "Live",
    description:  "Join instructor-led sessions from anywhere with real-time interaction, discussion and guided learning.",
    className: "benefit-live",
  },
  {
    icon: Building2,
    title: "On-Site",
    description: "Learn face-to-face with instructors and peers in a focused, structured classroom environment.",
    className: "benefit-tests",
  },
  
  {
    icon: MonitorSmartphone,
    title: "Hybrid",
    description: "Combine classroom learning with online sessions for a flexible experience without losing instructor connection.",
    className: "benefit-centres",
  },
];

const Mode = () => {
  return (
    <section className="benefits-strip">
      <div className="Mode-Header"><span>Modes We Train</span></div>
      <div className="benefits-container">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
          <>
            
            <React.Fragment key={benefit.title}>
              <div className={`benefit-item ${benefit.className}`}>
                <div className="benefit-icon">
                  <Icon size={48} strokeWidth={2} />
                </div>

                <h3>{benefit.title}</h3>

                <p>{benefit.description}</p>
              </div>

              {index < benefits.length - 1 && (
                <div className="benefit-divider" />
              )}
            </React.Fragment>
            </>
          );
        })}
      </div>
    </section>
  );
};

export default Mode;