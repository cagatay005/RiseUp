import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { AppText, Heading } from '@/components/atoms';
import { brand, type PrayerId } from '../../../design/tokens';
import type { PrayerTimes } from '@/stores/prayerStore';
import { formatCountdown, getNextPrayer } from '@/services/scheduleHelpers';
import { useTranslation } from '@/i18n';
import { radius, spacing, useTheme } from '@/theme';

/**
 * "Next Alarm" hero kartı: koyu lacivertten fecir turuncusuna geçen bir SVG
 * gradyan (react-native-svg zaten bağımlılık, yeni paket eklenmedi) + hafif
 * parlayan turuncu kenarlık ile diğer kartlardan ayrışıp odağı üstüne çeker.
 */
export function NextPrayerCountdown({ todayTimes }: { todayTimes: PrayerTimes | null }) {
  const { colors } = useTheme();
  const t = useTranslation();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  const next = getNextPrayer(todayTimes, now);

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: `${colors.accent}66`,
          boxShadow: `0 0 20px 0 ${colors.accent}40`,
        } as object,
      ]}
    >
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="nextPrayerGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={brand.navy} stopOpacity={1} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0.32} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" rx={radius.md} fill="url(#nextPrayerGradient)" />
      </Svg>
      <Ionicons name="time-outline" size={18} color={colors.secondary} />
      {next ? (
        <>
          <Heading variant="h2" style={styles.name}>
            {t.prayers[next.prayerId as PrayerId].title}
          </Heading>
          <AppText variant="bodySmall" color="textSecondary" style={styles.countdown}>
            {t.nextPrayer.inLabel(formatCountdown(next.time, now))}
          </AppText>
        </>
      ) : (
        <AppText variant="bodySmall" color="textSecondary" style={styles.countdown}>
          {t.nextPrayer.grantLocation}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    overflow: 'hidden',
  },
  name: {
    marginLeft: 0,
  },
  countdown: {
    marginLeft: 'auto',
  },
});
