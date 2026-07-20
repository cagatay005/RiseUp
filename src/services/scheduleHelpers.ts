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
// Alarm kurma ekranı — dijital saat (AlarmSetup, issue #7 revizyonu)
// ---------------------------------------------------------------------------

/** Konum henüz yokken gösterilebilecek kaba varsayılan saatler (yalnız görsel). */
const FALLBACK_HOUR: Record<PrayerId, number> = {
  fajr: 5,
  dhuhr: 13,
  asr: 16.5,
  maghrib: 19.5,
  isha: 21,
};

/** Seçilen vaktin taban zamanı: gerçek vakit varsa o, yoksa kaba bir tahmin. */
export function getPickerBaseTime(prayerId: PrayerId, todayTimes: PrayerTimes | null, now: Date): Date {
  if (todayTimes) return new Date(todayTimes[prayerId]);
  const hour = FALLBACK_HOUR[prayerId];
  const result = new Date(now);
  result.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0);
  return result;
}

/**
 * Kullanıcının dijital saat ile seçtiği zaman ile vaktin taban zamanı arasındaki
 * dakika farkı — sınırsız (kullanıcıya tam özgürlük), gün sınırını en kısa yoldan
 * saracak şekilde (-720, 720] aralığında (24 saatlik saatte herhangi bir noktaya
 * ulaşmak için ±12 saat yeterlidir). Yalnızca saat/dakika bileşenleri kıyaslanır,
 * takvim günü yok sayılır (native seçici tarihi değiştirmez, yalnız saati döner).
 */
export function computeOffsetMinutes(base: Date, picked: Date): number {
  const baseMinutes = base.getHours() * 60 + base.getMinutes();
  const pickedMinutes = picked.getHours() * 60 + picked.getMinutes();
  let delta = pickedMinutes - baseMinutes;
  if (delta > 720) delta -= 1440;
  if (delta <= -720) delta += 1440;
  return delta;
}
