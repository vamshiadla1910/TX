import { useState, useEffect } from "react";
import txIcon from "../../../../../assets/tx-icon.jpg";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const NAV_LINKS = [
  "Programs",
  "Careers",
  "Institutions",
  "Pricing",
  "Blog",
  "Marketplace",
  "About us",
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const getNavLinkHref = (label) => {
    if (label === "Blog") return "/blog";
    if (label === "About us" || label === "About") return "/about";
    return "#";
  };

  const isLinkActive = (label) => {
    const href = getNavLinkHref(label);
    if (href === "#") return false;
    return location.pathname === href;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock page scroll while the mobile panel is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <div className="nav-container">
          <Link className="brand" to="/">
            <img src={txIcon} alt="Tx Pathwing" />
          </Link>

          <ul className="nav-links">
            {NAV_LINKS.map((label) => (
              <li key={label}>
                <Link
                  className={`nav-link${isLinkActive(label) ? " active" : ""}`}
                  to={getNavLinkHref(label)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <a className="btn-signin" href="#">
              Sign in
            </a>
          </div>

          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div
        className={`scrim${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`mobile-panel${menuOpen ? " open" : ""}`}>
        <div className="mobile-panel-head">
          <img src={txIcon} alt="Tx Pathwing" />
          <button
            className="mobile-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1D1830"
              strokeWidth="2.3"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {NAV_LINKS.map((label) => (
          <Link
            key={label}
            className={`mobile-link${isLinkActive(label) ? " active" : ""}`}
            to={getNavLinkHref(label)}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}

        <div className="mobile-actions">
          <a className="btn-signin" href="#">
            Sign in
          </a>
        </div>
      </div>
    </>
  );
}