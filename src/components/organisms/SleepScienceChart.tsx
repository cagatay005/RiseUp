import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { AppText } from '@/components/atoms';
import { useTranslation } from '@/i18n';
import { radius, spacing, useTheme } from '@/theme';

/**
 * Gece boyunca beyin aktivitesi eğrisi; şafak bölümü (4AM-6AM) eğrinin altını
 * izleyen saydam turuncu dolguyla vurgulanır — asla katı blok/bar değildir
 * (bkz. mockups.html ekran 2, STITCH_PROMPTS.md'deki "never a solid bar" kısıtı).
 */
export function SleepScienceChart() {
  const { colors } = useTheme();
  const t = useTranslation();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <AppText variant="caption" color="secondary" style={styles.caption}>
        {t.onboarding.science.caption}
      </AppText>
      <Svg width="100%" height={120} viewBox="0 0 300 120">
        <Path d="M210,25 C230,17 245,18 260,25 L260,108 L210,108 Z" fill={colors.accent} opacity={0.22} />
        <Path
          d="M0,95 C40,92 60,75 100,65 C140,55 170,40 210,25 C230,17 245,18 260,25 C280,34 292,44 300,48"
          fill="none"
          stroke={colors.secondary}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Circle cx={238} cy={19} r={4} fill={colors.accent} />
        <Line x1={0} y1={108} x2={300} y2={108} stroke={colors.border} strokeWidth={1} />
      </Svg>
      <View style={styles.axisRow}>
        <AppText variant="caption" color="textSecondary">
          {t.onboarding.science.axisEvening}
        </AppText>
        <AppText variant="caption" color="textSecondary">
          {t.onboarding.science.axisNight}
        </AppText>
        <AppText variant="caption" color="textSecondary">
          {t.onboarding.science.axisDawn}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  caption: {
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
