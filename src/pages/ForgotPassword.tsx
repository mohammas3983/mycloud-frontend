// src/pages/ForgotPassword.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { verifyStudentId, generatePasswordQuiz, resetPasswordWithQuiz } from '@/lib/api';
import { Loader2, Cloud, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [studentId, setStudentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const handleNext = () => setDirection(1);
  const handleBack = () => setDirection(-1);

  const slideVariants = {
    initial: (direction: number) => ({ x: `${direction * 100}%`, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: `${direction * -100}%`, opacity: 0 }),
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await verifyStudentId(studentId);
      if (!response.ok) throw new Error();
      handleNext();
      setStep(2);
    } catch (err) {
      setError("کاربری با این شماره دانشجویی یافت نشد.");
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
      handleNext();
      setStep(3);
    } catch (err) {
      setError("شماره موبایل وارد شده صحیح نیست.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedName) {
      setError("لطفا نام خود را انتخاب کنید.");
      return;
    }
    setError(null);
    handleNext();
    setStep(4);
  };
  
  const handleStep4Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await resetPasswordWithQuiz(studentId, selectedName, newPassword);
      if (!response.ok) throw new Error();
      handleNext();
      setStep(5);
    } catch (err) {
      setError("پاسخ شما صحیح نبود. لطفا دوباره تلاش کنید.");
      handleBack();
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl overflow-hidden">
        <div className="text-center p-8 pb-4">
          <div className={`mx-auto rounded-2xl p-3 inline-block mb-4 transition-colors duration-500 ${step === 5 ? 'bg-green-500' : 'bg-blue-500'}`}>
            {step === 5 ? <CheckCircle className="h-8 w-8 text-white" /> : <Cloud className="h-8 w-8 text-white" />}
          </div>
        </div>
        
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
          >
            {step === 1 && (
              <form onSubmit={handleStep1Submit}>
                <CardHeader className="text-center"><CardTitle className="text-2xl font-bold">بازیابی رمز عبور</CardTitle><CardDescription>شماره دانشجویی خود را وارد کنید</CardDescription></CardHeader>
                <CardContent className="p-8 pt-2 space-y-6">
                  <Input placeholder="شماره دانشجویی" className="h-12 text-center bg-gray-100 dark:bg-gray-800 rounded-xl" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                  {error && <p className="text-destructive text-sm text-center">{error}</p>}
                  <Button type="submit" className="w-full h-12 font-bold rounded-xl group" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin"/> : <>ادامه <ArrowRight className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" /></>}</Button>
                </CardContent>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleStep2Submit}>
                <CardHeader className="text-center"><CardTitle className="text-2xl font-bold">تایید هویت</CardTitle><CardDescription>شماره موبایل خود را وارد کنید</CardDescription></CardHeader>
                <CardContent className="p-8 pt-2 space-y-6">
                  <Input placeholder="شماره موبایل" className="h-12 text-center bg-gray-100 dark:bg-gray-800 rounded-xl" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                  {error && <p className="text-destructive text-sm text-center">{error}</p>}
                  <Button type="submit" className="w-full h-12 font-bold rounded-xl group" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin"/> : <>ادامه <ArrowRight className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" /></>}</Button>
                </CardContent>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleStep3Submit}>
                <CardHeader className="text-center"><CardTitle className="text-2xl font-bold">آزمون امنیتی</CardTitle><CardDescription>نام صحیح خود را انتخاب کنید</CardDescription></CardHeader>
                <CardContent className="p-8 pt-2 space-y-6">
                  <RadioGroup value={selectedName} onValueChange={setSelectedName} className="grid gap-3">
                    {quizOptions.map((name, i) => (
                      <div key={i}><RadioGroupItem value={name} id={`r${i}`} className="sr-only" /><Label htmlFor={`r${i}`} className="block w-full p-3 text-center border-2 rounded-xl cursor-pointer transition-colors has-[:checked]:bg-blue-500 has-[:checked]:text-white has-[:checked]:border-blue-500">{name}</Label></div>
                    ))}
                  </RadioGroup>
                  {error && <p className="text-destructive text-sm text-center">{error}</p>}
                  <Button type="submit" className="w-full h-12 font-bold rounded-xl group">ادامه <ArrowRight className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" /></Button>
                </CardContent>
              </form>
            )}

            {step === 4 && (
              <form onSubmit={handleStep4Submit}>
                <CardHeader className="text-center"><CardTitle className="text-2xl font-bold">رمز عبور جدید</CardTitle><CardDescription>یک رمز عبور جدید و قوی انتخاب کنید</CardDescription></CardHeader>
                <CardContent className="p-8 pt-2 space-y-6">
                  <Input placeholder="رمز عبور جدید" type="password" className="h-12 text-center bg-gray-100 dark:bg-gray-800 rounded-xl" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  {error && <p className="text-destructive text-sm text-center">{error}</p>}
                  <Button type="submit" className="w-full h-12 font-bold rounded-xl group" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin"/> : <>تنظیم مجدد رمز <ArrowRight className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" /></>}</Button>
                </CardContent>
              </form>
            )}

            {step === 5 && (
              <div>
                <CardHeader className="text-center"><CardTitle className="text-2xl font-bold text-green-600">انجام شد!</CardTitle><CardDescription>رمز عبور شما با موفقیت تغییر کرد.</CardDescription></CardHeader>
                <CardContent className="p-8 pt-2">
                  <Button asChild className="w-full h-12 font-bold rounded-xl"><Link to="/login">بازگشت به صفحه ورود</Link></Button>
                </CardContent>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default ForgotPassword;