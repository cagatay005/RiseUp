import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Heading } from '@/components/atoms';
import { BadgeShelf } from '@/components/molecules';
import { AchievementCardGallery } from '@/components/organisms';
import { useTranslation } from '@/i18n';
import { useStreakStore } from '@/stores';
import { spacing, useTheme } from '@/theme';

/** DESIGN §3.2: başarı kartları + rozetler, iki yatay bölüm. */
export default function TrophiesScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const cards = useStreakStore((s) => s.cards);
  const earnedBadgeIds = useStreakStore((s) => s.earnedBadgeIds);

  // En yeni kazanım önce gösterilir; cards store'a kazanılma sırasıyla (eskiden yeniye) eklenir.
  const orderedCards = useMemo(() => [...cards].reverse(), [cards]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h1" style={styles.heading}>
        {t.trophies.yourAchievements}
      </Heading>

      <AchievementCardGallery cards={orderedCards} />

      <Heading variant="h2" style={styles.badgesHeading}>
        {t.trophies.badgesHeading}
      </Heading>
      <BadgeShelf earnedBadgeIds={earnedBadgeIds} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  heading: {
    paddingHorizontal: spacing.lg,
  },
  badgesHeading: {
    paddingHorizontal: spacing.lg,
  },
});
