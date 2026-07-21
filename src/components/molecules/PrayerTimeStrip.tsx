import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms';
import { prayers } from '../../../design/tokens';
import { PRAYER_IDS_IN_ORDER } from '@/services/PrayerTimesService';
import { getNextPrayer } from '@/services/scheduleHelpers';
import type { PrayerTimes } from '@/stores/prayerStore';
import { spacing } from '@/theme';

function formatClock(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

/** DESIGN §3.2 sayfa 1: 5 vakit saati, en yakın vakit accent ile vurgulu. */
export function PrayerTimeStrip({ todayTimes }: { todayTimes: PrayerTimes | null }) {
  if (!todayTimes) return null;
  const next = getNextPrayer(todayTimes, new Date());

  return (
    <View style={styles.row}>
      {PRAYER_IDS_IN_ORDER.map((id) => {
        const highlighted = id === next?.prayerId;
        const color = highlighted ? 'accent' : 'textSecondary';
        return (
          <View key={id} style={styles.cell}>
            <AppText variant="caption" color={color}>
              {prayers[id].title}
            </AppText>
            <AppText variant="bodySmall" color={color} style={styles.time}>
              {formatClock(todayTimes[id])}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  cell: {
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
});
