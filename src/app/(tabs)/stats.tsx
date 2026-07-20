import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { AppText, Heading } from '@/components/atoms';
import { spacing, useTheme } from '@/theme';

// Yer tutucu — gerçek İstatistik ekranı issue #14'te gelir (DESIGN.md §3.2).
export default function StatsScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h1">Stats</Heading>
      <AppText color="textSecondary">Weekly chart and streak calendar are coming soon.</AppText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
});
