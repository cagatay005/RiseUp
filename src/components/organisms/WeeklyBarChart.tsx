import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { AppText } from '@/components/atoms';
import { PrayerTimeStrip } from '@/components/molecules';
import {
  dayKeyOf,
  formatWeekRangeLabel,
  getWeekDays,
  startOfWeekMonday,
  weekdayLetter,
} from '@/services/StatsService';
import { usePrayerStore } from '@/stores';
import type { DayLog } from '@/stores/streakStore';
import { radius, spacing, useTheme } from '@/theme';

/** Geriye kaç hafta gidilebilir (bugünün haftası dahil pencere WEEKS_BACK+1). */
const WEEKS_BACK = 11;
const BAR_MAX_HEIGHT = 110;
const BAR_MIN_HEIGHT = 14;

export interface WeeklyBarChartProps {
  dayLog: DayLog;
}

/**
 * DESIGN §3.2 sayfa 1. Kabul kriteri gereği (issue #15: "ekstra state yok")
 * yalnız dayLog'daki done/frozen/missed durumundan türetilir — DESIGN.md'nin
 * betimlediği "gün başına 0–5 vakit sayısı" için ayrı bir sayaç TUTULMAZ; bir
 * gün ya tamamen dolu (done), buzlu (frozen) ya da boş (missed/hiç kayıt yok)
 * gösterilir. Alt yazı bu basitleştirmeyi yansıtacak şekilde güncellendi.
 */
export function WeeklyBarChart({ dayLog }: WeeklyBarChartProps) {
  const { colors } = useTheme();
  const todayTimes = usePrayerStore((s) => s.todayTimes);
  const scrollRef = useRef<ScrollView>(null);
  const [width, setWidth] = useState(0);
  const [pageIndex, setPageIndex] = useState(WEEKS_BACK);

  const today = new Date();
  const currentWeekStart = startOfWeekMonday(today);
  const todayKey = dayKeyOf(today);

  const weekStarts = Array.from({ length: WEEKS_BACK + 1 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - (WEEKS_BACK - i) * 7);
    return d;
  });

  useEffect(() => {
    if (width > 0) {
      // Açılışta bugünün haftasına animasyonsuz kaydır; geçmişe kullanıcı kaydırır.
      scrollRef.current?.scrollTo({ x: width * WEEKS_BACK, animated: false });
    }
  }, [width]);

  function onLayout(e: LayoutChangeEvent) {
    setWidth(e.nativeEvent.layout.width);
  }

  return (
    <View onLayout={onLayout} style={styles.container}>
      <PrayerTimeStrip todayTimes={todayTimes} />

      {width > 0 ? (
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setPageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        >
          {weekStarts.map((weekStart) => (
            <View key={weekStart.toISOString()} style={{ width }}>
              <WeekPageHeader weekStart={weekStart} today={today} />
              <View style={styles.bars}>
                {getWeekDays(weekStart).map((day, i) => {
                  const key = dayKeyOf(day);
                  const status = dayLog[key];
                  const isToday = key === todayKey;
                  const isFuture = day.getTime() > today.getTime();

                  let height = BAR_MIN_HEIGHT;
                  let color = colors.border;
                  if (!isFuture && status === 'done') {
                    height = BAR_MAX_HEIGHT;
                    color = isToday ? colors.accent : colors.secondary;
                  } else if (!isFuture && status === 'frozen') {
                    height = BAR_MAX_HEIGHT * 0.6;
                    color = colors.ice;
                  }

                  return (
                    <View key={key} style={styles.barColumn}>
                      <View style={[styles.bar, { height, backgroundColor: color }]} />
                      <AppText
                        variant="caption"
                        color={isToday ? 'textPrimary' : 'textSecondary'}
                        style={isToday ? styles.todayLabel : undefined}
                      >
                        {weekdayLetter(i)}
                      </AppText>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      ) : null}

      <AppText variant="caption" color="textSecondary" style={styles.legend}>
        Full bar = day completed
      </AppText>
      <View style={styles.dots}>
        {weekStarts.map((weekStart, i) => (
          <View
            key={weekStart.toISOString()}
            style={[
              styles.dot,
              { backgroundColor: i === pageIndex ? colors.secondary : colors.border },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function WeekPageHeader({ weekStart, today }: { weekStart: Date; today: Date }) {
  return (
    <View style={styles.heading}>
      <AppText variant="body">{formatWeekRangeLabel(weekStart, today)}</AppText>
      <AppText variant="caption" color="textSecondary">
        Swipe left for past weeks
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  heading: {
    gap: spacing.xs / 2,
    marginBottom: spacing.md,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    height: BAR_MAX_HEIGHT + spacing.xl,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: radius.sm,
  },
  todayLabel: {
    fontWeight: '700',
  },
  legend: {
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
});
