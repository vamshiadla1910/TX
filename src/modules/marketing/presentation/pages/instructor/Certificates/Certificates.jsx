import React, { useState, useMemo } from "react";
import { Award, CheckCircle2, Download, ExternalLink, Plus, Search, ShieldCheck, X } from "lucide-react";
import { Badge } from "../common/Badge";

export function Certificates({ certificates = [], onIssueCertificate }) {
  const [search, setSearch] = useState("");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [student, setStudent] = useState("");
  const [course, setCourse] = useState("AWS DevOps Engineer Professional");
  const [grade, setGrade] = useState("Distinction (98%)");

  const filtered = useMemo(() => {
    return certificates.filter((c) => {
      return (c.student + " " + c.course + " " + c.certCode).toLowerCase().includes(search.toLowerCase());
    });
  }, [certificates, search]);

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!student.trim()) return;
    const newCert = {
      id: `cert-${Date.now()}`,
      certCode: `CERT-PW-${Math.floor(80000 + Math.random() * 19999)}`,
      student,
      course,
      issuedDate: "Today",
      grade,
      status: "Verified",
      verificationUrl: "https://pathwing.in/verify"
    };
    if (onIssueCertificate) onIssueCertificate(newCert);
    setShowIssueModal(false);
    setStudent("");
  };

  return (
    <div className="certificates-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span> / <span>Instructor</span> / <strong className="current">Issued Credentials & Certificates</strong>
          </div>
          <h1 className="module-title">Credential Verification & Certificate Issuance</h1>
          <p className="module-sub">Award verifiable cryptographic completion credentials to graduating engineers.</p>
        </div>
        <button
          type="button"
          className="btn-primary-gradient"
          onClick={() => setShowIssueModal(true)}
        >
          <Award size={16} />
          <span>Issue New Certificate</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="card inst-kpi-card kpi-active-learners">
          <span className="inst-kpi-label">TOTAL ISSUED CREDENTIALS</span>
          <strong className="inst-kpi-value">{certificates.length}</strong>
          <small className="inst-kpi-foot positive">● 100% verifiable on ledger</small>
        </div>
        <div className="card inst-kpi-card kpi-completion-rate">
          <span className="inst-kpi-label">DISTINCTION RATE</span>
          <strong className="inst-kpi-value">78%</strong>
          <small className="inst-kpi-foot positive">Learners scoring &gt;90%</small>
        </div>
        <div className="card inst-kpi-card kpi-average-rating">
          <span className="inst-kpi-label">ACCREDITATION</span>
          <strong className="inst-kpi-value">ISO / AICTE</strong>
          <small className="inst-kpi-foot positive">Industry aligned verification</small>
        </div>
      </div>

      {/* Search */}
      <div className="card filter-bar-card">
        <div className="search-input-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search credential code, student name, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card submissions-table-card">
        <table className="dark-pro-table">
          <thead>
            <tr>
              <th>Credential ID</th>
              <th>Student Name</th>
              <th>Course Specialization</th>
              <th>Issue Date</th>
              <th>Grade / Honors</th>
              <th>Status</th>
              <th className="text-right">Verification</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="table-row">
                <td>
                  <strong className="font-mono text-cyan">{c.certCode}</strong>
                </td>
                <td>
                  <span className="student-name">{c.student}</span>
                </td>
                <td>
                  <span className="course-name-tag">{c.course}</span>
                </td>
                <td>
                  <span className="date-tag">{c.issuedDate}</span>
                </td>
                <td>
                  <strong className="score-val text-success">{c.grade}</strong>
                </td>
                <td>
                  <Badge tone="success"><ShieldCheck size={12} /> {c.status}</Badge>
                </td>
                <td className="text-right">
                  <a href={c.verificationUrl} target="_blank" rel="noreferrer" className="table-sub-link">
                    <ExternalLink size={12} /> Verify Link
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="modal-backdrop" onClick={() => setShowIssueModal(false)}>
          <form className="card modal-dialog" onClick={(e) => e.stopPropagation()} onSubmit={handleIssueSubmit}>
            <div className="modal-header">
              <h2>Issue Course Completion Certificate</h2>
              <button type="button" className="icon-button" onClick={() => setShowIssueModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body form-grid">
              <label>
                <span>Student Full Name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera Krishnan"
                  value={student}
                  onChange={(e) => setStudent(e.target.value)}
                />
              </label>

              <label>
                <span>Course</span>
                <select value={course} onChange={(e) => setCourse(e.target.value)}>
                  <option value="Java Full Stack Development">Java Full Stack Development</option>
                  <option value="AWS DevOps Engineer Professional">AWS DevOps Engineer Professional</option>
                  <option value="React 19 & Next.js Full Stack Engineering">React 19 & Next.js Full Stack Engineering</option>
                  <option value="Distributed Microservices & Kubernetes Architecture">Distributed Microservices & Kubernetes Architecture</option>
                </select>
              </label>

              <label>
                <span>Grade / Honors</span>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowIssueModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary-gradient">Issue Verified Credential</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
