import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { prayers, type PrayerId } from '../../design/tokens';
import { useAlarmsStore } from '@/stores';
import { ForcedThemeProvider, radius, spacing, useTheme } from '@/theme';

const PRAYER_IDS: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

/**
 * TODO(#7): analog kadranlı kurulum ekranıyla değiştirilecek. Şimdilik yalnızca
 * vakit seçimiyle alarm oluşturan sade bir yer tutucu — Home'daki "alarm ekle"
 * akışının uçtan uca çalışması için gereken minimum.
 */
export default function AlarmSetupScreen() {
  return (
    <ForcedThemeProvider name="dark">
      <AlarmSetupContent />
    </ForcedThemeProvider>
  );
}

function AlarmSetupContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const addAlarm = useAlarmsStore((s) => s.addAlarm);
  const [selected, setSelected] = useState<PrayerId>('fajr');

  function save() {
    addAlarm({ prayerId: selected });
    router.back();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </Pressable>
        <Heading variant="h2">New Alarm</Heading>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.chips}>
        {PRAYER_IDS.map((id) => {
          const active = id === selected;
          return (
            <Pressable
              key={id}
              onPress={() => setSelected(id)}
              style={[
                styles.chip,
                {
                  borderColor: active ? colors.secondary : colors.border,
                  backgroundColor: colors.surfaceElevated,
                },
              ]}
            >
              <AppText variant="bodySmall">{prayers[id].title}</AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.spacer} />
      <Button title="Save Alarm" onPress={save} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 22,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  spacer: {
    flex: 1,
  },
});
