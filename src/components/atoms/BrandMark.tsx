import Svg, { Circle, Line, Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';
import { AppText } from './AppText';

export interface BrandMarkProps {
  size?: number;
  showWordmark?: boolean;
}

/** Dağların arkasından doğan güneş — RiseUp logosu (bkz. DESIGN.md §2.1). */
export function BrandMark({ size = 132, showWordmark = true }: BrandMarkProps) {
  const { colors } = useTheme();
  const height = (size * 80) / 140;

  return (
    <View style={styles.container}>
      <Svg width={size} height={height} viewBox="0 0 140 80">
        <Line x1={70} y1={8} x2={70} y2={16} stroke={colors.accent} strokeWidth={2} strokeLinecap="round" />
        <Line x1={44} y1={18} x2={49} y2={24} stroke={colors.accent} strokeWidth={2} strokeLinecap="round" />
        <Line x1={96} y1={18} x2={91} y2={24} stroke={colors.accent} strokeWidth={2} strokeLinecap="round" />
        <Circle cx={70} cy={42} r={17} fill={colors.accent} />
        <Path d="M6,74 L52,28 L98,74 Z" fill={colors.surfaceElevated} />
        <Path
          d="M56,74 L96,38 L136,74 Z"
          fill={colors.surface}
          stroke={colors.border}
          strokeWidth={1}
        />
        <Line x1={2} y1={74} x2={138} y2={74} stroke={colors.border} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
      {showWordmark && (
        <AppText variant="h2" style={styles.wordmark}>
          RiseUp
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wordmark: {
    marginTop: 10,
  },
});
