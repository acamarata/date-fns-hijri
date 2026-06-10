# date-fns-hijri

[![npm version](https://img.shields.io/npm/v/date-fns-hijri.svg)](https://www.npmjs.com/package/date-fns-hijri)
[![CI](https://github.com/acamarata/date-fns-hijri/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/date-fns-hijri/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

date-fns-style functions for Hijri calendar operations. Each function is a pure, stateless utility. Pass a `Date`, get a result. No classes, no global configuration.

Built on [hijri-core](https://github.com/acamarata/hijri-core). Supports Umm al-Qura (UAQ) and FCNA/ISNA calendar systems.

## Installation

```bash
pnpm add date-fns-hijri hijri-core
```

`hijri-core` is a peer dependency. It provides the underlying calendar engine.

## Quick Start

```typescript
import {
  toHijriDate,
  fromHijriDate,
  formatHijriDate,
  addHijriMonths,
  getHijriMonthName,
} from 'date-fns-hijri';

// Convert Gregorian to Hijri
const hijri = toHijriDate(new Date(2023, 2, 23, 12));
// { hy: 1444, hm: 9, hd: 1 } (1 Ramadan 1444)

// Format with Hijri tokens
const label = formatHijriDate(new Date(2023, 2, 23, 12), 'iD iMMMM iYYYY ioooo');
// '1 Ramadan 1444 AH'

// Add Hijri months
const eid = addHijriMonths(new Date(2023, 2, 23, 12), 1);
// Date in Shawwal 1444

// Get the month name
getHijriMonthName(9); // 'Ramadan'
```

## Documentation

Full API reference, guides, and examples: **[Wiki](https://github.com/acamarata/date-fns-hijri/wiki)**

- [API Reference](https://github.com/acamarata/date-fns-hijri/wiki/API-Reference): all 17 functions with signatures and examples
- [Architecture](https://github.com/acamarata/date-fns-hijri/wiki/Architecture): design decisions and hijri-core integration
- [Quick Start](https://github.com/acamarata/date-fns-hijri/wiki/guides/quickstart)

## Day boundaries and time zones

This package follows date-fns local-time conventions:

- **Inputs** (`toHijriDate`, `getHijri*`, `formatHijriDate`, arithmetic, comparisons) — the input `Date` is read by its **local calendar day** (using `getFullYear`/`getMonth`/`getDate`). This matches how date-fns' own `format()` and field accessors work.
- **Outputs** (`fromHijriDate` and all arithmetic/boundary functions) — returned `Date` values are **local midnight** of the equivalent Gregorian day. Local field accessors and date-fns' `format()` will render the intended date on every timezone.

Round-trips are exact on every host timezone:

```typescript
toHijriDate(fromHijriDate(1446, 9, 1)); // always { hy: 1446, hm: 9, hd: 1 }
```

**Pitfall:** `new Date("2025-03-01")` parses as UTC midnight. In timezones west of UTC this resolves to the previous local day (Feb 28), giving an off-by-one result. Use the local-date constructor instead:

```typescript
// Wrong in timezones west of UTC:
toHijriDate(new Date("2025-03-01")); // may return 29 Shaban in some zones

// Correct everywhere:
toHijriDate(new Date(2025, 2, 1)); // always 1 Ramadan 1446
```

Religious day-start (sunset boundary) is out of scope — this package only handles civil calendar day alignment.

## Related

- [hijri-core](https://github.com/acamarata/hijri-core): the calendar engine powering this library
- [luxon-hijri](https://github.com/acamarata/luxon-hijri): Hijri support for Luxon DateTime objects
- [pray-calc](https://github.com/acamarata/pray-calc): Islamic prayer times

## Compatibility

- Node.js 20, 22, 24
- ESM and CJS builds included
- TypeScript definitions bundled
- Works in browsers and all major bundlers

## License

MIT. Copyright (c) 2026 Aric Camarata.
