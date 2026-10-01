import { useState } from "react";
import hackathonImg from "../../../../../assets/premium_hackathon_trophy.png";
import hackathonimg2 from "../../../../../assets/Hackathon_2.jpg";
import bootcampImg from "../../../../../assets/bootcamp_3d_illustration.png";
import workshopImg from "../../../../../assets/workshop_lightbulb_idea.png";
import { useNavigate } from "react-router-dom";
import "./Events.css";
import { events } from "./events";

export default function Events() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState(null);
  const [flippedEvent, setFlippedEvent] = useState(null);
  const naavigate = useNavigate();

  const filteredEvents = events.filter((event) => {
    const matchesType =
      typeFilter === "all" || event.type === typeFilter;

    const matchesMode =
      !modeFilter || event.mode === modeFilter;

    return matchesType && matchesMode;
  });

  const handleRegister = (event) => {
    alert(`Registration for ${event.title}`);
  };

  return (
    <div className="events-page">

      <div className="events-heading">
        <h1>Events</h1>
        <p>
          Learn. Build. Compete. Real events, real skills, real rewards.
        </p>
      </div>

      <div className="event-filters">
        <button
          onClick={() => setTypeFilter("all")}
          className={typeFilter === "all" ? "selected" : ""}
        >
          All Events
        </button>

        <button
          onClick={() => setTypeFilter("hackathon")}
          className={typeFilter === "hackathon" ? "selected" : ""}
        >
          Hackathons
        </button>

        <button
          onClick={() => setTypeFilter("bootcamp")}
          className={typeFilter === "bootcamp" ? "selected" : ""}
        >
          Bootcamps
        </button>

        <button
          onClick={() => setTypeFilter("workshop")}
          className={typeFilter === "workshop" ? "selected" : ""}
        >
          Workshops
        </button>

        <button
          onClick={() => setTypeFilter("industrial")}
          className={typeFilter === "industrial" ? "selected" : ""}
        >
          Industrial Training
        </button>
      </div>

      <div className="online-offline">
        <button
          onClick={() => setModeFilter("online")}
          className={modeFilter === "online" ? "selected" : ""}
        >
          Online
        </button>

        <button
          onClick={() => setModeFilter("offline")}
          className={modeFilter === "offline" ? "selected" : ""}
        >
          Offline
        </button>

        {modeFilter && (
          <button
            className="clear-mode"
            onClick={() => setModeFilter(null)}
          >
            Clear
          </button>
        )}
      </div>

      <div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className={`event-card-container ${
                flippedEvent === event.id ? "flipped" : ""
              }`}
              style={{
                animationDelay: `${index * 0.08}s`,
              }}
            >
              <div className="event-card-inner">

                <div className="event-card-front">

                  <div className="event-image">
                    <img
                      src={event.img}
                      alt={event.title}
                    />

                    <div className="event-type">
                      {event.badge}
                    </div>

                    <div className="event-date">
                      {event.date}
                    </div>
                  </div>

                  <div className="event-details">

                    <h3>{event.title}</h3>

                    <p className="event-description">
                      {event.desc}
                    </p>

                    <div className="event-info">
                      {event.meta}
                    </div>

                    <div className="event-stats">
                      <span>{event.s1}</span>
                      <span>{event.s2}</span>
                    </div>

                    <div className="button-details">

                      <button
                        className="event-action register-button"
                        onClick={() => naavigate("/registration")}
                      >
                        {event.btn}
                      </button>

                      <button
                        className="event-action details-button"
                        onClick={() =>
                          setFlippedEvent(event.id)
                        }
                      >
                        {event.viewBtn}
                      </button>

                    </div>

                  </div>

                </div>

                <div className="event-card-back">

                  <div className="back-heading">

                    <span className="back-badge">
                      {event.badge}
                    </span>

                    <h3>Event Details</h3>

                    <p>{event.title}</p>

                  </div>

                  <div className="event-info-grid">

                    <div className="info-card theme-card">
                      <span className="info-icon">🎯</span>

                      <div className="info-content">
                        <span className="info-label">
                          Theme
                        </span>

                        <strong>
                          {event.theme}
                        </strong>
                      </div>
                    </div>

                    <div className="info-card date-card">
                      <span className="info-icon">📅</span>

                      <div className="info-content">
                        <span className="info-label">
                          Date
                        </span>

                        <strong>
                          {event.date}
                        </strong>
                      </div>
                    </div>

                    <div className="info-card duration-card">
                      <span className="info-icon">⏱</span>

                      <div className="info-content">
                        <span className="info-label">
                          Duration
                        </span>

                        <strong>
                          {event.duration}
                        </strong>
                      </div>
                    </div>

                    <div className="info-card venue-card">
                      <span className="info-icon">📍</span>

                      <div className="info-content">
                        <span className="info-label">
                          Venue
                        </span>

                        <strong>
                          {event.venue}
                        </strong>
                      </div>
                    </div>

                    <div className="info-card deadline-card">
                      <span className="info-icon">📝</span>

                      <div className="info-content">
                        <span className="info-label">
                          Registration Deadline
                        </span>

                        <strong>
                          {event.deadline}
                        </strong>
                      </div>
                    </div>

                    <div className="info-card organizer-card">
                      <span className="info-icon">🏢</span>

                      <div className="info-content">
                        <span className="info-label">
                          Organized By
                        </span>

                        <strong>
                          {event.organizer}
                        </strong>
                      </div>
                    </div>

                    <div className="info-card mode-card">
                      <span className="info-icon">🌐</span>

                      <div className="info-content">
                        <span className="info-label">
                          Mode
                        </span>

                        <strong>
                          {event.mode === "online"
                            ? "Online"
                            : "Offline"}
                        </strong>
                      </div>
                    </div>

                  </div>

                  <button
                    className="back-event-btn"
                    onClick={() => setFlippedEvent(null)}
                  >
                    ← Back to Event
                  </button>

                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="event-box">
            <div className="no-events">
              <h3>No events found</h3>

              <p>
                There are currently no events available
                in this category.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}