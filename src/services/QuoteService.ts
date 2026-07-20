import { quotes, type Quote } from '@/content/quotes';

/**
 * Yerel takvim gününden kararlı bir tam sayı üretir (saat diliminden bağımsız —
 * PrayerTimesService.shouldRecalculate'teki aynı "yerel gün" prensibi).
 */
function localDayIndex(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

/** 50 sözlük havuzdan güne deterministik seçim — aynı gün herkes aynı sözü görür. */
export function getDailyQuote(date: Date = new Date()): Quote {
  const index = ((localDayIndex(date) % quotes.length) + quotes.length) % quotes.length;
  return quotes[index]!;
}
