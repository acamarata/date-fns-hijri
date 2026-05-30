[**date-fns-hijri v1.0.1**](../README.md)

***

[date-fns-hijri](../README.md) / addHijriYears

# Function: addHijriYears()

> **addHijriYears**(`date`, `years`, `options?`): `Date`

Defined in: [src/index.ts:293](https://github.com/acamarata/date-fns-hijri/blob/a86df7dc09266326214c15cbd459de48d21cea29/src/index.ts#L293)

Add a number of Hijri years to a Gregorian date.

If the resulting year has a shorter Ramadan (or any month) than the original
day, the day is clamped to the last day of that month.

## Parameters

### date

`Date`

### years

`number`

### options?

[`ConversionOptions`](../interfaces/ConversionOptions.md)

## Returns

`Date`

## Throws

If the resulting Hijri date is outside the supported range.
