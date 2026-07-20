import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import {
  DigitalTimePicker,
  TaskAssignmentPanel,
  type DigitalTimePickerHandle,
} from '@/components/organisms';
import { prayers, type PrayerId, type TaskId } from '../../design/tokens';
import { computeOffsetMinutes, getPickerBaseTime } from '@/services/scheduleHelpers';
import { useAlarmsStore, usePrayerStore } from '@/stores';
import { ForcedThemeProvider, radius, spacing, useTheme } from '@/theme';

const PRAYER_IDS: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function AlarmSetupScreen() {
  return (
    <ForcedThemeProvider name="dark">
      <AlarmSetupContent />
    </ForcedThemeProvider>
  );
}

function AlarmSetupContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const addAlarm = useAlarmsStore((s) => s.addAlarm);
  const todayTimes = usePrayerStore((s) => s.todayTimes);

  const [selectedPrayer, setSelectedPrayer] = useState<PrayerId>('fajr');
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  const [taskIds, setTaskIds] = useState<TaskId[]>([]);
  const timePickerRef = useRef<DigitalTimePickerHandle>(null);

  // Vaktin taban zamanı yalnız seçilen vakit/vakitler değişince yeniden hesaplanır;
  // "now" burada sabit tutulur ki dijital saatteki her seçim baz zamanı kaydırmasın.
  const baseTime = useMemo(
    () => getPickerBaseTime(selectedPrayer, todayTimes, new Date()),
    [selectedPrayer, todayTimes],
  );
  const displayTime = useMemo(
    () => new Date(baseTime.getTime() + offsetMinutes * 60_000),
    [baseTime, offsetMinutes],
  );

  function selectPrayer(id: PrayerId) {
    setSelectedPrayer(id);
    setOffsetMinutes(0); // vakit değişince saat o vaktin taban zamanına döner
  }

  function changeTime(picked: Date) {
    setOffsetMinutes(computeOffsetMinutes(baseTime, picked));
  }

  function toggleTask(taskId: TaskId) {
    setTaskIds((current) =>
      current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId],
    );
  }

  function save() {
    addAlarm({ prayerId: selectedPrayer, offsetMinutes, taskIds });
    router.back();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </Pressable>
        <Heading variant="h2">New Alarm</Heading>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.centered}>
          <AppText variant="bodySmall" color="textSecondary" style={styles.prayerLabel}>
            {prayers[selectedPrayer].title}
          </AppText>
          <DigitalTimePicker ref={timePickerRef} value={displayTime} onChange={changeTime} />

          <View style={styles.chips}>
            {PRAYER_IDS.map((id) => {
              const active = id === selectedPrayer;
              return (
                <Pressable
                  key={id}
                  onPress={() => selectPrayer(id)}
                  style={[
                    styles.chip,
                    {
                      borderColor: active ? colors.secondary : colors.border,
                      backgroundColor: colors.surfaceElevated,
                    },
                  ]}
                >
                  <AppText variant="bodySmall">{prayers[id].title}</AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <AppText variant="caption" color="textSecondary" style={styles.taskLabel}>
          TASKS
        </AppText>
        <TaskAssignmentPanel selectedTaskIds={taskIds} onToggleTask={toggleTask} />
      </ScrollView>

      <Button
        title="Set Alarm"
        variant="secondary"
        onPress={() => timePickerRef.current?.open()}
        style={styles.setAlarm}
      />
      <Button title="Save Alarm" onPress={save} style={styles.save} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 22,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  centered: {
    alignItems: 'center',
  },
  prayerLabel: {
    marginTop: spacing.lg,
    letterSpacing: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
    justifyContent: 'center',
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  taskLabel: {
    letterSpacing: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  setAlarm: {
    marginTop: spacing.md,
    alignSelf: 'stretch',
  },
  save: {
    marginTop: spacing.sm,
    alignSelf: 'stretch',
  },
});
