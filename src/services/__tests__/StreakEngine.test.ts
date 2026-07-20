import { beforeEach, describe, expect, it } from '@jest/globals';

import { useStreakStore } from '../../stores/streakStore';
import { giveUp } from '../StreakEngine';

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
