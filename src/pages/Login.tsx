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
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser({ username, password });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.non_field_errors?.includes("User account is disabled.")) {
          setError("حساب کاربری شما توسط مدیر غیرفعال شده است.");
        } else {
          setError('نام کاربری یا رمز عبور اشتباه است.');
        }
      } else {
        const data = await response.json();
        login(data.auth_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('ارتباط با سرور برقرار نشد.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[800px]"
      >
        <Card className="w-full border-0 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl overflow-hidden">
          
          {/* HEADER */}
          <CardHeader className="text-center p-12 bg-blue-500/10 dark:bg-blue-500/20">
            <div className="mx-auto bg-blue-500 rounded-3xl p-4 inline-block mb-6 shadow-lg">
              <Cloud className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
              ورود به myCloud
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              برای دسترسی به دوره‌ها وارد شوید
            </CardDescription>
          </CardHeader>

          {/* FORM */}
          <CardContent className="p-12 pt-8">
            <form onSubmit={handleSubmit} className="grid gap-8">
              <div className="grid gap-3">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  شماره دانشجویی
                </Label>
                <Input
                  id="username"
                  placeholder="شماره دانشجویی خود را وارد کنید"
                  className="h-14 px-4 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all rounded-xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  رمز عبور
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="رمز عبور خود را وارد کنید"
                  className="h-14 px-4 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-destructive text-center text-sm bg-red-500/10 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-in-out rounded-xl flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? 'در حال ورود...' : 'ورود'}
                {!isLoading && <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
              </Button>
            </form>

            {/* LINKS */}
            <div className="mt-10 flex flex-col items-center gap-3 text-sm text-center">
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                رمز عبور خود را فراموش کرده‌اید؟
              </Link>
              <p className="text-gray-600 dark:text-gray-400">
                حساب کاربری ندارید؟{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-500 hover:underline"
                >
                  ثبت‌نام کنید
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
