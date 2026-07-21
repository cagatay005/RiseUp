import { useMemo, useRef } from 'react';
import { Animated, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import { fonts, useTheme } from '@/theme';

export const WHEEL_ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5; // tek sayı: ortadaki öğe net biçimde ayırt edilir
const HALF_VISIBLE = Math.floor(VISIBLE_COUNT / 2);

export interface WheelColumnProps {
  items: readonly string[];
  /** Yalnız ilk kaydırma konumu için kullanılır — bileşen sonrasında kontrolsüzdür. */
  initialIndex: number;
  onChange: (index: number) => void;
  width?: number;
}

/**
 * iOS tarzı kaydırmalı seçim sütunu — react-native-community/datetimepicker'ın
 * Android'de her zaman native bir Dialog açması (çalışma zamanında
 * renklendirilemiyor) yüzünden hiç native picker KULLANILMAZ; tamamen RN
 * Animated ile inşa edilmiştir, her iki platformda da aynı görünür ve
 * uygulamanın karanlık temasına birebir uyar.
 */
export function WheelColumn({ items, initialIndex, onChange, width = 64 }: WheelColumnProps) {
  const { colors } = useTheme();
  const scrollY = useRef(new Animated.Value(initialIndex * WHEEL_ITEM_HEIGHT)).current;
  const lastReported = useRef(initialIndex);

  const handleScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      }),
    [scrollY],
  );

  function reportIndex(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(event.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    if (clamped !== lastReported.current) {
      lastReported.current = clamped;
      onChange(clamped);
    }
  }

  return (
    <View style={{ width, height: WHEEL_ITEM_HEIGHT * VISIBLE_COUNT }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={WHEEL_ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: WHEEL_ITEM_HEIGHT * HALF_VISIBLE }}
        contentOffset={{ x: 0, y: initialIndex * WHEEL_ITEM_HEIGHT }}
        onScroll={handleScroll}
        onMomentumScrollEnd={reportIndex}
        onScrollEndDrag={reportIndex}
        scrollEventThrottle={16}
      >
        {items.map((label, i) => {
          const inputRange = [
            (i - 2) * WHEEL_ITEM_HEIGHT,
            (i - 1) * WHEEL_ITEM_HEIGHT,
            i * WHEEL_ITEM_HEIGHT,
            (i + 1) * WHEEL_ITEM_HEIGHT,
            (i + 2) * WHEEL_ITEM_HEIGHT,
          ];
          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.2, 0.45, 1, 0.45, 0.2],
            extrapolate: 'clamp',
          });
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.75, 0.88, 1.15, 0.88, 0.75],
            extrapolate: 'clamp',
          });
          return (
            <View key={label + i} style={styles.item}>
              <Animated.Text
                style={[styles.itemText, { color: colors.textPrimary, opacity, transform: [{ scale }] }]}
              >
                {label}
              </Animated.Text>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    height: WHEEL_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontFamily: fonts.bodyExtraBold,
    fontSize: 28,
    lineHeight: 34,
    fontVariant: ['tabular-nums'],
  },
});
