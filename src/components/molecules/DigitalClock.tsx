import { AppText } from '@/components/atoms';
import { useTheme } from '@/theme';

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function DigitalClock({ time }: { time: Date | null }) {
  const { colors } = useTheme();
  return (
    <AppText variant="clockDigital" style={{ color: colors.accent }}>
      {time ? formatTime(time) : '--:--'}
    </AppText>
  );
}
