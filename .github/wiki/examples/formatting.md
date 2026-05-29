# Formatting Examples

All examples use `formatHijriDate`. The function takes a Gregorian `Date`, a format string with Hijri tokens, and an optional options argument for calendar selection.

## Token reference

| Token   | Output example          | Description                    |
| ------- | ----------------------- | ------------------------------ |
| `iYYYY` | `1444`                  | Hijri year, 4 digits           |
| `iYY`   | `44`                    | Hijri year, 2 digits           |
| `iMM`   | `09`                    | Month number, zero-padded      |
| `iM`    | `9`                     | Month number, unpadded         |
| `iMMMM` | `Ramadan`               | Full month name                |
| `iMMM`  | `Ram`                   | 3-letter month abbreviation    |
| `iDD`   | `01`                    | Day of month, zero-padded      |
| `iD`    | `1`                     | Day of month, unpadded         |

## Common formats

```typescript
import { formatHijriDate } from 'date-fns-hijri';

// 1 Ramadan 1444 CE = March 23, 2023 CE
const date = new Date(2023, 2, 23);

// Numeric ISO-style (useful for sorting)
formatHijriDate(date, 'iYYYY-iMM-iDD');
// '1444-09-01'

// Numeric short
formatHijriDate(date, 'iDD/iMM/iYYYY');
// '01/09/1444'

// Long form
formatHijriDate(date, 'iD iMMMM iYYYY');
// '1 Ramadan 1444'

// With abbreviation
formatHijriDate(date, 'iD iMMM iYY AH');
// '1 Ram 44 AH'

// Arabic-script label (month name only changes)
formatHijriDate(date, 'iDD iMMMM iYYYY');
// '01 Ramadan 1444'
```

## Mixing Hijri tokens with literal text

Literal text passes through unchanged. Wrap text in single quotes if it contains characters that could be interpreted as format tokens.

```typescript
// 'AH' contains 'A' and 'H' which are not Hijri tokens, so this is safe
formatHijriDate(date, 'iD iMMMM iYYYY AH');
// '1 Ramadan 1444 AH'

// Single-quote wrapping for safety
formatHijriDate(date, "iD 'of' iMMMM, iYYYY");
// '1 of Ramadan, 1444'
```

## FCNA calendar formatting

```typescript
import { formatHijriDate } from 'date-fns-hijri';

const date = new Date(2023, 2, 23);
const fcna = { calendar: 'fcna' };

formatHijriDate(date, 'iD iMMMM iYYYY', fcna);
// May be '1 Ramadan 1444' or '2 Ramadan 1444' depending on the astronomical calculation
```

## Formatting in a React component

```tsx
import { formatHijriDate } from 'date-fns-hijri';

function HijriDisplay({ date }: { date: Date }) {
  return (
    <span className="hijri-date">
      {formatHijriDate(date, 'iD iMMMM iYYYY')}
    </span>
  );
}
```

## Generating a Hijri calendar grid header

```typescript
import { getHijriMonthName } from 'date-fns-hijri';

// Render all 12 month names for a year selector
const months = Array.from({ length: 12 }, (_, i) => ({
  number: i + 1,
  name: getHijriMonthName(i + 1),
  short: getHijriMonthName(i + 1, { format: 'short' }),
}));
```
