import { CalculationMethod, Coordinates, Madhab, PrayerTimes as AdhanPrayerTimes } from 'adhan';
import * as Location from 'expo-location';

import type { PrayerId } from '../../design/tokens';
import type { PermissionState } from '@/stores/settingsStore';
import type { GeoPoint, PrayerTimes } from '@/stores/prayerStore';
import { usePrayerStore } from '@/stores/prayerStore';
import { useSettingsStore } from '@/stores/settingsStore';

const PRAYER_ORDER: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export function mapPermissionStatus(status: Location.PermissionStatus): PermissionState {
  switch (status) {
    case Location.PermissionStatus.GRANTED:
      return 'granted';
    case Location.PermissionStatus.DENIED:
      return 'denied';
    default:
      return 'unknown';
  }
}

/**
 * Konum + tarihten 5 vakti hesaplar — saf fonksiyon, ağ/izin gerektirmez.
 * Türkiye'de yaygın Hanafi mezhebine göre asr hesaplanır (Diyanet tabanlı Turkey metodu).
 */
export function computePrayerTimes(coordinates: GeoPoint, date: Date): PrayerTimes {
  const params = CalculationMethod.Turkey();
  params.madhab = Madhab.Hanafi;
  const times = new AdhanPrayerTimes(
    new Coordinates(coordinates.latitude, coordinates.longitude),
    date,
    params,
  );

  return {
    fajr: times.fajr.toISOString(),
    dhuhr: times.dhuhr.toISOString(),
    asr: times.asr.toISOString(),
    maghrib: times.maghrib.toISOString(),
    isha: times.isha.toISOString(),
  };
}

/** Kaydedilen son hesaplama bugüne ait değilse (veya hiç yoksa) yeniden hesaplanmalı. */
export function shouldRecalculate(lastCalcAt: string | null, now: Date): boolean {
  if (!lastCalcAt) return true;
  const last = new Date(lastCalcAt);
  return (
    last.getFullYear() !== now.getFullYear() ||
    last.getMonth() !== now.getMonth() ||
    last.getDate() !== now.getDate()
  );
}

export async function requestLocationPermission(): Promise<PermissionState> {
  const current = await Location.getForegroundPermissionsAsync();
  const state =
    current.status === Location.PermissionStatus.GRANTED
      ? 'granted'
      : mapPermissionStatus((await Location.requestForegroundPermissionsAsync()).status);
  useSettingsStore.getState().setPermissionsSnapshot({ location: state });
  return state;
}

export async function getCurrentCoordinates(): Promise<GeoPoint> {
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { latitude: position.coords.latitude, longitude: position.coords.longitude };
}

/** En iyi çaba: şehir adı çözülemezse null döner, akışı bloklamaz. */
export async function resolveCityName(point: GeoPoint): Promise<string | null> {
  try {
    const [address] = await Location.reverseGeocodeAsync(point);
    return address?.city ?? address?.district ?? null;
  } catch {
    return null;
  }
}

/**
 * Ana giriş noktası: izin iste → konum al → vakitleri hesapla → şehir adını çöz →
 * prayerStore'a yaz. İzin verilmezse store'u değiştirmeden döner (Ev ekranı, DESIGN.md
 * §9'daki "konum izni yok" boş durumunu izin anlık görüntüsünden okur).
 */
export async function refreshPrayerTimes(now: Date = new Date()): Promise<void> {
  const permission = await requestLocationPermission();
  if (permission !== 'granted') return;

  const location = await getCurrentCoordinates();
  const todayTimes = computePrayerTimes(location, now);
  const cityName = await resolveCityName(location);
  usePrayerStore.getState().setComputed({ todayTimes, location, cityName });
}

/** Uygulama açılışında/gece yarısı çağrılır; gerçekten gerekmiyorsa ağ/konum isteği yapmaz. */
export async function refreshPrayerTimesIfStale(now: Date = new Date()): Promise<void> {
  if (shouldRecalculate(usePrayerStore.getState().lastCalcAt, now)) {
    await refreshPrayerTimes(now);
  }
}

export const PRAYER_IDS_IN_ORDER = PRAYER_ORDER;
