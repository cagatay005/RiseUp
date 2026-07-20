import { Ionicons } from '@expo/vector-icons';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, ArabicText, Button, Heading } from '@/components/atoms';
import { WaveformMeter } from '@/components/organisms';
import { getRandomVerse } from '@/content/verses';
import {
  computeVoicedRatio,
  expectedReadingSeconds,
  scoreRecitation,
} from '@/services/RecitationService';
import { completeRecitation } from '@/services/StreakEngine';
import { rules } from '../../design/tokens';
import { usePremiumStore, useRingStore, useSettingsStore } from '@/stores';
import { radius, spacing, useTheme } from '@/theme';

type Phase = 'recite' | 'result';

export default function RecitationTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const isPremium = usePremiumStore((s) => s.isPremium);
  const translationLanguage = useSettingsStore((s) => s.translationLanguage);

  const [verse] = useState(() => getRandomVerse());
  const [phase, setPhase] = useState<Phase>('recite');
  const [score, setScore] = useState(0);
  const [levels, setLevels] = useState<number[]>([]);

  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const recorderState = useAudioRecorderState(recorder, 100);
  const samplesRef = useRef<number[]>([]);
  const durationRef = useRef(0);
  const armedRef = useRef(false);

  useEffect(() => {
    if (recorderState.isRecording && typeof recorderState.metering === 'number') {
      samplesRef.current.push(recorderState.metering);
      durationRef.current = recorderState.durationMillis;
      setLevels([...samplesRef.current]);
    }
  }, [recorderState]);

  async function startRecording() {
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) {
      Alert.alert('Microphone needed', 'Allow microphone access to recite the verse.');
      return;
    }
    samplesRef.current = [];
    durationRef.current = 0;
    setLevels([]);
    await recorder.prepareToRecordAsync();
    recorder.record();
    armedRef.current = true;
  }

  async function stopRecording() {
    // Parmak, izin diyaloğu sürerken kalkmış olabilir — kayıt hiç başlamadıysa çık.
    if (!armedRef.current) return;
    armedRef.current = false;
    await recorder.stop();

    // durationMillis örnekleme aralığı kadar geriden gelebilir; örnek sayısı
    // (100 ms aralıklı) daha güncelse onu kullan.
    const durationSeconds = Math.max(durationRef.current / 1000, samplesRef.current.length * 0.1);
    const voiced = computeVoicedRatio(samplesRef.current);
    setScore(scoreRecitation(expectedReadingSeconds(verse), durationSeconds, voiced));
    setPhase('result');
  }

  function finishTask() {
    completeRecitation(score, verse.surah);
    useRingStore.getState().completeTask('recitation');
    router.back();
  }

  if (!isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.premium}>
          <Ionicons name="lock-closed-outline" size={32} color={colors.gold} />
          <Heading variant="h2">Verse Recitation is Premium</Heading>
          <AppText color="textSecondary" style={styles.center}>
            Upgrade to dismiss alarms by reciting a verse out loud.
          </AppText>
          <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const passed = score >= rules.recitationPassScore;
  const words = verse.transliteration.trim().split(/\s+/);
  // STT olmadığından kelime vurgusu sezgiseldir: skor oranı kadar kelime
  // "duyuldu" sayılır (RecitationService'teki DÜRÜST SINIR notu).
  const coveredWords = Math.round((score / 100) * words.length);
  // Kayıt sırasında "şu an okunan yer" vurgusu: geçen süre / beklenen süre
  // oranı kadar kelime accent'e boyanır (süre orantılı karaoke sezgiseli;
  // örnekler 100 ms aralıklı geldiğinden levels.length ≈ geçen süre × 10).
  const liveWords = Math.min(
    words.length,
    Math.ceil(((levels.length * 0.1) / expectedReadingSeconds(verse)) * words.length),
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h2" style={styles.center}>
        Recite out loud to dismiss
      </Heading>
      <AppText color="textSecondary" style={styles.center}>
        Hold the microphone and read the verse clearly
      </AppText>

      <View style={[styles.verseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ArabicText>{verse.arabic}</ArabicText>
        {phase === 'result' ? (
          <View style={styles.wordRow}>
            {words.map((word, i) => (
              <AppText
                key={`${word}-${i}`}
                variant="transliteration"
                style={{ color: i < coveredWords ? colors.success : colors.textSecondary }}
              >
                {word}
              </AppText>
            ))}
          </View>
        ) : recorderState.isRecording ? (
          <View style={styles.wordRow}>
            {words.map((word, i) => (
              <AppText
                key={`${word}-${i}`}
                variant="transliteration"
                style={{ color: i < liveWords ? colors.accent : colors.textSecondary }}
              >
                {word}
              </AppText>
            ))}
          </View>
        ) : (
          <AppText variant="transliteration" color="textSecondary" style={styles.center}>
            {verse.transliteration}
          </AppText>
        )}
        <AppText variant="bodySmall" color="textSecondary" style={styles.center}>
          {verse.translations[translationLanguage]}
        </AppText>
        <AppText variant="caption" color="textSecondary" style={styles.center}>
          {verse.surah} • {verse.ayahNumber}
        </AppText>
      </View>

      {phase === 'recite' ? (
        <>
          <WaveformMeter levels={levels} active={recorderState.isRecording} />
          <View style={styles.actions}>
            <Pressable
              onPressIn={() => void startRecording()}
              onPressOut={() => void stopRecording()}
              accessibilityRole="button"
              accessibilityLabel="Hold to record"
              style={[
                styles.micButton,
                {
                  backgroundColor: recorderState.isRecording ? colors.accent : colors.surfaceElevated,
                  borderColor: colors.accent,
                },
              ]}
            >
              <Ionicons
                name="mic"
                size={30}
                color={recorderState.isRecording ? colors.onAccent : colors.accent}
              />
            </Pressable>
            <Button title="Cancel task" variant="ghost" onPress={() => router.back()} />
          </View>
        </>
      ) : (
        <View style={styles.actions}>
          <AppText variant="numberLarge" style={{ color: passed ? colors.success : colors.warning }}>
            {score}
          </AppText>
          <Heading variant="quote" style={styles.center}>
            {passed
              ? 'Beautifully recited. Your day begins with light.'
              : 'Almost there — take a breath and try again.'}
          </Heading>
          {passed ? (
            <Button title="Complete Task" onPress={finishTask} style={styles.fullWidth} />
          ) : (
            // TODO: "Listen & retry" örnek okunuş sesi bir ses varlığı gerektirir;
            // varlık eklenince buraya örnek dinletme butonu gelecek (DESIGN §6.3).
            <Button title="Try Again" onPress={() => setPhase('recite')} style={styles.fullWidth} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  premium: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  verseCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  wordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: spacing.xs,
  },
  actions: {
    alignItems: 'center',
    gap: spacing.md,
  },
  micButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
});
