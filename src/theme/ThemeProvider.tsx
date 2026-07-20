import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { themes, type ThemeColors, type ThemeName } from '../../design/tokens';
import { useSettingsStore } from '@/stores';

interface ThemeContextValue {
  themeName: ThemeName;
  colors: ThemeColors;
  setThemeName: (name: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Tema tercihi settingsStore'da yaşar (MMKV ile kalıcı); bu provider onu Context'e yansıtır. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeName = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);

  const value = useMemo<ThemeContextValue>(
    () => ({ themeName, colors: themes[themeName], setThemeName: setTheme, toggleTheme }),
    [themeName, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Kullanıcının tema tercihinden bağımsız olarak sabit bir temayı zorlar.
 * Onboarding, alarm çalma ve görev ekranları her zaman karanlıktır (DESIGN.md) —
 * bu ekranlar settingsStore.theme'i değil bu provider'ı kullanır.
 */
export function ForcedThemeProvider({ name, children }: { name: ThemeName; children: ReactNode }) {
  const value = useMemo<ThemeContextValue>(
    () => ({ themeName: name, colors: themes[name], setThemeName: () => {}, toggleTheme: () => {} }),
    [name],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

export type { ThemeColors, ThemeName };
