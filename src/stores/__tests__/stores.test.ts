import { beforeEach, describe, expect, it } from '@jest/globals';

import { useAlarmsStore } from '../alarmsStore';
import { usePremiumStore } from '../premiumStore';
import { usePrayerStore } from '../prayerStore';
import { useSettingsStore } from '../settingsStore';
import { useStreakStore } from '../streakStore';

describe('settingsStore', () => {
  it('varsayılanlar: aydınlık tema, EN arayüz, TR meal, onboarding bitmemiş', () => {
    const s = useSettingsStore.getState();
    expect(s.theme).toBe('light');
    expect(s.language).toBe('en');
    expect(s.translationLanguage).toBe('tr');
    expect(s.onboardingDone).toBe(false);
    expect(s.permissionsSnapshot).toEqual({
      location: 'unknown',
      notifications: 'unknown',
      criticalAlerts: 'unknown',
    });
  });

  it('toggleTheme light↔dark arasında gidip gelir', () => {
    const { toggleTheme } = useSettingsStore.getState();
    toggleTheme();
    expect(useSettingsStore.getState().theme).toBe('dark');
    toggleTheme();
    expect(useSettingsStore.getState().theme).toBe('light');
  });

  it('meal dili arayüz dilinden bağımsız değişir', () => {
    const { setLanguage, setTranslationLanguage } = useSettingsStore.getState();
    setLanguage('tr');
    setTranslationLanguage('ur');
    const s = useSettingsStore.getState();
    expect(s.language).toBe('tr');
    expect(s.translationLanguage).toBe('ur');
  });

  it('izin anlık görüntüsü kısmi güncellenir, diğer alanlar korunur', () => {
    useSettingsStore.getState().setPermissionsSnapshot({ location: 'granted' });
    const snap = useSettingsStore.getState().permissionsSnapshot;
    expect(snap.location).toBe('granted');
    expect(snap.notifications).toBe('unknown');
  });
});

describe('alarmsStore', () => {
  beforeEach(() => {
    useAlarmsStore.setState({ alarms: [] });
  });

  it('alarm ekler: varsayılan ofset 0, etkin, görevsiz', () => {
    const alarm = useAlarmsStore.getState().addAlarm({ prayerId: 'fajr' });
    expect(alarm.offsetMinutes).toBe(0);
    expect(alarm.enabled).toBe(true);
    expect(alarm.taskIds).toEqual([]);
    expect(useAlarmsStore.getState().alarms).toHaveLength(1);
  });

  it('toggle yalnız hedef alarmı değiştirir', () => {
    const a = useAlarmsStore.getState().addAlarm({ prayerId: 'fajr' });
    const b = useAlarmsStore.getState().addAlarm({ prayerId: 'isha' });
    useAlarmsStore.getState().toggleAlarm(a.id);
    const alarms = useAlarmsStore.getState().alarms;
    expect(alarms.find((x) => x.id === a.id)?.enabled).toBe(false);
    expect(alarms.find((x) => x.id === b.id)?.enabled).toBe(true);
  });

  it('görev atama ve silme', () => {
    const a = useAlarmsStore.getState().addAlarm({ prayerId: 'fajr' });
    useAlarmsStore.getState().setAlarmTasks(a.id, ['qibla', 'recitation']);
    expect(useAlarmsStore.getState().alarms[0]!.taskIds).toEqual(['qibla', 'recitation']);
    useAlarmsStore.getState().removeAlarm(a.id);
    expect(useAlarmsStore.getState().alarms).toHaveLength(0);
  });
});

describe('streakStore', () => {
  it('applyEngineResult kısmi state yazar, reset başa döndürür', () => {
    useStreakStore.getState().applyEngineResult({
      currentStreak: 7,
      bestStreak: 12,
      freezes: 1,
      dayLog: { '2026-07-19': 'done' },
    });
    let s = useStreakStore.getState();
    expect(s.currentStreak).toBe(7);
    expect(s.bestStreak).toBe(12);
    expect(s.dayLog['2026-07-19']).toBe('done');

    useStreakStore.getState().reset();
    s = useStreakStore.getState();
    expect(s.currentStreak).toBe(0);
    expect(s.dayLog).toEqual({});
  });
});

describe('premiumStore', () => {
  it('entitlement yazılır ve temizlenir', () => {
    usePremiumStore.getState().setEntitlement({
      isPremium: true,
      plan: 'yearly',
      trialEndsAt: '2026-07-26T00:00:00Z',
    });
    expect(usePremiumStore.getState().isPremium).toBe(true);
    usePremiumStore.getState().clearEntitlement();
    expect(usePremiumStore.getState().isPremium).toBe(false);
    expect(usePremiumStore.getState().plan).toBeNull();
  });
});

describe('prayerStore', () => {
  it('setComputed vakitleri ve lastCalcAt damgasını yazar', () => {
    usePrayerStore.getState().setComputed({
      todayTimes: {
        fajr: '2026-07-19T05:12:00+03:00',
        dhuhr: '2026-07-19T13:04:00+03:00',
        asr: '2026-07-19T16:48:00+03:00',
        maghrib: '2026-07-19T19:55:00+03:00',
        isha: '2026-07-19T21:20:00+03:00',
      },
      location: { latitude: 41.01, longitude: 28.97 },
      cityName: 'Istanbul',
    });
    const s = usePrayerStore.getState();
    expect(s.cityName).toBe('Istanbul');
    expect(s.todayTimes?.fajr).toContain('05:12');
    expect(s.lastCalcAt).not.toBeNull();
  });
});
