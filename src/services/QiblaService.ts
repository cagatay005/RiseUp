import { Coordinates, Qibla } from 'adhan';

import type { GeoPoint } from '@/stores/prayerStore';

export function getQiblaBearing(location: GeoPoint): number {
  return Qibla(new Coordinates(location.latitude, location.longitude));
}

export function magnetometerHeading(x: number, y: number): number {
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function angularDifference(a: number, b: number): number {
  return Math.abs(((a - b + 540) % 360) - 180);
}
