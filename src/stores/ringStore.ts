import { create } from 'zustand';

import type { TaskId } from '../../design/tokens';

/**
 * Çalan alarmın oturum durumu. Bilinçli olarak persist EDİLMEZ: uygulama
 * kapanıp açılınca yarım kalmış çalma oturumu hortlamamalı — alarm bildirimi
 * hâlâ duruyorsa ekran bildirime dokununca yeniden açılır (AlarmScheduler).
 */
interface RingState {
  activeAlarmId: string | null;
  completedTaskIds: TaskId[];
  /** Aynı alarm için tekrar çağrılırsa ilerleme korunur; farklı alarm sıfırlar. */
  startRing: (alarmId: string) => void;
  completeTask: (taskId: TaskId) => void;
  clearRing: () => void;
}

export const useRingStore = create<RingState>()((set) => ({
  activeAlarmId: null,
  completedTaskIds: [],
  startRing: (alarmId) =>
    set((s) => (s.activeAlarmId === alarmId ? s : { activeAlarmId: alarmId, completedTaskIds: [] })),
  completeTask: (taskId) =>
    set((s) => ({
      completedTaskIds: s.completedTaskIds.includes(taskId)
        ? s.completedTaskIds
        : [...s.completedTaskIds, taskId],
    })),
  clearRing: () => set({ activeAlarmId: null, completedTaskIds: [] }),
}));
