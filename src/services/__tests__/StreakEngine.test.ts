import { beforeEach, describe, expect, it } from '@jest/globals';

import { useAlarmsStore, type Alarm } from '../../stores/alarmsStore';
import { useStreakStore } from '../../stores/streakStore';
import {
  completeDay,
  completeQada,
  completeRecitation,
  computeSuccessRate,
  dayKeyOf,
  giveUp,
} from '../StreakEngine';

/** Temmuz 2026'nın n. günü. */
const day = (n: number) => new Date(2026, 6, n);

function makeAlarm(prayerId: Alarm['prayerId'], enabled = true): Alarm {
  return {
    id: `test-${prayerId}`,
    prayerId,
    offsetMinutes: 0,
    enabled,
    taskIds: [],
    createdAt: new Date().toISOString(),
  };
}

beforeEach(() => {
  useStreakStore.getState().reset();
  useAlarmsStore.setState({ alarms: [] });
});

describe('StreakEngine gün kapanışı', () => {
  it('ardışık günler seriyi artırır; 7. gün +1 dondurma (rules.streakDaysPerFreeze)', () => {
    for (let i = 1; i <= 7; i++) completeDay(day(i));
    const s = useStreakStore.getState();
    expect(s.currentStreak).toBe(7);
    expect(s.bestStreak).toBe(7);
    expect(s.freezes).toBe(1);
    expect(s.startedAt).not.toBeNull();
  });

  it('aynı gün iki kez tamamlamak seriyi bir kez sayar', () => {
    completeDay(day(1));
    completeDay(day(1));
    expect(useStreakStore.getState().currentStreak).toBe(1);
  });

  it('15. gün başarı kartı üretir (rules.streakCardIntervalDays)', () => {
    for (let i = 1; i <= 15; i++) completeDay(day(i));
    const s = useStreakStore.getState();
    const streakCards = s.cards.filter((c) => c.type === 'streak');
    expect(streakCards).toHaveLength(1);
    expect(streakCards[0]!.value).toBe(15);
    expect(s.freezes).toBe(2); // 7. ve 14. günler
  });
});

describe('StreakEngine boş gün mutabakatı', () => {
  it('boş gün dondurma ile "frozen" kapanır, seri korunur', () => {
    for (let i = 1; i <= 7; i++) completeDay(day(i)); // 7. günde 1 dondurma
    completeDay(day(9)); // 8. gün boş
    const s = useStreakStore.getState();
    expect(s.dayLog[dayKeyOf(day(8))]).toBe('frozen');
    expect(s.currentStreak).toBe(8);
    expect(s.freezes).toBe(0);
  });

  it('dondurmasız boş gün "missed" olur ve seriyi sıfırlar', () => {
    completeDay(day(1));
    completeDay(day(3)); // 2. gün boş, dondurma yok
    const s = useStreakStore.getState();
    expect(s.dayLog[dayKeyOf(day(2))]).toBe('missed');
    expect(s.currentStreak).toBe(1); // sıfırlandı + 3. gün
  });

  it('kaçan günler etkin alarm vakitlerini kaza defterine işler', () => {
    useAlarmsStore.setState({ alarms: [makeAlarm('fajr'), makeAlarm('isha', false)] });
    completeDay(day(1));
    completeDay(day(3)); // 2. gün boş → yalnız etkin fajr kazaya düşer
    const ledger = useStreakStore.getState().qadaLedger;
    expect(ledger).toHaveLength(1);
    expect(ledger[0]!.prayerId).toBe('fajr');
    expect(ledger[0]!.missedDate).toBe(dayKeyOf(day(2)));
  });

  it('14 kaza birikince −1 dondurma ve defterden 14 kayıt düşer (rules.qadaPerFreezeLoss)', () => {
    useAlarmsStore.setState({ alarms: [makeAlarm('fajr'), makeAlarm('isha')] });
    completeDay(day(1));
    completeDay(day(9)); // 2..8 = 7 boş gün × 2 vakit = 14 kaza
    const s = useStreakStore.getState();
    expect(s.qadaLedger).toHaveLength(0);
    expect(s.freezes).toBe(0); // 0'dı, negatife inmez
  });

  it('kaza kılmak defterden düşer', () => {
    useAlarmsStore.setState({ alarms: [makeAlarm('fajr')] });
    completeDay(day(1));
    completeDay(day(3));
    const entry = useStreakStore.getState().qadaLedger[0]!;
    completeQada(entry.id);
    expect(useStreakStore.getState().qadaLedger).toHaveLength(0);
  });
});

describe('StreakEngine.giveUp', () => {
  it('dondurma varsa 1 harcar, seri korunur, gün "frozen" yazılır', () => {
    useStreakStore.getState().applyEngineResult({ currentStreak: 5, freezes: 2 });
    const result = giveUp(day(5));
    expect(result.spentFreeze).toBe(true);
    const s = useStreakStore.getState();
    expect(s.freezes).toBe(1);
    expect(s.currentStreak).toBe(5);
    expect(s.dayLog[dayKeyOf(day(5))]).toBe('frozen');
  });

  it('dondurma yoksa seriyi sıfırlar, gün "missed" yazılır', () => {
    useStreakStore.getState().applyEngineResult({ currentStreak: 5, freezes: 0 });
    const result = giveUp(day(5));
    expect(result.spentFreeze).toBe(false);
    const s = useStreakStore.getState();
    expect(s.currentStreak).toBe(0);
    expect(s.dayLog[dayKeyOf(day(5))]).toBe('missed');
  });

  it('gün zaten "done" ise damga geri alınmaz ama bedel ödenir', () => {
    completeDay(day(5));
    useStreakStore.getState().applyEngineResult({ freezes: 1 });
    giveUp(day(5));
    const s = useStreakStore.getState();
    expect(s.dayLog[dayKeyOf(day(5))]).toBe('done');
    expect(s.freezes).toBe(0);
  });
});

describe('computeSuccessRate', () => {
  it('boş günlükte 0, aksi halde done yüzdesi', () => {
    expect(computeSuccessRate({})).toBe(0);
    expect(
      computeSuccessRate({ '2026-07-01': 'done', '2026-07-02': 'missed', '2026-07-03': 'done', '2026-07-04': 'frozen' }),
    ).toBe(50);
  });
});

describe('StreakEngine.completeRecitation', () => {
  it('eşik altı skor kart üretmez', () => {
    expect(completeRecitation(40, 'Al-Ikhlas')).toBe(false);
    expect(useStreakStore.getState().cards).toHaveLength(0);
  });

  it('eşik üstü skor recitation kartı ekler', () => {
    expect(completeRecitation(85, 'Al-Ikhlas')).toBe(true);
    const cards = useStreakStore.getState().cards;
    expect(cards).toHaveLength(1);
    expect(cards[0]!.type).toBe('recitation');
    expect(cards[0]!.title).toBe('Al-Ikhlas');
    expect(cards[0]!.value).toBe(85);
  });
});
