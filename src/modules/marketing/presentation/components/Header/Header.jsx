import { useState, useEffect } from "react";
import txIcon from "../../../../../assets/tx-icon.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { ChevronDown, ShoppingCart } from "lucide-react";

const NAV_LINKS = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "About us",
    path: "/about",
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
    label: "Explore",
    path: "/marketplace",
  },
  {
    label: "Blog",
    path: "/blog",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];

const MORE_LINKS = [
  { label: "Learner journey", path: "/learner-journey" },
  { label: "For students", path: "/for-students" },
  { label: "Pricing", path: "/pricing" },
  { label: "FAQ", path: "/faq" },
  { label: "For institutions", path: "/for-institutions" },
  { label: "Industry partners", path: "/industry-partners" },
  { label: "For instructors", path: "/for-instructors" },
  { label: "Institution dashboard", path: "/institution-dashboard" },
];

function readCartCount() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(savedCart) ? savedCart.length : 0;
  } catch {
    return 0;
  }
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(readCartCount);
  const [isInstitutionLoggedIn, setIsInstitutionLoggedIn] = useState(
    () => localStorage.getItem("institutionLoggedIn") === "true"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("isAdmin") === "true"
  );

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
      setIsInstitutionLoggedIn(localStorage.getItem("institutionLoggedIn") === "true");
    };
    window.addEventListener("authChanged", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("authChanged", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const updateCartCount = () => setCartCount(readCartCount());

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    window.addEventListener(
      "storage",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openLogin = () => {
    closeMenu();
    navigate("/institution-signin");
  };

  return (
    <>
      <header
        className={`header${
          scrolled ? " scrolled" : ""
        }`}
      >
        <div className="nav-container">

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

          <ul className="nav-links">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  className={`nav-link${
                    isActive(item.path)
                      ? " active"
                      : ""
                  }`}
                  to={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="nav-more">
              <details>
                <summary className="nav-link">More <ChevronDown size={13} aria-hidden="true" /></summary>
                <div className="nav-more-menu">
                  {MORE_LINKS.map((item) => (
                    <Link key={item.path} to={item.path} onClick={(event) => { event.currentTarget.closest("details").open = false; }}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            </li>
          </ul>

          <div className="nav-actions">

            <Link
              to="/cart"
              className="header-cart"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart
                className="header-cart-icon"
                size={25}
                strokeWidth={2.2}
              />

              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {isInstitutionLoggedIn ? (
              <Link to="/institution-dashboard" className="btn-signin">
                Institution dashboard
              </Link>
            ) : isLoggedIn ? (
              <Link
                to={isAdmin ? "/hackathon-dashboard" : "/dashboard"}
                className="btn-signin"
              >
                {isAdmin ? "Admin Portal" : "Dashboard"}
              </Link>
            ) : (
              <button
                type="button"
                className="btn-signin"
                onClick={openLogin}
              >
                Sign in
              </button>
            )}

          </div>

          <div className="mobile-header-actions">
            <Link
              to="/cart"
              className="header-cart header-cart-mobile"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart
                className="header-cart-icon"
                size={22}
                strokeWidth={2.2}
              />

              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            <button
              className={`hamburger${
                menuOpen ? " open" : ""
              }`}
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

        </div>
      </header>

      <div
        className={`scrim${
          menuOpen ? " open" : ""
        }`}
        onClick={closeMenu}
      />

      <div
        className={`mobile-panel${
          menuOpen ? " open" : ""
        }`}
      >
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

        <nav className="mobile-navigation">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              className={`mobile-link${
                isActive(item.path)
                  ? " active"
                  : ""
              }`}
              to={item.path}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          {MORE_LINKS.map((item) => (
            <Link
              key={item.path}
              className={`mobile-link${isActive(item.path) ? " active" : ""}`}
              to={item.path}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className={`mobile-link${isActive("/cart") ? " active" : ""}`}
            to="/cart"
            onClick={closeMenu}
          >
            Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </Link>
        </nav>

        <div className="mobile-actions">
          {isInstitutionLoggedIn ? (
            <Link
              to="/institution-dashboard"
              className="btn-signin"
              onClick={closeMenu}
            >
              Institution dashboard
            </Link>
          ) : isLoggedIn ? (
            <Link
              to={isAdmin ? "/hackathon-dashboard" : "/dashboard"}
              className="btn-signin"
              onClick={closeMenu}
            >
              {isAdmin ? "Admin Portal" : " Dashboard"}
            </Link>
          ) : (
            <button
              type="button"
              className="btn-signin"
              onClick={openLogin}
            >
              Sign in
            </button>
          )}
        </div>
      </div>

    </>
  );
}