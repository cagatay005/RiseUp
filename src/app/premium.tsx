import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { getPremiumProducts, startFreeTrial } from '@/services/IAPService';
import { MONTH_NAMES } from '@/services/scheduleHelpers';
import { usePremiumStore, type PremiumPlan } from '@/stores';
import { radius, rules, spacing, useTheme } from '@/theme';

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'camera-outline', label: 'Prayer Rug Scan task' },
  { icon: 'mic-outline', label: 'Verse Recitation task with scoring' },
  { icon: 'snow-outline', label: `${rules.premiumMonthlyFreezes} streak freezes every month` },
];

function formatTrialEnd(iso: string): string {
  const d = new Date(iso);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

/** DESIGN §7 — Premium/Paywall (issue #18). */
export default function PremiumScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const isPremium = usePremiumStore((s) => s.isPremium);
  const plan = usePremiumStore((s) => s.plan);
  const trialEndsAt = usePremiumStore((s) => s.trialEndsAt);
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan>('yearly');
  const products = useMemo(() => getPremiumProducts(), []);
  const selectedProduct = products.find((p) => p.plan === selectedPlan);

  if (isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Close">
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.centerFill}>
          <Ionicons name="diamond" size={40} color={colors.gold} />
          <Heading variant="h1" style={styles.center}>
            You're Premium
          </Heading>
          <AppText color="textSecondary" style={styles.center}>
            {plan === 'yearly' ? 'Yearly' : 'Monthly'} plan is active
            {trialEndsAt ? ` — trial ends ${formatTrialEnd(trialEndsAt)}` : ''}.
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  function handleStartTrial() {
    startFreeTrial(selectedPlan);
    router.back();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Close">
        <Ionicons name="close" size={22} color={colors.textSecondary} />
      </Pressable>

      <Heading variant="h1" style={styles.title}>
        Unlock your full practice
      </Heading>
      <AppText color="textSecondary" style={styles.subtitle}>
        Deepen every task and protect your streak.
      </AppText>

      <View style={styles.features}>
        {FEATURES.map((f) => (
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
                    {product.badge.toUpperCase()}
                  </AppText>
                </View>
              ) : null}
              <AppText variant="caption" color="textSecondary">
                {product.plan === 'yearly' ? 'Yearly' : 'Monthly'}
              </AppText>
              <AppText variant="h2" style={styles.planPrice}>
                {product.priceString}
              </AppText>
              <AppText variant="caption" color="textSecondary">
                {product.plan === 'yearly' ? 'per year' : 'per month'}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button title="Start 7-Day Free Trial" onPress={handleStartTrial} style={styles.fullWidth} />
        {selectedProduct ? (
          <AppText variant="caption" color="textSecondary" style={styles.legal}>
            Free for {rules.trialDays} days, then {selectedProduct.priceString}
            {selectedPlan === 'yearly' ? '/yr' : '/mo'}. Cancel anytime.
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
