# date-fns-hijri — PRI (Per-Repo Instructions)

**PPI:** `~/Sites/acamarata/.claude/CLAUDE.md`

## What This Is

date-fns-style utility functions for Hijri calendar operations. Wraps hijri-core with a
functional API for converting, formatting, and validating Hijri dates. Each function is
a pure, stateless utility. No classes. No configuration object. The API mirrors date-fns
conventions so the learning curve is minimal for consumers already using that ecosystem.

**npm:** `date-fns-hijri@1.0.0`
**Language:** TypeScript
**License:** MIT

## Key Technical Details

- Peer dependencies: `hijri-core@^1.0.0`
- Note: `date-fns` itself is NOT a peer dep — functions accept plain `Date` objects and work with any date library
- Key exports: `toHijriDate`, `fromHijriDate`, `formatHijriDate`, `addHijriMonths`, `getHijriMonthName`
- Options argument on every function selects calendar system (UAQ default, FCNA optional)
- Returns `null` for out-of-range inputs rather than throwing (conversion functions)
- Dual CJS/ESM build via tsup
- Zero runtime dependencies (peer deps are provided by the consumer)

## Architecture

`src/index.ts` exports all public functions. `src/types.ts` holds shared types and
interfaces. Built to `dist/` (gitignored) with `.cjs` and `.mjs` outputs plus dual type
declarations.

## Commands

- `pnpm install` — install dev deps
- `pnpm build` — tsup build
- `pnpm test` — run test.mjs + test-cjs.cjs
- `pnpm run typecheck` — tsc --noEmit

## Important Notes

- This is a standalone functional utility package, not a plugin — it works with any date library
- hijri-core provides the actual calendar engine — this package is a thin functional adapter
- Changes to hijri-core's API may require updates here
- No dependency on date-fns itself — the "date-fns-style" refers to API convention only
