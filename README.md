# date-fns-hijri

[![npm version](https://img.shields.io/npm/v/date-fns-hijri.svg)](https://www.npmjs.com/package/date-fns-hijri)
[![CI](https://github.com/acamarata/date-fns-hijri/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/date-fns-hijri/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

date-fns-style functions for Hijri calendar operations. Works with any date library.

Each function is a pure, stateless utility. No classes. No configuration object. Pass a `Date`, get a result. Pass options to switch calendar systems. The API mirrors date-fns conventions so the learning curve is minimal.

## Installation

```bash
pnpm add date-fns-hijri hijri-core
```

`hijri-core` is a peer dependency. It provides the underlying calendar engine and must be installed alongside this package.

## Quick Start

```typescript
import {
  toHijriDate,
  fromHijriDate,
  formatHijriDate,
  addHijriMonths,
  getHijriMonthName,
} from 'date-fns-hijri';

// Convert a Gregorian date to Hijri
const hijri = toHijriDate(new Date(2023, 2, 23));
// { hy: 1444, hm: 9, hd: 1 } - 1 Ramadan 1444

// Convert back
const gregorian = fromHijriDate(1444, 9, 1);
// Date: 2023-03-23T00:00:00.000Z

// Format with Hijri tokens
const label = formatHijriDate(new Date(2023, 2, 23), 'iDD iMMMM iYYYY');
// '01 Ramadan 1444'

// Get the month name directly
const name = getHijriMonthName(9);
// 'Ramadan'

// Add months in the Hijri calendar
const nextMonth = addHijriMonths(new Date(2023, 2, 23), 1);
// Date in Shawwal 1444
```

## API

All functions accept an optional `options` argument for selecting the calendar system. When omitted, Umm al-Qura (UAQ) is used.

### Conversion

| Function | Signature | Description |
| --- | --- | --- |
| `toHijriDate` | `(date: Date, options?) => HijriDate \| null` | Convert Gregorian to Hijri. Returns `null` if out of range. |
| `fromHijriDate` | `(hy, hm, hd, options?) => Date` | Convert Hijri to Gregorian. Throws if invalid. |

### Validation

| Function | Signature | Description |
| --- | --- | --- |
| `isValidHijriDate` | `(hy, hm, hd, options?) => boolean` | Check if a Hijri date exists in the calendar table. |

### Field Getters

| Function | Signature | Description |
| --- | --- | --- |
| `getHijriYear` | `(date, options?) => number \| null` | Hijri year. Null if out of range. |
| `getHijriMonth` | `(date, options?) => number \| null` | Hijri month (1-12). Null if out of range. |
| `getHijriDay` | `(date, options?) => number \| null` | Hijri day of month. Null if out of range. |
| `getDaysInHijriMonth` | `(hy, hm, options?) => number` | Days in a Hijri month (29 or 30). |
| `getHijriQuarter` | `(date, options?) => number \| null` | Quarter (1-4). Null if out of range. |

### Names

| Function | Signature | Description |
| --- | --- | --- |
| `getHijriMonthName` | `(hm, length?) => string` | English month name. `length`: `'long'` (default), `'medium'`, `'short'`. |
| `getHijriWeekdayName` | `(date, length?) => string` | Arabic weekday name. `length`: `'long'` (default), `'short'`. |

### Formatting

| Function | Signature | Description |
| --- | --- | --- |
| `formatHijriDate` | `(date, formatStr, options?) => string` | Format a date with Hijri tokens. Returns `''` if out of range. |

### Arithmetic

| Function | Signature | Description |
| --- | --- | --- |
| `addHijriMonths` | `(date, months, options?) => Date` | Add N Hijri months. Clamps day to month length. |
| `addHijriYears` | `(date, years, options?) => Date` | Add N Hijri years. Clamps day to month length. |

### Month Boundaries

| Function | Signature | Description |
| --- | --- | --- |
| `startOfHijriMonth` | `(date, options?) => Date` | First day of the containing Hijri month. |
| `endOfHijriMonth` | `(date, options?) => Date` | Last day of the containing Hijri month. |

### Comparisons

| Function | Signature | Description |
| --- | --- | --- |
| `isSameHijriMonth` | `(dateA, dateB, options?) => boolean` | Both dates in the same Hijri month. |
| `isSameHijriYear` | `(dateA, dateB, options?) => boolean` | Both dates in the same Hijri year. |

## Calendar Systems

Two calendar systems are available via the `options.calendar` property.

**Umm al-Qura (default):**
The official calendar of Saudi Arabia. Covers 1318–1500 AH (1900–2076 CE). Tabular data; deterministic.

```typescript
import { toHijriDate } from 'date-fns-hijri';

const uaq = toHijriDate(new Date(2023, 2, 23));
// uses UAQ by default
```

**FCNA/ISNA:**
The calendar used by the Fiqh Council of North America. Astronomical calculation; extends slightly beyond UAQ's range.

```typescript
const fcna = toHijriDate(new Date(2023, 2, 23), { calendar: 'fcna' });
```

## Format Tokens

| Token | Output | Example |
| --- | --- | --- |
| `iYYYY` | 4-digit Hijri year | `1444` |
| `iYY` | 2-digit Hijri year | `44` |
| `iMMMM` | Long month name | `Ramadan` |
| `iMMM` | Medium month name | `Ramadan` |
| `iMM` | Zero-padded month | `09` |
| `iM` | Month number | `9` |
| `iDD` | Zero-padded day | `01` |
| `iD` | Day number | `1` |
| `iEEEE` | Long weekday name | `Yawm al-Khamis` |
| `iEEE` | Short weekday name | `Kham` |
| `iE` | Numeric weekday (1=Sun) | `5` |
| `ioooo` | Long era | `AH` |
| `iooo` | Short era | `AH` |

Non-token text in the format string passes through unchanged:

```typescript
formatHijriDate(new Date(2023, 2, 23), 'iYYYY-iMM-iDD')
// '1444-09-01'

formatHijriDate(new Date(2023, 2, 23), 'iD iMMMM iYYYY ioooo')
// '1 Ramadan 1444 AH'
```

## TypeScript

Full type definitions are included. Re-exported from `hijri-core`:

```typescript
import type { HijriDate, ConversionOptions } from 'date-fns-hijri';

const h: HijriDate = { hy: 1444, hm: 9, hd: 1 };
const opts: ConversionOptions = { calendar: 'fcna' };
```

## Architecture

A thin adapter over [hijri-core](https://github.com/acamarata/hijri-core). Each function is a stateless wrapper that delegates to the registered calendar engine. No global state, no configuration object: pass options per call.

For more detail see the [Architecture wiki page](https://github.com/acamarata/date-fns-hijri/wiki/Architecture).

## Documentation

Full API reference, architecture notes, and examples: [Wiki](https://github.com/acamarata/date-fns-hijri/wiki)

## Related

- [hijri-core](https://github.com/acamarata/hijri-core) - Zero-dependency Hijri engine powering this library
- [luxon-hijri](https://github.com/acamarata/luxon-hijri) - Hijri support for Luxon DateTime objects
- [pray-calc](https://github.com/acamarata/pray-calc) - Islamic prayer times
- [nrel-spa](https://github.com/acamarata/nrel-spa) - Solar position algorithm

## Compatibility

- Node.js 20, 22, 24
- ESM and CJS builds included
- TypeScript definitions bundled
- Works in browsers and all major bundlers

## Acknowledgments

Calendar data and algorithms provided by [hijri-core](https://github.com/acamarata/hijri-core). The Umm al-Qura table is derived from data published by the King Abdulaziz City for Science and Technology (KACST). FCNA new moon calculations follow Jean Meeus, "Astronomical Algorithms," 2nd ed., Chapter 49.

## License

MIT. Copyright (c) 2026 Aric Camarata.
