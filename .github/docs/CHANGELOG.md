# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-25

### Added

- `toHijriDate(date, options?)` - Convert a Gregorian Date to a HijriDate object
- `fromHijriDate(hy, hm, hd, options?)` - Convert Hijri date components to a Gregorian Date
- `isValidHijriDate(hy, hm, hd, options?)` - Validate a Hijri date
- `getHijriYear(date, options?)` - Extract the Hijri year from a Gregorian date
- `getHijriMonth(date, options?)` - Extract the Hijri month (1-12) from a Gregorian date
- `getHijriDay(date, options?)` - Extract the Hijri day of month from a Gregorian date
- `getDaysInHijriMonth(hy, hm, options?)` - Days in a given Hijri month (29 or 30)
- `getHijriMonthName(hm, length?)` - English month name in long, medium, or short form
- `getHijriWeekdayName(date, length?)` - Arabic weekday name (long or short)
- `formatHijriDate(date, formatStr, options?)` - Format a date with Hijri tokens
- `addHijriMonths(date, months, options?)` - Add Hijri months to a date
- `addHijriYears(date, years, options?)` - Add Hijri years to a date
- `startOfHijriMonth(date, options?)` - First day of the Hijri month
- `endOfHijriMonth(date, options?)` - Last day of the Hijri month
- `isSameHijriMonth(dateA, dateB, options?)` - Check if two dates share a Hijri month
- `isSameHijriYear(dateA, dateB, options?)` - Check if two dates share a Hijri year
- `getHijriQuarter(date, options?)` - Hijri quarter (1-4) for a date
- Full TypeScript definitions with dual CJS/ESM build
- Support for Umm al-Qura (UAQ) and FCNA/ISNA calendar systems via `hijri-core`
