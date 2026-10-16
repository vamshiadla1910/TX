import React, { useMemo, useState } from "react";
import "./Certificates.css";
import {
  Award, CheckCircle2, Download, Eye, Filter,
  Search, SearchX, ShieldAlert, ShieldCheck, X, XCircle
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Certificates({
  certificates,
  setCertificates,
  setNotice
}) {
  const [selectedCert, setSelectedCert] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return certificates.filter(c => {
      const matchSearch = `${c.certNumber} ${c.recipient} ${c.email} ${c.course} ${c.verifyingOrg}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [certificates, search, statusFilter]);

  const verifiedCount = certificates.filter(c => c.status === "Verified").length;
  const pendingCount = certificates.filter(c => c.status === "Pending Eligibility").length;

  function handleVerify(id) {
    setCertificates(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = {
            ...c,
            status: "Verified",
            hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
            grade: c.grade === "Under Evaluation" ? "Pass (85%)" : c.grade
          };
          if (selectedCert && selectedCert.id === id) {
            setSelectedCert(updated);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice(`Certificate marked Verified with cryptographic ledger signature.`);
  }

  function handleRevoke(id) {
    setCertificates(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, status: "Revoked" };
          if (selectedCert && selectedCert.id === id) {
            setSelectedCert(updated);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice(`Certificate revoked.`);
  }

  function handleDownloadPDF(cert) {
    const textData = `PATHWING PLATFORM VERIFIED CREDENTIAL\n\n` +
      `Certificate Number: ${cert.certNumber}\n` +
      `Recipient: ${cert.recipient} (${cert.email})\n` +
      `Program/Course: ${cert.course}\n` +
      `Issuing Institution: ${cert.verifyingOrg}\n` +
      `Grade/Honors: ${cert.grade}\n` +
      `Issue Date: ${cert.issueDate}\n` +
      `Verification Hash: ${cert.hash}\n` +
      `Status: ${cert.status}\n`;

    const blob = new Blob([textData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${cert.certNumber}_verification.txt`;
    link.click();
    setNotice(`Credential certificate file generated for ${cert.certNumber}.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="ISSUED CREDENTIALS" value={(6482 + certificates.length - 4).toLocaleString("en-IN")} foot="Platform total" icon={Award} />
        <Metric label="VERIFIED CERTIFICATES" value={(6201 + verifiedCount - 3).toLocaleString("en-IN")} foot="On-chain hash match" icon={ShieldCheck} />
        <Metric label="PENDING ELIGIBILITY" value={String(86 + pendingCount - 1)} foot="Assessment checks" icon={ShieldAlert} tone="warning" />
        <Metric label="REQUIRING REVIEW" value="12" foot="Flagged integrity" icon={CheckCircle2} />
      </div>

      {selectedCert ? (
        <InlineDetailView
          title={`Certificate: ${selectedCert.certNumber}`}
          subtitle={`${selectedCert.course} · Awarded to ${selectedCert.recipient}`}
          status={selectedCert.status}
          id={selectedCert.id}
          onBack={() => setSelectedCert(null)}
          actions={
            <>
              {selectedCert.status !== "Verified" && (
                <button
                  className="primary btn-sm"
                  onClick={() => handleVerify(selectedCert.id)}
                >
                  <CheckCircle2 size={14} /> Verify & Issue Hash
                </button>
              )}
              {selectedCert.status !== "Revoked" && (
                <button
                  className="secondary btn-sm btn-danger"
                  onClick={() => handleRevoke(selectedCert.id)}
                >
                  <XCircle size={14} /> Revoke Credential
                </button>
              )}
              <button
                className="secondary btn-sm"
                onClick={() => handleDownloadPDF(selectedCert)}
              >
                <Download size={14} /> Export Credential
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Recipient & Course Information</h3>
              <div className="detail-fields-list">
                <DetailField label="Certificate Identifier" value={selectedCert.certNumber} mono />
                <DetailField label="Recipient Name" value={selectedCert.recipient} />
                <DetailField label="Student Email" value={selectedCert.email} mono />
                <DetailField label="Certified Course" value={selectedCert.course} />
                <DetailField label="Credential Category" value={selectedCert.type} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Verification & Integrity</h3>
              <div className="detail-fields-list">
                <DetailField label="Issuing Authority" value={selectedCert.verifyingOrg} />
                <DetailField label="Instructor Signatory" value={selectedCert.issuedBy} />
                <DetailField label="Grade Achieved" value={selectedCert.grade} />
                <DetailField label="Issue Date" value={selectedCert.issueDate} />
                <DetailField label="Cryptographic Hash" value={selectedCert.hash} mono />
                <DetailField label="Verification Status">
                  <Badge tone={getStatusTone(selectedCert.status)}>{selectedCert.status}</Badge>
                </DetailField>
              </div>
            </div>
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Issued Certificates & Verification Registry</h2>
              <Badge>{filtered.length} shown</Badge>
            </div>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search certificate ID, recipient, course..."
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Verified">Verified</option>
                <option value="Pending Eligibility">Pending Eligibility</option>
                <option value="Revoked">Revoked</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cert ID</th>
                  <th>Recipient</th>
                  <th>Course / Program</th>
                  <th>Issue Date</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr
                    key={c.id}
                    className="hoverable-row"
                    onClick={() => setSelectedCert(c)}
                  >
                    <td className="font-mono">{c.certNumber}</td>
                    <td>
                      <strong>{c.recipient}</strong>
                      <small className="row-sub font-mono">{c.email}</small>
                    </td>
                    <td>{c.course}</td>
                    <td><small>{c.issueDate}</small></td>
                    <td><Badge tone="neutral">{c.grade}</Badge></td>
                    <td><Badge tone={getStatusTone(c.status)}>{c.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedCert(c);
                        }}
                      >
                        <Eye size={13} /> View Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <SearchX size={28} />
              <p>No certificates found matching your criteria.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
