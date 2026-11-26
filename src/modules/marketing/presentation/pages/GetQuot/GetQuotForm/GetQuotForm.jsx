import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
 
import "./GetQuotForm.css";
 
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;
 
const COURSES = [
  "Python Full Stack with Gen AI",
  "Java Full Stack with Gen AI",
  "MERN Stack with Gen AI",
  "Data Analytics",
  "AI & Machine Learning",
  "QA Testing",
  "DevOps & AWS",
  "Other",
];
 
const YEARS = ["2020", "2021", "2022", "2023","2024", "2025", "2026", "2027", "2028", "Other"];
const MODES = ["Offline", "Online", "Hybrid"];
 
const INITIAL = {
  full_name: "",
  mobile_number: "",
  email: "",
  college_name: "",
  graduation_year: "",
  interested_course: "",
  training_mode: "",
  preferred_demo_date: "",
  consent: false,
  website: "",
  source: "website",
  campaign: "",
  medium: "",
  ad_id: "",
  adset_id: "",
};
 
const REQUIRED = {
  full_name: (value) => value.trim().length >= 2,
  mobile_number: (value) => /^[6-9]\d{9}$/.test(value),
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value),
  college_name: (value) => value.trim().length >= 2,
  graduation_year: Boolean,
  interested_course: Boolean,
  training_mode: Boolean,
};
 
const LABELS = {
  full_name: "Full name",
  mobile_number: "Mobile number",
  email: "Email address",
  college_name: "College name",
  graduation_year: "Passout year",
  interested_course: "Interested course",
  training_mode: "Training mode",
};
 
function getTrackingData() {
  const params = new URLSearchParams(window.location.search);
 
  return {
    source:
      params.get("utm_source") ||
      params.get("source") ||
      "website",
    campaign:
      params.get("utm_campaign") ||
      params.get("campaign") ||
      "",
    medium: params.get("utm_medium") || "",
    ad_id: params.get("ad_id") || "",
    adset_id: params.get("adset_id") || "",
  };
}
 
function Field({
  name,
  value,
  onChange,
  error,
  children,
  ...inputProps
}) {
  return (
    <div className={`gq-field gq-field-${name}${error ? " bad" : ""}`}>
      <label htmlFor={name}>
        {LABELS[name]} <em>*</em>
      </label>
 
      {children || (
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          {...inputProps}
        />
      )}
 
      {error && (
        <span
          className="gq-msg"
          id={`${name}-error`}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
 
export default function GetQuotForm({ selectedCourse = "" }) {
  const [form, setForm] = useState(() => ({
    ...INITIAL,
    ...getTrackingData(),
    interested_course: selectedCourse,
  }));
 
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
 
  useEffect(() => {
    if (selectedCourse) {
      setForm((previous) => ({
        ...previous,
        interested_course: selectedCourse,
      }));
    }
  }, [selectedCourse]);
 
  const update = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
 
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };
 
  const validate = () => {
    const nextErrors = {};
 
    Object.entries(REQUIRED).forEach(([key, rule]) => {
      if (!rule(form[key])) {
        nextErrors[key] =
          `Please enter/select ${LABELS[key].toLowerCase()}.`;
      }
    });
 
    if (!form.consent) {
      nextErrors.consent = "Please accept to continue.";
    }
 
    setErrors(nextErrors);
 
    return Object.keys(nextErrors).length === 0;
  };
 
  async function submit(event) {
    event.preventDefault();
 
    if (!validate()) return;
 
    // Honeypot: silently drop bot submissions
    if (form.website) return;
 
    setStatus("sending");
    setSubmitError("");
 
    const payload = {
      full_name: form.full_name.trim(),
      mobile_number: form.mobile_number,
      email: form.email.trim(),
      college_name: form.college_name.trim(),
      graduation_year: form.graduation_year,
      interested_course: form.interested_course,
      training_mode: form.training_mode,
      preferred_demo_date: form.preferred_demo_date,
      consent: form.consent,
      website: form.website,
      source: form.source,
      campaign: form.campaign,
      medium: form.medium,
      ad_id: form.ad_id,
      adset_id: form.adset_id,
    };
 
    try {
      // text/plain avoids a CORS preflight, which Apps Script doesn't support
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
 
      const result = await response.json();
 
      if (!result.ok) {
        throw new Error(result.error || "Submission failed");
      }
 
      setStatus("done");
    } catch (err) {
      console.error("Enquiry submission failed:", err);
      setSubmitError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }
 
  const today = new Date().toISOString().slice(0, 10);
 
  if (status === "done") {
    return (
      <section
        className="gq-form-section"
        id="gq-enquiry"
      >
        <div className="gq-form-layout gq-form-layout-success">
          <div
            className="gq-card gq-done"
            role="status"
            aria-live="polite"
          >
            <h2>Enquiry received!</h2>
 
            <p>
              Thank you for your interest in TX Pathwing.
              Our admissions team will contact you shortly.
            </p>
          </div>
        </div>
      </section>
    );
  }
 
  return (
    <section
      className="gq-form-section"
      id="gq-enquiry"
      aria-labelledby="gq-form-title"
    >
      <div className="gq-form-layout">
        <div className="gq-form-intro">
          <span className="gq-section-eyebrow">
            GET QUOTE · ENQUIRY FORM
          </span>
 
          <h2 id="gq-form-title">
            Get course details &amp; a free demo.
          </h2>
 
          <p>
            Share your details and our admissions team
            will contact you with course and demo information.
          </p>
        </div>
 
        <section
          className="gq-card"
          aria-label="Student enquiry form"
        >
          <header className="gq-card-header">
            <div className="gq-card-heading">
              <h3>Student Enquiry Form</h3>
 
              <p>
                TX Pathwing · Course details and demo information
              </p>
            </div>
 
            <span className="gq-free-badge">
              FREE DEMO
            </span>
          </header>
 
          <form onSubmit={submit} noValidate>
            <p className="gq-sub">
              Fields marked * are required.
            </p>
 
            <div className="gq-row">
              <Field
                name="full_name"
                value={form.full_name}
                error={errors.full_name}
                onChange={(event) =>
                  update("full_name", event.target.value)
                }
                autoComplete="name"
                placeholder="Your full name"
              />
 
              <Field
                name="mobile_number"
                value={form.mobile_number}
                error={errors.mobile_number}
                onChange={(event) =>
                  update(
                    "mobile_number",
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  )
                }
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10-digit mobile number"
              />
 
              <Field
                name="email"
                value={form.email}
                error={errors.email}
                onChange={(event) =>
                  update("email", event.target.value)
                }
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
 
              <Field
                name="college_name"
                value={form.college_name}
                error={errors.college_name}
                onChange={(event) =>
                  update("college_name", event.target.value)
                }
                autoComplete="organization"
                placeholder="Your college"
              />
 
              <Field
                name="graduation_year"
                error={errors.graduation_year}
              >
                <select
                  id="graduation_year"
                  name="graduation_year"
                  value={form.graduation_year}
                  onChange={(event) =>
                    update(
                      "graduation_year",
                      event.target.value
                    )
                  }
                  aria-invalid={Boolean(errors.graduation_year)}
                >
                  <option value="">Select year</option>
 
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </Field>
 
              <Field
                name="training_mode"
                error={errors.training_mode}
              >
                <select
                  id="training_mode"
                  name="training_mode"
                  value={form.training_mode}
                  onChange={(event) =>
                    update(
                      "training_mode",
                      event.target.value
                    )
                  }
                  aria-invalid={Boolean(errors.training_mode)}
                >
                  <option value="">Select mode</option>
 
                  {MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </Field>
 
              <Field
                name="interested_course"
                error={errors.interested_course}
              >
                <select
                  id="interested_course"
                  name="interested_course"
                  value={form.interested_course}
                  onChange={(event) =>
                    update(
                      "interested_course",
                      event.target.value
                    )
                  }
                  aria-invalid={Boolean(errors.interested_course)}
                >
                  <option value="">Select a course</option>
 
                  {COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </Field>
 
              <div className="gq-field gq-field-demo">
                <label htmlFor="preferred_demo_date">
                  Preferred demo date
                </label>
 
                <input
                  id="preferred_demo_date"
                  name="preferred_demo_date"
                  type="date"
                  min={today}
                  value={form.preferred_demo_date}
                  onChange={(event) =>
                    update(
                      "preferred_demo_date",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>
 
            {/* Honeypot field */}
            <input
              className="gq-hp"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={form.website}
              onChange={(event) =>
                update("website", event.target.value)
              }
            />
 
            {/* Tracking values */}
            {[
              "source",
              "campaign",
              "medium",
              "ad_id",
              "adset_id",
            ].map((key) => (
              <input
                type="hidden"
                name={key}
                value={form[key]}
                key={key}
              />
            ))}
 
            <div
              className={`gq-field gq-consent-field${
                errors.consent ? " bad" : ""
              }`}
            >
              <label
                className="gq-chk"
                htmlFor="consent"
              >
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) =>
                    update("consent", event.target.checked)
                  }
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={
                    errors.consent
                      ? "consent-error"
                      : undefined
                  }
                />
 
                <span>
                  I agree to be contacted by TX Pathwing
                  and accept the privacy notice.
                </span>
              </label>
 
              {errors.consent && (
                <span
                  className="gq-msg"
                  id="consent-error"
                  role="alert"
                >
                  {errors.consent}
                </span>
              )}
            </div>
 
            {submitError && (
              <p className="gq-msg" role="alert">
                {submitError}
              </p>
            )}
 
            <button
              className={`gq-btn${
                status === "sending" ? " load" : ""
              }`}
              type="submit"
              disabled={status === "sending"}
            >
              <span
                className="gq-spin"
                aria-hidden="true"
              />
 
              <span>Submit Enquiry</span>
 
              <ArrowRight
                size={17}
                aria-hidden="true"
              />
            </button>
 
            <p className="gq-form-note">
              Your details are used only to respond to
              your course enquiry.
            </p>
          </form>
        </section>
      </div>
    </section>
  );
}
 