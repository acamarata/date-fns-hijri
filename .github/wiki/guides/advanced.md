# Advanced Usage

## Null handling and range validation

`toHijriDate` returns `null` for dates outside the UAQ table range (1318-1500 AH, approximately 1900-2076 CE). Guard against null before using the result.

```typescript
import { toHijriDate } from 'date-fns-hijri';

function safeConvert(date: Date) {
  const hijri = toHijriDate(date);
  if (hijri === null) {
    throw new RangeError(`Date ${date.toISOString()} is outside the UAQ table range`);
  }
  return hijri;
}
```

Dates before approximately 1900 CE or after 2076 CE will return null with the UAQ calendar. Switch to FCNA for unbounded range:

```typescript
const hijri = toHijriDate(date, { calendar: 'fcna' }); // never null
```

FCNA uses astronomical calculation and has no hard range limit, though accuracy degrades for dates far from the present.

## Checking which calendar systems are available

The available calendar IDs depend on which engines are registered in hijri-core. UAQ and FCNA are always registered. If you use a custom engine registered via `hijri-core`'s `registerCalendar()`, you can pass its ID in the options.

```typescript
import { toHijriDate } from 'date-fns-hijri';

const hijri = toHijriDate(date, { calendar: 'my-custom-calendar' });
```

## Formatting with zero padding

`formatHijriDate` pads single-digit days and months with a leading zero when you use the two-character tokens (`iDD`, `iMM`). To get unpadded values, use the single-character equivalents (`iD`, `iM`).

```typescript
import { formatHijriDate } from 'date-fns-hijri';

const date = new Date(2023, 2, 23); // 1 Ramadan 1444
formatHijriDate(date, 'iD/iM/iYYYY');  // '1/9/1444'
formatHijriDate(date, 'iDD/iMM/iYYYY'); // '01/09/1444'
```

## Month arithmetic edge cases

`addHijriMonths` accounts for variable month lengths. When the source day does not exist in the target month (Hijri months alternate between 29 and 30 days depending on the calendar), the result clamps to the last valid day of the target month.

```typescript
import { addHijriMonths, toHijriDate } from 'date-fns-hijri';

// Suppose source is 30 Rajab and the following month (Sha'ban) has 29 days.
// addHijriMonths clamps the result to 29 Sha'ban.
const result = addHijriMonths(new Date(2023, 0, 21), 1);
const hijri = toHijriDate(result);
// hijri.hd will be 29 if Sha'ban 1444 has only 29 days
```

## Working with JavaScript Date constructors

`fromHijriDate` returns a `Date` in the local timezone with time set to midnight. If you need UTC midnight, convert explicitly:

```typescript
import { fromHijriDate } from 'date-fns-hijri';

const local = fromHijriDate(1444, 9, 1);
// New Date at midnight in the local timezone

const utc = new Date(Date.UTC(
  local.getFullYear(),
  local.getMonth(),
  local.getDate()
));
```

## Integrating with date-fns formatting

date-fns-hijri works with plain `Date` objects, so it integrates cleanly with date-fns formatting functions. Use date-fns for Gregorian formatting and this package for Hijri-specific tokens.

```typescript
import { format } from 'date-fns';
import { formatHijriDate } from 'date-fns-hijri';

const date = new Date(2023, 2, 23);

// Gregorian day of week from date-fns
const dayOfWeek = format(date, 'EEEE'); // 'Thursday'

// Hijri date from date-fns-hijri
const hijriLabel = formatHijriDate(date, 'iD iMMMM iYYYY'); // '1 Ramadan 1444'

const combined = `${dayOfWeek}, ${hijriLabel}`;
// 'Thursday, 1 Ramadan 1444'
```

## TypeScript: narrowing the return type

When you know the date is within the UAQ range, you can assert non-null:

```typescript
import { toHijriDate, HijriDate } from 'date-fns-hijri';

function convert(date: Date): HijriDate {
  const result = toHijriDate(date);
  if (result === null) throw new RangeError('Out of UAQ range');
  return result;
}
```
