import { describe, expect, it } from '@jest/globals';

import type { Alarm } from '@/stores/alarmsStore';
import type { PrayerTimes } from '@/stores/prayerStore';
import {
  computeOffsetMinutes,
  formatCountdown,
  formatMissedDate,
  getAlarmClockTime,
  getNextPrayer,
  getPickerBaseTime,
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

describe('formatMissedDate', () => {
  it('"YYYY-MM-DD" → "Missed {Month} {day}"', () => {
    expect(formatMissedDate('2026-07-17')).toBe('Missed July 17');
    expect(formatMissedDate('2026-01-05')).toBe('Missed January 5');
    expect(formatMissedDate('2026-12-31')).toBe('Missed December 31');
  });
});

describe('computeOffsetMinutes', () => {
  it('küçük ileri fark olduğu gibi döner', () => {
    const base = new Date(2026, 6, 19, 5, 0);
    const picked = new Date(2026, 6, 19, 5, 45);
    expect(computeOffsetMinutes(base, picked)).toBe(45);
  });

  it('küçük geri fark negatif döner', () => {
    const base = new Date(2026, 6, 19, 5, 30);
    const picked = new Date(2026, 6, 19, 5, 0);
    expect(computeOffsetMinutes(base, picked)).toBe(-30);
  });

  it('kullanıcı vakti tamamen farklı bir saate taşıyabilir (sınırsız özgürlük)', () => {
    const base = new Date(2026, 6, 19, 5, 0); // Fajr taban saati
    const picked = new Date(2026, 6, 19, 14, 30); // kullanıcı öğleden sonraya taşıdı
    expect(computeOffsetMinutes(base, picked)).toBe(9 * 60 + 30);
  });

  it('gece yarısını en kısa yoldan sararak hesaplar (23:50 → 00:10 = +20, -1430 değil)', () => {
    const base = new Date(2026, 6, 19, 23, 50);
    const picked = new Date(2026, 6, 19, 0, 10);
    expect(computeOffsetMinutes(base, picked)).toBe(20);
  });

  it('ters yönde gece yarısı sarımı (00:10 → 23:50 = -20)', () => {
    const base = new Date(2026, 6, 19, 0, 10);
    const picked = new Date(2026, 6, 19, 23, 50);
    expect(computeOffsetMinutes(base, picked)).toBe(-20);
  });

  it('sonuç her zaman (-720, 720] aralığında kalır', () => {
    for (let baseM = 0; baseM < 1440; baseM += 53) {
      for (let targetM = 0; targetM < 1440; targetM += 53) {
        const base = new Date(2026, 6, 19, Math.floor(baseM / 60), baseM % 60);
        const picked = new Date(2026, 6, 19, Math.floor(targetM / 60), targetM % 60);
        const delta = computeOffsetMinutes(base, picked);
        expect(delta).toBeGreaterThan(-720);
        expect(delta).toBeLessThanOrEqual(720);
      }
    }
  });
});
