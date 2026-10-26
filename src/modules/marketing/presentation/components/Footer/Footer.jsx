import txIcon from "../../../../../assets/tx-icon.jpg";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
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
      { label: "For colleges", href: "/for-institutions" },
      { label: "For companies", href: "/for-corporate" },
      { label: "For instructors", href: "/for-instructors" },
      { label: "For employers", href: "/industry-partners" },
      { label: "Placement network", href: "/placement-network" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Learning journey", href: "/learner-journey" },
      { label: "Events calendar", href: "/events" },
      { label: "Course catalogue", href: "/marketplace" },
      { label: "Tech articles", href: "/blog" },
      { label: "Frequently asked questions", href: "/faq" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "For institutions", href: "/solutions/colleges" },
      { label: "Institution sign in", href: "/institution-signin" },
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
          <Link to="/" className="tx-footer-logo" aria-label={`${companyName} home`}>
            <img src={txIcon} alt={`${companyName} logo`} />
            <span>{companyName}</span>
          </Link>

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
                    <Link to={link.href}>{link.label}</Link>
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