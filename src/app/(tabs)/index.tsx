import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { AlarmRow, FreezeCounter, NextPrayerCountdown, StreakFlame } from '@/components/molecules';
import { useTranslation } from '@/i18n';
import { PRAYER_IDS_IN_ORDER, refreshPrayerTimesIfStale } from '@/services/PrayerTimesService';
import { useAlarmsStore, usePrayerStore, useSettingsStore, useStreakStore } from '@/stores';
import { radius, spacing, useTheme } from '@/theme';

// (tabs) grubu URL segmenti eklemediği için index.tsx zaten kökte ("/") yaşar —
// bu yüzden onboarding kapısı ayrı bir kök dosya yerine burada, en üstte kontrol edilir.
export default function HomeScreen() {
  const onboardingDone = useSettingsStore((s) => s.onboardingDone);
  if (!onboardingDone) {
    return <Redirect href="/onboarding/quote" />;
  }
  return <HomeContent />;
}

function HomeContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const t = useTranslation();

  const alarms = useAlarmsStore((s) => s.alarms);
  const toggleAlarm = useAlarmsStore((s) => s.toggleAlarm);
  const removeAlarm = useAlarmsStore((s) => s.removeAlarm);

  const todayTimes = usePrayerStore((s) => s.todayTimes);
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const bestStreak = useStreakStore((s) => s.bestStreak);
  const freezes = useStreakStore((s) => s.freezes);
  const missedCount = useStreakStore((s) => s.qadaLedger.length);

  useEffect(() => {
    void refreshPrayerTimesIfStale();
  }, []);

  const sortedAlarms = useMemo(
    () =>
      [...alarms].sort(
        (a, b) => PRAYER_IDS_IN_ORDER.indexOf(a.prayerId) - PRAYER_IDS_IN_ORDER.indexOf(b.prayerId),
      ),
    [alarms],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topRow}>
        <Heading variant="h2">RiseUp</Heading>
        <FreezeCounter freezes={freezes} />
      </View>

      <StreakFlame bestStreak={bestStreak} currentStreak={currentStreak} />

      <View style={styles.gapMd}>
        <NextPrayerCountdown todayTimes={todayTimes} />
      </View>

      {missedCount > 0 ? (
        <Pressable
          onPress={() => router.push('/qada')}
          accessibilityRole="button"
          style={[styles.qadaStrip, { backgroundColor: `${colors.warning}1F` }]}
        >
          <Ionicons name="alert-circle-outline" size={14} color={colors.warning} />
          <AppText variant="caption" style={{ color: colors.warning }}>
            {t.home.missedPrayers(missedCount)}
          </AppText>
        </Pressable>
      ) : null}

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {sortedAlarms.length === 0 ? (
          <View style={styles.empty}>
            <AppText color="textSecondary">{t.home.noAlarmsYet}</AppText>
            <Button title={t.home.addAlarm} variant="secondary" onPress={() => router.push('/alarm-setup')} />
          </View>
        ) : (
          sortedAlarms.map((alarm) => (
            <AlarmRow
              key={alarm.id}
              alarm={alarm}
              todayTimes={todayTimes}
              onToggle={() => toggleAlarm(alarm.id)}
              onDelete={() => removeAlarm(alarm.id)}
              onPress={() => router.push({ pathname: '/task-picker', params: { alarmId: alarm.id } })}
            />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/alarm-setup')}
        accessibilityRole="button"
        accessibilityLabel={t.home.addAlarmLabel}
        style={[
          styles.fab,
          {
            backgroundColor: colors.accent,
            // Varsayılan Android beyazı/mavisi yerine markanın vurgu rengiyle parlıyor.
            boxShadow: `0 4px 16px 0 ${colors.accent}80`,
          } as object,
        ]}
      >
        <Ionicons name="add" size={26} color={colors.onAccent} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gapMd: {
    marginTop: spacing.lg,
  },
  qadaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  list: {
    marginTop: spacing.md,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
