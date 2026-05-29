# Basic Usage Examples

## Display today's Hijri date

```typescript
import { toHijriDate, getHijriMonthName } from 'date-fns-hijri';

const today = new Date();
const hijri = toHijriDate(today);

if (hijri) {
  const monthName = getHijriMonthName(hijri.hm);
  console.log(`${hijri.hd} ${monthName} ${hijri.hy} AH`);
  // e.g. '1 Ramadan 1444 AH'
}
```

## Convert a known date

```typescript
import { toHijriDate } from 'date-fns-hijri';

// 1 Ramadan 1444 AH = 23 March 2023 CE
const hijri = toHijriDate(new Date(2023, 2, 23));
console.log(hijri);
// { hy: 1444, hm: 9, hd: 1 }
```

## Build a Gregorian date from Hijri components

```typescript
import { fromHijriDate } from 'date-fns-hijri';

// First day of Ramadan 1445
const date = fromHijriDate(1445, 9, 1);
console.log(date.toDateString());
// 'Mon Mar 11 2024'
```

## Format for display

```typescript
import { formatHijriDate } from 'date-fns-hijri';

const date = new Date(2024, 2, 11); // 1 Ramadan 1445
console.log(formatHijriDate(date, 'iD iMMMM iYYYY'));  // '1 Ramadan 1445'
console.log(formatHijriDate(date, 'iDD/iMM/iYYYY'));   // '01/09/1445'
console.log(formatHijriDate(date, 'iD iMMM iYY'));      // '1 Ram 45'
```

## Month name lookup

```typescript
import { getHijriMonthName } from 'date-fns-hijri';

for (let m = 1; m <= 12; m++) {
  console.log(`${m}: ${getHijriMonthName(m)}`);
}
// 1: Muharram
// 2: Safar
// 3: Rabi al-Awwal
// ...
// 9: Ramadan
// ...
// 12: Dhul Hijjah
```

## Add months

```typescript
import { addHijriMonths, toHijriDate, getHijriMonthName } from 'date-fns-hijri';

// Start at 1 Ramadan 1444
const start = new Date(2023, 2, 23);

// Add 3 months (Ramadan -> Shawwal -> Dhul Qa'dah -> Dhul Hijjah)
const result = addHijriMonths(start, 3);
const hijri = toHijriDate(result);
if (hijri) {
  console.log(`${hijri.hd} ${getHijriMonthName(hijri.hm)} ${hijri.hy}`);
  // '1 Dhul Hijjah 1444'
}
```

## Use the FCNA calendar

```typescript
import { toHijriDate, formatHijriDate } from 'date-fns-hijri';

const opts = { calendar: 'fcna' };
const date = new Date(2023, 2, 23);

const hijri = toHijriDate(date, opts);
const label = formatHijriDate(date, 'iD iMMMM iYYYY', opts);
console.log(label);
// May differ from UAQ by one day around month starts
```

## CommonJS

```js
const { toHijriDate, fromHijriDate, getHijriMonthName } = require('date-fns-hijri');

const hijri = toHijriDate(new Date());
if (hijri) {
  console.log(`Month: ${getHijriMonthName(hijri.hm)}`);
}
```
