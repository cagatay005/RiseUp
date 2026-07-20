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
