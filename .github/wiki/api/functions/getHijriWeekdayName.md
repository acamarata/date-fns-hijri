[**date-fns-hijri v1.0.1**](../README.md)

***

[date-fns-hijri](../README.md) / getHijriWeekdayName

# Function: getHijriWeekdayName()

> **getHijriWeekdayName**(`date`, `length?`): `string`

Defined in: [src/index.ts:148](https://github.com/acamarata/date-fns-hijri/blob/e8ade1f9c489d2317f2f324f2a54bebcb30e4d6f/src/index.ts#L148)

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
