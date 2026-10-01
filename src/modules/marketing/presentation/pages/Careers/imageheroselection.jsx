
import React, { useEffect, useState } from "react";
import "./imageheroselection.css";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
    label: "Learn Together",
  },
  {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    label: "Build Skills",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    label: "Practice with Purpose",
  },
  {
    src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    label: "Grow Your Career",
  },
];

const HeroSelection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-selection">
      <div className="hero-selection__slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-selection__slide ${
              active === index ? "active" : ""
            }`}
          > 
            <img src={slide.src} alt={slide.label} />

            <div className="hero-selection__label">
              <span />
              {slide.label}
            </div>
          </div>
        ))}

        <div className="hero-selection__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={active === index ? "active" : ""}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSelection;
