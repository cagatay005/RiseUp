import type { Verse } from '@/content/verses';

/**
 * Sure okuma değerlendirmesi — MVP (issue #12 notu: "basit skorla başla").
 *
 * DÜRÜST SINIR: Gerçek bir konuşma tanıma (STT) katmanı yoktur. Skor, kaydın
 * süresinin beklenen okuma süresini karşılama oranı ile ses aktivitesi
 * (metering) oranından türetilir — yani "yeterince uzun ve sesli okundu mu"
 * sezgiselidir, söylenenin doğruluğunu ölçmez. Kelime hizalamalı STT skoru
 * sonraki iterasyonda bu servisin arkasına takılacak; ekranlar yalnız skor
 * sözleşmesine bağlı olduğu için değişiklik buraya sınırlı kalır.
 */

/** Sözcük başına ~0.6 s okuma + hazırlık payı; çok kısa ayetlerde alt sınır. */
export function expectedReadingSeconds(verse: Verse): number {
  const words = verse.transliteration.trim().split(/\s+/).length;
  return Math.max(2.5, words * 0.6 + 0.8);
}

/** Metering (dBFS, negatif) örneklerinden sesli geçen oran: eşik üstü örnek yüzdesi. */
export function computeVoicedRatio(meteringDb: readonly number[], thresholdDb = -35): number {
  if (meteringDb.length === 0) return 0;
  const voiced = meteringDb.filter((db) => db > thresholdDb).length;
  return voiced / meteringDb.length;
}

/** 0–100 skor; anlık dokunuşlar (≤0.3 s) her zaman 0. */
export function scoreRecitation(
  expectedSeconds: number,
  durationSeconds: number,
  voicedRatio: number,
): number {
  if (durationSeconds <= 0.3) return 0;
  const coverage = Math.min(1, durationSeconds / expectedSeconds);
  return Math.round(100 * coverage * voicedRatio);
}
