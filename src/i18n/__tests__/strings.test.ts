import { describe, expect, it } from '@jest/globals';

import { en, tr } from '../strings';

describe('i18n date formatters', () => {
  const date = new Date(2026, 6, 19); // 19 Temmuz 2026
  const rangeEnd = new Date(2026, 6, 25);

  it('en: ay adı + gün/yıl İngilizce sırayla', () => {
    expect(en.common.formatMonthDay(date)).toBe('July 19');
    expect(en.common.formatMonthYear(date)).toBe('July 2026');
    expect(en.common.formatLongDate(date)).toBe('July 19, 2026');
    expect(en.common.formatWeekRange(date, rangeEnd)).toBe('Jul 19 – Jul 25');
  });

  it('tr: gün önce, ay adı Türkçe', () => {
    expect(tr.common.formatMonthDay(date)).toBe('19 Temmuz');
    expect(tr.common.formatMonthYear(date)).toBe('Temmuz 2026');
    expect(tr.common.formatLongDate(date)).toBe('19 Temmuz 2026');
    expect(tr.common.formatWeekRange(date, rangeEnd)).toBe('19 Tem – 25 Tem');
  });
});

describe('i18n plural/dinamik metinler', () => {
  it('en: tekil/çoğul "missed prayer(s)" ayrımı', () => {
    expect(en.home.missedPrayers(1)).toBe('1 missed prayer to make up');
    expect(en.home.missedPrayers(3)).toBe('3 missed prayers to make up');
  });

  it('tr: sayı formu Türkçede değişmez', () => {
    expect(tr.home.missedPrayers(1)).toBe('Kılınmamış 1 namaz var');
    expect(tr.home.missedPrayers(3)).toBe('Kılınmamış 3 namaz var');
  });

  it('her iki dilde de tüm badge/task/prayer anahtarları birebir eşleşir', () => {
    expect(Object.keys(tr.tasks).sort()).toEqual(Object.keys(en.tasks).sort());
    expect(Object.keys(tr.badges).sort()).toEqual(Object.keys(en.badges).sort());
    expect(Object.keys(tr.prayers).sort()).toEqual(Object.keys(en.prayers).sort());
  });
});
