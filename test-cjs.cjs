'use strict';

const assert = require('node:assert/strict');
const {
  toHijriDate,
  fromHijriDate,
  isValidHijriDate,
  getHijriMonthName,
  formatHijriDate,
  getHijriYear,
  getHijriMonth,
  getHijriDay,
} = require('./dist/index.cjs');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[${name}]... PASS`);
    passed++;
  } catch (err) {
    console.error(`[${name}]... FAIL: ${err.message}`);
    failed++;
  }
}

const REF = new Date(2023, 2, 23, 12); // 1 Ramadan 1444

test('CJS: toHijriDate returns correct HijriDate', () => {
  const h = toHijriDate(REF);
  assert.ok(h !== null);
  assert.equal(h.hy, 1444);
  assert.equal(h.hm, 9);
  assert.equal(h.hd, 1);
});

test('CJS: fromHijriDate converts to correct Gregorian date', () => {
  const d = fromHijriDate(1444, 9, 1);
  assert.equal(d.getUTCFullYear(), 2023);
  assert.equal(d.getUTCMonth(), 2);
  assert.equal(d.getUTCDate(), 23);
});

test('CJS: isValidHijriDate true for valid date', () => {
  assert.equal(isValidHijriDate(1444, 9, 1), true);
});

test('CJS: isValidHijriDate false for invalid month', () => {
  assert.equal(isValidHijriDate(1444, 13, 1), false);
});

test('CJS: getHijriMonthName long', () => {
  assert.equal(getHijriMonthName(9), 'Ramadan');
});

test('CJS: getHijriMonthName short', () => {
  assert.equal(getHijriMonthName(9, 'short'), 'Ram');
});

test('CJS: formatHijriDate iYYYY-iMM-iDD', () => {
  assert.equal(formatHijriDate(REF, 'iYYYY-iMM-iDD'), '1444-09-01');
});

test('CJS: getHijriYear', () => {
  assert.equal(getHijriYear(REF), 1444);
});

test('CJS: getHijriMonth', () => {
  assert.equal(getHijriMonth(REF), 9);
});

test('CJS: getHijriDay', () => {
  assert.equal(getHijriDay(REF), 1);
});

const total = passed + failed;
console.log(`\n${passed}/${total} tests passed`);
if (failed > 0) {
  process.exit(1);
}
