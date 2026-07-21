import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Heading } from '@/components/atoms';
import {
  computeDailyStreakLengths,
  dayKeyOf,
  formatMonthYear,
  formatSince,
  getMonthMatrix,
  streakShadeOpacity,
} from '@/services/StatsService';
import { computeSuccessRate } from '@/services/StreakEngine';
import type { DayLog } from '@/stores/streakStore';
import { radius, spacing, useTheme, type ThemeColors } from '@/theme';

export interface StreakCalendarProps {
  dayLog: DayLog;
  startedAt: string | null;
}

const WEEKDAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** 0–1 opaklığı iki haneli hex'e çevirir (accent + alpha ile "koyulaşan dolgu", DESIGN §3.2). */
function opacityToHex(opacity: number): string {
  return Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
}

export function StreakCalendar({ dayLog, startedAt }: StreakCalendarProps) {
  const { colors } = useTheme();
  const today = new Date();
  const [viewed, setViewed] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const isCurrentMonth = viewed.year === today.getFullYear() && viewed.month === today.getMonth();
  const matrix = useMemo(() => getMonthMatrix(viewed.year, viewed.month), [viewed]);
  const streakLengths = useMemo(() => computeDailyStreakLengths(dayLog), [dayLog]);
  const successRate = computeSuccessRate(dayLog);

  function goToMonth(delta: number) {
    setViewed((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}>
          <Pressable onPress={() => goToMonth(-1)} accessibilityRole="button" accessibilityLabel="Previous month">
            <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
          </Pressable>
          <Heading variant="h2">{formatMonthYear(new Date(viewed.year, viewed.month, 1))}</Heading>
          <Pressable
            onPress={() => goToMonth(1)}
            disabled={isCurrentMonth}
            accessibilityRole="button"
            accessibilityLabel="Next month"
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isCurrentMonth ? colors.border : colors.textSecondary}
            />
          </Pressable>
        </View>

        <View style={styles.weekHeaderRow}>
          {WEEKDAY_HEADERS.map((letter, i) => (
            <AppText key={i} variant="caption" color="textSecondary" style={styles.weekHeaderCell}>
              {letter}
            </AppText>
          ))}
        </View>

        {matrix.map((week, rowIndex) => (
          <View key={rowIndex} style={styles.weekRow}>
            {week.map((date, colIndex) => {
              if (!date) return <View key={colIndex} style={styles.cell} />;

              const key = dayKeyOf(date);
              const status = dayLog[key];
              const isFuture = date.getTime() > today.getTime();

              let backgroundColor: string | undefined;
              let textColor: keyof ThemeColors = 'textSecondary';
              let borderColor = 'transparent';
              let frozen = false;

              if (!isFuture && status === 'frozen') {
                backgroundColor = colors.ice;
                textColor = 'textPrimary';
                frozen = true;
              } else if (!isFuture && status === 'done') {
                const opacity = streakShadeOpacity(streakLengths[key] ?? 0);
                backgroundColor = `${colors.accent}${opacityToHex(opacity)}`;
                textColor = opacity > 0.6 ? 'onAccent' : 'textPrimary';
              } else {
                borderColor = colors.border;
              }

              return (
                <View
                  key={colIndex}
                  style={[styles.cell, styles.dayCell, { backgroundColor, borderColor }]}
                >
                  <AppText variant="caption" color={textColor}>
                    {date.getDate()}
                  </AppText>
                  {frozen ? <Ionicons name="snow" size={8} color={colors.onAccent} /> : null}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <AppText variant="numberLarge" style={{ color: colors.accent }}>
          {successRate}%
        </AppText>
        <AppText color="textSecondary">success since {formatSince(startedAt)}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  weekHeaderRow: {
    flexDirection: 'row',
  },
  weekHeaderCell: {
    flex: 1,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
  },
  dayCell: {
    borderWidth: 1,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
});
