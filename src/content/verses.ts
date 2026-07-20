import type { TranslationLanguage } from '../../design/tokens';

export interface Verse {
  id: string;
  /** Surenin Latin yazımlı adı — sonuç ekranı ve başarı kartında görünür. */
  surah: string;
  ayahNumber: number;
  /** Okunacak asıl metin (Amiri, sağdan sola). */
  arabic: string;
  /** Latin harfli okunuş — dil tercihinden bağımsız, her zaman gösterilir. */
  transliteration: string;
  /** tokens.ts → translationLanguages ile birebir aynı dil seti. */
  translations: Record<TranslationLanguage, string>;
}

/**
 * Kısa ve yaygın bilinen ayetlerle MVP havuzu. Mealler kısa tutulmuş özet
 * çevirilerdir; havuz büyütülürken aynı üç-satır yapısı korunmalı (DESIGN §6.3).
 */
export const verses: readonly Verse[] = [
  {
    id: 'fatiha-1',
    surah: 'Al-Fatiha',
    ayahNumber: 1,
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillāhir-raḥmānir-raḥīm',
    translations: {
      tr: "Rahmân ve Rahîm olan Allah'ın adıyla.",
      en: 'In the name of Allah, the Most Gracious, the Most Merciful.',
      ur: 'اللہ کے نام سے جو نہایت مہربان، رحم والا ہے۔',
      fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
      de: 'Im Namen Allahs, des Allerbarmers, des Barmherzigen.',
      id: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
    },
  },
  {
    id: 'ikhlas-1',
    surah: 'Al-Ikhlas',
    ayahNumber: 1,
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    transliteration: 'Qul huwallāhu aḥad',
    translations: {
      tr: "De ki: O, Allah'tır, bir tektir.",
      en: 'Say: He is Allah, the One.',
      ur: 'کہہ دو: وہ اللہ ایک ہے۔',
      fr: 'Dis : Il est Allah, Unique.',
      de: 'Sag: Er ist Allah, ein Einziger.',
      id: 'Katakanlah: Dialah Allah, Yang Maha Esa.',
    },
  },
  {
    id: 'ikhlas-2',
    surah: 'Al-Ikhlas',
    ayahNumber: 2,
    arabic: 'اللَّهُ الصَّمَدُ',
    transliteration: 'Allāhuṣ-ṣamad',
    translations: {
      tr: "Allah Samed'dir; her şey O'na muhtaçtır.",
      en: 'Allah, the Eternal Refuge.',
      ur: 'اللہ بے نیاز ہے۔',
      fr: "Allah, Celui dont tout dépend.",
      de: 'Allah, der Ewige und Absolute.',
      id: 'Allah tempat meminta segala sesuatu.',
    },
  },
  {
    id: 'kawthar-1',
    surah: 'Al-Kawthar',
    ayahNumber: 1,
    arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
    transliteration: 'Innā aʿṭaynākal-kawthar',
    translations: {
      tr: "Şüphesiz biz sana Kevser'i verdik.",
      en: 'Indeed, We have granted you al-Kawthar.',
      ur: 'بے شک ہم نے آپ کو کوثر عطا کی۔',
      fr: "Nous t'avons certes accordé l'Abondance.",
      de: 'Wir haben dir wahrlich die Fülle gegeben.',
      id: 'Sungguh, Kami telah memberimu nikmat yang banyak.',
    },
  },
  {
    id: 'falaq-1',
    surah: 'Al-Falaq',
    ayahNumber: 1,
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    transliteration: 'Qul aʿūdhu birabbil-falaq',
    translations: {
      tr: 'De ki: Sabahın Rabbine sığınırım.',
      en: 'Say: I seek refuge in the Lord of daybreak.',
      ur: 'کہہ دو: میں صبح کے رب کی پناہ مانگتا ہوں۔',
      fr: "Dis : Je cherche refuge auprès du Seigneur de l'aube.",
      de: 'Sag: Ich suche Zuflucht beim Herrn des Morgengrauens.',
      id: 'Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh.',
    },
  },
  {
    id: 'nas-1',
    surah: 'An-Nas',
    ayahNumber: 1,
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Qul aʿūdhu birabbin-nās',
    translations: {
      tr: 'De ki: İnsanların Rabbine sığınırım.',
      en: 'Say: I seek refuge in the Lord of mankind.',
      ur: 'کہہ دو: میں انسانوں کے رب کی پناہ مانگتا ہوں۔',
      fr: 'Dis : Je cherche refuge auprès du Seigneur des hommes.',
      de: 'Sag: Ich suche Zuflucht beim Herrn der Menschen.',
      id: 'Katakanlah: Aku berlindung kepada Tuhan manusia.',
    },
  },
] as const;

/** DESIGN §6.3: her açılışta rastgele ayet. */
export function getRandomVerse(): Verse {
  return verses[Math.floor(Math.random() * verses.length)]!;
}
