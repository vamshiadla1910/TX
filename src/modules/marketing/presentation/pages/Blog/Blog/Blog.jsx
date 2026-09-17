import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  X,
  CheckCircle2,
  Calendar,
  Eye,
} from "lucide-react";
import BlogHero from "./BlogHero";
import BlogOverview from "./BlogOverview";
import BlogStories from "./BlogStories";
import BlogCTA from "./BlogCTA";
import BlogArticles from "./BlogArticles";
import BlogNewsletter from "./BlogNewsletter";
import BlogWriteForUs from "./BlogWriteForUs";
import "./Blog.css";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="tx-blog-page">
      {/* ───────────────────────────────────────────────────────
          1. HERO SECTION
      ──────────────────────────────────────────────────────── */}
      <BlogHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ───────────────────────────────────────────────────────
          2. ABOUT & OFFERINGS OVERVIEW SECTION
      ──────────────────────────────────────────────────────── */}
      <BlogOverview />

      {/* ───────────────────────────────────────────────────────
          3. SUCCESS STORIES ("Stories That Inspire")
      ──────────────────────────────────────────────────────── */}
      <BlogStories />

      {/* ───────────────────────────────────────────────────────
          4. REGISTRATION CALL TO ACTION BANNER
      ──────────────────────────────────────────────────────── */}
      <BlogCTA />

      {/* ───────────────────────────────────────────────────────
          5. LATEST CURATED BLOG ARTICLES (4 Cards)
      ──────────────────────────────────────────────────────── */}
      <BlogArticles onSelectArticle={setSelectedArticle} />

      {/* ───────────────────────────────────────────────────────
          6. NEWSLETTER SUBSCRIPTION ("Stay Updated")
      ──────────────────────────────────────────────────────── */}
      <BlogNewsletter />

      {/* ───────────────────────────────────────────────────────
          7. WRITE FOR US BANNER ("Share Your Knowledge")
      ──────────────────────────────────────────────────────── */}
      <BlogWriteForUs />

      {/* ───────────────────────────────────────────────────────
          INTERACTIVE FULL ARTICLE MODAL
      ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedArticle && (
          <div
            className="tx-modal-backdrop"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="tx-modal-window"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="tx-modal-header">
                <div className="tx-modal-badge-row">
                  <span className="tx-category-badge">
                    {selectedArticle.category || selectedArticle.tag}
                  </span>
                  <span className="tx-readtime-badge">
                    <Clock size={12} /> {selectedArticle.readTime}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="tx-modal-close-btn"
                  title="Close article"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="tx-modal-body">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="tx-modal-featured-img"
                />

                <h1 className="tx-modal-title">{selectedArticle.title}</h1>

                <div className="tx-modal-meta-row">
                  <div className="tx-author-info">
                    <div className="tx-author-avatar">TX</div>
                    <div>
                      <div className="tx-author-name">
                        {selectedArticle.author}
                      </div>
                      <div className="tx-author-role">
                        {selectedArticle.authorRole}
                      </div>
                    </div>
                  </div>
                  <div className="tx-meta-date">
                    <Calendar size={14} /> {selectedArticle.date}
                    <span className="tx-meta-dot">•</span>
                    <Eye size={14} /> {selectedArticle.views}
                  </div>
                </div>

                {selectedArticle.keyTakeaways && (
                  <div className="tx-modal-takeaways-card">
                    <h4>
                      <CheckCircle2 size={18} className="text-green" />
                      <span>Key Takeaways for Students</span>
                    </h4>
                    <ul>
                      {selectedArticle.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx}>{takeaway}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="tx-modal-article-text">
                  {selectedArticle.content.split("\n\n").map((para, idx) => {
                    const trimmed = para.trim();
                    if (trimmed.startsWith("### ")) {
                      return <h3 key={idx}>{trimmed.replace("### ", "")}</h3>;
                    }
                    if (trimmed.startsWith("#### ")) {
                      return <h4 key={idx}>{trimmed.replace("#### ", "")}</h4>;
                    }
                    if (trimmed.startsWith("---")) {
                      return <hr key={idx} className="tx-modal-hr" />;
                    }
                    return <p key={idx}>{trimmed}</p>;
                  })}
                </div>

                {selectedArticle.tags && (
                  <div className="tx-modal-tags-row">
                    <strong>Related Topics:</strong>
                    {selectedArticle.tags.map((t, i) => (
                      <span key={i} className="tx-tag-pill">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="tx-modal-footer-cta">
                  <div>
                    <h4>Accelerate Your Skills with TX-Path-Wing</h4>
                    <p>
                      Enroll in courses or apply for verified internship batches today.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="tx-btn-primary"
                  >
                    Close & Explore More
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
