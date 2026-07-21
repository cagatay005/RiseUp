import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/atoms';
import type { TaskDef } from '../../../design/tokens';
import { useTranslation } from '@/i18n';
import { radius, spacing, useTheme } from '@/theme';

const ICONS: Record<TaskDef['icon'], keyof typeof Ionicons.glyphMap> = {
  compass: 'compass-outline',
  camera: 'camera-outline',
  microphone: 'mic-outline',
};

export interface TaskChipProps {
  task: TaskDef;
  locked?: boolean;
  selected?: boolean;
  onPress?: () => void;
}

export function TaskChip({ task, locked, selected, onPress }: TaskChipProps) {
  const { colors } = useTheme();
  const t = useTranslation();

  return (
    <Pressable
      onPress={locked ? undefined : onPress}
      accessibilityRole="button"
      style={[
        styles.chip,
        {
          borderColor: selected ? colors.secondary : colors.border,
          opacity: locked ? 0.5 : 1,
        },
      ]}
    >
      <Ionicons name={ICONS[task.icon]} size={13} color={colors.textSecondary} />
      <AppText variant="caption" color="textSecondary">
        {t.tasks[task.id]}
      </AppText>
      {locked ? <Ionicons name="lock-closed-outline" size={11} color={colors.textSecondary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
});
