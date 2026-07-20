import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { AppText, Heading } from '@/components/atoms';
import { spacing, useTheme } from '@/theme';

// Yer tutucu — gerçek Kupa ekranı issue #15'te gelir (DESIGN.md §3.3).
export default function TrophiesScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h1">Trophies</Heading>
      <AppText color="textSecondary">Achievement cards and badges are coming soon.</AppText>
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
