import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Heading } from '@/components/atoms';
import { prayers, type PrayerId } from '../../../design/tokens';
import type { PrayerTimes } from '@/stores/prayerStore';
import { formatCountdown, getNextPrayer } from '@/services/scheduleHelpers';
import { radius, spacing, useTheme } from '@/theme';

export function NextPrayerCountdown({ todayTimes }: { todayTimes: PrayerTimes | null }) {
  const { colors } = useTheme();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  const next = getNextPrayer(todayTimes, now);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Ionicons name="time-outline" size={18} color={colors.secondary} />
      {next ? (
        <>
          <Heading variant="h2" style={styles.name}>
            {prayers[next.prayerId as PrayerId].title}
          </Heading>
          <AppText variant="bodySmall" color="textSecondary" style={styles.countdown}>
            in {formatCountdown(next.time, now)}
          </AppText>
        </>
      ) : (
        <AppText variant="bodySmall" color="textSecondary" style={styles.countdown}>
          Grant location access to see your next prayer
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  name: {
    marginLeft: 0,
  },
  countdown: {
    marginLeft: 'auto',
  },
});
