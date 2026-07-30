// src/components/Layout/Layout.tsx
import Header from "./Header";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  // بررسی می‌کنیم آیا کاربر در صفحه پیام‌رسان است؟
  const isMessengerPage = location.pathname.startsWith('/messenger');

  return (
    <div className="min-h-screen w-full flex flex-col bg-background font-sans antialiased">
      {/* 1. هدر همیشه بالا است */}
      <Header />
      
      {/* 2. بدنه اصلی */}
      {/* اگر در مسنجر باشیم، ارتفاع را فیکس می‌کنیم تا اسکرول اضافی حذف شود */}
      <main className={`flex-1 flex flex-col w-full ${isMessengerPage ? 'h-[calc(100vh-64px)] overflow-hidden' : 'container mx-auto px-4 py-8'}`}>
        {children}
      </main>

      {/* 3. فوتر (فقط اگر در مسنجر نباشیم) */}
      {!isMessengerPage && (
        <footer className="border-t py-6 md:py-0 mt-auto">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
              © 2026 تمامی حقوق متعلق به myCloud است.
            </p>
            <div className="text-center text-sm text-muted-foreground">
              <p>طراحی و توسعه توسط محمدصادق قاسمی</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;