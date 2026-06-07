import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserPublic {
  id: string;
  username: string;
  avatar: string;
  level: number;
}

interface AuthState {
  token: string | null;
  user: UserPublic | null;
  setAuth: (token: string, user: UserPublic) => void;
  setUser: (user: UserPublic) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'loki-auth' },
  ),
);
