import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { PrayerId, TaskId } from '../../design/tokens';
import { persistStorage } from './storage';

/**
 * Alarm sabit saat değil "vakit + ofset" olarak saklanır: vakitler her gün
 * kaydığı için gerçek çalma saati her gece yeniden hesaplanır (bkz. ARCHITECTURE §8).
 */
export interface Alarm {
  id: string;
  prayerId: PrayerId;
  /** Vakte göre dakika ofseti; 0 = tam vaktinde, -10 = 10 dk önce. */
  offsetMinutes: number;
  enabled: boolean;
  taskIds: TaskId[];
  createdAt: string;
}

interface AlarmsState {
  alarms: Alarm[];
  addAlarm: (input: Pick<Alarm, 'prayerId'> & Partial<Pick<Alarm, 'offsetMinutes' | 'taskIds'>>) => Alarm;
  removeAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  setAlarmTasks: (id: string, taskIds: TaskId[]) => void;
  setAlarmOffset: (id: string, offsetMinutes: number) => void;
}

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Not: Her mutasyonun AlarmScheduler'ı senkron tetiklemesi issue #6'da bağlanacak
// (store subscribe → yeniden planlama). Store kendisi servis import etmez.
export const useAlarmsStore = create<AlarmsState>()(
  persist(
    (set) => ({
      alarms: [],
      addAlarm: (input) => {
        const alarm: Alarm = {
          id: createId(),
          prayerId: input.prayerId,
          offsetMinutes: input.offsetMinutes ?? 0,
          enabled: true,
          taskIds: input.taskIds ?? [],
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ alarms: [...s.alarms, alarm] }));
        return alarm;
      },
      removeAlarm: (id) => set((s) => ({ alarms: s.alarms.filter((a) => a.id !== id) })),
      toggleAlarm: (id) =>
        set((s) => ({
          alarms: s.alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
        })),
      setAlarmTasks: (id, taskIds) =>
        set((s) => ({
          alarms: s.alarms.map((a) => (a.id === id ? { ...a, taskIds } : a)),
        })),
      setAlarmOffset: (id, offsetMinutes) =>
        set((s) => ({
          alarms: s.alarms.map((a) => (a.id === id ? { ...a, offsetMinutes } : a)),
        })),
    }),
    { name: 'alarms', storage: persistStorage },
  ),
);
