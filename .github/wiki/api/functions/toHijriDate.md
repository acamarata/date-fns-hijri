[**date-fns-hijri v1.0.1**](../README.md)

***

[date-fns-hijri](../README.md) / toHijriDate

# Function: toHijriDate()

> **toHijriDate**(`date`, `options?`): [`HijriDate`](../interfaces/HijriDate.md) \| `null`

Defined in: [src/index.ts:28](https://github.com/acamarata/date-fns-hijri/blob/e8ade1f9c489d2317f2f324f2a54bebcb30e4d6f/src/index.ts#L28)

Convert a Gregorian `Date` to a Hijri date object.

Returns `null` when the date falls outside the calendar's supported range
(UAQ: 1318–1500 AH / 1900–2076 CE; FCNA extends slightly further).

## Parameters

### date

`Date`

### options?

[`ConversionOptions`](../interfaces/ConversionOptions.md)

## Returns

[`HijriDate`](../interfaces/HijriDate.md) \| `null`
