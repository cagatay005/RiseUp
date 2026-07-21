import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StreakCalendar, WeeklyBarChart } from '@/components/organisms';
import { useStreakStore } from '@/stores';
import { radius, spacing, useTheme } from '@/theme';

/** DESIGN §3.2: iki yatay sayfa (haftalık grafik / seri takvimi), üstte 2 nokta gösterge. */
export default function StatsScreen() {
  const { colors } = useTheme();
  const dayLog = useStreakStore((s) => s.dayLog);
  const startedAt = useStreakStore((s) => s.startedAt);
  const scrollRef = useRef<ScrollView>(null);
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);

  function onLayout(e: LayoutChangeEvent) {
    setWidth(e.nativeEvent.layout.width);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.dots}>
        {[0, 1].map((i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: i === page ? colors.secondary : colors.border }]}
          />
        ))}
      </View>

      <View style={styles.pager} onLayout={onLayout}>
        {width > 0 ? (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
          >
            <View style={[styles.page, { width }]}>
              <WeeklyBarChart dayLog={dayLog} />
            </View>
            <View style={[styles.page, { width }]}>
              <StreakCalendar dayLog={dayLog} startedAt={startedAt} />
            </View>
          </ScrollView>
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
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
  pager: {
    flex: 1,
  },
  page: {
    paddingHorizontal: spacing.xs,
  },
});
