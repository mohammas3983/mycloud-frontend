// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- ADDED: Imports for the visit tracking feature ---
import { useEffect } from "react";
import { trackVisit } from "./lib/api";

// Import کردن کامپوننت‌های اصلی
import { AuthProvider } from './contexts/AuthContext';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AllCourses from "./pages/AllCourses";
import AllFaculties from "./pages/AllFaculties";
import Faculty from "./pages/Faculty";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/Profile";
// --- این خط جدید است ---
import ForgotPassword from "./pages/ForgotPassword"; 

const queryClient = new QueryClient();

const App = () => {
  // --- ADDED: Logic to track a visit once per browser session ---
  useEffect(() => {
    // Check if a visit has already been tracked in the current session.
    const hasVisitedInSession = sessionStorage.getItem('site_visited');

    // If not, proceed to track the visit.
    if (!hasVisitedInSession) {
      trackVisit()
        .then(() => {
          // If tracking is successful, set a flag in session storage
          // to prevent tracking again until the user closes the tab/browser.
          sessionStorage.setItem('site_visited', 'true');
        })
        .catch(error => {
          // This is a background task, so if it fails, we don't need to
          // bother the user. We just log it to the console for debugging.
          console.error("Failed to track visit:", error);
        });
    }
  }, []); // The empty dependency array [] ensures this effect runs only ONCE when the app component first mounts.

  return (
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
              {/* --- این خط جدید است --- */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* مسیرهای اصلی برنامه */}
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<AllCourses />} />
              <Route path="/faculties" element={<AllFaculties />} />
              <Route path="/faculty/:facultyId" element={<Faculty />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/about" element={<About />} />
              
              {/* مسیرهای محافظت شده */}
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
};

export default App;