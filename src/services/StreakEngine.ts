import { rules, type PrayerId } from '../../design/tokens';
import { useAlarmsStore } from '@/stores/alarmsStore';
import {
  useStreakStore,
  type AchievementCard,
  type DayLog,
  type QadaEntry,
} from '@/stores/streakStore';

/**
 * Seri/dondurma/kaza kurallarının tek sahibi (ARCHITECTURE §5-6): streakStore'a
 * yalnız bu servis yazar; UI'da seri matematiği görülmesi mimari ihlaldir.
 *
 * Yapı: `apply*`/`settle*` fonksiyonları saf çekirdektir (state alır, yama
 * döner — unit testler bunları gün gün simüle eder); alttaki dışa açık kapılar
 * store'u okuyup yamayı applyEngineResult ile yazar.
 *
 * Boş gün tespiti bir arka plan görevine değil uygulama açılışına bağlıdır
 * (reconcileDays, _layout'ta) — AlarmScheduler'daki "uygulama günlerce hiç
 * açılmazsa" sınırının aynısı burada da geçerlidir.
 */

interface EngineState {
  currentStreak: number;
  bestStreak: number;
  freezes: number;
  qadaLedger: QadaEntry[];
  dayLog: DayLog;
  cards: AchievementCard[];
  startedAt: string | null;
}

/** Yerel takvim günü anahtarı: 'YYYY-MM-DD'. */
export function dayKeyOf(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

function addDays(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKeyOf(new Date(y!, m! - 1, d! + delta));
}

function latestLoggedKey(dayLog: DayLog): string | null {
  const keys = Object.keys(dayLog).sort();
  return keys.length > 0 ? keys[keys.length - 1]! : null;
}

/**
 * Son kayıtlı günle bugün arasındaki boş günleri kapatır: dondurma varsa gün
 * "frozen" olur ve seri korunur, yoksa "missed" olur ve seri sıfırlanır.
 * Kaçan her gün, o gün etkin olan alarm vakitlerini kaza defterine işler;
 * defter 14'e (rules.qadaPerFreezeLoss) her ulaştığında 1 dondurma düşülür ve
 * en eski 14 kayıt silinir (DESIGN §8). Kapatılacak gün yoksa null döner.
 */
export function settleGapDays(
  state: EngineState,
  todayKey: string,
  missedPrayerIds: readonly PrayerId[],
): Partial<EngineState> | null {
  const last = latestLoggedKey(state.dayLog);
  if (!last) return null;

  let cursor = addDays(last, 1);
  if (cursor >= todayKey) return null;

  let freezes = state.freezes;
  let currentStreak = state.currentStreak;
  const dayLog: DayLog = { ...state.dayLog };
  let qadaLedger = [...state.qadaLedger];

  while (cursor < todayKey) {
    if (freezes >= 1) {
      freezes -= 1;
      dayLog[cursor] = 'frozen';
    } else {
      dayLog[cursor] = 'missed';
      currentStreak = 0;
    }
    for (const prayerId of missedPrayerIds) {
      qadaLedger.push({ id: `qada-${cursor}-${prayerId}`, prayerId, missedDate: cursor });
    }
    cursor = addDays(cursor, 1);
  }

  while (qadaLedger.length >= rules.qadaPerFreezeLoss) {
    freezes = Math.max(0, freezes - 1);
    qadaLedger = qadaLedger.slice(rules.qadaPerFreezeLoss);
  }

  return { freezes, currentStreak, dayLog, qadaLedger };
}

/** Gün kapanışı: seri +1, 7. günde +1 dondurma, 15. günde başarı kartı. İdempotent. */
export function applyCompleteDay(state: EngineState, todayKey: string): Partial<EngineState> | null {
  if (state.dayLog[todayKey] === 'done') return null;

  const currentStreak = state.currentStreak + 1;
  const next: Partial<EngineState> = {
    currentStreak,
    bestStreak: Math.max(state.bestStreak, currentStreak),
    dayLog: { ...state.dayLog, [todayKey]: 'done' },
    startedAt: state.startedAt ?? new Date().toISOString(),
  };
  if (currentStreak % rules.streakDaysPerFreeze === 0) {
    next.freezes = state.freezes + 1;
  }
  if (currentStreak % rules.streakCardIntervalDays === 0) {
    next.cards = [
      ...state.cards,
      {
        id: `streak-${currentStreak}-${Date.now().toString(36)}`,
        type: 'streak',
        title: `${currentStreak}-Day Streak`,
        value: currentStreak,
        earnedAt: new Date().toISOString(),
      },
    ];
  }
  return next;
}

export interface GiveUpResult {
  /** true → bir dondurma harcandı; false → hak yoktu, seri sıfırlandı. */
  spentFreeze: boolean;
}

/**
 * Give Up: dondurma varsa harcar (gün "frozen"), yoksa seriyi sıfırlar (gün
 * "missed"). Aynı gün daha önce tamamlanmışsa "done" damgası geri alınmaz —
 * bedel yine ödenir (DESIGN §4: Give Up her zaman −1 dondurmadır).
 */
export function applyGiveUp(
  state: EngineState,
  todayKey: string,
): { patch: Partial<EngineState>; spentFreeze: boolean } {
  const dayDone = state.dayLog[todayKey] === 'done';

  if (state.freezes >= rules.giveUpFreezeCost) {
    return {
      spentFreeze: true,
      patch: {
        freezes: state.freezes - rules.giveUpFreezeCost,
        ...(dayDone ? {} : { dayLog: { ...state.dayLog, [todayKey]: 'frozen' } }),
      },
    };
  }
  return {
    spentFreeze: false,
    patch: {
      currentStreak: 0,
      ...(dayDone ? {} : { dayLog: { ...state.dayLog, [todayKey]: 'missed' } }),
    },
  };
}

/** İstatistik ekranı (#15) yüzdelik başarısı: done / kayıtlı gün. */
export function computeSuccessRate(dayLog: DayLog): number {
  const statuses = Object.values(dayLog);
  if (statuses.length === 0) return 0;
  return Math.round((100 * statuses.filter((s) => s === 'done').length) / statuses.length);
}

// ---------------------------------------------------------------------------
// Store kapıları
// ---------------------------------------------------------------------------

/** Boş günlerde hangi vakitler kaçtı: o an etkin alarmların vakitleri. */
function enabledPrayerIds(): PrayerId[] {
  return useAlarmsStore
    .getState()
    .alarms.filter((a) => a.enabled)
    .map((a) => a.prayerId);
}

/** Uygulama açılışında çağrılır (_layout): aradaki boş günleri kapatır. */
export function reconcileDays(now: Date = new Date()): void {
  const s = useStreakStore.getState();
  const patch = settleGapDays(s, dayKeyOf(now), enabledPrayerIds());
  if (patch) s.applyEngineResult(patch);
}

/** Alarm görevleri tamamlanınca çağrılır (alarm-ring): günü "done" yazar. */
export function completeDay(now: Date = new Date()): void {
  reconcileDays(now);
  const s = useStreakStore.getState();
  const patch = applyCompleteDay(s, dayKeyOf(now));
  if (patch) s.applyEngineResult(patch);
}

export function giveUp(now: Date = new Date()): GiveUpResult {
  reconcileDays(now);
  const s = useStreakStore.getState();
  const { patch, spentFreeze } = applyGiveUp(s, dayKeyOf(now));
  s.applyEngineResult(patch);
  return { spentFreeze };
}

/** Kaza ekranı (#14): bir kaza mini görevle doğrulanınca defterden düşülür. */
export function completeQada(id: string): void {
  const s = useStreakStore.getState();
  s.applyEngineResult({ qadaLedger: s.qadaLedger.filter((q) => q.id !== id) });
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
