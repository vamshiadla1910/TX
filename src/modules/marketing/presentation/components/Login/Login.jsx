import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
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
  AlertCircle,
  GraduationCap,
  Users,
  Building2,
} from "lucide-react";
import {
  ROLE_CONFIGS,
  verifyCredentials,
  normalizeRole,
  getRoleDisplayName,
  registerCustomUser,
  setAuthenticatedSession,
} from "../../../services/authService";

import "./Login.css";

// ==========================================
// ADMIN LOGIN DETAILS
// ==========================================
const ADMIN_EMAIL = "tanvoxadmin@gmail.com";
const ADMIN_PASSWORD = "tanvox12340";
const ROLE_ICON_MAP = {
  student: GraduationCap,
  admin: ShieldCheck,
  instructor: Users,
  institution: Building2,
};



const Login = ({
  isOpen = true,
  selectedRole = "student",
  onClose,
  onBack,
  initialView = "login",
  onLoginSuccess,
  onSwitchView,
  onAdminLogin,
}) => {
  const navigate = useNavigate();

  const roleConfig = ROLE_CONFIGS[selectedRole] || ROLE_CONFIGS.student;
  const RoleIcon = ROLE_ICON_MAP[roleConfig.key] || ShieldCheck;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  const [isLogin, setIsLogin] = React.useState(initialView === "login");

  const [form, setForm] = React.useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [errors, setErrors] = React.useState({});
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("");

  // ==========================================
  // AUTO-REDIRECT IF ALREADY AUTHENTICATED
  // ==========================================
  React.useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (isLoggedIn && !onClose) {
      if (isAdmin) {
        navigate("/hackathon-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate, onClose]);

  // ==========================================
  // RESET WHEN POPUP OPENS

  // RESET WHEN POPUP OPENS OR ROLE CHANGE
  // ==========================================
  React.useEffect(() => {
    if (isOpen) {
      setIsLogin(initialView === "login");
      setErrors({});
      setMessage("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialView, selectedRole]);

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
      general: "",
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
        newErrors.full_name = "Please enter a valid full name";
      }
    }

    // Email
    const email = form.email.trim();
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone - Signup only
    if (!isLogin) {
      const phone = form.phone.trim();
      if (!phone) {
        newErrors.phone = "Mobile number is required";
      } else if (!/^[6-9]\d{9}$/.test(phone)) {
        newErrors.phone = "Please enter a valid 10-digit mobile number";
      }
    }

    // Password - In student login, any password is valid; for others or signup, require >= 6 chars
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (isLogin && selectedRole === "student") {
      // In student sign-in, any password is valid
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password - Signup only
    if (!isLogin) {
      if (!form.confirm_password) {
        newErrors.confirm_password = "Please confirm your password";
      } else if (form.password !== form.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // LOGIN / SIGNUP SUBMISSION
  // ==========================================
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    // ==========================================
    // LOGIN FLOW
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

        window.dispatchEvent(new Event("authChanged"));
        window.dispatchEvent(new Event("storage"));

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
      // 1. Verify credentials passing the active selectedRole
      // Student login accepts any email and any password!
      const authResult = verifyCredentials(email, password, selectedRole);

      if (!authResult.success) {
        setErrors({
          general:
            authResult.error ||
            "Invalid email or password. Please verify your credentials.",
        });
        return;
      }

      const authenticatedUser = authResult.user;

      // 2. Verify authenticated user's actual role and compare with selected dashboard
      const normalizedUserRole = normalizeRole(authenticatedUser.role);
      const normalizedSelectedRole = normalizeRole(selectedRole);

      // Enforce role comparison: Allow access only when both roles match
      if (normalizedUserRole !== normalizedSelectedRole) {
        const actualRoleName = getRoleDisplayName(normalizedUserRole);
        const selectedDashboardName = roleConfig.displayName;
        setErrors({
          general: `Role mismatch: This account has the role of ${actualRoleName}, but you are attempting to log in to ${selectedDashboardName}. Please return to dashboard selection and choose ${actualRoleName} Dashboard.`,
        });
        return;
      }

      // 3. Roles match! Set active session and dispatch events
      setAuthenticatedSession(authenticatedUser);

      if (onClose) onClose();
      if (onLoginSuccess) onLoginSuccess();
      if (onAdminLogin && normalizedUserRole === "admin") onAdminLogin();

      if (onClose) {
        onClose();
      }

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Open Student Dashboard
      navigate("/dashboard");
      // 1. Verify credentials passing the active selectedRole
      // Student login accepts any email and any password!
      const authResult = verifyCredentials(email, password, selectedRole);

      if (!authResult.success) {
        setErrors({
          general:
            authResult.error ||
            "Invalid email or password. Please verify your credentials.",
        });
        return;
      }

      const authenticatedUser = authResult.user;

      // 2. Verify authenticated user's actual role and compare with selected dashboard
      const normalizedUserRole = normalizeRole(authenticatedUser.role);
      const normalizedSelectedRole = normalizeRole(selectedRole);

      // Enforce role comparison: Allow access only when both roles match
      if (normalizedUserRole !== normalizedSelectedRole) {
        const actualRoleName = getRoleDisplayName(normalizedUserRole);
        const selectedDashboardName = roleConfig.displayName;
        setErrors({
          general: `Role mismatch: This account has the role of ${actualRoleName}, but you are attempting to log in to ${selectedDashboardName}. Please return to dashboard selection and choose ${actualRoleName} Dashboard.`,
        });
        return;
      }

      // 3. Roles match! Set active session and dispatch events
      setAuthenticatedSession(authenticatedUser);

      if (onClose) onClose();
      if (onLoginSuccess) onLoginSuccess();
      if (onAdminLogin && normalizedUserRole === "admin") onAdminLogin();

      // 4. Redirect to authorized dashboard
      const targetRoute =
        roleConfig.route ||
        authenticatedUser.targetDashboard ||
        "/dashboard";


      // 4. Redirect to authorized dashboard
      const targetRoute =
        roleConfig.route ||
        authenticatedUser.targetDashboard ||
        "/dashboard";


      navigate(targetRoute);
      return;
    }

    // ==========================================
    // SIGNUP FLOW
    // ==========================================
    registerCustomUser({
      email,
      password: form.password,
      full_name: form.full_name,
      phone: form.phone,
      role: selectedRole,
    });

    localStorage.setItem("userName", form.full_name.trim());
    localStorage.setItem("userEmail", email);
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("storage"));

    setMessage(
      "Account created successfully! Please sign in with your credentials."
    );
    setMessageType("success");
    setIsLogin(true);

    if (onSwitchView) {
      onSwitchView("login");
    }

    // Reset password fields
    setForm((prev) => ({
      ...prev,
      password: "",
      confirm_password: "",
    }));
  };

  // Helper for input error styling
  const getInputClass = (fieldName) =>
    errors[fieldName] ? "login-input-box input-error" : "login-input-box";

  return (
    <div className="login-popup" role="dialog" aria-modal="true">
      {/* OVERLAY */}
      <div className="login-overlay" onClick={handleClose} />

      {/* LOGIN BOX */}
      <div className="login-box">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="login-close"
          onClick={handleClose}
          aria-label="Close login dialog"
        >
          <X size={20} />
        </button>

        {/* =====================================
            LEFT SIDE (STRICTLY PRESERVED)
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
            RIGHT SIDE (STRICTLY PRESERVED + DYNAMIC)
            ===================================== */}
        <div
          className={`login-right ${
            isLogin ? "login-view" : "signup-view"
          }`}
        >
          {/* BACK BUTTON TO RETURN TO DASHBOARD SELECTION */}
          {onBack && (
            <button
              type="button"
              className="login-back-button"
              onClick={onBack}
              title="Return to dashboard selection"
            >
              <ArrowLeft size={14} />
              <span>Back to Dashboard Selection</span>
            </button>
          )}

          {/* HEADER */}
          <div className="login-header">
            {/* Dynamic Role Indicator Badge */}
            <div
              className="login-role-pill"
              style={{
                color: roleConfig.color,
                background: roleConfig.bgTint,
                border: `1px solid ${roleConfig.borderTint}`,
              }}
            >
              <RoleIcon size={13} style={{ color: roleConfig.color }} />
              <span>{roleConfig.displayName}</span>
            </div>

            <span className="login-label">
              {isLogin ? roleConfig.welcomeLabel : "GET STARTED"}
            </span>

            <h1>
              {isLogin ? roleConfig.welcomeHeading : "Create your account"}
            </h1>

            <p>
              {isLogin
                ? "Sign in to continue your learning journey."
                ? roleConfig.subtitle
                : "Join us and start building your future today."}
            </p>

          </div>

          {/* GENERAL ERROR OR SUCCESS MESSAGE */}
          {errors.general && (
            <div className="login-message error">
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span>{errors.general}</span>
            </div>
          )}

          {message && (
            <div className={`login-message ${messageType}`}>
              <CheckCircle size={17} style={{ flexShrink: 0 }} />
              <span>{message}</span>
            </div>
          )}

          {/* FORM */}
          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* FULL NAME - Signup only */}
            {!isLogin && (
              <div className="login-field">
                <div className={getInputClass("full_name")}>
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Full name (e.g. Aditya Reddy)"
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

            {/* EMAIL */}
            <div className="login-field">
              <div className={getInputClass("email")}>
                <Mail size={18} className="input-icon" />
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

            {/* PHONE - Signup only */}
            {!isLogin && (
              <div className="login-field">
                <div className={getInputClass("phone")}>
                  <Phone size={18} className="input-icon" />
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

            {/* PASSWORD */}
            <div className="login-field">
              <div className={getInputClass("password")}>
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
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

            {/* CONFIRM PASSWORD - Signup only */}
            {!isLogin && (
              <div className="login-field">
                <div className={getInputClass("confirm_password")}>
                  <CheckCircle size={18} className="input-icon" />
                  <input
                    type={
                      showConfirmPassword ? "text" : "password"
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
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
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

            {/* SUBMIT BUTTON */}
            <button type="submit" className="login-button">
              <span>{isLogin ? "Sign in" : "Create account"}</span>
              <span className="button-arrow">
                <ArrowRight size={17} />
              </span>
            </button>
          </form>

          {/* SWITCH LOGIN / SIGNUP */}
          <div className="login-switch">
            <span>
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <button type="button" onClick={changeView}>
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </div>

          {isLogin && (
            <Link
              className="institution-login-link"
              to="/institution-signin"
              onClick={onClose}
            >
              Institution administrator? Sign in to your campus
            </Link>
          )}

          {/* SECURITY */}
          {/* SECURITY NOTE */}

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
