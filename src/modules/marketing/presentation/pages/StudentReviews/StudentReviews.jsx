import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import "./StudentReviews.css";

const reviews = [
  {
    id: 1,
    name: "Hari Chari",
    course: "Full Stack Development",
    comment:
      "The training was very practical and well-structured. I gained real-world skills and confidence to face interviews.",
  },
  {
    id: 2,
    name: "Ajay",
    course: "MERN Stack Development",
    comment:
      "The projects helped me understand concepts deeply and build a strong portfolio. The learning experience was excellent.",
  },
  {
    id: 3,
    name: "Sowmya",
    course: "DevOps & Cloud",
    comment:
      "The mentors were very supportive and the hands-on learning helped me understand real-world DevOps concepts.",
  },
  {
    id: 5,
    name: "Vishnu",
    course: "Data Science",
    comment:
      "The content was easy to follow and very practical. I gained confidence working with real datasets and projects.",
  },
  {
    id: 4,
    name: "Likesh",
    course: "Python Development",
    comment:
      "The real-world projects and interview preparation sessions helped me build confidence and improve my technical skills.",
  },
  
  {
    id: 6,
    name: "Vamshi",
    course: "Java Full Stack",
    comment:
      "The practical assignments made learning much easier. I enjoyed working on real-world application projects.",
  },
  {
    id: 7,
    name: "Shashi",
    course: "React Development",
    comment:
      "The project-based approach helped me understand React concepts clearly and gave me confidence to build applications.",
  },
  {
    id: 8,
    name: "Bhargavi",
    course: "AWS & DevOps",
    comment:
      "A structured learning experience with useful projects, clear explanations and excellent career guidance.",
  },
];

function StudentReviews() {
  const sliderRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateButtons = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    const isAtStart = slider.scrollLeft <= 5;

    const isAtEnd =
      slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5;

    setCanScrollLeft(!isAtStart);
    setCanScrollRight(!isAtEnd);
  };

  const scrollCards = (direction) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const firstCard = slider.querySelector(".student-review-card");

    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;

    const gap = 24;

    const scrollAmount = cardWidth + gap;

    slider.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateButtons();

    const slider = sliderRef.current;

    if (!slider) return;

    slider.addEventListener("scroll", updateButtons);

    window.addEventListener("resize", updateButtons);

    return () => {
      slider.removeEventListener("scroll", updateButtons);

      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  return (
    <section className="student-reviews-section">
      <div className="student-reviews-header">
        <span className="student-reviews-badge">STUDENT STORIES</span>

        <h2>Trusted by our students</h2>

        <p>
          Real feedback from learners who completed our training and started
          building their careers.
        </p>
      </div>

      <div className="student-reviews-box">
        <div className="reviews-window" ref={sliderRef}>
          <div className="reviews-track">
            {reviews.map((review) => (
              <article className="student-review-card" key={review.id}>
                <Quote className="review-quote-icon" size={28} />

                <div className="review-student-info">
                  <h3>{review.name}</h3>

                  <span>{review.course}</span>
                </div>

                <p className="review-comment">{review.comment}</p>

                <Quote className="review-bottom-quote" size={30} />
              </article>
            ))}
          </div>
        </div>

        <div className="reviews-bottom">
          <span className="reviews-bottom-text">
            Real Learners. Real Outcomes.
          </span>

          <div className="review-controls">
            <button
              type="button"
              className="review-control-btn"
              onClick={() => scrollCards("left")}
              disabled={!canScrollLeft}
              aria-label="Previous reviews"
            >
              <ChevronLeft size={21} />
            </button>

            <button
              type="button"
              className="review-control-btn"
              onClick={() => scrollCards("right")}
              disabled={!canScrollRight}
              aria-label="Next reviews"
            >
              <ChevronRight size={21} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentReviews;
