import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppText, Heading } from '@/components/atoms';
import { TaskAssignmentPanel } from '@/components/organisms';
import type { TaskId } from '../../design/tokens';
import { useAlarmsStore } from '@/stores';
import { spacing, useTheme } from '@/theme';

export default function TaskPickerScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ alarmId: string }>();
  const alarm = useAlarmsStore((s) => s.alarms.find((a) => a.id === params.alarmId));
  const setAlarmTasks = useAlarmsStore((s) => s.setAlarmTasks);

  if (!alarm) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <AppText color="textSecondary">Alarm not found.</AppText>
      </SafeAreaView>
    );
  }

  function toggleTask(taskId: TaskId) {
    if (!alarm) return;
    const next = alarm.taskIds.includes(taskId)
      ? alarm.taskIds.filter((id) => id !== taskId)
      : [...alarm.taskIds, taskId];
    setAlarmTasks(alarm.id, next);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </Pressable>
        <Heading variant="h2">Assign Tasks</Heading>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.panel}>
        <TaskAssignmentPanel selectedTaskIds={alarm.taskIds} onToggleTask={toggleTask} />
      </View>
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
  panel: {
    marginTop: spacing.xl,
  },
});
