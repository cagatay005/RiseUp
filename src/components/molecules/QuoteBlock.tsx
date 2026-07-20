import { StyleSheet, View } from 'react-native';

import { AppText, Heading } from '@/components/atoms';
import { spacing } from '@/theme';

export function QuoteBlock({ text, attribution }: { text: string; attribution?: string }) {
  return (
    <View style={styles.container}>
      <Heading variant="quote" style={styles.text}>
        {text}
      </Heading>
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
  },
  text: {
    textAlign: 'center',
  },
  attribution: {
    marginTop: spacing.sm,
  },
});
