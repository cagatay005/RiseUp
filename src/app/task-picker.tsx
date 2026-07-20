import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppText, Heading } from '@/components/atoms';
import { tasks, type TaskId } from '../../design/tokens';
import { useAlarmsStore, usePremiumStore } from '@/stores';
import { radius, spacing, useTheme } from '@/theme';

export default function TaskPickerScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ alarmId: string }>();
  const alarm = useAlarmsStore((s) => s.alarms.find((a) => a.id === params.alarmId));
  const setAlarmTasks = useAlarmsStore((s) => s.setAlarmTasks);
  const isPremium = usePremiumStore((s) => s.isPremium);

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

      <View style={styles.list}>
        {tasks.map((task) => {
          // Premium olmayan görevler kilitli görünür ve dokunulamaz.
          // TODO(#18): kilitliye basınca Premium ekranına yönlendir (henüz yok).
          const locked = task.premium && !isPremium;
          const selected = alarm.taskIds.includes(task.id);

          return (
            <Pressable
              key={task.id}
              onPress={() => (locked ? undefined : toggleTask(task.id))}
              style={[
                styles.card,
                {
                  borderColor: selected ? colors.secondary : colors.border,
                  backgroundColor: colors.surface,
                  opacity: locked ? 0.5 : 1,
                },
              ]}
            >
              <Ionicons
                name={task.icon === 'compass' ? 'compass-outline' : task.icon === 'camera' ? 'camera-outline' : 'mic-outline'}
                size={22}
                color={colors.secondary}
              />
              <AppText variant="bodySmall" style={styles.cardTitle}>
                {task.title}
              </AppText>
              {locked ? (
                <Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />
              ) : selected ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              ) : null}
            </Pressable>
          );
        })}
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
  list: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  cardTitle: {
    flex: 1,
  },
});
