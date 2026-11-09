import { useState } from "react";
import { ArrowRight, Building2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./InstitutionSignIn.css";

const DEMO_INSTITUTION = {
  email: "ksrinivas@kitsw.ac.in",
  password: "KITS2026!"
};

export default function InstitutionSignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [demoFilled, setDemoFilled] = useState(false);

  if (localStorage.getItem("institutionLoggedIn") === "true") {
    return <Navigate to="/institution-dashboard" replace />;
  }

  function useDemoAccount() {
    setEmail(DEMO_INSTITUTION.email);
    setPassword(DEMO_INSTITUTION.password);
    setDemoFilled(true);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (email.trim().toLowerCase() !== DEMO_INSTITUTION.email || password !== DEMO_INSTITUTION.password) {
      setError("The institution email or password is incorrect.");
      return;
    }

    localStorage.setItem("institutionLoggedIn", "true");
    localStorage.setItem("institutionEmail", DEMO_INSTITUTION.email);
    localStorage.setItem("institutionName", "KITS Warangal");
    navigate("/institution-dashboard", { replace: true });
  }

  return (
    <main className="institution-signin-page">
      <section className="institution-signin-shell">
        <div className="institution-signin-aside">
          <div className="institution-signin-brand"><span>///</span> Pathwing</div>
          <div className="institution-signin-aside-copy">
            <span className="institution-signin-eyebrow">INSTITUTION PORTAL</span>
            <h1>One view of your campus learning.</h1>
            <p>Manage learner progress, programmes, events, and institutional reporting from your workspace.</p>
          </div>
          <div className="institution-signin-aside-foot"><ShieldCheck size={16} /> Institution administrator access</div>
        </div>

        <div className="institution-signin-content">
          <Link className="institution-signin-back" to="/">Back to website</Link>
          <div className="institution-signin-icon"><Building2 size={21} /></div>
          <span className="institution-signin-eyebrow">KITS WARANGAL</span>
          <h2>Sign in to your institution</h2>
          <p className="institution-signin-description">Use your institution administrator credentials to open the campus dashboard.</p>

          <form className="institution-signin-form" onSubmit={handleSubmit}>
            <label htmlFor="institution-email">Institution email</label>
            <div className="institution-signin-input"><Mail size={17} /><input id="institution-email" type="email" autoComplete="username" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); setDemoFilled(false); }} placeholder="admin@institution.edu" required /></div>
            <label htmlFor="institution-password">Password</label>
            <div className="institution-signin-input"><LockKeyhole size={17} /><input id="institution-password" type="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); setDemoFilled(false); }} placeholder="Enter password" required /></div>
            {error && <p className="institution-signin-error" role="alert">{error}</p>}
            {demoFilled && <p className="institution-signin-hint" role="status">Demo credentials filled. Select sign in to continue.</p>}
            <button className="institution-signin-submit" type="submit">Sign in <ArrowRight size={16} /></button>
          </form>

          <div className="institution-demo-box">
            <div><strong>Prototype access</strong><span>Use the KITS Warangal demo administrator.</span></div>
            <button type="button" onClick={useDemoAccount}>Use demo credentials</button>
          </div>
          <p className="institution-signin-security">Demo authentication is stored in this browser only. Production use requires a secure authentication service.</p>
        </div>
      </section>
    </main>
  );
}
