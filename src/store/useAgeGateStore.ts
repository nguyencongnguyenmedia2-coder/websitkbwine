import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AgeGateState {
  isVerified: boolean;
  verifyAge: () => void;
}

export const useAgeGateStore = create<AgeGateState>()(
  persist(
    (set) => ({
      isVerified: false,
      verifyAge: () => set({ isVerified: true }),
    }),
    {
      name: 'winecellar-pro-age-verification',
    }
  )
);
