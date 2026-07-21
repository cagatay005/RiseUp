import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms';
import { tasks, type TaskId } from '../../../design/tokens';
import { useTranslation } from '@/i18n';
import { usePremiumStore } from '@/stores';
import { radius, spacing, useTheme } from '@/theme';

const ICONS: Record<(typeof tasks)[number]['icon'], keyof typeof Ionicons.glyphMap> = {
  compass: 'compass-outline',
  camera: 'camera-outline',
  microphone: 'mic-outline',
};

export interface TaskAssignmentPanelProps {
  selectedTaskIds: TaskId[];
  onToggleTask: (id: TaskId) => void;
}

/**
 * Ev (task-picker.tsx) ve Alarm kurma ekranında (alarm-setup.tsx) aynı bileşen
 * kullanılır (DESIGN.md §5: "Görev atama bölümü — Ev ekranındakiyle aynı bileşen").
 * Premium olmayan görevler kilitli — dokununca Premium ekranına yönlendirir.
 */
export function TaskAssignmentPanel({ selectedTaskIds, onToggleTask }: TaskAssignmentPanelProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const t = useTranslation();
  const isPremium = usePremiumStore((s) => s.isPremium);

  return (
    <View style={styles.list}>
      {tasks.map((task) => {
        const locked = task.premium && !isPremium;
        const selected = selectedTaskIds.includes(task.id);

        return (
          <Pressable
            key={task.id}
            onPress={() => (locked ? router.push('/premium') : onToggleTask(task.id))}
            style={[
              styles.card,
              {
                borderColor: selected ? colors.secondary : colors.border,
                backgroundColor: colors.surface,
                opacity: locked ? 0.5 : 1,
              },
            ]}
          >
            <Ionicons name={ICONS[task.icon]} size={22} color={colors.secondary} />
            <AppText variant="bodySmall" style={styles.cardTitle}>
              {t.tasks[task.id]}
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
  );
}

const styles = StyleSheet.create({
  list: {
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
