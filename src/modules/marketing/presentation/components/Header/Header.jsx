import { useState, useEffect } from "react";
import txIcon from "../../../../../assets/tx-icon.jpg";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const NAV_LINKS = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Events",
    path: "/events",
  },
  {
    label: "Careers",
    path: "/careers",
  },
  {
    label: "Institutions",
    path: "/institutions",
  },
  {
    label: "Pricing",
    path: "/pricing",
  },
  {
    label: "Blog",
    path: "/blog",
  },
  {
    label: "Marketplace",
    path: "/marketplace",
  },
  {
    label: "About us",
    path: "/about",
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  /* Header scroll effect */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* Prevent page scrolling when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* Check active page */
  const isActive = (path) => {
    return location.pathname === path;
  };

  /* Close mobile menu */
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* HEADER */}
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <div className="nav-container">

          {/* LOGO */}
          <Link
            className="brand"
            to="/"
            onClick={closeMenu}
          >
            <img
              src={txIcon}
              alt="Tx Pathwing"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <ul className="nav-links">
            {NAV_LINKS.map((item) => (
              <li key={item.path}>
                <Link
                  className={`nav-link${
                    isActive(item.path) ? " active" : ""
                  }`}
                  to={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* SIGN IN */}
          <div className="nav-actions">
            <Link
              className="btn-signin"
              to="/login"
            >
              Sign in
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            aria-label={
              menuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen((value) => !value)
            }
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* DARK OVERLAY */}
      <div
        className={`scrim${menuOpen ? " open" : ""}`}
        onClick={closeMenu}
      />

      {/* MOBILE MENU */}
      <div
        className={`mobile-panel${
          menuOpen ? " open" : ""
        }`}
      >

        {/* MOBILE MENU HEADER */}
        <div className="mobile-panel-head">
          <Link
            to="/"
            onClick={closeMenu}
          >
            <img
              src={txIcon}
              alt="Tx Pathwing"
            />
          </Link>

          <button
            className="mobile-close"
            aria-label="Close menu"
            onClick={closeMenu}
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

        {/* MOBILE NAVIGATION */}
        <nav className="mobile-navigation">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.path}
              className={`mobile-link${
                isActive(item.path) ? " active" : ""
              }`}
              to={item.path}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* MOBILE SIGN IN */}
        <div className="mobile-actions">
          <Link
            className="btn-signin"
            to="/login"
            onClick={closeMenu}
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}