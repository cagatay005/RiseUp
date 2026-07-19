import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from './storage';

export type PremiumPlan = 'monthly' | 'yearly';

interface PremiumState {
  /** Tüm premium kapılar (TaskPicker, görev route guard'ları) yalnız bunu okur. */
  isPremium: boolean;
  plan: PremiumPlan | null;
  trialEndsAt: string | null;
  /** IAPService (issue #18) satın alma/restore sonuçlarını buraya yazar. */
  setEntitlement: (input: { isPremium: boolean; plan: PremiumPlan | null; trialEndsAt: string | null }) => void;
  clearEntitlement: () => void;
}

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set) => ({
      isPremium: false,
      plan: null,
      trialEndsAt: null,
      setEntitlement: ({ isPremium, plan, trialEndsAt }) => set({ isPremium, plan, trialEndsAt }),
      clearEntitlement: () => set({ isPremium: false, plan: null, trialEndsAt: null }),
    }),
    { name: 'premium', storage: persistStorage },
  ),
);
