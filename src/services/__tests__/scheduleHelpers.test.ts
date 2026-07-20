import { describe, expect, it } from '@jest/globals';

import type { Alarm } from '@/stores/alarmsStore';
import type { PrayerTimes } from '@/stores/prayerStore';
import { formatCountdown, getAlarmClockTime, getNextPrayer } from '../scheduleHelpers';

const TIMES: PrayerTimes = {
  fajr: '2026-07-19T02:12:00.000Z',
  dhuhr: '2026-07-19T10:04:00.000Z',
  asr: '2026-07-19T13:48:00.000Z',
  maghrib: '2026-07-19T16:55:00.000Z',
  isha: '2026-07-19T18:20:00.000Z',
};

function makeAlarm(overrides: Partial<Alarm> = {}): Alarm {
  return {
    id: 'a1',
    prayerId: 'asr',
    offsetMinutes: 0,
    enabled: true,
    taskIds: [],
    createdAt: '2026-07-19T00:00:00.000Z',
    ...overrides,
  };
}

describe('getAlarmClockTime', () => {
  it('vakit yoksa null döner', () => {
    expect(getAlarmClockTime(makeAlarm(), null)).toBeNull();
  });

  it('ofset 0 iken vaktin kendisini döner', () => {
    const result = getAlarmClockTime(makeAlarm({ prayerId: 'fajr' }), TIMES);
    expect(result?.toISOString()).toBe(TIMES.fajr);
  });

  it('negatif ofseti vaktin öncesine uygular', () => {
    const result = getAlarmClockTime(makeAlarm({ prayerId: 'fajr', offsetMinutes: -10 }), TIMES);
    expect(result?.toISOString()).toBe('2026-07-19T02:02:00.000Z');
  });
});

describe('getNextPrayer', () => {
  it('vakit yoksa null döner', () => {
    expect(getNextPrayer(null, new Date())).toBeNull();
  });

  it('şu andan sonraki ilk vakti bulur', () => {
    const now = new Date('2026-07-19T11:00:00.000Z'); // dhuhr geçti, asr gelmedi
    const next = getNextPrayer(TIMES, now);
    expect(next?.prayerId).toBe('asr');
  });

  it('gün içindeki tüm vakitler geçtiyse null döner', () => {
    const now = new Date('2026-07-19T23:00:00.000Z');
    expect(getNextPrayer(TIMES, now)).toBeNull();
  });

  it('gün henüz başlamadıysa ilk vakti (fajr) döner', () => {
    const now = new Date('2026-07-19T00:00:00.000Z');
    expect(getNextPrayer(TIMES, now)?.prayerId).toBe('fajr');
  });
});

describe('formatCountdown', () => {
  it('geçmiş veya şimdiki an için Now döner', () => {
    const now = new Date('2026-07-19T10:00:00.000Z');
    expect(formatCountdown(now, now)).toBe('Now');
    expect(formatCountdown(new Date(now.getTime() - 1000), now)).toBe('Now');
  });

  it('bir saatten azsa yalnız dakika gösterir', () => {
    const now = new Date('2026-07-19T10:00:00.000Z');
    const target = new Date('2026-07-19T10:24:00.000Z');
    expect(formatCountdown(target, now)).toBe('24m');
  });

  it('tam saatte yalnız saat gösterir', () => {
    const now = new Date('2026-07-19T10:00:00.000Z');
    const target = new Date('2026-07-19T12:00:00.000Z');
    expect(formatCountdown(target, now)).toBe('2h');
  });

  it('saat + dakika birlikte gösterir', () => {
    const now = new Date('2026-07-19T10:00:00.000Z');
    const target = new Date('2026-07-19T11:24:00.000Z');
    expect(formatCountdown(target, now)).toBe('1h 24m');
  });
});
