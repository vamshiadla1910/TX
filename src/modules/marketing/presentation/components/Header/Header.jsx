import { useState, useEffect } from "react";
import txIcon from "../../../../../assets/tx-icon.jpg";
import { Link, useLocation } from "react-router-dom";
import Login from "../Login/Login";
import "./Header.css";
import { ShoppingCart } from "lucide-react";

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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("isAdmin") === "true"
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("userRole") || ""
  );

  const location = useLocation();

  const checkAuth = () => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
    setUserRole(localStorage.getItem("userRole") || "");
  };

  const getDashboardDestination = () => {
    const isPlatformAdmin = localStorage.getItem("isPlatformAdmin") === "true";
    if (userRole === "platform_admin" || isPlatformAdmin) {
      return "/admin-dashboard";
    }
    if (userRole === "instructor") {
      return "/instructor-dashboard";
    }
    if (userRole === "hackathon_admin" || isAdmin) {
      return "/hackathon-dashboard";
    }
    return "/dashboard";
  };

  const getDashboardText = () => {
    const isPlatformAdmin = localStorage.getItem("isPlatformAdmin") === "true";
    if (userRole === "platform_admin" || isPlatformAdmin) {
      return "Admin Console";
    }
    if (userRole === "instructor") {
      return "Instructor Portal";
    }
    if (userRole === "hackathon_admin" || isAdmin) {
      return "Hackathon Portal";
    }
    return "Dashboard";
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("authChanged", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("authChanged", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, [location.pathname]);

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

  const updateCartCount = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      setCartCount(
        Array.isArray(savedCart)
          ? savedCart.length
          : 0
      );
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

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

  useEffect(() => {
    updateCartCount();
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openLogin = () => {
    closeMenu();
    setLoginOpen(true);
  };

  const closeLogin = () => {
    setLoginOpen(false);
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

            {isLoggedIn ? (
              <Link
                to={getDashboardDestination()}
                className="btn-signin"
              >
                {getDashboardText()}
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
          <Link
            className={`mobile-link${isActive("/cart") ? " active" : ""}`}
            to="/cart"
            onClick={closeMenu}
          >
            Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </Link>
        </nav>

        <div className="mobile-actions">
          {isLoggedIn ? (
            <Link
              to={getDashboardDestination()}
              className="btn-signin"
              onClick={closeMenu}
            >
              {getDashboardText()}
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

      <Login
        isOpen={loginOpen}
        onClose={closeLogin}
      />
    </>
  );
}