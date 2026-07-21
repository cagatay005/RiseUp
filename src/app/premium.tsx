import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { useTranslation } from '@/i18n';
import { getPremiumProducts, startFreeTrial } from '@/services/IAPService';
import { usePremiumStore, type PremiumPlan } from '@/stores';
import { radius, rules, spacing, useTheme } from '@/theme';

/** DESIGN §7 — Premium/Paywall (issue #18). */
export default function PremiumScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const t = useTranslation();
  const isPremium = usePremiumStore((s) => s.isPremium);
  const plan = usePremiumStore((s) => s.plan);
  const trialEndsAt = usePremiumStore((s) => s.trialEndsAt);
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan>('yearly');
  const products = useMemo(() => getPremiumProducts(), []);
  const selectedProduct = products.find((p) => p.plan === selectedPlan);

  if (isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t.premium.close}>
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.centerFill}>
          <Ionicons name="diamond" size={40} color={colors.gold} />
          <Heading variant="h1" style={styles.center}>
            {t.premium.youArePremium}
          </Heading>
          <AppText color="textSecondary" style={styles.center}>
            {t.premium.planActive(plan === 'yearly' ? t.premium.yearly : t.premium.monthly)}
            {trialEndsAt ? t.premium.trialEnds(t.common.formatMonthDay(new Date(trialEndsAt))) : ''}.
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  function handleStartTrial() {
    startFreeTrial(selectedPlan);
    router.back();
  }

  const features: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { icon: 'camera-outline', label: t.premium.featureRugScan },
    { icon: 'mic-outline', label: t.premium.featureRecitation },
    { icon: 'snow-outline', label: t.premium.featureFreezes(rules.premiumMonthlyFreezes) },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t.premium.close}>
        <Ionicons name="close" size={22} color={colors.textSecondary} />
      </Pressable>

      <Heading variant="h1" style={styles.title}>
        {t.premium.title}
      </Heading>
      <AppText color="textSecondary" style={styles.subtitle}>
        {t.premium.subtitle}
      </AppText>

      <View style={styles.features}>
        {features.map((f) => (
          <View key={f.label} style={styles.featureRow}>
            <Ionicons name={f.icon} size={19} color={colors.secondary} />
            <AppText variant="bodySmall">{f.label}</AppText>
          </View>
        ))}
      </View>

      <View style={styles.plans}>
        {products.map((product) => {
          const selected = product.plan === selectedPlan;
          return (
            <Pressable
              key={product.plan}
              onPress={() => setSelectedPlan(product.plan)}
              accessibilityRole="button"
              style={[
                styles.planCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: selected ? colors.accent : colors.border,
                  borderWidth: selected ? 2 : 1,
                },
              ]}
            >
              {product.badge ? (
                <View style={[styles.badge, { backgroundColor: colors.gold }]}>
                  <AppText variant="caption" style={{ color: colors.onAccent, fontWeight: '700' }}>
                    {t.premium.saveBadge.toUpperCase()}
                  </AppText>
                </View>
              ) : null}
              <AppText variant="caption" color="textSecondary">
                {product.plan === 'yearly' ? t.premium.yearly : t.premium.monthly}
              </AppText>
              <AppText variant="h2" style={styles.planPrice}>
                {product.priceString}
              </AppText>
              <AppText variant="caption" color="textSecondary">
                {product.plan === 'yearly' ? t.premium.perYear : t.premium.perMonth}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button title={t.premium.startTrial} onPress={handleStartTrial} style={styles.fullWidth} />
        {selectedProduct ? (
          <AppText variant="caption" color="textSecondary" style={styles.legal}>
            {t.premium.legal(rules.trialDays, selectedProduct.priceString, selectedPlan === 'yearly' ? 'yr' : 'mo')}
          </AppText>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    marginTop: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  center: {
    textAlign: 'center',
  },
  features: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  plans: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  planCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  badge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  planPrice: {
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.xs,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  legal: {
    textAlign: 'center',
  },
});
