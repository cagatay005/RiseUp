# RiseUp

Namaz vakitlerine alarm kuran, alarmın görevlerle (kıble pusulası, seccade tarama, sure
okuma) kapatıldığı, başarıların günlük seriye ve paylaşılabilir seri kartlarına dönüştüğü
mobil alışkanlık uygulaması.

## Tasarım kaynakları

Tüm ürün ve görsel kararlar `design/` altında yaşar — kod bu belgelerden türetilir:

| Dosya | İçerik |
|---|---|
| [design/tokens.ts](design/tokens.ts) | Renk paleti (aydınlık/karanlık), tipografi, ölçüler, iş kuralı sabitleri — **tek doğruluk kaynağı** |
| [design/DESIGN.md](design/DESIGN.md) | Ekran ekran tasarım belgesi (onboarding, alarm, görevler, istatistik, premium…) |
| [design/ARCHITECTURE.md](design/ARCHITECTURE.md) | Atomik mimari: atom→molekül→organizma→şablon→ekran, servisler, store'lar |
| [design/mockups.html](design/mockups.html) | 17 ekranın HTML mockup panosu (tarayıcıda aç) |

Temel tasarım kuralları: ekran başına tek `#F4A261` vurgu; alarm + görev ekranları her
zaman karanlık tema; hiçbir bileşende ham hex olmaz, renkler `tokens.ts` üzerinden gelir.

## Geliştirme

```bash
npm install
npx expo start        # dev server
npm run typecheck     # tsc --strict
```

> Not: Alarm güvenilirliği native modüller gerektirdiğinden (AlarmManager / Notifee
> full-screen intent) proje **Expo dev client** varsayar; Expo Go alarm özellikleri için
> yeterli değildir.

## Klasör yapısı

```
design/          tasarım belgeleri (yukarıda)
src/
├── app/         expo-router ekranları
├── components/  atoms / molecules / organisms
├── templates/   ekran şablonları
├── services/    PrayerTimes, AlarmScheduler, StreakEngine…
├── stores/      zustand + MMKV
├── content/     quotes, verses, badges
├── theme/       ThemeProvider + tokens
└── i18n/        çeviriler
```

## Yol haritası

Sprint planı ve iş listesi: [Issues](https://github.com/cagatay005/RiseUp/issues) ·
[MVP milestone — 26 Temmuz 2026](https://github.com/cagatay005/RiseUp/milestone/1)

Bilinen açık konular: iOS critical alerts entitlement başvurusu, sure okuma STT tercihi,
seccade doğrulama modeli, Community Hero rozetinin topluluk özelliği.
