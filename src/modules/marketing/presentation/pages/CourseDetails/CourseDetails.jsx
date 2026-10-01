import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courses as marketCourses } from "../MarketPlace/coursesList";
import "./CourseDetails.css";
import {extendedCoursesData} from "./CourseDetails";


export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const cleanId = (id || "").toLowerCase();
 
  // Try direct lookup
  let course = extendedCoursesData[cleanId];
 
  // Fallback match using coursesList array if not in dictionary directly
  if (!course) {
    const marketMatch = marketCourses.find(
      (c) => (c.id || "").toLowerCase() === cleanId
    );
 
    if (marketMatch) {
      course = {
        code: marketMatch.id,
        title: marketMatch.title,
        category: marketMatch.category,
        instructor: marketMatch.instructor || "TX Pathwing Expert",
        role: "Senior Industry Instructor",
        weeks: marketMatch.duration || "8 weeks",
        lessons: marketMatch.lessons || "45 lessons",
        level: marketMatch.level || "Intermediate",
        price: marketMatch.price,
        oldPrice: marketMatch.oldPrice || "",
        rating: "4.8",
        reviews: marketMatch.students || "1,200",
        emoji: "🎓",
        about: `Comprehensive ${marketMatch.title} training program. Designed to provide hands-on experience, real-world projects, and placement assistance.`,
        syllabus: [
          { m: "Module 1", t: "Foundations & Environment Setup", topics: ["Core Concepts", "Tooling & Setup", "Basic Implementations"], d: "2 weeks" },
          { m: "Module 2", t: "Core Applications & Deep Dive", topics: ["Advanced Topics", "Best Practices", "Industry Standards"], d: "3 weeks" },
          { m: "Module 3", t: "Capstone Project & Deployment", topics: ["Real-world Capstone", "Performance Tuning", "Deployment & Portfolio"], d: "3 weeks" }
        ],
        projects: [`${marketMatch.title} Real-World App`, "Enterprise Case Study"],
        skills: [marketMatch.category, "Industry Best Practices", "Hands-on Labs"]
      };
    }
  }
 
  if (!course) {
    return (
      <div className="detail-notfound">
        <h2>Course not found</h2>
        <p>The requested course could not be located in our catalogue.</p>
        <button onClick={() => navigate("/marketplace")}>Back to Marketplace</button>
      </div>
    );
  }
 
  return (
    <div className="detail-page">
      <div className="detail-breadcrumb">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/marketplace")}
        >
          ← Back to Courses
        </button>
 
        <span className="crumb">
          Marketplace &gt; {course.category || "Course"} &gt; {course.code}
        </span>
      </div>
 
      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-badge">
            {course.code} • {course.level}
          </div>
 
          <h1 className="detail-title">{course.title}</h1>
 
          <div className="detail-instructor">
            <div className="avatar">{course.emoji}</div>
            <div>
              <div className="inst-name">{course.instructor}</div>
              <div className="inst-role">{course.role}</div>
            </div>
            <div className="detail-meta">
              <span>⏱ {course.weeks}</span>
              <span>📚 {course.lessons}</span>
              <span>⭐ {course.rating} ({course.reviews})</span>
            </div>
          </div>
 
          <p className="detail-about">{course.about}</p>
 
          <div className="detail-skills">
            {course.skills.map((skill) => (
              <span key={skill} className="skill-pill">
                {skill}
              </span>
            ))}
          </div>
 
          <h2 className="section-title">Syllabus — {course.code} Track</h2>
          <div className="syllabus-list">
            {course.syllabus.map((mod, i) => (
              <div key={i} className="syllabus-card">
                <div className="syllabus-left">
                  <div className="mod-num">{mod.m}</div>
                  <div className="mod-duration">{mod.d}</div>
                </div>
                <div className="syllabus-right">
                  <h3>{mod.t}</h3>
                  <ul>
                    {mod.topics.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
 
          <h2 className="section-title">Capstone Projects</h2>
          <div className="projects-list">
            {course.projects.map((p, i) => (
              <div key={i} className="project-card">
                <div className="project-num">0{i + 1}</div>
                <div className="project-name">{p}</div>
              </div>
            ))}
          </div>
        </div>
 
        <div className="detail-sidebar">
          <div className="buy-card">
            <div className="buy-price">
              <span className="now">{course.price}</span>
              {course.oldPrice && course.oldPrice !== "₹0" && (
                <>
                  <span className="old">{course.oldPrice}</span>
                  <span className="off">SPECIAL OFFER</span>
                </>
              )}
            </div>
 
            <button type="button" className="buy-btn">
              Enroll Now — {course.price}
            </button>
            <button type="button" className="cart-btn">
              Add to Cart
            </button>
 
            <div className="buy-features">
              <div>✓ Lifetime Access to Course Labs</div>
              <div>✓ Certificate + Placement Support</div>
              <div>✓ Live Mentor Doubt Sessions</div>
              <div>✓ GST Invoice Included</div>
            </div>
 
            <div className="trust">
              🔒 Secure payment by Pathwing • 7 day money-back guarantee
            </div>
          </div>
 
          <div className="info-card">
            <h4>This Course Includes</h4>
            <div>📹 {course.lessons} videos & lectures</div>
            <div>💻 Hands-on Coding Labs</div>
            <div>🎯 {course.projects.length} Real-World Projects</div>
            <div>📄 Industry Certificate</div>
          </div>
        </div>
      </div>
    </div>
  );
}