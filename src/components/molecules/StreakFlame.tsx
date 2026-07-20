import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms';
import { useTheme } from '@/theme';

/** DESIGN.md §3.1: en yüksek seri sayısını gösterir; alevin rengi aktif seri olup olmadığını yansıtır. */
export function StreakFlame({ bestStreak, currentStreak }: { bestStreak: number; currentStreak: number }) {
  const { colors } = useTheme();
  const flameColor = currentStreak > 0 ? colors.accent : colors.border;

  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={40} color={flameColor} />
      <AppText variant="numberLarge">{bestStreak}</AppText>
      <AppText variant="caption" color="textSecondary">
        Day Streak
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
