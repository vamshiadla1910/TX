import React, { useState } from "react";
import FormCard from "./FormCard";
import { validateEmail, validateMobile, validateOptionalMobile, validateAlphaOnly } from "../validationHelpers";

const blankMember = () => ({
  name: "",
  email: "",
  mobile: "",
  alternateContact: "",
  college: "",
  department: "",
  year: "",
  studentId: "",
  skills: ""
});

export default function TeamMembers({ data, update, onNext, onBack }) {
  const members = data.members || [blankMember()];
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  const setMembers = next => update({ members: next });

  const validate = () => {
    const errs = {};
    members.forEach((m, index) => {
      const nameErr = validateAlphaOnly(m.name, "Name");
      if (nameErr) errs[`${index}_name`] = nameErr;
      
      const emailErr = validateEmail(m.email);
      if (emailErr) errs[`${index}_email`] = emailErr;

      const mobileErr = validateMobile(m.mobile, "Mobile number");
      if (mobileErr) errs[`${index}_mobile`] = mobileErr;

      const altErr = validateOptionalMobile(m.alternateContact, "Alternate contact");
      if (altErr) errs[`${index}_alternateContact`] = altErr;

      const collegeErr = validateAlphaOnly(m.college, "College");
      if (collegeErr) errs[`${index}_college`] = collegeErr;

      const deptErr = validateAlphaOnly(m.department, "Department");
      if (deptErr) errs[`${index}_department`] = deptErr;

      if (!m.year?.trim()) errs[`${index}_year`] = "Year is required";
      if (!m.studentId?.trim()) errs[`${index}_studentId`] = "Student ID is required";
      if (!m.skills?.trim()) errs[`${index}_skills`] = "Primary skills are required";
    });
    return errs;
  };

  const updateMember = (index, key, value) => {
    let finalValue = value;
    if (key === "mobile" || key === "alternateContact") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (["name", "college", "department"].includes(key)) {
      finalValue = value.replace(/[^a-zA-Z\s.\-']/g, "");
    }
    const next = members.map((member, i) => i === index ? { ...member, [key]: finalValue } : member);
    setMembers(next);

    const errKey = `${index}_${key}`;
    if (errors[errKey]) {
      setErrors(prev => ({ ...prev, [errKey]: "" }));
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
    <FormCard title="Team Members Details" description="Add the participating members. The first member is the team leader.">
      {hasErrors && (
        <div className="formErrorMessage">
          ⚠️ Please correct the highlighted team member details before proceeding.
        </div>
      )}

      {members.map((member, index) => (
        <div className="memberCard" key={index}>
          <div className="memberHeader">
            <div>
              <strong>Team Member {index + 1}</strong>
              {index === 0 && <span className="pill">Team Leader</span>}
            </div>
            {index > 0 && (
              <button
                type="button"
                className="removeButton"
                onClick={() => {
                  const updated = members.filter((_, i) => i !== index);
                  setMembers(updated);
                  setErrors({});
                }}
              >
                Remove
              </button>
            )}
          </div>
          <div className="formGrid">
            {[
              ["name", "Name *", "text", "Full name"],
              ["email", "Email *", "email", "Email"],
              ["mobile", "Mobile Number *", "tel", "Mobile"],
              ["alternateContact", "Emergency / Alternate Contact Number", "tel", "Alternate contact number"],
              ["college", "College / University *", "text", "College / University"],
              ["department", "Department *", "text", "Department"],
              ["year", "Year *", "select", "Select year", ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate (PG)"]],
              ["studentId", "Student ID / Roll Number *", "text", "Student ID"],
              ["skills", "Primary Skills *", "text", "Java, React, AI..."]
            ].map(([key, label, type, placeholder, options]) => {
              const errKey = `${index}_${key}`;
              const fieldError = errors[errKey];
              const isTel = type === "tel";
              return (
                <div className={`field ${fieldError ? "hasError" : ""}`} key={key}>
                  <label>{label}</label>
                  {type === "select" ? (
                    <select
                      value={member[key] || ""}
                      onChange={e => updateMember(index, key, e.target.value)}
                    >
                      <option value="">{placeholder}</option>
                      {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      inputMode={isTel ? "numeric" : undefined}
                      pattern={isTel ? "[0-9]*" : undefined}
                      maxLength={isTel ? 10 : undefined}
                      value={member[key] || ""}
                      placeholder={placeholder}
                      onChange={e => updateMember(index, key, e.target.value)}
                    />
                  )}
                  {fieldError && <span className="errorText">⚠️ {fieldError}</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="button secondary addMember"
        disabled={members.length >= 6}
        onClick={() => setMembers([...members, blankMember()])}
      >
        + Add Team Member
      </button>
      <div className="notice">Up to 6 participants can be represented. Team members include emergency / alternate contact details.</div>
      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={handleNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
