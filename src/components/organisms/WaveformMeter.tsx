import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

const BAR_COUNT = 24;
const MIN_HEIGHT = 4;
const MAX_HEIGHT = 44;

export interface WaveformMeterProps {
  /** Son metering örnekleri (dBFS, negatif); en yenisi sonda. */
  levels: readonly number[];
  /** Kayıt sürüyor mu — çubuklar accent, değilse soluk kenarlık rengi. */
  active: boolean;
}

/** dBFS (-60..0) → çubuk yüksekliği. */
function barHeight(db: number): number {
  const normalized = Math.min(1, Math.max(0, (db + 60) / 60));
  return MIN_HEIGHT + normalized * (MAX_HEIGHT - MIN_HEIGHT);
}

/** DESIGN §6.3: kayıt sırasında oynayan canlı ses dalgası çubukları. */
export function WaveformMeter({ levels, active }: WaveformMeterProps) {
  const { colors } = useTheme();
  const recent = levels.slice(-BAR_COUNT);
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const level = recent[i - (BAR_COUNT - recent.length)];
    return level === undefined ? MIN_HEIGHT : barHeight(level);
  });

  return (
    <View style={styles.row}>
      {bars.map((height, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { height, backgroundColor: active ? colors.accent : colors.border },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: MAX_HEIGHT,
  },
  bar: {
    width: 4,
    borderRadius: radius.sm,
  },
});
