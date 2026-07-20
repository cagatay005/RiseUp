import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { prayers } from '../../design/tokens';
import type { Alarm } from '@/stores/alarmsStore';
import { useAlarmsStore } from '@/stores/alarmsStore';
import type { GeoPoint, PrayerTimes } from '@/stores/prayerStore';
import { usePrayerStore } from '@/stores/prayerStore';
import { computePrayerTimes } from './PrayerTimesService';
import { getAlarmClockTime } from './scheduleHelpers';

/**
 * Ekran/uygulama kapalıyken de çalan alarm katmanı.
 *
 * DÜRÜST SINIR: Bu servis expo-notifications üzerine kuruludur (Android'de
 * AlarmManager'ı sarmalar) — yüksek öncelikli, DND'yi delen, kilit ekranında
 * görünen SESLİ BİR BİLDİRİM elde ediyoruz, ama gerçek bir alarm saati gibi
 * kilit ekranının üzerine OTOMATİK TAM EKRAN açılan bir arayüz değil (bu,
 * Android'in native "full-screen intent" Activity kaydı gerektirir — Notifee
 * gibi bir kütüphane ve elle yazılmış bir Expo config plugin ile mümkün, ama
 * bu ortamda derlenip test edilemediği için MVP'de bilinçli olarak seçilmedi).
 *
 * Ayrıca: günden güne kayan vakitler için "bugün geçtiyse yarına planla"
 * mantığı yalnız (a) bir alarm bildirimi tetiklendiğinde veya (b) uygulama
 * açılıp prayerStore/alarmsStore güncellendiğinde çalışır — uygulama günler
 * boyu hiç açılmazsa native bir arka plan görevi olmadığından yeniden
 * planlama tetiklenmez. Çoğu kullanıcı günde en az bir kez uygulamayı açacağı
 * için pratikte kabul edilebilir, ama garanti değildir.
 */

const ALARM_CHANNEL_ID = 'alarms';
let channelReady = false;

/** Android'de alarm-tarzı bildirim kanalı: MAX öncelik, DND bypass, kilit ekranında görünür. */
export async function ensureAlarmChannel(): Promise<void> {
  if (channelReady || Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ALARM_CHANNEL_ID, {
    name: 'Prayer alarms',
    importance: Notifications.AndroidImportance.MAX,
    bypassDnd: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    vibrationPattern: [0, 500, 250, 500],
    enableVibrate: true,
    audioAttributes: { usage: Notifications.AndroidAudioUsage.ALARM },
    sound: 'default',
  });
  channelReady = true;
}

/**
 * Bugünün hesaplanmış saati geçtiyse konumdan yarının aynı vaktini hesaplar.
 * Konum bilinmiyorsa (hiç izin verilmediyse) hiçbir zaman planlanamaz — null.
 */
export function resolveFireDate(
  alarm: Alarm,
  todayTimes: PrayerTimes | null,
  location: GeoPoint | null,
  now: Date,
): Date | null {
  const todayFire = getAlarmClockTime(alarm, todayTimes);
  if (todayFire && todayFire.getTime() > now.getTime()) return todayFire;

  if (!location) return null;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = computePrayerTimes(location, tomorrow);
  return getAlarmClockTime(alarm, tomorrowTimes);
}

export async function cancelAlarm(alarmId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(alarmId).catch(() => undefined);
}

/** Tek bir alarmı mevcut duruma göre planlar (enabled + konum varsa) ya da iptal eder. */
export async function syncAlarm(
  alarm: Alarm,
  todayTimes: PrayerTimes | null,
  location: GeoPoint | null,
  now: Date = new Date(),
): Promise<void> {
  if (!alarm.enabled) {
    await cancelAlarm(alarm.id);
    return;
  }

  // expo-notifications'ın zamanlama/kanal native modülü web'de yok (UnavailabilityError
  // fırlatır) — bu tamamen native bir özellik olduğundan web'de sessizce atlanır.
  if (Platform.OS === 'web') return;

  const fireDate = resolveFireDate(alarm, todayTimes, location, now);
  if (!fireDate) {
    await cancelAlarm(alarm.id);
    return;
  }

  await ensureAlarmChannel();
  await Notifications.scheduleNotificationAsync({
    identifier: alarm.id,
    content: {
      title: prayers[alarm.prayerId].alarmMessage,
      body: 'Tap to open RiseUp and complete your task.',
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.MAX,
      sticky: true,
      // Critical alerts entitlement'ı onaylanana kadar iOS bunu sessizce
      // time-sensitive'e düşürür (issue notu) — burada koşul kontrolüne gerek yok.
      interruptionLevel: 'critical',
      data: { alarmId: alarm.id, prayerId: alarm.prayerId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fireDate,
      channelId: ALARM_CHANNEL_ID,
    },
  });
}

export async function syncAllAlarms(
  alarms: Alarm[],
  todayTimes: PrayerTimes | null,
  location: GeoPoint | null,
): Promise<void> {
  await Promise.all(alarms.map((alarm) => syncAlarm(alarm, todayTimes, location)));
}

/** Uygulama açıkken bildirimlerin ön planda da gösterilmesini sağlar (varsayılan: gösterilmez). */
function registerForegroundHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });
}

/** Bir alarm tetiklendiğinde aynı seansta yarınki oluşumunu hemen planlar. */
function registerRescheduleOnFire(): () => void {
  const sub = Notifications.addNotificationReceivedListener((event) => {
    const alarmId = event.request.content.data?.alarmId as string | undefined;
    if (!alarmId) return;
    const alarm = useAlarmsStore.getState().alarms.find((a) => a.id === alarmId);
    if (!alarm) return;
    const { todayTimes, location } = usePrayerStore.getState();
    void syncAlarm(alarm, todayTimes, location);
  });
  return () => sub.remove();
}

/**
 * alarmsStore mutasyonları ve prayerStore güncellemeleri senkron olarak
 * scheduler'ı tetikler (issue #6 kabul kriteri). Uygulama açılışında bir kez
 * çağrılır (src/app/_layout.tsx); döndürdüğü fonksiyon aboneliği kapatır.
 */
export function initAlarmScheduler(): () => void {
  registerForegroundHandler();

  let previousIds = new Set(useAlarmsStore.getState().alarms.map((a) => a.id));

  const unsubAlarms = useAlarmsStore.subscribe((state) => {
    const alarms = state.alarms;
    const nextIds = new Set(alarms.map((a) => a.id));
    for (const id of previousIds) {
      if (!nextIds.has(id)) void cancelAlarm(id);
    }
    previousIds = nextIds;

    const { todayTimes, location } = usePrayerStore.getState();
    void syncAllAlarms(alarms, todayTimes, location);
  });

  const unsubPrayer = usePrayerStore.subscribe((state) => {
    void syncAllAlarms(useAlarmsStore.getState().alarms, state.todayTimes, state.location);
  });

  const unsubReschedule = registerRescheduleOnFire();

  return () => {
    unsubAlarms();
    unsubPrayer();
    unsubReschedule();
  };
}
