import type { Alarm } from '@/stores/alarmsStore';
import type { PrayerTimes } from '@/stores/prayerStore';
import type { PrayerId } from '../../design/tokens';
import { PRAYER_IDS_IN_ORDER } from './PrayerTimesService';

/** Alarmın gerçek çalma saati: vaktin hesaplanan zamanı + dakika ofseti. */
export function getAlarmClockTime(alarm: Alarm, todayTimes: PrayerTimes | null): Date | null {
  if (!todayTimes) return null;
  const base = new Date(todayTimes[alarm.prayerId]);
  return new Date(base.getTime() + alarm.offsetMinutes * 60_000);
}

export interface NextPrayer {
  prayerId: PrayerId;
  time: Date;
}

/** Bugünün vakitleri arasından şu andan sonraki ilkini bulur; hepsi geçtiyse null döner. */
export function getNextPrayer(todayTimes: PrayerTimes | null, now: Date): NextPrayer | null {
  if (!todayTimes) return null;

  for (const prayerId of PRAYER_IDS_IN_ORDER) {
    const time = new Date(todayTimes[prayerId]);
    if (time.getTime() > now.getTime()) {
      return { prayerId, time };
    }
  }
  return null;
}

/** "1h 24m" / "24m" / "Now" biçiminde kısa geri sayım metni. */
export function formatCountdown(target: Date, now: Date): string {
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return 'Now';

  const totalMinutes = Math.ceil(diffMs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

// ---------------------------------------------------------------------------
// Analog kadran (AlarmSetup, issue #7)
// ---------------------------------------------------------------------------

/** Konum henüz yokken kadranın gösterebileceği kaba varsayılan saatler (yalnız görsel). */
const FALLBACK_HOUR: Record<PrayerId, number> = {
  fajr: 5,
  dhuhr: 13,
  asr: 16.5,
  maghrib: 19.5,
  isha: 21,
};

/** Kadranın taban zamanı: gerçek vakit varsa o, yoksa kaba bir tahmin. */
export function getPickerBaseTime(prayerId: PrayerId, todayTimes: PrayerTimes | null, now: Date): Date {
  if (todayTimes) return new Date(todayTimes[prayerId]);
  const hour = FALLBACK_HOUR[prayerId];
  const result = new Date(now);
  result.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0);
  return result;
}

/**
 * Dairenin merkezine göre (dx,dy) noktasının 12 yönünden saat yönünde açısı (0-360°).
 * dx/dy, dokunuşun kadran view'ının merkezine göre ofseti (locationX/Y - yarıçap).
 */
export function pointToAngleDeg(dx: number, dy: number): number {
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return deg < 0 ? deg + 360 : deg;
}

/** 0-360° açıyı saat içindeki dakikaya çevirir (360° = 60 dk). */
export function angleToMinuteOfHour(angleDeg: number): number {
  return Math.round((angleDeg / 360) * 60) % 60;
}

/**
 * İki dakika-içi-konum arasındaki en kısa imzalı farkı verir, [-30, 30] aralığında.
 * "±dakika öncesine/sonrasına" ince ayarı için — saati değiştirmez, yalnız yelkovanı.
 */
export function shortestMinuteDelta(base: number, target: number): number {
  let delta = target - base;
  if (delta > 30) delta -= 60;
  if (delta < -30) delta += 60;
  return delta;
}
