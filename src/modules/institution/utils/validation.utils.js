/**
 * Validation Utilities for Institution Dashboard
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isNonEmptyString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

export function isValidProgress(val) {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(String(val).replace('%', '').trim());
  return !isNaN(num) && num >= 0 && num <= 100;
}

export function isValidPositiveNumber(val) {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !isNaN(num) && num > 0;
}
