import { useState } from "react";
import { Mail, Check } from "lucide-react";
import "./BlogNewsletter.css";

const BlogNewsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3500);
    }
  };

  return (
    <section className="tx-newsletter-section">
      <div className="tx-newsletter-container">
        <div className="tx-newsletter-card">
          <div className="tx-newsletter-left">
            <div className="tx-newsletter-icon-wrap">
              <div className="tx-mail-icon-circle">
                <Mail size={26} className="tx-mail-icon" />
                {/* 3 Radiating burst lines at top-right */}
                <svg
                  className="tx-mail-burst-svg"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="6"
                    y1="22"
                    x2="2"
                    y2="14"
                    stroke="#0066ff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="14"
                    y1="18"
                    x2="14"
                    y2="6"
                    stroke="#0066ff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="20"
                    y1="22"
                    x2="26"
                    y2="14"
                    stroke="#0066ff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="tx-newsletter-info">
              <div className="tx-section-tagline">
                <span className="tx-tagline-label tx-sub-tagline">STAY UPDATED</span>
              </div>
              <h3 className="tx-newsletter-title">
                Get the Latest Articles in Your Inbox
              </h3>
              <p className="tx-newsletter-desc">
                Join our community and never miss new blogs, career tips, and learning resources.
              </p>
            </div>
          </div>

          <div className="tx-newsletter-right">
            {subscribed ? (
              <div className="tx-newsletter-success">
                <span className="tx-success-badge">
                  <Check size={16} />
                </span>
                <p>You’re subscribed! Check your inbox soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="tx-newsletter-form">
                <div className="tx-newsletter-input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="tx-newsletter-input"
                    required
                  />
                  <button type="submit" className="tx-newsletter-submit-btn">
                    Subscribe
                  </button>
                </div>
                <span className="tx-newsletter-privacy">
                  No spam. Unsubscribe anytime.
                </span>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogNewsletter;
