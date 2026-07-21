import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { spacing, useTheme } from '@/theme';

// Yer tutucu — gerçek Premium/Paywall ekranı issue #18'de gelir (DESIGN.md §7).
export default function PremiumScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h1">Go Premium</Heading>
      <AppText color="textSecondary" style={styles.center}>
        Plans, trial and purchase are coming soon.
      </AppText>
      <Button title="Back" variant="ghost" onPress={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  center: {
    textAlign: 'center',
  },
});
