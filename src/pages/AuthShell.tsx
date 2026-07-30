// src/components/Auth/AuthShell.tsx
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Cloud, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AuthShellProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export const MailHint = ({ compact = false }: { compact?: boolean }) => (
  <div className={`rounded-2xl border border-amber-200/70 bg-amber-50/80 text-amber-950 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100 ${compact ? "p-3" : "p-4"}`}>
    <p className="text-sm leading-6">
      ایمیل را پیدا نکردید؟ پوشه‌های <strong>Spam</strong>، <strong>Junk</strong> و
      <strong> Promotions</strong> را هم بررسی کنید؛ بعضی سرویس‌ها پیام‌های خودکار را آنجا قرار می‌دهند.
    </p>
  </div>
);

const AuthShell = ({ title, subtitle, icon, children, footer, wide = false }: AuthShellProps) => {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-900 dark:text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.24),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_36%)]" />
      <div className="absolute -right-32 top-16 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/30 dark:bg-slate-900/95 ${
            wide ? "max-w-6xl lg:grid-cols-[0.9fr_1.1fr]" : "max-w-5xl lg:grid-cols-2"
          }`}
        >
          <section className="relative hidden min-h-[640px] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
            <div className="relative">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/12 shadow-lg backdrop-blur">
                  <Cloud className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-2xl font-black tracking-tight">myCloud</p>
                  <p className="text-xs text-blue-100">فضای آموزشی دانشجویان</p>
                </div>
              </Link>

              <div className="mt-20 max-w-md">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-blue-50 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  تجربه‌ای ساده‌تر، امن‌تر و سریع‌تر
                </div>
                <h2 className="text-4xl font-black leading-[1.35]">
                  همه‌چیز برای یادگیری،
                  <br />
                  در یک فضای مرتب.
                </h2>
                <p className="mt-5 text-sm leading-7 text-blue-100/90">
                  دسترسی به درس‌ها، محتواها و حساب کاربری با رابطی یکپارچه و امن.
                </p>
              </div>
            </div>

            <div className="relative grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <ShieldCheck className="h-5 w-5 text-cyan-200" />
                <div>
                  <p className="text-sm font-bold">امنیت حساب</p>
                  <p className="mt-0.5 text-xs text-blue-100">تأیید ایمیل و بازیابی رمز امن</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 sm:p-10 lg:p-12 dark:bg-slate-900">
            <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center">
              <div className="mb-8 lg:hidden">
                <Link to="/" className="inline-flex items-center gap-2 font-black text-blue-600 dark:text-blue-400">
                  <Cloud className="h-6 w-6" />
                  myCloud
                </Link>
              </div>

              <div className="mb-8">
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                  {icon ?? <Cloud className="h-7 w-7" />}
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h1>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{subtitle}</p>
              </div>

              {children}

              {footer && (
                <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  {footer}
                </div>
              )}
            </div>
          </section>
        </motion.div>
      </div>
    </main>
  );
};

export default AuthShell;
