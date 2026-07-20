import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Magnetometer } from 'expo-sensors';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { QuoteBlock } from '@/components/molecules';
import { CompassDial } from '@/components/organisms';
import { getDailyQuote } from '@/services/QuoteService';
import { angularDifference, getQiblaBearing, magnetometerHeading } from '@/services/QiblaService';
import { usePrayerStore } from '@/stores';
import { rules, spacing, useTheme } from '@/theme';

export default function QiblaTaskScreen() {
  const router = useRouter();
  const { alarmId } = useLocalSearchParams<{ alarmId?: string }>();
  const { colors } = useTheme();
  const location = usePrayerStore((s) => s.location);
  const [heading, setHeading] = useState(0);
  const [heldSeconds, setHeldSeconds] = useState(0);
  const quote = useMemo(() => getDailyQuote(), []);
  const bearing = location ? getQiblaBearing(location) : null;
  const aligned = bearing !== null && angularDifference(heading, bearing) <= rules.qiblaToleranceDegrees;

  useEffect(() => {
    Magnetometer.setUpdateInterval(150);
    const sub = Magnetometer.addListener(({ x, y }) => setHeading(magnetometerHeading(x, y)));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!aligned) {
      setHeldSeconds(0);
      return;
    }
    const timer = setInterval(() => setHeldSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [aligned]);

  useEffect(() => {
    if (heldSeconds >= rules.qiblaHoldSeconds) {
      // TODO(#9): Alarm çalma ekranı eklenince '/alarm-ring'e dönmeli.
      router.replace({ pathname: '/(tabs)', params: { alarmId, completedTask: 'qibla' } });
    }
  }, [alarmId, heldSeconds, router]);

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
        {Math.max(0, rules.qiblaHoldSeconds - heldSeconds)}
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
