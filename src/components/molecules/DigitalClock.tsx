import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms';
import { useTheme } from '@/theme';

function formatTime24h(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatTime12h(date: Date): { time: string; period: 'AM' | 'PM' } {
  const hours24 = date.getHours();
  const period: 'AM' | 'PM' = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return { time: `${hours12}:${minutes}`, period };
}

export interface DigitalClockProps {
  time: Date | null;
  /** '24h' (varsayılan, vakit gösterimlerinde kullanılır) veya '12h' (AM/PM — alarm kurma ekranı). */
  format?: '24h' | '12h';
}

export function DigitalClock({ time, format = '24h' }: DigitalClockProps) {
  const { colors } = useTheme();

  if (format === '12h' && time) {
    const { time: label, period } = formatTime12h(time);
    return (
      <View style={styles.row}>
        <AppText variant="clockDigital" style={{ color: colors.accent }}>
          {label}
        </AppText>
        <AppText variant="h2" style={[styles.period, { color: colors.accent }]}>
          {period}
        </AppText>
      </View>
    );
  }

  return (
    <AppText variant="clockDigital" style={{ color: colors.accent }}>
      {time ? formatTime24h(time) : '--:--'}
    </AppText>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  period: {
    marginBottom: 10,
  },
});
