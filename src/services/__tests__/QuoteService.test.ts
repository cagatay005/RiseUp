import { describe, expect, it } from '@jest/globals';

import { quotes } from '@/content/quotes';
import { getDailyQuote } from '../QuoteService';

describe('getDailyQuote', () => {
  it('aynı takvim günü için deterministiktir', () => {
    const a = getDailyQuote(new Date(2026, 6, 19, 3, 0));
    const b = getDailyQuote(new Date(2026, 6, 19, 23, 0));
    expect(a).toEqual(b);
  });

  it('ertesi gün farklı bir söz verir (havuzda çakışma yoksa)', () => {
    const day1 = getDailyQuote(new Date(2026, 6, 19));
    const day2 = getDailyQuote(new Date(2026, 6, 20));
    expect(day1).not.toEqual(day2);
  });

  it('her zaman havuzdaki bir sözü döner', () => {
    const quote = getDailyQuote(new Date(2026, 6, 19));
    expect(quotes).toContainEqual(quote);
  });

  it('50 gün boyunca havuzun tamamı dolaşılır', () => {
    const seen = new Set<string>();
    for (let i = 0; i < quotes.length; i++) {
      seen.add(getDailyQuote(new Date(2026, 0, 1 + i)).text);
    }
    expect(seen.size).toBe(quotes.length);
  });
});
