[**date-fns-hijri v1.0.1**](../README.md)

***

[date-fns-hijri](../README.md) / CalendarEngine

# Interface: CalendarEngine

Defined in: node\_modules/.pnpm/hijri-core@1.0.0/node\_modules/hijri-core/dist/index.d.mts:13

## Properties

### id

> `readonly` **id**: `string`

Defined in: node\_modules/.pnpm/hijri-core@1.0.0/node\_modules/hijri-core/dist/index.d.mts:14

## Methods

### daysInMonth()

> **daysInMonth**(`hy`, `hm`): `number`

Defined in: node\_modules/.pnpm/hijri-core@1.0.0/node\_modules/hijri-core/dist/index.d.mts:19

#### Parameters

##### hy

`number`

##### hm

`number`

#### Returns

`number`

***

### isValid()

> **isValid**(`hy`, `hm`, `hd`): `boolean`

Defined in: node\_modules/.pnpm/hijri-core@1.0.0/node\_modules/hijri-core/dist/index.d.mts:18

#### Parameters

##### hy

`number`

##### hm

`number`

##### hd

`number`

#### Returns

`boolean`

***

### toGregorian()

> **toGregorian**(`hy`, `hm`, `hd`): `Date` \| `null`

Defined in: node\_modules/.pnpm/hijri-core@1.0.0/node\_modules/hijri-core/dist/index.d.mts:17

Returns null for invalid or out-of-range input. Never throws.

#### Parameters

##### hy

`number`

##### hm

`number`

##### hd

`number`

#### Returns

`Date` \| `null`

***

### toHijri()

> **toHijri**(`date`): [`HijriDate`](HijriDate.md) \| `null`

Defined in: node\_modules/.pnpm/hijri-core@1.0.0/node\_modules/hijri-core/dist/index.d.mts:15

#### Parameters

##### date

`Date`

#### Returns

[`HijriDate`](HijriDate.md) \| `null`
