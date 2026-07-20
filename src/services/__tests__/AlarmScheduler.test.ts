import { describe, expect, it } from '@jest/globals';

import type { Alarm } from '@/stores/alarmsStore';
import type { GeoPoint, PrayerTimes } from '@/stores/prayerStore';
import { resolveFireDate } from '../AlarmScheduler';

const ISTANBUL: GeoPoint = { latitude: 41.0082, longitude: 28.9784 };

const TODAY_TIMES: PrayerTimes = {
  fajr: '2026-07-19T02:12:00.000Z',
  dhuhr: '2026-07-19T10:04:00.000Z',
  asr: '2026-07-19T13:48:00.000Z',
  maghrib: '2026-07-19T16:55:00.000Z',
  isha: '2026-07-19T18:20:00.000Z',
};

function makeAlarm(overrides: Partial<Alarm> = {}): Alarm {
  return {
    id: 'a1',
    prayerId: 'fajr',
    offsetMinutes: 0,
    enabled: true,
    taskIds: [],
    createdAt: '2026-07-19T00:00:00.000Z',
    ...overrides,
  };
}

describe('resolveFireDate', () => {
  it('bugünün vakti henüz geçmediyse bugünü döner', () => {
    const now = new Date('2026-07-19T01:00:00.000Z'); // fajr (02:12) henüz gelmedi
    const result = resolveFireDate(makeAlarm({ prayerId: 'fajr' }), TODAY_TIMES, ISTANBUL, now);
    expect(result?.toISOString()).toBe(TODAY_TIMES.fajr);
  });

  it('bugünün vakti geçtiyse ve konum varsa yarına planlar', () => {
    const now = new Date('2026-07-19T12:00:00.000Z'); // fajr (02:12) çoktan geçti
    const result = resolveFireDate(makeAlarm({ prayerId: 'fajr' }), TODAY_TIMES, ISTANBUL, now);
    expect(result).not.toBeNull();
    // ertesi güne (20 Temmuz) planlanmış olmalı, saat/dakika fajr'a yakın kalmalı
    expect(result?.getUTCDate()).toBe(20);
  });

  it('bugünün vakti geçti ve konum yoksa null döner (planlanamaz)', () => {
    const now = new Date('2026-07-19T12:00:00.000Z');
    const result = resolveFireDate(makeAlarm({ prayerId: 'fajr' }), TODAY_TIMES, null, now);
    expect(result).toBeNull();
  });

  it('todayTimes hiç yoksa ve konum da yoksa null döner', () => {
    const now = new Date('2026-07-19T12:00:00.000Z');
    expect(resolveFireDate(makeAlarm(), null, null, now)).toBeNull();
  });

  it('todayTimes yok ama konum varsa yarını hesaplayıp döner', () => {
    const now = new Date('2026-07-19T12:00:00.000Z');
    const result = resolveFireDate(makeAlarm({ prayerId: 'fajr' }), null, ISTANBUL, now);
    expect(result).not.toBeNull();
    expect(result?.getUTCDate()).toBe(20);
  });

  it('offset uygulanmış vaktin de doğru şekilde ileri/geri kaydığını yansıtır', () => {
    const now = new Date('2026-07-19T01:00:00.000Z');
    const result = resolveFireDate(
      makeAlarm({ prayerId: 'fajr', offsetMinutes: -15 }),
      TODAY_TIMES,
      ISTANBUL,
      now,
    );
    expect(result?.toISOString()).toBe('2026-07-19T01:57:00.000Z');
  });
});
