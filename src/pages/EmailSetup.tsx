// src/pages/EmailSetup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AtSign, Loader2, ShieldCheck } from "lucide-react";
import { setLegacyEmail } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthShell, { MailHint } from "@/components/Auth/AuthShell";

const EmailSetup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const setupToken = sessionStorage.getItem("emailSetupToken");

    if (!setupToken) {
      setError("جلسه منقضی شده است. دوباره وارد شوید.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await setLegacyEmail(setupToken, email.trim());
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "ثبت ایمیل ناموفق بود.");
        return;
      }

      if (data.setup_token) sessionStorage.setItem("emailSetupToken", data.setup_token);
      sessionStorage.setItem("pendingEmail", data.masked_email || email);
      navigate("/email-verification-pending");
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="یک مرحله امنیتی جدید"
      subtitle="برای ادامه استفاده از حساب، یک ایمیل معتبر اضافه کن. این ایمیل برای تأیید هویت و بازیابی رمز استفاده می‌شود."
      icon={<AtSign className="h-7 w-7" />}
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="text-sm leading-7 text-blue-950 dark:text-blue-100">
              این تغییر برای افزایش امنیت حساب‌های قدیمی myCloud انجام شده و فقط یک‌بار لازم است.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">ایمیل</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className="h-12 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <MailHint compact />

        {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div>}

        <Button className="h-12 w-full rounded-xl bg-blue-600 font-bold hover:bg-blue-700" disabled={loading}>
          {loading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
          {loading ? "در حال ارسال..." : "ثبت ایمیل و ارسال تأیید"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default EmailSetup;
