import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import "./BlogStories.css";

const STORIES = [
  {
    id: 1,
    name: "Nagaraju .K",
    role: "Full Stack Developer",
    initials: "NK",
    quote:
      "TX-Path-Wing helped me gain practical skills and confidence. The training and guidance were exactly what I needed.",
    theme: "theme-blue",
  },
  {
    id: 2,
    name: "Vishnu .B",
    role: "Software Developer (Placed)",
    initials: "VB",
    quote:
      "The internship program gave me real industry exposure and helped me get placed in a great company.",
    theme: "theme-green",
  },
  {
    id: 3,
    name: "Abhilash Reddy",
    role: "Cloud Solutions Engineer",
    initials: "AR",
    quote:
      "Hands-on practice in cloud virtual labs and mentor reviews gave me the exact skills tech recruiters were evaluating.",
    theme: "theme-purple",
  },
  {
    id: 4,
    name: "Vasavi",
    role: "B.Tech Student",
    initials: "VS",
    quote:
      "The mentors are very supportive and the learning experience is amazing. I highly recommend TX-Path-Wing to every student.",
    theme: "theme-pink",
  },
  {
    id: 5,
    name: "Hima Teja",
    role: "Data Science Trainee",
    initials: "HT",
    quote:
      "Working on live projects alongside industry mentors helped me bridge the gap between college theory and real tech jobs.",
    theme: "theme-amber",
  },
  {
    id: 6,
    name: "Srinu",
    role: "Associate Software Engineer",
    initials: "SR",
    quote:
      "Structured learning pathways and prompt code reviews made all the difference in cracking my tech placement.",
    theme: "theme-blue",
  },
];

const BlogStories = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? STORIES.length - 3 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= STORIES.length - 3 ? 0 : prev + 1));
  };

  const visibleStories = STORIES.slice(startIndex, startIndex + 3);

  return (
    <section className="tx-stories-section">
      <div className="tx-stories-container">
        <div className="tx-stories-header">
          <div>
            <div className="tx-section-tagline">
              <span className="tx-tagline-bar" />
              <span className="tx-tagline-label">SUCCESS STORIES</span>
            </div>
            <h2 className="tx-stories-title">Stories That Inspire</h2>
            <p className="tx-stories-subtitle">
              Real experiences from students, educators, and industry professionals who are growing with TX-Path-Wing.
            </p>
          </div>

          <div className="tx-stories-arrows">
            <button
              type="button"
              onClick={handlePrev}
              className="tx-stories-arrow-btn"
              aria-label="Previous stories"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="tx-stories-arrow-btn"
              aria-label="Next stories"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="tx-stories-grid">
          {visibleStories.map((story) => (
            <div key={story.id} className={`tx-story-card ${story.theme}`}>
              <div className="tx-story-quote-icon">
                <Quote size={26} />
              </div>

              <div className="tx-story-content-wrap">
                {/* Profile Pic Logo UI (Initials Avatar) */}
                <div className={`tx-story-avatar-ui ${story.theme}`}>
                  <span>{story.initials}</span>
                </div>

                <div className="tx-story-text-group">
                  <p className="tx-story-quote">"{story.quote}"</p>
                  <div className="tx-story-author">
                    <h4 className="tx-story-name">{story.name}</h4>
                    <span className="tx-story-role">{story.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogStories;
