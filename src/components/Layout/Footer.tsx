// src/components/Layout/Layout.tsx

import Header from "./Header";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // بررسی می‌کنیم آیا در صفحه پیام‌رسان هستیم؟
  const isMessengerPage = location.pathname === '/messenger';

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <Header />
      
      {/* اگر در صفحه پیام‌رسان باشیم، padding و height را متفاوت تنظیم می‌کنیم 
          تا صفحه فیکس شود و نپرد 
      */}
      <main className={`flex-1 ${isMessengerPage ? 'h-[calc(100vh-64px)] overflow-hidden' : 'container mx-auto px-4 py-8'}`}>
        {children}
      </main>

      {/* 👇 فوتر را فقط وقتی نشان بده که در صفحه پیام‌رسان نیستیم 👇 */}
      {!isMessengerPage && (
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
              © 2026 تمامی حقوق مادی و معنوی این سایت متعلق به myCloud است.
            </p>
            <div className="text-center text-sm text-muted-foreground">
              <p>طراحی و توسعه توسط محمدصادق قاسمی</p>
              <p className="text-xs mt-1">آخرین بروزرسانی: بهمن ۱۴۰۴</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;