import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components/atoms';
import { DigitalClock, OnboardingFooter } from '@/components/molecules';
import { refreshPrayerTimesIfStale } from '@/services/PrayerTimesService';
import { usePrayerStore, useSettingsStore } from '@/stores';
import { spacing, useTheme } from '@/theme';

export default function OnboardingFirstAlarmScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const setOnboardingDone = useSettingsStore((s) => s.setOnboardingDone);
  const todayTimes = usePrayerStore((s) => s.todayTimes);
  const cityName = usePrayerStore((s) => s.cityName);
  const locationGranted = useSettingsStore((s) => s.permissionsSnapshot.location === 'granted');

  useEffect(() => {
    void refreshPrayerTimesIfStale();
  }, []);

  const fajrTime = todayTimes ? new Date(todayTimes.fajr) : null;

  function complete() {
    setOnboardingDone(true);
    router.replace('/');
  }

  function setFirstAlarm() {
    // Onboarding'i bitirip Ev'e geçer, ardından Alarm kurma ekranını (TODO #7:
    // şimdilik yer tutucu, analog kadranla değişecek) üstüne açar — Save/geri
    // dönüşte kullanıcı doğal olarak Ev'de kalır.
    complete();
    router.push('/alarm-setup');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <AppText variant="body" color="textSecondary">
          Tomorrow&apos;s Fajr
        </AppText>
        <View style={styles.clockGap}>
          <DigitalClock time={fajrTime} />
        </View>
        <View style={styles.captionRow}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          <AppText variant="caption" color="textSecondary">
            {locationGranted
              ? cityName
                ? `Calculated for your location — ${cityName}`
                : 'Calculated for your location'
              : 'Grant location access to calculate your Fajr time'}
          </AppText>
        </View>
      </View>
      <View style={styles.footer}>
        <Button title="Set First Alarm" onPress={setFirstAlarm} />
        <OnboardingFooter activeIndex={3} total={4} onSkip={complete} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockGap: {
    marginTop: spacing.sm,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
  },
  footer: {
    gap: spacing.md,
  },
});
