// src/pages/EmailVerificationPending.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Loader2, MailCheck, RefreshCcw } from "lucide-react";
import { resendEmailVerification } from "@/lib/api";
import { Button } from "@/components/ui/button";
import AuthShell, { MailHint } from "@/components/Auth/AuthShell";

const EmailVerificationPending = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const email = sessionStorage.getItem("pendingEmail") || "ایمیل ثبت‌شده";

  const resend = async () => {
    const setupToken = sessionStorage.getItem("emailSetupToken");
    if (!setupToken) {
      setMessage("جلسه منقضی شده است؛ دوباره وارد شوید.");
      return;
    }

    setResending(true);
    setMessage(null);

    try {
      const response = await resendEmailVerification(setupToken);
      const data = await response.json();
      setMessage(response.ok ? (data.message || "لینک دوباره ارسال شد.") : (data.error || "ارسال ناموفق بود."));
    } catch {
      setMessage("ارتباط با سرور برقرار نشد.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      title="ایمیل را تأیید کن"
      subtitle={`لینک تأیید برای ${email} ارسال شده است. ایمیل را باز کن و روی لینک تأیید بزن.`}
      icon={<MailCheck className="h-7 w-7" />}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div className="text-sm leading-7 text-emerald-950 dark:text-emerald-100">
              <p className="font-bold">پیام ارسال شد</p>
              <p>پس از تأیید ایمیل، به صفحه ورود برگرد و دوباره وارد حساب شو.</p>
            </div>
          </div>
        </div>

        <MailHint />

        {message && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {message}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={resend} variant="outline" disabled={resending} className="h-12 rounded-xl">
            {resending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="ml-2 h-4 w-4" />}
            {resending ? "در حال ارسال..." : "ارسال دوباره"}
          </Button>

          <Button asChild className="h-12 rounded-xl bg-blue-600 font-bold hover:bg-blue-700">
            <Link to="/login">بازگشت به ورود</Link>
          </Button>
        </div>
      </div>
    </AuthShell>
  );
};

export default EmailVerificationPending;
