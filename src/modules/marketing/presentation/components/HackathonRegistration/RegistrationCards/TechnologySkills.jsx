import React, { useState } from "react";
import FormCard from "./FormCard";

const skills = [
  "AI / GenAI", "Machine Learning", "Data Science / Analytics", "Web Development",
  "Mobile Development", "Cloud", "DevOps", "Cybersecurity", "IoT",
  "Blockchain / Web3", "Software Engineering", "UI / UX", "Robotics / Automation", "Other"
];

export default function TechnologySkills({ data, update, onNext, onBack }) {
  const selected = data.skills || [];
  const [showOther, setShowOther] = useState(selected.includes("Other"));
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  const toggle = skill => {
    const next = selected.includes(skill) ? selected.filter(item => item !== skill) : [...selected, skill];
    update({ skills: next });
    setShowOther(next.includes("Other"));
    if (errors.skills && next.length > 0) {
      setErrors(prev => ({ ...prev, skills: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (selected.length === 0) {
      errs.skills = "Please select at least one technology/skill domain.";
    }
    if (selected.includes("Other") && !data.otherSkill?.trim()) {
      errs.otherSkill = "Please enter your other technology or skill.";
    }
    if (!data.technologies?.trim()) {
      errs.technologies = "Technologies / Programming languages are required.";
    }
    if (!data.frameworks?.trim()) {
      errs.frameworks = "Frameworks / Tools are required.";
    }
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
    <FormCard title="Technology & Skills" description="Select the domains and technologies you or your team can work with.">
      {hasErrors && (
        <div className="formErrorMessage">
          ⚠️ Please complete the required technology & skill selections.
        </div>
      )}

      <div className={`field ${errors.skills ? "hasError" : ""}`}>
        <label>Technology / Skill Domains *</label>
        <div className={`choiceGrid ${errors.skills ? "hasError" : ""}`}>
          {skills.map(skill => (
            <label className={`choiceCard compact ${selected.includes(skill) ? "selected" : ""}`} key={skill}>
              <input type="checkbox" checked={selected.includes(skill)} onChange={() => toggle(skill)} />
              <span>{skill}</span>
            </label>
          ))}
        </div>
        {errors.skills && <span className="errorText">⚠️ {errors.skills}</span>}
      </div>

      {showOther && (
        <div className={`field otherField ${errors.otherSkill ? "hasError" : ""}`}>
          <label>Enter Other Technology / Skill *</label>
          <input
            value={data.otherSkill || ""}
            placeholder="Enter technology or skill manually"
            onChange={e => handleChange("otherSkill", e.target.value)}
          />
          {errors.otherSkill && <span className="errorText">⚠️ {errors.otherSkill}</span>}
        </div>
      )}

      <div className="formGrid topSpace">
        <div className={`field ${errors.technologies ? "hasError" : ""}`}>
          <label>Technologies / Programming Languages *</label>
          <input
            value={data.technologies || ""}
            placeholder="Java, Python, React, SQL..."
            onChange={e => handleChange("technologies", e.target.value)}
          />
          {errors.technologies && <span className="errorText">⚠️ {errors.technologies}</span>}
        </div>

        <div className={`field ${errors.frameworks ? "hasError" : ""}`}>
          <label>Frameworks / Tools *</label>
          <input
            value={data.frameworks || ""}
            placeholder="Spring Boot, React, Docker..."
            onChange={e => handleChange("frameworks", e.target.value)}
          />
          {errors.frameworks && <span className="errorText">⚠️ {errors.frameworks}</span>}
        </div>
      </div>

      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={handleNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
