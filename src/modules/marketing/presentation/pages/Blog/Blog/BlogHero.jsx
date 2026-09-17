import { motion } from "framer-motion";
import {
  Search,
  X,
  FileText,
  Users,
  GraduationCap,
  Star,
  BookOpen,
  Code2,
  Lightbulb,
} from "lucide-react";
import blogHeroBg from "../../../../../../assets/BlogHero.png";
import "./BlogHero.css";

function ChartTrendingIcon({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="6" />
      <polyline points="7 12 12 8 18 4" />
      <polyline points="14 4 18 4 18 8" />
    </svg>
  );
}

const POPULAR_TOPICS = [
  "Career",
  "Internships",
  "Skills",
  "Placements",
  "Industry",
  "Hackathons",
];

const FEATURE_BADGES = [
  {
    icon: BookOpen,
    line1: "Learn",
    line2: "New Skills",
  },
  {
    icon: Code2,
    line1: "Explore",
    line2: "Internships",
  },
  {
    icon: ChartTrendingIcon,
    line1: "Industry",
    line2: "Insights",
  },
  {
    icon: Lightbulb,
    line1: "Be",
    line2: "Job Ready",
  },
];

const BlogHero = ({ searchQuery, setSearchQuery }) => {
  const handleTopicClick = (topic) => {
    if (searchQuery.toLowerCase() === topic.toLowerCase()) {
      setSearchQuery("");
    } else {
      setSearchQuery(topic);
    }
  };

  return (
    <section
      className="tx-blog-hero-section"
      style={{ backgroundImage: `url(${blogHeroBg})` }}
    >
      <div className="tx-blog-hero-container">
        <div className="tx-blog-hero-content">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="tx-blog-hero-tagline"
          >
            <span className="tx-tagline-bar" />
            <span className="tx-tagline-text">Discover &nbsp;|&nbsp; Learn &nbsp;|&nbsp; Grow</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="tx-blog-hero-title"
          >
            Insights for a <br />
            <span className="tx-blog-hero-title-highlight">Brighter Future</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="tx-blog-hero-description"
          >
            Explore articles, guides, and real stories on technology, career growth,
            internships, training, and more — written for B.Tech &amp; Degree students,
            educators, and industry professionals.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="tx-blog-hero-search-wrap"
          >
            <form onSubmit={(e) => e.preventDefault()} className="tx-blog-hero-search-form">
              <Search size={18} className="tx-blog-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics or keywords..."
                className="tx-blog-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="tx-blog-search-clear"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <button type="submit" className="tx-blog-search-btn">
                <span>Search</span>
              </button>
            </form>
          </motion.div>

          {/* Popular Topics */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="tx-blog-hero-topics"
          >
            <span className="tx-topics-label">POPULAR TOPICS</span>
            <div className="tx-topics-list">
              {POPULAR_TOPICS.map((topic) => {
                const isActive = searchQuery.toLowerCase() === topic.toLowerCase();
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicClick(topic)}
                    className={`tx-topic-pill ${isActive ? "active" : ""}`}
                  >
                    #{topic}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Metrics Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="tx-blog-hero-stats"
          >
            <div className="tx-stat-item">
              <div className="tx-stat-icon-wrap">
                <FileText size={20} className="tx-stat-icon" />
              </div>
              <div className="tx-stat-info">
                <span className="tx-stat-value">500+</span>
                <span className="tx-stat-label">Articles &amp; Guides</span>
              </div>
            </div>

            <div className="tx-stat-divider" />

            <div className="tx-stat-item">
              <div className="tx-stat-icon-wrap">
                <Users size={20} className="tx-stat-icon" />
              </div>
              <div className="tx-stat-info">
                <span className="tx-stat-value">50K+</span>
                <span className="tx-stat-label">Student Readers</span>
              </div>
            </div>

            <div className="tx-stat-divider" />

            <div className="tx-stat-item">
              <div className="tx-stat-icon-wrap">
                <GraduationCap size={20} className="tx-stat-icon" />
              </div>
              <div className="tx-stat-info">
                <span className="tx-stat-value">100+</span>
                <span className="tx-stat-label">Industry Contributors</span>
              </div>
            </div>

            <div className="tx-stat-divider" />

            <div className="tx-stat-item">
              <div className="tx-stat-icon-wrap">
                <Star size={20} className="tx-stat-icon" />
              </div>
              <div className="tx-stat-info">
                <span className="tx-stat-value">4.8/5</span>
                <span className="tx-stat-label">Reader Satisfaction</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Floating Feature Cards */}
      <div className="tx-blog-hero-features">
        {FEATURE_BADGES.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.line2}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + idx * 0.08 }}
              className="tx-hero-feature-card"
            >
              <Icon size={20} className="tx-feature-card-icon" />
              <div className="tx-feature-card-text">
                <span>{badge.line1}</span>
                <span>{badge.line2}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default BlogHero;
