import React, { useState } from "react";
import FormCard from "./FormCard";

const fields = [
  ["title", "Project / Solution Title", "Project title"],
  ["beneficiaries", "Target Users / Beneficiaries", "Who will use it?"],
  ["problem", "Problem statement", "Problem statement"],
  ["solution", "Proposed Solution – Brief Description", "Brief solution"],
  ["outcome", "Expected Outcome", "Expected result"],
  ["stack", "Proposed Technology Stack", "Technology stack"]
];

export default function ProjectIdea({ data, update, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  const validate = () => {
    const errs = {};
    fields.forEach(([key, label]) => {
      if (!data[key]?.trim()) {
        errs[key] = `${label} is required.`;
      }
    });
    return errs;
  };

  const handleChange = (key, value) => {
    update({ [key]: value });
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
    <FormCard title="Project Idea" description="Capture the initial solution concept. It can be refined during the hackathon.">
      {hasErrors && (
        <div className="formErrorMessage">
          ⚠️ Please complete all initial project idea details before proceeding.
        </div>
      )}

      <div className="formGrid">
        {fields.map(([key, label, placeholder]) => {
          const fieldError = errors[key];
          return (
            <div className={`field full ${fieldError ? "hasError" : ""}`} key={key}>
              <label>{label} *</label>
              <textarea
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
