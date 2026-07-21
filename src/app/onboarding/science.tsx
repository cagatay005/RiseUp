import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { OnboardingFooter } from '@/components/molecules';
import { SleepScienceChart } from '@/components/organisms';
import { useTranslation } from '@/i18n';
import { useSettingsStore } from '@/stores';
import { spacing, useTheme } from '@/theme';

export default function OnboardingScienceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const t = useTranslation();
  const setOnboardingDone = useSettingsStore((s) => s.setOnboardingDone);
  const benefits: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
    { icon: 'moon-outline', text: t.onboarding.science.benefit1 },
    { icon: 'partly-sunny-outline', text: t.onboarding.science.benefit2 },
    { icon: 'leaf-outline', text: t.onboarding.science.benefit3 },
  ];

  function skip() {
    setOnboardingDone(true);
    router.replace('/');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Heading variant="h1">{t.onboarding.science.title}</Heading>
        <AppText color="textSecondary" style={styles.subtitle}>
          {t.onboarding.science.subtitle}
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
          title={t.onboarding.science.cta}
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
