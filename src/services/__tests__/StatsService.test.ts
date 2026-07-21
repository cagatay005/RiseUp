import { describe, expect, it } from '@jest/globals';

import type { DayLog } from '../../stores/streakStore';
import {
  computeDailyStreakLengths,
  formatSince,
  formatWeekRangeLabel,
  getMonthMatrix,
  getWeekDays,
  startOfWeekMonday,
  streakShadeOpacity,
  weekdayLetter,
} from '../StatsService';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_ABBR = MONTH_NAMES.map((m) => m.slice(0, 3));
const formatMonthDay = (date: Date) => `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
const formatWeekRange = (start: Date, end: Date) =>
  `${MONTH_ABBR[start.getMonth()]} ${start.getDate()} – ${MONTH_ABBR[end.getMonth()]} ${end.getDate()}`;

describe('startOfWeekMonday', () => {
  it('bir Çarşamba için o haftanın Pazartesi\'sini döner', () => {
    const wed = new Date(2026, 6, 22); // Temmuz 22, 2026 = Çarşamba
    const monday = startOfWeekMonday(wed);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(20);
  });

  it('Pazar günü bir önceki Pazartesi\'ye döner (hafta sonu sarımı)', () => {
    const sun = new Date(2026, 6, 26); // Temmuz 26, 2026 = Pazar
    const monday = startOfWeekMonday(sun);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(20);
  });

  it('Pazartesi günü kendisini döner', () => {
    const mon = new Date(2026, 6, 20);
    expect(startOfWeekMonday(mon).getDate()).toBe(20);
  });
});

describe('getWeekDays', () => {
  it('Pazartesi\'den başlayan 7 ardışık gün döner', () => {
    const monday = new Date(2026, 6, 20);
    const days = getWeekDays(monday);
    expect(days).toHaveLength(7);
    expect(days.map((d) => d.getDate())).toEqual([20, 21, 22, 23, 24, 25, 26]);
  });
});

describe('weekdayLetter', () => {
  it('M T W T F S S sırasını döner', () => {
    expect([0, 1, 2, 3, 4, 5, 6].map(weekdayLetter)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });
});

describe('getMonthMatrix', () => {
  it('Temmuz 2026 için 6 satır x 7 sütun döner, ilk hücre Pazartesi başlangıçlı', () => {
    const matrix = getMonthMatrix(2026, 6); // Temmuz (0-index 6)
    expect(matrix).toHaveLength(6);
    matrix.forEach((row) => expect(row).toHaveLength(7));
    // 1 Temmuz 2026 Çarşamba'dır → ilk satırda Pazartesi/Salı null, Çarşamba = 1.
    expect(matrix[0]![0]).toBeNull();
    expect(matrix[0]![1]).toBeNull();
    expect(matrix[0]![2]?.getDate()).toBe(1);
  });

  it('ay dışına taşan hücreler null döner', () => {
    const matrix = getMonthMatrix(2026, 6);
    const allDates = matrix.flat().filter((d): d is Date => d !== null);
    expect(allDates.every((d) => d.getMonth() === 6)).toBe(true);
  });
});

describe('computeDailyStreakLengths', () => {
  it('done günlerde artar, missed sıfırlar, frozen korur', () => {
    const dayLog: DayLog = {
      '2026-07-01': 'done',
      '2026-07-02': 'done',
      '2026-07-03': 'frozen',
      '2026-07-04': 'done',
      '2026-07-05': 'missed',
      '2026-07-06': 'done',
    };
    const lengths = computeDailyStreakLengths(dayLog);
    expect(lengths['2026-07-01']).toBe(1);
    expect(lengths['2026-07-02']).toBe(2);
    expect(lengths['2026-07-03']).toBe(2); // frozen: korunur, artmaz
    expect(lengths['2026-07-04']).toBe(3);
    expect(lengths['2026-07-05']).toBe(0); // missed: sıfırlanır
    expect(lengths['2026-07-06']).toBe(1);
  });
});

describe('streakShadeOpacity', () => {
  it('0 gün 0 opaklık, 10+ gün tam opaklıkta sınırlanır', () => {
    expect(streakShadeOpacity(0)).toBe(0);
    expect(streakShadeOpacity(5)).toBe(0.5);
    expect(streakShadeOpacity(10)).toBe(1);
    expect(streakShadeOpacity(20)).toBe(1);
  });
});

describe('formatSince', () => {
  it('null ise verilen todayLabel döner', () => {
    expect(formatSince(null, formatMonthDay, 'today')).toBe('today');
  });

  it('ISO tarihten formatMonthDay ile biçimlenmiş tarihi üretir', () => {
    expect(formatSince('2026-05-03T00:00:00.000Z', formatMonthDay, 'today')).toBe('May 3');
  });
});

describe('formatWeekRangeLabel', () => {
  it('bugünün haftası için thisWeekLabel döner', () => {
    const today = new Date(2026, 6, 22);
    const thisWeekStart = startOfWeekMonday(today);
    expect(formatWeekRangeLabel(thisWeekStart, today, 'This week', formatWeekRange)).toBe('This week');
  });

  it('geçmiş hafta için formatWeekRange ile biçimlenmiş bir aralık döner', () => {
    const today = new Date(2026, 6, 22);
    const pastWeekStart = new Date(2026, 6, 6);
    expect(formatWeekRangeLabel(pastWeekStart, today, 'This week', formatWeekRange)).toBe('Jul 6 – Jul 12');
  });
});
