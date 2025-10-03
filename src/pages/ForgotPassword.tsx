// src/pages/ForgotPassword.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { verifyStudentId, generatePasswordQuiz, resetPasswordWithQuiz } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: studentId, 2: phone, 3: quiz, 4: newPassword, 5: success
  const [studentId, setStudentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await verifyStudentId(studentId);
      if (!response.ok) throw new Error("شماره دانشجویی یافت نشد.");
      setStep(2);
    } catch (err) {
      setError("کاربری با این شماره دانشجویی یافت نشد یا غیرفعال است.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await generatePasswordQuiz(studentId, phoneNumber);
      setQuizOptions(data.quiz_options);
      setStep(3);
    } catch (err) {
      setError("شماره موبایل وارد شده با این شماره دانشجویی مطابقت ندارد.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedName) {
        setError("لطفاً یکی از گزینه‌ها را انتخاب کنید.");
        return;
    }
    setError(null);
    // در این مرحله فقط به مرحله بعد می‌رویم
    setStep(4);
  };
  
  const handleStep4Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
        const response = await resetPasswordWithQuiz(studentId, selectedName, newPassword);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "پاسخ آزمون صحیح نبود.");
        }
        setStep(5); // Success step
    } catch (err: any) {
        setError(err.message);
        // اگر پاسخ اشتباه بود به مرحله آزمون برمیگردیم
        setStep(3);
    } finally {
        setIsLoading(false);
    }
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleStep1Submit}>
            <CardHeader>
              <CardTitle>بازیابی رمز عبور</CardTitle>
              <CardDescription>مرحله ۱: شماره دانشجویی خود را وارد کنید.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="studentId">شماره دانشجویی</Label>
                <Input id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : 'ادامه'}</Button>
            </CardContent>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleStep2Submit}>
            <CardHeader>
              <CardTitle>بازیابی رمز عبور</CardTitle>
              <CardDescription>مرحله ۲: شماره موبایلی که با آن ثبت‌نام کرده‌اید را وارد کنید.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">شماره موبایل</Label>
                <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : 'ادامه'}</Button>
            </CardContent>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleStep3Submit}>
            <CardHeader>
              <CardTitle>بازیابی رمز عبور</CardTitle>
              <CardDescription>مرحله ۳: برای تایید هویت، نام و نام خانوادگی صحیح خود را انتخاب کنید.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <RadioGroup value={selectedName} onValueChange={setSelectedName} className="grid gap-2">
                  {quizOptions.map((name, index) => (
                    <div key={index} className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value={name} id={`r${index}`} />
                      <Label htmlFor={`r${index}`}>{name}</Label>
                    </div>
                  ))}
               </RadioGroup>
              <Button type="submit" className="w-full">ادامه</Button>
            </CardContent>
          </form>
        );
    case 4:
        return (
            <form onSubmit={handleStep4Submit}>
                <CardHeader>
                <CardTitle>بازیابی رمز عبور</CardTitle>
                <CardDescription>مرحله نهایی: رمز عبور جدید خود را وارد کنید.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="newPassword">رمز عبور جدید</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : 'تغییر رمز عبور'}</Button>
                </CardContent>
            </form>
        );
    case 5:
        return (
            <>
                <CardHeader>
                    <CardTitle className="text-green-600">موفقیت!</CardTitle>
                    <CardDescription>رمز عبور شما با موفقیت تغییر کرد.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link to="/login">بازگشت به صفحه ورود</Link>
                    </Button>
                </CardContent>
            </>
        )
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="mx-auto max-w-sm w-full">
        {error && <p className="p-4 text-center text-sm text-destructive bg-destructive/10">{error}</p>}
        {renderStep()}
      </Card>
    </div>
  );
};

export default ForgotPassword;