// src/components/Layout/Layout.tsx
import Header from "./Header";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMessengerPage = location.pathname === "/messenger";

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <PWAInstallBanner />
      <Header />

      <main
        className={
          isMessengerPage
            ? "flex-1 min-h-0 overflow-hidden"
            : "container mx-auto flex-1 px-4 py-8"
        }
      >
        {children}
      </main>

      {!isMessengerPage && (
        <footer className="border-t bg-background/90 py-6 backdrop-blur md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
              © 2026 تمامی حقوق مادی و معنوی این سایت متعلق به myCloud است.
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
