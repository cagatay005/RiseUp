import { useSettingsStore } from '@/stores';
import { en, tr, type Strings } from './strings';

const dictionaries = { en, tr };

/** Ekranlar `const t = useTranslation();` ile çağırır, `t.home.addAlarm` gibi kullanır. */
export function useTranslation(): Strings {
  const language = useSettingsStore((s) => s.language);
  return dictionaries[language];
}

export type { Strings };
