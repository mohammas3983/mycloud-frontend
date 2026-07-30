// src/pages/VerifyEmail.tsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { confirmEmailVerification } from "@/lib/api";
import { Button } from "@/components/ui/button";
import AuthShell, { MailHint } from "@/components/Auth/AuthShell";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("در حال بررسی لینک تأیید...");

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setState("error");
      setMessage("لینک تأیید ناقص است.");
      return;
    }

    confirmEmailVerification(token)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "تأیید ناموفق بود.");

        setState("success");
        setMessage(data.message || "ایمیل با موفقیت تأیید شد.");
        sessionStorage.removeItem("emailSetupToken");
        sessionStorage.removeItem("pendingEmail");
      })
      .catch((error) => {
        setState("error");
        setMessage(error instanceof Error ? error.message : "تأیید ایمیل ناموفق بود.");
      });
  }, [params]);

  const icon =
    state === "loading" ? <Loader2 className="h-7 w-7 animate-spin" /> :
    state === "success" ? <CheckCircle2 className="h-7 w-7" /> :
    <AlertCircle className="h-7 w-7" />;

  return (
    <AuthShell
      title={state === "loading" ? "تأیید ایمیل" : state === "success" ? "ایمیل تأیید شد" : "لینک تأیید معتبر نیست"}
      subtitle={state === "success" ? "حساب تو آماده ورود است." : "وضعیت لینک تأیید ایمیل در حال بررسی است."}
      icon={icon}
    >
      <div className="space-y-5">
        <div className={`rounded-2xl border p-5 text-sm leading-7 ${
          state === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100"
            : state === "error"
              ? "border-red-200 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200"
              : "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-100"
        }`}>
          <div className="flex items-start gap-3">
            <MailCheck className="mt-1 h-5 w-5 shrink-0" />
            <p>{message}</p>
          </div>
        </div>

        {state === "error" && <MailHint compact />}

        {state !== "loading" && (
          <Button asChild className="h-12 w-full rounded-xl bg-blue-600 font-bold hover:bg-blue-700">
            <Link to="/login">ورود به myCloud</Link>
          </Button>
        )}
      </div>
    </AuthShell>
  );
};

export default VerifyEmail;
