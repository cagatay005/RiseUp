import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { rules, type PrayerId } from '../../design/tokens';
import { useTranslation } from '@/i18n';
import { formatMissedDate } from '@/services/scheduleHelpers';
import { useStreakStore } from '@/stores';
import { radius, spacing, useTheme } from '@/theme';

export default function QadaScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const t = useTranslation();
  const qadaLedger = useStreakStore((s) => s.qadaLedger);

  const sorted = useMemo(
    () => [...qadaLedger].sort((a, b) => a.missedDate.localeCompare(b.missedDate)),
    [qadaLedger],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </Pressable>
        <Heading variant="h2">{t.qada.title}</Heading>
        <View style={styles.headerSpacer} />
      </View>

      {sorted.length > 0 ? (
        <View style={[styles.warning, { backgroundColor: `${colors.warning}1F` }]}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
          <AppText variant="caption" style={[styles.warningText, { color: colors.warning }]}>
            {t.qada.warning(sorted.length, rules.qadaPerFreezeLoss)}
          </AppText>
          <Ionicons name="snow-outline" size={14} color={colors.warning} />
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.list}>
        {sorted.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle-outline" size={32} color={colors.success} />
            <AppText color="textSecondary" style={styles.center}>
              {t.qada.allCaughtUp}
            </AppText>
          </View>
        ) : (
          sorted.map((entry, i) => {
            const title = t.prayers[entry.prayerId as PrayerId]?.title ?? entry.prayerId;
            const featured = i === 0;
            return (
              <View
                key={entry.id}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.cardText}>
                  <AppText variant="body">{title}</AppText>
                  <AppText variant="caption" color="textSecondary">
                    {t.qada.missedDate(formatMissedDate(entry.missedDate, t.common.formatMonthDay))}
                  </AppText>
                </View>
                <Button
                  title={featured ? t.qada.makeUpNow : t.qada.makeUp}
                  variant={featured ? 'primary' : 'secondary'}
                  onPress={() =>
                    router.push({
                      pathname: '/qada-verify',
                      params: { qadaId: entry.id, prayerTitle: title },
                    })
                  }
                  style={styles.cardButton}
                />
              </View>
            );
          })
        )}
      </ScrollView>

      {sorted.length > 0 ? (
        <AppText variant="caption" color="textSecondary" style={styles.footnote}>
          {t.qada.footnote}
        </AppText>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 22,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  warningText: {
    flex: 1,
  },
  list: {
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  cardText: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  cardButton: {
    height: 34,
    paddingHorizontal: spacing.md,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  center: {
    textAlign: 'center',
  },
  footnote: {
    textAlign: 'center',
    paddingBottom: spacing.md,
  },
});
