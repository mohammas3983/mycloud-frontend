// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";
import { requestPasswordReset } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthShell, { MailHint } from "@/components/Auth/AuthShell";

const ForgotPassword = () => {
  const [studentId, setStudentId] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(studentId.trim());
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={sent ? "ایمیلت را بررسی کن" : "بازیابی رمز عبور"}
      subtitle={
        sent
          ? "اگر حساب معتبر و دارای ایمیل باشد، لینک امن تغییر رمز برای آن ارسال شده است."
          : "شماره دانشجویی را وارد کن تا لینک بازیابی برای ایمیل ثبت‌شده حساب ارسال شود."
      }
      icon={sent ? <Mail className="h-7 w-7" /> : <KeyRound className="h-7 w-7" />}
      footer={
        <Link to="/login" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:underline dark:text-blue-400">
          <ArrowRight className="h-4 w-4" />
          بازگشت به ورود
        </Link>
      }
    >
      {!sent ? (
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="student-id">شماره دانشجویی</Label>
            <Input
              id="student-id"
              inputMode="numeric"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="شماره دانشجویی"
              className="h-12 rounded-xl"
              required
            />
          </div>

          <MailHint compact />

          <Button className="h-12 w-full rounded-xl bg-blue-600 font-bold hover:bg-blue-700" disabled={loading}>
            {loading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
            {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-sm leading-7 text-emerald-950 dark:text-emerald-100">
                برای حفظ حریم خصوصی، مشخص نمی‌کنیم این شماره دانشجویی در سیستم وجود دارد یا نه.
              </p>
            </div>
          </div>

          <MailHint />

          <Button asChild className="h-12 w-full rounded-xl bg-blue-600 font-bold hover:bg-blue-700">
            <Link to="/login">بازگشت به ورود</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
