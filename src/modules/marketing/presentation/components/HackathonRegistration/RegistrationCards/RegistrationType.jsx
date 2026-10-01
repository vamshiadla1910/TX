import React from "react";
import FormCard from "./FormCard";

export default function RegistrationType({ data, update, onNext }) {
  return (
    <FormCard title="How are you participating?" description="Choose the registration path. The remaining workflow is shared.">
      <div className="choiceGrid">
        <label className={`choiceCard ${data.participantType === "team" ? "selected" : ""}`}>
          <input
            type="radio"
            name="participantType"
            checked={data.participantType === "team"}
            onChange={() => update({ participantType: "team" })}
          />
          <div>
            <strong>Team Registration</strong>
            <p>Team lead details and team member details followed by the common hackathon flow.</p>
          </div>
        </label>
        <label className={`choiceCard ${data.participantType === "individual" ? "selected" : ""}`}>
          <input
            type="radio"
            name="participantType"
            checked={data.participantType === "individual"}
            onChange={() => update({ participantType: "individual" })}
          />
          <div>
            <strong>Individual Participant</strong>
            <p>Student details followed by the common hackathon flow.</p>
          </div>
        </label>
      </div>
      <div className="notice">
        <strong>Recommended team size:</strong> 5–6 participants. Interdisciplinary teams are encouraged where applicable.
      </div>
      <div className="formActions">
        <span />
        <button className="button primary" disabled={!data.participantType} onClick={onNext}>Continue →</button>
      </div>
    </FormCard>
  );
}
