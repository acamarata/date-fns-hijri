# date-fns-hijri

date-fns-style functions for Hijri calendar operations. Each function is a pure, stateless utility. Pass a `Date`, get a result. No classes, no global configuration.

The library wraps [hijri-core](https://github.com/acamarata/hijri-core), which provides the underlying calendar engine with support for both Umm al-Qura (UAQ) and FCNA/ISNA calendar systems.

## Quick Example

```typescript
import { toHijriDate, formatHijriDate, addHijriMonths } from 'date-fns-hijri';

// 1 Ramadan 1444 AH
const hijri = toHijriDate(new Date(2023, 2, 23, 12));
// { hy: 1444, hm: 9, hd: 1 }

// Format
const label = formatHijriDate(new Date(2023, 2, 23, 12), 'iD iMMMM iYYYY ioooo');
// '1 Ramadan 1444 AH'

// Arithmetic
const eid = addHijriMonths(new Date(2023, 2, 23, 12), 1);
// Date in Shawwal 1444
```

## Installation

```bash
pnpm add date-fns-hijri hijri-core
```

`hijri-core` is a peer dependency. Install it alongside this package.

## Table of Contents

- [API Reference](API-Reference) - All 17 functions with full signatures and examples
- [Architecture](Architecture) - Design decisions, format token resolution, hijri-core integration

## Calendar Systems

Two calendar systems are built in:

- **UAQ (default):** Umm al-Qura. Official Saudi Arabia calendar. Tabular data covering 1318-1500 AH (1900-2076 CE). Deterministic.
- **FCNA:** Fiqh Council of North America. Astronomical calculation. Extends slightly beyond UAQ's range.

Switch calendar system with the `options` argument:

```typescript
import { toHijriDate } from 'date-fns-hijri';

const fcna = toHijriDate(new Date(2023, 2, 23, 12), { calendar: 'fcna' });
```

## TypeScript

Full type definitions are included and exported:

```typescript
import type { HijriDate, ConversionOptions } from 'date-fns-hijri';
```

The `HijriDate` interface:

```typescript
interface HijriDate {
  hy: number; // Hijri year
  hm: number; // Hijri month (1-12)
  hd: number; // Hijri day (1-30)
}
```

---

[Home](Home) · [API Reference](API-Reference) · [Architecture](Architecture)
