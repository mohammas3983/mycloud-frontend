// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import کردن صفحات
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Faculties from "./pages/Faculties";
import Faculty from "./pages/Faculty";
import Calendar from "./pages/Calendar";
import Resources from "./pages/Resources";
import CourseDetail from "./pages/CourseDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 

// Import کردن AuthProvider
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      {/* AuthProvider کل اپلیکیشن را در بر می‌گیرد */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* مسیرهای عمومی */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* مسیرهای اصلی برنامه */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/faculty/:facultyId" element={<Faculty />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            
            {/* مسیر ۴۰۴ (همیشه آخر باشد) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;