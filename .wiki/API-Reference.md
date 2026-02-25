# API Reference

All functions accept an optional `options?: ConversionOptions` argument as their last parameter. When omitted, the Umm al-Qura (UAQ) calendar is used.

```typescript
interface ConversionOptions {
  calendar?: string; // 'uaq' (default) | 'fcna'
}
```

---

## Conversion

### `toHijriDate`

```typescript
function toHijriDate(date: Date, options?: ConversionOptions): HijriDate | null
```

Convert a Gregorian `Date` to a Hijri date object.

Returns `null` when the date falls outside the calendar's supported range. UAQ covers 1318-1500 AH (approximately 1900-2076 CE).

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `date` | `Date` | A valid Gregorian date |
| `options` | `ConversionOptions` | Optional. Calendar system selection |

**Returns:** `HijriDate | null`

**Example:**

```typescript
import { toHijriDate } from 'date-fns-hijri';

toHijriDate(new Date(2023, 2, 23, 12));
// { hy: 1444, hm: 9, hd: 1 } - 1 Ramadan 1444

toHijriDate(new Date(1800, 0, 1));
// null - out of range
```

---

### `fromHijriDate`

```typescript
function fromHijriDate(hy: number, hm: number, hd: number, options?: ConversionOptions): Date
```

Convert a Hijri date to a Gregorian `Date`.

The returned `Date` is set to midnight UTC of the equivalent Gregorian day.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `hy` | `number` | Hijri year |
| `hm` | `number` | Hijri month (1-12) |
| `hd` | `number` | Hijri day (1-30) |
| `options` | `ConversionOptions` | Optional. Calendar system selection |

**Returns:** `Date`

**Throws:** `Error` if the Hijri date is invalid or outside the supported range.

**Example:**

```typescript
import { fromHijriDate } from 'date-fns-hijri';

fromHijriDate(1444, 9, 1);
// Date: 2023-03-23T00:00:00.000Z

fromHijriDate(1444, 13, 1);
// throws Error
```

---

## Validation

### `isValidHijriDate`

```typescript
function isValidHijriDate(hy: number, hm: number, hd: number, options?: ConversionOptions): boolean
```

Check whether a Hijri date is valid. Verifies year, month (1-12), and day (1-daysInMonth) all exist in the calendar's data table.

**Example:**

```typescript
isValidHijriDate(1444, 9, 1);   // true
isValidHijriDate(1444, 13, 1);  // false - no month 13
isValidHijriDate(1444, 9, 31);  // false - Ramadan has 29 or 30 days
```

---

## Field Getters

### `getHijriYear`

```typescript
function getHijriYear(date: Date, options?: ConversionOptions): number | null
```

Get the Hijri year for a Gregorian date. Returns `null` when out of range.

---

### `getHijriMonth`

```typescript
function getHijriMonth(date: Date, options?: ConversionOptions): number | null
```

Get the Hijri month (1-12) for a Gregorian date. Returns `null` when out of range.

---

### `getHijriDay`

```typescript
function getHijriDay(date: Date, options?: ConversionOptions): number | null
```

Get the Hijri day of month for a Gregorian date. Returns `null` when out of range.

---

### `getDaysInHijriMonth`

```typescript
function getDaysInHijriMonth(hy: number, hm: number, options?: ConversionOptions): number
```

Get the number of days in a Hijri month. Returns 29 or 30.

**Throws:** `Error` if the year/month combination is outside the supported range.

**Example:**

```typescript
getDaysInHijriMonth(1444, 9); // 29 or 30 (Ramadan 1444)
getDaysInHijriMonth(1444, 1); // 30 (Muharram 1444)
```

---

### `getHijriQuarter`

```typescript
function getHijriQuarter(date: Date, options?: ConversionOptions): number | null
```

Get the Hijri quarter (1-4) for a date. Months 1-3 = Q1, 4-6 = Q2, 7-9 = Q3, 10-12 = Q4.

Returns `null` when out of range.

**Example:**

```typescript
getHijriQuarter(new Date(2023, 2, 23, 12)); // 3 (Ramadan = month 9 = Q3)
```

---

## Names

### `getHijriMonthName`

```typescript
function getHijriMonthName(hm: number, length?: 'long' | 'medium' | 'short'): string
```

Get the English name of a Hijri month.

**Parameters:**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hm` | `number` | | Month number (1-12) |
| `length` | `'long' \| 'medium' \| 'short'` | `'long'` | Name length |

**Throws:** `RangeError` if `hm` is not in [1, 12].

**Month names by length:**

| Month | Long | Medium | Short |
| --- | --- | --- | --- |
| 1 | Muharram | Muharram | Muh |
| 2 | Safar | Safar | Saf |
| 3 | Rabi'l Awwal | Rabi1 | Ra1 |
| 4 | Rabi'l Thani | Rabi2 | Ra2 |
| 5 | Jumadal Awwal | Jumada1 | Ju1 |
| 6 | Jumadal Thani | Jumada2 | Ju2 |
| 7 | Rajab | Rajab | Raj |
| 8 | Sha'ban | Shaban | Shb |
| 9 | Ramadan | Ramadan | Ram |
| 10 | Shawwal | Shawwal | Shw |
| 11 | Dhul Qi'dah | Dhul-Qidah | DhQ |
| 12 | Dhul Hijjah | Dhul-Hijjah | DhH |

---

### `getHijriWeekdayName`

```typescript
function getHijriWeekdayName(date: Date, length?: 'long' | 'short'): string
```

Get the Arabic weekday name for a Gregorian date. Uses `Date.getDay()` (0 = Sunday through 6 = Saturday) as the index.

**Weekday names:**

| JS getDay() | Day | Long | Short |
| --- | --- | --- | --- |
| 0 | Sunday | Yawm al-Ahad | Ahad |
| 1 | Monday | Yawm al-Ithnayn | Ithn |
| 2 | Tuesday | Yawm ath-Thulatha' | Thul |
| 3 | Wednesday | Yawm al-Arba`a' | Arba |
| 4 | Thursday | Yawm al-Khamis | Kham |
| 5 | Friday | Yawm al-Jum`a | Jum`a |
| 6 | Saturday | Yawm as-Sabt | Sabt |

---

## Formatting

### `formatHijriDate`

```typescript
function formatHijriDate(date: Date, formatStr: string, options?: ConversionOptions): string
```

Format a Gregorian date using Hijri calendar tokens.

Returns an empty string when the date falls outside the supported range. Non-token text passes through unchanged.

**Format tokens:**

| Token | Output | Example |
| --- | --- | --- |
| `iYYYY` | 4-digit Hijri year | `1444` |
| `iYY` | 2-digit Hijri year | `44` |
| `iMMMM` | Long month name | `Ramadan` |
| `iMMM` | Medium month name | `Ramadan` |
| `iMM` | Zero-padded month (01-12) | `09` |
| `iM` | Month (1-12) | `9` |
| `iDD` | Zero-padded day (01-30) | `01` |
| `iD` | Day (1-30) | `1` |
| `iEEEE` | Long weekday name | `Yawm al-Khamis` |
| `iEEE` | Short weekday name | `Kham` |
| `iE` | Numeric weekday (1=Sun, 7=Sat) | `5` |
| `ioooo` | Long era | `AH` |
| `iooo` | Short era | `AH` |

**Examples:**

```typescript
formatHijriDate(new Date(2023, 2, 23, 12), 'iYYYY-iMM-iDD');
// '1444-09-01'

formatHijriDate(new Date(2023, 2, 23, 12), 'iD iMMMM iYYYY ioooo');
// '1 Ramadan 1444 AH'

formatHijriDate(new Date(2023, 2, 23), 'iEEEE');
// 'Yawm al-Khamis'
```

---

## Arithmetic

### `addHijriMonths`

```typescript
function addHijriMonths(date: Date, months: number, options?: ConversionOptions): Date
```

Add a number of Hijri months to a Gregorian date.

Handles year rollover automatically. If the resulting month has fewer days than the original day, the day is clamped to the last day of the new month. Accepts negative values to subtract months.

**Throws:** `Error` if the input or result is outside the supported range.

**Example:**

```typescript
// 1 Ramadan 1444 + 1 month = 1 Shawwal 1444
addHijriMonths(new Date(2023, 2, 23, 12), 1);

// Month rollover: Dhul Hijjah + 1 = Muharram of next year
addHijriMonths(new Date(2023, 6, 18, 12), 1);
```

---

### `addHijriYears`

```typescript
function addHijriYears(date: Date, years: number, options?: ConversionOptions): Date
```

Add a number of Hijri years to a Gregorian date.

If the resulting year has fewer days in the same month (e.g., day 30 in a 29-day month), the day is clamped to the last valid day. Accepts negative values to subtract years.

**Throws:** `Error` if the input or result is outside the supported range.

---

## Month Boundaries

### `startOfHijriMonth`

```typescript
function startOfHijriMonth(date: Date, options?: ConversionOptions): Date
```

Get the first day of the Hijri month that contains the given date.

**Throws:** `Error` if the date is outside the supported range.

---

### `endOfHijriMonth`

```typescript
function endOfHijriMonth(date: Date, options?: ConversionOptions): Date
```

Get the last day of the Hijri month that contains the given date.

**Throws:** `Error` if the date is outside the supported range.

**Example:**

```typescript
// 1 Ramadan 1444 is March 23, 2023
const start = startOfHijriMonth(new Date(2023, 3, 1, 12));
// Date: 2023-03-23T00:00:00.000Z

const end = endOfHijriMonth(new Date(2023, 3, 1, 12));
// Date: last day of Ramadan 1444
```

---

## Comparisons

### `isSameHijriMonth`

```typescript
function isSameHijriMonth(dateA: Date, dateB: Date, options?: ConversionOptions): boolean
```

Check whether two Gregorian dates fall in the same Hijri month.

Returns `false` if either date is outside the supported range.

---

### `isSameHijriYear`

```typescript
function isSameHijriYear(dateA: Date, dateB: Date, options?: ConversionOptions): boolean
```

Check whether two Gregorian dates fall in the same Hijri year.

Returns `false` if either date is outside the supported range.

**Example:**

```typescript
// Both in Ramadan 1444
isSameHijriMonth(new Date(2023, 2, 23, 12), new Date(2023, 3, 10, 12)); // true

// 1444 vs 1446
isSameHijriYear(new Date(2023, 2, 23, 12), new Date(2024, 6, 7, 12)); // false
```

---

[Home](Home) · [API Reference](API-Reference) · [Architecture](Architecture)
