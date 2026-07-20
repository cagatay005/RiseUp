import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { OnboardingFooter, PermissionRow } from '@/components/molecules';
import { openSystemSettings, requestNotificationPermission } from '@/services/PermissionsService';
import { requestLocationPermission } from '@/services/PrayerTimesService';
import { useSettingsStore } from '@/stores';
import { spacing, useTheme } from '@/theme';

export default function OnboardingPermissionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const setOnboardingDone = useSettingsStore((s) => s.setOnboardingDone);
  const snapshot = useSettingsStore((s) => s.permissionsSnapshot);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    // Ekran açılır açılmaz native izin diyalogları tetiklenir (DESIGN.md §2.3).
    void requestLocationPermission();
    void requestNotificationPermission();
  }, []);

  const allGranted = snapshot.location === 'granted' && snapshot.notifications === 'granted';
  // İlk basışta izinler istenir; sonuç ne olursa olsun (DESIGN.md §2.3: "İzin
  // verilmese de Continue ile geçilebilir") ikinci basış ilerletir.
  const canContinue = allGranted || attempted;

  function handleLocationPress() {
    if (snapshot.location === 'denied') openSystemSettings();
    else void requestLocationPermission();
  }

  function handleNotificationsPress() {
    if (snapshot.notifications === 'denied') openSystemSettings();
    else void requestNotificationPermission();
  }

  async function handlePrimaryPress() {
    if (canContinue) {
      router.push('/onboarding/first-alarm');
      return;
    }
    await Promise.all([requestLocationPermission(), requestNotificationPermission()]);
    setAttempted(true);
  }

  function skip() {
    setOnboardingDone(true);
    router.replace('/');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Heading variant="h1">Two permissions, one habit</Heading>
        <View style={styles.rows}>
          <PermissionRow
            icon="location-outline"
            title="Location Access"
            subtitle="To calculate prayer times for your city"
            status={snapshot.location}
            onPress={handleLocationPress}
          />
          <PermissionRow
            icon="notifications-outline"
            title="Notifications & Critical Alerts"
            subtitle="So your alarm rings even in silent mode"
            status={snapshot.notifications}
            onPress={handleNotificationsPress}
          />
        </View>
        <AppText variant="caption" color="textSecondary" style={styles.reason}>
          RiseUp uses your location only to compute prayer times on your device. Critical
          alerts let your alarm break through silent mode. Nothing leaves your phone.
        </AppText>
      </View>
      <View style={styles.footer}>
        <Button title={canContinue ? 'Continue' : 'Grant Permissions'} onPress={handlePrimaryPress} />
        <OnboardingFooter activeIndex={2} total={4} onSkip={skip} />
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
  content: {
    flex: 1,
  },
  rows: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  reason: {
    marginTop: spacing.lg,
    lineHeight: 18,
  },
  footer: {
    gap: spacing.md,
  },
});
