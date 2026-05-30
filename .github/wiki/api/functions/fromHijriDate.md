[**date-fns-hijri v1.0.1**](../README.md)

***

[date-fns-hijri](../README.md) / fromHijriDate

# Function: fromHijriDate()

> **fromHijriDate**(`hy`, `hm`, `hd`, `options?`): `Date`

Defined in: [src/index.ts:39](https://github.com/acamarata/date-fns-hijri/blob/a86df7dc09266326214c15cbd459de48d21cea29/src/index.ts#L39)

Convert a Hijri date to a Gregorian `Date`.

The returned `Date` is set to midnight UTC of the equivalent Gregorian day.

## Parameters

### hy

`number`

### hm

`number`

### hd

`number`

### options?

[`ConversionOptions`](../interfaces/ConversionOptions.md)

## Returns

`Date`

## Throws

If the Hijri date is invalid or outside the calendar's range.
