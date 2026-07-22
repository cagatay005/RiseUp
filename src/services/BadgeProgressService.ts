/**
 * Kupa ekranı — rozet ilerleme çarkı (Base-5 mekaniği): her rozetin ham
 * ilerleme sayısı (StreakEngine sayaçlarından gelir), sembol hiyerarşisinin
 * beşli taban gösterimine çevrilir. "5 aynı sembol toplanınca tek bir üst
 * seviye sembole dönüşür" kuralı, sayının 5 tabanında yazılmasıyla KENDİLİĞİNDEN
 * doğru çıkar — ayrı bir "birleştirme" adımına gerek yoktur.
 *
 * Seviye 0 (nokta) → 1 (hilal) → 2 (lale) → 3 (kandil) → 4 (nur); yer değeri 5^seviye.
 */

export type SymbolTier = 0 | 1 | 2 | 3 | 4;

export const SYMBOL_TIER_KEYS = ['dot', 'crescent', 'tulip', 'lantern', 'nur'] as const;
export type SymbolTierKey = (typeof SYMBOL_TIER_KEYS)[number];

export interface TierCount {
  tier: SymbolTier;
  key: SymbolTierKey;
  count: number;
}

/**
 * Bir tamamlama sayısını beşli taban basamaklarına ayırır; yalnızca sıfırdan
 * büyük basamaklar döner, en yüksek seviyeden en düşüğe sıralı (ör. 38 →
 * [{tier:2 (lale), count:1}, {tier:1 (hilal), count:2}, {tier:0 (nokta), count:3}]
 * — 1×25 + 2×5 + 3×1 = 38).
 */
export function toBase5Tiers(count: number): TierCount[] {
  const safeCount = Math.max(0, Math.floor(count));
  const result: TierCount[] = [];
  let remainder = safeCount;

  for (let tier = 4; tier >= 0; tier--) {
    const placeValue = 5 ** tier;
    const digit = Math.floor(remainder / placeValue);
    if (digit > 0) {
      result.push({ tier: tier as SymbolTier, key: SYMBOL_TIER_KEYS[tier]!, count: digit });
    }
    remainder %= placeValue;
  }

  return result;
}
