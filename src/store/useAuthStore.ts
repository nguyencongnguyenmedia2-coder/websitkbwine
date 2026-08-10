import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types';
import { MOCK_USERS } from '@/lib/data/mockData';
import { supabase } from '@/lib/supabase/client';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserProfile['role']) => boolean;
  loginWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithSupabase: (data: { email: string; password: string; fullName: string; phone: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: MOCK_USERS[0], // Default logged in as Super Admin for demonstration
      isAuthenticated: true,
      isLoading: false,

      // Real Supabase Registration
      registerWithSupabase: async ({ email, password, fullName, phone }) => {
        set({ isLoading: true });
        try {
          // 1. Call Supabase Auth SignUp
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone: phone,
              },
            },
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          // 2. Build UserProfile object
          const newUser: UserProfile = {
            id: data.user?.id || `u-${Date.now()}`,
            email: email,
            fullName: fullName,
            phone: phone,
            role: 'customer',
            tier: 'New',
            totalSpent: 0,
            totalOrders: 0,
            createdAt: new Date().toISOString(),
          };

          // 3. Try upserting to Supabase profiles table
          try {
            await supabase.from('profiles').upsert([
              {
                id: newUser.id,
                email: newUser.email,
                full_name: newUser.fullName,
                phone: newUser.phone,
                role: 'customer',
              },
            ]);
          } catch (dbErr) {
            console.log('Profiles table fallback:', dbErr);
          }

          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err: any) {
          set({ isLoading: false });
          return { success: false, error: err?.message || 'Không thể đăng ký tài khoản.' };
        }
      },

      // Real Supabase Login
      loginWithSupabase: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          const suUser = data.user;
          const userProfile: UserProfile = {
            id: suUser.id,
            email: suUser.email || email,
            fullName: suUser.user_metadata?.full_name || email.split('@')[0],
            phone: suUser.user_metadata?.phone || '0909 000 111',
            role: suUser.user_metadata?.role || 'customer',
            tier: 'VIP',
            totalSpent: 0,
            totalOrders: 0,
            createdAt: suUser.created_at || new Date().toISOString(),
          };

          set({ user: userProfile, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err: any) {
          set({ isLoading: false });
          return { success: false, error: err?.message || 'Không thể đăng nhập.' };
        }
      },

      login: (email, role = 'customer') => {
        const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          set({ user: found, isAuthenticated: true });
          return true;
        }
        const newUser: UserProfile = {
          id: `u-${Date.now()}`,
          email,
          fullName: email.split('@')[0],
          phone: '0909 000 111',
          role: role,
          tier: 'New',
          totalSpent: 0,
          totalOrders: 0,
          createdAt: new Date().toISOString(),
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.log('Signout notice:', e);
        }
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'winecellar-pro-auth',
    }
  )
);
