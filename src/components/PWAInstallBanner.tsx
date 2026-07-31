// src/components/PWAInstallBanner.tsx
import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const PWAInstallBanner = () => {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("pwa-banner-dismissed") === "1");

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!promptEvent || dismissed) return null;

  const install = async () => {
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  return (
    <div dir="rtl" className="sticky top-0 z-[70] border-b border-blue-400/20 bg-gradient-to-l from-slate-950 via-blue-950 to-blue-700 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
          <Download className="h-5 w-5 text-cyan-200" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-black">myCloud را مثل یک اپ نصب کن</p>
          <p className="hidden text-xs text-blue-100 sm:block">دسترسی سریع‌تر از دسکتاپ یا صفحه اصلی، بدون نیاز به فروشگاه.</p>
        </div>

        <Button
          onClick={install}
          size="sm"
          className="rounded-xl bg-white font-black text-blue-700 hover:bg-blue-50"
        >
          نصب
        </Button>

        <button
          type="button"
          aria-label="بستن"
          onClick={() => {
            sessionStorage.setItem("pwa-banner-dismissed", "1");
            setDismissed(true);
          }}
          className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
