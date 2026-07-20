import { describe, expect, it } from '@jest/globals';

import type { Alarm } from '@/stores/alarmsStore';
import type { PrayerTimes } from '@/stores/prayerStore';
import {
  angleToMinuteOfHour,
  formatCountdown,
  getAlarmClockTime,
  getNextPrayer,
  getPickerBaseTime,
  pointToAngleDeg,
  shortestMinuteDelta,
} from '../scheduleHelpers';

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

describe('getPickerBaseTime', () => {
  it('gerçek vakit varsa onu döner', () => {
    const result = getPickerBaseTime('fajr', TIMES, new Date('2026-07-19T12:00:00.000Z'));
    expect(result.toISOString()).toBe(TIMES.fajr);
  });

  it('vakit yoksa kaba bir varsayılana düşer ve saati/dakikayı doğru kurar', () => {
    const now = new Date('2026-07-19T12:00:00.000Z');
    const result = getPickerBaseTime('asr', null, now);
    expect(result.getHours()).toBe(16);
    expect(result.getMinutes()).toBe(30);
  });
});

describe('pointToAngleDeg', () => {
  it('12 yönü (yukarı) 0°', () => {
    expect(pointToAngleDeg(0, -100)).toBeCloseTo(0);
  });
  it('3 yönü (sağ) 90°', () => {
    expect(pointToAngleDeg(100, 0)).toBeCloseTo(90);
  });
  it('6 yönü (aşağı) 180°', () => {
    expect(pointToAngleDeg(0, 100)).toBeCloseTo(180);
  });
  it('9 yönü (sol) 270°', () => {
    expect(pointToAngleDeg(-100, 0)).toBeCloseTo(270);
  });
});

describe('angleToMinuteOfHour', () => {
  it('0° → dakika 0', () => {
    expect(angleToMinuteOfHour(0)).toBe(0);
  });
  it('90° → dakika 15', () => {
    expect(angleToMinuteOfHour(90)).toBe(15);
  });
  it('180° → dakika 30', () => {
    expect(angleToMinuteOfHour(180)).toBe(30);
  });
  it('270° → dakika 45', () => {
    expect(angleToMinuteOfHour(270)).toBe(45);
  });
  it('359° → 60 taşar, 0\'a sarar', () => {
    expect(angleToMinuteOfHour(359.5)).toBe(0);
  });
});

describe('shortestMinuteDelta', () => {
  it('küçük ileri fark olduğu gibi döner', () => {
    expect(shortestMinuteDelta(10, 15)).toBe(5);
  });
  it('küçük geri fark negatif döner', () => {
    expect(shortestMinuteDelta(15, 10)).toBe(-5);
  });
  it('saat sınırını sararak en kısa yolu bulur (55 → 5 = +10, -50 değil)', () => {
    expect(shortestMinuteDelta(55, 5)).toBe(10);
  });
  it('ters yönde sarma (5 → 55 = -10, +50 değil)', () => {
    expect(shortestMinuteDelta(5, 55)).toBe(-10);
  });
  it('sonuç her zaman [-30, 30] aralığında', () => {
    for (let base = 0; base < 60; base += 7) {
      for (let target = 0; target < 60; target += 7) {
        const delta = shortestMinuteDelta(base, target);
        expect(delta).toBeGreaterThanOrEqual(-30);
        expect(delta).toBeLessThanOrEqual(30);
      }
    }
  });
});
