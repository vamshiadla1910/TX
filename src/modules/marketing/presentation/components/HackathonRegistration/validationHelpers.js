export const validateEmail = (email) => {
  if (!email || !email.trim()) return "Email address is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Enter a valid email address (e.g. name@example.com)";
  return "";
};

export const validateMobile = (mobile, label = "Mobile number") => {
  if (!mobile || !mobile.trim()) return `${label} is required`;
  const cleanMobile = mobile.replace(/\D/g, "");
  if (cleanMobile.length !== 10) return `${label} must be exactly 10 digits`;
  return "";
};

export const validateOptionalMobile = (mobile, label = "Alternate contact") => {
  if (!mobile || !mobile.trim()) return "";
  const cleanMobile = mobile.replace(/\D/g, "");
  if (cleanMobile.length !== 10) return `${label} must be exactly 10 digits`;
  return "";
};

export const validateRequired = (val, label) => {
  if (!val || (typeof val === "string" && !val.trim())) return `${label} is required`;
  return "";
};

export const validateUrl = (url, label = "URL") => {
  if (!url || !url.trim()) return "";
  const urlRegex = /^(https?:\/\/)?([\w.-]+)+[\w\-_~:/?#[\]@!$&'()*+,;=.]+$/i;
  if (!urlRegex.test(url.trim())) return `Enter a valid ${label} (e.g. https://github.com/username)`;
  return "";
};

export const validateAlphaOnly = (val, label) => {
  if (!val || (typeof val === "string" && !val.trim())) return `${label} is required`;
  if (/[0-9]/.test(val)) return `${label} must contain letters only (numbers are not allowed)`;
  const alphaRegex = /^[A-Za-z\s.\-']+$/;
  if (!alphaRegex.test(val.trim())) return `${label} must contain valid alphabetic characters only`;
  return "";
};

export const validateDateNotPast = (dateStr, label = "Date") => {
  if (!dateStr || !dateStr.trim()) return `${label} is required`;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (dateStr < todayStr) return `${label} cannot be a past date (select today or a future date)`;
  return "";
};

export const validateDateNotFuture = (dateStr, label = "Date") => {
  if (!dateStr || !dateStr.trim()) return `${label} is required`;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (dateStr > todayStr) return `${label} cannot be a future date (select today or a past date)`;
  return "";
};
