import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  defaultTranslationLanguage,
  type TranslationLanguage,
} from '../../design/tokens';
import { persistStorage } from './storage';

export type UiLanguage = 'en' | 'tr';

export type PermissionState = 'unknown' | 'granted' | 'denied';

export interface PermissionsSnapshot {
  location: PermissionState;
  notifications: PermissionState;
  criticalAlerts: PermissionState;
}

interface SettingsState {
  /** Arayüz dili. */
  language: UiLanguage;
  /** Sure okuma görevindeki meal dili — arayüz dilinden bağımsız tercih. */
  translationLanguage: TranslationLanguage;
  onboardingDone: boolean;
  permissionsSnapshot: PermissionsSnapshot;
  setLanguage: (language: UiLanguage) => void;
  setTranslationLanguage: (language: TranslationLanguage) => void;
  setOnboardingDone: (done: boolean) => void;
  setPermissionsSnapshot: (snapshot: Partial<PermissionsSnapshot>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      translationLanguage: defaultTranslationLanguage,
      onboardingDone: false,
      permissionsSnapshot: {
        location: 'unknown',
        notifications: 'unknown',
        criticalAlerts: 'unknown',
      },
      setLanguage: (language) => set({ language }),
      setTranslationLanguage: (translationLanguage) => set({ translationLanguage }),
      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
      setPermissionsSnapshot: (snapshot) =>
        set((s) => ({ permissionsSnapshot: { ...s.permissionsSnapshot, ...snapshot } })),
    }),
    { name: 'settings', storage: persistStorage },
  ),
);
