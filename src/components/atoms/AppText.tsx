import { Text, type TextProps, type TextStyle } from 'react-native';

import { typography, useTheme, type ThemeColors } from '@/theme';

export interface AppTextProps extends TextProps {
  variant?: keyof typeof typography;
  color?: keyof ThemeColors;
}

export function AppText({ variant = 'body', color = 'textPrimary', style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  const { fontVariant, ...base } = typography[variant] as {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontVariant?: readonly string[];
  };

  const variantStyle: TextStyle = {
    ...base,
    color: colors[color],
    ...(fontVariant ? { fontVariant: [...fontVariant] as TextStyle['fontVariant'] } : null),
  };

  return <Text style={[variantStyle, style]} {...rest} />;
}
