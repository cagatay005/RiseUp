import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark, Button } from '@/components/atoms';
import { OnboardingFooter, QuoteBlock } from '@/components/molecules';
import { useTranslation } from '@/i18n';
import { getDailyQuote } from '@/services/QuoteService';
import { useSettingsStore } from '@/stores';
import { spacing, useTheme } from '@/theme';

export default function OnboardingQuoteScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const t = useTranslation();
  const setOnboardingDone = useSettingsStore((s) => s.setOnboardingDone);
  const quote = useMemo(() => getDailyQuote(), []);

  function skip() {
    setOnboardingDone(true);
    router.replace('/');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <BrandMark />
        <View style={styles.gap} />
        <QuoteBlock text={quote.text} attribution={quote.attribution} />
      </View>
      <View style={styles.footer}>
        <Button title={t.onboarding.quote.cta} onPress={() => router.push('/onboarding/science')} />
        <OnboardingFooter activeIndex={0} total={4} onSkip={skip} />
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gap: {
    height: spacing.xxl,
  },
  footer: {
    gap: spacing.md,
  },
});
