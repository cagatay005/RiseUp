import { StyleSheet, View } from 'react-native';

import { TierSymbol } from '@/components/atoms';
import { toBase5Tiers } from '@/services/BadgeProgressService';
import { radius, spacing, useTheme } from '@/theme';

const EMPTY_SLOT_COUNT = 3;

export interface SymbolProgressRowProps {
  /** Rozetin ham ilerleme sayısı (ör. qiblaCompletions) — beşli tabana burada çevrilir. */
  count: number;
  size?: number;
}

/**
 * Rozet kartının altındaki dinamik ilerleme çarkı: sayı beşli tabana ayrılıp
 * (bkz. BadgeProgressService.toBase5Tiers) her basamak, o seviyenin sembolü
 * tekrar edilerek çizilir — "5 nokta → 1 hilal" birleşmesi ayrı bir animasyon
 * gerektirmez, taban dönüşümünün doğal sonucudur. Henüz hiç ilerleme yoksa
 * (count 0), üç soluk boş yuva gösterilir — kart "kilitli ama burada bir
 * şeyler birikecek" hissini boş bırakmadan verir.
 */
export function SymbolProgressRow({ count, size = 14 }: SymbolProgressRowProps) {
  const { colors } = useTheme();
  const tiers = toBase5Tiers(count);

  if (tiers.length === 0) {
    return (
      <View style={styles.row}>
        {Array.from({ length: EMPTY_SLOT_COUNT }, (_, i) => (
          <View
            key={i}
            style={[
              styles.emptySlot,
              { width: size * 0.55, height: size * 0.55, borderColor: colors.border },
            ]}
          />
        ))}
      </View>
    );
  }

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
  emptySlot: {
    borderRadius: radius.full,
    borderWidth: 1,
    opacity: 0.4,
  },
});
