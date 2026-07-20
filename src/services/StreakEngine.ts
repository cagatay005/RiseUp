import { rules } from '../../design/tokens';
import { useStreakStore } from '@/stores/streakStore';

/**
 * Seri/dondurma/kaza kurallarının tek sahibi — streakStore'a yalnız bu servis
 * yazar (applyEngineResult). Şimdilik yalnız Give Up kuralı var; gün kapatma,
 * 7 günde dondurma kazanımı, kaza defteri ve başarı kartları TODO(#13)
 * kapsamında buraya eklenecek.
 */

export interface GiveUpResult {
  /** true → bir dondurma harcandı; false → hak yoktu, seri sıfırlandı. */
  spentFreeze: boolean;
}

/** Alarm ekranındaki Give Up: dondurma varsa harcar, yoksa seriyi sıfırlar. */
export function giveUp(): GiveUpResult {
  const s = useStreakStore.getState();
  if (s.freezes >= rules.giveUpFreezeCost) {
    s.applyEngineResult({ freezes: s.freezes - rules.giveUpFreezeCost });
    return { spentFreeze: true };
  }
  s.applyEngineResult({ currentStreak: 0 });
  return { spentFreeze: false };
}
