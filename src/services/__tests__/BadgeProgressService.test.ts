import { describe, expect, it } from '@jest/globals';

import { toBase5Tiers } from '../BadgeProgressService';

describe('toBase5Tiers', () => {
  it('0 için boş dizi döner', () => {
    expect(toBase5Tiers(0)).toEqual([]);
  });

  it('1-4 arası yalnızca nokta (tier 0) döner', () => {
    expect(toBase5Tiers(3)).toEqual([{ tier: 0, key: 'dot', count: 3 }]);
  });

  it('5 nokta 1 hilale dönüşür (kendiliğinden birleşme)', () => {
    expect(toBase5Tiers(5)).toEqual([{ tier: 1, key: 'crescent', count: 1 }]);
  });

  it('istekteki tam örnek: 38 -> 1 Lale, 2 Hilal, 3 Nokta', () => {
    expect(toBase5Tiers(38)).toEqual([
      { tier: 2, key: 'tulip', count: 1 },
      { tier: 1, key: 'crescent', count: 2 },
      { tier: 0, key: 'dot', count: 3 },
    ]);
  });

  it('25 hilal 1 laleye dönüşür, ara basamaklar sıfırsa gösterilmez', () => {
    expect(toBase5Tiers(25)).toEqual([{ tier: 2, key: 'tulip', count: 1 }]);
  });

  it('125 tam olarak 1 kandile dönüşür', () => {
    expect(toBase5Tiers(125)).toEqual([{ tier: 3, key: 'lantern', count: 1 }]);
  });

  it('625 tam olarak 1 nur\'a dönüşür', () => {
    expect(toBase5Tiers(625)).toEqual([{ tier: 4, key: 'nur', count: 1 }]);
  });

  it('negatif veya kesirli girdi güvenle 0 gibi ele alınır', () => {
    expect(toBase5Tiers(-5)).toEqual([]);
    expect(toBase5Tiers(3.9)).toEqual([{ tier: 0, key: 'dot', count: 3 }]);
  });
});
