// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
// ۱. وارد کردن تابع صحیح از فایل api
import { CustomUserSerializer, fetchUserProfile } from '@/lib/api';

interface AuthContextType {
  user: CustomUserSerializer | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomUserSerializer | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    setIsLoading(true);
    // ۲. جایگزین کردن بلوک try/catch با کد جدید
    try {
      // استفاده از تابع fetchUserProfile که آدرس API را از متغیرهای محیطی می‌خواند
      const userData = await fetchUserProfile(token);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user', error);
      // اگر توکن نامعتبر بود یا خطا رخ داد، از سیستم خارج شو
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    window.location.href = '/dashboard';
  };

  const refreshUser = () => {
    fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};