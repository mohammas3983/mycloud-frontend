// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { CustomUserSerializer } from '@/lib/api';

interface AuthContextType {
  user: CustomUserSerializer | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => void; // تابع برای رفرش کردن اطلاعات کاربر
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomUserSerializer | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  // از useCallback استفاده می‌کنیم تا این تابع در رندرهای غیرضروری دوباره ساخته نشود
  const fetchUser = useCallback(async () => {
    // اگر توکن وجود ندارد، سریعاً از تابع خارج شو
    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/users/me/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // اگر توکن نامعتبر بود، آن را پاک کن
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      // در صورت خطای شبکه، توکن را پاک کن
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
    setToken(newToken); // این کار باعث اجرای مجدد useEffect بالا و دریافت اطلاعات کاربر می‌شود
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    // کاربر را به داشبورد عمومی هدایت می‌کند
    window.location.href = '/dashboard';
  };

  const refreshUser = () => {
    // به سادگی تابع fetchUser را دوباره صدا می‌زنیم تا اطلاعات آپدیت شود
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