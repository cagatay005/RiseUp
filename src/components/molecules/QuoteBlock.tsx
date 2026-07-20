import { StyleSheet, View } from 'react-native';

import { AppText, Heading } from '@/components/atoms';
import { spacing, useTheme } from '@/theme';

export function QuoteBlock({
  text,
  attribution,
  compact = false,
}: {
  text: string;
  attribution?: string;
  compact?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, compact && styles.compact, { borderColor: colors.accent }]}>
      <AppText variant="quote" style={[styles.mark, { color: colors.accent }]}>
        “
      </AppText>
      <Heading variant="quote" style={[styles.text, compact && styles.compactText, { color: colors.accent }]}>
        {text}
      </Heading>
      <AppText variant="quote" style={[styles.mark, styles.closingMark, { color: colors.accent }]}>
        ”
      </AppText>
      {attribution ? (
        <AppText variant="caption" color="textSecondary" style={styles.attribution}>
          — {attribution}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderLeftWidth: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  compact: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    textAlign: 'center',
  },
  compactText: {
    fontSize: 18,
    lineHeight: 26,
  },
  mark: {
    alignSelf: 'flex-start',
    fontSize: 22,
    lineHeight: 20,
  },
  closingMark: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
  },
  attribution: {
    marginTop: spacing.xs,
  },
});
