'use strict';

const { describe, it } = require('node:test');
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

const REF = new Date(2023, 2, 23, 12); // 1 Ramadan 1444

describe('CJS: toHijriDate', () => {
  it('returns correct HijriDate', () => {
    const h = toHijriDate(REF);
    assert.ok(h !== null);
    assert.equal(h.hy, 1444);
    assert.equal(h.hm, 9);
    assert.equal(h.hd, 1);
  });
});

describe('CJS: fromHijriDate', () => {
  it('converts to correct Gregorian date', () => {
    const d = fromHijriDate(1444, 9, 1);
    assert.equal(d.getUTCFullYear(), 2023);
    assert.equal(d.getUTCMonth(), 2);
    assert.equal(d.getUTCDate(), 23);
  });
});

describe('CJS: isValidHijriDate', () => {
  it('true for valid date', () => {
    assert.equal(isValidHijriDate(1444, 9, 1), true);
  });

  it('false for invalid month', () => {
    assert.equal(isValidHijriDate(1444, 13, 1), false);
  });
});

describe('CJS: getHijriMonthName', () => {
  it('long', () => {
    assert.equal(getHijriMonthName(9), 'Ramadan');
  });

  it('short', () => {
    assert.equal(getHijriMonthName(9, 'short'), 'Ram');
  });
});

describe('CJS: formatHijriDate', () => {
  it('iYYYY-iMM-iDD', () => {
    assert.equal(formatHijriDate(REF, 'iYYYY-iMM-iDD'), '1444-09-01');
  });
});

describe('CJS: field getters', () => {
  it('getHijriYear', () => {
    assert.equal(getHijriYear(REF), 1444);
  });

  it('getHijriMonth', () => {
    assert.equal(getHijriMonth(REF), 9);
  });

  it('getHijriDay', () => {
    assert.equal(getHijriDay(REF), 1);
  });
});
