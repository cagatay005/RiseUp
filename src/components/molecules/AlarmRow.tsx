import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { AppText } from '@/components/atoms';
import { tasks, type TaskId } from '../../../design/tokens';
import type { Alarm } from '@/stores/alarmsStore';
import { prayers, type PrayerId } from '../../../design/tokens';
import { getAlarmClockTime } from '@/services/scheduleHelpers';
import type { PrayerTimes } from '@/stores/prayerStore';
import { radius, sizes, spacing, useTheme } from '@/theme';
import { Toggle } from '@/components/atoms';
import { TaskChip } from './TaskChip';

export interface AlarmRowProps {
  alarm: Alarm;
  todayTimes: PrayerTimes | null;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
}

function formatClock(date: Date | null): string {
  if (!date) return '--:--';
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export function AlarmRow({ alarm, todayTimes, onToggle, onDelete, onPress }: AlarmRowProps) {
  const { colors } = useTheme();
  const clockTime = getAlarmClockTime(alarm, todayTimes);
  const assignedTasks = tasks.filter((t) => alarm.taskIds.includes(t.id as TaskId));

  return (
    <Swipeable
      renderRightActions={() => (
        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete alarm"
          style={[styles.deleteAction, { backgroundColor: colors.warning }]}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
        </Pressable>
      )}
    >
      <Pressable
        onPress={onPress}
        style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={styles.topLine}>
          <View style={styles.timeBlock}>
            <AppText variant="body" style={styles.time}>
              {formatClock(clockTime)}
            </AppText>
            <AppText variant="caption" color="textSecondary">
              {prayers[alarm.prayerId as PrayerId].title}
            </AppText>
          </View>
          <Toggle value={alarm.enabled} onValueChange={onToggle} />
        </View>
        {assignedTasks.length > 0 ? (
          <View style={styles.chips}>
            {assignedTasks.map((t) => (
              <TaskChip key={t.id} task={t} />
            ))}
          </View>
        ) : null}
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: sizes.alarmRowHeight,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  deleteAction: {
    width: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
