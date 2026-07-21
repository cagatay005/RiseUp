import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms';
import { badges, type BadgeDef } from '../../../design/tokens';
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

/** DESIGN §3.3: kazanılan rozetler gold çerçeveli, kazanılmayanlar silüet (soluk border). */
export function BadgeShelf({ earnedBadgeIds }: BadgeShelfProps) {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {badges.map((badge) => {
        const earned = earnedBadgeIds.includes(badge.id);
        return (
          <View key={badge.id} style={[styles.item, { opacity: earned ? 1 : 0.45 }]}>
            <View style={[styles.circle, { borderColor: earned ? colors.gold : colors.border }]}>
              <Ionicons
                name={ICONS[badge.icon]}
                size={22}
                color={earned ? colors.gold : colors.textSecondary}
              />
            </View>
            <AppText variant="caption" color="textSecondary" style={styles.label}>
              {badge.title}
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
  label: {
    textAlign: 'center',
    fontSize: 9.5,
  },
});
