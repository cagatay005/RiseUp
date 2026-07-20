import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { AppText, Heading } from '@/components/atoms';
import { spacing, useTheme } from '@/theme';

// Yer tutucu — gerçek Ayarlar ekranı issue #16'da gelir (DESIGN.md §3.4).
export default function SettingsScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h1">Settings</Heading>
      <AppText color="textSecondary">Language, premium and theme controls are coming soon.</AppText>
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
