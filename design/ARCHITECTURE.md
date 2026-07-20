# RiseUp — Atomik Mimari

Atomic Design (atom → molekül → organizma → şablon → ekran) + servis katmanı + store katmanı.
Ekran tasarımları için [DESIGN.md](DESIGN.md), sabitler için [tokens.ts](tokens.ts).

**Stack varsayımı:** React Native + Expo (dev client zorunlu — native alarm modülleri Expo Go
ile çalışmaz), TypeScript strict, expo-router, zustand + MMKV, react-native-reanimated.

```
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── templates/
├── app/                  # expo-router ekranları
├── services/
├── stores/
├── content/              # quotes.ts, verses.ts (arapça + transliterasyon + çok dilli meal), badges meta
├── theme/                # tokens.ts + ThemeProvider
└── i18n/
```

---

## 1. Atomlar

Tek sorumluluklu, state'siz (veya yalnız görsel state'li) parçalar. Hepsi temayı
`useTheme()` üzerinden okur — hex görmez.

| Atom | Sorumluluk |
|---|---|
| `AppText` | Inter metin; `variant` prop'u `typography` anahtarlarını alır |
| `Heading` | Lora başlık (h1/h2/quote varyantları) |
| `ArabicText` | Amiri, RTL, ayet satırı |
| `Button` | `primary` (accent dolgu) / `secondary` (çerçeveli) / `ghost`; yükseklik 52 |
| `IconSymbol` | İkon sarmalayıcı (ev, kupa, grafik, dişli, alev, kar tanesi, pusula, kamera, mikrofon, kilit, flash) |
| `Toggle` | Aktif/pasif anahtar (alarm satırı, tema) |
| `Chip` | Görev çipi, vakit kısayol çipi; `locked` varyantı kilit ikonlu |
| `Badge` | Sayılı mini rozet (kar tanesi + sayı) |
| `ProgressRing` | Dairesel geri sayım halkası (kıble 5 sn) |
| `Dot` | Onboarding/istatistik sayfa göstergesi noktası |
| `Divider` | İnce ayraç |
| `Skeleton` | Yükleme iskeleti |

## 2. Moleküller

Atomların anlamlı birleşimleri; kendi mikro-state'i olabilir ama global store'a yazmaz.

| Molekül | İçerik |
|---|---|
| `QuoteBlock` | Heading(quote) + atıf satırı — onboarding 1 |
| `PermissionRow` | İkon + başlık + durum ikonu; basınca native izin / `openSettings` |
| `DigitalClock` | Tabular saat gösterimi (onboarding 4, alarm ekranı) |
| `PrayerCountdown` | Vakit adı (Lora) + canlı kalan süre |
| `StreakFlame` | Alev ikonu + `numberLarge` seri sayısı + "Day Streak" |
| `FreezeCounter` | Kar tanesi + hak sayısı çipi; basınca açıklama sheet'i |
| `AlarmRow` | Saat + vakit adı + Toggle; swipe-to-delete; altında görev çipleri |
| `TaskCard` | Görev ikonu + ad; `locked` durumunda soluk + kilit |
| `TabBarItem` | İkon + aktif vurgu |
| `StatBar` | Tek günlük sütun + gün baş harfi |
| `PrayerTimesStrip` | 5 vakit + saatleri; en yakını vurgulu |
| `CalendarDay` | Gün hücresi: seri koyuluğu dolgusu / ice dolgu + mini kar tanesi |
| `PlanCard` | Premium plan kartı (fiyat, dönem, "Save 33%" rozeti, seçili çerçeve) |
| `BadgeMedallion` | Rozet görseli; kazanılmamışsa silüet |
| `WaveformMeter` | Canlı ses dalgası çubukları |
| `ShutterButton` | Deklanşör (72, tam yuvarlak) |
| `FlashToggle` | Kamera flaş aç/kapa ikonu |
| `QadaBanner` | "N missed prayers to make up" ince şeridi |

## 3. Organizmalar

Ekranın ana blokları; store okur, servis çağırabilir.

| Organizma | İçerik / davranış |
|---|---|
| `OnboardingPager` | 4 ekranı saran sayfalayıcı + Skip + Dot'lar |
| `SleepScienceChart` | Uyku evreleri eğrisi, seher bölgesi accent taralı (statik SVG) |
| `PermissionPanel` | PermissionRow listesi + gerekçe metni + Grant Permissions/Continue akışı |
| `DigitalTimePicker` | Native saat seçici (iOS inline spinner / Android dialog), AM/PM, sınırsız ofset — vakit kısayol çipleriyle birlikte alarm-setup'ta kullanılır |
| `AlarmList` | AlarmRow listesi + boş durum + FAB |
| `TaskPicker` | 3 TaskCard'lı alt sayfa; kilitliye basınca Premium'a yönlendirir |
| `NextPrayerHeader` | PrayerCountdown + QadaBanner |
| `WeeklyChart` | Yatay kaydırmalı StatBar dizisi (geçmişe doğru sayfalı) |
| `StreakCalendar` | CalendarDay grid'i + ay gezinme + yüzdelik başarı bloğu |
| `AlarmRinging` | DigitalClock + vakit mesajı + görev listesi (sıradaki büyük) + Start Task / Give Up |
| `CompassDial` | Manyetometre+konumdan kıble açısı; hizada halka success; ProgressRing sayaç |
| `CameraViewfinder` | Kamera önizleme + FlashToggle + ShutterButton + doğrulama geri bildirimi |
| `RecitationPanel` | ArabicText + meal + WaveformMeter + basılı-tut mikrofon |
| `RecitationResult` | Skor + kelime vurguları + retry/dinle akışı |
| `AchievementCardGallery` | 3:4 başarı kartları; Save (galeri) + Share (native sheet) |
| `BadgeShelf` | Yatay kaydırmalı BadgeMedallion rafı |
| `SettingsList` | Dil, Go Premium, tema toggle'ı, izin durumu, linkler |
| `PaywallPanel` | Özellik listesi + PlanCard'lar + Start 7-Day Free Trial |
| `QadaLedger` | Bekleyen kazalar listesi + kaza kılma akışı başlatıcı |

## 4. Şablonlar

| Şablon | Kullanım |
|---|---|
| `OnboardingTemplate` | Karanlık zemin, ortalanmış içerik, sol alt Skip, sağ alt Dot'lar |
| `TabScreenTemplate` | SafeArea + başlık alanı + içerik + TabBar; kullanıcı temasını izler |
| `AlarmTemplate` | Her zaman karanlık; tam ekran, sistem çubukları gizli (full-screen intent) |
| `TaskTemplate` | Her zaman karanlık; üstte yönerge başlığı + açıklama, ortada görev slotu |
| `SheetTemplate` | Alt sayfalar (görev atama, dondurma açıklaması) |

## 5. Servisler

Saf TypeScript modülleri; UI import etmez, store'lara sonuç yazar.

| Servis | Sorumluluk |
|---|---|
| `PrayerTimesService` | Konumdan 5 vakti hesaplar (adhan-js benzeri yerel hesap; ağ gerektirmez). Şehir adı için reverse-geocode. |
| `AlarmScheduler` | **Güvenilirlik çekirdeği.** Android: `AlarmManager.setAlarmClock` + Notifee full-screen intent (ekran/uygulama kapalıyken çalar, Doze'dan muaf). iOS: critical alerts entitlement + zamanlanmış bildirim; entitlement onayına kadar time-sensitive fallback. Vakitler her gün kaydığı için gece yarısı yeniden planlama görevi. |
| `PermissionService` | Konum + bildirim + critical alert izin durumu; native diyalog / `openSettings` yönlendirme |
| `QiblaService` | Manyetometre + konum → kıble açısı; ±5° hiza ve 5 sn tutma değerlendirmesi |
| `RugScanService` | Kamera karesinden seccade/mihrap doğrulaması (cihaz üzeri hafif sınıflandırıcı) |
| `RecitationService` | Kayıt → STT → hedef ayetle hizalama → 0–100 skor; çevrimdışı fallback |
| `StreakEngine` | Tüm iş kuralları tek yerde: gün kapanışı, 7 gün → +1 dondurma, dondurma harcama, Give Up = −1, kaza defteri, 14 kaza → −1 dondurma, 15 günde bir kart üretimi, yüzdelik başarı |
| `QuoteService` | 50 sözlük havuzdan güne deterministik seçim |
| `CardRenderer` | Başarı kartını görsel olarak üretir (view-shot) → galeriye kaydet / paylaş |
| `IAPService` | Abonelik satın alma, deneme, restore (RevenueCat veya expo-iap) |
| `AnalyticsService` | Ekran ve dönüşüm olayları (opsiyonel, gizlilik dostu) |

## 6. Store'lar (zustand + MMKV persist)

| Store | State | Not |
|---|---|---|
| `alarmsStore` | alarms[] (id, prayerId, time, enabled, taskIds[]) | Her mutasyon AlarmScheduler'ı senkron tetikler |
| `streakStore` | currentStreak, bestStreak, freezes, qadaCount, dayLog{date→done/frozen/missed}, cards[], badges[] | Yalnız StreakEngine üzerinden yazılır |
| `settingsStore` | theme, language, translationLanguage, onboardingDone, permissionsSnapshot | `translationLanguage` yalnız sure okuma mealini etkiler, `language` arayüzü |
| `premiumStore` | isPremium, plan, trialEndsAt | IAPService senkronu |
| `prayerStore` | todayTimes, location, cityName, lastCalcAt | Gece yarısı + konum değişiminde yenilenir |

Kural: bileşenler store'ları selector ile okur; iş kuralı içeren her yazma servis
katmanından geçer (UI'da `if (streak % 7 === 0)` görülürse mimari ihlaldir).

## 7. Ekranlar (expo-router)

```
app/
├── onboarding/
│   ├── quote.tsx            # 1 — özlü söz
│   ├── science.tsx          # 2 — uyku bilimi
│   ├── permissions.tsx      # 3 — izinler
│   └── first-alarm.tsx      # 4 — ilk alarm
├── (tabs)/
│   ├── index.tsx            # Ev
│   ├── trophies.tsx         # Kupa
│   ├── stats.tsx            # İstatistik
│   └── settings.tsx         # Ayarlar
├── alarm-setup.tsx          # Analog kadranlı kurma (modal)
├── alarm-ringing.tsx        # Çalan alarm (full-screen intent hedefi)
├── task/
│   ├── qibla.tsx
│   ├── rug-scan.tsx
│   ├── recitation.tsx
│   └── recitation-result.tsx
├── qada.tsx                 # Kaza defteri
└── premium.tsx              # Paywall (modal)
```

Akış kilitleri: `onboardingDone` false ise kök yönlendirme onboarding'e;
`alarm-ringing` yalnızca AlarmScheduler intent'inden açılır ve geri tuşu görev/Give Up
dışında çıkışa izin vermez.

## 8. Kritik teknik notlar

1. **Alarm güvenilirliği pazarlık konusu değil.** Uygulamanın varlık sebebi bu. Android'de
   `USE_EXACT_ALARM` + `setAlarmClock` + full-screen intent; pil optimizasyonu muafiyeti
   onboarding'de istenmez, ilk alarm kurulumunda bağlamıyla istenir. iOS critical alerts
   entitlement başvurusu erken yapılmalı (onay haftalar sürebilir).
2. **Vakitler her gün kayar** → alarmlar "sabit saat" değil "vakit + ofset" olarak saklanır;
   her gece yarısı (ve konum değişince) yeniden hesaplanıp yeniden planlanır.
3. **Görev sırasında ses:** alarm sesi görev ekranına girişte durur, görev iptalinde geri
   döner — bu geçiş `AlarmRinging` organizması değil `AlarmScheduler` sorumluluğudur.
4. **Premium kapıları tek noktadan:** `premiumStore.isPremium` selector'ı; TaskPicker ve
   görev route'ları aynı guard'ı kullanır (route'a derin linkle gelinse bile kilit çalışır).
5. **Kart üretimi ekran görüntüsü değil render'dır:** `CardRenderer` kartı sahne dışında
   çizer; böylece paylaşılan görsel her cihazda aynı ve yüksek çözünürlüklüdür.

## Açık konular

- iOS critical alerts entitlement başvuru durumu.
- Sure skorlama için STT tercihi (cihaz içi Whisper-tabanlı mı, bulut mu) ve Arapça doğruluk hedefi.
- "Community Hero" rozetinin ima ettiği topluluk/paylaşım özelliğinin kapsamı.
- Seccade doğrulama modelinin eğitim verisi ve yanlış-pozitif eşiği.
