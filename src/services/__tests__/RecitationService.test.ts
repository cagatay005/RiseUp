import { describe, expect, it } from '@jest/globals';

import { verses } from '../../content/verses';
import {
  computeVoicedRatio,
  expectedReadingSeconds,
  scoreRecitation,
} from '../RecitationService';

function verseWith(transliteration: string) {
  return { ...verses[0]!, transliteration };
}

describe('expectedReadingSeconds', () => {
  it('kısa ayette alt sınırın altına inmez', () => {
    expect(expectedReadingSeconds(verseWith('word'))).toBe(2.5);
  });

  it('kelime sayısıyla artar', () => {
    expect(expectedReadingSeconds(verseWith('one two three four five six'))).toBeGreaterThan(
      expectedReadingSeconds(verseWith('one two three')),
    );
  });
});

describe('computeVoicedRatio', () => {
  it('boş örneklem 0 döner', () => {
    expect(computeVoicedRatio([])).toBe(0);
  });

  it('eşik üstü örneklerin oranını verir', () => {
    expect(computeVoicedRatio([-10, -20, -50, -60])).toBe(0.5);
  });
});

describe('scoreRecitation', () => {
  it('anlık dokunuş her zaman 0', () => {
    expect(scoreRecitation(3, 0.2, 1)).toBe(0);
  });

  it('sessiz kayıt 0 alır', () => {
    expect(scoreRecitation(3, 5, 0)).toBe(0);
  });

  it('beklenen süre boyunca sesli okuma eşiği geçer', () => {
    expect(scoreRecitation(3, 3.5, 0.85)).toBeGreaterThanOrEqual(60);
  });

  it('süre kapsamı skoru orantılı düşürür', () => {
    const full = scoreRecitation(4, 4, 0.9);
    const half = scoreRecitation(4, 2, 0.9);
    expect(half).toBe(Math.round(full / 2));
  });
});
