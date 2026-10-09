import React from "react";
import txIcon from "../../../../../assets/tx-icon.jpg";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./Footer.css";

const FOOTER_COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Programs", href: "/programs" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "AI layer", href: "/ai-layer" },
      { label: "Learner journey", href: "/learner-journey" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "For colleges", href: "/solutions/colleges" },
      { label: "For companies", href: "/solutions/companies" },
      { label: "For instructors", href: "/solutions/instructors" },
      { label: "For employers", href: "/solutions/employers" },
      { label: "Placement network", href: "/placement-network" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Verify a certificate", href: "/verify" },
      { label: "Student handbook", href: "/resources/student-handbook" },
      { label: "Internship handbook", href: "/resources/internship-handbook" },
      { label: "Corporate catalogue", href: "/resources/corporate-catalogue" },
      { label: "College partnership brochure", href: "/resources/college-brochure" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Help centre", href: "/help" },
      { label: "Security", href: "/security" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms and refunds", href: "/terms" },
    ],
  },
];

export default function Footer({
  companyName = "",
  tagline = "A closed-loop education-to-employment platform for learners, institutions, employers and the people who teach them.",
  email = "info@tanvox.in",
  phone = "+91 96765 07387",
  address = ["3rd Floor, Tanvox Technologies Pvt Ltd, Plot No: 25, 305, Ayyappa Society Main Rd, opposite The pickle yard, SBH Officers Colony, Mega Hills, Madhapur, Hyderabad, Telangana 500081"],
  year = new Date().getFullYear(),
  builtFor = "Built for Tanvox Technologies",
}) {
  return (
    <footer className="tx-footer">
      <div className="tx-footer-top">
        <div className="tx-footer-brand">
          <a href="/" className="tx-footer-logo" aria-label={`${companyName} home`}>
            <img src={txIcon} alt={`${companyName} logo`} />
            <span>{companyName}</span>
          </a>

          <p className="tx-footer-tagline">{tagline}</p>

          <ul className="tx-footer-contact">
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
            </li>
            <li>
              {address.map((line) => (
                <span key={line} className="tx-footer-address-line">
                  {line}
                </span>
              ))}
            </li>
          </ul>
        </div>

        <nav className="tx-footer-columns" aria-label="Footer">
          {FOOTER_COLUMNS.map((column) => (
            <div className="tx-footer-column" key={column.heading}>
              <h3>{column.heading}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="footer-social-row">
            {[
              {
                Icon: FaFacebook,
                link: "https://www.facebook.com/share/1a3pcCH8kK/",
              },
              {
                Icon: FaTwitter,
                link: "https://x.com/tanvox2025",
              },
              {
                Icon: FaLinkedin,
                link: "https://www.linkedin.com/company/tx-path-wing/",
              },
              {
                Icon: FaInstagram,
                link: "https://www.instagram.com/tx_pathwing/",
              },
            ].map(({ Icon, link }, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
              >
                <Icon size={25} />
              </a>
            ))}
          </div>

      <div className="tx-footer-bottom">
        <p>
          © {year} {companyName}. All rights reserved.
        </p>
        <p className="tx-footer-builtfor">{builtFor}</p>
      </div>
    </footer>
  );
}