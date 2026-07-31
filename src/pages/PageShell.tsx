// src/components/Layout/PageShell.tsx
import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageShellProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

const PageShell = ({ title, subtitle, eyebrow, icon, action, children }: PageShellProps) => (
  <div dir="rtl" className="relative min-h-full overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,.08),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,.07),transparent_32%)]" />
    <div className="relative mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:py-8 lg:px-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .35 }}
        className="mb-7 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur-xl sm:p-7 dark:border-slate-800 dark:bg-slate-900/80"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            {icon && (
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
                {icon}
              </div>
            )}
            <div>
              {eyebrow && <p className="mb-1 text-xs font-extrabold tracking-wide text-blue-600 dark:text-blue-400">{eyebrow}</p>}
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">{title}</h1>
              {subtitle && <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </motion.header>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4, delay: .05 }}>
        {children}
      </motion.div>
    </div>
  </div>
);

export default PageShell;
