import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeName,
  extractStudentNameFromEmail,
  resolveStudentCertificateName,
  getCertificatesForUser,
  CERTIFICATES_DATA,
} from "./data/certificates.data.js";

test("sanitizeName strips numbers and unwanted symbols, keeping capitalized name", () => {
  assert.equal(sanitizeName("John Doe"), "John Doe");
  assert.equal(sanitizeName("Aditya Reddy"), "Aditya Reddy");
  assert.equal(sanitizeName("Praveen Kumar 123"), "Praveen Kumar");
  assert.equal(sanitizeName("Pooja_Hegde#99"), "Pooja Hegde");
  assert.equal(sanitizeName("rahul.sharma"), "Rahul Sharma");
  assert.equal(sanitizeName(""), "");
});

test("extractStudentNameFromEmail extracts name and surname without numbers or symbols", () => {
  // Common email formats with dots, underscores, numbers, and tags
  assert.equal(extractStudentNameFromEmail("aditya.reddy@gmail.com"), "Aditya Reddy");
  assert.equal(extractStudentNameFromEmail("john.doe123@gmail.com"), "John Doe");
  assert.equal(extractStudentNameFromEmail("alex_smith99@yahoo.com"), "Alex Smith");
  assert.equal(extractStudentNameFromEmail("sarah-connor@domain.com"), "Sarah Connor");
  assert.equal(extractStudentNameFromEmail("rahul.kumar#2026@test.com"), "Rahul Kumar");
  assert.equal(extractStudentNameFromEmail("johnDoe@example.com"), "John Doe");
  assert.equal(extractStudentNameFromEmail("praveen.kumar.reddy12@gmail.com"), "Praveen Kumar Reddy");
  assert.equal(extractStudentNameFromEmail("alice99@gmail.com"), "Alice");
  assert.equal(extractStudentNameFromEmail("student@pathwing.com"), "Aditya Reddy");
  assert.equal(extractStudentNameFromEmail(""), "Aditya Reddy");
});

test("resolveStudentCertificateName prioritizes name from Create your account page", () => {
  // If user entered "Aditya Reddy" in Create your account page in the name field
  const aditya = resolveStudentCertificateName("user123@gmail.com", "Aditya Reddy");
  assert.equal(aditya, "Aditya Reddy");

  // If user entered name in Create your account page
  const resolved = resolveStudentCertificateName("user123@gmail.com", "Vikram Rathore");
  assert.equal(resolved, "Vikram Rathore");

  // If user entered name with numbers in Create your account page, numbers are stripped
  const cleaned = resolveStudentCertificateName("user123@gmail.com", "Vikram Rathore 99");
  assert.equal(cleaned, "Vikram Rathore");

  // Fallback to email if no name was provided
  const fromEmail = resolveStudentCertificateName("vikram.rathore99@gmail.com", "");
  assert.equal(fromEmail, "Vikram Rathore");
});

test("getCertificatesForUser maps all certificates with the dynamically resolved name", () => {
  const adityaCerts = getCertificatesForUser("aditya@gmail.com", "Aditya Reddy");
  assert.equal(adityaCerts.length, CERTIFICATES_DATA.length);
  for (const cert of adityaCerts) {
    assert.equal(cert.studentName, "Aditya Reddy");
  }

  const certs = getCertificatesForUser("praveen.kumar@gmail.com", "Praveen Kumar");
  assert.equal(certs.length, CERTIFICATES_DATA.length);
  for (const cert of certs) {
    assert.equal(cert.studentName, "Praveen Kumar");
  }

  const certsFromEmail = getCertificatesForUser("sarah.connor123@gmail.com");
  for (const cert of certsFromEmail) {
    assert.equal(cert.studentName, "Sarah Connor");
  }
});
