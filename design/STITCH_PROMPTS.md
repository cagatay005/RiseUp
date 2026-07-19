# RiseUp — Stitch Promptları (arşiv, kullanımdan kaldırıldı)

> Stitch turu çok fazla iterasyon gerektirdiği için terk edildi. Tüm ekranların güncel,
> doğrulanmış hali artık [mockups.html](mockups.html) dosyasında — tek dosyalık HTML mockup
> panosu, gerçek fontlar ve tokens.ts renkleriyle, tarayıcıda render edilip kontrol edildi.
> Yeni revizeler oraya işlenir; bu dosya yalnızca geçmiş referans olarak duruyor.

Kullanım: Stitch'e her seferinde **tek ekran** üret. Ekranın tema etiketine göre önce ilgili
STYLE bloğunu yapıştır, boş satır bırak, ardından ekran promptunu ekle. Promptlar İngilizce
(Stitch İngilizceyle en tutarlı sonucu verir).

İterasyon ipuçları (ilk denemelerden çıkan dersler):
- Stitch uzun promptların **kuyruğunu düşürebiliyor**: alt buton / Skip / nokta gibi
  kritik ama sıradan öğeleri prompta erken ve "MANDATORY, do not omit" ile yaz.
- Dikey kompozisyonu bölge bölge tarif et (CENTER ZONE / BOTTOM ZONE / FOOTER ROW);
  "centered" tek başına yetmiyor, her şeyi üste yığıyor.
- "Highlighted area" gibi ifadeleri Stitch katı turuncu blok/bar'a çevirebiliyor —
  istenen efekti tarif ederken istenmeyeni de açıkça yasakla ("NEVER a solid bar").
- İkonlar için "thin monochrome line icons, never colored emoji" kısıtı koy.
- Kötü çıktıyı sıfırdan üretme: ekranı seçip Stitch'e kısa düzeltme mesajı yaz
  ("move the button to the bottom edge, keep everything else"). Yerleşimi korur.

Tema kuralları:
- **[DARK]** ekranlar (onboarding, alarm çalma, alarm kurma-ilk kez, tüm görev ekranları)
  yalnızca STYLE-DARK ile üretilir — bunların aydınlık varyantı YOKTUR.
- **[LIGHT]** ekranlar (Ev, İstatistik, Kupa, Ayarlar, Premium, Kaza) varsayılan aydınlıktır;
  uygulama içi tema toggle'ı için karanlık varyant gerekirse aynı ekran promptu STYLE-DARK
  ile bir kez daha üretilir, yerleşim değiştirilmez.
- Her ekranda `#F4A261` **tek bir odakta** kullanılır; prompt hangi öğe olduğunu söyler,
  Stitch'in başka yere turuncu eklemesine izin verme (gerekirse "orange appears ONLY on X"
  cümlesi zaten promptta).

---

## STYLE-LIGHT

```
Mobile app UI design, modern minimal Islamic prayer habit app called "RiseUp".
LIGHT THEME — exact colors, do not improvise:
- Page background #F4F6F9, cards #FFFFFF with 1px hairline borders #DDE3EA
- Primary text #1A2332 (deep night navy), secondary text #5C6B7A
- Secondary UI elements (inactive icons, secondary buttons) steel blue #4A6984
- ONE warm accent #F4A261 (dawn orange) used on exactly one focal element per screen;
  any small orange text or link uses the darker variant #A96219 for contrast
- Semantic colors: streak/success teal #2A9D8F, missed/warning terracotta #E76F51,
  gold badge #E9C46A, freeze/ice blue #8ECAE6
Typography: elegant Lora serif for headings, quotes and emotional moments;
Inter sans-serif for all UI text, numbers use tabular figures.
Style: flat, clean, generous whitespace, 12px rounded cards, 52px tall rounded
primary buttons, no gradients, no shadows heavier than a subtle card lift.
Feel: calm dawn, disciplined, premium habit tracker.
```

## STYLE-DARK

```
Mobile app UI design, modern minimal Islamic prayer habit app called "RiseUp".
DARK THEME — exact colors, do not improvise:
- Page background #0F1621 (pre-dawn navy black), cards #1A2332,
  elevated cards/modals #232F42, hairline borders #2F3D52
- Primary text #EDF1F6 (soft blue-white, never pure white), secondary text #A9B8C9
- Secondary UI elements light steel blue #7DA2C1
- ONE warm accent #F4A261 (dawn orange, high contrast on dark) on exactly one
  focal element per screen — orange appears ONLY where the prompt says
- Semantic colors (lightened for dark): streak teal #4FC3B2, warning terracotta #EF8A6E,
  gold #EDCD82, freeze/ice blue #9AD3EC
Typography: elegant Lora serif for headings, quotes and emotional moments;
Inter sans-serif for all UI text, numbers use tabular figures.
Style: flat, clean, 12px rounded cards, 52px tall rounded primary buttons,
no gradients, no neon, no glow.
Feel: quiet night before dawn, focused, serene.
```

---

## 1. Onboarding 1 — Özlü söz [DARK]

```
Onboarding screen 1 of 4, full-screen, background #0F1621 (dark navy, NOT pure black).
Three strict vertical zones — do not collapse them toward the top:
1) CENTER ZONE, vertically centered at the true middle of the screen, stacked and
   centered: first a minimalist flat logo — a sun (circle, #F4A261, with 3 short ray
   strokes) rising BEHIND two overlapping mountain silhouettes (back mountain #232F42,
   front mountain #1A2332 with a thin #2F3D52 outline) over a thin horizon line —
   then the wordmark "RiseUp" in Lora serif semibold 24pt #EDF1F6 right under it;
   then a 36px gap; then the daily quote "The success of your day is decided before
   the sun rises." in Lora serif italic, 22pt, #EDF1F6, centered, generous line
   height, no oversized decorative quotation marks; small attribution
   "— Ancient Proverb" in Inter 13pt #A9B8C9 below it.
2) BOTTOM ZONE, anchored to the bottom with 24px safe-area padding: a full-width 52px
   primary button "Break the Cycle", fill #F4A261, text #48280A, 12px radius —
   the only orange element on screen.
3) FOOTER ROW under the button, one baseline: "Skip" ghost text in #A9B8C9 pinned to
   the bottom-LEFT corner, and 4 progress dots pinned to the bottom-RIGHT corner
   (first dot #F4A261 counts as part of the button's accent moment, others #2F3D52).
The empty space lives ABOVE and AROUND the quote, never as a dead bottom half.
Meditative, calm, symmetric.
```

## 2. Onboarding 2 — Uyku bilimi [DARK]

```
Onboarding screen 2 of 4, background #0F1621. MANDATORY, do not omit: a full-width
52px SECONDARY button anchored at the bottom labeled "See How It Works" (transparent
fill, 1px #7DA2C1 border, #EDF1F6 text, 12px radius), with a footer row under it:
"Skip" ghost text bottom-LEFT in #A9B8C9 and 4 progress dots bottom-RIGHT (second
dot #F4A261, others #2F3D52).
Content above, top to bottom:
- Lora serif heading "Your brain at dawn", 26pt, #EDF1F6, left-aligned.
- One supporting sentence in Inter 14pt #A9B8C9.
- A chart card: #1A2332 fill, 12px radius, 1px #2F3D52 border, small caption
  "SLEEP DEPTH & BRAIN ACTIVITY" in 11pt #7DA2C1. Inside: ONE smooth line curve from
  10PM to 8AM, stroke #7DA2C1 2px. The dawn segment (4AM-6AM) is highlighted ONLY as
  a soft translucent #F4A261 area fill UNDER the curve, about 20% opacity, following
  the curve's shape — NEVER a solid orange rectangle, bar, or block. This subtle
  glow under the curve is the only orange on screen. X-axis labels "10PM  2AM  6AM"
  in Inter 11pt #A9B8C9. No second data series, no legend clutter.
- Three benefit rows: thin monochrome LINE icons in teal #4FC3B2 (crescent moon,
  sunrise, leaf) — never colored emoji or filled colorful glyphs — each with one
  short Inter 13pt #A9B8C9 sentence about waking early.
```

## 3. Onboarding 3 — İzinler [DARK]

```
Onboarding screen 3 of 4. Lora serif heading "Two permissions, one habit" in #EDF1F6.
Two tappable permission rows as #1A2332 cards with #2F3D52 borders:
1) location pin icon, title "Location Access", subtitle "To calculate prayer times
   for your city" — right side shows a teal #4FC3B2 checkmark (granted)
2) bell icon, title "Notifications & Critical Alerts", subtitle "So your alarm rings
   even in silent mode" — right side shows a chevron (not yet granted)
Below the rows, two short sentences in Inter 13pt #A9B8C9 explaining why these
permissions are needed and that data never leaves the device.
Bottom: full-width primary button "Grant Permissions" — the single orange #F4A261
element. Bottom-left "Skip", bottom-right 4 dots (third active).
```

## 4. Onboarding 4 — İlk alarm [DARK]

```
Onboarding screen 4 of 4. Center focus: a very large digital clock reading "05:12"
in Inter bold 64pt tabular figures, colored orange #F4A261 — the only orange element.
Above it a small Lora serif label "Tomorrow's Fajr". Below the clock, one line in
Inter 14pt #A9B8C9: "Calculated for your location — Istanbul". Below that, a
full-width primary button labeled "Set First Alarm" in elevated card color #232F42
with #EDF1F6 text and a #2F3D52 border (button is NOT orange, the clock owns the
accent). Bottom-left "Skip", bottom-right 4 dots (fourth active).
```

## 5. Alarm kurma — analog kadran [DARK]

```
Alarm setup screen, modal style. Top: digital readout of the selected time "05:12"
in Inter bold tabular 40pt #EDF1F6. Center: a large analog clock face (260px diameter),
dial background #1A2332 with #2F3D52 tick marks and ring, hour and minute hands in
#7DA2C1, the minute hand tip and the selected-time arc in orange #F4A261 — the only
orange. The hands look draggable. Below the dial: five small prayer shortcut chips in
a row labeled Fajr, Dhuhr, Asr, Maghrib, Isha (chips #232F42; the selected "Fajr"
chip has a #7DA2C1 border and #EDF1F6 text — chips are never orange).
Below chips: a task assignment row with three small task icons (compass, camera with
lock badge, microphone with lock badge). Bottom: full-width primary button "Save Alarm"
in #232F42 with #EDF1F6 text. Header has an X close icon top-left.
```

## 6. Ev (Ana Ekran) [LIGHT]

```
Home screen with bottom tab bar. Top bar: app name "RiseUp" in Lora serif #1A2332
on the left; top-right a small pill chip with an ice-blue #8ECAE6 snowflake icon and
the number "3" (streak freezes). Below: a centered flame emblem containing the number
"12" in Inter bold 40pt, flame colored orange #F4A261 — the single orange element —
with "Day Streak" caption in #5C6B7A underneath. Below: a white card showing the next
prayer: "Asr" in Lora serif with a live countdown "1h 24m" in Inter tabular, small
clock icon. Below: a list of alarm cards, each 88px tall white card with hairline
border: prayer name + time "05:12" on the left (Inter, tabular), an on/off toggle on
the right (active toggle steel blue #4A6984), and small task chips underneath the time
(compass icon chip, locked camera chip with tiny padlock). Three alarms visible.
Bottom-right floating "+" button in navy #1A2332 with white plus. Bottom tab bar 64px:
home icon (active, navy #1A2332), trophy, bar-chart, gear icons (inactive #4A6984).
```

## 7. İstatistik — Sayfa 1: Haftalık grafik [LIGHT]

```
Statistics screen, page 1 of 2 (two small page dots at top center, first active).
Top: a horizontal strip of today's five prayer times on a white card — "Fajr 05:12,
Dhuhr 13:04, Asr 16:48, Maghrib 19:55, Isha 21:20" in Inter 13pt tabular; the nearest
upcoming prayer "Asr" is highlighted in orange #F4A261 text — the only orange.
Center: a bright vertical bar chart, one bar per day showing 0–5 completed prayers,
horizontally scrollable to the left into past weeks. Today's bar is the tallest visual
focus in steel blue #4A6984, past days in lighter #8FA3B8 tint, empty days as faint
#DDE3EA stubs. Under each bar the day initial letter "M T W T F S S" in #5C6B7A 12pt.
Y-axis subtle gridlines. Bottom tab bar with bar-chart icon active in navy.
```

## 8. İstatistik — Sayfa 2: Seri takvimi [LIGHT]

```
Statistics screen, page 2 of 2 (two page dots at top, second active). A monthly
calendar grid on a white card, month title "July 2026" in Lora serif with left/right
chevrons. Day cells: days with completed prayers are filled with orange #F4A261 at
varying opacity — light tint for short streaks deepening to full orange for long
streak runs (this gradient of one hue is the screen's only orange); frozen days are
filled ice blue #8ECAE6 with a tiny snowflake icon below the day number; empty days
are plain white. Small legend row under the calendar: orange square "streak day",
ice square + snowflake "frozen", outline square "missed". Below: a stat block with
"82%" in Inter bold 40pt #1A2332 and caption "success since May 3" in #5C6B7A.
Bottom tab bar, bar-chart icon active.
```

## 9. Kupa — Başarı kartları [LIGHT]

```
Trophies screen. Lora serif heading "Your achievements" in #1A2332. Main area: a
horizontally swipeable carousel of tall 3:4 portrait achievement cards; the centered
card is a deep navy #1A2332 card with 20px corners showing: small RiseUp wordmark,
Lora serif title "15-Day Streak", a large golden #E9C46A number "15" with a subtle
flame motif, date "July 19, 2026" in #A9B8C9, decorative thin geometric Islamic
pattern border in #2F3D52. Under the carousel two buttons side by side: "Save"
(outlined steel blue) and "Share" — Share is the single orange #F4A261 primary
button. Below: section label "Badges" with a horizontal shelf of circular medallions:
"7-Day Flame", "Qibla Master" earned in gold #E9C46A frames, "Community Hero" as a
gray silhouette (locked). Bottom tab bar, trophy icon active navy.
```

## 10. Ayarlar [LIGHT]

```
Settings screen. Lora serif heading "Settings". Grouped white cards with hairline
borders, each row 56px with icon left, label, and control right:
Group 1: "Language" row with globe icon and value "English >" ;
"Go Premium" row with a small crown icon — this row's icon and chevron are orange
#F4A261, the only orange on screen.
Group 2: "Dark Mode" row with moon icon and an on/off toggle (off, steel blue track);
"Permissions" row with shield icon and a teal #2A9D8F "All granted" caption.
Group 3: small rows "Privacy Policy", "Terms", and version caption "RiseUp 1.0.0"
in #5C6B7A 12pt centered at bottom. Bottom tab bar, gear icon active navy.
```

## 11. Premium (Paywall) [LIGHT]

```
Premium paywall screen, modal with X top-left. Lora serif heading "Unlock your full
practice" in #1A2332, one supporting sentence in #5C6B7A. Feature list, three rows
with steel blue icons: camera icon "Prayer Rug Scan task", microphone icon "Verse
Recitation task", snowflake icon "10 streak freezes every month". Two selectable
plan cards side by side: "Monthly $4.99/mo" plain white card, and "Yearly $39.99/yr"
card with a small gold #E9C46A "Save 33%" badge and a 2px orange #F4A261 selected
border. Bottom: full-width primary button "Start 7-Day Free Trial" filled orange
#F4A261 with dark brown text #48280A (the selected border and this button are the
same single accent moment). Tiny footnote text about trial terms in #5C6B7A 11pt.
```

## 12. Kaza defteri [LIGHT]

```
Missed prayers (Qada) screen. Lora serif heading "Make up your prayers". A subtle
terracotta #E76F51 tinted banner at top: "2 missed prayers — 14 accumulated will
cost 1 freeze" with small snowflake icon. Below: list of missed prayer cards, each
white card showing prayer name "Fajr", missed date "July 17" in #5C6B7A, and a
compact button "Make up now" on the right — these buttons are outlined steel blue
#4A6984, except the topmost card's button which is filled orange #F4A261 (single
accent, nudging the next action). Bottom: a short explainer sentence in #5C6B7A
13pt about how making up prayers protects your freezes. Back chevron top-left.
```

## 13. Alarm çalıyor [DARK]

```
Full-screen ringing alarm. Top third: huge digital clock "05:12" in Inter bold 72pt
tabular #EDF1F6; below it Lora serif line "Fajr Time — Wake Up" in #A9B8C9.
Middle: vertical list of this alarm's tasks; the current task "Qibla Compass" is an
enlarged elevated card #232F42 with a compass icon, roughly 1.2x bigger than the
dimmed smaller cards below it ("Verse Recitation" with microphone icon, smaller,
#1A2332). Bottom: a large full-width primary button "Start Task" filled orange
#F4A261 with dark text #48280A — the only orange, clearly the dominant action.
Under it a small ghost button "Give Up" in #A9B8C9 with a tiny ice-blue #9AD3EC
snowflake and "−1" beside the label. No status bar, immersive.
```

## 14. Görev: Kıble Pusulası [DARK]

```
Qibla compass task screen. Top: Lora serif heading "Rotate your phone to find Qibla"
in orange #F4A261 — the only orange. Subtitle in Inter 14pt #A9B8C9: "Hold your
phone steady for 5 seconds when aligned". Center: a large circular compass
(280px diameter): dial ring #2F3D52 with degree ticks, cardinal letters in #7DA2C1,
a fixed Qibla marker at top (small kaaba icon), the rotating needle in #EDF1F6;
the outer ring glows teal #4FC3B2 indicating alignment. Below the compass: a big
countdown number "3" in Inter bold 48pt #EDF1F6 inside a thin circular progress
ring (teal progress on #2F3D52 track). Minimal, dark, focused.
```

## 15. Görev: Seccade Tarama [DARK]

```
Prayer rug camera task screen. Top: Lora serif heading "Capture your Prayer Rug"
in #EDF1F6, subtitle "Ensure the patterns or mihrab are clearly visible" in #A9B8C9.
Center: a large camera viewfinder with 20px rounded corners showing a prayer rug
photo preview, thin #2F3D52 frame; top-right corner of the viewfinder has a small
flash icon button (inactive, #A9B8C9). Below the viewfinder: a large circular
shutter button, 72px, white ring with orange #F4A261 inner circle — the single
orange element. Small "Retake" ghost text under it. Dark immersive background.
```

## 16. Görev: Sure Okuma [DARK]

```
Verse recitation task screen. Top: Lora serif heading "Recite out loud to dismiss"
in #EDF1F6, subtitle "Hold the microphone and read the verse clearly" in #A9B8C9.
Center: a #1A2332 card with an Arabic Quran verse in elegant Amiri-style naskh
calligraphy, 30pt, right-to-left, in #EDF1F6, and below it the Turkish translation
in Inter 14pt #A9B8C9. Under the card: a live audio waveform of thin vertical bars
in orange #F4A261 dancing around the center line — the only orange. Bottom: a large
circular microphone button, 72px, elevated #232F42 fill with #EDF1F6 mic icon and
a "hold to record" caption in #A9B8C9 12pt.
```

## 17. Görev sonucu: Okuma değerlendirme [DARK]

```
Recitation result screen. Center-top: a huge score "87" in Inter bold 64pt #EDF1F6
with "/100" small beside it, inside a thin teal #4FC3B2 progress ring. Below: Lora
serif encouragement line "Beautiful recitation" in #EDF1F6. Below: the verse text
repeated small with word-level highlights — correctly read words in teal #4FC3B2,
missed words underlined in terracotta #EF8A6E. Below: a card preview thumbnail
"Achievement card created" with a small trophy icon. Bottom: primary button
"Finish" filled orange #F4A261 dark text — single orange — and a ghost button
"Listen & retry" in #A9B8C9 beneath it.
```
