# Architecture

## Design Goals

The core goal was a function library that feels native to the JavaScript ecosystem. Anyone who has used date-fns will find the API familiar: one function per operation, plain `Date` inputs and outputs, no side effects, tree-shakeable.

Two constraints shaped the design:

1. The Hijri calendar engine should be a separate, zero-dependency package (`hijri-core`). This keeps `date-fns-hijri` thin and lets other libraries use the engine directly.
2. `date-fns-hijri` should not couple users to any specific calendar algorithm. The `options.calendar` parameter threads through to `hijri-core`'s registry, so custom calendar engines registered there are usable without changes to this package.

## Functional API Pattern

Every exported function is a standalone pure function. There are no classes, no global state, no configuration objects that persist between calls.

This mirrors how date-fns works:

```typescript
// date-fns style
import { addMonths, format } from 'date-fns';

// date-fns-hijri style
import { addHijriMonths, formatHijriDate } from 'date-fns-hijri';
```

Tree-shaking works as expected. `sideEffects: false` in `package.json` tells bundlers they can eliminate any function that isn't imported.

## Peer Dependency Pattern

`hijri-core` is a peer dependency. The consumer installs it explicitly:

```bash
pnpm add date-fns-hijri hijri-core
```

This pattern has two benefits:

- The consumer controls which version of `hijri-core` they use. If a critical fix ships in `hijri-core`, they can upgrade without waiting for a new `date-fns-hijri` release.
- Applications that use multiple Hijri-aware packages (e.g., both `date-fns-hijri` and a separate formatter) share a single `hijri-core` instance. The engine's calendar registry is global within that instance, so a calendar registered once is available everywhere.

The `devDependencies` includes `hijri-core: file:../hijri-core` for local development and CI. Published packages pick up the peer from the consumer's `node_modules`.

## Format Token Resolution

`formatHijriDate` uses a single regular expression to locate all tokens in one pass:

```
/iYYYY|iYY|iMMMM|iMMM|iMM|iM|iDD|iD|iEEEE|iEEE|iE|ioooo|iooo/g
```

Token ordering within the pattern matters. The engine uses JavaScript's `String.replace` with a global regex, which matches the first alternative at each position. Longer tokens appear before their prefixes:

- `iYYYY` before `iYY` (prevents `iYYYY` matching as `iYY` + `YY`)
- `iMMMM` before `iMMM` before `iMM` before `iM`
- `iEEEE` before `iEEE` before `iE`
- `ioooo` before `iooo`

The `iE` token uses `hwNumeric[date.getDay()]` where `hwNumeric = [1, 2, 3, 4, 5, 6, 7]`. Sunday maps to 1, Saturday to 7. This matches the ISO weekday convention in the Hijri context (Sunday = first day of the Islamic week).

Non-token text passes through unchanged because `String.replace` with a regex only replaces matched substrings. This means literal separators (`-`, `/`, ` `, `.`) and arbitrary text work without escaping.

## Out-of-Range Handling

The two types of functions handle out-of-range differently:

**Query functions** (getters, comparisons, `toHijriDate`, `formatHijriDate`): return `null` or an empty string. These functions are often called in display contexts where a silent fallback is appropriate. Throwing would require try/catch around every date display call.

**Mutation functions** (arithmetic, boundary, `fromHijriDate`): throw. When you call `addHijriMonths` or `startOfHijriMonth`, you expect a `Date` back. Returning `null` would require null checks on every arithmetic result, which is error-prone. An exception is the better signal.

## Calendar System Architecture

`hijri-core` implements a registry pattern:

```typescript
// hijri-core/src/registry.ts
const _engines = new Map<string, CalendarEngine>();

export function registerCalendar(name: string, engine: CalendarEngine): void {
  _engines.set(name, engine);
}
```

Two engines ship by default: `'uaq'` (Umm al-Qura) and `'fcna'` (FCNA/ISNA). Third parties can register custom engines and use them with `date-fns-hijri` by passing `{ calendar: 'mycalendar' }` to any function.

This package never touches the registry directly. It passes the `options` argument through to `hijri-core`'s convenience wrappers, which resolve the calendar name internally.

## Arithmetic Implementation

Month arithmetic works by converting to a total month offset from the Hijri epoch, adding the delta, then decomposing back to year/month:

```typescript
const totalMonths = (h.hy - 1) * 12 + (h.hm - 1) + months;
const newYear  = Math.floor(totalMonths / 12) + 1;
const newMonth = (((totalMonths % 12) + 12) % 12) + 1;
```

The double-modulo pattern `(((n % 12) + 12) % 12)` handles negative values correctly. If `months` is `-1` and the current month is 1 (Muharram), `totalMonths % 12` gives `-1`, the pattern corrects it to `11`, and the year decrements by 1 via `Math.floor`.

Day clamping runs after the new month is determined:

```typescript
const maxDay = coreDaysInHijriMonth(newYear, newMonth, options);
const newDay = Math.min(h.hd, maxDay);
```

This handles the case where month lengths differ (29 vs 30 days) without requiring the caller to know the calendar structure.

## Build Configuration

`tsup` produces four outputs from a single source:

| File | Format | Purpose |
| --- | --- | --- |
| `dist/index.cjs` | CommonJS | Node.js `require()` |
| `dist/index.mjs` | ESM | `import` / bundlers |
| `dist/index.d.ts` | TypeScript declarations | CJS consumers |
| `dist/index.d.mts` | TypeScript declarations | ESM consumers |

`hijri-core` is marked as external so it resolves from the consumer's `node_modules` rather than being bundled. This is required for the peer dependency pattern to work correctly.

Source maps ship in the package for debugging. The `target: 'es2020'` setting is conservative enough to run on all supported Node versions (20+) without polyfills.

---

[Home](Home) · [API Reference](API-Reference) · [Architecture](Architecture)
