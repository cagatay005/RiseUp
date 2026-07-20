/**
 * RiseUp — Tasarım Tokenları (tek doğruluk kaynağı)
 *
 * Tüm ekranlar renk, tipografi, ölçü ve iş kuralı sabitlerini
 * yalnızca bu dosyadan okur. Ekranlara hex yazmak yasaktır.
 */

// ---------------------------------------------------------------------------
// RENK PALETİ
// ---------------------------------------------------------------------------

/** Marka çekirdeği — temadan bağımsız ham değerler */
export const brand = {
  /** Ana renk: gece laciverti */
  navy: '#1A2332',
  /** Yardımcı renk: şafak mavisi */
  dawnBlue: '#4A6984',
  /** Vurgu: fecir turuncusu — ekran başına TEK kullanım */
  fajrOrange: '#F4A261',
  /** Açık zemin */
  mist: '#F4F6F9',
} as const;

export interface ThemeColors {
  /** Sayfa zemini */
  background: string;
  /** Kart / liste satırı zemini */
  surface: string;
  /** Modal, alarm kartı gibi yükseltilmiş yüzey */
  surfaceElevated: string;
  /** Ana metin */
  textPrimary: string;
  /** İkincil metin, alt yazılar */
  textSecondary: string;
  /** Kenarlık ve ayraçlar */
  border: string;
  /** İkincil buton, pasif ikon */
  secondary: string;
  /** Vurgu dolgusu (buton zemini, ilerleme) */
  accent: string;
  /** Vurgu metni/linki — küçük puntoda kontrast için koyu varyant */
  accentText: string;
  /** Vurgu dolgusu üzerindeki metin */
  onAccent: string;
  /** Seri / başarı */
  success: string;
  /** Kaza / uyarı */
  warning: string;
  /** Rozet / altın anlar */
  gold: string;
  /** Seri dondurma / kar tanesi */
  ice: string;
}

/** Uygulamanın tek ve zorunlu teması. */
export const dark: ThemeColors = {
  background: '#0F1621',
  surface: '#1A2332',
  surfaceElevated: '#232F42',
  textPrimary: '#EDF1F6',
  textSecondary: '#A9B8C9',
  border: '#2F3D52',
  secondary: '#7DA2C1', // #4A6984 koyu zeminde kaybolur; aydınlatılmış varyant
  accent: '#F4A261', // koyu zeminde ~7.6:1 — aynen kullanılır
  accentText: '#F4A261',
  onAccent: '#48280A',
  success: '#4FC3B2',
  warning: '#EF8A6E',
  gold: '#EDCD82',
  ice: '#9AD3EC',
} as const;

export type ThemeName = 'dark';
export const themes: Record<ThemeName, ThemeColors> = { dark };

// ---------------------------------------------------------------------------
// TİPOGRAFİ
// ---------------------------------------------------------------------------

/**
 * Lora  → başlıklar, özlü sözler, duygusal anlar (estetik serif)
 * Inter → arayüz metni, sayılar, butonlar (tabular-nums ile hizalı rakam)
 * Amiri → Kur'an ayetleri (Arapça naskh; sure okuma görevinde zorunlu)
 */
export const fonts = {
  heading: 'Lora_600SemiBold',
  headingItalic: 'Lora_500Medium_Italic', // özlü sözler için
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodyBold: 'Inter_700Bold',
  bodyItalic: 'Inter_400Regular_Italic', // ayet transliterasyonu için
  arabic: 'Amiri_400Regular',
} as const;

export const typography = {
  /** Onboarding özlü sözü — Lora italik */
  quote: { fontFamily: fonts.headingItalic, fontSize: 28, lineHeight: 40 },
  /** Ekran başlığı */
  h1: { fontFamily: fonts.heading, fontSize: 26, lineHeight: 34 },
  h2: { fontFamily: fonts.heading, fontSize: 20, lineHeight: 28 },
  /** Alarm ekranı dijital saat */
  clockDigital: { fontFamily: fonts.bodyBold, fontSize: 64, lineHeight: 72, fontVariant: ['tabular-nums'] as const },
  /** Geri sayım, seri sayısı gibi büyük rakamlar */
  numberLarge: { fontFamily: fonts.bodyBold, fontSize: 40, lineHeight: 48, fontVariant: ['tabular-nums'] as const },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fonts.bodyMedium, fontSize: 16, lineHeight: 20 },
  /** Ayet metni — Amiri, sağdan sola */
  ayah: { fontFamily: fonts.arabic, fontSize: 30, lineHeight: 56 },
  /** Ayetin Latin harfli okunuşu — Arapça ile meal arasında, muted italik */
  transliteration: { fontFamily: fonts.bodyItalic, fontSize: 15, lineHeight: 24 },
} as const;

// ---------------------------------------------------------------------------
// ÖLÇÜLER
// ---------------------------------------------------------------------------

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = {
  sm: 8, // çip, rozet
  md: 12, // kart, buton
  lg: 20, // seri kartı, modal
  full: 999, // toggle, avatar, deklanşör
} as const;

export const sizes = {
  buttonHeight: 52,
  buttonHeightSmall: 40,
  tabBarHeight: 64,
  alarmRowHeight: 88,
  compassDiameter: 280,
  shutterDiameter: 72,
  streakCardAspectRatio: 3 / 4, // paylaşılabilir dikey kart
  minTouchTarget: 44,
} as const;

// ---------------------------------------------------------------------------
// İŞ KURALLARI
// ---------------------------------------------------------------------------

export const rules = {
  /** 7 başarılı gün = 1 seri dondurma hakkı */
  streakDaysPerFreeze: 7,
  /** 14 birikmiş kaza = 1 dondurma hakkı geri alınır */
  qadaPerFreezeLoss: 14,
  /** Alarm ekranında Give Up = 1 kar tanesi kaybı */
  giveUpFreezeCost: 1,
  /** Kıble görevi: doğru hizada tutulacak süre ve tolerans */
  qiblaHoldSeconds: 5,
  qiblaToleranceDegrees: 5,
  /** Günlük özlü söz havuzu ve seçim: güne deterministik (tarih % 50) */
  quotePoolSize: 50,
  /** Her 15 günlük seri için bir başarı kartı üretilir */
  streakCardIntervalDays: 15,
  /** Premium */
  premiumMonthlyUsd: 4.99,
  premiumYearlyUsd: 39.99,
  trialDays: 7,
  premiumMonthlyFreezes: 10,
} as const;

// ---------------------------------------------------------------------------
// GÖREV KATALOĞU
// ---------------------------------------------------------------------------

export type TaskId = 'qibla' | 'rugScan' | 'recitation';

export interface TaskDef {
  id: TaskId;
  /** Arayüzde görünen ad (EN — i18n anahtarı olarak da kullanılır) */
  title: string;
  icon: 'compass' | 'camera' | 'microphone';
  premium: boolean;
}

export const tasks: readonly TaskDef[] = [
  { id: 'qibla', title: 'Qibla Compass', icon: 'compass', premium: false },
  { id: 'rugScan', title: 'Prayer Rug Scan', icon: 'camera', premium: true },
  { id: 'recitation', title: 'Verse Recitation', icon: 'microphone', premium: true },
] as const;

// ---------------------------------------------------------------------------
// AYET MEALİ DİLİ
// ---------------------------------------------------------------------------

/**
 * Sure okuma görevinde gösterilen mealin dili — uygulama arayüz dilinden (i18n)
 * bağımsız bir Ayarlar tercihidir; Arapça metin ve transliterasyon her zaman
 * sabittir, yalnızca meal satırı bu tercihe göre değişir.
 */
export type TranslationLanguage = 'tr' | 'en' | 'ur' | 'fr' | 'de' | 'id';

export const translationLanguages: readonly { id: TranslationLanguage; label: string }[] = [
  { id: 'tr', label: 'Türkçe' },
  { id: 'en', label: 'English' },
  { id: 'ur', label: 'اردو' },
  { id: 'fr', label: 'Français' },
  { id: 'de', label: 'Deutsch' },
  { id: 'id', label: 'Bahasa Indonesia' },
] as const;

export const defaultTranslationLanguage: TranslationLanguage = 'tr';

// ---------------------------------------------------------------------------
// VAKİTLER
// ---------------------------------------------------------------------------

export type PrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const prayers: Record<PrayerId, { title: string; alarmMessage: string }> = {
  fajr: { title: 'Fajr', alarmMessage: 'Fajr Time — Wake Up' },
  dhuhr: { title: 'Dhuhr', alarmMessage: 'Dhuhr Time — Take a Break' },
  asr: { title: 'Asr', alarmMessage: 'Asr Time — Pause & Pray' },
  maghrib: { title: 'Maghrib', alarmMessage: 'Maghrib Time — Sunset Prayer' },
  isha: { title: 'Isha', alarmMessage: 'Isha Time — End Your Day' },
} as const;

// ---------------------------------------------------------------------------
// ROZETLER
// ---------------------------------------------------------------------------

export interface BadgeDef {
  id: string;
  title: string;
  /** Kazanım koşulunun kısa açıklaması */
  criteria: string;
}

export const badges: readonly BadgeDef[] = [
  { id: 'flame7', title: '7-Day Flame', criteria: '7 günlük kesintisiz seri' },
  { id: 'qiblaMaster', title: 'Qibla Master', criteria: '50 başarılı kıble görevi' },
  { id: 'earlyBird', title: 'Early Bird', criteria: '30 Fajr alarmı görevle kapatıldı' },
  { id: 'reciter', title: 'Golden Reciter', criteria: '10 sure okuma %90+ skor' },
  { id: 'communityHero', title: 'Community Hero', criteria: 'Bir başarı kartını paylaş' },
] as const;
