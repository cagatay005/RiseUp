import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button } from '@/components/atoms';
import { useTranslation } from '@/i18n';
import { radius, spacing, useTheme } from '@/theme';

export function FreezeCounter({ freezes }: { freezes: number }) {
  const { colors } = useTheme();
  const t = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        style={[styles.chip, { borderColor: colors.ice }]}
      >
        <Ionicons name="snow-outline" size={14} color={colors.ice} />
        <AppText variant="bodySmall" style={{ fontWeight: '500' as const }}>
          {freezes}
        </AppText>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <Ionicons name="snow-outline" size={28} color={colors.ice} />
            <AppText variant="h2" style={styles.title}>
              {t.freezeCounter.title}
            </AppText>
            <AppText color="textSecondary" style={styles.body}>
              {t.freezeCounter.body}
            </AppText>
            <Button title={t.freezeCounter.gotIt} onPress={() => setOpen(false)} style={styles.close} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    marginTop: spacing.sm,
  },
  body: {
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  close: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
});
