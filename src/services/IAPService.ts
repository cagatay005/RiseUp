import { getLocales } from 'expo-localization';

import { rules } from '../../design/tokens';
import { usePremiumStore, type PremiumPlan } from '@/stores/premiumStore';

export interface PremiumProduct {
  plan: PremiumPlan;
  /** Cihazın yerel ayarına göre biçimlendirilmiş fiyat (ör. "$4.99", "₺79,99"). */
  priceString: string;
  /**
   * Yalnız yearly planda true — indirim rozeti gösterilsin mi. Rozetin metni
   * burada YOKTUR: fiyatlandırma cihazın gerçek yerel ayarına (para birimi),
   * rozet metni ise arayüz diline (settingsStore.language / t.premium.saveBadge)
   * bağlıdır — ikisi bağımsız eksenler, karıştırılmamalı.
   */
  badge?: boolean;
}

export interface DeviceLocale {
  languageCode: string | null;
  currencyCode: string | null;
  languageTag: string;
}

/**
 * DÜRÜST SINIR (issue #18 notu: "sandbox/test modunda çalışması yeterli"):
 * gerçek bir mağaza IAP entegrasyonu değildir. RevenueCat/expo-iap bağlanınca
 * bu modülün yerini onların gerçek ürün nesneleri alacak (priceString zaten
 * mağazadan yerelleştirilmiş gelir) — arayüz (bu iki fonksiyon) aynı kalacak
 * şekilde tasarlandı ki ekranda değişiklik gerekmesin.
 *
 * Fiyatlandırma: cihazın dili Türkçe ise sabit TL fiyat kademesi kullanılır
 * (rules.premiumMonthlyTry/YearlyTry) — mağazaların gerçek ülke kademeleri
 * USD'nin birebir kur çevrimi değildir, kendi sabit kademeleri vardır. Diğer
 * tüm yerel ayarlarda USD taban fiyat, cihazın bildirdiği para birimiyle
 * (Intl.NumberFormat) biçimlendirilir; bu GERÇEK ZAMANLI BİR DÖVİZ ÇEVRİMİ
 * DEĞİLDİR, yalnızca görüntü biçimidir. Ücretlendirme kararı kullanıcının
 * settingsStore'da seçtiği arayüz diline değil cihazın gerçek yerel ayarına
 * bağlıdır — gerçek mağazalar da fiyatı hesap/cihaz bölgesine göre belirler,
 * uygulama içi bir dil tercihine göre değil.
 */
export function buildPremiumProducts(locale: DeviceLocale): PremiumProduct[] {
  if (locale.languageCode === 'tr') {
    return [
      { plan: 'monthly', priceString: formatAmount(rules.premiumMonthlyTry, 'tr-TR', 'TRY') },
      { plan: 'yearly', priceString: formatAmount(rules.premiumYearlyTry, 'tr-TR', 'TRY'), badge: true },
    ];
  }

  const currency = locale.currencyCode ?? 'USD';
  return [
    { plan: 'monthly', priceString: formatAmount(rules.premiumMonthlyUsd, locale.languageTag, currency) },
    {
      plan: 'yearly',
      priceString: formatAmount(rules.premiumYearlyUsd, locale.languageTag, currency),
      badge: true,
    },
  ];
}

function formatAmount(amount: number, languageTag: string, currency: string): string {
  try {
    return new Intl.NumberFormat(languageTag, { style: 'currency', currency }).format(amount);
  } catch {
    // Cihazın bildirdiği para birimi kodu Intl tarafından tanınmıyorsa (nadir,
    // bozuk/eksik yerel ayar verisi) USD'ye düşülür.
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
}

/** Cihazın gerçek yerel ayarını okuyup yerelleştirilmiş ürün listesini üretir. */
export function getPremiumProducts(): PremiumProduct[] {
  const [locale] = getLocales();
  return buildPremiumProducts({
    languageCode: locale.languageCode,
    currencyCode: locale.currencyCode,
    languageTag: locale.languageTag,
  });
}

/** Deneme başlatma — kabul kriteri: premiumStore güncellenir, kilitli görevler açılır. */
export function startFreeTrial(plan: PremiumPlan): void {
  const trialEndsAt = new Date(Date.now() + rules.trialDays * 24 * 60 * 60 * 1000).toISOString();
  usePremiumStore.getState().setEntitlement({ isPremium: true, plan, trialEndsAt });
}
