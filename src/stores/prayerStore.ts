import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { PrayerId } from '../../design/tokens';
import { persistStorage } from './storage';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/** Vakit saatleri ISO-8601 tam zaman olarak tutulur (gün + saat). */
export type PrayerTimes = Record<PrayerId, string>;

interface PrayerState {
  todayTimes: PrayerTimes | null;
  location: GeoPoint | null;
  cityName: string | null;
  lastCalcAt: string | null;
  /** PrayerTimesService (issue #5) gece yarısı ve konum değişiminde yazar. */
  setComputed: (input: {
    todayTimes: PrayerTimes;
    location: GeoPoint;
    cityName: string | null;
  }) => void;
  clear: () => void;
}

export const usePrayerStore = create<PrayerState>()(
  persist(
    (set) => ({
      todayTimes: null,
      location: null,
      cityName: null,
      lastCalcAt: null,
      setComputed: ({ todayTimes, location, cityName }) =>
        set({ todayTimes, location, cityName, lastCalcAt: new Date().toISOString() }),
      clear: () => set({ todayTimes: null, location: null, cityName: null, lastCalcAt: null }),
    }),
    { name: 'prayer', storage: persistStorage },
  ),
);
