import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { CompassDial } from '@/components/organisms';
import { useQiblaHold } from '@/hooks/useQiblaHold';
import { useTranslation } from '@/i18n';
import { completeQada, recordQiblaCompletion } from '@/services/StreakEngine';
import { usePrayerStore } from '@/stores';
import { rules, spacing, useTheme } from '@/theme';

/**
 * Kaza defterindeki bir girişi kılmanın mini doğrulaması (DESIGN §8: "vakit
 * dışı bir mini görev akışıyla — kıble görevi — doğrular"). Alarm görevinden
 * farkı: ringStore'a değil doğrudan completeQada(qadaId)'ya yazması.
 */
export default function QadaVerifyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const t = useTranslation();
  const { qadaId, prayerTitle } = useLocalSearchParams<{ qadaId: string; prayerTitle?: string }>();
  const location = usePrayerStore((s) => s.location);
  const { bearing, heading, aligned, done, secondsRemaining } = useQiblaHold(location);

  useEffect(() => {
    if (done && qadaId) {
      recordQiblaCompletion();
      completeQada(qadaId);
      router.back();
    }
  }, [done, qadaId, router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h2" style={styles.center}>
        {t.qadaVerify.title(prayerTitle ?? t.qadaVerify.yourPrayer)}
      </Heading>
      <AppText color="textSecondary" style={styles.center}>
        {t.qadaVerify.instructions(rules.qiblaHoldSeconds)}
      </AppText>
      <View style={styles.dial}>
        {bearing === null ? (
          <View style={[styles.unavailable, { borderColor: colors.border }]}>
            <Ionicons name="location-outline" size={26} color={colors.secondary} />
            <AppText color="textSecondary">{t.qadaVerify.locationNeeded}</AppText>
          </View>
        ) : (
          <CompassDial heading={heading} targetBearing={bearing} aligned={aligned} />
        )}
      </View>
      <AppText variant="numberLarge" style={[styles.countdown, { color: aligned ? colors.success : colors.accent }]}>
        {secondsRemaining}
      </AppText>
      <Button title={t.qadaVerify.cancel} variant="ghost" onPress={() => router.back()} />
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
