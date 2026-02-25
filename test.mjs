import assert from 'node:assert/strict';
import {
  toHijriDate,
  fromHijriDate,
  isValidHijriDate,
  getHijriYear,
  getHijriMonth,
  getHijriDay,
  getDaysInHijriMonth,
  getHijriMonthName,
  getHijriWeekdayName,
  formatHijriDate,
  addHijriMonths,
  addHijriYears,
  startOfHijriMonth,
  endOfHijriMonth,
  isSameHijriMonth,
  isSameHijriYear,
  getHijriQuarter,
} from './dist/index.mjs';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[${name}]... PASS`);
    passed++;
  } catch (err) {
    console.error(`[${name}]... FAIL: ${err.message}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// toHijriDate
// ---------------------------------------------------------------------------

test('toHijriDate: 1 Ramadan 1444', () => {
  const h = toHijriDate(new Date(2023, 2, 23, 12));
  assert.ok(h !== null, 'expected non-null');
  assert.equal(h.hy, 1444);
  assert.equal(h.hm, 9);
  assert.equal(h.hd, 1);
});

test('toHijriDate: 1 Muharram 1446', () => {
  const h = toHijriDate(new Date(2024, 6, 7, 12));
  assert.ok(h !== null, 'expected non-null');
  assert.equal(h.hy, 1446);
  assert.equal(h.hm, 1);
  assert.equal(h.hd, 1);
});

test('toHijriDate: out of range returns null', () => {
  const h = toHijriDate(new Date(1800, 0, 1));
  assert.equal(h, null);
});

// ---------------------------------------------------------------------------
// fromHijriDate
// ---------------------------------------------------------------------------

test('fromHijriDate: 1 Ramadan 1444 -> 2023-03-23', () => {
  const d = fromHijriDate(1444, 9, 1);
  assert.equal(d.getUTCFullYear(), 2023);
  assert.equal(d.getUTCMonth(), 2); // March
  assert.equal(d.getUTCDate(), 23);
});

test('fromHijriDate: 1 Muharram 1446 -> 2024-07-07', () => {
  const d = fromHijriDate(1446, 1, 1);
  assert.equal(d.getUTCFullYear(), 2024);
  assert.equal(d.getUTCMonth(), 6); // July
  assert.equal(d.getUTCDate(), 7);
});

test('fromHijriDate: throws on invalid month', () => {
  assert.throws(() => fromHijriDate(1444, 13, 1), /invalid|range/i);
});

// ---------------------------------------------------------------------------
// isValidHijriDate
// ---------------------------------------------------------------------------

test('isValidHijriDate: valid date', () => {
  assert.equal(isValidHijriDate(1444, 9, 1), true);
});

test('isValidHijriDate: invalid month 13', () => {
  assert.equal(isValidHijriDate(1444, 13, 1), false);
});

test('isValidHijriDate: day 0 is invalid', () => {
  assert.equal(isValidHijriDate(1444, 9, 0), false);
});

// ---------------------------------------------------------------------------
// Field getters
// ---------------------------------------------------------------------------

const REF = new Date(2023, 2, 23, 12); // 1 Ramadan 1444

test('getHijriYear', () => {
  assert.equal(getHijriYear(REF), 1444);
});

test('getHijriMonth', () => {
  assert.equal(getHijriMonth(REF), 9);
});

test('getHijriDay', () => {
  assert.equal(getHijriDay(REF), 1);
});

test('getHijriYear: out of range returns null', () => {
  assert.equal(getHijriYear(new Date(1800, 0, 1)), null);
});

// ---------------------------------------------------------------------------
// getDaysInHijriMonth
// ---------------------------------------------------------------------------

test('getDaysInHijriMonth: Ramadan 1444', () => {
  const days = getDaysInHijriMonth(1444, 9);
  // Must be either 29 or 30
  assert.ok(days === 29 || days === 30, `expected 29 or 30, got ${days}`);
});

test('getDaysInHijriMonth: month 1 of 1444', () => {
  const days = getDaysInHijriMonth(1444, 1);
  assert.ok(days === 29 || days === 30, `expected 29 or 30, got ${days}`);
});

// ---------------------------------------------------------------------------
// getHijriMonthName
// ---------------------------------------------------------------------------

test('getHijriMonthName: long (default)', () => {
  assert.equal(getHijriMonthName(9), 'Ramadan');
});

test('getHijriMonthName: medium', () => {
  assert.equal(getHijriMonthName(9, 'medium'), 'Ramadan');
});

test('getHijriMonthName: short', () => {
  assert.equal(getHijriMonthName(9, 'short'), 'Ram');
});

test('getHijriMonthName: Muharram long', () => {
  assert.equal(getHijriMonthName(1), 'Muharram');
});

test('getHijriMonthName: Dhul Hijjah long', () => {
  assert.equal(getHijriMonthName(12), 'Dhul Hijjah');
});

test('getHijriMonthName: throws on month 0', () => {
  assert.throws(() => getHijriMonthName(0), RangeError);
});

test('getHijriMonthName: throws on month 13', () => {
  assert.throws(() => getHijriMonthName(13), RangeError);
});

// ---------------------------------------------------------------------------
// getHijriWeekdayName
// ---------------------------------------------------------------------------

// March 23, 2023 was a Thursday (getDay() === 4)
test('getHijriWeekdayName: Thursday long', () => {
  assert.equal(getHijriWeekdayName(new Date(2023, 2, 23)), 'Yawm al-Khamis');
});

test('getHijriWeekdayName: Thursday short', () => {
  assert.equal(getHijriWeekdayName(new Date(2023, 2, 23), 'short'), 'Kham');
});

// ---------------------------------------------------------------------------
// formatHijriDate
// ---------------------------------------------------------------------------

test('formatHijriDate: iYYYY-iMM-iDD', () => {
  assert.equal(formatHijriDate(REF, 'iYYYY-iMM-iDD'), '1444-09-01');
});

test('formatHijriDate: iMMMM', () => {
  assert.equal(formatHijriDate(REF, 'iMMMM'), 'Ramadan');
});

test('formatHijriDate: iEEEE', () => {
  assert.equal(formatHijriDate(new Date(2023, 2, 23), 'iEEEE'), 'Yawm al-Khamis');
});

test('formatHijriDate: iEEE', () => {
  assert.equal(formatHijriDate(new Date(2023, 2, 23), 'iEEE'), 'Kham');
});

test('formatHijriDate: ioooo era', () => {
  assert.equal(formatHijriDate(REF, 'ioooo'), 'AH');
});

test('formatHijriDate: iooo era', () => {
  assert.equal(formatHijriDate(REF, 'iooo'), 'AH');
});

test('formatHijriDate: iYY two-digit year', () => {
  assert.equal(formatHijriDate(REF, 'iYY'), '44');
});

test('formatHijriDate: iMMM medium month', () => {
  assert.equal(formatHijriDate(REF, 'iMMM'), 'Ramadan');
});

test('formatHijriDate: iM bare month', () => {
  assert.equal(formatHijriDate(REF, 'iM'), '9');
});

test('formatHijriDate: iD bare day', () => {
  assert.equal(formatHijriDate(REF, 'iD'), '1');
});

test('formatHijriDate: iE numeric weekday (Thursday = 5)', () => {
  // hwNumeric[4] = 5 (Thursday, 0-indexed from Sunday)
  assert.equal(formatHijriDate(new Date(2023, 2, 23), 'iE'), '5');
});

test('formatHijriDate: out of range returns empty string', () => {
  assert.equal(formatHijriDate(new Date(1800, 0, 1), 'iYYYY-iMM-iDD'), '');
});

test('formatHijriDate: mixed literal and tokens', () => {
  const result = formatHijriDate(REF, 'iD iMMMM iYYYY ioooo');
  assert.equal(result, '1 Ramadan 1444 AH');
});

// ---------------------------------------------------------------------------
// addHijriMonths
// ---------------------------------------------------------------------------

test('addHijriMonths: +1 from Ramadan -> Shawwal', () => {
  const result = toHijriDate(addHijriMonths(REF, 1));
  assert.ok(result !== null);
  assert.equal(result.hy, 1444);
  assert.equal(result.hm, 10); // Shawwal
});

test('addHijriMonths: +3 from month 10 -> wraps to month 1 of next year', () => {
  const dec = new Date(2023, 3, 21, 12); // Shawwal 1444 approx
  const result = toHijriDate(addHijriMonths(dec, 3));
  assert.ok(result !== null);
  // Should be in 1445
  assert.equal(result.hy, 1445);
});

test('addHijriMonths: +0 is identity', () => {
  const result = toHijriDate(addHijriMonths(REF, 0));
  assert.ok(result !== null);
  assert.equal(result.hy, 1444);
  assert.equal(result.hm, 9);
  assert.equal(result.hd, 1);
});

test('addHijriMonths: -1 from Ramadan -> Sha\'ban', () => {
  const result = toHijriDate(addHijriMonths(REF, -1));
  assert.ok(result !== null);
  assert.equal(result.hm, 8); // Sha'ban
});

// ---------------------------------------------------------------------------
// addHijriYears
// ---------------------------------------------------------------------------

test('addHijriYears: +1 from Ramadan 1444 -> Ramadan 1445', () => {
  const result = toHijriDate(addHijriYears(REF, 1));
  assert.ok(result !== null);
  assert.equal(result.hy, 1445);
  assert.equal(result.hm, 9);
});

test('addHijriYears: -1 from Ramadan 1444 -> Ramadan 1443', () => {
  const result = toHijriDate(addHijriYears(REF, -1));
  assert.ok(result !== null);
  assert.equal(result.hy, 1443);
  assert.equal(result.hm, 9);
});

// ---------------------------------------------------------------------------
// startOfHijriMonth / endOfHijriMonth
// ---------------------------------------------------------------------------

test('startOfHijriMonth: 1 Ramadan 1444 = 2023-03-23', () => {
  const start = startOfHijriMonth(REF);
  // Use local date components — startOfHijriMonth returns a local-noon Date
  // to round-trip correctly with toHijriDate across all timezones.
  assert.equal(start.getFullYear(), 2023);
  assert.equal(start.getMonth(), 2);
  assert.equal(start.getDate(), 23);
});

test('endOfHijriMonth: last day of Ramadan 1444', () => {
  const end = toHijriDate(endOfHijriMonth(REF));
  assert.ok(end !== null);
  assert.equal(end.hy, 1444);
  assert.equal(end.hm, 9);
  // Last day is either 29 or 30
  assert.ok(end.hd === 29 || end.hd === 30, `expected 29 or 30, got ${end.hd}`);
});

// ---------------------------------------------------------------------------
// isSameHijriMonth / isSameHijriYear
// ---------------------------------------------------------------------------

// April 10, 2023 is 19 Ramadan 1444 — same Hijri month as March 23, 2023
test('isSameHijriMonth: both in Ramadan 1444', () => {
  assert.equal(isSameHijriMonth(new Date(2023, 2, 23, 12), new Date(2023, 3, 10, 12)), true);
});

test('isSameHijriMonth: different months', () => {
  assert.equal(isSameHijriMonth(new Date(2023, 2, 23, 12), new Date(2023, 4, 1, 12)), false);
});

test('isSameHijriMonth: out of range returns false', () => {
  assert.equal(isSameHijriMonth(new Date(1800, 0, 1), new Date(2023, 2, 23, 12)), false);
});

// March 10, 2024 is in Ramadan 1445 — different year
// But we need same year: 1444 spans roughly April 2022 - April 2023
// 1444 starts ~July 30, 2022. Let's pick two dates in 1444:
// March 23, 2023 = 1 Ramadan 1444
// Feb 10, 2023 = in Jumadal Thani 1444 (still year 1444)
test('isSameHijriYear: both in 1444', () => {
  assert.equal(isSameHijriYear(new Date(2023, 2, 23, 12), new Date(2023, 1, 10, 12)), true);
});

test('isSameHijriYear: different years', () => {
  assert.equal(isSameHijriYear(new Date(2023, 2, 23, 12), new Date(2024, 6, 7, 12)), false);
});

// ---------------------------------------------------------------------------
// getHijriQuarter
// ---------------------------------------------------------------------------

test('getHijriQuarter: month 9 = Q3', () => {
  assert.equal(getHijriQuarter(REF), 3);
});

test('getHijriQuarter: month 1 = Q1', () => {
  assert.equal(getHijriQuarter(new Date(2024, 6, 7, 12)), 1); // 1 Muharram 1446
});

test('getHijriQuarter: out of range returns null', () => {
  assert.equal(getHijriQuarter(new Date(1800, 0, 1)), null);
});

// ---------------------------------------------------------------------------
// FCNA calendar
// ---------------------------------------------------------------------------

test('toHijriDate: FCNA calendar returns valid HijriDate', () => {
  const h = toHijriDate(new Date(2023, 2, 23, 12), { calendar: 'fcna' });
  assert.ok(h !== null, 'expected non-null for FCNA');
  assert.ok(typeof h.hy === 'number');
  assert.ok(h.hm >= 1 && h.hm <= 12);
  assert.ok(h.hd >= 1 && h.hd <= 30);
});

test('formatHijriDate: FCNA calendar', () => {
  const result = formatHijriDate(new Date(2023, 2, 23, 12), 'iYYYY-iMM-iDD', { calendar: 'fcna' });
  assert.ok(result.length > 0, 'expected non-empty string');
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const total = passed + failed;
console.log(`\n${passed}/${total} tests passed`);
if (failed > 0) {
  process.exit(1);
}
