import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

export function Dot({ active }: { active: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.dot, { backgroundColor: active ? colors.accent : colors.border }]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
