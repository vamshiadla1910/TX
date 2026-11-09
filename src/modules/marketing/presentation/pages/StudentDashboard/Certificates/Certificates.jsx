import React, { useState, useEffect, useMemo } from "react";
import {
  CERTIFICATES_DATA,
  getCertificatesForUser,
  resolveStudentCertificateName
} from "./data/certificates.data";
import CertificatesHeader from "./components/CertificatesHeader";
import CertificateFeaturedPreview from "./components/CertificateFeaturedPreview";
import CertificatesGrid from "./components/CertificatesGrid";
import CertificateModal from "./components/CertificateModal";
import "./Certificates.css";

export default function Certificates({ userEmail: propEmail, userName: propName }) {
  const [activeEmail, setActiveEmail] = useState(() => {
    return (
      propEmail ||
      (typeof localStorage !== "undefined" ? localStorage.getItem("userEmail") : "") ||
      ""
    );
  });

  const [activeName, setActiveName] = useState(() => {
    return (
      propName ||
      (typeof localStorage !== "undefined" ? localStorage.getItem("userName") : "") ||
      ""
    );
  });

  // Sync state if props change
  useEffect(() => {
    if (propEmail) setActiveEmail(propEmail);
    if (propName) setActiveName(propName);
  }, [propEmail, propName]);

  // Reactive listener to auth changes / account creation
  useEffect(() => {
    const syncAuthData = () => {
      if (typeof localStorage !== "undefined") {
        const storedEmail = localStorage.getItem("userEmail") || "";
        const storedName = localStorage.getItem("userName") || "";
        setActiveEmail(storedEmail);
        setActiveName(storedName);
      }
    };

    window.addEventListener("storage", syncAuthData);
    window.addEventListener("authChanged", syncAuthData);
    return () => {
      window.removeEventListener("storage", syncAuthData);
      window.removeEventListener("authChanged", syncAuthData);
    };
  }, []);

  // Dynamically generate certificate items with recipient name from "Create your account" or email
  const dynamicCertificates = useMemo(() => {
    return getCertificatesForUser(activeEmail, activeName);
  }, [activeEmail, activeName]);

  const [selectedCertId, setSelectedCertId] = useState(
    () => CERTIFICATES_DATA[0]?.id || ""
  );
  const [previewModalCertId, setPreviewModalCertId] = useState(null);
  const [copiedId, setCopiedId] = useState("");

  const selectedCert = useMemo(() => {
    return (
      dynamicCertificates.find((c) => c.id === selectedCertId) ||
      dynamicCertificates[0] ||
      null
    );
  }, [dynamicCertificates, selectedCertId]);

  const previewModalCert = useMemo(() => {
    if (!previewModalCertId) return null;
    return (
      dynamicCertificates.find((c) => c.id === previewModalCertId) || null
    );
  }, [dynamicCertificates, previewModalCertId]);

  const handleCopyVerifyLink = (id) => {
    navigator.clipboard?.writeText(`https://pathwing.edu/verify/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const handleDownloadCertificate = (cert) => {
    setPreviewModalCertId(cert.id);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="certs-container">
      <CertificatesHeader totalCount={dynamicCertificates.length} />

      <CertificateFeaturedPreview
        selectedCert={selectedCert}
        copiedId={copiedId}
        onDownload={handleDownloadCertificate}
        onOpenPreview={(cert) => setPreviewModalCertId(cert.id)}
        onCopyLink={handleCopyVerifyLink}
      />

      <CertificatesGrid
        certificates={dynamicCertificates}
        selectedCert={selectedCert}
        onSelectCert={(cert) => setSelectedCertId(cert.id)}
        onDownload={handleDownloadCertificate}
        onOpenPreview={(cert) => setPreviewModalCertId(cert.id)}
      />

      <CertificateModal
        previewModalCert={previewModalCert}
        onClose={() => setPreviewModalCertId(null)}
      />
    </div>
  );
}
