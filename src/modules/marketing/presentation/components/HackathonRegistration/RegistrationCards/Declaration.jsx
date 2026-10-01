import React, { useState } from "react";
import FormCard from "./FormCard";
import { validateAlphaOnly, validateDateNotPast } from "../validationHelpers";

export default function Declaration({ data, update, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const validate = () => {
    const errs = {};
    if (!data.rulesAccepted) {
      errs.rulesAccepted = "You must agree to the declaration and event rules.";
    }
    if (!data.infoConfirmed) {
      errs.infoConfirmed = "You must confirm accuracy of academic & contact information.";
    }
    if (!data.consent) {
      errs.consent = "Please select your event documentation consent.";
    }
    const nameErr = validateAlphaOnly(data.name, "Participant / Team Leader Name");
    if (nameErr) {
      errs.name = nameErr;
    }
    const dateErr = validateDateNotPast(data.date, "Date");
    if (dateErr) {
      errs.date = dateErr;
    }
    if (!data.place?.trim()) {
      errs.place = "Place is required.";
    }
    if (!data.signature?.trim()) {
      errs.signature = "Digital Signature is required.";
    }
    return errs;
  };

  const handleChange = (key, value) => {
    let finalValue = value;
    if (key === "name") {
      finalValue = value.replace(/[^a-zA-Z\s.\-']/g, "");
    }
    update({ [key]: finalValue });
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const handleNext = () => {
    setAttempted(true);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  const hasErrors = attempted && Object.keys(errors).some(k => errors[k]);

  return (
    <FormCard title="Declaration & Consent" description="Confirm the participation commitments and event documentation preference.">
      {hasErrors && (
        <div className="formErrorMessage">
          ⚠️ Please check all consent checkboxes and fill in declaration details.
        </div>
      )}

      <div className="notice">
        I/We confirm that the information provided is accurate and complete. I/We agree to follow the official Hackathon Rules & Regulations, participate professionally, develop original or appropriately licensed work, respect intellectual property, data protection and cybersecurity policies, comply with permitted AI tools, APIs, libraries and datasets, meet submission deadlines, participate in presentations, demonstrations, evaluations and mentoring, and accept the decisions of the designated evaluation and judging panel according to the published framework.
      </div>

      <div className="choiceGrid">
        <label className={`choiceCard ${data.rulesAccepted ? "selected" : ""} ${errors.rulesAccepted ? "hasError" : ""}`}>
          <input
            type="checkbox"
            checked={!!data.rulesAccepted}
            onChange={e => handleChange("rulesAccepted", e.target.checked)}
          />
          <div>
            <span>I agree to the declaration and event rules. *</span>
            {errors.rulesAccepted && <span className="errorText" style={{ display: "block", marginTop: "4px" }}>⚠️ {errors.rulesAccepted}</span>}
          </div>
        </label>

        <label className={`choiceCard ${data.infoConfirmed ? "selected" : ""} ${errors.infoConfirmed ? "hasError" : ""}`}>
          <input
            type="checkbox"
            checked={!!data.infoConfirmed}
            onChange={e => handleChange("infoConfirmed", e.target.checked)}
          />
          <div>
            <span>I confirm my academic and contact information is accurate. *</span>
            {errors.infoConfirmed && <span className="errorText" style={{ display: "block", marginTop: "4px" }}>⚠️ {errors.infoConfirmed}</span>}
          </div>
        </label>
      </div>

      <div className={`notice ${errors.consent ? "warning" : ""}`}>
        <strong>Photography, Video & Event Documentation Consent: *</strong>
        <div className="inlineOptions">
          {["I Agree", "I Do Not Agree"].map(option => (
            <label key={option}>
              <input
                type="radio"
                name="consent"
                checked={data.consent === option}
                onChange={() => handleChange("consent", option)}
              />{" "}
              {option}
            </label>
          ))}
        </div>
        {errors.consent && <span className="errorText" style={{ display: "block", marginTop: "6px" }}>⚠️ {errors.consent}</span>}
      </div>

      <div className="formGrid">
        {[
          ["name", "Participant / Team Leader Name *", "Name"],
          ["date", "Date *", ""],
          ["place", "Place *", "Place"],
          ["signature", "Signature *", "Signature / Full Name"]
        ].map(([key, label, placeholder]) => {
          const fieldError = errors[key];
          const isDate = key === "date";
          return (
            <div className={`field ${fieldError ? "hasError" : ""}`} key={key}>
              <label>{label}</label>
              <input
                type={isDate ? "date" : "text"}
                min={isDate ? todayStr : undefined}
                value={data[key] || ""}
                placeholder={placeholder}
                onChange={e => handleChange(key, e.target.value)}
              />
              {fieldError && <span className="errorText">⚠️ {fieldError}</span>}
            </div>
          );
        })}
      </div>

      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={handleNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
