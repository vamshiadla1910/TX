/**
 * CSV Utilities for Institution Dashboard
 * RFC-4180 compliant CSV generator and parser
 */

export function escapeCSVField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replaceAll('"', '""')}"`;
}

export function buildCSV(headers, rows) {
  const headerLine = headers.map(escapeCSVField).join(',');
  const rowLines = rows.map(row => row.map(escapeCSVField).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

export function triggerDownload(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}
