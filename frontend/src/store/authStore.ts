import { create } from 'zustand';
export const useAuthStore = create<any>((set) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  login: (token: string, user: any) => { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); set({ token, user }); },
  logout: () => { localStorage.removeItem('token'); localStorage.removeItem('user'); set({ token: null, user: null }); },
}));
