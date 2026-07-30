// src/pages/ResetPassword.tsx
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { confirmPasswordReset } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthShell, { MailHint } from "@/components/Auth/AuthShell";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasValidQuery = useMemo(() => Boolean(params.get("uid") && params.get("token")), [params]);
  const passwordsMatch = password.length > 0 && password === confirm;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = params.get("uid");
    const token = params.get("token");

    if (!uid || !token) {
      setMessage("لینک بازیابی ناقص است. دوباره درخواست بازیابی رمز بده.");
      return;
    }

    if (password !== confirm) {
      setMessage("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await confirmPasswordReset(uid, token, password, confirm);
      const data = await response.json();

      if (!response.ok) {
        const error = Array.isArray(data.error) ? data.error.join("، ") : data.error;
        setMessage(error || "تغییر رمز ناموفق بود.");
        return;
      }

      setSuccess(true);
      setMessage(data.message || "رمز عبور با موفقیت تغییر کرد.");
    } catch {
      setMessage("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={success ? "رمز جدید ذخیره شد" : "یک رمز جدید انتخاب کن"}
      subtitle={
        success
          ? "حالا می‌توانی با رمز جدید وارد حساب myCloud شوی."
          : "برای امنیت بیشتر از یک رمز طولانی و غیرقابل حدس استفاده کن."
      }
      icon={success ? <CheckCircle2 className="h-7 w-7" /> : <KeyRound className="h-7 w-7" />}
    >
      {!success ? (
        <form onSubmit={submit} className="space-y-5">
          {!hasValidQuery && (
            <div className="rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700 dark:bg-red-500/10 dark:text-red-300">
              لینک بازیابی ناقص است. از صفحه «فراموشی رمز» یک لینک جدید درخواست کن.
            </div>
          )}

          <PasswordField
            label="رمز عبور جدید"
            value={password}
            onChange={setPassword}
            show={showPassword}
            toggle={() => setShowPassword((v) => !v)}
          />

          <div className="space-y-2">
            <Label htmlFor="confirm-password">تکرار رمز جدید</Label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`h-12 rounded-xl ${confirm ? (passwordsMatch ? "border-emerald-400" : "border-red-300") : ""}`}
              required
            />
            {confirm && (
              <p className={`text-xs ${passwordsMatch ? "text-emerald-600" : "text-red-600"}`}>
                {passwordsMatch ? "رمزها یکسان هستند." : "رمزها با هم یکسان نیستند."}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="text-xs leading-6 text-slate-600 dark:text-slate-300">
                پس از تغییر رمز، توکن ورود قبلی حساب باطل می‌شود و باید دوباره وارد شوی.
              </p>
            </div>
          </div>

          <MailHint compact />

          {message && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{message}</div>}

          <Button disabled={loading || !hasValidQuery} className="h-12 w-full rounded-xl bg-blue-600 font-bold hover:bg-blue-700">
            {loading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
            {loading ? "در حال تغییر رمز..." : "ثبت رمز جدید"}
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
            {message}
          </div>
          <Button asChild className="h-12 w-full rounded-xl bg-blue-600 font-bold hover:bg-blue-700">
            <Link to="/login">ورود با رمز جدید</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  );
};

const PasswordField = ({
  label,
  value,
  onChange,
  show,
  toggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  toggle: () => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor="new-password">{label}</Label>
    <div className="relative">
      <Input
        id="new-password"
        type={show ? "text" : "password"}
        autoComplete="new-password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl pl-12"
        required
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        aria-label={show ? "مخفی کردن رمز" : "نمایش رمز"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

export default ResetPassword;
