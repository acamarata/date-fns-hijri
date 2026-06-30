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
} from "hijri-core";

export type { HijriDate, CalendarEngine, ConversionOptions } from "./types";

import type { HijriDate, ConversionOptions } from "./types";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Purpose:      Lift a Date's LOCAL calendar components (year, month, day) into the
 *               UTC slot so that hijri-core's UTC-day contract reads the caller's
 *               intended calendar day regardless of host timezone.
 * Inputs:       Any Gregorian Date.
 * Outputs:      A new Date whose UTC year/month/date equal the input's LOCAL year/month/date.
 * Constraints:  Used only as input to coreToHijri; the returned value is an ephemeral
 *               intermediate — never hand it to Date#getFullYear or date-fns functions.
 * WHY:          date-fns is a LOCAL-time library: its functions read local components.
 *               hijri-core (after fix/utc-day-boundary) reads the UTC calendar day.
 *               Without this shim, hosts west of UTC see the previous UTC day for
 *               a local-midnight Date, causing off-by-one conversions.
 */
function localDayToUtcSlot(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

/**
 * Convert a Gregorian `Date` to a Hijri date object.
 *
 * Follows date-fns conventions: the input `Date` is interpreted by its
 * **local calendar day** (year/month/date in the host timezone). This matches
 * how date-fns' own `format()` and field accessors work, so there are no
 * timezone surprises when chaining with other date-fns functions.
 *
 * Returns `null` when the date falls outside the calendar's supported range
 * (UAQ: 1318–1500 AH / 1900–2076 CE; FCNA extends slightly further).
 *
 * @example
 * // Use local-date constructor, not the string form "2025-03-01" (parses as UTC)
 * toHijriDate(new Date(2025, 2, 1)); // { hy: 1446, hm: 9, hd: 1 }
 */
export function toHijriDate(date: Date, options?: ConversionOptions): HijriDate | null {
  return coreToHijri(localDayToUtcSlot(date), options);
}

/**
 * Convert a Hijri date to a Gregorian `Date`.
 *
 * Returns a **local-midnight** Date so that local field accessors
 * (`getFullYear`, `getMonth`, `getDate`) and date-fns' `format()` render the
 * intended calendar day on every host timezone.
 *
 * Round-trips exactly: `toHijriDate(fromHijriDate(y, m, d))` returns
 * `{ hy: y, hm: m, hd: d }` on every timezone.
 *
 * @throws {Error} If the Hijri date is invalid or outside the calendar's range.
 *
 * @example
 * const d = fromHijriDate(1446, 9, 1);
 * d.getFullYear(); // 2025
 * d.getMonth();    // 2 (March)
 * d.getDate();     // 1
 */
export function fromHijriDate(
  hy: number,
  hm: number,
  hd: number,
  options?: ConversionOptions,
): Date {
  const greg = coreToGregorian(hy, hm, hd, options);
  if (greg === null) {
    throw new Error(`Hijri date ${hy}/${hm}/${hd} is invalid or outside the supported range.`);
  }
  // coreToGregorian returns UTC midnight; lift to local midnight so that
  // local field accessors and date-fns format() show the right calendar day.
  return new Date(greg.getUTCFullYear(), greg.getUTCMonth(), greg.getUTCDate());
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
 * The input Date is interpreted by its **local calendar day** (date-fns convention).
 *
 * Returns `null` when the date is outside the supported range.
 */
export function getHijriYear(date: Date, options?: ConversionOptions): number | null {
  return coreToHijri(localDayToUtcSlot(date), options)?.hy ?? null;
}

/**
 * Get the Hijri month (1–12) for a Gregorian date.
 *
 * The input Date is interpreted by its **local calendar day** (date-fns convention).
 *
 * Returns `null` when the date is outside the supported range.
 */
export function getHijriMonth(date: Date, options?: ConversionOptions): number | null {
  return coreToHijri(localDayToUtcSlot(date), options)?.hm ?? null;
}

/**
 * Get the Hijri day of month (1–30) for a Gregorian date.
 *
 * The input Date is interpreted by its **local calendar day** (date-fns convention).
 *
 * Returns `null` when the date is outside the supported range.
 */
export function getHijriDay(date: Date, options?: ConversionOptions): number | null {
  return coreToHijri(localDayToUtcSlot(date), options)?.hd ?? null;
}

/**
 * Get the number of days in a Hijri month (29 or 30).
 *
 * @throws {RangeError} If the year is outside the calendar's supported range.
 */
export function getDaysInHijriMonth(hy: number, hm: number, options?: ConversionOptions): number {
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
  length: "long" | "medium" | "short" = "long",
): string {
  if (hm < 1 || hm > 12) {
    throw new RangeError(`Hijri month must be 1–12, got ${hm}.`);
  }
  const idx = hm - 1;
  // Non-null: hm validated 1-12 above; idx is always 0-11, within all hm* array bounds.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (length === "medium") return hmMedium[idx]!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (length === "short") return hmShort[idx]!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return hmLong[idx]!;
}

/**
 * Get the Arabic weekday name for a Gregorian date.
 *
 * Uses `Date.getDay()` (0 = Sunday, 6 = Saturday) as the index.
 * `getDay()` reads the local weekday, which is correct — weekday display
 * follows the host's local calendar day just like date-fns.
 *
 * @param date   - Any Gregorian `Date`.
 * @param length - `'long'` (default) or `'short'`.
 */
export function getHijriWeekdayName(date: Date, length: "long" | "short" = "long"): string {
  const day = date.getDay(); // 0–6
  // Non-null: day is always 0-6 from getDay(), within hw* array bounds.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return length === "short" ? hwShort[day]! : hwLong[day]!;
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/** Ordered token pattern: longer tokens appear before shorter prefixes to avoid partial matches. */
const TOKEN_RE = /iYYYY|iYY|iMMMM|iMMM|iMM|iM|iDD|iD|iEEEE|iEEE|iE|ioooo|iooo/g;

/**
 * Format a Gregorian date using Hijri calendar tokens.
 *
 * The input Date is interpreted by its **local calendar day** (date-fns convention),
 * matching the behavior of date-fns' own `format()`.
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
  const h = coreToHijri(localDayToUtcSlot(date), options);
  if (!h) return "";

  const day = date.getDay(); // 0–6 local weekday — correct for display

  return formatStr.replace(TOKEN_RE, (token): string => {
    switch (token) {
      case "iYYYY":
        return String(h.hy);
      case "iYY":
        return String(h.hy).slice(-2).padStart(2, "0");
      case "iMMMM":
        // Non-null: hm is a valid Hijri month 1-12; index hm-1 is within hmLong bounds.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return hmLong[h.hm - 1]!;
      case "iMMM":
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return hmMedium[h.hm - 1]!;
      case "iMM":
        return String(h.hm).padStart(2, "0");
      case "iM":
        return String(h.hm);
      case "iDD":
        return String(h.hd).padStart(2, "0");
      case "iD":
        return String(h.hd);
      case "iEEEE":
        // Non-null: day is always 0-6 from getDay(), within hwLong bounds.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return hwLong[day]!;
      case "iEEE":
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return hwShort[day]!;
      case "iE":
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return String(hwNumeric[day]!);
      case "ioooo":
        return "AH";
      case "iooo":
        return "AH";
      default:
        return token;
    }
  });
}

// ---------------------------------------------------------------------------
// Arithmetic
// ---------------------------------------------------------------------------

/**
 * Add a number of Hijri months to a Gregorian date.
 *
 * The input Date is interpreted by its **local calendar day** (date-fns convention).
 * Returns a **local-midnight** Date.
 *
 * Handles year rollover automatically. Month addition wraps at month 12 and
 * increments the year. If the result's month has fewer days than the original
 * day, the day is clamped to the last day of the new month.
 *
 * @throws {Error} If the resulting Hijri date is outside the supported range.
 */
export function addHijriMonths(date: Date, months: number, options?: ConversionOptions): Date {
  const h = coreToHijri(localDayToUtcSlot(date), options);
  if (!h) {
    throw new Error("Date is outside the supported Hijri calendar range.");
  }

  // Total months from epoch: 0-based
  const totalMonths = (h.hy - 1) * 12 + (h.hm - 1) + months;
  const newYear = Math.floor(totalMonths / 12) + 1;
  const newMonth = (((totalMonths % 12) + 12) % 12) + 1;

  // Clamp day to the target month's length
  const maxDay = coreDaysInHijriMonth(newYear, newMonth, options);
  const newDay = Math.min(h.hd, maxDay);

  return fromHijriDate(newYear, newMonth, newDay, options);
}

/**
 * Add a number of Hijri years to a Gregorian date.
 *
 * The input Date is interpreted by its **local calendar day** (date-fns convention).
 * Returns a **local-midnight** Date.
 *
 * If the resulting year has a shorter month than the original day, the day is
 * clamped to the last day of that month.
 *
 * @throws {Error} If the resulting Hijri date is outside the supported range.
 */
export function addHijriYears(date: Date, years: number, options?: ConversionOptions): Date {
  const h = coreToHijri(localDayToUtcSlot(date), options);
  if (!h) {
    throw new Error("Date is outside the supported Hijri calendar range.");
  }

  const newYear = h.hy + years;
  const maxDay = coreDaysInHijriMonth(newYear, h.hm, options);
  const newDay = Math.min(h.hd, maxDay);

  return fromHijriDate(newYear, h.hm, newDay, options);
}

// ---------------------------------------------------------------------------
// Month boundaries
// ---------------------------------------------------------------------------

/**
 * Get the first day of the Hijri month that contains the given date.
 *
 * The input Date is interpreted by its **local calendar day** (date-fns convention).
 * Returns a **local-midnight** Date.
 *
 * @throws {Error} If the date is outside the supported range.
 */
export function startOfHijriMonth(date: Date, options?: ConversionOptions): Date {
  const h = coreToHijri(localDayToUtcSlot(date), options);
  if (!h) {
    throw new Error("Date is outside the supported Hijri calendar range.");
  }
  return fromHijriDate(h.hy, h.hm, 1, options);
}

/**
 * Get the last day of the Hijri month that contains the given date.
 *
 * The input Date is interpreted by its **local calendar day** (date-fns convention).
 * Returns a **local-midnight** Date.
 *
 * @throws {Error} If the date is outside the supported range.
 */
export function endOfHijriMonth(date: Date, options?: ConversionOptions): Date {
  const h = coreToHijri(localDayToUtcSlot(date), options);
  if (!h) {
    throw new Error("Date is outside the supported Hijri calendar range.");
  }
  const lastDay = coreDaysInHijriMonth(h.hy, h.hm, options);
  return fromHijriDate(h.hy, h.hm, lastDay, options);
}

// ---------------------------------------------------------------------------
// Comparisons
// ---------------------------------------------------------------------------

/**
 * Check whether two Gregorian dates fall in the same Hijri month.
 *
 * Both input Dates are interpreted by their **local calendar days** (date-fns convention).
 *
 * Returns `false` if either date is outside the supported range.
 */
export function isSameHijriMonth(dateA: Date, dateB: Date, options?: ConversionOptions): boolean {
  const a = coreToHijri(localDayToUtcSlot(dateA), options);
  const b = coreToHijri(localDayToUtcSlot(dateB), options);
  if (!a || !b) return false;
  return a.hy === b.hy && a.hm === b.hm;
}

/**
 * Check whether two Gregorian dates fall in the same Hijri year.
 *
 * Both input Dates are interpreted by their **local calendar days** (date-fns convention).
 *
 * Returns `false` if either date is outside the supported range.
 */
export function isSameHijriYear(dateA: Date, dateB: Date, options?: ConversionOptions): boolean {
  const a = coreToHijri(localDayToUtcSlot(dateA), options);
  const b = coreToHijri(localDayToUtcSlot(dateB), options);
  if (!a || !b) return false;
  return a.hy === b.hy;
}

// ---------------------------------------------------------------------------
// Quarter
// ---------------------------------------------------------------------------

/**
 * Get the Hijri quarter (1–4) for a Gregorian date.
 *
 * The input Date is interpreted by its **local calendar day** (date-fns convention).
 *
 * Months 1–3 = Q1, 4–6 = Q2, 7–9 = Q3, 10–12 = Q4.
 *
 * Returns `null` when the date is outside the supported range.
 */
export function getHijriQuarter(date: Date, options?: ConversionOptions): number | null {
  const h = coreToHijri(localDayToUtcSlot(date), options);
  if (!h) return null;
  return Math.ceil(h.hm / 3);
}

// ── Opt-in anonymous telemetry ────────────────────────────────────────────────
// Off by default. Enable: ACAMARATA_TELEMETRY=1
// What is sent + how to disable: https://github.com/acamarata/telemetry/blob/main/TELEMETRY.md
import("@acamarata/telemetry")
  .then(({ track }) => track("load", { package: "date-fns-hijri", version: "1.0.4" }))
  .catch(() => {
    // telemetry not installed or disabled — that's fine
  });
