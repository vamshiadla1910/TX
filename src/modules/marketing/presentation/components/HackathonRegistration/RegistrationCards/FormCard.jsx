import React from "react";
export default function FormCard({ title, description, children }) {
  return (
    <section className="formCard">
      <div className="cardHeader">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
