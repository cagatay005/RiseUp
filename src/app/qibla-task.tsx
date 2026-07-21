import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { QuoteBlock } from '@/components/molecules';
import { CompassDial } from '@/components/organisms';
import { useQiblaHold } from '@/hooks/useQiblaHold';
import { getDailyQuote } from '@/services/QuoteService';
import { recordQiblaCompletion } from '@/services/StreakEngine';
import { usePrayerStore, useRingStore } from '@/stores';
import { rules, spacing, useTheme } from '@/theme';

export default function QiblaTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const location = usePrayerStore((s) => s.location);
  const quote = useMemo(() => getDailyQuote(), []);
  const { bearing, heading, aligned, done, secondsRemaining } = useQiblaHold(location);

  useEffect(() => {
    if (done) {
      recordQiblaCompletion();
      // Alarm çalma ekranından push ile gelindi: tamamlanma ringStore'a yazılır,
      // back ile çalma ekranına dönülür (o ekran sıradaki görevi gösterir).
      useRingStore.getState().completeTask('qibla');
      router.back();
    }
  }, [done, router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h2" style={styles.center}>Rotate your phone to find Qibla</Heading>
      <AppText color="textSecondary" style={styles.center}>
        Hold your phone in the right direction for {rules.qiblaHoldSeconds} seconds
      </AppText>
      <View style={styles.dial}>
        {bearing === null ? (
          <View style={[styles.unavailable, { borderColor: colors.border }]}>
            <Ionicons name="location-outline" size={26} color={colors.secondary} />
            <AppText color="textSecondary">Location is needed to calculate Qibla.</AppText>
          </View>
        ) : <CompassDial heading={heading} targetBearing={bearing} aligned={aligned} />}
      </View>
      <AppText variant="numberLarge" style={[styles.countdown, { color: aligned ? colors.success : colors.accent }]}>
        {secondsRemaining}
      </AppText>
      <QuoteBlock text={quote.text} compact />
      <Button title="Cancel task" variant="ghost" onPress={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  center: { textAlign: 'center' },
  dial: { flex: 1, justifyContent: 'center' },
  countdown: { textAlign: 'center' },
  unavailable: { alignItems: 'center', borderWidth: 1, borderRadius: 12, gap: spacing.sm, padding: spacing.lg },
});
