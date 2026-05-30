[**date-fns-hijri v1.0.1**](../README.md)

***

[date-fns-hijri](../README.md) / getHijriWeekdayName

# Function: getHijriWeekdayName()

> **getHijriWeekdayName**(`date`, `length?`): `string`

Defined in: [src/index.ts:148](https://github.com/acamarata/date-fns-hijri/blob/a86df7dc09266326214c15cbd459de48d21cea29/src/index.ts#L148)

Get the Arabic weekday name for a Gregorian date.

Uses `Date.getDay()` (0 = Sunday, 6 = Saturday) as the index.

## Parameters

### date

`Date`

Any Gregorian `Date`.

### length?

`"long"` \| `"short"`

`'long'` (default) or `'short'`.

## Returns

`string`
