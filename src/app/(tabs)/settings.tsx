import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Heading } from '@/components/atoms';
import { OptionSheet, SettingsRow } from '@/components/molecules';
import { openSystemSettings } from '@/services/PermissionsService';
import { useSettingsStore } from '@/stores';
import { radius, spacing, useTheme } from '@/theme';
import { translationLanguages, uiLanguages } from '../../../design/tokens';

type Sheet = 'language' | 'translation' | null;

/**
 * DESIGN §3.4 — "basit gruplu liste". Dark Mode toggle mockup'ta ve issue
 * #17'de vardı; ancak uygulama sonradan (bkz. proje geçmişi) aydınlık temayı
 * tamamen kaldırdı ve yalnız karanlık temayı kullanıyor — geçirilecek ikinci
 * bir tema olmadığından bu satır BİLİNÇLİ OLARAK eklenmedi.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const translationLanguage = useSettingsStore((s) => s.translationLanguage);
  const setTranslationLanguage = useSettingsStore((s) => s.setTranslationLanguage);
  const permissionsSnapshot = useSettingsStore((s) => s.permissionsSnapshot);
  const [sheet, setSheet] = useState<Sheet>(null);

  const languageLabel = uiLanguages.find((l) => l.id === language)?.label ?? language;
  const translationLabel =
    translationLanguages.find((l) => l.id === translationLanguage)?.label ?? translationLanguage;

  const permissionValues = [permissionsSnapshot.location, permissionsSnapshot.notifications];
  const allGranted = permissionValues.every((v) => v === 'granted');
  const anyDenied = permissionValues.some((v) => v === 'denied');
  const permissionsLabel = allGranted ? 'All granted' : anyDenied ? 'Action needed' : 'Not set';
  const permissionsColor = allGranted ? 'success' : anyDenied ? 'warning' : 'textSecondary';

  function showLegalPlaceholder(title: string) {
    Alert.alert(title, 'Not published yet — check back once RiseUp is live on the stores.');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h1" style={styles.heading}>
        Settings
      </Heading>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingsRow
            icon="globe-outline"
            label="Language"
            value={languageLabel}
            onPress={() => setSheet('language')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon="book-outline"
            label="Quran Translation"
            value={translationLabel}
            onPress={() => setSheet('translation')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow icon="diamond" label="Go Premium" accent onPress={() => router.push('/premium')} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Permissions"
            value={permissionsLabel}
            valueColor={permissionsColor}
            onPress={openSystemSettings}
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingsRow
            icon="document-text-outline"
            label="Privacy Policy"
            trailingIcon="open-outline"
            onPress={() => showLegalPlaceholder('Privacy Policy')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon="document-text-outline"
            label="Terms of Use"
            trailingIcon="open-outline"
            onPress={() => showLegalPlaceholder('Terms of Use')}
          />
        </View>

        <AppText variant="caption" color="textSecondary" style={styles.version}>
          RiseUp {Constants.expoConfig?.version ?? ''}
        </AppText>
      </View>

      <OptionSheet
        visible={sheet === 'language'}
        title="Language"
        options={uiLanguages}
        selectedId={language}
        onSelect={(id) => setLanguage(id as typeof language)}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        visible={sheet === 'translation'}
        title="Quran Translation"
        options={translationLanguages}
        selectedId={translationLanguage}
        onSelect={(id) => setTranslationLanguage(id as typeof translationLanguage)}
        onClose={() => setSheet(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  heading: {
    marginBottom: spacing.lg,
  },
  content: {
    gap: spacing.md,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    marginLeft: spacing.md + 18 + spacing.sm,
  },
  version: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
