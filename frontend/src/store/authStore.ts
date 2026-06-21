import { create } from 'zustand';

// Define strict types for better reliability
export interface User {
  id: string | number;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: getStoredUser(),
  
  login: (token: string, user: User) => { 
    localStorage.setItem('token', token); 
    localStorage.setItem('user', JSON.stringify(user)); 
    set({ token, user }); 
  },
  
  logout: () => { 
    localStorage.removeItem('token'); 
    localStorage.removeItem('user'); 
    set({ token: null, user: null }); 
  },
}));
