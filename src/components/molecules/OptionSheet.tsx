import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Heading } from '@/components/atoms';
import { useTranslation } from '@/i18n';
import { radius, spacing, useTheme } from '@/theme';

export interface OptionSheetOption {
  id: string;
  label: string;
}

export interface OptionSheetProps {
  visible: boolean;
  title: string;
  options: readonly OptionSheetOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

/** Tek seçimli alttan açılır liste — Ayarlar'daki Language/Quran Translation seçicileri paylaşır. */
export function OptionSheet({ visible, title, options, selectedId, onSelect, onClose }: OptionSheetProps) {
  const { colors } = useTheme();
  const t = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel={t.common.close} />
      <SafeAreaView style={[styles.sheet, { backgroundColor: colors.surfaceElevated }]} edges={['bottom']}>
        <Heading variant="h2" style={styles.title}>
          {title}
        </Heading>
        {options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <Pressable
              key={option.id}
              onPress={() => {
                onSelect(option.id);
                onClose();
              }}
              accessibilityRole="button"
              style={styles.optionRow}
            >
              <AppText variant="body" color={selected ? 'accent' : 'textPrimary'}>
                {option.label}
              </AppText>
              {selected ? <Ionicons name="checkmark" size={20} color={colors.accent} /> : null}
            </Pressable>
          );
        })}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000099',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
});
