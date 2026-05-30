[**date-fns-hijri v1.0.1**](../README.md)

***

[date-fns-hijri](../README.md) / addHijriMonths

# Function: addHijriMonths()

> **addHijriMonths**(`date`, `months`, `options?`): `Date`

Defined in: [src/index.ts:267](https://github.com/acamarata/date-fns-hijri/blob/e8ade1f9c489d2317f2f324f2a54bebcb30e4d6f/src/index.ts#L267)

Add a number of Hijri months to a Gregorian date.

Handles year rollover automatically. Month addition wraps at month 12 and
increments the year. If the result's month has fewer days than the original
day, the day is clamped to the last day of the new month.

## Parameters

### date

`Date`

### months

`number`

### options?

[`ConversionOptions`](../interfaces/ConversionOptions.md)

## Returns

`Date`

## Throws

If the resulting Hijri date is outside the supported range.
