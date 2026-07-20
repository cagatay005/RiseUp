import { beforeEach, describe, expect, it } from '@jest/globals';

import { useStreakStore } from '../../stores/streakStore';
import { completeRecitation, giveUp } from '../StreakEngine';

describe('StreakEngine.giveUp', () => {
  beforeEach(() => {
    useStreakStore.getState().reset();
  });

  it('dondurma varsa 1 harcar, seri korunur', () => {
    useStreakStore.getState().applyEngineResult({ currentStreak: 5, freezes: 2 });
    const result = giveUp();
    expect(result.spentFreeze).toBe(true);
    expect(useStreakStore.getState().freezes).toBe(1);
    expect(useStreakStore.getState().currentStreak).toBe(5);
  });

  it('dondurma yoksa seriyi sıfırlar', () => {
    useStreakStore.getState().applyEngineResult({ currentStreak: 5, freezes: 0 });
    const result = giveUp();
    expect(result.spentFreeze).toBe(false);
    expect(useStreakStore.getState().currentStreak).toBe(0);
    expect(useStreakStore.getState().freezes).toBe(0);
  });
});

describe('StreakEngine.completeRecitation', () => {
  beforeEach(() => {
    useStreakStore.getState().reset();
  });

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
