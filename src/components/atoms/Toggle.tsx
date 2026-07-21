import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function Toggle({ value, onValueChange }: ToggleProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={[
        styles.track,
        {
          backgroundColor: value ? colors.accent : colors.border,
          // Açıkken vurgu rengiyle hafif parlama — varsayılan Android mavisi yerine
          // markanın fecir turuncusu tüm etkileşimli kontrollerde tutarlı olsun diye.
          ...(value
            ? ({ boxShadow: `0 0 8px 1px ${colors.accent}66` } as object)
            : null),
        },
      ]}
    >
      <Pressable
        pointerEvents="none"
        style={[styles.thumb, value ? styles.thumbRight : styles.thumbLeft]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 40,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    top: 3,
  },
  thumbLeft: {
    left: 3,
  },
  thumbRight: {
    right: 3,
  },
});
