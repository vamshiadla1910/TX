import React, { useState } from "react";
import FormCard from "./FormCard";

const categories = ["Industry", "Institutional", "Open Innovation"];

export default function ChallengeSelection({ data, update, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!data.category) {
      errs.category = "Please select a challenge category.";
    }
    return errs;
  };

  const handleSelectCategory = (category) => {
    update({ category });
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: "" }));
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
    <FormCard title="Challenge Selection" description="Select the challenge category for your participation.">
      {hasErrors && (
        <div className="formErrorMessage">
          ⚠️ Please select a challenge category.
        </div>
      )}

      <div className={`field ${errors.category ? "hasError" : ""}`}>
        <label>Challenge Category *</label>
        <div className={`choiceGrid ${errors.category ? "hasError" : ""}`}>
          {categories.map(category => (
            <label className={`choiceCard ${data.category === category ? "selected" : ""}`} key={category}>
              <input
                type="radio"
                name="category"
                checked={data.category === category}
                onChange={() => handleSelectCategory(category)}
              />
              <div>
                <strong>{category}</strong>
                <p>{category === "Industry" ? "Industry-defined problem statements." : category === "Institutional" ? "Challenges from participating institutions." : "Original solution around an open problem."}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.category && <span className="errorText">⚠️ {errors.category}</span>}
      </div>

      <div className="notice warning">Final allocation is subject to organizer guidelines, availability, screening and event requirements.</div>

      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={handleNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
