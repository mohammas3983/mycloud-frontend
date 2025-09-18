// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import کردن کامپوننت‌های اصلی
import { AuthProvider } from './contexts/AuthContext';
import Layout from "./components/Layout/Layout"; // اگر Layout شما یک کامپوننت جداست

// Import کردن صفحات
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AllCourses from "./pages/AllCourses"; // صفحه جدید برای لیست همه دوره‌ها
import AllFaculties from "./pages/AllFaculties"; // صفحه جدید برای لیست همه دانشکده‌ها
import Faculty from "./pages/Faculty"; // این صفحه برای نمایش دوره‌های یک دانشکده خاص است
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

import ProfilePage from "./pages/Profile";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* مسیرهای عمومی */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* مسیرهای اصلی برنامه */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<AllCourses />} />
            <Route path="/faculties" element={<AllFaculties />} />
            <Route path="/faculty/:facultyId" element={<Faculty />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/about" element={<About />} />
            
            {/* مسیر پنل مدیریت (مخصوص سرپرست) */}
            <Route path="/admin-panel" element={<AdminPanel />} />
            
           <Route path="/profile" element={<ProfilePage />} />
           <Route path="/admin-panel" element={<AdminPanel />} />
        
            {/* مسیر ۴۰۴ (همیشه آخر باشد) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;