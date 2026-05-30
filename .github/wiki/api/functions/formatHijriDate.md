[**date-fns-hijri v1.0.1**](../README.md)

***

[date-fns-hijri](../README.md) / formatHijriDate

# Function: formatHijriDate()

> **formatHijriDate**(`date`, `formatStr`, `options?`): `string`

Defined in: [src/index.ts:185](https://github.com/acamarata/date-fns-hijri/blob/a86df7dc09266326214c15cbd459de48d21cea29/src/index.ts#L185)

Format a Gregorian date using Hijri calendar tokens.

Supported tokens:

| Token   | Output                     | Example        |
| ------- | -------------------------- | -------------- |
| iYYYY   | 4-digit Hijri year         | 1444           |
| iYY     | 2-digit Hijri year         | 44             |
| iMMMM   | Long month name            | Ramadan        |
| iMMM    | Medium month name          | Ramadan        |
| iMM     | Zero-padded month (01–12)  | 09             |
| iM      | Month (1–12)               | 9              |
| iDD     | Zero-padded day (01–30)    | 01             |
| iD      | Day (1–30)                 | 1              |
| iEEEE   | Long weekday name          | Yawm al-Khamis |
| iEEE    | Short weekday name         | Kham           |
| iE      | Numeric weekday (1=Sun–7=Sat)| 5             |
| ioooo   | Long era                   | AH             |
| iooo    | Short era                  | AH             |

Returns an empty string when the date falls outside the supported range.

## Parameters

### date

`Date`

### formatStr

`string`

### options?

[`ConversionOptions`](../interfaces/ConversionOptions.md)

## Returns

`string`
