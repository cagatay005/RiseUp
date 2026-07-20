import { describe, expect, it } from '@jest/globals';
import { PermissionStatus } from 'expo-modules-core';

import {
  computePrayerTimes,
  mapPermissionStatus,
  shouldRecalculate,
} from '../PrayerTimesService';

const ISTANBUL = { latitude: 41.0082, longitude: 28.9784 };

describe('computePrayerTimes', () => {
  it('5 vakti de üretir ve gün içinde kronolojik sırada döner', () => {
    const times = computePrayerTimes(ISTANBUL, new Date('2026-07-19T00:00:00Z'));
    const order = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

    for (const key of order) {
      expect(() => new Date(times[key]).toISOString()).not.toThrow();
    }

    for (let i = 1; i < order.length; i++) {
      const prev = new Date(times[order[i - 1]!]).getTime();
      const curr = new Date(times[order[i]!]).getTime();
      expect(curr).toBeGreaterThan(prev);
    }
  });

  it('aynı koordinat + tarih için deterministiktir', () => {
    const date = new Date('2026-12-01T00:00:00Z');
    const a = computePrayerTimes(ISTANBUL, date);
    const b = computePrayerTimes(ISTANBUL, date);
    expect(a).toEqual(b);
  });
});

describe('shouldRecalculate', () => {
  // Yerel takvim gününe göre karşılaştırır (kullanıcının "gece yarısı"sı UTC değil,
  // kendi saat dilimidir) — bu yüzden test tarihleri UTC ISO yerine yerel Date
  // constructor'ıyla kuruluyor, makinenin saat dilimine bakılmaksızın anlamı sabit kalsın.
  it('hiç hesaplanmamışsa true döner', () => {
    expect(shouldRecalculate(null, new Date(2026, 6, 19, 10, 0))).toBe(true);
  });

  it('aynı takvim günündeyse false döner', () => {
    expect(
      shouldRecalculate(new Date(2026, 6, 19, 2, 0).toISOString(), new Date(2026, 6, 19, 20, 0)),
    ).toBe(false);
  });

  it('gün değiştiyse true döner', () => {
    expect(
      shouldRecalculate(new Date(2026, 6, 18, 23, 50).toISOString(), new Date(2026, 6, 19, 0, 10)),
    ).toBe(true);
  });
});

describe('mapPermissionStatus', () => {
  it('expo-location durumlarını PermissionState\'e eşler', () => {
    expect(mapPermissionStatus(PermissionStatus.GRANTED)).toBe('granted');
    expect(mapPermissionStatus(PermissionStatus.DENIED)).toBe('denied');
    expect(mapPermissionStatus(PermissionStatus.UNDETERMINED)).toBe('unknown');
  });
});
