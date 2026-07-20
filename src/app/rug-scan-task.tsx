import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Heading } from '@/components/atoms';
import { QuoteBlock } from '@/components/molecules';
import { getDailyQuote } from '@/services/QuoteService';
import { usePremiumStore, useRingStore } from '@/stores';
import { radius, spacing, useTheme } from '@/theme';

export default function RugScanTaskScreen() {
  const router = useRouter();
  const { alarmId } = useLocalSearchParams<{ alarmId?: string }>();
  const { colors } = useTheme();
  const isPremium = usePremiumStore((s) => s.isPremium);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [torch, setTorch] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const quote = useMemo(() => getDailyQuote(), []);

  async function capture() {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const picture = await cameraRef.current.takePictureAsync({ quality: 0.35, skipProcessing: true });
      // MVP doğrulaması: kameranın gerçekten çerçeve yakalayabildiğini kontrol eder.
      // Desen/mihrab sınıflandırma modeli sonraki iterasyonda bu noktaya bağlanır.
      if (picture.width > 0 && picture.height > 0) {
        // Alarm çalma ekranından push ile gelindi: tamamlanma ringStore'a yazılır,
        // back ile çalma ekranına dönülür (o ekran sıradaki görevi gösterir).
        useRingStore.getState().completeTask('rugScan');
        router.back();
      } else {
        Alert.alert('Try again', 'Move closer and keep the prayer rug clearly visible.');
      }
    } catch {
      Alert.alert('Try again', 'Make sure the prayer rug is clearly visible.');
    } finally {
      setCapturing(false);
    }
  }

  if (!isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.premium}>
          <Ionicons name="lock-closed-outline" size={32} color={colors.gold} />
          <Heading variant="h2">Prayer Rug Scan is Premium</Heading>
          <AppText color="textSecondary" style={styles.center}>Unlock camera verification and build your streak with every prayer.</AppText>
          <QuoteBlock text={quote.text} compact />
          <Button title="Back to tasks" variant="secondary" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission) return <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} />;
  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.premium}>
          <Ionicons name="camera-outline" size={32} color={colors.secondary} />
          <Heading variant="h2">Camera access needed</Heading>
          <AppText color="textSecondary" style={styles.center}>RiseUp only uses the camera to verify your prayer rug.</AppText>
          <Button title="Grant Camera Access" onPress={() => void requestPermission()} />
          <QuoteBlock text={quote.text} compact />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading variant="h2" style={styles.center}>Capture your Prayer Rug</Heading>
      <AppText color="textSecondary" style={styles.center}>Ensure the patterns or mihrab are clearly visible.</AppText>
      <View style={[styles.cameraFrame, { borderColor: colors.border }]}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" enableTorch={torch} />
        <Pressable onPress={() => setTorch((on) => !on)} style={[styles.flash, { backgroundColor: colors.surfaceElevated }]} accessibilityRole="button">
          <Ionicons name={torch ? 'flash' : 'flash-outline'} size={20} color={colors.accent} />
        </Pressable>
      </View>
      <Pressable onPress={() => void capture()} style={[styles.shutter, { borderColor: colors.accent }]} accessibilityRole="button">
        <View style={[styles.shutterInner, { backgroundColor: capturing ? colors.textSecondary : colors.accent }]} />
      </Pressable>
      <QuoteBlock text={quote.text} compact />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.md, padding: spacing.lg },
  center: { textAlign: 'center' },
  premium: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  cameraFrame: { flex: 1, borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  flash: { position: 'absolute', right: spacing.md, top: spacing.md, borderRadius: radius.full, padding: spacing.sm },
  shutter: { alignSelf: 'center', alignItems: 'center', borderWidth: 3, borderRadius: radius.full, justifyContent: 'center', height: 72, width: 72 },
  shutterInner: { borderRadius: radius.full, height: 56, width: 56 },
});
