import { describe, expect, it } from '@jest/globals';

import { rules } from '../../../design/tokens';
import { buildPremiumProducts } from '../IAPService';

describe('buildPremiumProducts', () => {
  it('Türkçe cihazda sabit TL fiyat kademesini kullanır (kur çevrimi değil)', () => {
    const products = buildPremiumProducts({ languageCode: 'tr', currencyCode: 'USD', languageTag: 'tr-TR' });
    const monthly = products.find((p) => p.plan === 'monthly')!;
    const yearly = products.find((p) => p.plan === 'yearly')!;

    expect(monthly.priceString).toContain(String(rules.premiumMonthlyTry).replace('.', ','));
    expect(monthly.priceString).toMatch(/₺|TRY/);
    expect(yearly.badge).toBe(true);
    expect(monthly.badge).toBeUndefined();
  });

  it('İngilizce/ABD cihazında USD ile biçimlendirir', () => {
    const products = buildPremiumProducts({ languageCode: 'en', currencyCode: 'USD', languageTag: 'en-US' });
    expect(products.find((p) => p.plan === 'monthly')!.priceString).toBe('$4.99');
    expect(products.find((p) => p.plan === 'yearly')!.priceString).toBe('$39.99');
  });

  it('Almanca cihazda EUR ile biçimlendirir (aynı USD tutarı, farklı gösterim)', () => {
    const products = buildPremiumProducts({ languageCode: 'de', currencyCode: 'EUR', languageTag: 'de-DE' });
    const monthly = products.find((p) => p.plan === 'monthly')!;
    expect(monthly.priceString).toContain('€');
    expect(monthly.priceString).toContain('4,99');
  });

  it('currencyCode null ise (web) USD ye düşer, sayı biçimi yine cihazın dilini izler', () => {
    const products = buildPremiumProducts({ languageCode: 'fr', currencyCode: null, languageTag: 'fr-FR' });
    // fr-FR ondalık ayıracı virgüldür; para birimi USD'ye düştü ama biçim Fransızca kalır.
    expect(products.find((p) => p.plan === 'monthly')!.priceString).toContain('4,99');
    expect(products.find((p) => p.plan === 'monthly')!.priceString).toMatch(/\$|USD/);
  });

  it('Intl tarafından tanınmayan para birimi kodunda USD ye güvenle düşer', () => {
    const products = buildPremiumProducts({ languageCode: 'xx', currencyCode: 'US', languageTag: 'en-US' });
    expect(products.find((p) => p.plan === 'monthly')!.priceString).toBe('$4.99');
  });

  it('yıllık planın indirim rozeti her para biriminde tutarlı kalır', () => {
    const products = buildPremiumProducts({ languageCode: 'en', currencyCode: 'USD', languageTag: 'en-US' });
    expect(products.find((p) => p.plan === 'yearly')!.badge).toBe(true);
  });
});
