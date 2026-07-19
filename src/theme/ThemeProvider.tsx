import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { themes, type ThemeColors, type ThemeName } from '../../design/tokens';

interface ThemeContextValue {
  themeName: ThemeName;
  colors: ThemeColors;
  setThemeName: (name: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Not: tema tercihi kalıcılığı settingsStore'a bağlanacak (issue #3);
// o zamana kadar başlangıç değeri sistem temasından gelir.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [themeName, setThemeName] = useState<ThemeName>(system === 'dark' ? 'dark' : 'light');

  const toggleTheme = useCallback(() => {
    setThemeName((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ themeName, colors: themes[themeName], setThemeName, toggleTheme }),
    [themeName, toggleTheme],
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
