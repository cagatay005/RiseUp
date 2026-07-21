import { Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';

import { rules } from '../../design/tokens';
import { angularDifference, getQiblaBearing, magnetometerHeading } from '@/services/QiblaService';
import type { GeoPoint } from '@/stores/prayerStore';

export interface QiblaHoldState {
  heading: number;
  bearing: number | null;
  aligned: boolean;
  /** rules.qiblaHoldSeconds'a ulaşınca true — kullanıcı görevi tamamladı. */
  done: boolean;
  secondsRemaining: number;
}

/**
 * Kıble görevi (#10) ve kaza doğrulama (#14) aynı hiza-ve-tut mantığını
 * paylaşır: manyetometreyi dinler, ±qiblaToleranceDegrees içinde
 * qiblaHoldSeconds boyunca tutulunca `done`'ı true yapar.
 */
export function useQiblaHold(location: GeoPoint | null): QiblaHoldState {
  const [heading, setHeading] = useState(0);
  const [heldSeconds, setHeldSeconds] = useState(0);
  const bearing = location ? getQiblaBearing(location) : null;
  const aligned = bearing !== null && angularDifference(heading, bearing) <= rules.qiblaToleranceDegrees;

  useEffect(() => {
    Magnetometer.setUpdateInterval(150);
    const sub = Magnetometer.addListener(({ x, y }) => setHeading(magnetometerHeading(x, y)));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!aligned) {
      setHeldSeconds(0);
      return;
    }
    const timer = setInterval(() => setHeldSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [aligned]);

  return {
    heading,
    bearing,
    aligned,
    done: heldSeconds >= rules.qiblaHoldSeconds,
    secondsRemaining: Math.max(0, rules.qiblaHoldSeconds - heldSeconds),
  };
}
