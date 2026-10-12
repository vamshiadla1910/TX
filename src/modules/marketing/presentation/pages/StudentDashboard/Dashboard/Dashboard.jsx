import React, { useState } from "react";
import "./Dashboard.css";

const DashboardNavbar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [student, setStudent] = useState("Student — Aditya R.");

  const navigation = [
    {
      section: "LEARN",
      items: [
        { name: "Dashboard", path: "/student/dashboard" },
        { name: "My courses", path: "/student/courses", count: 4 },
        { name: "AI assistant", path: "/student/ai-assistant" },
        { name: "Coding lab", path: "/student/coding-lab", count: 2 },
      ],
    },
    {
      section: "PROGRESS",
      items: [
        { name: "Assessments", path: "/student/assessments", count: 1 },
        { name: "Certificates", path: "/student/certificates", count: 3 },
      ],
    },
    {
      section: "NEXT",
      items: [
        { name: "Careers", path: "/student/careers", count: 14 },
      ],
    },
  ];

  return (
    <aside className="dashboard-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="brand-symbol">///</span>
        <span className="brand-name">Pathwing</span>
      </div>

      {/* Student selector */}
      <div className="sidebar-student-selector">
        <label htmlFor="student-select">SIGNED IN AS</label>

        <select
          id="student-select"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
        >
          <option>Student — Aditya R.</option>
          <option>Student — Demo User</option>
        </select>
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">
        {navigation.map((group) => (
          <div className="sidebar-group" key={group.section}>
            <p className="sidebar-section-title">{group.section}</p>

            {group.items.map((item) => (
              <button
                type="button"
                key={item.name}
                className={`sidebar-nav-item ${
                  activeItem === item.name ? "active" : ""
                }`}
                onClick={() => setActiveItem(item.name)}
              >
                <span>{item.name}</span>

                {item.count !== undefined && (
                  <span className="sidebar-count">{item.count}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Profile footer */}
      <div className="sidebar-profile">
        <div className="profile-avatar">AR</div>

        <div className="profile-details">
          <p className="profile-name">Aditya Reddy</p>
          <p className="profile-description">
            Tenant: KITSW · Learner Pro
          </p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardNavbar;
