# Quick Start

This guide covers the most common use cases in date-fns-hijri. All examples use the default Umm al-Qura (UAQ) calendar. For FCNA/ISNA calendar output, pass `{ calendar: 'fcna' }` as the last argument to any function.

## Installation

```bash
pnpm add date-fns-hijri hijri-core
```

`hijri-core` is a required peer dependency. It provides the calendar engine and must be installed alongside this package.

## Convert a Gregorian date to Hijri

```typescript
import { toHijriDate } from 'date-fns-hijri';

const date = new Date(2023, 2, 23); // March 23, 2023
const hijri = toHijriDate(date);
// { hy: 1444, hm: 9, hd: 1 }
```

`toHijriDate` returns `null` for dates outside the UAQ table range (1318-1500 AH, approximately 1900-2076 CE). Always check for null before using the result.

## Convert a Hijri date to Gregorian

```typescript
import { fromHijriDate } from 'date-fns-hijri';

const gregorian = fromHijriDate(1444, 9, 1);
// Date: 2023-03-23T00:00:00.000Z
```

## Format a Hijri date

```typescript
import { formatHijriDate } from 'date-fns-hijri';

const date = new Date(2023, 2, 23);
const label = formatHijriDate(date, 'iDD iMMMM iYYYY');
// '01 Ramadan 1444'
```

Supported format tokens:

| Token  | Output                  |
| ------ | ----------------------- |
| `iYYYY`| Hijri year (4 digits)   |
| `iYY`  | Hijri year (2 digits)   |
| `iMM`  | Month number (01-12)    |
| `iMMM` | Short month name        |
| `iMMMM`| Full month name         |
| `iDD`  | Day (01-30)             |
| `iD`   | Day (1-30)              |

## Get a month name

```typescript
import { getHijriMonthName } from 'date-fns-hijri';

const name = getHijriMonthName(9);
// 'Ramadan'

const shortName = getHijriMonthName(9, { format: 'short' });
// 'Ram'
```

## Add months in Hijri space

```typescript
import { addHijriMonths } from 'date-fns-hijri';

const ramadan = new Date(2023, 2, 23); // 1 Ramadan 1444
const shawwal = addHijriMonths(ramadan, 1);
// Date representing 1 Shawwal 1444 (April 21, 2023)
```

Month arithmetic respects variable-length Hijri months (29 or 30 days depending on the calendar).

## Use the FCNA calendar

```typescript
import { toHijriDate, formatHijriDate } from 'date-fns-hijri';

const opts = { calendar: 'fcna' };
const hijri = toHijriDate(new Date(2023, 2, 23), opts);
const label = formatHijriDate(new Date(2023, 2, 23), 'iDD iMMMM iYYYY', opts);
```

FCNA (Fiqh Council of North America) uses astronomical new moon calculation rather than the Umm al-Qura table. Results may differ by one day around month boundaries.

## CommonJS

```js
const { toHijriDate, fromHijriDate, formatHijriDate } = require('date-fns-hijri');

const hijri = toHijriDate(new Date(2023, 2, 23));
```

## Next steps

- [API Reference](API-Reference) for the full function list and signatures
- [Architecture](Architecture) for how the calendar engine and format layer work
- [Advanced Guide](guides/advanced) for error handling, range validation, and locale patterns
