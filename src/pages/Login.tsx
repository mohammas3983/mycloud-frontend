// src/pages/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
// ADDED: Import the centralized API function
import { loginUser } from '@/lib/api';

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
      // CHANGED: Use the centralized API function instead of raw fetch
      const response = await loginUser({ username, password });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.non_field_errors && errorData.non_field_errors.includes("User account is disabled.")) {
            setError("حساب کاربری شما توسط مدیر غیرفعال شده است.");
        } else {
            setError('  نام کاربری یا رمز عبور اشتباه است یا حساب کاربری شما به دلیل وارد کردن اطلاعات اشتباه مسدود شده.');
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      login(data.auth_token);
      navigate('/dashboard');
      
    } catch (err) {
      setError('ارتباط با سرور برقرار نشد.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">ورود</CardTitle>
          <CardDescription>برای ورود به حساب کاربری خود، اطلاعات زیر را وارد کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2"><Label htmlFor="username">شماره دانشجویی (نام کاربری)</Label><Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
            <div className="grid gap-2"><Label htmlFor="password">رمز عبور</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'در حال ورود...' : 'ورود'}</Button>
          </form>
          <div className="mt-4 text-center text-sm"><Link to="/register" className="underline">حساب کاربری ندارید؟ ثبت‌نام کنید</Link></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;