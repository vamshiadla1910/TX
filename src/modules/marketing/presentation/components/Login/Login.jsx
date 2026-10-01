import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import "./Login.css";

// ==========================================
// ADMIN LOGIN DETAILS
// ==========================================
const ADMIN_EMAIL = "tanvoxadmin@gmail.com";
const ADMIN_PASSWORD = "tanvox12340";

const Login = ({
  isOpen,
  onClose,
  initialView = "login",
  onLoginSuccess,
  onSwitchView,
  onAdminLogin,
}) => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = React.useState(
    initialView === "login"
  );

  const [form, setForm] = React.useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState(false);

  const [errors, setErrors] = React.useState({});
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("");

  // ==========================================
  // RESET WHEN POPUP OPENS
  // ==========================================
  React.useEffect(() => {
    if (isOpen) {
      setIsLogin(initialView === "login");
      setErrors({});
      setMessage("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialView]);

  // If popup is not open, don't show anything
  if (!isOpen) {
    return null;
  }

  // ==========================================
  // SWITCH LOGIN / SIGNUP
  // ==========================================
  const changeView = () => {
    setIsLogin((prev) => {
      const next = !prev;

      if (onSwitchView) {
        onSwitchView(next ? "login" : "signup");
      }

      return next;
    });

    setErrors({});
    setMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ==========================================
  // VALIDATION
  // ==========================================
  const validateForm = () => {
    const newErrors = {};

    // Full name - Signup only
    if (!isLogin) {
      if (!form.full_name.trim()) {
        newErrors.full_name = "Full name is required";
      } else if (form.full_name.trim().length < 3) {
        newErrors.full_name =
          "Please enter a valid full name";
      }
    }

    // Email
    const email = form.email.trim();

    if (!email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    // Phone - Signup only
    if (!isLogin) {
      const phone = form.phone.trim();

      if (!phone) {
        newErrors.phone = "Mobile number is required";
      } else if (!/^[6-9]\d{9}$/.test(phone)) {
        newErrors.phone =
          "Please enter a valid 10-digit mobile number";
      }
    }

    // Password
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    // Confirm password - Signup only
    if (!isLogin) {
      if (!form.confirm_password) {
        newErrors.confirm_password =
          "Please confirm your password";
      } else if (
        form.password !== form.confirm_password
      ) {
        newErrors.confirm_password =
          "Passwords do not match";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // LOGIN / SIGNUP
  // ==========================================
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    // ==========================================
    // LOGIN
    // ==========================================
    if (isLogin) {
      // ========================================
      // ADMIN LOGIN
      // ========================================
      if (
        email === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isAdmin", "true");

        // Close login popup
        if (onClose) {
          onClose();
        }

        // Optional parent callback
        if (onAdminLogin) {
          onAdminLogin();
        }

        // Open Admin Dashboard
        navigate("/hackathon-dashboard");

        return;
      }

      // ========================================
      // NORMAL USER LOGIN
      // ========================================
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.removeItem("isAdmin");

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      return;
    }

    // ==========================================
    // SIGNUP
    // ==========================================
    localStorage.setItem("userEmail", email);

    setMessage(
      "Account created successfully! Please sign in."
    );

    setMessageType("success");

    setIsLogin(true);

    if (onSwitchView) {
      onSwitchView("login");
    }

    // Clear password fields
    setForm((prev) => ({
      ...prev,
      password: "",
      confirm_password: "",
    }));
  };

  // ==========================================
  // INPUT CLASS
  // ==========================================
  const getInputClass = (fieldName) =>
    errors[fieldName]
      ? "login-input-box input-error"
      : "login-input-box";

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="login-popup">

      {/* OVERLAY */}
      <div
        className="login-overlay"
        onClick={onClose}
      />

      {/* LOGIN BOX */}
      <div className="login-box">

        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="login-close"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* =====================================
            LEFT SIDE
            ===================================== */}
        <div className="login-left">

          <div className="login-left-content">

            <div className="login-brand">
              <ShieldCheck size={27} />
            </div>

            <span className="login-tagline">
              LEARN
              <span>•</span>
              GROW
              <span>•</span>
              ACHIEVE
            </span>

            <h2>
              Your learning
              <br />
              journey starts here.
            </h2>

            <p>
              Access your courses, track your progress
              and continue learning from anywhere.
            </p>

          </div>

          <div className="login-stats">

            <div className="stat">
              <strong>10K+</strong>
              <span>Learners</span>
            </div>

            <div className="stats-line" />

            <div className="stat">
              <strong>500+</strong>
              <span>Courses</span>
            </div>

            <div className="stats-line" />

            <div className="stat">
              <strong>24/7</strong>
              <span>Learning</span>
            </div>

          </div>

        </div>

        {/* =====================================
            RIGHT SIDE
            ===================================== */}
        <div
          className={`login-right ${
            isLogin ? "login-view" : "signup-view"
          }`}
        >

          {/* HEADER */}
          <div className="login-header">

            <span className="login-label">
              {isLogin
                ? "WELCOME BACK"
                : "GET STARTED"}
            </span>

            <h1>
              {isLogin
                ? "Welcome back"
                : "Create your account"}
            </h1>

            <p>
              {isLogin
                ? "Sign in to continue your learning journey."
                : "Join us and start building your future today."}
            </p>

          </div>

          {/* MESSAGE */}
          {message && (
            <div
              className={`login-message ${messageType}`}
            >
              <CheckCircle size={17} />
              <span>{message}</span>
            </div>
          )}

          {/* FORM */}
          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* =================================
                FULL NAME
                ================================= */}
            {!isLogin && (
              <div className="login-field">

                <div
                  className={getInputClass("full_name")}
                >
                  <User
                    size={18}
                    className="input-icon"
                  />

                  <input
                    type="text"
                    name="full_name"
                    placeholder="Full name"
                    value={form.full_name}
                    onChange={handleChange}
                  />
                </div>

                {errors.full_name && (
                  <small className="input-error-message">
                    {errors.full_name}
                  </small>
                )}

              </div>
            )}

            {/* =================================
                EMAIL
                ================================= */}
            <div className="login-field">

              <div
                className={getInputClass("email")}
              >
                <Mail
                  size={18}
                  className="input-icon"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              {errors.email && (
                <small className="input-error-message">
                  {errors.email}
                </small>
              )}

            </div>

            {/* =================================
                PHONE
                ================================= */}
            {!isLogin && (
              <div className="login-field">

                <div
                  className={getInputClass("phone")}
                >
                  <Phone
                    size={18}
                    className="input-icon"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={10}
                    inputMode="numeric"
                  />
                </div>

                {errors.phone && (
                  <small className="input-error-message">
                    {errors.phone}
                  </small>
                )}

              </div>
            )}

            {/* =================================
                PASSWORD
                ================================= */}
            <div className="login-field">

              <div
                className={getInputClass("password")}
              >
                <Lock
                  size={18}
                  className="input-icon"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

              {errors.password && (
                <small className="input-error-message">
                  {errors.password}
                </small>
              )}

            </div>

            {/* =================================
                CONFIRM PASSWORD
                ================================= */}
            {!isLogin && (
              <div className="login-field">

                <div
                  className={getInputClass(
                    "confirm_password"
                  )}
                >
                  <CheckCircle
                    size={18}
                    className="input-icon"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirm_password"
                    placeholder="Confirm password"
                    value={form.confirm_password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

                {errors.confirm_password && (
                  <small className="input-error-message">
                    {errors.confirm_password}
                  </small>
                )}

              </div>
            )}

            {/* =================================
                SUBMIT BUTTON
                ================================= */}
            <button
              type="submit"
              className="login-button"
            >
              <span>
                {isLogin
                  ? "Sign in"
                  : "Create account"}
              </span>

              <span className="button-arrow">
                <ArrowRight size={17} />
              </span>
            </button>

          </form>

          {/* =================================
              SWITCH LOGIN / SIGNUP
              ================================= */}
          <div className="login-switch">

            <span>
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={changeView}
            >
              {isLogin
                ? "Create account"
                : "Sign in"}
            </button>

          </div>

          {/* SECURITY */}
          <p className="login-security">
            <ShieldCheck size={14} />
            Your information is securely protected.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;