import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  defaultTranslationLanguage,
  type ThemeName,
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
  /** Gündüz ekranlarının teması; alarm/görev ekranları her zaman karanlıktır. */
  theme: ThemeName;
  /** Arayüz dili. */
  language: UiLanguage;
  /** Sure okuma görevindeki meal dili — arayüz dilinden bağımsız tercih. */
  translationLanguage: TranslationLanguage;
  onboardingDone: boolean;
  permissionsSnapshot: PermissionsSnapshot;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  setLanguage: (language: UiLanguage) => void;
  setTranslationLanguage: (language: TranslationLanguage) => void;
  setOnboardingDone: (done: boolean) => void;
  setPermissionsSnapshot: (snapshot: Partial<PermissionsSnapshot>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      translationLanguage: defaultTranslationLanguage,
      onboardingDone: false,
      permissionsSnapshot: {
        location: 'unknown',
        notifications: 'unknown',
        criticalAlerts: 'unknown',
      },
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setLanguage: (language) => set({ language }),
      setTranslationLanguage: (translationLanguage) => set({ translationLanguage }),
      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
      setPermissionsSnapshot: (snapshot) =>
        set((s) => ({ permissionsSnapshot: { ...s.permissionsSnapshot, ...snapshot } })),
    }),
    { name: 'settings', storage: persistStorage },
  ),
);
