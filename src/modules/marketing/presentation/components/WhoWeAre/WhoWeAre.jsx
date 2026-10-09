import React from "react";
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    UserRound,
} from "lucide-react";
import "./WhoWeAre.css";
import { useNavigate } from "react-router-dom";

import organizationImage from "../../components/assets/organization.png";
import learnerImage from "../../components/assets/learner.png";
import pathwingLogo from "../../../../../assets/tx-icon.jpg";

import LMSimage from "../../components/assets/traning.png";
import Training from "../../components/assets/traning.png";
import Internships from "../../components/assets/traning.png";
import Opportunities from "../../components/assets/traning.png";
import learner from "../../components/assets/contact-students.png"


const organizationPoints = [
    "Branded Learning Platforms",
    "Skill Development Programs",
    "Progress Tracking & Analytics",
    "Employee Upskilling & Reskilling",
];

const learnerPoints = [
    "Industry-Relevant Courses",
    "Hands-on Workshops & Bootcamps",
    "Internships with Top Companies",
    "Job Opportunities & Career Support",
];

const offerings = [
    {
        title: "LMS for Organizations",
        description:
            "Powerful, flexible and scalable learning management systems for corporate training and employee development.",
        icon: LMSimage,
    },
    {
        title: "Training & Learning Programs",
        description:
            "Structured courses, live sessions, bootcamps and hands-on projects to build real-world skills.",
        icon: Training,
    },
    {
        title: "Internships",
        description:
            "Industry-based internships with top companies to gain practical experience and build your portfolio.",
        icon: Internships,
    },
    {
        title: "Job Opportunities",
        description:
            "Direct placement support and hiring opportunities with our partner companies.",
        icon: Opportunities,
    },
];

function SolutionCard({
    type,
    title,
    subtitle,
    image,
    points,
}) {
    return (
        <div
            className={`solution-card ${type}`}
            style={{ backgroundImage: `url(${image})` }}
        >
            <div className="solution-card-content">
                <div className="solution-heading">
                    {type === "organization" ? (
                        <Building2 size={32} />
                    ) : (
                        <UserRound size={32} />
                    )}

                    <div>
                        <h3>{title}</h3>
                        <p>{subtitle}</p>
                    </div>
                </div>

                <div className="solution-points">
                    {points.map((point) => (
                        <div className="solution-point" key={point}>
                            <CheckCircle2 size={15} />
                            <span>{point}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PathwingVisual() {
    return (
        <div className="pathwing-visual">
            <div className="orbit-title">
                <span>LMS for</span>
                <strong>Organizations</strong>
            </div>

            <div className="orbit-system">
                <div className="orbit orbit-one"></div>
                <div className="orbit orbit-two"></div>

                <div className="orbit-arrow orbit-arrow-left">
                    ←
                </div>

                <div className="orbit-arrow orbit-arrow-right">
                    →
                </div>

                <div className="pathwing-center">
                    <img
                        src={pathwingLogo}
                        alt="TX Pathwing"
                    />

                    <strong>Pathwing</strong>
                </div>
            </div>

            <div className="orbit-bottom">
                <strong>Internships &</strong>
                <span>Job Opportunities</span>
            </div>
        </div>
    );
}

export default function WhoWeAre() {
    const navigate = useNavigate();
    return (
        <>
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1>
                            Empowering People.
                            <br />
                            Enabling Organizations.
                            <br />
                            <span>Building Future Talent.</span>
                        </h1>

                        <p className="hero-description">
                            TX-Pathwing is a complete learning and career
                            platform that provides LMS solutions to
                            organizations and helps individuals gain
                            industry-relevant skills, hands-on experience
                            through internships, and job opportunities.
                        </p>

                        <div className="hero-actions">
                            <button className="primary-button"
                            onClick={()=>navigate("/events")}>
                                Explore Our Ecosystem
                                <ArrowRight size={18} />
                            </button>

                            <button className="secondary-button"
                            onClick={()=>navigate("/contact")}>
                                Partner with Us
                            </button>
                        </div>
                    </div>

                    <div className="hero-visual-area">
                        <div className="hero-solution-grid">
                            <SolutionCard
                                type="organization"
                                title="For Organizations"
                                subtitle="Custom LMS Solutions"
                                image={Training}
                                points={organizationPoints}
                            />

                            <PathwingVisual />

                            <SolutionCard
                                type="learner"
                                title="For Learners"
                                subtitle="Skills → Experience → Jobs"
                                image={learner}
                                points={learnerPoints}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}