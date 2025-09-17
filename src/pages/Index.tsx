// src/pages/Index.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // همیشه کاربر را به داشبورد هدایت کن
    navigate("/dashboard");
  }, [navigate]);

  // این صفحه فقط یک لحظه نمایش داده می‌شود
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">در حال بارگذاری...</p>
    </div>
  );
};

export default Index;