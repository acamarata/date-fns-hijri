# Benchmarks

Performance measurements for date-fns-hijri on Node.js 24, Apple M-series hardware.

## Methodology

All benchmarks use `performance.now()` with 10,000 iterations per test. The first 100 iterations are discarded as warm-up. Results are median across 5 runs.

```typescript
import { toHijriDate, fromHijriDate, formatHijriDate, addHijriMonths } from 'date-fns-hijri';

const date = new Date(2023, 2, 23);
const N = 10_000;

const t0 = performance.now();
for (let i = 0; i < N; i++) toHijriDate(date);
const elapsed = performance.now() - t0;
console.log(`toHijriDate: ${(elapsed / N * 1000).toFixed(1)} µs/call`);
```

## Results

| Function | µs/call | Notes |
| --- | --- | --- |
| `toHijriDate` (UAQ) | ~0.4 | Table lookup + binary search |
| `toHijriDate` (FCNA) | ~12 | Astronomical calculation via hijri-core |
| `fromHijriDate` (UAQ) | ~0.5 | Reverse table lookup |
| `fromHijriDate` (FCNA) | ~13 | Reverse astronomical calculation |
| `formatHijriDate` | ~1.2 | Includes `toHijriDate` + token replacement |
| `addHijriMonths` | ~1.8 | Includes conversion in both directions |
| `getHijriMonthName` | ~0.02 | Array index lookup |

## Bundle size

Measured with esbuild (min+gz), hijri-core as external:

| Build | Raw | Min | Min+gz |
| --- | --- | --- | --- |
| ESM (index.mjs) | ~6.1 KB | ~2.8 KB | ~1.3 KB |
| CJS (index.cjs) | ~6.4 KB | ~3.0 KB | ~1.4 KB |

hijri-core itself adds approximately 40 KB (min+gz) as a peer dependency.

## Memory

The UAQ calendar table is loaded once by hijri-core and shared across all calls. The table occupies approximately 8 KB of heap after initial load. Subsequent conversions do not allocate new objects beyond the return value.

## Reproduction

To reproduce on your own hardware:

```bash
git clone https://github.com/acamarata/date-fns-hijri.git
cd date-fns-hijri
pnpm install
pnpm build
node -e "
import('./dist/index.mjs').then(({ toHijriDate }) => {
  const d = new Date(2023, 2, 23);
  const N = 10000;
  const t = performance.now();
  for (let i = 0; i < N; i++) toHijriDate(d);
  console.log((performance.now() - t) / N * 1000, 'µs/call');
});
"
```
