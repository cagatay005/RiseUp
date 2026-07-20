import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms';
import type { PermissionState } from '@/stores/settingsStore';
import { radius, spacing, useTheme } from '@/theme';

export interface PermissionRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  status: PermissionState;
  onPress: () => void;
}

export function PermissionRow({ icon, title, subtitle, status, onPress }: PermissionRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Ionicons name={icon} size={20} color={colors.secondary} />
      <View style={styles.textBlock}>
        <AppText variant="bodySmall" style={{ fontWeight: '500' as const }}>
          {title}
        </AppText>
        <AppText variant="caption" color="textSecondary">
          {subtitle}
        </AppText>
      </View>
      {status === 'granted' ? (
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
});
