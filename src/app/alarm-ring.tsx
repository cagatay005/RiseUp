import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, Platform, Pressable, StyleSheet, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { prayers, tasks, type TaskId } from '../../design/tokens';
import { completeDay, giveUp } from '@/services/StreakEngine';
import { useAlarmsStore, useRingStore, useStreakStore } from '@/stores';
import { ForcedThemeProvider, radius, spacing, useTheme } from '@/theme';

const TASK_ICONS: Record<(typeof tasks)[number]['icon'], keyof typeof Ionicons.glyphMap> = {
  compass: 'compass-outline',
  camera: 'camera-outline',
  microphone: 'mic-outline',
};

const TASK_ROUTES: Record<TaskId, '/qibla-task' | '/rug-scan-task' | '/recitation-task'> = {
  qibla: '/qibla-task',
  rugScan: '/rug-scan-task',
  recitation: '/recitation-task',
};

/** Bildirimi kaldırınca alarm sesi de susar (ses bildirime aittir). */
function silenceNotification(alarmId: string): void {
  if (Platform.OS === 'web') return;
  void Notifications.dismissNotificationAsync(alarmId).catch(() => undefined);
}

export default function AlarmRingScreen() {
  return (
    <ForcedThemeProvider>
      <AlarmRingContent />
    </ForcedThemeProvider>
  );
}

function AlarmRingContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { alarmId } = useLocalSearchParams<{ alarmId?: string }>();
  const alarm = useAlarmsStore((s) => s.alarms.find((a) => a.id === alarmId));
  const completedTaskIds = useRingStore((s) => s.completedTaskIds);
  const startRing = useRingStore((s) => s.startRing);
  const clearRing = useRingStore((s) => s.clearRing);
  const freezes = useStreakStore((s) => s.freezes);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (alarmId) startRing(alarmId);
  }, [alarmId, startRing]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Kabul kriteri: geri tuşu görev/Give Up dışında çıkışa izin vermez.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, []),
  );

  // Bildirim sesi tek seferliktir; alarm hissini ekran odaktayken süren titreşim
  // verir. Görev ekranına geçince (blur) durur, görev iptalle dönülünce
  // (yeniden focus) kaldığı yerden başlar — DESIGN §4'teki dur/başla davranışı.
  useFocusEffect(
    useCallback(() => {
      Vibration.vibrate([600, 400], true);
      return () => Vibration.cancel();
    }, []),
  );

  const finishRing = useCallback(() => {
    if (alarmId) silenceNotification(alarmId);
    Vibration.cancel();
    clearRing();
    router.replace('/(tabs)');
  }, [alarmId, clearRing, router]);

  if (!alarm) {
    // Bayat bildirim (alarm silinmiş) ile açılırsa çıkışsız kalınmasın.
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar hidden />
        <View style={styles.centerFill}>
          <AppText color="textSecondary">This alarm no longer exists.</AppText>
          <Button title="Go Home" onPress={finishRing} style={styles.fullWidth} />
        </View>
      </SafeAreaView>
    );
  }

  const assignedTasks = alarm.taskIds
    .map((id) => tasks.find((t) => t.id === id))
    .filter((t): t is (typeof tasks)[number] => t !== undefined);
  const nextTask = assignedTasks.find((t) => !completedTaskIds.includes(t.id));

  const hours24 = now.getHours();
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const clock = `${hours12}:${String(now.getMinutes()).padStart(2, '0')}`;
  const meridiem = hours24 < 12 ? 'AM' : 'PM';

  function startNextTask() {
    if (!nextTask) return;
    // TODO(#13): görev tamamlanınca günü "done" işaretlemek StreakEngine'e gelecek.
    silenceNotification(alarm!.id);
    // push: görev iptal edilirse back ile bu ekrana dönülür ve titreşim sürer.
    router.push({ pathname: TASK_ROUTES[nextTask.id], params: { alarmId: alarm!.id } });
  }

  function confirmGiveUp() {
    const message =
      freezes > 0
        ? 'One streak freeze (−1 ❄) will be spent.'
        : 'You have no freezes left — your streak will reset to 0.';
    Alert.alert('Give up?', message, [
      { text: 'Keep Trying', style: 'cancel' },
      {
        text: 'Give Up',
        style: 'destructive',
        onPress: () => {
          giveUp();
          finishRing();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar hidden />

      <View style={styles.clockBlock}>
        <View style={styles.clockRow}>
          <AppText variant="clockDigital" style={{ color: colors.accent }}>
            {clock}
          </AppText>
          <AppText variant="bodySmall" color="textSecondary" style={styles.meridiem}>
            {meridiem}
          </AppText>
        </View>
        <Heading variant="h2" style={styles.center}>
          {prayers[alarm.prayerId].alarmMessage}
        </Heading>
      </View>

      <View style={styles.taskList}>
        {assignedTasks.map((task) => {
          const done = completedTaskIds.includes(task.id);
          const featured = task.id === nextTask?.id;
          return (
            <View
              key={task.id}
              style={[
                styles.taskCard,
                featured && styles.taskCardFeatured,
                {
                  backgroundColor: featured ? colors.surfaceElevated : colors.surface,
                  borderColor: featured ? colors.accent : colors.border,
                  opacity: done ? 0.55 : 1,
                },
              ]}
            >
              <Ionicons
                name={TASK_ICONS[task.icon]}
                size={featured ? 28 : 20}
                color={featured ? colors.accent : colors.secondary}
              />
              <AppText variant={featured ? 'body' : 'bodySmall'} style={styles.taskTitle}>
                {task.title}
              </AppText>
              {done ? <Ionicons name="checkmark-circle" size={20} color={colors.success} /> : null}
            </View>
          );
        })}
        {assignedTasks.length === 0 ? (
          <AppText color="textSecondary" style={styles.center}>
            No task assigned to this alarm.
          </AppText>
        ) : null}
      </View>

      <View style={styles.actions}>
        {nextTask ? (
          <Button title={`Start Task — ${nextTask.title}`} onPress={startNextTask} style={styles.fullWidth} />
        ) : (
          <Button
            title="Dismiss Alarm"
            onPress={() => {
              // Gün kredisi yalnız en az bir görev gerçekten tamamlandıysa yazılır
              // (görevsiz alarmı kapatmak seri saymaz — seri görev disiplinidir).
              if (completedTaskIds.length > 0) completeDay(alarm.prayerId);
              finishRing();
            }}
            style={styles.fullWidth}
          />
        )}
        {nextTask ? (
          <Pressable onPress={confirmGiveUp} accessibilityRole="button" style={styles.giveUpRow}>
            <AppText variant="bodySmall" color="textSecondary">
              Give Up
            </AppText>
            <AppText variant="bodySmall" style={{ color: colors.ice }}>
              −1
            </AppText>
            <Ionicons name="snow-outline" size={16} color={colors.ice} />
          </Pressable>
        ) : null}
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
  centerFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  clockBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  meridiem: {
    marginTop: spacing.sm,
  },
  center: {
    textAlign: 'center',
  },
  taskList: {
    gap: spacing.sm,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  taskCardFeatured: {
    padding: spacing.lg,
  },
  taskTitle: {
    flex: 1,
  },
  actions: {
    gap: spacing.md,
    alignItems: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  giveUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
});
