import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { OnboardingFooter } from '@/components/molecules';
import { SleepScienceChart } from '@/components/organisms';
import { useSettingsStore } from '@/stores';
import { spacing, useTheme } from '@/theme';

const benefits: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
  { icon: 'moon-outline', text: 'Lower ambient noise allows deeper cognitive processing.' },
  { icon: 'partly-sunny-outline', text: 'A natural alertness spike arrives with the dawn.' },
  { icon: 'leaf-outline', text: 'Quiet mornings foster a meditative state for prayer.' },
];

export default function OnboardingScienceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const setOnboardingDone = useSettingsStore((s) => s.setOnboardingDone);

  function skip() {
    setOnboardingDone(true);
    router.replace('/');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Heading variant="h1">Your brain at dawn</Heading>
        <AppText color="textSecondary" style={styles.subtitle}>
          The pre-dawn hours offer a unique state primed for focus and spiritual connection.
        </AppText>
        <View style={styles.chartGap}>
          <SleepScienceChart />
        </View>
        <View style={styles.benefits}>
          {benefits.map((b) => (
            <View key={b.icon} style={styles.benefitRow}>
              <Ionicons name={b.icon} size={16} color={colors.success} />
              <AppText variant="bodySmall" color="textSecondary" style={styles.benefitText}>
                {b.text}
              </AppText>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <Button
          title="See How It Works"
          variant="secondary"
          onPress={() => router.push('/onboarding/permissions')}
        />
        <OnboardingFooter activeIndex={1} total={4} onSkip={skip} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  chartGap: {
    marginTop: spacing.lg,
  },
  benefits: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  benefitText: {
    flex: 1,
  },
  footer: {
    gap: spacing.md,
  },
});
