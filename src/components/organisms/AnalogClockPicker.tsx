import { useMemo, useRef } from 'react';
import { PanResponder, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

import { DigitalClock } from '@/components/molecules';
import {
  angleToMinuteOfHour,
  getPickerBaseTime,
  pointToAngleDeg,
  shortestMinuteDelta,
} from '@/services/scheduleHelpers';
import type { PrayerId } from '../../../design/tokens';
import type { PrayerTimes } from '@/stores/prayerStore';
import { sizes, useTheme } from '@/theme';

export interface AnalogClockPickerProps {
  prayerId: PrayerId;
  todayTimes: PrayerTimes | null;
  offsetMinutes: number;
  onChangeOffset: (minutes: number) => void;
}

const DIAMETER = sizes.analogClockDiameter;
const RADIUS = DIAMETER / 2;
const TICKS = Array.from({ length: 12 }, (_, i) => i);

/**
 * Alarm sabit saat değil "vakit + dakika ofseti" olarak saklanır (alarmsStore),
 * bu yüzden kadran mutlak bir 24 saat seçici değildir: yelkovan sürüklenerek
 * seçilen vaktin ±30 dakika ince ayarı yapılır (DESIGN.md §5). Akrep bu ofsete
 * göre yalnız görsel olarak, otomatik ilerler — ayrıca sürüklenmez.
 */
export function AnalogClockPicker({ prayerId, todayTimes, offsetMinutes, onChangeOffset }: AnalogClockPickerProps) {
  const { colors } = useTheme();

  const baseTime = useMemo(() => getPickerBaseTime(prayerId, todayTimes, new Date()), [prayerId, todayTimes]);
  const displayTime = useMemo(
    () => new Date(baseTime.getTime() + offsetMinutes * 60_000),
    [baseTime, offsetMinutes],
  );

  const handleTouch = (evt: GestureResponderEvent) => {
    const { locationX, locationY } = evt.nativeEvent;
    const angle = pointToAngleDeg(locationX - RADIUS, locationY - RADIUS);
    const targetMinute = angleToMinuteOfHour(angle);
    const delta = shortestMinuteDelta(baseTime.getMinutes(), targetMinute);
    onChangeOffset(delta);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: handleTouch,
      onPanResponderMove: handleTouch,
    }),
  ).current;

  const hourAngle = ((displayTime.getHours() % 12) + displayTime.getMinutes() / 60) * 30;
  const minuteAngle = displayTime.getMinutes() * 6;

  return (
    <View style={styles.container}>
      <DigitalClock time={displayTime} />
      <View style={styles.dial} {...panResponder.panHandlers}>
        <Svg width={DIAMETER} height={DIAMETER} viewBox={`0 0 ${DIAMETER} ${DIAMETER}`}>
          <Circle cx={RADIUS} cy={RADIUS} r={RADIUS - 4} fill={colors.surfaceElevated} stroke={colors.border} strokeWidth={2} />
          {TICKS.map((i) => {
            const angle = ((i * 30 - 90) * Math.PI) / 180;
            const outer = RADIUS - 12;
            const inner = RADIUS - 22;
            return (
              <Line
                key={i}
                x1={RADIUS + outer * Math.cos(angle)}
                y1={RADIUS + outer * Math.sin(angle)}
                x2={RADIUS + inner * Math.cos(angle)}
                y2={RADIUS + inner * Math.sin(angle)}
                stroke={colors.border}
                strokeWidth={2}
                strokeLinecap="round"
              />
            );
          })}
          <Hand angle={hourAngle} length={RADIUS * 0.5} width={4} color={colors.secondary} />
          <Hand angle={minuteAngle} length={RADIUS * 0.75} width={3} color={colors.accent} />
          <Circle cx={RADIUS} cy={RADIUS} r={6} fill={colors.accent} />
        </Svg>
      </View>
    </View>
  );
}

function Hand({ angle, length, width, color }: { angle: number; length: number; width: number; color: string }) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return (
    <Line
      x1={RADIUS}
      y1={RADIUS}
      x2={RADIUS + length * Math.cos(rad)}
      y2={RADIUS + length * Math.sin(rad)}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  dial: {
    width: DIAMETER,
    height: DIAMETER,
    marginTop: 16,
  },
});
