import React from "react";
export default function Success({ registrationId, onRestart }) {
  return (
    <section className="formCard successCard">
      <div className="successIcon">✓</div>
      <h2>Registration Submitted</h2>
      <p>Your TXPathWing hackathon registration has been submitted for organizer review.</p>
      <div className="registrationId">{registrationId}</div>
      <button className="button primary" onClick={onRestart}>Start New Registration</button>
    </section>
  );
}
