import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard on load
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="hero-gradient w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
          <div className="text-white text-2xl font-bold">mc</div>
        </div>
        <h1 className="mb-4 text-2xl font-bold">بارگذاری myCloud...</h1>
        <p className="text-muted-foreground">انتقال به داشبورد</p>
      </div>
    </div>
  );
};

export default Index;
