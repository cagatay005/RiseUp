import { StyleSheet, View } from 'react-native';

import { TierSymbol } from '@/components/atoms';
import { toBase5Tiers } from '@/services/BadgeProgressService';
import { spacing } from '@/theme';

export interface SymbolProgressRowProps {
  /** Rozetin ham ilerleme sayısı (ör. qiblaCompletions) — beşli tabana burada çevrilir. */
  count: number;
  size?: number;
}

/**
 * Rozet kartının altındaki dinamik ilerleme çarkı: sayı beşli tabana ayrılıp
 * (bkz. BadgeProgressService.toBase5Tiers) her basamak, o seviyenin sembolü
 * tekrar edilerek çizilir — "5 nokta → 1 hilal" birleşmesi ayrı bir animasyon
 * gerektirmez, taban dönüşümünün doğal sonucudur.
 */
export function SymbolProgressRow({ count, size = 14 }: SymbolProgressRowProps) {
  const tiers = toBase5Tiers(count);

  if (tiers.length === 0) return null;

  return (
    <View style={styles.row}>
      {tiers.map((tier) => (
        <View key={tier.key} style={styles.group}>
          {Array.from({ length: tier.count }, (_, i) => (
            <TierSymbol key={i} tierKey={tier.key} size={size} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
