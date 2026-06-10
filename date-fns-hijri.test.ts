/**
 * Purpose:    Vitest suite for date-fns-hijri — functional Hijri date utilities.
 * Inputs:     Pure functions from src/index.ts wrapping hijri-core. No network, no I/O.
 * Outputs:    Vitest pass/fail assertions.
 * Constraints: UAQ range 1318–1500 AH; fromHijriDate throws on invalid input (null path).
 *             Use local-date constructor new Date(y, m, d) — not string "YYYY-MM-DD" which
 *             parses as UTC midnight and can be the previous LOCAL day west of UTC.
 * Usage:      pnpm vitest run
 * SOT:        packages.md — date-fns-hijri row
 */
import { describe, it, expect } from "vitest";
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
} from "./src/index";

// Anchor: 1 Ramadan 1446 = 2025-03-01 in the Gregorian calendar.
// Use local-date constructor to avoid the UTC-parsing pitfall with string form.
// At local noon the local calendar day is unambiguous on every timezone.
const RAMADAN_1446_NOON = new Date(2025, 2, 1, 12); // local noon 2025-03-01

describe("toHijriDate", () => {
  it("converts noon 2025-03-01 UTC to 1 Ramadan 1446", () => {
    const result = toHijriDate(RAMADAN_1446_NOON);
    expect(result).not.toBeNull();
    expect(result!.hy).toBe(1446);
    expect(result!.hm).toBe(9);
    expect(result!.hd).toBe(1);
  });

  it("returns null for dates outside UAQ range (2100)", () => {
    expect(toHijriDate(new Date("2100-01-01"))).toBeNull();
  });
});

describe("fromHijriDate", () => {
  it("converts 1 Ramadan 1446 to local 2025-03-01 (via local accessors)", () => {
    const result = fromHijriDate(1446, 9, 1);
    // Returns local midnight: local accessors show the intended calendar day
    // on every host timezone. Do NOT use toISOString() — it shows UTC which
    // will be the previous day in timezones west of UTC.
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(2); // March
    expect(result.getDate()).toBe(1);
  });

  it("round-trip: toHijriDate(fromHijriDate(1446, 9, 1)) === {1446, 9, 1}", () => {
    const d = fromHijriDate(1446, 9, 1);
    const h = toHijriDate(d);
    expect(h).not.toBeNull();
    expect(h!.hy).toBe(1446);
    expect(h!.hm).toBe(9);
    expect(h!.hd).toBe(1);
  });

  it("throws on an out-of-range Hijri year (1501)", () => {
    expect(() => fromHijriDate(1501, 1, 1)).toThrow();
  });
});

describe("isValidHijriDate", () => {
  it("returns true for 1 Ramadan 1446", () => {
    expect(isValidHijriDate(1446, 9, 1)).toBe(true);
  });

  it("returns false for month 13", () => {
    expect(isValidHijriDate(1446, 13, 1)).toBe(false);
  });
});

describe("field getters", () => {
  it("getHijriYear returns 1446 for noon 2025-03-01", () => {
    expect(getHijriYear(RAMADAN_1446_NOON)).toBe(1446);
  });

  it("getHijriMonth returns 9 for Ramadan", () => {
    expect(getHijriMonth(RAMADAN_1446_NOON)).toBe(9);
  });

  it("getHijriDay returns 1", () => {
    expect(getHijriDay(RAMADAN_1446_NOON)).toBe(1);
  });
});

describe("getDaysInHijriMonth", () => {
  it("returns 29 or 30 for Ramadan 1446", () => {
    const days = getDaysInHijriMonth(1446, 9);
    expect([29, 30]).toContain(days);
  });
});

describe("getHijriMonthName", () => {
  it("returns Ramadan for month 9 (long)", () => {
    expect(getHijriMonthName(9, "long")).toBe("Ramadan");
  });

  it("throws RangeError for month 0", () => {
    expect(() => getHijriMonthName(0)).toThrow(RangeError);
  });

  it("returns a non-empty medium name for month 1", () => {
    const name = getHijriMonthName(1, "medium");
    expect(name.length).toBeGreaterThan(0);
  });
});

describe("getHijriWeekdayName", () => {
  it("returns a non-empty long weekday name for 2025-03-01 (Saturday)", () => {
    const name = getHijriWeekdayName(RAMADAN_1446_NOON, "long");
    expect(typeof name).toBe("string");
    expect(name.length).toBeGreaterThan(0);
  });

  it("short name is no longer than long name for the same date", () => {
    const long = getHijriWeekdayName(RAMADAN_1446_NOON, "long");
    const short = getHijriWeekdayName(RAMADAN_1446_NOON, "short");
    expect(short.length).toBeLessThanOrEqual(long.length);
  });
});
