import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { dark, type ThemeColors, type ThemeName } from '../../design/tokens';

interface ThemeContextValue {
  themeName: ThemeName;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** RiseUp yalnız karanlık tema kullanır; ekranlar aynı token setini paylaşır. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ThemeContextValue>(
    () => ({ themeName: 'dark', colors: dark }),
    [],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Kullanıcının tema tercihinden bağımsız olarak sabit bir temayı zorlar.
 * Onboarding, alarm çalma ve görev ekranları her zaman karanlıktır (DESIGN.md) —
 * bu ekranlar settingsStore.theme'i değil bu provider'ı kullanır.
 */
export function ForcedThemeProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ThemeContextValue>(
    () => ({ themeName: 'dark', colors: dark }),
    [],
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
