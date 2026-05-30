[**date-fns-hijri v1.0.1**](../README.md)

***

[date-fns-hijri](../README.md) / getHijriQuarter

# Function: getHijriQuarter()

> **getHijriQuarter**(`date`, `options?`): `number` \| `null`

Defined in: [src/index.ts:376](https://github.com/acamarata/date-fns-hijri/blob/e8ade1f9c489d2317f2f324f2a54bebcb30e4d6f/src/index.ts#L376)

Get the Hijri quarter (1–4) for a Gregorian date.

Months 1–3 = Q1, 4–6 = Q2, 7–9 = Q3, 10–12 = Q4.

Returns `null` when the date is outside the supported range.

## Parameters

### date

`Date`

### options?

[`ConversionOptions`](../interfaces/ConversionOptions.md)

## Returns

`number` \| `null`
