import { PermissionStatus } from 'expo-modules-core';

import type { PermissionState } from '@/stores/settingsStore';

/** expo-location ve expo-notifications aynı PermissionStatus enum'unu paylaşır. */
export function mapPermissionStatus(status: PermissionStatus): PermissionState {
  switch (status) {
    case PermissionStatus.GRANTED:
      return 'granted';
    case PermissionStatus.DENIED:
      return 'denied';
    default:
      return 'unknown';
  }
}
