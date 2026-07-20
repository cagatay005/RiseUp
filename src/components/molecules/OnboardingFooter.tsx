import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Dot } from '@/components/atoms';
import { spacing } from '@/theme';

export interface OnboardingFooterProps {
  activeIndex: number;
  total: number;
  onSkip: () => void;
}

export function OnboardingFooter({ activeIndex, total, onSkip }: OnboardingFooterProps) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onSkip} accessibilityRole="button" hitSlop={8}>
        <AppText variant="bodySmall" color="textSecondary">
          Skip
        </AppText>
      </Pressable>
      <View style={styles.dots}>
        {Array.from({ length: total }, (_, i) => (
          <Dot key={i} active={i === activeIndex} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
