import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms';
import { spacing, useTheme, type ThemeColors } from '@/theme';

export interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  /** Sağda gösterilen kısa değer (ör. "English", "All granted"). */
  value?: string;
  valueColor?: keyof ThemeColors;
  /** Go Premium gibi tek `accent` vurgusu gereken satırlar için. */
  accent?: boolean;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

/** DESIGN §3.4: "Basit gruplu liste" — Ayarlar ekranının tekrar eden satır kalıbı. */
export function SettingsRow({
  icon,
  label,
  value,
  valueColor = 'textSecondary',
  accent = false,
  trailingIcon = 'chevron-forward',
  onPress,
}: SettingsRowProps) {
  const { colors } = useTheme();
  const tint = accent ? colors.accent : colors.secondary;

  return (
    <Pressable onPress={onPress} disabled={!onPress} accessibilityRole="button" style={styles.row}>
      <Ionicons name={icon} size={18} color={tint} />
      <AppText variant="bodySmall" style={accent ? { color: colors.accent, fontWeight: '500' } : undefined}>
        {label}
      </AppText>
      <View style={styles.spacer} />
      {value ? (
        <AppText variant="caption" color={valueColor} style={styles.value}>
          {value}
        </AppText>
      ) : null}
      {onPress ? <Ionicons name={trailingIcon} size={15} color={tint} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  spacer: {
    flex: 1,
  },
  value: {
    marginRight: spacing.xs,
  },
});
