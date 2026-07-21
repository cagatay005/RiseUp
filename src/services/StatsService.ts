import { dayKeyOf } from './StreakEngine';
import type { DayLog } from '@/stores/streakStore';

/**
 * İstatistik ekranının (#15) salt-okunur türetme katmanı: streakStore.dayLog'dan
 * haftalık/aylık görünümler hesaplar, hiçbir yeni state tutmaz (issue #15
 * kabul kriteri: "streakStore.dayLog'dan türetiliyor, ekstra state yok").
 */

const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Pazartesi başlangıçlı

function atMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Verilen günün ait olduğu haftanın Pazartesi'si (yerel saat, gece yarısı). */
export function startOfWeekMonday(date: Date): Date {
  const d = atMidnight(date);
  const isoDay = d.getDay() === 0 ? 7 : d.getDay(); // Pazar=7, Pazartesi=1
  d.setDate(d.getDate() - (isoDay - 1));
  return d;
}

/** weekStart'tan (Pazartesi) başlayan 7 gün — Pazartesi..Pazar. */
export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** "M T W T F S S" sütun başlıkları — sıra weekDays ile birebir eşleşir. */
export function weekdayLetter(index: number): string {
  return WEEKDAY_LETTERS[index] ?? '';
}

/**
 * Ay takvimi için 6x7 (Pazartesi başlangıçlı) matris; ay dışına taşan hücreler
 * null'dur (mockup ekran 8'de boş/dolgusuz hücreler).
 */
export function getMonthMatrix(year: number, monthIndex0: number): (Date | null)[][] {
  const firstOfMonth = new Date(year, monthIndex0, 1);
  const gridStart = startOfWeekMonday(firstOfMonth);
  const cells: (Date | null)[] = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    return d.getMonth() === monthIndex0 ? d : null;
  });
  return Array.from({ length: 6 }, (_, row) => cells.slice(row * 7, row * 7 + 7));
}

/**
 * Her "done" gününde o ana kadarki kesintisiz seri uzunluğunu hesaplar (takvim
 * sayfasının koyulaşan turuncu dolgusu için, DESIGN §3.2: "kısa seri açık ton →
 * uzun seri tam turuncu"). "frozen" günler sayacı sıfırlamaz ama artırmaz da
 * (StreakEngine'deki seri koruma semantiğiyle aynı); "missed" sıfırlar.
 */
export function computeDailyStreakLengths(dayLog: DayLog): Record<string, number> {
  const result: Record<string, number> = {};
  let running = 0;
  for (const key of Object.keys(dayLog).sort()) {
    const status = dayLog[key];
    if (status === 'done') running += 1;
    else if (status === 'missed') running = 0;
    result[key] = running;
  }
  return result;
}

/** Koyulaşan turuncu dolgu için 0–1 opaklık; 10 günlük seride tam renge ulaşır. */
export function streakShadeOpacity(streakLength: number): number {
  return Math.min(1, streakLength / 10);
}

/**
 * Bugünün haftasıysa `thisWeekLabel`, değilse `formatRange` ile biçimlenmiş
 * aralık (mockup ekran 7'deki hafta başlığı, ör. "Jul 6 – Jul 12"). Asıl
 * biçimlendirme çağıran taraftan (t.common.formatWeekRange) gelir ki her dil
 * kendi ay adı/sırasını kullanabilsin.
 */
export function formatWeekRangeLabel(
  weekStart: Date,
  today: Date,
  thisWeekLabel: string,
  formatRange: (start: Date, end: Date) => string,
): string {
  if (dayKeyOf(weekStart) === dayKeyOf(startOfWeekMonday(today))) return thisWeekLabel;
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  return formatRange(weekStart, end);
}

/** "82% success since May 3" alt satırındaki tarih kısmı; hiç başlanmadıysa `todayLabel`. */
export function formatSince(
  startedAt: string | null,
  formatMonthDay: (date: Date) => string,
  todayLabel: string,
): string {
  if (!startedAt) return todayLabel;
  return formatMonthDay(new Date(startedAt));
}

export { dayKeyOf };
