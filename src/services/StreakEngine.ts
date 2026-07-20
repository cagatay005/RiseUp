import { rules } from '../../design/tokens';
import { useStreakStore, type AchievementCard } from '@/stores/streakStore';

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

/**
 * Sure okuma sonucu (DESIGN §6.3): eşik geçildiyse Kupa ekranı için bir
 * "recitation" başarı kartı üretir. Eşiğin altı hiçbir şey yazmaz.
 */
export function completeRecitation(score: number, surah: string): boolean {
  if (score < rules.recitationPassScore) return false;
  const s = useStreakStore.getState();
  const card: AchievementCard = {
    id: `recitation-${Date.now().toString(36)}`,
    type: 'recitation',
    title: surah,
    value: score,
    earnedAt: new Date().toISOString(),
  };
  s.applyEngineResult({ cards: [...s.cards, card] });
  return true;
}
