import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { View } from 'react-native';

import { useTranslation } from '@/i18n';
import { sizes, useTheme } from '@/theme';

export function CompassDial({ heading, targetBearing, aligned }: { heading: number; targetBearing: number; aligned: boolean }) {
  const { colors } = useTheme();
  const t = useTranslation();
  const size = sizes.compassDiameter;
  const center = size / 2;
  const radius = center - 18;
  const rotation = targetBearing - heading;
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <View>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={center} cy={center} r={radius} fill={colors.surface} stroke={colors.gold} strokeWidth={2} />
        <Circle cx={center} cy={center} r={radius - 11} fill={colors.surfaceElevated} stroke={aligned ? colors.success : colors.border} strokeWidth={3} />
        {ticks.map((tick) => {
          const angle = (tick * Math.PI) / 180;
          const inner = radius - (tick % 30 === 0 ? 22 : 16);
          const x1 = center + Math.sin(angle) * inner;
          const y1 = center - Math.cos(angle) * inner;
          const x2 = center + Math.sin(angle) * (radius - 7);
          const y2 = center - Math.cos(angle) * (radius - 7);
          return <Line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.gold} strokeWidth={tick % 30 === 0 ? 2 : 1} />;
        })}
        <SvgText x={center} y={35} fill={colors.textPrimary} fontSize={16} fontWeight="700" textAnchor="middle">{t.common.compassNorth}</SvgText>
        <SvgText x={center} y={size - 22} fill={colors.textSecondary} fontSize={13} textAnchor="middle">{t.common.compassSouth}</SvgText>
        <SvgText x={25} y={center + 5} fill={colors.textSecondary} fontSize={13} textAnchor="middle">{t.common.compassWest}</SvgText>
        <SvgText x={size - 25} y={center + 5} fill={colors.textSecondary} fontSize={13} textAnchor="middle">{t.common.compassEast}</SvgText>
        <Path d={`M ${center} ${center - 86} L ${center - 12} ${center + 14} L ${center} ${center + 4} L ${center + 12} ${center + 14} Z`} fill={colors.accent} transform={`rotate(${rotation} ${center} ${center})`} />
        <Circle cx={center} cy={center} r={12} fill={colors.gold} stroke={colors.background} strokeWidth={4} />
      </Svg>
    </View>
  );
}
