// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseCard from "@/components/Dashboard/CourseCard";
import Layout from "@/components/Layout/Layout";
import heroImage from "@/assets/hero-image.jpg";
import { BookOpen, Loader2, GraduationCap, Users, Eye, CalendarDays, BarChart3 } from "lucide-react";
import { 
  fetchFeaturedCourses, 
  fetchSiteStats, 
  SiteStats as SiteStatsType, 
  Course as CourseType 
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

// A small component for individual stat cards
const StatCard = ({ icon: Icon, title, value, isLoading }: { icon: React.ElementType, title: string, value: string | number, isLoading: boolean }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-7 w-1/2" />
      ) : (
        <div className="text-2xl font-bold">{value.toLocaleString('fa-IR')}</div>
      )}
    </CardContent>
  </Card>
);


const Dashboard = () => {
  const { token } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState<CourseType[]>([]);
  const [stats, setStats] = useState<SiteStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      // We need a token to fetch stats, but not for courses
      const promises = [fetchFeaturedCourses()];
      if (token) {
        promises.push(fetchSiteStats(token));
      }
      
      try {
        const [coursesData, statsData] = await Promise.all(promises);
        setFeaturedCourses(coursesData as CourseType[]);
        if (statsData) {
          setStats(statsData as SiteStatsType);
        }
      } catch (err) {
        setError("خطا در دریافت اطلاعات داشبورد.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, [token]);

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section (No Change) */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent text-white -mt-8 -mx-4 sm:-mx-8">
          <div className="absolute inset-0 bg-black/30" />
          <img src={heroImage} alt="University Learning" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"/>
          <div className="relative z-10 p-8 md:p-16 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">به myCloud خوش آمدید</h1>
              <p className="text-xl text-white/90">
                دروازه شما به یادگیری بی‌وقفه. دسترسی به تمام دروس، منابع و مطالب در یک مکان.
              </p>
            </div>
          </div>
        </section>

        {/* --- NEW & IMPROVED STATS SECTION --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Users} title="کل کاربران" value={stats?.total_users ?? 0} isLoading={isLoading} />
          <StatCard icon={Eye} title="بازدید امروز" value={stats?.daily_visits ?? 0} isLoading={isLoading} />
          <StatCard icon={CalendarDays} title="بازدید این هفته" value={stats?.weekly_visits ?? 0} isLoading={isLoading} />
          <StatCard icon={BarChart3} title="کل بازدیدها" value={stats?.total_visits ?? 0} isLoading={isLoading} />
        </section>

        {/* Featured Courses Section (Back to full width) */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">جدیدترین دوره‌های ارائه شده</h2>
            <p className="text-muted-foreground">نگاهی به آخرین دوره‌های اضافه شده به پلتفرم بیندازید.</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive"><p>{error}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={{
                  id: course.id.toString(), title: course.title, description: course.description,
                  code: course.faculty.name, instructor: { name: course.professor.name, avatar: "" },
                  color: '#3b82f6', semester: '', year: 1403, status: 'enrolled', progress: 0, studentsCount: 0,
                  materialsCount: { videos: 0, pdfs: 0, assignments: 0 }
                }} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;