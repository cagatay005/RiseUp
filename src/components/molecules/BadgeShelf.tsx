import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms';
import { badges, type BadgeDef } from '../../../design/tokens';
import { useTranslation } from '@/i18n';
import { radius, spacing, useTheme } from '@/theme';

const ICONS: Record<BadgeDef['icon'], keyof typeof Ionicons.glyphMap> = {
  flame: 'flame',
  compass: 'compass',
  sunny: 'sunny',
  mic: 'mic',
  people: 'people',
};

export interface BadgeShelfProps {
  earnedBadgeIds: string[];
}

/**
 * DESIGN §3.3: kazanılan rozetler markanın "ateş" vurgu rengiyle (gold/accent)
 * parlar; kazanılmayanlar kesik çizgili çerçeve + küçük kilit rozetiyle
 * oyunlaştırma hissini güçlendirir ("henüz kilitli, hedefin bu" okunması net olsun diye).
 */
export function BadgeShelf({ earnedBadgeIds }: BadgeShelfProps) {
  const { colors } = useTheme();
  const t = useTranslation();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {badges.map((badge) => {
        const earned = earnedBadgeIds.includes(badge.id);
        return (
          <View key={badge.id} style={styles.item}>
            <View
              style={[
                styles.circle,
                earned
                  ? {
                      borderStyle: 'solid',
                      borderColor: colors.gold,
                      backgroundColor: `${colors.accent}1F`,
                      boxShadow: `0 0 12px 1px ${colors.gold}80`,
                    }
                  : { borderStyle: 'dashed', borderColor: colors.border },
              ] as object[]}
            >
              <Ionicons
                name={ICONS[badge.icon]}
                size={22}
                color={earned ? colors.gold : colors.textSecondary}
                style={!earned ? styles.lockedIcon : undefined}
              />
              {!earned ? (
                <View style={[styles.lockBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Ionicons name="lock-closed" size={10} color={colors.textSecondary} />
                </View>
              ) : null}
            </View>
            <AppText
              variant="caption"
              color={earned ? 'textPrimary' : 'textSecondary'}
              style={styles.label}
            >
              {t.badges[badge.id as keyof typeof t.badges] ?? badge.title}
            </AppText>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  item: {
    alignItems: 'center',
    gap: spacing.xs,
    width: 64,
  },
  circle: {
    width: 54,
    height: 54,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedIcon: {
    opacity: 0.55,
  },
  lockBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: 9.5,
  },
});
