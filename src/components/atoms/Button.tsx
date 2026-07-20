import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { radius, sizes, useTheme } from '@/theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  const { colors } = useTheme();

  const variantStyle: ViewStyle =
    variant === 'primary'
      ? { backgroundColor: colors.accent }
      : variant === 'secondary'
        ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.secondary }
        : { backgroundColor: 'transparent' };

  const textColor =
    variant === 'primary' ? colors.onAccent : variant === 'secondary' ? colors.textPrimary : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <AppText variant="button" style={{ color: textColor }}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: sizes.buttonHeight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
