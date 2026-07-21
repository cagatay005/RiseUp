import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Heading } from '@/components/atoms';
import { OptionSheet, SettingsRow } from '@/components/molecules';
import { useTranslation } from '@/i18n';
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
  const t = useTranslation();
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
  const permissionsLabel = allGranted ? t.settings.allGranted : anyDenied ? t.settings.actionNeeded : t.settings.notSet;
  const permissionsColor = allGranted ? 'success' : anyDenied ? 'warning' : 'textSecondary';

  function showLegalPlaceholder(title: string) {
    Alert.alert(title, t.settings.legalNotPublished);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h1" style={styles.heading}>
        {t.settings.title}
      </Heading>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingsRow
            icon="globe-outline"
            label={t.settings.language}
            value={languageLabel}
            onPress={() => setSheet('language')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon="book-outline"
            label={t.settings.quranTranslation}
            value={translationLabel}
            onPress={() => setSheet('translation')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow icon="diamond" label={t.settings.goPremium} accent onPress={() => router.push('/premium')} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingsRow
            icon="shield-checkmark-outline"
            label={t.settings.permissions}
            value={permissionsLabel}
            valueColor={permissionsColor}
            onPress={openSystemSettings}
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingsRow
            icon="document-text-outline"
            label={t.settings.privacyPolicy}
            trailingIcon="open-outline"
            onPress={() => showLegalPlaceholder(t.settings.privacyPolicy)}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon="document-text-outline"
            label={t.settings.termsOfUse}
            trailingIcon="open-outline"
            onPress={() => showLegalPlaceholder(t.settings.termsOfUse)}
          />
        </View>

        <AppText variant="caption" color="textSecondary" style={styles.version}>
          {t.settings.version(Constants.expoConfig?.version ?? '')}
        </AppText>
      </View>

      <OptionSheet
        visible={sheet === 'language'}
        title={t.settings.language}
        options={uiLanguages}
        selectedId={language}
        onSelect={(id) => setLanguage(id as typeof language)}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        visible={sheet === 'translation'}
        title={t.settings.quranTranslation}
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
