// src/pages/Register.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchFaculties, registerUser, Faculty } from "@/lib/api";
import AuthShell, { MailHint } from "@/components/Auth/AuthShell";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFaculties()
      .then(setFaculties)
      .catch(() => setError("دریافت لیست دانشکده‌ها ناموفق بود."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyId) {
      setError("دانشکده را انتخاب کنید.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await registerUser({
        username: studentId.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        student_id: studentId.trim(),
        major: major.trim(),
        phone_number: phoneNumber.trim(),
        faculty_id: Number(facultyId),
      });

      if (!response.ok) {
        const data = await response.json();
        const key = Object.keys(data)[0];
        const value = data[key];
        setError(Array.isArray(value) ? value[0] : String(value || "ثبت‌نام ناموفق بود."));
        return;
      }

      navigate("/login", { replace: true });
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      wide
      title="ساخت حساب myCloud"
      subtitle="اطلاعات واقعی خودت را وارد کن. ایمیل برای امنیت حساب و بازیابی رمز استفاده می‌شود."
      icon={<UserPlus className="h-7 w-7" />}
      footer={
        <p>
          قبلاً ثبت‌نام کردی؟{" "}
          <Link to="/login" className="font-bold text-blue-600 hover:underline dark:text-blue-400">
            وارد شو
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="نام">
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="h-11 rounded-xl" />
          </Field>
          <Field label="نام خانوادگی">
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required className="h-11 rounded-xl" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="شماره دانشجویی">
            <Input inputMode="numeric" value={studentId} onChange={(e) => setStudentId(e.target.value)} required className="h-11 rounded-xl" />
          </Field>
          <Field label="شماره موبایل">
            <Input inputMode="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="h-11 rounded-xl" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="رشته تحصیلی">
            <Input value={major} onChange={(e) => setMajor(e.target.value)} required className="h-11 rounded-xl" />
          </Field>
          <Field label="دانشکده">
            <Select value={facultyId} onValueChange={setFacultyId}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="انتخاب دانشکده" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.id} value={String(faculty.id)}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="ایمیل">
          <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-xl" />
        </Field>

        <Field label="رمز عبور">
          <Input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 rounded-xl" />
        </Field>

        <MailHint compact />

        <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-6 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          بعد از ثبت‌نام، برای ورود باید ایمیل حساب را یک‌بار تأیید کنی.
        </div>

        {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div>}

        <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-xl bg-blue-600 font-bold hover:bg-blue-700">
          {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
          {isLoading ? "در حال ساخت حساب..." : "ساخت حساب"}
        </Button>
      </form>
    </AuthShell>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {children}
  </div>
);

export default Register;
