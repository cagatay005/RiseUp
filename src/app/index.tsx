import { Redirect } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, ArabicText, Heading } from '@/components/atoms';
import { useSettingsStore } from '@/stores';
import { spacing, useTheme } from '@/theme';

// Kök yönlendirme kapısı: onboarding bitmemişse oraya gönderir (DESIGN.md §2).
// Bittiyse geçici bir vitrin gösterir — gerçek Ev ekranı issue #6'da bunun yerini alır.
export default function Index() {
  const onboardingDone = useSettingsStore((s) => s.onboardingDone);

  if (!onboardingDone) {
    return <Redirect href="/onboarding/quote" />;
  }

  return <HomePlaceholder />;
}

function HomePlaceholder() {
  const { colors, themeName, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <Heading variant="h1">RiseUp</Heading>
      <Heading variant="quote" style={styles.quote}>
        The success of your day is decided before the sun rises.
      </Heading>
      <AppText color="textSecondary">Inter body — arayüz metni 0123456789</AppText>
      <ArabicText>قُلْ هُوَ ٱللَّهُ أَحَدٌ</ArabicText>
      <Pressable
        onPress={toggleTheme}
        style={[styles.toggle, { backgroundColor: colors.accent }]}
        accessibilityRole="button"
      >
        <AppText variant="button" style={{ color: colors.onAccent }}>
          {themeName === 'light' ? 'Karanlık temaya geç' : 'Aydınlık temaya geç'}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
  },
  quote: {
    textAlign: 'center',
  },
  toggle: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
