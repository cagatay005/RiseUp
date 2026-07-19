import { MMKV } from 'react-native-mmkv';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

const mmkv = new MMKV({ id: 'riseup' });

const mmkvStateStorage: StateStorage = {
  setItem: (name, value) => {
    mmkv.set(name, value);
  },
  getItem: (name) => mmkv.getString(name) ?? null,
  removeItem: (name) => {
    mmkv.delete(name);
  },
};

/** Tüm store'ların ortak persist hedefi — MMKV senkron çalışır, hydration beklemesi yoktur. */
export const persistStorage = createJSONStorage(() => mmkvStateStorage);
