// src/pages/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { loginUser } from '@/lib/api';
import { motion } from 'framer-motion';
import { Cloud, ArrowRight } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError(null);
    try {
      const response = await loginUser({ username, password });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.non_field_errors?.includes("User account is disabled.")) {
          setError("حساب کاربری شما توسط مدیر غیرفعال شده است.");
        } else { setError('نام کاربری یا رمز عبور اشتباه است.'); }
      } else {
        const data = await response.json();
        login(data.auth_token);
        navigate('/dashboard');
      }
    } catch (err) { setError('ارتباط با سرور برقرار نشد.'); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* --- CHANGED: Card width is now identical to ForgotPassword page --- */}
        <Card className="w-full max-w-md border-0 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl">
          <CardHeader className="text-center p-8">
            <div className="mx-auto bg-blue-500 rounded-2xl p-3 inline-block mb-4">
              <Cloud className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">ورود به myCloud</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 pt-1">برای دسترسی به دوره‌ها وارد شوید</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-600 dark:text-gray-300">شماره دانشجویی</Label>
                <Input
                  id="username"
                  // --- CHANGED: Input style is now identical ---
                  className="h-12 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-colors rounded-xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password"  className="text-sm font-medium text-gray-600 dark:text-gray-300">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  // --- CHANGED: Input style is now identical ---
                  className="h-12 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-colors rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-destructive text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}
              <Button type="submit" className="w-full h-12 text-base font-bold bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-in-out rounded-xl group" disabled={isLoading}>
                {isLoading ? 'در حال ورود...' : (<>ورود <ArrowRight className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" /></>)}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm space-y-2">
              <Link to="/forgot-password" className="text-blue-500 hover:underline">رمز عبور خود را فراموش کرده‌اید؟</Link>
              <p className="text-gray-500 dark:text-gray-400">حساب کاربری ندارید؟{' '}<Link to="/register" className="font-semibold text-blue-500 hover:underline">ثبت‌نام کنید</Link></p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;