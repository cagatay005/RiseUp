import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from './storage';

export type DayStatus = 'done' | 'frozen' | 'missed';

/** Anahtar formatı: 'YYYY-MM-DD'. */
export type DayLog = Record<string, DayStatus>;

export interface AchievementCard {
  id: string;
  type: 'streak' | 'recitation';
  title: string;
  /** Seri kartında gün sayısı, okuma kartında skor. */
  value: number;
  earnedAt: string;
}

export interface QadaEntry {
  id: string;
  prayerId: string;
  missedDate: string;
}

interface StreakState {
  currentStreak: number;
  bestStreak: number;
  /** Kar tanesi — seri dondurma hakkı. */
  freezes: number;
  /** Bekleyen kaza vakitleri. */
  qadaLedger: QadaEntry[];
  dayLog: DayLog;
  cards: AchievementCard[];
  /** Kazanılan rozet id'leri (tokens.ts → badges). */
  earnedBadgeIds: string[];
  /** İstatistikteki yüzdelik başarı için başlangıç günü. */
  startedAt: string | null;
  /** Rozet sayaçları — yalnız StreakEngine.evaluateBadges bunları okur. */
  qiblaCompletions: number;
  fajrCompletions: number;
  /** %90+ skorla tamamlanan sure okuma sayısı (Golden Reciter rozeti). */
  goldenRecitations: number;
}

interface StreakActions {
  /**
   * Tek yazma kapısı: SADECE StreakEngine (issue #13) çağırır.
   * UI bileşenlerinin bu action'ı doğrudan kullanması mimari ihlaldir —
   * tüm seri/dondurma/kaza matematiği serviste yaşar.
   */
  applyEngineResult: (next: Partial<StreakState>) => void;
  reset: () => void;
}

const initialState: StreakState = {
  currentStreak: 0,
  bestStreak: 0,
  freezes: 0,
  qadaLedger: [],
  dayLog: {},
  cards: [],
  earnedBadgeIds: [],
  startedAt: null,
  qiblaCompletions: 0,
  fajrCompletions: 0,
  goldenRecitations: 0,
};

export const useStreakStore = create<StreakState & StreakActions>()(
  persist(
    (set) => ({
      ...initialState,
      applyEngineResult: (next) => set(next),
      reset: () => set(initialState),
    }),
    { name: 'streak', storage: persistStorage },
  ),
);
