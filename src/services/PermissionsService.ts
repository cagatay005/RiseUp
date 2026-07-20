import { PermissionStatus } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

import { useSettingsStore } from '@/stores/settingsStore';
import { mapPermissionStatus } from './permissionUtils';

/**
 * Bildirim izni ister ve iOS'ta critical alerts'i de aynı istekte talep eder.
 * Critical alerts entitlement onayı Apple'dan gelene kadar `allowsCriticalAlerts`
 * false dönebilir — bu normaldir, AlarmScheduler (issue #6) time-sensitive
 * bildirime düşer. Android'de ayrı bir critical alert kavramı yoktur, bildirim
 * izniyle birlikte değerlendirilir.
 */
export async function requestNotificationPermission(): Promise<void> {
  const current = await Notifications.getPermissionsAsync();
  const response =
    current.status === PermissionStatus.GRANTED
      ? current
      : await Notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowSound: true, allowCriticalAlerts: true },
        });

  const notifications = mapPermissionStatus(response.status);
  const criticalAlerts =
    Platform.OS === 'ios'
      ? response.ios?.allowsCriticalAlerts
        ? 'granted'
        : 'denied'
      : notifications;

  useSettingsStore.getState().setPermissionsSnapshot({ notifications, criticalAlerts });
}

/** Kullanıcıyı sistem ayarlarındaki uygulama izin sayfasına yönlendirir. */
export function openSystemSettings(): void {
  void Linking.openSettings();
}
