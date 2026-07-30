// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser } from "@/lib/api";
import AuthShell from "@/components/Auth/AuthShell";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser({ username: username.trim(), password });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "شماره دانشجویی یا رمز عبور اشتباه است.");
        return;
      }

      if (data.requires_email_setup && data.setup_token) {
        sessionStorage.setItem("emailSetupToken", data.setup_token);
        navigate("/email-setup");
        return;
      }

      if (data.requires_email_verification && data.setup_token) {
        sessionStorage.setItem("emailSetupToken", data.setup_token);
        sessionStorage.setItem("pendingEmail", data.masked_email || "");
        navigate("/email-verification-pending");
        return;
      }

      if (data.auth_token) {
        login(data.auth_token);
        navigate("/dashboard");
        return;
      }

      setError("پاسخ ورود نامعتبر بود.");
    } catch {
      setError("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="خوش برگشتی"
      subtitle="با شماره دانشجویی و رمز عبورت وارد حساب myCloud شو."
      icon={<LogIn className="h-7 w-7" />}
      footer={
        <p>
          حساب نداری؟{" "}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
            ساخت حساب جدید
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username">شماره دانشجویی</Label>
          <Input
            id="username"
            inputMode="numeric"
            autoComplete="username"
            placeholder="مثلاً 402..."
            className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/70"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">رمز عبور</Label>
            <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
              رمز را فراموش کردی؟
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="رمز عبور"
              className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-12 pr-4 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-slate-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-blue-600 text-base font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <LogIn className="ml-2 h-5 w-5" />}
          {isLoading ? "در حال ورود..." : "ورود به myCloud"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default Login;
