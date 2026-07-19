import type { StyleProp, TextStyle } from 'react-native';

import { AppText, type AppTextProps } from './AppText';

const rtlStyle: StyleProp<TextStyle> = {
  writingDirection: 'rtl',
  textAlign: 'center',
};

export type ArabicTextProps = Omit<AppTextProps, 'variant'>;

/** Kur'an ayeti satırı — Amiri, sağdan sola. */
export function ArabicText({ style, ...rest }: ArabicTextProps) {
  return <AppText variant="ayah" style={[rtlStyle, style]} {...rest} />;
}
