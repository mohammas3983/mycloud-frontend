// src/pages/Register.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ADDED: Import the centralized API function
import { fetchFaculties, registerUser, Faculty } from '@/lib/api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [facultyId, setFacultyId] = useState<string>('');
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFaculties = async () => {
      try {
        const data = await fetchFaculties();
        setFaculties(data);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت لیست دانشکده‌ها");
      }
    };
    loadFaculties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyId) {
      setError("لطفاً دانشکده خود را انتخاب کنید.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        username: studentId,
        password,
        first_name: firstName,
        last_name: lastName,
        email: email || undefined,
        student_id: studentId,
        major,
        phone_number: phoneNumber,
        faculty_id: parseInt(facultyId, 10),
      };

      // CHANGED: Use the centralized API function instead of raw fetch
      const response = await registerUser(payload);

      if (!response.ok) {
        const errorData = await response.json();
        const firstErrorKey = Object.keys(errorData)[0];
        const firstErrorMessage = Array.isArray(errorData[firstErrorKey]) ? errorData[firstErrorKey][0] : errorData[firstErrorKey];
        setError(`${firstErrorKey}: ${firstErrorMessage}` || 'خطایی در ثبت‌نام رخ داد.');
        setIsLoading(false);
        return;
      }

      alert('ثبت‌نام شما با موفقیت انجام شد. لطفاً وارد شوید.');
      navigate('/login');
    } catch (err) {
      setError('ارتباط با سرور برقرار نشد.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 py-12">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">ثبت‌نام در myCloud</CardTitle>
          <CardDescription>برای ساخت حساب کاربری، اطلاعات زیر را وارد کنید</CardDescription>
          <p className="text-xs text-red-600 mt-2">
            ⚠️ توجه: در صورت وارد کردن اطلاعات نادرست، به دلیل سیاست‌های سایت حساب کاربری شما مسدود خواهد شد.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">نام</Label>
                <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">نام خانوادگی</Label>
                <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-id">شماره دانشجویی (نام کاربری شما)</Label>
              <Input id="student-id" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="major">رشته تحصیلی</Label>
                <Input id="major" value={major} onChange={(e) => setMajor(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty">دانشکده</Label>
                <Select onValueChange={setFacultyId} value={facultyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(f => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone-number">شماره موبایل (اجباری)</Label>
              <Input id="phone-number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">ایمیل (اختیاری)</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="underline">از قبل حساب دارید؟ وارد شوید</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
