import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  toHijriDate,
  fromHijriDate,
  isValidHijriDate,
  getHijriYear,
  getHijriMonth,
  getHijriDay,
  getDaysInHijriMonth,
  getHijriMonthName,
  getHijriWeekdayName,
  formatHijriDate,
  addHijriMonths,
  addHijriYears,
  startOfHijriMonth,
  endOfHijriMonth,
  isSameHijriMonth,
  isSameHijriYear,
  getHijriQuarter,
} from './dist/index.mjs';

const REF = new Date(2023, 2, 23, 12); // 1 Ramadan 1444

describe('toHijriDate', () => {
  it('1 Ramadan 1444', () => {
    const h = toHijriDate(new Date(2023, 2, 23, 12));
    assert.ok(h !== null, 'expected non-null');
    assert.equal(h.hy, 1444);
    assert.equal(h.hm, 9);
    assert.equal(h.hd, 1);
  });

  it('1 Muharram 1446', () => {
    const h = toHijriDate(new Date(2024, 6, 7, 12));
    assert.ok(h !== null, 'expected non-null');
    assert.equal(h.hy, 1446);
    assert.equal(h.hm, 1);
    assert.equal(h.hd, 1);
  });

  it('out of range returns null', () => {
    const h = toHijriDate(new Date(1800, 0, 1));
    assert.equal(h, null);
  });
});

describe('fromHijriDate', () => {
  it('1 Ramadan 1444 -> 2023-03-23', () => {
    const d = fromHijriDate(1444, 9, 1);
    assert.equal(d.getUTCFullYear(), 2023);
    assert.equal(d.getUTCMonth(), 2);
    assert.equal(d.getUTCDate(), 23);
  });

  it('1 Muharram 1446 -> 2024-07-07', () => {
    const d = fromHijriDate(1446, 1, 1);
    assert.equal(d.getUTCFullYear(), 2024);
    assert.equal(d.getUTCMonth(), 6);
    assert.equal(d.getUTCDate(), 7);
  });

  it('throws on invalid month', () => {
    assert.throws(() => fromHijriDate(1444, 13, 1), /invalid|range/i);
  });
});

describe('isValidHijriDate', () => {
  it('valid date', () => {
    assert.equal(isValidHijriDate(1444, 9, 1), true);
  });

  it('invalid month 13', () => {
    assert.equal(isValidHijriDate(1444, 13, 1), false);
  });

  it('day 0 is invalid', () => {
    assert.equal(isValidHijriDate(1444, 9, 0), false);
  });
});

describe('field getters', () => {
  it('getHijriYear', () => {
    assert.equal(getHijriYear(REF), 1444);
  });

  it('getHijriMonth', () => {
    assert.equal(getHijriMonth(REF), 9);
  });

  it('getHijriDay', () => {
    assert.equal(getHijriDay(REF), 1);
  });

  it('getHijriYear: out of range returns null', () => {
    assert.equal(getHijriYear(new Date(1800, 0, 1)), null);
  });
});

describe('getDaysInHijriMonth', () => {
  it('Ramadan 1444', () => {
    const days = getDaysInHijriMonth(1444, 9);
    assert.ok(days === 29 || days === 30, `expected 29 or 30, got ${days}`);
  });

  it('month 1 of 1444', () => {
    const days = getDaysInHijriMonth(1444, 1);
    assert.ok(days === 29 || days === 30, `expected 29 or 30, got ${days}`);
  });
});

describe('getHijriMonthName', () => {
  it('long (default)', () => {
    assert.equal(getHijriMonthName(9), 'Ramadan');
  });

  it('medium', () => {
    assert.equal(getHijriMonthName(9, 'medium'), 'Ramadan');
  });

  it('short', () => {
    assert.equal(getHijriMonthName(9, 'short'), 'Ram');
  });

  it('Muharram long', () => {
    assert.equal(getHijriMonthName(1), 'Muharram');
  });

  it('Dhul Hijjah long', () => {
    assert.equal(getHijriMonthName(12), 'Dhul Hijjah');
  });

  it('throws on month 0', () => {
    assert.throws(() => getHijriMonthName(0), RangeError);
  });

  it('throws on month 13', () => {
    assert.throws(() => getHijriMonthName(13), RangeError);
  });
});

describe('getHijriWeekdayName', () => {
  it('Thursday long', () => {
    assert.equal(getHijriWeekdayName(new Date(2023, 2, 23)), 'Yawm al-Khamis');
  });

  it('Thursday short', () => {
    assert.equal(getHijriWeekdayName(new Date(2023, 2, 23), 'short'), 'Kham');
  });
});

describe('formatHijriDate', () => {
  it('iYYYY-iMM-iDD', () => {
    assert.equal(formatHijriDate(REF, 'iYYYY-iMM-iDD'), '1444-09-01');
  });

  it('iMMMM', () => {
    assert.equal(formatHijriDate(REF, 'iMMMM'), 'Ramadan');
  });

  it('iEEEE', () => {
    assert.equal(formatHijriDate(new Date(2023, 2, 23), 'iEEEE'), 'Yawm al-Khamis');
  });

  it('iEEE', () => {
    assert.equal(formatHijriDate(new Date(2023, 2, 23), 'iEEE'), 'Kham');
  });

  it('ioooo era', () => {
    assert.equal(formatHijriDate(REF, 'ioooo'), 'AH');
  });

  it('iooo era', () => {
    assert.equal(formatHijriDate(REF, 'iooo'), 'AH');
  });

  it('iYY two-digit year', () => {
    assert.equal(formatHijriDate(REF, 'iYY'), '44');
  });

  it('iMMM medium month', () => {
    assert.equal(formatHijriDate(REF, 'iMMM'), 'Ramadan');
  });

  it('iM bare month', () => {
    assert.equal(formatHijriDate(REF, 'iM'), '9');
  });

  it('iD bare day', () => {
    assert.equal(formatHijriDate(REF, 'iD'), '1');
  });

  it('iE numeric weekday (Thursday = 5)', () => {
    assert.equal(formatHijriDate(new Date(2023, 2, 23), 'iE'), '5');
  });

  it('out of range returns empty string', () => {
    assert.equal(formatHijriDate(new Date(1800, 0, 1), 'iYYYY-iMM-iDD'), '');
  });

  it('mixed literal and tokens', () => {
    const result = formatHijriDate(REF, 'iD iMMMM iYYYY ioooo');
    assert.equal(result, '1 Ramadan 1444 AH');
  });
});

describe('addHijriMonths', () => {
  it('+1 from Ramadan -> Shawwal', () => {
    const result = toHijriDate(addHijriMonths(REF, 1));
    assert.ok(result !== null);
    assert.equal(result.hy, 1444);
    assert.equal(result.hm, 10);
  });

  it('+3 from month 10 -> wraps to next year', () => {
    const dec = new Date(2023, 3, 21, 12);
    const result = toHijriDate(addHijriMonths(dec, 3));
    assert.ok(result !== null);
    assert.equal(result.hy, 1445);
  });

  it('+0 is identity', () => {
    const result = toHijriDate(addHijriMonths(REF, 0));
    assert.ok(result !== null);
    assert.equal(result.hy, 1444);
    assert.equal(result.hm, 9);
    assert.equal(result.hd, 1);
  });

  it('-1 from Ramadan -> Shaban', () => {
    const result = toHijriDate(addHijriMonths(REF, -1));
    assert.ok(result !== null);
    assert.equal(result.hm, 8);
  });
});

describe('addHijriYears', () => {
  it('+1 from Ramadan 1444 -> Ramadan 1445', () => {
    const result = toHijriDate(addHijriYears(REF, 1));
    assert.ok(result !== null);
    assert.equal(result.hy, 1445);
    assert.equal(result.hm, 9);
  });

  it('-1 from Ramadan 1444 -> Ramadan 1443', () => {
    const result = toHijriDate(addHijriYears(REF, -1));
    assert.ok(result !== null);
    assert.equal(result.hy, 1443);
    assert.equal(result.hm, 9);
  });
});

describe('startOfHijriMonth / endOfHijriMonth', () => {
  it('startOfHijriMonth: 1 Ramadan 1444 = 2023-03-23', () => {
    const start = startOfHijriMonth(REF);
    assert.equal(start.getFullYear(), 2023);
    assert.equal(start.getMonth(), 2);
    assert.equal(start.getDate(), 23);
  });

  it('endOfHijriMonth: last day of Ramadan 1444', () => {
    const end = toHijriDate(endOfHijriMonth(REF));
    assert.ok(end !== null);
    assert.equal(end.hy, 1444);
    assert.equal(end.hm, 9);
    assert.ok(end.hd === 29 || end.hd === 30, `expected 29 or 30, got ${end.hd}`);
  });
});

describe('isSameHijriMonth / isSameHijriYear', () => {
  it('both in Ramadan 1444', () => {
    assert.equal(isSameHijriMonth(new Date(2023, 2, 23, 12), new Date(2023, 3, 10, 12)), true);
  });

  it('different months', () => {
    assert.equal(isSameHijriMonth(new Date(2023, 2, 23, 12), new Date(2023, 4, 1, 12)), false);
  });

  it('out of range returns false', () => {
    assert.equal(isSameHijriMonth(new Date(1800, 0, 1), new Date(2023, 2, 23, 12)), false);
  });

  it('both in 1444', () => {
    assert.equal(isSameHijriYear(new Date(2023, 2, 23, 12), new Date(2023, 1, 10, 12)), true);
  });

  it('different years', () => {
    assert.equal(isSameHijriYear(new Date(2023, 2, 23, 12), new Date(2024, 6, 7, 12)), false);
  });
});

describe('getHijriQuarter', () => {
  it('month 9 = Q3', () => {
    assert.equal(getHijriQuarter(REF), 3);
  });

  it('month 1 = Q1', () => {
    assert.equal(getHijriQuarter(new Date(2024, 6, 7, 12)), 1);
  });

  it('out of range returns null', () => {
    assert.equal(getHijriQuarter(new Date(1800, 0, 1)), null);
  });
});

describe('FCNA calendar', () => {
  it('toHijriDate returns valid HijriDate', () => {
    const h = toHijriDate(new Date(2023, 2, 23, 12), { calendar: 'fcna' });
    assert.ok(h !== null, 'expected non-null for FCNA');
    assert.ok(typeof h.hy === 'number');
    assert.ok(h.hm >= 1 && h.hm <= 12);
    assert.ok(h.hd >= 1 && h.hd <= 30);
  });

  it('formatHijriDate works', () => {
    const result = formatHijriDate(new Date(2023, 2, 23, 12), 'iYYYY-iMM-iDD', { calendar: 'fcna' });
    assert.ok(result.length > 0, 'expected non-empty string');
  });
});
