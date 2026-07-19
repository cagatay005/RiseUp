# RiseUp — Tasarım Belgesi

Namaz vakitlerine alarm kuran, alarmın görevlerle kapatıldığı, başarıların günlük seriye ve
paylaşılabilir seri kartlarına dönüştüğü mobil alışkanlık uygulaması.

Tüm renk/ölçü/kural sabitleri [tokens.ts](tokens.ts) dosyasındadır; bu belge ekranların nasıl
kurulduğunu anlatır. Mimari için [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 1. Tasarım ilkeleri

1. **Ekran başına tek turuncu.** `accent` (#F4A261) her ekranda tek bir odakta kullanılır —
   birincil buton, aktif seri, vurgulu vakit. Her yere serpilirse dopamin etkisi ölür.
2. **Gece/gündüz ayrımı bağlamsaldır.** Alarm ve görev ekranları her zaman karanlık temadadır
   (kullanıcı o an muhtemelen karanlık bir odada). Gündüz ekranları (Ev, İstatistik, Kupa,
   Ayarlar) kullanıcının seçtiği temayı izler; varsayılan aydınlık.
3. **Lora duygu, Inter mühendislik.** Başlıklar, özlü sözler ve kutlama anları Lora; liste,
   sayı, buton, form Inter (tabular-nums). Ayetler Amiri.
4. **Rakamlar titremesin.** Geri sayım, saat ve istatistiklerde `fontVariant: tabular-nums`
   zorunlu — saniye değişirken genişlik oynamaz.
5. **Ödül anları cömert, arayüz cimri.** Seri kartı ve rozet ekranları renk ve animasyonda
   serbesttir; günlük arayüz sade ve az renklidir.

---

## 2. Onboarding (4 ekran)

Ortak şablon: içerik ortada, sol alt köşede her ekranda `Skip` (ghost buton, `textSecondary`)
— basılınca doğrudan Ana Ekran'a gider. Sağ altta ilerleme noktaları (4 nokta, aktif olan
`accent`). Onboarding karanlık temada açılır (uygulamanın ilk izlenimi gece-seher atmosferi).

### 2.1 Ekran 1 — Logo + Özlü söz
- Orta bloğun tepesinde marka: **dağların arkasından doğan güneş** minimal sembolü
  (güneş `accent` dolgu + 3 kısa ışın; arka dağ `surfaceElevated`, ön dağ `surface`
  silüeti, ince ufuk çizgisi) ve hemen altında **RiseUp** kelime markı (Lora SemiBold).
  Logo güneşi ile alttaki buton aynı turuncuyu paylaşır — bu ekranda vurgu tek "marka anı"
  olarak sayılır; splash ekranında da aynı sembol kullanılır.
- 50 sözlük havuzdan güne deterministik seçim (`gün_indeksi % 50`) — aynı gün herkes aynı sözü
  görür, ertesi gün değişir.
- Söz, logonun altında Lora italik (`typography.quote`), altında küçük atıf satırı
  (`caption`, `textSecondary`).
- Altta birincil buton: **Break the Cycle** (`accent` dolgu, `onAccent` metin) → Ekran 2.

### 2.2 Ekran 2 — Uyku bilimi
- Başlık (Lora): erken uyanmanın faydası temalı tek cümle.
- Ortada statik istatistik grafiği: gece boyunca beyin aktivitesi / uyku evreleri eğrisi;
  seher vakti bölgesi `accent` ile taranmış, kalan eğri `secondary`. Altında 2–3 maddelik
  kısa fayda listesi (`bodySmall`).
- Buton: **See How It Works** → Ekran 3.

### 2.3 Ekran 3 — İzinler
- Uygulama ilk açılışta zaten native izin diyaloglarını tetikler; bu ekran eksik kalanları
  toplar.
- İki interaktif satır (kart görünümlü, sağda durum ikonu: verildi ✓ `success` / verilmedi →
  ok ikonu):
  - **Location Access** — vakitleri konuma göre hesaplamak için.
  - **Notifications & Critical Alerts** — alarmın sessiz modda bile çalabilmesi için.
  - Satıra basınca: izin daha istenmemişse native diyalog, reddedilmişse telefonun ayarlar
    sayfasına yönlendirme (`Linking.openSettings`).
- Satırların altında iki cümlelik gerekçe metni (`bodySmall`, `textSecondary`).
- Birincil buton: **Grant Permissions** — sırayla eksik izinleri ister/ayarlara götürür.
  Tüm izinler verilince buton **Continue**'ya dönüşür → Ekran 4. İzin verilmese de Continue
  ile geçilebilir (izinler daha sonra Ayarlar'dan tamamlanabilir; alarm kurarken tekrar uyarılır).

### 2.4 Ekran 4 — İlk alarm
- Ortada büyük dijital saat (`clockDigital`, `accent`): kullanıcının konumuna göre yarınki
  **Fajr** vakti. Konum izni yoksa saat yerine "—:—" ve izin isteme kısayolu.
- Altında kısa metin: "Calculated for your location" + şehir adı (`bodySmall`).
- Birincil buton: **Set First Alarm** → Alarm Kurma ekranı (analog kadran, §5) açılır,
  varsayılan olarak Fajr vaktine kurulu gelir.
- Alarm kaydedilince onboarding biter → Ana Ekran. Kurulan alarm gerçek alarmdır: ekran
  kapalı, uygulama kapalı olsa da vaktinde çalar (bkz. ARCHITECTURE §5 AlarmScheduler).

---

## 3. Ana yapı — 4 sekme

Alt tab bar (yükseklik 64): **Ev** (ev ikonu) · **Kupa** (kupa) · **İstatistik** (grafik) ·
**Ayarlar** (dişli). Aktif sekme ikonu `textPrimary` (koyu lacivert), pasifler `secondary` —
turuncu değil; ekrandaki tek `accent` kullanımı içerik öğesine (alev, vurgulu vakit vb.) aittir.

### 3.1 Ev
Yukarıdan aşağıya:
1. **Üst şerit:** sağ üst köşede kar tanesi ikonu + mevcut dondurma hakkı sayısı
   (`ice` renkli çip). Basınca dondurma hakkının ne olduğunu anlatan küçük alt sayfa açılır.
2. **Seri bloğu:** ortada şık alev simgesi, içinde kullanıcının en yüksek seri sayısı
   (`numberLarge`), altında "Day Streak" (`caption`). Alev, aktif seri varsa `accent`,
   seri sıfırsa `border` tonunda soluk.
3. **Sonraki vakit sayacı:** en yakın vaktin adı + kalan süre canlı geri sayımla
   ("Asr · 1h 24m"). Kart görünümünde, vakit adı Lora.
4. **Alarm listesi:** her satır (`alarmRowHeight`): vakit adı + saat (tabular), sağda
   aktif/pasif toggle, satır sola kaydırılınca sil. Satırın altında o alarma atanmış görev
   çipleri (ikon + ad) görünür.
   - Satıra dokununca **Görev Atama** alt sayfası açılır: 3 görev kartı (kıble pusulası,
     seccade tarama, sure okuma). Seccade ve sure kartları premium değilse kilit ikonlu ve
     soluk; basılınca Premium ekranına götürür.
5. Liste boşsa boş durum: "No alarms yet" + **Add Alarm** butonu. Sağ altta her zaman
   `+` FAB → Alarm Kurma ekranı.

### 3.2 İstatistik
İki yatay sayfa (sayfalı yatay kaydırma, üstte 2 nokta göstergesi):

**Sayfa 1 — Haftalık performans**
- Üstte 5 vakit saatiyle birlikte yatay şerit; mevcut zamana en yakın vakit `accent` ile
  vurgulu, diğerleri `textSecondary`.
- Altında parlak sütun grafiği: her gün bir sütun (o gün tamamlanan vakit sayısı 0–5).
  Sola kaydırınca geçmiş haftalar en başa kadar görünür. Sütun altında günün baş harfi
  (M T W T F S S). Bugünün sütunu `accent`, geçmiş günler `secondary`, boş günler `border`.

**Sayfa 2 — Takvim (sağa kaydırınca)**
- Aylık takvim: görev yapılan günler serinin uzunluğuna göre `accent`e doğru koyulaşan
  dolgu (kısa seri açık ton → uzun seri tam turuncu); dondurulan günler `ice` mavisi dolgu
  ve hücrenin altında minik kar tanesi; boş günler dolgusuz.
- Takvimin altında: başlangıç gününden bugüne **yüzdelik başarı** ("82% success since May 3"),
  büyük rakam `numberLarge`.

### 3.3 Kupa (Ödüller)
İki yatay bölüm:
- **Başarı kartları:** sure görevi değerlendirmelerinden ve her 15 günlük seriden üretilen
  dikey kartlar (3:4 oran, `radius.lg`). Kart: koyu lacivert zemin, üstte Lora başlık,
  ortada büyük sayı/skor, altta tarih ve RiseUp logosu. Kart üzerinde iki eylem:
  **Save** (galeriye kaydet) ve **Share** (native paylaşım sayfası — kullanıcı nerede
  paylaşacağını seçer).
- **Rozetler:** sağa kaydırdıkça vurgulu rozetler: 7-Day Flame, Qibla Master, Early Bird,
  Golden Reciter, Community Hero… Kazanılmamış rozetler silüet halinde (`border` tonu),
  kazanılanlar `gold` çerçeveli.

### 3.4 Ayarlar
Basit gruplu liste:
- **Language** — arayüz dili seçimi (EN/TR ile başla, i18n altyapısı genişlemeye açık).
- **Quran Translation** — sure okuma görevinde gösterilen mealin dili; arayüz dilinden
  bağımsız bir tercih (kullanıcı arayüzü İngilizce kullanıp meali Urduca okuyabilir).
  Varsayılan Türkçe. Seçenekler `tokens.ts` → `translationLanguages`.
- **Go Premium** — Premium ekranına götüren vurgulu satır (tek `accent` kullanımı burada).
- **Dark Mode** — gece/gündüz teması toggle'ı (yalnız gündüz ekranlarını etkiler; alarm ve
  görev ekranları her zaman karanlık).
- İkincil: izin durumu kısayolu, gizlilik/koşullar linkleri, sürüm numarası.

---

## 4. Alarm çalma ekranı (her zaman karanlık tema)

- En üstte dijital saat (`clockDigital`, `accent`).
- Altında vakit adı + mesaj (Lora): örn. **Fajr Time — Wake Up**.
- Altında bu alarma atanmış görevlerin listesi (ikonlarıyla). Sıradaki görev diğerlerinden
  **büyük** gösterilir (ölçek ~1.2, `surfaceElevated` kart).
- İki buton:
  - **Start Task** — büyük, `accent` dolgulu, ekranın ana odağı (teşvik bu yönde).
  - **Give Up** — küçük, ghost, yanında `−1` + kar tanesi ikonu (`ice`). Basınca onay ister:
    "Bir dondurma hakkı harcanacak". Dondurma hakkı yoksa Give Up seriyi sıfırlar ve bunu
    açıkça söyler.
- Alarm sesi görev ekranına girildiği anda susar (kullanıcı görevdeyken çalan alarm olmaz);
  görev yarıda bırakılırsa alarm ekranına dönülür ve ses yeniden başlar.

---

## 5. Alarm kurma ekranı — analog kadran

- Uygulama temasına uygun büyük analog saat (`analogClockDiameter`): akrep/yelkovan
  sürüklenerek saat kurulur; kadran çevresi lacivert, seçili saat ibresi `accent`.
- Kadranın üstünde seçilen saatin dijital karşılığı (canlı güncellenir, tabular).
- Vakit kısayolları: 5 vakit çipi (Fajr, Dhuhr, Asr, Maghrib, Isha) — çipe basınca kadran o
  günün hesaplanmış vaktine atlar; kullanıcı isterse ibreyi elle oynatıp vaktin ±dakika
  öncesine/sonrasına alabilir.
- Altta görev atama bölümü (Ev ekranındakiyle aynı bileşen) ve **Save Alarm** birincil butonu.
- Kaydedilen alarm işletim sistemi seviyesinde planlanır: uygulama/ekran kapalıyken de çalar.

---

## 6. Görev ekranları (her zaman karanlık tema)

Ortak yapı: üstte vurgulu yönerge başlığı (Lora), altında ikincil açıklama satırı, ortada
görev bileşeni, görev başarıyla bitince kısa kutlama animasyonu → alarm kapanır, gün seriye
işlenir.

### 6.1 Kıble Pusulası (ücretsiz)
- Başlık: **Rotate your phone to find Qibla** (`accent`).
- Alt satır: "Hold your phone steady for 5 seconds when aligned".
- Ortada büyük, **lüks bir enstrüman** hissi veren pusula (`compassDiameter`): koyu
  zeminde pirinç/altın tonlarında (radyal gradyan bezel + `gold` çerçeve), ince derece
  çentikleri (10°'de bir soluk, 30°'de bir belirgin altın çentik), merkezde ince çizgili
  8 köşeli yıldız rozeti (İslam geometrik motifi), ve ucunda küçük mücevher/Kabe
  işaretçisi olan altın bir ibre. Kadranın kenarında ince bir `success` (teal) halka
  hiza durumunu gösterir — pirinç enstrümanın kendisi nötr/dekoratif, hiza semantiği
  yalnızca bu teal halkada yaşar. İbre gerçek kıble açısına göre çapraz durur (düz yukarı
  değil) — hem gerçekçi hem de "N" harfiyle görsel çakışmayı önler.
- Altında 5 saniyelik geri sayım halkası (`numberLarge`): hiza bozulursa sayaç başa döner.

### 6.2 Seccade Tarama (premium)
- Başlık: **Capture your Prayer Rug**. Alt satır: "Ensure the patterns or mihrab are
  clearly visible".
- Ortada büyük kamera önizlemesi (`radius.lg` maskeli), sağ üst köşesinde flash ikonu —
  basınca telefon flaşı açılır/kapanır (ikon durumu `accent`/`textSecondary`).
- Altında deklanşör butonu (`shutterDiameter`, `full` yuvarlak, beyaz halka).
- Çekilen kare cihaz üzerinde doğrulanır (desen/mihrap sınıflandırma); başarısızsa
  "Try again — get closer to the rug" geri bildirimi ile tekrar denetir.

### 6.3 Sure Okuma (premium)
- Başlık: **Recite out loud to dismiss**. Alt satır: "Hold the microphone and read the
  verse clearly".
- Sure ekranı: Kur'an'dan rastgele seçilmiş ayet, üç satırlık sabit dizilim:
  1. **Arapça** (Amiri, `typography.ayah`, sağdan sola) — okunacak asıl metin.
  2. **Transliterasyon** — ayetin Latin harfli okunuşu (`typography.transliteration`,
     italik, `textSecondary`'den bir ton soluk) doğrudan Arapçanın altında; kullanıcı
     Arapça okuma bilmese de sesli tekrar edebilsin diye zorunlu, dil tercihinden
     etkilenmez.
  3. **Meal** — kullanıcının Ayarlar'dan seçtiği dile göre çeviri (`bodySmall`,
     `textSecondary`), transliterasyonun altında. Varsayılan Türkçe; İngilizce, Urduca,
     Fransızca, Almanca, Endonezce arasından değiştirilebilir (bkz. §3.4 Ayarlar).
- Altında canlı ses dalgası animasyonu (kayıt sırasında `accent` çubuklar oynar).
- En altta mikrofon butonu (basılı tut → kayıt; bırak → değerlendirme).
- **Değerlendirme ekranı:** okuma doğruluğu skoru (0–100, `numberLarge`), kelime bazında
  doğru/eksik vurgulaması, kısa teşvik cümlesi (Lora). Skor eşiği geçtiyse alarm kapanır ve
  Kupa ekranı için bir başarı kartı üretilir; geçemediyse "Listen & retry" ile örnek okunuş
  dinletilir ve tekrar denenir.

---

## 7. Premium ekranı

- Üstte Lora başlık + kısa değer önerisi.
- Özellik listesi (ikonlu 3 satır): Seccade Tarama görevi · Sure Okuma görevi ·
  ayda 10 seri dondurma hakkı.
- İki plan kartı yan yana: **Monthly $4.99** ve **Yearly $39.99** ("Save 33%" rozeti,
  `gold`). Seçili kart `accent` çerçeveli.
- Altta büyük birincil buton: **Start 7-Day Free Trial** — altında küçük yazıyla deneme
  sonrası ücretlendirme ve iptal koşulu.

---

## 8. Kaza (Qada) akışı

Serinin dürüstlüğünü koruyan telafi mekanizması:
- Kaçırılan her vakit kaza defterine işlenir (Ev ekranında sonraki vakit sayacının altında
  ince bir "2 missed prayers to make up" şeridi olarak görünür — `warning` tonunda).
- Şeride basınca Kaza ekranı: bekleyen kazalar listelenir; kullanıcı bir kazayı kılmak
  istediğinde vakit dışı bir mini görev akışıyla (kıble görevi) doğrular ve kaza kapanır.
- Sayaç kuralı: birikmiş kaza 14'e ulaştığında 1 dondurma hakkı düşülür ve sayaç 14 azalır.
  Kaza kılmak birikimi azaltır; kullanıcıya bu ekonomi Kaza ekranında tek cümleyle anlatılır.

---

## 9. Boş durumlar ve kenar senaryolar

- **Konum izni yok:** vakitler hesaplanamaz → Ev'de sayaç yerine izin isteme kartı.
- **Bildirim/critical alert izni yok:** alarm kurulurken engelleyici uyarı + ayarlara link.
- **Seri sıfırlandı:** suçlayıcı değil, yeniden başlatıcı dil ("Start a new streak today").
- **Çevrimdışı:** vakitler son hesaplama üzerinden çalışır; sure değerlendirme çevrimdışıysa
  cihaz içi basit skorlamaya düşer.
