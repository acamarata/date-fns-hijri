import {
  toHijri as coreToHijri,
  toGregorian as coreToGregorian,
  isValidHijriDate as coreIsValidHijriDate,
  daysInHijriMonth as coreDaysInHijriMonth,
  hmLong,
  hmMedium,
  hmShort,
  hwLong,
  hwShort,
  hwNumeric,
} from 'hijri-core';

export type { HijriDate, CalendarEngine, ConversionOptions } from './types';

import type { HijriDate, ConversionOptions } from './types';

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

/**
 * Convert a Gregorian `Date` to a Hijri date object.
 *
 * Returns `null` when the date falls outside the calendar's supported range
 * (UAQ: 1318–1500 AH / 1900–2076 CE; FCNA extends slightly further).
 */
export function toHijriDate(date: Date, options?: ConversionOptions): HijriDate | null {
  return coreToHijri(date, options);
}

/**
 * Convert a Hijri date to a Gregorian `Date`.
 *
 * The returned `Date` is set to midnight UTC of the equivalent Gregorian day.
 *
 * @throws {Error} If the Hijri date is invalid or outside the calendar's range.
 */
export function fromHijriDate(
  hy: number,
  hm: number,
  hd: number,
  options?: ConversionOptions,
): Date {
  const result = coreToGregorian(hy, hm, hd, options);
  if (result === null) {
    throw new Error(
      `Hijri date ${hy}/${hm}/${hd} is invalid or outside the supported range.`,
    );
  }
  return result;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Check whether a Hijri date is valid for the given calendar system.
 *
 * Verifies that the year, month (1–12), and day (1–daysInMonth) all exist
 * in the calendar's data table.
 */
export function isValidHijriDate(
  hy: number,
  hm: number,
  hd: number,
  options?: ConversionOptions,
): boolean {
  return coreIsValidHijriDate(hy, hm, hd, options);
}

// ---------------------------------------------------------------------------
// Field getters
// ---------------------------------------------------------------------------

/**
 * Get the Hijri year for a Gregorian date.
 *
 * Returns `null` when the date is outside the supported range.
 */
export function getHijriYear(date: Date, options?: ConversionOptions): number | null {
  return coreToHijri(date, options)?.hy ?? null;
}

/**
 * Get the Hijri month (1–12) for a Gregorian date.
 *
 * Returns `null` when the date is outside the supported range.
 */
export function getHijriMonth(date: Date, options?: ConversionOptions): number | null {
  return coreToHijri(date, options)?.hm ?? null;
}

/**
 * Get the Hijri day of month (1–30) for a Gregorian date.
 *
 * Returns `null` when the date is outside the supported range.
 */
export function getHijriDay(date: Date, options?: ConversionOptions): number | null {
  return coreToHijri(date, options)?.hd ?? null;
}

/**
 * Get the number of days in a Hijri month (29 or 30).
 *
 * @throws {RangeError} If the year is outside the calendar's supported range.
 */
export function getDaysInHijriMonth(
  hy: number,
  hm: number,
  options?: ConversionOptions,
): number {
  return coreDaysInHijriMonth(hy, hm, options);
}

// ---------------------------------------------------------------------------
// Names
// ---------------------------------------------------------------------------

/**
 * Get the English name of a Hijri month.
 *
 * @param hm     - Month number (1–12).
 * @param length - `'long'` (default), `'medium'`, or `'short'`.
 *
 * @throws {RangeError} If `hm` is not in [1, 12].
 */
export function getHijriMonthName(
  hm: number,
  length: 'long' | 'medium' | 'short' = 'long',
): string {
  if (hm < 1 || hm > 12) {
    throw new RangeError(`Hijri month must be 1–12, got ${hm}.`);
  }
  const idx = hm - 1;
  if (length === 'medium') return hmMedium[idx];
  if (length === 'short') return hmShort[idx];
  return hmLong[idx];
}

/**
 * Get the Arabic weekday name for a Gregorian date.
 *
 * Uses `Date.getDay()` (0 = Sunday, 6 = Saturday) as the index.
 *
 * @param date   - Any Gregorian `Date`.
 * @param length - `'long'` (default) or `'short'`.
 */
export function getHijriWeekdayName(
  date: Date,
  length: 'long' | 'short' = 'long',
): string {
  const day = date.getDay(); // 0–6
  return length === 'short' ? hwShort[day] : hwLong[day];
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/** Ordered token pattern: longer tokens appear before shorter prefixes to avoid partial matches. */
const TOKEN_RE = /iYYYY|iYY|iMMMM|iMMM|iMM|iM|iDD|iD|iEEEE|iEEE|iE|ioooo|iooo/g;

/**
 * Format a Gregorian date using Hijri calendar tokens.
 *
 * Supported tokens:
 *
 * | Token   | Output                     | Example        |
 * | ------- | -------------------------- | -------------- |
 * | iYYYY   | 4-digit Hijri year         | 1444           |
 * | iYY     | 2-digit Hijri year         | 44             |
 * | iMMMM   | Long month name            | Ramadan        |
 * | iMMM    | Medium month name          | Ramadan        |
 * | iMM     | Zero-padded month (01–12)  | 09             |
 * | iM      | Month (1–12)               | 9              |
 * | iDD     | Zero-padded day (01–30)    | 01             |
 * | iD      | Day (1–30)                 | 1              |
 * | iEEEE   | Long weekday name          | Yawm al-Khamis |
 * | iEEE    | Short weekday name         | Kham           |
 * | iE      | Numeric weekday (1=Sun–7=Sat)| 5             |
 * | ioooo   | Long era                   | AH             |
 * | iooo    | Short era                  | AH             |
 *
 * Returns an empty string when the date falls outside the supported range.
 */
export function formatHijriDate(
  date: Date,
  formatStr: string,
  options?: ConversionOptions,
): string {
  const h = coreToHijri(date, options);
  if (!h) return '';

  const day = date.getDay(); // 0–6

  return formatStr.replace(TOKEN_RE, (token) => {
    switch (token) {
      case 'iYYYY': return String(h.hy);
      case 'iYY':   return String(h.hy).slice(-2).padStart(2, '0');
      case 'iMMMM': return hmLong[h.hm - 1];
      case 'iMMM':  return hmMedium[h.hm - 1];
      case 'iMM':   return String(h.hm).padStart(2, '0');
      case 'iM':    return String(h.hm);
      case 'iDD':   return String(h.hd).padStart(2, '0');
      case 'iD':    return String(h.hd);
      case 'iEEEE': return hwLong[day];
      case 'iEEE':  return hwShort[day];
      case 'iE':    return String(hwNumeric[day]);
      case 'ioooo': return 'AH';
      case 'iooo':  return 'AH';
      default:      return token;
    }
  });
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * `coreToGregorian` returns a UTC-midnight Date. When `coreToHijri` is then
 * called on that Date, it normalises using local year/month/day components
 * (`getFullYear`, `getMonth`, `getDate`). In timezones west of UTC the local
 * date of a UTC-midnight instant is the *previous* calendar day, which causes
 * the round-trip to drift by one day.
 *
 * This helper converts a UTC-midnight Date to a local-noon Date so that local
 * calendar components always match the intended Gregorian date.
 */
function utcMidnightToLocalNoon(d: Date): Date {
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12);
}

// ---------------------------------------------------------------------------
// Arithmetic
// ---------------------------------------------------------------------------

/**
 * Add a number of Hijri months to a Gregorian date.
 *
 * Handles year rollover automatically. Month addition wraps at month 12 and
 * increments the year. If the result's month has fewer days than the original
 * day, the day is clamped to the last day of the new month.
 *
 * @throws {Error} If the resulting Hijri date is outside the supported range.
 */
export function addHijriMonths(
  date: Date,
  months: number,
  options?: ConversionOptions,
): Date {
  const h = coreToHijri(date, options);
  if (!h) {
    throw new Error('Date is outside the supported Hijri calendar range.');
  }

  // Total months from epoch: 0-based
  const totalMonths = (h.hy - 1) * 12 + (h.hm - 1) + months;
  const newYear  = Math.floor(totalMonths / 12) + 1;
  const newMonth = (((totalMonths % 12) + 12) % 12) + 1;

  // Clamp day to the target month's length
  const maxDay = coreDaysInHijriMonth(newYear, newMonth, options);
  const newDay = Math.min(h.hd, maxDay);

  return utcMidnightToLocalNoon(fromHijriDate(newYear, newMonth, newDay, options));
}

/**
 * Add a number of Hijri years to a Gregorian date.
 *
 * If the resulting year has a shorter Ramadan (or any month) than the original
 * day, the day is clamped to the last day of that month.
 *
 * @throws {Error} If the resulting Hijri date is outside the supported range.
 */
export function addHijriYears(
  date: Date,
  years: number,
  options?: ConversionOptions,
): Date {
  const h = coreToHijri(date, options);
  if (!h) {
    throw new Error('Date is outside the supported Hijri calendar range.');
  }

  const newYear = h.hy + years;
  const maxDay  = coreDaysInHijriMonth(newYear, h.hm, options);
  const newDay  = Math.min(h.hd, maxDay);

  return utcMidnightToLocalNoon(fromHijriDate(newYear, h.hm, newDay, options));
}

// ---------------------------------------------------------------------------
// Month boundaries
// ---------------------------------------------------------------------------

/**
 * Get the first day of the Hijri month that contains the given date.
 *
 * @throws {Error} If the date is outside the supported range.
 */
export function startOfHijriMonth(date: Date, options?: ConversionOptions): Date {
  const h = coreToHijri(date, options);
  if (!h) {
    throw new Error('Date is outside the supported Hijri calendar range.');
  }
  return utcMidnightToLocalNoon(fromHijriDate(h.hy, h.hm, 1, options));
}

/**
 * Get the last day of the Hijri month that contains the given date.
 *
 * @throws {Error} If the date is outside the supported range.
 */
export function endOfHijriMonth(date: Date, options?: ConversionOptions): Date {
  const h = coreToHijri(date, options);
  if (!h) {
    throw new Error('Date is outside the supported Hijri calendar range.');
  }
  const lastDay = coreDaysInHijriMonth(h.hy, h.hm, options);
  return utcMidnightToLocalNoon(fromHijriDate(h.hy, h.hm, lastDay, options));
}

// ---------------------------------------------------------------------------
// Comparisons
// ---------------------------------------------------------------------------

/**
 * Check whether two Gregorian dates fall in the same Hijri month.
 *
 * Returns `false` if either date is outside the supported range.
 */
export function isSameHijriMonth(
  dateA: Date,
  dateB: Date,
  options?: ConversionOptions,
): boolean {
  const a = coreToHijri(dateA, options);
  const b = coreToHijri(dateB, options);
  if (!a || !b) return false;
  return a.hy === b.hy && a.hm === b.hm;
}

/**
 * Check whether two Gregorian dates fall in the same Hijri year.
 *
 * Returns `false` if either date is outside the supported range.
 */
export function isSameHijriYear(
  dateA: Date,
  dateB: Date,
  options?: ConversionOptions,
): boolean {
  const a = coreToHijri(dateA, options);
  const b = coreToHijri(dateB, options);
  if (!a || !b) return false;
  return a.hy === b.hy;
}

// ---------------------------------------------------------------------------
// Quarter
// ---------------------------------------------------------------------------

/**
 * Get the Hijri quarter (1–4) for a Gregorian date.
 *
 * Months 1–3 = Q1, 4–6 = Q2, 7–9 = Q3, 10–12 = Q4.
 *
 * Returns `null` when the date is outside the supported range.
 */
export function getHijriQuarter(date: Date, options?: ConversionOptions): number | null {
  const h = coreToHijri(date, options);
  if (!h) return null;
  return Math.ceil(h.hm / 3);
}
