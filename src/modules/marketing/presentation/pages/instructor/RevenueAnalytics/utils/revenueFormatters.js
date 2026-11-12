/**
 * Pure formatters, date window resolvers, and revenue aggregation utilities.
 * Decoupled from React and Chart.js so all business math can run cleanly in Node unit tests.
 */

export const DATE_RANGE_PRESETS = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "14d", label: "Last 14 days", days: 14 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "6m", label: "Last 6 months", days: 180 },
  { id: "custom", label: "Custom range", days: null }
];

const MONTH_SHORT_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Format numeric amount consistently in Indian Rupees (₹).
 * @param {number} amount
 * @returns {string}
 */
export function formatINR(amount) {
  const safeNum = Number(amount);
  if (!Number.isFinite(safeNum)) return "₹0";
  const rounded = Math.round(safeNum);
  const absFormatted = Math.abs(rounded).toLocaleString("en-IN");
  return rounded < 0 ? `-₹${absFormatted}` : `₹${absFormatted}`;
}

/**
 * Format compact INR ticks for chart axes (e.g., ₹45K, ₹1.8L).
 * @param {number} amount
 * @returns {string}
 */
export function formatCompactINR(amount) {
  const safeNum = Number(amount);
  if (!Number.isFinite(safeNum) || safeNum === 0) return "₹0";
  const abs = Math.abs(safeNum);
  const sign = safeNum < 0 ? "-" : "";
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  }
  if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `${sign}₹${Math.round(abs)}`;
}

/**
 * Format local YYYY-MM-DD key from a Date or parseable string.
 * @param {Date|string} input
 * @returns {string}
 */
export function formatDateKey(input) {
  if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.trim())) {
    return input.trim();
  }
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Parse a YYYY-MM-DD key into a local midnight Date.
 * @param {string} dateKey
 * @returns {Date}
 */
export function parseDateKey(dateKey) {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Shift a YYYY-MM-DD key by deltaDays.
 * @param {string} dateKey
 * @param {number} deltaDays
 * @returns {string}
 */
export function shiftDateKey(dateKey, deltaDays) {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() + deltaDays);
  return formatDateKey(d);
}

/**
 * Extract YYYY-MM-DD date key from a transaction record.
 * @param {Object} tx
 * @returns {string}
 */
export function extractTransactionDateKey(tx) {
  if (!tx) return "";
  if (tx.paidDate && /^\d{4}-\d{2}-\d{2}$/.test(tx.paidDate)) {
    return tx.paidDate;
  }
  const isoSource = tx.paidAt || tx.paid_at || tx.createdAt;
  return isoSource ? formatDateKey(isoSource) : "";
}

/**
 * Format YYYY-MM-DD key as human-readable label (e.g., "11 Nov").
 * @param {string} dateKey
 * @returns {string}
 */
export function formatShortDayLabel(dateKey) {
  const [, month, day] = dateKey.split("-").map(Number);
  return `${String(day).padStart(2, "0")} ${MONTH_SHORT_NAMES[(month || 1) - 1]}`;
}

/**
 * Format YYYY-MM month key as "Nov 2026".
 * @param {string} monthKey
 * @returns {string}
 */
export function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return `${MONTH_SHORT_NAMES[(month || 1) - 1]} ${year}`;
}

/**
 * Resolve date window bounds and comparison window for a preset or custom filter.
 * @param {Object} params
 * @param {"7d"|"14d"|"30d"|"6m"|"custom"} [params.preset]
 * @param {string} [params.customStart]
 * @param {string} [params.customEnd]
 * @param {Date|string} [referenceDate]
 * @returns {Object}
 */
export function resolveDateWindow(
  { preset = "30d", customStart = "", customEnd = "" } = {},
  referenceDate = new Date()
) {
  const todayKey = formatDateKey(referenceDate);

  let startDateStr;
  let endDateStr = todayKey;

  if (preset === "custom") {
    if (!customStart || !customEnd) {
      return {
        isValid: false,
        error: "Select both start and end dates for a custom range.",
        preset
      };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(customStart) || !/^\d{4}-\d{2}-\d{2}$/.test(customEnd)) {
      return {
        isValid: false,
        error: "Invalid custom date format.",
        preset
      };
    }
    if (customStart > customEnd) {
      return {
        isValid: false,
        error: "Start date must be on or before end date.",
        preset
      };
    }
    startDateStr = customStart;
    endDateStr = customEnd;
  } else if (preset === "6m") {
    const endParsed = parseDateKey(todayKey);
    const sixMonthsStart = new Date(
      endParsed.getFullYear(),
      endParsed.getMonth() - 5,
      1,
      0,
      0,
      0,
      0
    );
    startDateStr = formatDateKey(sixMonthsStart);
  } else {
    const presetMeta = DATE_RANGE_PRESETS.find((p) => p.id === preset);
    const days = presetMeta?.days || 30;
    startDateStr = shiftDateKey(todayKey, -(days - 1));
  }

  const startMs = parseDateKey(startDateStr).getTime();
  const endMs = parseDateKey(endDateStr).getTime();
  const daysCount = Math.max(1, Math.round((endMs - startMs) / 86400000) + 1);

  const prevEndDateStr = shiftDateKey(startDateStr, -1);
  const prevStartDateStr = shiftDateKey(prevEndDateStr, -(daysCount - 1));

  return {
    isValid: true,
    error: null,
    preset,
    startDateStr,
    endDateStr,
    prevStartDateStr,
    prevEndDateStr,
    daysCount,
    granularity: daysCount > 45 ? "monthly" : "daily"
  };
}

/**
 * Compute percentage change between current and prior values cleanly.
 * @param {number} current
 * @param {number} previous
 * @param {string} [comparisonText]
 * @returns {{ percent: number, label: string, tone: "positive"|"danger"|"neutral", direction: "up"|"down"|"flat" }}
 */
export function computeGrowthDelta(current, previous, comparisonText = "vs prior period") {
  const curr = Number(current) || 0;
  const prev = Number(previous) || 0;

  const rawPct =
    prev === 0
      ? (curr > 0 ? 100 : 0)
      : ((curr - prev) / Math.abs(prev)) * 100;

  const rounded = Number(rawPct.toFixed(1));
  const direction = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
  const tone = rounded > 0 ? "positive" : rounded < 0 ? "danger" : "neutral";
  const prefix = rounded > 0 ? "▲ +" : rounded < 0 ? "▼ " : "● ";

  return {
    percent: rounded,
    label: `${prefix}${rounded}% ${comparisonText}`,
    tone,
    direction
  };
}

/**
 * Generate ordered list of YYYY-MM-DD keys between start and end inclusive.
 */
function buildDayKeys(startDateStr, endDateStr) {
  const result = [];
  let cursor = startDateStr;
  let guard = 0;
  while (cursor <= endDateStr && guard < 800) {
    result.push(cursor);
    cursor = shiftDateKey(cursor, 1);
    guard += 1;
  }
  return result;
}

/**
 * Generate ordered list of YYYY-MM keys between start and end inclusive.
 */
function buildMonthKeys(startDateStr, endDateStr) {
  const start = parseDateKey(startDateStr);
  const end = parseDateKey(endDateStr);
  const result = [];
  let y = start.getFullYear();
  let m = start.getMonth();
  const endY = end.getFullYear();
  const endM = end.getMonth();

  let guard = 0;
  while ((y < endY || (y === endY && m <= endM)) && guard < 60) {
    result.push(`${y}-${String(m + 1).padStart(2, "0")}`);
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
    guard += 1;
  }
  return result;
}

/**
 * Shift a YYYY-MM month key by deltaMonths.
 */
function shiftMonthKey(monthKey, deltaMonths) {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1 + deltaMonths, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Aggregate all KPI cards and 4 chart datasets directly from raw transaction records.
 * Enforces strict instructor isolation and paid-status filtering.
 *
 * @param {Object} params
 * @param {Array<Object>} params.transactions
 * @param {string} params.instructorId
 * @param {Object} params.window - Valid window returned by resolveDateWindow
 * @param {Array<Object>} [params.courses]
 * @param {Array<Object>} [params.batches]
 * @returns {Object}
 */
export function aggregateRevenueAnalytics({
  transactions = [],
  instructorId,
  window: dateWindow,
  courses = [],
  batches = []
}) {
  if (!instructorId) {
    throw new Error("Instructor identity is required to access revenue analytics.");
  }

  const courseLookup = new Map(courses.map((c) => [c.id, c]));
  const batchLookup = new Map(batches.map((b) => [b.id, b]));

  // Strict authorization scoping: only retain transactions belonging to the authenticated instructor
  const instructorTx = transactions.filter((tx) => tx && tx.instructorId === instructorId);
  const paidInstructorTx = instructorTx.filter((tx) => tx.status === "paid");

  const { startDateStr, endDateStr, prevStartDateStr, prevEndDateStr, granularity } = dateWindow;

  const currentPaidTx = paidInstructorTx.filter((tx) => {
    const key = extractTransactionDateKey(tx);
    return key >= startDateStr && key <= endDateStr;
  });

  const previousPaidTx = paidInstructorTx.filter((tx) => {
    const key = extractTransactionDateKey(tx);
    return key >= prevStartDateStr && key <= prevEndDateStr;
  });

  const currentRefundedCount = instructorTx.filter((tx) => {
    const key = extractTransactionDateKey(tx);
    return tx.status === "refunded" && key >= startDateStr && key <= endDateStr;
  }).length;

  const sumMetrics = (list) => {
    return list.reduce(
      (acc, tx) => {
        const net = Number(tx.netAmount ?? tx.net_amount ?? 0);
        const gross = Number(tx.grossAmount ?? tx.gross_amount ?? net);
        acc.net += net;
        acc.gross += gross;
        acc.count += 1;
        return acc;
      },
      { net: 0, gross: 0, count: 0 }
    );
  };

  const currTotals = sumMetrics(currentPaidTx);
  const prevTotals = sumMetrics(previousPaidTx);

  // Latest active calendar month bounded within [startDateStr, endDateStr]
  const latestMonthKey = endDateStr.slice(0, 7);
  const prevCalendarMonthKey = shiftMonthKey(latestMonthKey, -1);

  const currentMonthInFilterNet = currentPaidTx
    .filter((tx) => extractTransactionDateKey(tx).slice(0, 7) === latestMonthKey)
    .reduce((sum, tx) => sum + Number(tx.netAmount ?? 0), 0);

  // Compare against immediately preceding calendar month across instructor records
  const priorMonthNet = paidInstructorTx
    .filter((tx) => extractTransactionDateKey(tx).slice(0, 7) === prevCalendarMonthKey)
    .reduce((sum, tx) => sum + Number(tx.netAmount ?? 0), 0);

  const currAvgPerEnrollment =
    currTotals.count > 0 ? Math.round(currTotals.net / currTotals.count) : 0;
  const prevAvgPerEnrollment =
    prevTotals.count > 0 ? Math.round(prevTotals.net / prevTotals.count) : 0;

  const kpis = {
    totalRevenue: {
      value: currTotals.net,
      grossValue: currTotals.gross,
      formattedValue: formatINR(currTotals.net),
      delta: computeGrowthDelta(currTotals.net, prevTotals.net, "vs previous period"),
      subtitle: `Gross ${formatINR(currTotals.gross)} before platform fee`
    },
    monthlyRevenue: {
      value: currentMonthInFilterNet,
      monthLabel: formatMonthLabel(latestMonthKey),
      formattedValue: formatINR(currentMonthInFilterNet),
      delta: computeGrowthDelta(
        currentMonthInFilterNet,
        priorMonthNet,
        `vs ${formatMonthLabel(prevCalendarMonthKey)}`
      ),
      subtitle: `${formatMonthLabel(latestMonthKey)} net inside selected range`
    },
    totalTransactions: {
      value: currTotals.count,
      refundedCount: currentRefundedCount,
      formattedValue: currTotals.count.toLocaleString("en-IN"),
      delta: computeGrowthDelta(currTotals.count, prevTotals.count, "vs previous period"),
      subtitle:
        currentRefundedCount > 0
          ? `${currentRefundedCount} refunded excluded`
          : "Completed learner enrollments"
    },
    avgRevenuePerEnrollment: {
      value: currAvgPerEnrollment,
      formattedValue: formatINR(currAvgPerEnrollment),
      delta: computeGrowthDelta(currAvgPerEnrollment, prevAvgPerEnrollment, "vs previous period"),
      subtitle: "Net revenue per paid enrollment"
    }
  };

  // Chart 1: Revenue Over Time (Daily or Monthly buckets)
  let overTime;
  if (granularity === "daily") {
    const dayKeys = buildDayKeys(startDateStr, endDateStr);
    const dayMap = new Map(
      dayKeys.map((k) => [k, { net: 0, gross: 0, count: 0 }])
    );
    currentPaidTx.forEach((tx) => {
      const k = extractTransactionDateKey(tx);
      const bucket = dayMap.get(k);
      if (bucket) {
        bucket.net += Number(tx.netAmount ?? 0);
        bucket.gross += Number(tx.grossAmount ?? 0);
        bucket.count += 1;
      }
    });
    overTime = {
      granularity: "daily",
      keys: dayKeys,
      labels: dayKeys.map(formatShortDayLabel),
      netSeries: dayKeys.map((k) => dayMap.get(k).net),
      grossSeries: dayKeys.map((k) => dayMap.get(k).gross),
      txCounts: dayKeys.map((k) => dayMap.get(k).count)
    };
  } else {
    const monthKeys = buildMonthKeys(startDateStr, endDateStr);
    const monthMap = new Map(
      monthKeys.map((k) => [k, { net: 0, gross: 0, count: 0 }])
    );
    currentPaidTx.forEach((tx) => {
      const mKey = extractTransactionDateKey(tx).slice(0, 7);
      const bucket = monthMap.get(mKey);
      if (bucket) {
        bucket.net += Number(tx.netAmount ?? 0);
        bucket.gross += Number(tx.grossAmount ?? 0);
        bucket.count += 1;
      }
    });
    overTime = {
      granularity: "monthly",
      keys: monthKeys,
      labels: monthKeys.map(formatMonthLabel),
      netSeries: monthKeys.map((k) => monthMap.get(k).net),
      grossSeries: monthKeys.map((k) => monthMap.get(k).gross),
      txCounts: monthKeys.map((k) => monthMap.get(k).count)
    };
  }

  // Chart 2: Monthly Revenue Comparison (filtered months + prior month comparison baseline)
  const filteredMonthKeys = buildMonthKeys(startDateStr, endDateStr);
  const allMonthNetTotals = new Map();
  paidInstructorTx.forEach((tx) => {
    const mKey = extractTransactionDateKey(tx).slice(0, 7);
    if (mKey) {
      allMonthNetTotals.set(
        mKey,
        (allMonthNetTotals.get(mKey) || 0) + Number(tx.netAmount ?? 0)
      );
    }
  });

  const filteredMonthSums = new Map(filteredMonthKeys.map((m) => [m, 0]));
  currentPaidTx.forEach((tx) => {
    const mKey = extractTransactionDateKey(tx).slice(0, 7);
    if (filteredMonthSums.has(mKey)) {
      filteredMonthSums.set(mKey, filteredMonthSums.get(mKey) + Number(tx.netAmount ?? 0));
    }
  });

  const monthlyComparison = {
    keys: filteredMonthKeys,
    labels: filteredMonthKeys.map(formatMonthLabel),
    currentSeries: filteredMonthKeys.map((m) => filteredMonthSums.get(m) || 0),
    priorBaselineSeries: filteredMonthKeys.map(
      (m) => allMonthNetTotals.get(shiftMonthKey(m, -1)) || 0
    )
  };

  // Chart 3: Revenue by Course (Doughnut with percentages)
  const courseAccumulator = new Map();
  currentPaidTx.forEach((tx) => {
    const cId = tx.courseId || "crs-unassigned";
    const matchedCourse = courseLookup.get(cId);
    const title = matchedCourse?.title || tx.courseTitle || "Other Course";
    const code = matchedCourse?.code || tx.courseCode || "COURSE";
    const prev = courseAccumulator.get(cId) || {
      courseId: cId,
      code,
      title,
      netRevenue: 0,
      grossRevenue: 0,
      transactions: 0
    };
    prev.netRevenue += Number(tx.netAmount ?? 0);
    prev.grossRevenue += Number(tx.grossAmount ?? 0);
    prev.transactions += 1;
    courseAccumulator.set(cId, prev);
  });

  const byCourse = Array.from(courseAccumulator.values())
    .sort((a, b) => b.netRevenue - a.netRevenue)
    .map((item) => ({
      ...item,
      percentage:
        currTotals.net > 0
          ? Number(((item.netRevenue / currTotals.net) * 100).toFixed(1))
          : 0
    }));

  // Chart 4: Revenue by Batch (Bar)
  const batchAccumulator = new Map();
  currentPaidTx.forEach((tx) => {
    const bId = tx.batchId || "batch-self";
    const matchedBatch = batchLookup.get(bId);
    const name =
      matchedBatch?.name ||
      tx.batchName ||
      (bId === "batch-self" ? "Direct / Self-Paced Enrollment" : "Unassigned Cohort");
    const code =
      matchedBatch?.code ||
      tx.batchCode ||
      (bId === "batch-self" ? "SELF-PACED" : bId);
    const courseName = matchedBatch?.courseName || tx.courseTitle || "";

    const prev = batchAccumulator.get(bId) || {
      batchId: bId,
      code,
      name,
      courseName,
      netRevenue: 0,
      transactions: 0
    };
    prev.netRevenue += Number(tx.netAmount ?? 0);
    prev.transactions += 1;
    batchAccumulator.set(bId, prev);
  });

  const byBatch = Array.from(batchAccumulator.values()).sort(
    (a, b) => b.netRevenue - a.netRevenue
  );

  return {
    instructorId,
    window: dateWindow,
    isEmpty: currentPaidTx.length === 0,
    transactionCount: currentPaidTx.length,
    kpis,
    charts: {
      overTime,
      monthlyComparison,
      byCourse,
      byBatch
    }
  };
}
