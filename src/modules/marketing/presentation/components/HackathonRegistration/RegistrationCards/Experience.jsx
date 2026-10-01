import React, { useState } from "react";
import FormCard from "./FormCard";
import { validateUrl } from "../validationHelpers";

export default function Experience({ data, update, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!data.hackathonBefore) {
      errs.hackathonBefore = "Please select Yes or No.";
    }
    if (data.hackathonBefore === "Yes" && (!data.hackathonCount || Number(data.hackathonCount) < 1)) {
      errs.hackathonCount = "Please enter number of hackathons (at least 1).";
    }
    if (!data.developedProjects) {
      errs.developedProjects = "Please select Yes or No.";
    }
    const urlErr = validateUrl(data.portfolio, "Portfolio / GitHub / LinkedIn URL");
    if (urlErr) {
      errs.portfolio = urlErr;
    }
    return errs;
  };

  const handleChange = (key, value) => {
    update({ [key]: value });
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const handleHackathonBeforeChange = (val) => {
    if (val === "Yes") {
      update({
        hackathonBefore: "Yes",
        hackathonCount: (!data.hackathonCount || Number(data.hackathonCount) < 1) ? 1 : data.hackathonCount
      });
    } else if (val === "No") {
      update({
        hackathonBefore: "No",
        hackathonCount: 0
      });
    } else {
      update({
        hackathonBefore: "",
        hackathonCount: ""
      });
    }
    if (errors.hackathonBefore || errors.hackathonCount) {
      setErrors(prev => ({ ...prev, hackathonBefore: "", hackathonCount: "" }));
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
    <FormCard title="Previous Experience" description="Tell us about previous hackathons and projects.">
      {hasErrors && (
        <div className="formErrorMessage">
          ⚠️ Please correct the highlighted fields before proceeding.
        </div>
      )}

      <div className="formGrid">
        <div className={`field ${errors.hackathonBefore ? "hasError" : ""}`}>
          <label>Participated in a Hackathon Before? *</label>
          <select
            value={data.hackathonBefore || ""}
            onChange={e => handleHackathonBeforeChange(e.target.value)}
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.hackathonBefore && <span className="errorText">⚠️ {errors.hackathonBefore}</span>}
        </div>

        {data.hackathonBefore === "Yes" && (
          <div className={`field ${errors.hackathonCount ? "hasError" : ""}`}>
            <label>Number of Hackathons Participated *</label>
            <input
              type="number"
              min="1"
              value={data.hackathonCount ?? 1}
              placeholder="1"
              onChange={e => {
                const val = Math.max(1, parseInt(e.target.value) || 1);
                handleChange("hackathonCount", val);
              }}
            />
            {errors.hackathonCount && <span className="errorText">⚠️ {errors.hackathonCount}</span>}
          </div>
        )}

        <div className="field full">
          <label>Previous Hackathon / Project Experience</label>
          <textarea
            value={data.previousExperience || ""}
            placeholder="Brief experience summary"
            onChange={e => handleChange("previousExperience", e.target.value)}
          />
        </div>

        <div className={`field ${errors.developedProjects ? "hasError" : ""}`}>
          <label>Have you Developed Projects Previously? *</label>
          <select
            value={data.developedProjects || ""}
            onChange={e => handleChange("developedProjects", e.target.value)}
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.developedProjects && <span className="errorText">⚠️ {errors.developedProjects}</span>}
        </div>

        <div className={`field ${errors.portfolio ? "hasError" : ""}`}>
          <label>Portfolio / GitHub / LinkedIn / Project URL</label>
          <input
            type="url"
            value={data.portfolio || ""}
            placeholder="https://github.com/your-username"
            onChange={e => handleChange("portfolio", e.target.value)}
          />
          {errors.portfolio && <span className="errorText">⚠️ {errors.portfolio}</span>}
        </div>

        <div className="field full">
          <label>If Yes, Briefly Describe Your Projects</label>
          <textarea
            value={data.projectDescription || ""}
            placeholder="Project descriptions and tech stacks used"
            onChange={e => handleChange("projectDescription", e.target.value)}
          />
        </div>
      </div>

      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={handleNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
